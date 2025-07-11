import React, { useState } from "react";
import axios from "axios";
import "../styles/CreatePost.css"; 
const CreatePost = () => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: { Authorization: token },
        }
      );

      setMessage("Post created!");
      setFormData({ title: "", content: "" });
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a Post</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="create-post-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
