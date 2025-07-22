// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios"; // Keep axios for general purpose, but use postService for specific calls
// Import new fetch functions for user's posts and comments
import { fetchMyPosts, fetchMyComments } from "../services/postService";
import "../styles/Dashboard.css"; // Ensure this CSS file is comprehensive

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]); // State for user's posts
  const [myComments, setMyComments] = useState([]); // State for user's comments
  const [loadingUser, setLoadingUser] = useState(true); // Loading state for user profile
  const [loadingPosts, setLoadingPosts] = useState(true); // Loading state for posts
  const [loadingComments, setLoadingComments] = useState(true); // Loading state for comments
  const [errorUser, setErrorUser] = useState(null);
  const [errorPosts, setErrorPosts] = useState(null);
  const [errorComments, setErrorComments] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "") {
        setErrorUser("No token found. Please log in.");
        setLoadingUser(false);
        setLoadingPosts(false);
        setLoadingComments(false);
        return;
      }

      // Fetch User Profile
      try {
        const userRes = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` }, // Still needs Bearer prefix here
          }
        );
        setUser(userRes.data.user);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setErrorUser(err.response?.data?.error || "Failed to load profile.");
      } finally {
        setLoadingUser(false);
      }

      // Fetch User's Posts
      try {
        const postsRes = await fetchMyPosts(); // Use postService
        setMyPosts(postsRes.data.myPosts); // Assuming response is { myPosts: [] }
      } catch (err) {
        console.error("Failed to fetch user's posts:", err);
        setErrorPosts(
          err.response?.data?.error || "Failed to load your posts."
        );
      } finally {
        setLoadingPosts(false);
      }

      // Fetch User's Comments
      try {
        const commentsRes = await fetchMyComments(); // Use postService
        setMyComments(commentsRes.data.myComments); // Assuming response is { myComments: [] }
      } catch (err) {
        console.error("Failed to fetch user's comments:", err);
        setErrorComments(
          err.response?.data?.error || "Failed to load your comments."
        );
      } finally {
        setLoadingComments(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  if (loadingUser) {
    return (
      <p className="dashboard-message loading-message">
        Loading user profile...
      </p>
    );
  }

  if (errorUser) {
    return <p className="dashboard-message error-message">{errorUser}</p>;
  }

  if (!user) {
    return (
      <p className="dashboard-message no-user-message">
        User data not found. Please log in again.
      </p>
    );
  }

  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Welcome, {user.name}!</h2>

        {/* User Profile Details */}
        <div className="profile-details">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.department && (
            <p>
              <strong>Department:</strong> {user.department}
            </p>
          )}
          {user.bio && (
            <p>
              <strong>Bio:</strong> {user.bio}
            </p>
          )}
          {user.profileImage && (
            <div className="profile-image-container">
              <img
                src={user.profileImage}
                alt="Profile"
                className="profile-image"
              />
            </div>
          )}
        </div>

        {/* User's Posts Section */}
        <section className="dashboard-sections my-posts-section">
          <h3>Your Recent Posts</h3>
          {loadingPosts ? (
            <p className="loading-message">Loading your posts...</p>
          ) : errorPosts ? (
            <p className="error-message">{errorPosts}</p>
          ) : myPosts.length > 0 ? (
            <div className="my-items-list">
              {myPosts.map((post) => (
                <div key={post._id} className="my-item-card post-item">
                  <h4>{post.title}</h4>
                  <p className="item-content">
                    {post.content.substring(0, 100)}
                    {post.content.length > 100 ? "..." : ""}
                  </p>
                  <small className="item-meta">
                    {post.likes.length} Likes |{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items-message">You haven't made any posts yet.</p>
          )}
        </section>

        {/* User's Comments Section */}
        <section className="dashboard-sections my-comments-section">
          <h3>Your Recent Comments</h3>
          {loadingComments ? (
            <p className="loading-message">Loading your comments...</p>
          ) : errorComments ? (
            <p className="error-message">{errorComments}</p>
          ) : myComments.length > 0 ? (
            <div className="my-items-list">
              {myComments.map((comment) => (
                <div key={comment._id} className="my-item-card comment-item">
                  <p className="item-content">
                    {comment.content.substring(0, 100)}
                    {comment.content.length > 100 ? "..." : ""}
                  </p>
                  <small className="item-meta">
                    on: {comment.post?.title || "Deleted Post"} |{" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items-message">
              You haven't made any comments yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
