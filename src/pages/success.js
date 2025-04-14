import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { 
  FaCheckCircle, 
  FaInstagram, 
  FaSpinner, 
  FaUser, 
  FaImages, 
  FaComment, 
  FaExclamationTriangle 
} from "react-icons/fa";

export default function AuthSuccess() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the full user data from cookies or API
    const getProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get profile from our API first
        const response = await fetch("/api/profile");

        if (response.ok) {
          const apiData = await response.json();
          if (!apiData || Object.keys(apiData).length === 0) {
            throw new Error("Received empty profile data from API");
          }
          setUserData(apiData);
        } else {
          // Fallback to cookies if API fails
          const cookieData = getProfileFromCookie();
          if (cookieData) {
            setUserData(cookieData);
          } else {
            throw new Error("No Instagram session found. Please log in again.");
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(error.message || "Could not load profile data. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    // Helper function to parse profile data from cookie
    const getProfileFromCookie = () => {
      try {
        const cookies = document.cookie.split(";");
        const instagramCookie = cookies.find((c) =>
          c.trim().startsWith("instagram_session=")
        );

        if (!instagramCookie) return null;
        
        const cookieValue = instagramCookie.split("=")[1];
        if (!cookieValue) return null;
        
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch (error) {
        console.error("Error parsing cookie:", error);
        return null;
      }
    };

    // Start loading data with a small delay for better UX
    const timer = setTimeout(() => {
      getProfileData();
    }, 1000);

    // Clean up timeout on unmount
    return () => clearTimeout(timer);
  }, []);

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Head>
          <title>Authentication Error</title>
        </Head>
        <div className="max-w-lg w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <FaExclamationTriangle className="mx-auto h-16 w-16 text-amber-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              {error}
            </p>
            <div className="mt-8">
              <Link
                href="/auth/signin"
                className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-center">
                  <FaInstagram className="mr-2" />
                  Try Again
                </div>
              </Link>
              <Link
                href="/"
                className="mt-4 block w-full px-4 py-3 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-sm hover:shadow transition-all duration-200"
              >
                <div className="flex items-center justify-center">
                  Return to Home
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Head>
        <title>Authentication Successful</title>
      </Head>

      <div className="max-w-lg w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        {loading ? (
          <div className="text-center">
            <FaSpinner className="mx-auto h-12 w-12 text-purple-500 animate-spin" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Completing Authentication
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we finish setting up your connection...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Successful!
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              Welcome, <span className="font-medium">@{userData?.username || 'User'}</span>!
            </p>
            <p className="mt-2 text-gray-600">
              Your Instagram account has been successfully connected.
            </p>

            {userData && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  {userData.profile_picture_url ? (
                    <img 
                      src={userData.profile_picture_url} 
                      alt={userData.username}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white border-4 border-white shadow-lg">
                      <FaUser className="w-8 h-8" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900">{`@${userData.username || 'User'}`}</h3>
                <p className="text-sm text-gray-500">{userData.accountType || 'Instagram'} Account</p>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                    <div className="text-lg font-bold text-gray-900">{userData.media_count || 0}</div>
                    <div className="text-xs text-gray-500 flex items-center justify-center">
                      <FaImages className="mr-1 text-purple-500" /> Posts
                    </div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                    <div className="text-lg font-bold text-gray-900">{userData.followers_count || 0}</div>
                    <div className="text-xs text-gray-500 flex items-center justify-center">
                      <FaUser className="mr-1 text-purple-500" /> Followers
                    </div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                    <div className="text-lg font-bold text-gray-900">{userData.follows_count || 0}</div>
                    <div className="text-xs text-gray-500 flex items-center justify-center">
                      <FaUser className="mr-1 text-pink-500" /> Following
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <Link
                href="/profile"
                className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-center">
                  <FaUser className="mr-2" />
                  View Your Profile
                </div>
              </Link>
              
              <Link
                href="/feed"
                className="block w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-center">
                  <FaImages className="mr-2" />
                  Browse Your Media
                </div>
              </Link>
              
              <Link
                href="/"
                className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-sm hover:shadow transition-all duration-200"
              >
                <div className="flex items-center justify-center">
                  <FaInstagram className="mr-2" />
                  Go to Dashboard
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}