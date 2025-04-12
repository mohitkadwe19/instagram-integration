import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  // Only allow POST requests for replying to comments
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "You must be signed in to access this endpoint" });
  }

  const { mediaId } = req.query;
  const { text, commentId } = req.body;

  if (!text || !commentId) {
    return res.status(400).json({ error: "Comment text and parent comment ID are required" });
  }

  try {
    const { accessToken } = session.user;

    // Post a reply to a specific comment
    const response = await fetch(
      `${process.env.INSTAGRAM_API_URL}/${mediaId}/comments?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          replied_to_comment_id: commentId,
        }),
      }
    );

    console.error("Response status:", response);

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(201).json(data);
  } catch (error) {
    console.error("Error posting reply:", error);
    res.status(500).json({ error: "Failed to post reply", details: error.message });
  }
}