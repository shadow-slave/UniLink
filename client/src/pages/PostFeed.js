import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PostFeed.css"; // Import the CSS file for PostFeed

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New state for error handling

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load posts. Please try again later."); // Set user-friendly error message
      setLoading(false); // Ensure loading is set to false even on error
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="post-feed-page-wrapper">
      {" "}
      {/* Main container for the feed page */}
      <div className="post-feed-container">
        {" "}
        {/* Container for the list of posts */}
        <h2 className="feed-title">UniLink Feed</h2> {/* Title for the feed */}
        {loading ? (
          <p className="loading-message">Loading posts...</p>
        ) : error ? (
          <p className="error-message">{error}</p> // Display error message
        ) : posts.length === 0 ? (
          <p className="no-posts-message">
            No posts yet. Be the first to share something!
          </p> // Message if no posts
        ) : (
          <div className="posts-grid">
            {" "}
            {/* Grid/Flex container for posts */}
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                {" "}
                {/* Individual post card */}
                <h3 className="post-card-title">{post.title}</h3>
                <p className="post-card-content">{post.content}</p>
                <small className="post-card-author">
                  by {post.author?.name || "Unknown"} on{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFeed;
