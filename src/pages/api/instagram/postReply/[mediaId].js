import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Get the token from the request
    const token = await getToken({ req });
    
    if (!token) {
      console.log("No token found for posting reply");
      return res.status(401).json({ error: "You must be signed in to access this endpoint" });
    }
    
    const { mediaId, commentId } = req.query;
    const { text } = req.body;
    
    if (!mediaId) {
      return res.status(400).json({ error: "Media ID is required" });
    }
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: "Reply text is required" });
    }
    
    const accessToken = token.accessToken;
    
    if (!accessToken) {
      console.error("No access token found in token");
      return res.status(401).json({ error: "Instagram access token not available" });
    }

    console.log(`Posting reply to ${commentId ? 'comment: ' + commentId : 'media: ' + mediaId}`);
    
    // Base URL for posting a comment to the media
    let url = `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?access_token=${accessToken}`;
    
    // If a comment ID is provided, we're replying to a specific comment
    // Note: Instagram Graph API doesn't directly support replying to comments
    // Instead, it treats all comments as top-level, but we can include a mention
    // of the original commenter in the reply
    
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error posting reply:", response.status, errorData);
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return success response with the new comment data
    res.status(201).json({ 
      success: true, 
      comment: data,
      mediaId,
      commentId: commentId || null
    });
  } catch (error) {
    console.error("Error posting reply:", error);
    res.status(500).json({ error: "Failed to post reply", details: error.message });
  }
}