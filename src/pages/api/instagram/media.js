export default async function handler(req, res) {
    // Add CORS headers for development
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      // Extract session data from cookie
      const { instagram_session } = req.cookies;
      
      if (!instagram_session) {
        return res.status(401).json({ error: 'Unauthorized - No session found' });
      }
      
      // Parse session data
      const sessionData = JSON.parse(instagram_session);
      const { accessToken, userId } = sessionData;
      
      if (!accessToken || !userId) {
        return res.status(401).json({ error: 'Unauthorized - Invalid session data' });
      }
      
      // Check for pagination
      const { after } = req.query;
      
      // Construct URL to fetch media
      let mediaUrl = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username,comments_count,like_count,children{id,media_type,media_url,thumbnail_url}&access_token=${accessToken}`;
      
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