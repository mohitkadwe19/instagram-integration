// This endpoint returns safe environment variables for debugging
export default function handler(req, res) {
    // Only return non-sensitive environment variables or boolean flags
    res.status(200).json({
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      INSTAGRAM_API_URL: process.env.INSTAGRAM_API_URL,
      INSTAGRAM_CLIENT_ID: !!process.env.INSTAGRAM_CLIENT_ID, // Just return if it's set, not the value
      INSTAGRAM_CLIENT_SECRET: !!process.env.INSTAGRAM_CLIENT_SECRET, // Just return if it's set, not the value
      DEBUG_MODE: !!process.env.NEXTAUTH_DEBUG
    });
  }