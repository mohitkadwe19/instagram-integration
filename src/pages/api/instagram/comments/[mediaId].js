import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "You must be signed in to access this endpoint" });
  }

  try {
    const { accessToken } = session.user;
    const { userId } = session.user;

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
    // Using graph.instagram.com directly as per Instagram API documentation
    const mediaUrl = `https://graph.instagram.com/v22.0/${mediaId}?fields=id,comments_count,caption&access_token=${accessToken}`;
    
    let expectedCommentsCount = 0;
    let commentsList = [];
    
    try {
      console.log(`Checking media metadata from: ${mediaUrl.replace(accessToken, 'ACCESS_TOKEN_HIDDEN')}`);
      const mediaResponse = await fetch(mediaUrl);
      
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        console.log(`Media ${mediaId} API response:`, JSON.stringify(mediaData));
        
        expectedCommentsCount = mediaData.comments_count || 0;
        console.log(`Media ${mediaId} has comments_count:`, expectedCommentsCount);
        
        // Early return if no comments
        if (expectedCommentsCount === 0) {
          console.log(`No comments available for media ${mediaId} according to comments_count`);
          return res.status(200).json({
            data: [],
            paging: {}
          });
        }
      } else {
        const errorText = await mediaResponse.text();
        console.error(`Media info fetch error (${mediaResponse.status}):`, errorText);
      }
    } catch (mediaError) {
      console.warn(`Could not fetch media info for ${mediaId}:`, mediaError.message);
    }
    
    // APPROACH 1: Direct comment fetch using graph.instagram.com as per docs
    let commentsUrl = `https://graph.instagram.com/v22.0/${mediaId}/comments`;
    
    // Add fields parameter per documentation
    const fields = "id,text,timestamp,username,replies{id,text,timestamp,username}";
    commentsUrl += `?fields=${fields}&access_token=${accessToken}`;
    
    if (after) {
      commentsUrl += `&after=${after}`;
    }
    
    console.log(`Fetching comments from: ${commentsUrl.replace(accessToken, 'ACCESS_TOKEN_HIDDEN')}`);
    
    try {
      const response = await fetch(commentsUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Comments API error (${response.status}):`, errorText);
        
        // Don't throw error immediately, try other approaches
      } else {
        const data = await response.json();
        console.log(`Direct approach: Received ${data?.data?.length || 0} comments for media: ${mediaId}`);
        
        if (data?.data?.length > 0) {
          // If we got comments, return them
          return res.status(200).json({
            ...data,
            _meta: {
              expectedCount: expectedCommentsCount,
              approach: "direct"
            }
          });
        }
        
        // Store for potential fallback
        commentsList = data?.data || [];
      }
    } catch (directError) {
      console.error("Direct comments fetch error:", directError.message);
    }
    
    // APPROACH 2: For business accounts, try the Instagram Graph API format
    try {
      // For business/creator accounts, the format might be slightly different
      const businessUrl = `https://graph.facebook.com/v22.0/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`;
      
      console.log(`Trying business API approach: ${businessUrl.replace(accessToken, 'ACCESS_TOKEN_HIDDEN')}`);
      const businessResponse = await fetch(businessUrl);
      
      if (businessResponse.ok) {
        const businessData = await businessResponse.json();
        console.log(`Business approach: Received ${businessData?.data?.length || 0} comments`);
        
        if (businessData?.data?.length > 0) {
          return res.status(200).json({
            ...businessData,
            _meta: {
              expectedCount: expectedCommentsCount,
              approach: "business"
            }
          });
        }
      }
    } catch (businessError) {
      console.error("Business API approach failed:", businessError.message);
    }
    
    // APPROACH 3: Fetch via user media edge as you implemented before
    try {
      const userMediaUrl = `https://graph.instagram.com/v22.0/${userId}/media?fields=id,comments{${fields}}&access_token=${accessToken}`;
      
      console.log(`Trying user media approach: ${userMediaUrl.replace(accessToken, 'ACCESS_TOKEN_HIDDEN')}`);
      const userMediaResponse = await fetch(userMediaUrl);
      
      if (userMediaResponse.ok) {
        const userMediaData = await userMediaResponse.json();
        
        // Find matching media
        if (userMediaData?.data) {
          const targetMedia = userMediaData.data.find(item => item.id === mediaId);
          
          if (targetMedia?.comments?.data?.length > 0) {
            console.log(`User media approach: Found ${targetMedia.comments.data.length} comments`);
            
            return res.status(200).json({
              data: targetMedia.comments.data,
              paging: targetMedia.comments.paging || {},
              _meta: {
                expectedCount: expectedCommentsCount,
                approach: "user_media"
              }
            });
          }
        }
      }
    } catch (userMediaError) {
      console.error("User media approach failed:", userMediaError.message);
    }
    
    // If we got this far, we couldn't find comments using any approach
    // Return best data we have (might be empty array)
    console.log(`Returning ${commentsList.length} comments from fallback (expected ${expectedCommentsCount})`);
    
    return res.status(200).json({
      data: commentsList,
      paging: {},
      _meta: {
        expectedCount: expectedCommentsCount,
        approach: "fallback",
        message: expectedCommentsCount > 0 ? 
          "Comments count shows comments exist but they could not be retrieved" : 
          "No comments found"
      }
    });
    
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments", details: error.message });
  }
}
