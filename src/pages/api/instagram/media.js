import { getSession } from "next-auth/react";

export default async function handler(req, res) {

    try {
      const session = await getSession({ req });
      
        if (!session) {
          return res.status(401).json({ error: "You must be signed in to access this endpoint" });
        }
        
        const { accessToken, userId } = session.user;
      
      // Check for pagination
      const { after } = req.query;
      
      // Construct URL to fetch media
      let mediaUrl = `${process.env.INSTAGRAM_API_URL}/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username,comments_count,like_count,children{id,media_type,media_url,thumbnail_url}&access_token=${accessToken}`;
      
      if (after) {
        mediaUrl += `&after=${after}`;
      }
      
      // Fetch media from Instagram
      const mediaResponse = await fetch(mediaUrl);
      
      if (!mediaResponse.ok) {
        const errorData = await mediaResponse.json();
        console.error('Error fetching media from Instagram:', errorData);
        return res.status(mediaResponse.status).json({
          error: 'Failed to fetch media from Instagram',
          details: errorData
        });
      }
      
      const mediaData = await mediaResponse.json();
      
      // Return the media data
      return res.status(200).json(mediaData);
    } catch (error) {
      console.error('Error in media endpoint:', error);
      return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }