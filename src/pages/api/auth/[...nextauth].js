import NextAuth from "next-auth";
import InstagramProvider from "next-auth/providers/instagram";

// export default async function auth(req, res) {
//   // Check if this is a webhook verification request
//   if (
//     req.method === "GET" &&
//     req.query["hub.mode"] === "subscribe" &&
//     req.query["hub.challenge"]
//   ) {
//     console.log("Webhook verification request received");
//     // Return the challenge to verify the webhook
//     return res.status(200).send(req.query["hub.challenge"]);
//   }

//   // Regular NextAuth flow
//   return await NextAuth(req, res, {
//     providers: [
//       InstagramProvider({
//         clientId: process.env.INSTAGRAM_CLIENT_ID,
//         clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
//         authorization: {
//           url: "https://www.facebook.com/v18.0/dialog/oauth",
//           params: {
//             scope: "instagram_basic,pages_show_list",
//             response_type: "code",
//           },
//         },
//         token: "https://graph.facebook.com/v18.0/oauth/access_token",
//         userinfo: {
//           url: `${process.env.INSTAGRAM_API_URL}/me`,
//           async request({ client, tokens }) {
//             try {
//               console.log("Fetching user info with token:", tokens.access_token);
//               console.log("client:", client);

//               const accessToken = tokens.access_token;

//               const pageRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
//               const pageData = await pageRes.json();

//               console.log("Page data:", pageData);

//               const page = pageData?.data?.[0];
//               console.log("Facebook Page:", page);
//               if (!page) {
//                 console.error("No Facebook Page found");
//                 throw new Error("No connected Facebook Page");
//               }

//               // Step 2: Get Instagram Business Account ID
//               const igAccountRes = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
//               const igAccountData = await igAccountRes.json();

//               console.log("Instagram account data:", igAccountData);

//               const igId = igAccountData?.id;
//               console.log("Instagram ID:", igId);
//               if (!igId) {
//                 console.error("Instagram Business account not found");
//                 throw new Error("Page not linked to an Instagram Business account");
//               }

//               // Step 3: Fetch Instagram profile data
//               const igProfileRes = await fetch(`https://graph.facebook.com/v18.0/${igId}?fields=id,username,account_type,media_count&access_token=${accessToken}`);
//               const igProfile = await igProfileRes.json();

//               console.log("Instagram profile data:", igProfile);

//               return {
//                 id: igProfile.id,
//                 username: igProfile.username,
//                 name: igProfile.username,
//                 account_type: igProfile.account_type,
//                 media_count: igProfile.media_count,
//                 access_token: accessToken,
//               };

//             } catch (error) {
//               console.error("Error in userinfo request:", error);
//               throw error;
//             }
//           },
//         },
//         profile(profile) {
//           return {
//             id: profile.id,
//             name: profile.username,
//             email: null,
//             image: null,
//           };
//         },
//       }),
//     ],
//     callbacks: {
//       async jwt({ token, user, account }) {
//         // Initial sign in
//         if (account && user) {
//           return {
//             ...token,
//             accessToken: account.access_token,
//             refreshToken: account.refresh_token,
//             username: user.username,
//             accountType: user.account_type,
//             mediaCount: user.media_count,
//             userId: user.id,
//           };
//         }
//         return token;
//       },
//       async session({ session, token }) {
//         session.user = {
//           ...session.user,
//           username: token.username || session.user.name,
//           accessToken: token.accessToken,
//           accountType: token.accountType,
//           mediaCount: token.mediaCount,
//           userId: token.userId || token.sub,
//         };
//         return session;
//       },
//     },
//     pages: {
//       signIn: "/auth/signin",
//       error: "/auth/error",
//     },
//     // Fix for the cookie issue
//     cookies: {
//       sessionToken: {
//         name: `next-auth.session-token`,
//         options: {
//           httpOnly: true,
//           sameSite: "lax",
//           path: "/",
//           secure: true
//         },
//       },
//       callbackUrl: {
//         name: `next-auth.callback-url`,
//         options: {
//           httpOnly: true,
//           sameSite: "lax",
//           path: "/",
//           secure: process.env.NODE_ENV === "production",
//         },
//       },
//       csrfToken: {
//         name: `next-auth.csrf-token`,
//         options: {
//           httpOnly: true,
//           sameSite: "lax",
//           path: "/",
//           secure: process.env.NODE_ENV === "production",
//         },
//       },
//       pkceCodeVerifier: {
//         name: `next-auth.pkce.code_verifier`,
//         options: {
//           httpOnly: true,
//           sameSite: "none",
//           path: "/",
//           secure: true,
//           maxAge: 900,
//         },
//       },
//       state: {
//         name: `next-auth.state`,
//         options: {
//           httpOnly: true,
//           sameSite: "none",
//           path: "/",
//           secure: true,
//           maxAge: 900,
//         },
//       },
//     },
//     debug: true,
//     secret: process.env.NEXTAUTH_SECRET,
//   });
// }

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
