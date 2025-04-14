import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "You must be signed in to access this endpoint" });
  }

  try {
    const { accessToken, userId } = session.user;

    // Fetch more detailed profile information
    const response = await fetch(
      `${process.env.INSTAGRAM_API_URL}/${userId}?fields=id,username,biography,website,followers_count,follows_count,bio,website,profile_picture_url,account_type,media_count&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile data", details: error.message });
  }
}