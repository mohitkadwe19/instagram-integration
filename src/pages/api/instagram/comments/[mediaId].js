import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "You must be signed in to access this endpoint" });
  }

  try {
    const { accessToken } = session.user;

    const { mediaId } = req.query;
    const { after } = req.query; // For pagination
    
    if (!mediaId) {
      return res.status(400).json({ error: "Media ID is required" });
    }
    
    if (!accessToken) {
      console.error("No access token found in token");
      return res.status(401).json({ error: "Instagram access token not available" });
    }

    console.log(`Fetching comments for media: ${mediaId}${after ? ' with pagination' : ''}`);
    
    // First, check if the media exists and has comments_count
    const mediaUrl = `${process.env.INSTAGRAM_API_URL}/${mediaId}?fields=id,comments_count&access_token=${accessToken}`;
    
    try {
      const mediaResponse = await fetch(mediaUrl);
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        console.log(`Media ${mediaId} has comments_count:`, mediaData.comments_count);
        
        if (mediaData.comments_count === 0) {
          // If Instagram indicates there are no comments, return early
          console.log(`No comments available for media ${mediaId} according to comments_count`);
          return res.status(200).json({
            data: [],
            paging: {}
          });
        }
      }
    } catch (mediaError) {
      console.warn(`Could not fetch media info for ${mediaId}:`, mediaError.message);
      // Continue anyway to try fetching comments directly
    }
    
    // Construct the URL with pagination if provided
    let url = `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?fields=id,text,timestamp,username,replies{id,text,timestamp,username}&access_token=${accessToken}`;
    
    if (after) {
      url += `&after=${after}`;
    }
    
    console.log(`Fetching comments from URL: ${url.replace(accessToken, 'HIDDEN_TOKEN')}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Instagram API error:", response.status, errorText);
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received ${data?.data?.length || 0} comments for media: ${mediaId}`);
    
    // Add detailed logging for the response structure
    console.log("Comments API response structure:", JSON.stringify({
      hasData: !!data.data,
      dataType: data.data ? typeof data.data : null,
      isArray: Array.isArray(data.data),
      dataLength: data.data?.length,
      hasPaging: !!data.paging,
      pagingStructure: data.paging ? Object.keys(data.paging) : null
    }));
    
    // Validate and transform the response if needed
    if (!data.data && !data.error) {
      // If Instagram returns an unexpected structure, try to normalize it
      if (Array.isArray(data)) {
        // If it's an array, wrap it in the expected object structure
        console.log("Normalizing comments array response");
        return res.status(200).json({
          data: data,
          paging: data.paging || {}
        });
      } else {
        console.warn("Unexpected response structure from Instagram API:", JSON.stringify(data).substring(0, 200));
        // Return empty array with proper structure
        return res.status(200).json({
          data: [],
          paging: {}
        });
      }
    }
    
    // If data.data is empty but we expect comments based on media metadata,
    // provide diagnostic information about the mismatch
    if (data.data && data.data.length === 0) {
      console.log(`Media ${mediaId} expected to have comments but none returned from API.`);
      // You could implement a fallback strategy here
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments", details: error.message });
  }
}