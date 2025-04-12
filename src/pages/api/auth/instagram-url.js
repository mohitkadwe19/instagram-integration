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

    console.log('Base URL:', baseUrl);
    console.log('Redirect URI:', redirectUri);
    console.log('Client ID:', clientId);
    
    const url = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list&response_type=code`;
    
    console.log('Generated Instagram Auth URL:', url);
    
    // Return the URL
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating Instagram URL:', error);
    res.status(500).json({ error: 'Failed to generate Instagram authorization URL' });
  }
}