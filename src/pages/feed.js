import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { FaHeart, FaComment, FaVideo, FaImage, FaImages, FaSpinner, FaExclamationCircle, FaAngleDown } from "react-icons/fa";
import Layout from "../components/Layout";
import MediaModal from "../components/MediaModal";

export default function FeedPage() {
  const { data: session, status } = useSession();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationCursor, setPaginationCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [loadingMore, setLoadingMore] = useState(false);

  // Add the missing getMediaTypeIcon function
  const getMediaTypeIcon = (mediaType) => {
    if (mediaType === "VIDEO") {
      return (
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-1">
          <FaVideo className="text-white text-sm" />
        </div>
      );
    } else if (mediaType === "CAROUSEL_ALBUM") {
      return (
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-1">
          <FaImages className="text-white text-sm" />
        </div>
      );
    }
    return null;
  };
  
  // Missing function to open media details
  const openMediaDetails = (media) => {
    setSelectedMedia(media);
  };
  
  // Missing function to close media details
  const closeMediaDetails = () => {
    setSelectedMedia(null);
  };
  
  // Missing function to load more media
  const loadMore = () => {
    if (paginationCursor && !loadingMore) {
      fetchMedia(paginationCursor);
    }
  };

  const fetchMedia = async (after = null) => {
    try {
      // Check if session exists before making API call
      if (!session) {
        throw new Error("Authentication required");
      }

      const isInitialFetch = !after;
      if (isInitialFetch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let url = "/api/instagram/media";
      if (after) {
        url += `?after=${after}`;
      }
      
      const response = await fetch(url);

      console.log("Fetching media from URL:", response);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error fetching media");
      }
      
      if (after) {
        setMediaItems(prev => [...prev, ...data.data]);
      } else {
        setMediaItems(data.data || []);
      }
      
      // Check for pagination
      if (data.paging && data.paging.cursors && data.paging.cursors.after) {
        setPaginationCursor(data.paging.cursors.after);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      setError(err.message || "Failed to load media. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // Only fetch media when session is available
    if (session) {
      fetchMedia();
    }
  }, [session]);

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <Layout title="Loading...">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-purple-200"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600">Loading session...</p>
        </div>
      </Layout>
    );
  }
  
  // Show sign in prompt if not authenticated
  if (!session) {
    return (
      <Layout title="Authentication Required">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="bg-yellow-50 p-6 rounded-lg text-center max-w-md">
            <FaExclamationCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">Authentication Required</h2>
            <p className="text-yellow-600 mb-4">Please sign in to view your Instagram media.</p>
            <button
              onClick={() => signIn("instagram")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Sign in with Instagram
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading && mediaItems.length === 0) {
    return (
      <Layout title="Loading Media...">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-purple-200"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600">Loading your Instagram media...</p>
        </div>
      </Layout>
    );
  }

  if (error && mediaItems.length === 0) {
    return (
      <Layout title="Error">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="bg-red-50 p-6 rounded-lg text-center max-w-md">
            <FaExclamationCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Media</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchMedia()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (mediaItems.length === 0 && !loading) {
    return (
      <Layout title="No Media Found">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="bg-yellow-50 p-6 rounded-lg text-center max-w-md">
            <FaImages className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">No Media Found</h2>
            <p className="text-yellow-600 mb-4">No Instagram posts were found for this account.</p>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Instagram Media Feed">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Instagram Media Feed</h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${viewMode === "grid" 
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              <FaImages className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${viewMode === "list"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaItems.map((media) => (
              <div
                key={media.id}
                className="aspect-square rounded-lg overflow-hidden shadow-md relative cursor-pointer transition-transform hover:shadow-lg hover:-translate-y-1"
                onClick={() => openMediaDetails(media)}
              >
                <div className="absolute inset-0 bg-opacity-20"></div>
                {media.media_type === "VIDEO" ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    {media.thumbnail_url ? (
                      <img
                        src={media.thumbnail_url}
                        alt={media.caption || "Video thumbnail"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <FaVideo className="text-white text-4xl" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black bg-opacity-50 p-2">
                        <FaVideo className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                ) : media.media_type === "CAROUSEL_ALBUM" ? (
                  <div className="relative w-full h-full">
                    <img
                      src={media.media_url}
                      alt={media.caption || "Carousel album"}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-black bg-opacity-50 p-1">
                      <FaImages className="text-white text-sm" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={media.media_url}
                    alt={media.caption || "Image"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                )}
                
                {getMediaTypeIcon(media.media_type)}
                
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 text-white">
                  <div className="flex items-center text-sm">
                    <span className="flex items-center mr-3">
                      <FaHeart className="mr-1 text-pink-500" />
                      {media.like_count || 0}
                    </span>
                    <span className="flex items-center">
                      <FaComment className="mr-1 text-blue-500" />
                      {media.comments_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mediaItems.map((media) => (
              <div
                key={media.id}
                className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1"
                onClick={() => openMediaDetails(media)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 h-40 relative flex-shrink-0">
                    {media.media_type === "VIDEO" ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        {media.thumbnail_url ? (
                          <img
                            src={media.thumbnail_url}
                            alt={media.caption || "Video thumbnail"}
                            className="w-full h-full object-cover"
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
                    ) : media.media_type === "CAROUSEL_ALBUM" ? (
                      <div className="relative w-full h-full">
                        <img
                          src={media.media_url}
                          alt={media.caption || "Carousel album"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                          <FaImages className="text-white text-sm" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={media.media_url}
                        alt={media.caption || "Image"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-500">
                        {new Date(media.timestamp).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center text-sm text-gray-500">
                          <FaHeart className="mr-1 text-pink-500" />
                          {media.like_count || 0}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <FaComment className="mr-1 text-blue-500" />
                          {media.comments_count || 0}
                        </span>
                      </div>
                    </div>
                    
                    {media.caption && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {media.caption}
                      </p>
                    )}
                    
                    <div className="flex justify-end mt-2">
                      <button className="text-xs text-purple-600 hover:text-purple-800 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center mx-auto"
            >
              {loadingMore ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaAngleDown className="mr-2" />
              )}
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        
        {selectedMedia && (
          <MediaModal media={selectedMedia} onClose={closeMediaDetails} />
        )}
      </div>
    </Layout>
  );
}