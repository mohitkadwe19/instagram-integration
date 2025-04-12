import { useEffect } from "react";
import { FaInstagram, FaSpinner } from "react-icons/fa";
import Head from "next/head";

export default function LoginInstagram() {
  useEffect(() => {
    // Directly redirect to Instagram auth without going through NextAuth
    const redirectToInstagram = () => {
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
      const redirectUri = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/api/auth/callback/instagram`
      );
      
      const instagramAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
      
      console.log("Redirecting to:", instagramAuthUrl);
      window.location.href = instagramAuthUrl;
    };
    
    // Small delay to show the loading screen
    const timer = setTimeout(() => {
      redirectToInstagram();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Head>
        <title>Connecting to Instagram...</title>
      </Head>
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <FaInstagram className="mx-auto h-16 w-16 text-pink-500" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Connecting to Instagram
          </h2>
          <div className="mt-4 flex justify-center">
            <FaSpinner className="animate-spin h-8 w-8 text-purple-600" />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Redirecting you to Instagram for authentication...
          </p>
        </div>
      </div>
    </div>
  );
}

// Add this to make the Instagram client ID available on the client side
export async function getStaticProps() {
  return {
    props: {
      // Don't leak the full client secret, but make the client ID available
      NEXT_PUBLIC_INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID
    }
  };
}