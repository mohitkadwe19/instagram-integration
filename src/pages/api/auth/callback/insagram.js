export default async function handler(req, res) {
    // Extract the code from query parameters
    const { code, error, error_reason, error_description } = req.query;
  
    // If there's an error from Instagram
    if (error) {
      console.error('Instagram authorization error:', { error, error_reason, error_description });
      return res.redirect(`/auth/error?error=${encodeURIComponent(error_reason || error)}&message=${encodeURIComponent(error_description || 'Authorization failed')}`);
    }
  
    // If no code is provided
    if (!code) {
      return res.redirect('/auth/error?error=missing_code&message=No authorization code was provided');
    }
  
    // Forward to our handler
    return res.redirect(`/api/auth/handle-callback?code=${code}`);
  }