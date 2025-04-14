import NextAuth from "next-auth";
import InstagramProvider from "next-auth/providers/instagram";

export default async function auth(req, res) {
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
      InstagramProvider({
        clientId: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        client: {
          token_endpoint_auth_method: "client_secret_post",
        },
        authorization: {
          url: "https://api.instagram.com/oauth/authorize",
          params: {
            scope:
              "instagram_business_basic,instagram_business_content_publish,instagram_business_manage_comments,instagram_business_manage_messages",
            response_type: "code",
          },
        },
        token: "https://api.instagram.com/oauth/access_token",
        userinfo: {
          url: "https://graph.instagram.com/me?fields=id,username,account_type,media_count",
        },
        profile(profile) {
          console.log("Instagram profile:", profile);
          return {
            id: profile.id,
            name: profile.username,
            email: null,
            image: null,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user, account }) {
        console.log("JWT callback:", { token, user, account });
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
        console.log("Session callback:", { session, token });
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
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    // Fix for the cookie issue
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: true,
        },
      },
      callbackUrl: {
        name: `next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
      csrfToken: {
        name: `next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
      pkceCodeVerifier: {
        name: `next-auth.pkce.code_verifier`,
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
          maxAge: 900,
        },
      },
      state: {
        name: `next-auth.state`,
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
          maxAge: 900,
        },
      },
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
  });
}
