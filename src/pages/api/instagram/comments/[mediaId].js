import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Get the token from the request
    const token = await getToken({ req });
    
    if (!token) {
      console.log("No token found for fetching comments");
      return res.status(401).json({ error: "You must be signed in to access this endpoint" });
    }
    
    const { mediaId } = req.query;
    const { after } = req.query; // For pagination
    
    if (!mediaId) {
      return res.status(400).json({ error: "Media ID is required" });
    }
    
    const accessToken = token.accessToken;
    
    if (!accessToken) {
      console.error("No access token found in token");
      return res.status(401).json({ error: "Instagram access token not available" });
    }

    console.log(`Fetching comments for media: ${mediaId}${after ? ' with pagination' : ''}`);
    
    // Construct the URL with pagination if provided
    let url = `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?fields=id,text,timestamp,username,replies{id,text,timestamp,username}&access_token=${accessToken}`;
    
    if (after) {
      url += `&after=${after}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Instagram API error:", response.status, errorText);
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments", details: error.message });
  }
}