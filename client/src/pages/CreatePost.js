import React, { useState } from "react";
import axios from "axios";
import "../styles/CreatePost.css"; // Ensure this CSS file exists and is styled

const CreatePost = () => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // New state for message type
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsError(false);
    setIsLoading(true); // Set loading to true

    const token = localStorage.getItem("token"); // Get token from localStorage

    // Basic client-side validation for token presence
    // This check is good because the route is protected by PrivateRoute
    if (!token || token === "") {
      setMessage(
        "You must be logged in to create a post. Please log in first."
      );
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          // FIX: Add "Bearer " prefix to the Authorization header
          headers: { Authorization: `Bearer ${token}` }, // Corrected line
        }
      );

      setMessage("Post created successfully!");
      setIsError(false);
      setFormData({ title: "", content: "" }); // Clear form fields after successful post
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to create post. Please try again.";
      setMessage(errorMessage);
      setIsError(true); // Set error state
      console.error("Create Post Error:", err);
    } finally {
      setIsLoading(false); // Always set loading to false after request completes
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      {message && (
        <p className={isError ? "message-error" : "message-success"}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="input-group">
          {" "}
          {/* Add input group for labels */}
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter post title"
            value={formData.title}
            onChange={handleChange}
            required
            aria-label="Post title"
          />
        </div>
        <div className="input-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your post content here..."
            value={formData.content}
            onChange={handleChange}
            required
            aria-label="Post content"
          />
        </div>
        {/* Disable button while loading or if content is empty */}
        <button
          type="submit"
          disabled={isLoading || !formData.title || !formData.content}
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
