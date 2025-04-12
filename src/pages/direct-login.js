import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaInstagram, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import Link from 'next/link';

export default function DirectLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instagramAuthUrl, setInstagramAuthUrl] = useState('');

  useEffect(() => {
    // Get the Instagram auth URL
    async function getAuthUrl() {
      try {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Head>
        <title>Direct Instagram Login</title>
      </Head>
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <FaInstagram className="mx-auto h-12 w-12 text-pink-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Instagram Integration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect your Instagram account directly
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleLogin}
            disabled={isLoading || !instagramAuthUrl}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaInstagram className="h-5 w-5" />
                </span>
                Sign in with Instagram
              </>
            )}
          </button>
          
          <div className="text-center">
            <Link 
              href="/"
              className="inline-block text-sm text-purple-600 hover:text-purple-800"
            >
              Return to home
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to connect your Instagram account with this
            application.
          </p>
        </div>
      </div>
    </div>
  );
}