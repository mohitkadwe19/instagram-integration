import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaUser, FaCamera, FaSpinner, FaExclamationCircle } from "react-icons/fa";

export default function ProfileSection() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile");
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-purple-100"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
        </div>
        <p className="text-gray-600">Loading your profile...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-2 bg-red-500"></div>
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4">
              <FaExclamationCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-red-500 text-center mb-4">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={fetchProfile} 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
            >
              <span className="mr-2">Try again</span>
              {loading && <FaSpinner className="animate-spin" />}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-24 md:h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 relative">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="px-6 py-6 md:px-8 md:py-8 relative">
        <div className="flex flex-col md:flex-row items-center md:items-end relative -mt-16 md:-mt-20 mb-4 md:mb-6">
          <div className="relative z-10 mb-4 md:mb-0">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {profile.profile_picture_url ? (
                <Image
                  src={profile.profile_picture_url}
                  alt={profile.username}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300 hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <FaUser className="w-12 h-12 md:w-16 md:h-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 flex items-center justify-center">
                <FaCamera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </div>
          
          <div className="md:ml-6 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">@{profile.username}</h2>
            <p className="text-gray-600 mt-1 capitalize">{profile.account_type || 'Personal'} Account</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 border-t border-gray-100 pt-6">
          <motion.div 
            className="text-center p-4 rounded-lg bg-purple-50 border border-purple-100"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-purple-600">{profile.media_count || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Posts</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-4 rounded-lg bg-pink-50 border border-pink-100"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(236, 72, 153, 0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-pink-600">{profile.follows_count || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Following</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-4 rounded-lg bg-indigo-50 border border-indigo-100"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-indigo-600">{profile.followers_count || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Followers</div>
          </motion.div>
        </div>
        
        {profile.biography && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
            <p className="text-gray-600">{profile.biography}</p>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <a 
            href={`https://instagram.com/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            View on Instagram
          </a>
        </div>
      </div>
    </motion.div>
  );
}