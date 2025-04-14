import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  // Ensure we get the session for both GET and POST requests
  const session = await getSession({ req });
  
  if (!session) {
    console.log("No session found:", req.method, req.url);
    return res.status(401).json({ error: "You must be signed in to access this endpoint" });
  }
  
  console.log("Session found, user:", session.user.username || session.user.name);
  
  const { mediaId } = req.query;
  
  if (!mediaId) {
    return res.status(400).json({ error: "Media ID is required" });
  }
  
  try {
    const { accessToken } = session.user;
    
    if (!accessToken) {
      console.error("No access token found in session");
      return res.status(401).json({ error: "Instagram access token not available" });
    }
    
    // For GET requests, fetch comments
    if (req.method === "GET") {
      console.log("Fetching comments for media:", mediaId);
      
      const response = await fetch(
        `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?fields=id,text,timestamp,username,replies{id,text,timestamp,username}&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Instagram API error:", response.status, errorText);
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.status(200).json(data);
    }
    
    // For POST requests, add a comment
    else if (req.method === "POST") {
      const { text, replied_to_comment_id } = req.body;
      
      console.log("Adding comment to media:", mediaId, "Text:", text);
      
      if (!text) {
        return res.status(400).json({ error: "Comment text is required" });
      }
      
      // Construct the URL - add replied_to_comment_id parameter if replying to a comment
      let url = `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?access_token=${accessToken}`;
      
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
        console.error("Error posting comment:", response.status, errorData);
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.status(201).json(data);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error with comments:", error);
    res.status(500).json({ error: "Failed to process comments", details: error.message });
  }
}