import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaHeart, FaComment, FaExternalLinkAlt, FaVideo, FaImage, FaImages, FaChevronLeft, FaChevronRight, FaShare, FaDownload } from "react-icons/fa";
import CommentSection from "./CommentSection";

export default function MediaItem({ media, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mediaContent, setMediaContent] = useState(null);

  useEffect(() => {
    // For carousel albums, we need to load the child media items
    if (media.media_type === "CAROUSEL_ALBUM" && media.children && media.children.data) {
      setMediaContent(media.children.data);
    }
  }, [media]);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    } else if (event.key === "ArrowLeft" && mediaContent) {
      setCurrentSlide(prev => (prev > 0 ? prev - 1 : mediaContent.length - 1));
    } else if (event.key === "ArrowRight" && mediaContent) {
      setCurrentSlide(prev => (prev < mediaContent.length - 1 ? prev + 1 : 0));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mediaContent]);

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
            <video
              src={currentItem.media_url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={currentItem.media_url}
                alt={media.caption || "Carousel item"}
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
          
          {mediaContent.length > 1 && (
            <>
              <button 
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white hover:bg-opacity-60 transition-all duration-200 z-10"
              >
                <FaChevronLeft />
              </button>
              
              <button 
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white hover:bg-opacity-60 transition-all duration-200 z-10"
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
        <video
          src={media.media_url}
          controls
          autoPlay
          className="w-full h-full object-contain"
        />
      );
    }
    
    // For images
    return (
      <div className="relative w-full h-full">
        <Image
          src={media.media_url}
          alt={media.caption || "Media"}
          layout="fill"
          objectFit="contain"
        />
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden">
                {media.user && media.user.profile_picture_url ? (
                  <Image 
                    src={media.user.profile_picture_url} 
                    alt={media.username}
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className="font-bold">{media.username?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900 dark:text-gray-100">@{media.username}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
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
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
              >
                <FaExternalLinkAlt />
              </a>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={onClose}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            {/* Media */}
            <div className="flex-shrink-0 md:w-3/5 h-64 md:h-auto relative bg-black">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                renderMediaContent()
              )}
            </div>

            {/* Comments & Info Section */}
            <div className="md:w-2/5 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
              {/* Media Info */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                {/* Engagement stats */}
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900 flex items-center justify-center text-pink-500">
                      <FaHeart />
                    </div>
                    <span className="ml-2 font-medium">{media.like_count || 0}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900 flex items-center justify-center text-blue-500">
                      <FaComment />
                    </div>
                    <span className="ml-2 font-medium">{media.comments_count || 0}</span>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex space-x-2">
                    <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <FaShare className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <FaDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              
                {/* Caption */}
                {media.caption && (
                  <div className="mb-3">
                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line">
                      <span className="font-medium">@{media.username}</span>{" "}
                      {media.caption}
                    </p>
                  </div>
                )}
              
                {/* Media type label */}
                <div className="flex space-x-2 mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {media.media_type === "VIDEO" ? (
                      <><FaVideo className="mr-1" /> Video</>
                    ) : media.media_type === "CAROUSEL_ALBUM" ? (
                      <><FaImages className="mr-1" /> Album</>
                    ) : (
                      <><FaImage className="mr-1" /> Image</>
                    )}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {new Date(media.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Comments */}
              <CommentSection mediaId={media.id} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}