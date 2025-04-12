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
  
    try {
      console.log("Received Instagram code, exchanging for token");
      
      // Base URL from environment or request
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     (req.headers.host?.includes('localhost') 
                       ? `http://${req.headers.host}`
                       : `https://${req.headers.host}`);
                       
      // Prepare the redirect URI - must match what was used in authorization
      const redirectUri = `${baseUrl}/api/auth/callback/instagram-direct`;
      
      // Exchange the code for an access token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code,
        }),
      });
  
      const tokenData = await tokenResponse.json();
      console.log('Token response:', tokenData);
  
      if (tokenData.error_type || !tokenData.access_token) {
        console.error('Error exchanging code for token:', tokenData);
        return res.redirect(`/auth/error?error=${encodeURIComponent(tokenData.error_message || 'token_exchange_failed')}`);
      }
  
      // Get the long-lived token
      const longLivedTokenResponse = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`);
      const longLivedTokenData = await longLivedTokenResponse.json();
      console.log('Long-lived token response:', longLivedTokenData);
  
      const accessToken = longLivedTokenData.access_token || tokenData.access_token;
      const userId = tokenData.user_id;
  
      // Get the user profile using the token
      const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
      const userData = await userResponse.json();
      console.log('User profile data:', userData);
  
      if (userData.error) {
        console.error('Error fetching user profile:', userData);
        return res.redirect(`/auth/error?error=${encodeURIComponent(userData.error.message || 'profile_fetch_failed')}`);
      }
  
      // Store the user data and token in a session cookie
      const sessionData = {
        accessToken: accessToken,
        userId: userId,
        username: userData.username || 'instagramuser',
        id: userData.id,
        accountType: userData.account_type,
        mediaCount: userData.media_count,
      };
      
      // Store in a cookie - this is a more reliable approach than relying on NextAuth cookies
      res.setHeader('Set-Cookie', `instagram_session=${JSON.stringify(sessionData)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
      
      // Redirect to success page
      return res.redirect(`/auth/success?username=${encodeURIComponent(userData.username || 'instagramuser')}`);
    } catch (error) {
      console.error('Error handling callback:', error);
      return res.redirect(`/auth/error?error=${encodeURIComponent('internal_server_error')}`);
    }
  }