import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaUser,
  FaMapMarkerAlt,
  FaGlobe,
  FaUserFriends,
  FaImages,
} from "react-icons/fa";
import Layout from "../components/Layout";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update the useEffect in your ProfilePage component
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Try to get profile from our API first
        const response = await fetch("/api/instagram/profile");

        if (response.ok) {
          const apiData = await response.json();
          setProfileData(apiData);
        } else {
          // Fallback to cookies if API fails
          const cookies = document.cookie.split(";");
          const instagramCookie = cookies.find((c) =>
            c.trim().startsWith("instagram_session=")
          );

          if (instagramCookie) {
            const cookieValue = instagramCookie.split("=")[1];
            if (cookieValue) {
              const sessionData = JSON.parse(decodeURIComponent(cookieValue));
              setProfileData(sessionData);
            } else {
              setError("No profile data found in session cookie");
            }
          } else {
            setError("No Instagram session found. Please log in.");
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Could not load profile data. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <Layout title="Loading Profile...">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-purple-200"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600">Loading your profile...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Profile Error">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="bg-red-50 p-4 rounded-lg text-center max-w-md">
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/direct-login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Login with Instagram
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title="Profile Not Found">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="bg-yellow-50 p-4 rounded-lg text-center max-w-md">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">
              Profile Not Found
            </h2>
            <p className="text-yellow-600 mb-4">
              No profile data is available. Please log in with Instagram.
            </p>
            <Link
              href="/direct-login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Login with Instagram
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${profileData.username} - Profile`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cover image/header */}
          <div className="h-40 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

          {/* Profile information */}
          <div className="relative px-6 py-8">
            {/* Profile picture */}
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {profileData.profilePictureUrl ? (
                  <img
                    src={profileData.profilePictureUrl}
                    alt={profileData.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white">
                    <FaUser className="text-4xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile details */}
            <div className="ml-40">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {profileData.name || `@${profileData.username}`}
              </h1>
              <div className="text-gray-600 mb-4">@{profileData.username}</div>

              <div className="flex flex-wrap gap-4 text-sm mt-2">
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2 text-gray-400" />
                  <span>{profileData.accountType || "Standard"} Account</span>
                </div>

                {profileData.website && (
                  <div className="flex items-center text-gray-600">
                    <FaGlobe className="mr-2 text-gray-400" />
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 mb-6 border-t border-b border-gray-100 py-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profileData.mediaCount || 0}
                </div>
                <div className="text-gray-600 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profileData.followersCount || 0}
                </div>
                <div className="text-gray-600 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profileData.followsCount || 0}
                </div>
                <div className="text-gray-600 text-sm">Following</div>
              </div>
            </div>

            {/* Bio */}
            {profileData.biography && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Bio</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {profileData.biography}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/feed"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow transition-colors"
              >
                <FaImages className="mr-2" />
                View Media Feed
              </Link>

              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
