// src/pages/PostFeed.js
import React, { useEffect, useState } from "react";
// Import all necessary postService functions
import {
  fetchAllPosts,
  likeUnlikePost,
  addCommentToPost,
  fetchCommentsForPost,
} from "../services/postService";
import "../styles/PostFeed.css"; // Ensure this CSS file is comprehensive

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState({}); // State to toggle comments visibility for each post
  const [newCommentContent, setNewCommentContent] = useState({}); // State for new comment input
  const [user, setUser] = useState(null); // State to store current logged-in user for like status

  useEffect(() => {
    // Fetch current user details when component mounts (optional, but good for likes)
    // You can get this from localStorage or a context if already stored after login
    const token = localStorage.getItem("token");
    if (token) {
      // Decode JWT to get user ID if needed for client-side like checks
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedToken = JSON.parse(window.atob(base64));
        setUser({ id: decodedToken.id }); // Assuming 'id' is in your token payload
      } catch (e) {
        console.error("Error decoding token:", e);
        setUser(null);
      }
    }

    // Initial fetch of posts
    const getPosts = async () => {
      try {
        const res = await fetchAllPosts(); // Use postService to fetch all posts
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  // Function to toggle like status
  const handleLike = async (postId) => {
    if (!user) {
      alert("Please log in to like a post.");
      return;
    }
    try {
      const res = await likeUnlikePost(postId); // Use postService to like/unlike
      // Update the post's like status in the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? res.data.post : post))
      );
    } catch (err) {
      console.error("Error liking/unliking post:", err);
      alert(err.response?.data?.error || "Failed to update like status.");
    }
  };

  // Function to add a comment
  const handleAddComment = async (postId) => {
    if (!user) {
      alert("Please log in to comment on a post.");
      return;
    }
    const content = newCommentContent[postId];
    if (!content || content.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      await addCommentToPost(postId, { content }); // Use postService to add comment
      // Clear the input field for this post
      setNewCommentContent((prev) => ({ ...prev, [postId]: "" }));
      // Re-fetch comments for this post or add new comment to state if available
      // For simplicity, we'll re-fetch all posts to update comments count/display
      const res = await fetchAllPosts();
      setPosts(res.data);
      alert("Comment added!");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert(err.response?.data?.error || "Failed to add comment.");
    }
  };

  // Function to fetch and toggle comments visibility
  const toggleComments = async (postId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle visibility
    }));

    // Fetch comments if they are about to become visible and not already loaded
    if (
      !commentsVisible[postId] &&
      !posts.find((p) => p._id === postId)?.commentsLoaded
    ) {
      try {
        const res = await fetchCommentsForPost(postId); // Use postService to fetch comments
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: res.data.comments, commentsLoaded: true }
              : post
          )
        );
      } catch (err) {
        console.error("Error fetching comments for post:", err);
        alert("Failed to load comments.");
      }
    }
  };

  return (
    <div className="post-feed-page-wrapper">
      <div className="post-feed-container">
        <h2 className="feed-title">UniLink Feed</h2>
        {loading ? (
          <p className="loading-message">Loading posts...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : posts.length === 0 ? (
          <p className="no-posts-message">
            No posts yet. Be the first to share something!
          </p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <h3 className="post-card-title">{post.title}</h3>
                <p className="post-card-content">{post.content}</p>
                <small className="post-card-author">
                  by {post.author?.name || "Unknown"} on{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>

                {/* Like and Comment interaction section */}
                <div className="post-actions">
                  <button
                    className={`like-button ${
                      user && post.likes.includes(user.id) ? "liked" : ""
                    }`}
                    onClick={() => handleLike(post._id)}
                  >
                    ❤️ {post.likes.length} Likes
                  </button>
                  <button
                    className="comment-toggle-button"
                    onClick={() => toggleComments(post._id)}
                  >
                    💬 {commentsVisible[post._id] ? "Hide" : "Show"} Comments
                  </button>
                </div>

                {/* Comments Section (conditionally rendered) */}
                {commentsVisible[post._id] && (
                  <div className="comments-section">
                    <div className="comment-form">
                      <textarea
                        placeholder="Add a comment..."
                        value={newCommentContent[post._id] || ""}
                        onChange={(e) =>
                          setNewCommentContent((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                      ></textarea>
                      <button onClick={() => handleAddComment(post._id)}>
                        Comment
                      </button>
                    </div>
                    <div className="comment-list">
                      {post.commentsLoaded ? (
                        post.comments && post.comments.length > 0 ? (
                          post.comments.map((comment) => (
                            <div key={comment._id} className="comment-item">
                              <p className="comment-content">
                                {comment.content}
                              </p>
                              <small className="comment-author">
                                - {comment.author?.name || "Unknown"} on{" "}
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </small>
                            </div>
                          ))
                        ) : (
                          <p className="no-comments-message">
                            No comments yet.
                          </p>
                        )
                      ) : (
                        <p className="loading-comments-message">
                          Loading comments...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFeed;
