import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "You must be signed in to access this endpoint" });
  }

  try {
    const { accessToken, userId } = session.user;
    const { after } = req.query; // For pagination

    // Build the URL with pagination if needed and include comments_count and like_count fields
    let url = `${process.env.INSTAGRAM_API_URL}/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,comments_count,like_count,children{id,media_type,media_url,thumbnail_url}&access_token=${accessToken}`;
    
    if (after) {
      url += `&after=${after}`;
    }

    console.log(`Fetching media from URL: ${url.replace(accessToken, 'HIDDEN_TOKEN')}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Instagram API error:", response.status, errorText);
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Received ${data?.data?.length || 0} media items`);
    
    if (data?.data?.length > 0) {
      // Log the first item's structure for debugging
      const sampleItem = {...data.data[0]};
      delete sampleItem.media_url; // Don't log the full media URL
      console.log("Sample media item structure:", JSON.stringify(sampleItem));
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Failed to fetch media data", details: error.message });
  }
}