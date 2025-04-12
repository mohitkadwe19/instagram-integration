import NextAuth from "next-auth";

// Special handler for Instagram webhook verification
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, // This tells Next.js that this route is handled by an external resolver
  },
};

// Custom handler to deal with both authentication and webhook verification
export default async function auth(req, res) {
  // Add CORS headers for ngrok
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if this is a webhook verification request
  if (
    req.method === "GET" &&
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.challenge"]
  ) {
    console.log("Webhook verification request received");
    // Return the challenge to verify the webhook
    return res.status(200).send(req.query["hub.challenge"]);
  }

  // Regular NextAuth flow
  return await NextAuth(req, res, {
    providers: [
      {
        id: "instagram",
        name: "Instagram",
        type: "oauth",
        authorization: {
          url: "https://www.facebook.com/v19.0/dialog/oauth",
          params: {
            scope: "user_profile,user_media",
            response_type: "code",
          },
        },
        token: "https://graph.facebook.com/v19.0/oauth/access_token",
        userinfo: {
          url: `${process.env.INSTAGRAM_API_URL}/me`,
          async request({ client, tokens }) {
            try {
              console.log("Fetching user info with token:", tokens.access_token);
              // Get user ID and username
              const userResponse = await fetch(
                `${process.env.INSTAGRAM_API_URL}/me?fields=id,username&access_token=${tokens.access_token}`
              );
              
              if (!userResponse.ok) {
                console.error("Instagram API error:", await userResponse.text());
                throw new Error(`Instagram API error: ${userResponse.statusText}`);
              }
              
              const userData = await userResponse.json();
              console.log("User data:", userData);
              
              // Get more profile details if available
              try {
                const profileResponse = await fetch(
                  `${process.env.INSTAGRAM_API_URL}/${userData.id}?fields=id,username,account_type,media_count&access_token=${tokens.access_token}`
                );
                
                if (profileResponse.ok) {
                  const profile = await profileResponse.json();
                  console.log("Profile data:", profile);
                  return {
                    id: profile.id,
                    username: profile.username,
                    account_type: profile.account_type,
                    media_count: profile.media_count,
                    access_token: tokens.access_token,
                    name: profile.username, // Required for NextAuth
                  };
                }
              } catch (profileError) {
                console.error("Error fetching detailed profile:", profileError);
              }
              
              // Fallback to basic user information
              return {
                id: userData.id,
                username: userData.username,
                name: userData.username, // Required for NextAuth
                access_token: tokens.access_token,
              };
            } catch (error) {
              console.error("Error in userinfo request:", error);
              throw error;
            }
          },
        },
        clientId: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        profile(profile) {
          return {
            id: profile.id,
            name: profile.username,
            email: null,
            image: null,
          };
        },
      },
    ],
    callbacks: {
      async jwt({ token, user, account }) {
        console.log("JWT callback - user:", user);
        console.log("JWT callback - account:", account);
        // Initial sign in
        if (account && user) {
          return {
            ...token,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            username: user.username,
            accountType: user.account_type,
            mediaCount: user.media_count,
            userId: user.id,
          };
        }
        return token;
      },
      async session({ session, token }) {
        console.log("Session callback - token:", token);
        session.user = {
          ...session.user,
          username: token.username || session.user.name,
          accessToken: token.accessToken,
          accountType: token.accountType,
          mediaCount: token.mediaCount,
          userId: token.userId || token.sub,
        };
        return session;
      },
      async redirect({ url, baseUrl }) {
        // Use the NEXT_PUBLIC_BASE_URL if available, otherwise use the baseUrl
        const effectiveBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || baseUrl;
        
        // Allow redirects to the same host
        if (url.startsWith(effectiveBaseUrl)) {
          return url;
        }
        
        // Check if the URL is a relative URL
        if (url.startsWith("/")) {
          return `${effectiveBaseUrl}${url}`;
        }
        
        // Default redirect to base URL
        return effectiveBaseUrl;
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    debug: true, // Enable debug mode
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
      // Add more secure cookie settings
      state: {
        name: "next-auth.state",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
  });
}