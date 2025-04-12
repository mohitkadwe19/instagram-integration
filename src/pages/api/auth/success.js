import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { FaCheckCircle, FaInstagram, FaSpinner, FaUser, FaImages, FaComment } from "react-icons/fa";

export default function AuthSuccess() {
  const router = useRouter();
  const { username } = router.query;
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!username) return;

    // Get the full user data from cookies
    const getProfileData = () => {
      try {
        // Get the Instagram session from cookies
        const cookies = document.cookie.split(';');
        const instagramCookie = cookies.find(c => c.trim().startsWith('instagram_session='));
        
        if (instagramCookie) {
          const cookieValue = instagramCookie.split('=')[1];
          if (cookieValue) {
            const sessionData = JSON.parse(decodeURIComponent(cookieValue));
            setUserData(sessionData);
          }
        }
      } catch (error) {
        console.error('Error parsing Instagram session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading user data
    setTimeout(() => {
      getProfileData();
    }, 1000);
  }, [username]);

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
              Welcome, <span className="font-medium">@{username}</span>!
            </p>
            <p className="mt-2 text-gray-600">
              Your Instagram account has been successfully connected.
            </p>

            {userData && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-center mb-4">
                  {userData.profilePictureUrl ? (
                    <img 
                      src={userData.profilePictureUrl} 
                      alt={userData.username}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white border-4 border-white shadow-lg">
                      <FaUser className="w-8 h-8" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900">{userData.name || `@${userData.username}`}</h3>
                <p className="text-sm text-gray-500">{userData.accountType || ''} Account</p>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{userData.mediaCount || 0}</div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{userData.followersCount || 0}</div>
                    <div className="text-xs text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{userData.followsCount || 0}</div>
                    <div className="text-xs text-gray-500">Following</div>
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