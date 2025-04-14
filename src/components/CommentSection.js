import { useState, useEffect, useRef } from "react";
import { FaReply, FaTimes, FaSpinner, FaExclamationCircle, FaPaperPlane, FaUser } from "react-icons/fa";

export default function CommentSection({ mediaId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paginationToken, setPaginationToken] = useState(null);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (mediaId) {
      fetchComments();
    }
  }, [mediaId]);

  useEffect(() => {
    if (replyingTo && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [replyingTo]);

  const fetchComments = async (after = null) => {
    try {
      if (after) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      let url = `/api/instagram/comments/${mediaId}`;
      if (after) {
        url += `?after=${after}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error fetching comments");
      }
      
      if (after) {
        setComments(prev => [...prev, ...data.data]);
      } else {
        setComments(data.data || []);
      }
      
      // Check for pagination
      if (data.paging && data.paging.cursors && data.paging.cursors.after) {
        setPaginationToken(data.paging.cursors.after);
        setHasMoreComments(true);
      } else {
        setHasMoreComments(false);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.message || "Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreComments = () => {
    if (paginationToken && hasMoreComments && !loadingMore) {
      fetchComments(paginationToken);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim() || submitting) return;
    
    try {
      setSubmitting(true);
      
      const payload = {
        text: commentText,
      };
      
      // If replying to a comment
      if (replyingTo) {
        payload.replied_to_comment_id = replyingTo.id;
      }
      
      const response = await fetch(`/api/instagram/comments/${mediaId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment");
      }
      
      // Refresh comments
      await fetchComments();
      setCommentText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error posting comment:", err);
      setError(err.message || "Failed to post comment. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex-grow overflow-y-auto p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Comments</h3>
        
        {loading && comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <FaSpinner className="animate-spin h-8 w-8 text-purple-500 mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <button 
                  onClick={() => fetchComments()} 
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Be the first to comment on this post</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden">
                      <FaUser className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">@{comment.username}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.timestamp)}</div>
                      </div>
                      <button
                        onClick={() => setReplyingTo(comment)}
                        className="inline-flex items-center text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                      >
                        <FaReply className="mr-1" />
                        Reply
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {comment.text}
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.data && comment.replies.data.length > 0 && (
                      <div className="mt-3 ml-3 pl-3 border-l-2 border-gray-200 dark:border-gray-600 space-y-2">
                        {comment.replies.data.map((reply) => (
                          <div key={reply.id} className="flex">
                            <div className="flex-shrink-0 mr-2">
                              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white overflow-hidden">
                                <FaUser className="text-white text-xs" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-xs font-medium text-gray-900 dark:text-gray-100">@{reply.username}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(reply.timestamp)}</div>
                                </div>
                              </div>
                              <div className="mt-1 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {reply.text}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {hasMoreComments && (
              <div className="text-center">
                <button
                  onClick={loadMoreComments}
                  disabled={loadingMore}
                  className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  {loadingMore ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Loading more comments...
                    </span>
                  ) : (
                    "Load more comments"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Comment Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {replyingTo && (
          <div className="mb-3 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Replying to <span className="font-medium">@{replyingTo.username}</span>
            </span>
            <button 
              onClick={() => setReplyingTo(null)} 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmitComment} className="flex items-center">
          <div className="relative flex-grow">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
              disabled={loading || submitting}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 flex items-center justify-center"
            disabled={loading || !commentText.trim() || submitting}
          >
            {submitting ? (
              <FaSpinner className="animate-spin h-4 w-4" />
            ) : (
              <FaPaperPlane className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}