// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token"); // Get token from local storage
      console.log(
        "Dashboard: Token read from localStorage:",
        token ? "Found" : "NOT Found"
      ); // <-- DEBUG LOG

      // Check if token is null/undefined OR an empty string
      if (!token || token === "") {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            // FIX: Add "Bearer " prefix as required by backend authMiddleware
            Authorization: `Bearer ${token}`, // Corrected Authorization header
          },
        });
        setUser(res.data.user); // Assuming user data is under .user property
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(
          err.response?.data?.error ||
            "Failed to load profile. Please try again."
        );
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this runs once on component mount

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
