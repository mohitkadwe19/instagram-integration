export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;

  if (!code) {
    return res.redirect(`/auth/error?error=${encodeURIComponent('authorization_code_missing')}`);
  }

  try {
    // Get the redirect URI - must match exactly what was used in authorization
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/instagram`;

    // Exchange the code for an access token - using Instagram Basic Display API
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
    const longLivedTokenResponse = await fetch(`https://graph.facebook.com/v19.0/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`);
    const longLivedTokenData = await longLivedTokenResponse.json();
    console.log('Long-lived token response:', longLivedTokenData);

    const accessToken = longLivedTokenData.access_token || tokenData.access_token;
    const userId = tokenData.user_id;

    // Get the user profile using the token
    const userResponse = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
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
    
    // Store in a cookie
    res.setHeader('Set-Cookie', `instagram_session=${JSON.stringify(sessionData)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
    
    // Redirect to success page
    return res.redirect(`/auth/success?username=${encodeURIComponent(userData.username || 'instagramuser')}`);
  } catch (error) {
    console.error('Error handling callback:', error);
    return res.redirect(`/auth/error?error=${encodeURIComponent('internal_server_error')}`);
  }
}