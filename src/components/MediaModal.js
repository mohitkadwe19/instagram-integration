import { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaHeart, 
  FaComment, 
  FaExternalLinkAlt, 
  FaVideo, 
  FaImage, 
  FaImages, 
  FaChevronLeft, 
  FaChevronRight, 
  FaSpinner, 
  FaExclamationCircle
} from "react-icons/fa";
import CommentSection from "./CommentSection";

export default function MediaModal({ media, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mediaContent, setMediaContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && mediaContent) {
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : mediaContent.length - 1));
      } else if (e.key === "ArrowRight" && mediaContent) {
        setCurrentSlide(prev => (prev < mediaContent.length - 1 ? prev + 1 : 0));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    // For carousel albums, fetch children if needed
    if (media.media_type === "CAROUSEL_ALBUM" && media.children && media.children.data) {
      setMediaContent(media.children.data);
    }

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [media, onClose, mediaContent]);

  const handlePrevious = () => {
    if (mediaContent && mediaContent.length > 1) {
      setCurrentSlide(prev => (prev > 0 ? prev - 1 : mediaContent.length - 1));
    }
  };

  const handleNext = () => {
    if (mediaContent && mediaContent.length > 1) {
      setCurrentSlide(prev => (prev < mediaContent.length - 1 ? prev + 1 : 0));
    }
  };

  const renderMediaContent = () => {
    // For carousel albums
    if (media.media_type === "CAROUSEL_ALBUM" && mediaContent) {
      const currentItem = mediaContent[currentSlide];
      
      return (
        <div className="relative w-full h-full">
          {currentItem.media_type === "VIDEO" ? (
            <div className="w-full h-full flex items-center justify-center">
              <video
                src={currentItem.media_url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: "calc(90vh - 74px)" }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={currentItem.media_url}
                alt={media.caption || "Carousel item"}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: "calc(90vh - 74px)" }}
              />
            </div>
          )}
          
          {mediaContent.length > 1 && (
            <>
              <button 
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white hover:bg-opacity-60 transition-all duration-200 z-10"
                aria-label="Previous slide"
              >
                <FaChevronLeft />
              </button>
              
              <button 
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white hover:bg-opacity-60 transition-all duration-200 z-10"
                aria-label="Next slide"
              >
                <FaChevronRight />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {mediaContent.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentSlide ? "bg-white" : "bg-gray-400 bg-opacity-50"
                    } transition-all duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      );
    }
    
    // For videos
    if (media.media_type === "VIDEO") {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <video
            src={media.media_url}
            controls
            autoPlay
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: "calc(90vh - 74px)" }}
          />
        </div>
      );
    }
    
    // For images
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={media.media_url}
          alt={media.caption || "Media"}
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: "calc(90vh - 74px)" }}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-hidden" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden">
              {media.user && media.user.profile_picture_url ? (
                <img
                  src={media.user.profile_picture_url}
                  alt={media.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold">{media.username?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-900">@{media.username}</div>
              <div className="text-xs text-gray-500">
                {new Date(media.timestamp).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={media.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="View on Instagram"
            >
              <FaExternalLinkAlt />
            </a>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-grow h-[calc(90vh-74px)]">
          {/* Media */}
          <div className="md:w-3/5 h-[320px] md:h-full relative bg-black flex-shrink-0">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <FaSpinner className="animate-spin h-12 w-12 text-purple-500" />
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-4">
                  <FaExclamationCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
                  <p className="text-red-500">{error}</p>
                </div>
              </div>
            ) : (
              renderMediaContent()
            )}
          </div>

          {/* Comments & Info Section */}
          <div className="md:w-2/5 flex flex-col bg-white overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Media Info */}
              <div className="p-4 border-b border-gray-200">
                {/* Engagement stats */}
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                      <FaHeart className="w-5 h-5" />
                    </div>
                    <span className="ml-2 font-medium">{media.like_count || 0}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <FaComment className="w-5 h-5" />
                    </div>
                    <span className="ml-2 font-medium">{media.comments_count || 0}</span>
                  </div>
                </div>
              
                {/* Caption */}
                {media.caption && (
                  <div className="mb-3 bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-900 whitespace-pre-line text-sm">
                      <span className="font-medium">@{media.username}</span>{" "}
                      {media.caption}
                    </p>
                  </div>
                )}
              
                {/* Media type label */}
                <div className="flex space-x-2 mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {media.media_type === "VIDEO" ? (
                      <><FaVideo className="mr-1" /> Video</>
                    ) : media.media_type === "CAROUSEL_ALBUM" ? (
                      <><FaImages className="mr-1" /> Album</>
                    ) : (
                      <><FaImage className="mr-1" /> Image</>
                    )}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {new Date(media.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Comments Section with fixed height */}
              <div className="flex-grow overflow-hidden">
                <CommentSection mediaId={media.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}