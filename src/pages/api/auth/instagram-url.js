export default function handler(req, res) {
  try {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    
    // Base URL from environment or fallback to request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (req.headers.host?.includes('localhost') 
                     ? `http://${req.headers.host}`
                     : `https://${req.headers.host}`);
                     
    // Redirect URI for Instagram callback
    const redirectUri = `${baseUrl}/api/auth/callback/instagram`;
    
    // Construct the Instagram Basic Display authorization URL (not Graph API)
    const url = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;
    
    console.log('Generated Instagram Auth URL:', url);
    
    // Return the URL
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating Instagram URL:', error);
    res.status(500).json({ error: 'Failed to generate Instagram authorization URL' });
  }
}