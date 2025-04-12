import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaInstagram, FaSpinner, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";

export default function CustomLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    try {
      setIsLoading(true);
      
      // Create the Instagram authorization URL directly without NextAuth
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
      const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/api/auth/callback/instagram-direct`);
      
      // Use Instagram authorization URL
      const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
      
      console.log("Redirecting to Instagram:", url);
      
      // Redirect directly to Instagram
      window.location.href = url;
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to Instagram. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Head>
        <title>Login with Instagram</title>
      </Head>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-60 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 right-60 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <FaInstagram className="h-16 w-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-30 blur-xl rounded-full"></div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
              Connect to Instagram
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in with your Instagram account to continue
            </p>
          </div>
          
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-3 h-5 w-5" />
                Connecting...
              </>
            ) : (
              <>
                <FaInstagram className="mr-3 h-5 w-5" />
                Direct Login with Instagram
              </>
            )}
          </button>
          
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2 h-3 w-3" />
              Back to Home
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p className="mb-2">This is a direct connection to Instagram that bypasses NextAuth for initial authentication. Use this if you are experiencing cookie-related issues.</p>
              <p className="mt-4 text-xs">
                This app does not store your Instagram password and uses secure OAuth authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}