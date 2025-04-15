import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "You must be signed in to access this endpoint" });
  }

  try {

    const { accessToken } = session.user;
    
    if (!accessToken) {
      console.log("No access token found for posting reply");
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
    
    if (!accessToken) {
      console.error("No access token found in token");
      return res.status(401).json({ error: "Instagram access token not available" });
    }

    console.log(`Posting reply to ${commentId ? 'comment: ' + commentId : 'media: ' + mediaId}`);
    
    // Base URL for posting a comment to the media
    let url = `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?access_token=${accessToken}`;

    
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text, additionalParam: "value" }),
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