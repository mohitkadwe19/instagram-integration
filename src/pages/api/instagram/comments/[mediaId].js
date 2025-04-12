export default async function handler(req, res) {
  // Add CORS headers for development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract session data from cookie
  const { instagram_session } = req.cookies;
  
  if (!instagram_session) {
    // If no session cookie, check for environment variable as fallback
    if (process.env.INSTAGRAM_ACCESS_TOKEN) {
      // Use the environment variable
      accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    } else {
      return res.status(401).json({ error: 'Unauthorized - No session found' });
    }
  } else {
    // Parse session data from cookie
    try {
      const sessionData = JSON.parse(instagram_session);
      accessToken = sessionData.accessToken;
      
      if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized - Invalid session data' });
      }
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid session format' });
    }
  }  
  
  // Parse session data
  const sessionData = JSON.parse(instagram_session);
  const { accessToken } = sessionData;
  
  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized - Invalid session data' });
  }

  // Get media ID from the URL
  const { mediaId } = req.query;
  
  
  if (!mediaId) {
    return res.status(400).json({ error: 'Media ID is required' });
  }

  try {
    // GET: Fetch comments for a media item
    if (req.method === 'GET') {
      // Check for pagination
      const { after } = req.query;
      
      // Construct URL to fetch comments
      let commentsUrl = `https://graph.facebook.com/v18.0/${mediaId}/comments?fields=id,text,timestamp,username,like_count,replies{id,text,timestamp,username,like_count}&access_token=${accessToken}`;
      
      if (after) {
        commentsUrl += `&after=${after}`;
      }
      
      // Fetch comments from Instagram
      const commentsResponse = await fetch(commentsUrl);
      
      if (!commentsResponse.ok) {
        const errorData = await commentsResponse.json();
        console.error('Error fetching comments from Instagram:', errorData);
        return res.status(commentsResponse.status).json({
          error: 'Failed to fetch comments from Instagram',
          details: errorData
        });
      }
      
      const commentsData = await commentsResponse.json();

      console.log('Fetched comments data:', commentsData);
      
      // Return the comments data
      return res.status(200).json(commentsData);
    }
    
    // POST: Add a comment to a media item
    if (req.method === 'POST') {
      const { text, replied_to_comment_id } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Comment text is required' });
      }
      
      // Construct URL to post a comment
      let commentUrl = `https://graph.facebook.com/v18.0/${mediaId}/comments`;
      
      // Prepare payload
      const payload = new URLSearchParams();
      payload.append('message', text);
      payload.append('access_token', accessToken);
      
      // Add reply parent comment ID if replying
      if (replied_to_comment_id) {
        payload.append('replied_to_comment_id', replied_to_comment_id);
      }
      
      // Post comment to Instagram
      const commentResponse = await fetch(commentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload
      });
      
      if (!commentResponse.ok) {
        const errorData = await commentResponse.json();
        console.error('Error posting comment to Instagram:', errorData);
        return res.status(commentResponse.status).json({
          error: 'Failed to post comment to Instagram',
          details: errorData
        });
      }
      
      const commentData = await commentResponse.json();
      
      // Return the comment data
      return res.status(201).json(commentData);
    }
    
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in comments endpoint:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}