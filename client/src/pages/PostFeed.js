import React, { useEffect, useState } from "react";
import axios from "axios";

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
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>UniLink Feed</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
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
