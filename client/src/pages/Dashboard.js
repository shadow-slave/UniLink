// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  fetchMyPosts,
  fetchMyComments,
  fetchCommentsForPost,
  deletePost,
} from "../services/postService"; // Import deletePost
import { updateUserProfile as updateAuthProfile } from "../services/authService";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const [errorPosts, setErrorPosts] = useState(null);
  const [errorComments, setErrorComments] = useState(null);

  // Profile editing states
  const [editMode, setEditMode] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    bio: "",
    department: "",
    profileImage: "",
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // States for inline comments on Dashboard posts
  const [dashboardCommentsVisible, setDashboardCommentsVisible] = useState({});
  const [dashboardPostComments, setDashboardPostComments] = useState({});
  const [deleteMessage, setDeleteMessage] = useState(""); // NEW: State for delete feedback
  const [isDeleteError, setIsDeleteError] = useState(false); // NEW: State for delete error

  // Function to fetch user profile details
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "") {
      setErrorUser("No token found. Please log in.");
      setLoadingUser(false);
      return;
    }
    try {
      const userRes = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(userRes.data.user);
      setUpdateFormData({
        bio: userRes.data.user.bio || "",
        department: userRes.data.user.department || "",
        profileImage: userRes.data.user.profileImage || "",
      });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setErrorUser(err.response?.data?.error || "Failed to load profile.");
    } finally {
      setLoadingUser(false);
    }
  };

  // Function to fetch user's posts
  const fetchUsersPosts = async () => {
    try {
      const postsRes = await fetchMyPosts();
      setMyPosts(postsRes.data.myPosts);
    } catch (err) {
      console.error("Failed to fetch user's posts:", err);
      setErrorPosts(err.response?.data?.error || "Failed to load your posts.");
    } finally {
      setLoadingPosts(false);
    }
  };

  // Function to fetch user's comments
  const fetchUsersComments = async () => {
    try {
      const commentsRes = await fetchMyComments();
      setMyComments(commentsRes.data.myComments);
    } catch (err) {
      console.error("Failed to fetch user's comments:", err);
      setErrorComments(
        err.response?.data?.error || "Failed to load your comments."
      );
    } finally {
      setLoadingComments(false);
    }
  };

  // Function to toggle comments visibility and fetch them for a specific post on Dashboard
  const toggleDashboardPostComments = async (postId) => {
    setDashboardCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    if (!dashboardCommentsVisible[postId] && !dashboardPostComments[postId]) {
      try {
        const res = await fetchCommentsForPost(postId);
        setDashboardPostComments((prev) => ({
          ...prev,
          [postId]: res.data.comments,
        }));
      } catch (err) {
        console.error(
          `Error fetching comments for dashboard post ${postId}:`,
          err
        );
        alert("Failed to load comments for this post.");
      }
    }
  };

  // NEW: Handle post deletion
  const handleDeletePost = async (postId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      setDeleteMessage(""); // Clear previous messages
      setIsDeleteError(false);
      try {
        const res = await deletePost(postId); // Call deletePost from postService
        setDeleteMessage(res.data.message || "Post deleted successfully!");
        // Filter out the deleted post from the local state
        setMyPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } catch (err) {
        console.error("Error deleting post:", err);
        setDeleteMessage(err.response?.data?.error || "Failed to delete post.");
        setIsDeleteError(true);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUsersPosts();
    fetchUsersComments();
  }, []);

  // Handle changes in update profile form
  const handleUpdateChange = (e) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle update profile form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage("");
    setIsUpdateError(false);
    setIsUpdating(true);

    try {
      const res = await updateAuthProfile(updateFormData);
      setUser(res.data.user);
      setUpdateMessage(res.data.message || "Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setUpdateMessage(
        err.response?.data?.error || "Failed to update profile."
      );
      setIsUpdateError(true);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Conditional Rendering for Loading/Errors ---
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

        {/* Profile Details / Edit Form Toggle */}
        <div className="profile-section">
          {updateMessage && (
            <p className={isUpdateError ? "message-error" : "message-success"}>
              {updateMessage}
            </p>
          )}

          {editMode ? (
            // Edit Profile Form
            <form onSubmit={handleUpdateSubmit} className="edit-profile-form">
              <div className="input-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={updateFormData.bio}
                  onChange={handleUpdateChange}
                ></textarea>
              </div>
              <div className="input-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  placeholder="e.g., Computer Science"
                  value={updateFormData.department}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="profileImage">Profile Image URL</label>
                <input
                  type="url"
                  id="profileImage"
                  name="profileImage"
                  placeholder="e.g., https://example.com/your-pic.jpg"
                  value={updateFormData.profileImage}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // Existing Profile Details Display
            <div className="profile-details">
              <div className="profile-header">
                {user.profileImage && (
                  <div className="profile-image-container">
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="profile-image"
                    />
                  </div>
                )}
                <h3>{user.name}</h3>
                <p className="user-email">{user.email}</p>
              </div>
              <div className="profile-info">
                {user.department && (
                  <p>
                    <strong>Department:</strong> {user.department}
                  </p>
                )}
                {user.bio ? (
                  <p>
                    <strong>Bio:</strong> {user.bio}
                  </p>
                ) : (
                  <p className="no-info-message">Bio not set.</p>
                )}
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="edit-profile-button"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Delete Post Message */}
        {deleteMessage && (
          <p className={isDeleteError ? "message-error" : "message-success"}>
            {deleteMessage}
          </p>
        )}

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
                  <div className="post-item-header">
                    <h4>
                      <Link to={`/feed#${post._id}`} className="post-link">
                        {post.title}
                      </Link>
                    </h4>
                    <button
                      className="delete-post-button"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <img
                        src="/icons/delete.png"
                        alt="Delete post"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </button>
                  </div>
                  <p className="item-content">
                    {post.content.substring(0, 100)}
                    {post.content.length > 100 ? "..." : ""}
                  </p>
                  <small className="item-meta">
                    {post.likes.length} Likes | {post.commentCount} Comments |{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                  {/* Toggle Comments Button and Section for Dashboard Posts */}
                  <div className="dashboard-post-actions">
                    <button
                      className="comment-toggle-button"
                      onClick={() => toggleDashboardPostComments(post._id)}
                    >
                      💬 {dashboardCommentsVisible[post._id] ? "Hide" : "Show"}{" "}
                      Comments
                    </button>
                  </div>
                  {dashboardCommentsVisible[post._id] && (
                    <div className="dashboard-comments-section">
                      {dashboardPostComments[post._id] ? (
                        dashboardPostComments[post._id].length > 0 ? (
                          <div className="dashboard-comment-list">
                            {dashboardPostComments[post._id].map((comment) => (
                              <div
                                key={comment._id}
                                className="dashboard-comment-item"
                              >
                                <p className="dashboard-comment-content">
                                  {comment.content}
                                </p>
                                <small className="dashboard-comment-author">
                                  - {comment.author?.name || "Unknown"} on{" "}
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString()}
                                </small>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-comments-message">
                            No comments yet on this post.
                          </p>
                        )
                      ) : (
                        <p className="loading-comments-message">
                          Loading comments for this post...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items-message">You haven't made any posts yet.</p>
          )}
        </section>

        {/* User's Comments Section (Existing) */}
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
                    on:{" "}
                    <Link
                      to={`/feed#${comment.post?._id}`}
                      className="post-link"
                    >
                      {comment.post?.title || "Deleted Post"}
                    </Link>{" "}
                    | {new Date(comment.createdAt).toLocaleDateString()}
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
