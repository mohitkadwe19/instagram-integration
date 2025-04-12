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
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`;

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

    // Get the long-lived token (valid for 60 days)
    const longLivedTokenResponse = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`);
    const longLivedTokenData = await longLivedTokenResponse.json();
    console.log('Long-lived token response:', longLivedTokenData);

    const accessToken = longLivedTokenData.access_token || tokenData.access_token;
    const userId = tokenData.user_id;

    // Get extensive user profile data using business fields
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count,profile_picture_url,biography,website,followers_count,follows_count,name&access_token=${accessToken}`
    );
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
      username: userData.username,
      id: userData.id,
      accountType: userData.account_type,
      mediaCount: userData.media_count,
      profilePictureUrl: userData.profile_picture_url,
      biography: userData.biography,
      website: userData.website,
      followersCount: userData.followers_count,
      followsCount: userData.follows_count,
      name: userData.name,
      tokenExpires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    };
    
    // Store in a cookie
    res.setHeader('Set-Cookie', `instagram_session=${JSON.stringify(sessionData)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=5184000`); // 60 days
    
    // Redirect to success page
    return res.redirect(`/auth/success?username=${encodeURIComponent(userData.username)}`);
  } catch (error) {
    console.error('Error handling callback:', error);
    return res.redirect(`/auth/error?error=${encodeURIComponent('internal_server_error')}`);
  }
}