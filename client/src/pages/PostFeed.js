import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PostFeed.css"; // Import the CSS file

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setLoading(false); // Ensure loading is set to false even on error
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="post-feed-container">
      <h2>UniLink Feed</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>by {post.author?.name || "Unknown"}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default PostFeed;
