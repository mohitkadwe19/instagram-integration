import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: "You must be signed in to access this endpoint" });
    }

    // Make sure we have the required token and user ID
    if (!session.user?.accessToken || !session.user?.userId) {
      console.error("Missing required session data:", { 
        hasAccessToken: Boolean(session.user?.accessToken),
        hasUserId: Boolean(session.user?.userId) 
      });
      return res.status(400).json({ error: "Missing required authentication data" });
    }

    const { accessToken, userId } = session.user;

    try {
      // Fetch more detailed profile information
      const response = await fetch(
        `${process.env.INSTAGRAM_API_URL}/${userId}?fields=id,username,profile_picture_url,account_type,media_count&access_token=${accessToken}`
      );

      if (!response.ok) {
        // Get more detailed error info
        const errorText = await response.text();
        console.error("Instagram API error response:", errorText);
        
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // If we didn't get an ID back, something is wrong
      if (!data.id) {
        throw new Error("Invalid profile data received");
      }
      
      res.status(200).json(data);
    } catch (apiError) {
      console.error("Error fetching profile from Instagram API:", apiError);
      res.status(500).json({ error: "Failed to fetch profile data from Instagram", details: apiError.message });
    }
  } catch (error) {
    console.error("Unhandled error in profile API route:", error);
    res.status(500).json({ error: "An unexpected error occurred", details: error.message });
  }
}