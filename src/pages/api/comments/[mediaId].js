import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "You must be signed in to access this endpoint" });
  }

  const { mediaId } = req.query;

  try {
    const { accessToken } = session.user;

    // For GET requests, fetch comments
    if (req.method === "GET") {
      const response = await fetch(
        `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?fields=id,text,timestamp,username,replies{id,text,timestamp,username}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } 
    // For POST requests, add a comment
    else if (req.method === "POST") {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Comment text is required" });
      }

      const response = await fetch(
        `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?access_token=${accessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        }
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.statusText}`);
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