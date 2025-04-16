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

    // Build the URL with pagination if needed
    let url = `${process.env.INSTAGRAM_API_URL}/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,children{id,media_type,media_url,thumbnail_url}&access_token=${accessToken}`;
    
    if (after) {
      url += `&after=${after}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Failed to fetch media data", details: error.message });
  }
}