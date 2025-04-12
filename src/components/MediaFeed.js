import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaComment, FaHeart, FaVideo, FaImages, FaImage, FaExclamationCircle, FaSpinner, FaAngleDown } from "react-icons/fa";
import MediaItem from "./MediaItem";

export default function MediaFeed() {
  const { data: session } = useSession();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationToken, setPaginationToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    if (session) {
      fetchMedia();
    }
  }, [session]);

  const fetchMedia = async (after = null) => {
    try {
      setLoading(true);
      let url = "/api/media";
      if (after) {
        url += `?after=${after}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch media data");
      }
      
      const data = await response.json();
      
      if (after) {
        setMedia(prev => [...prev, ...data.data]);
      } else {
        setMedia(data.data);
      }
      
      // Check for pagination
      if (data.paging && data.paging.cursors && data.paging.cursors.after) {
        setPaginationToken(data.paging.cursors.after);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      setError("Failed to load media. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (paginationToken && hasMore && !loading) {
      fetchMedia(paginationToken);
    }
  };

  const openMediaDetails = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const closeMediaDetails = () => {
    setSelectedMedia(null);
  };

  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case "VIDEO":
        return <FaVideo className="text-white text-lg absolute top-3 right-3 z-10 drop-shadow-md" />;
      case "CAROUSEL_ALBUM":
        return <FaImages className="text-white text-lg absolute top-3 right-3 z-10 drop-shadow-md" />;
      default:
        return <FaImage className="text-white text-lg absolute top-3 right-3 z-10 drop-shadow-md" />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading && media.length === 0) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="loading-spinner">
            <div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
        <p className="text-gray-600">Loading your Instagram media...</p>
      </motion.div>
    );
  }

  if (error && media.length === 0) {
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
              onClick={() => fetchMedia()} 
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

  if (media.length === 0) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <FaImages className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Media Found</h3>
        <p className="text-gray-500">No media posts were found in this Instagram account.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Instagram Media</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewMode("grid")} 
                className={`px-3 py-2 rounded-lg ${viewMode === "grid" 
                  ? "bg-purple-100 text-purple-600" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"} transition-colors duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode("list")} 
                className={`px-3 py-2 rounded-lg ${viewMode === "list" 
                  ? "bg-purple-100 text-purple-600" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"} transition-colors duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {viewMode === "grid" ? (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {media.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden cursor-pointer relative group shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => openMediaDetails(item)}
                  variants={item}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.media_type === "VIDEO" ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      {item.thumbnail_url ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={item.thumbnail_url}
                            alt={item.caption || "Video thumbnail"}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                              <FaVideo className="text-white text-xl" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <FaVideo className="text-white text-4xl" />
                      )}
                    </div>
                  ) : item.media_type === "CAROUSEL_ALBUM" ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.media_url}
                        alt={item.caption || "Carousel album"}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-1">
                        <FaImages className="text-white text-sm" />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.media_url}
                        alt={item.caption || "Image"}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  
                  {getMediaTypeIcon(item.media_type)}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                    <div className="flex items-center text-sm">
                      <span className="flex items-center mr-3">
                        <FaHeart className="mr-1 text-pink-500" />
                        {item.like_count || 0}
                      </span>
                      <span className="flex items-center">
                        <FaComment className="mr-1 text-blue-500" />
                        {item.comments_count || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {media.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => openMediaDetails(item)}
                  variants={item}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-40 h-40 relative flex-shrink-0">
                      {item.media_type === "VIDEO" ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          {item.thumbnail_url ? (
                            <Image
                              src={item.thumbnail_url}
                              alt={item.caption || "Video thumbnail"}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <FaVideo className="text-white text-4xl" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-2">
                              <FaVideo className="text-white text-xl" />
                            </div>
                          </div>
                        </div>
                      ) : item.media_type === "CAROUSEL_ALBUM" ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={item.media_url}
                            alt={item.caption || "Carousel album"}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                            <FaImages className="text-white text-sm" />
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={item.media_url}
                          alt={item.caption || "Image"}
                          layout="fill"
                          objectFit="cover"
                        />
                      )}
                    </div>
                    
                    <div className="p-4 flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center text-sm text-gray-500">
                            <FaHeart className="mr-1 text-pink-500" />
                            {item.like_count || 0}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <FaComment className="mr-1 text-blue-500" />
                            {item.comments_count || 0}
                          </span>
                        </div>
                      </div>
                      
                      {item.caption && (
                        <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                          {item.caption}
                        </p>
                      )}
                      
                      <div className="flex justify-end mt-2">
                        <button className="text-xs text-purple-600 hover:text-purple-800 transition-colors duration-200">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {hasMore && (
            <div className="text-center mt-8">
              <motion.button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaAngleDown className="mr-2" />
                )}
                {loading ? "Loading..." : "Load More"}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
      
      {selectedMedia && (
        <MediaItem media={selectedMedia} onClose={closeMediaDetails} />
      )}
    </div>
  );
}