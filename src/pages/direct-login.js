import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaInstagram, FaSpinner, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";

export default function DirectLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instagramAuthUrl, setInstagramAuthUrl] = useState('');

  useEffect(() => {
    // Get the Instagram auth URL
    async function getAuthUrl() {
      try {
        setUrlLoading(true);
        const response = await fetch('/api/auth/instagram-url');
        const data = await response.json();
        
        if (data.url) {
          setInstagramAuthUrl(data.url);
        } else {
          setError('Could not generate Instagram authorization URL');
        }
      } catch (err) {
        console.error('Error fetching Instagram URL:', err);
        setError('Could not connect to authentication service');
      } finally {
        setUrlLoading(false);
      }
    }
    
    getAuthUrl();
  }, []);

  const handleLogin = () => {
    if (!instagramAuthUrl) {
      setError('Instagram authorization URL is not available');
      return;
    }
    
    setIsLoading(true);
    
    // Redirect to Instagram
    window.location.href = instagramAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Head>
        <title>Login with Instagram</title>
      </Head>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-60 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 right-60 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
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
            disabled={isLoading || urlLoading || !instagramAuthUrl}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading || urlLoading ? (
              <>
                <FaSpinner className="animate-spin mr-3 h-5 w-5" />
                {isLoading ? "Connecting..." : "Loading..."}
              </>
            ) : (
              <>
                <FaInstagram className="mr-3 h-5 w-5" />
                Login with Instagram
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
              <p className="mb-2">By connecting your Instagram account, you will be able to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>View your Instagram profile details</li>
                <li>Browse your media posts, photos, and videos</li>
                <li>Interact with comments on your posts</li>
              </ul>
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