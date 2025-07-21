// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css"; // We will create this CSS file next

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // You'll need to create a backend API endpoint for fetching user profile
        // For now, we'll assume a /api/user/profile route
        // This is a placeholder; modify as per your actual backend setup for user profiles.
        // If your login response already returns all user details, you might store them
        // in localStorage or a context and retrieve them directly without an extra API call.
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          // Assuming a /api/auth/profile endpoint
          headers: {
            Authorization: token,
          },
        });
        setUser(res.data.user); // Assuming user data is under .user
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <p className="dashboard-message loading-message">Loading dashboard...</p>
    );
  }

  if (error) {
    return <p className="dashboard-message error-message">{error}</p>;
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
        {/* You can add more dashboard features here */}
        <section className="dashboard-sections">
          <h3>Your Recent Activity (Coming Soon!)</h3>
          <p>
            This section will display your latest posts, comments, and
            interactions.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
