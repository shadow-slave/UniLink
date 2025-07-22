// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom"; // For navigation
import Footer from "../components/Footer"; // Import the Footer component
import "../styles/HomePage.css"; // Ensure this CSS file is comprehensive

const HomePage = () => {
  return (
    <div className="home-page-wrapper">
      {/* Hero Section - Your existing content */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to UniLink</h1>
          <p className="hero-subtitle">
            Bringing your campus community together. Share, connect, and grow
            with your university peers.
          </p>
          {/* Link to a relevant action, like registration or exploring posts */}
          <Link to="/register" className="cta-button">
            Get Started
          </Link>
        </div>
        <div className="hero-image-container">
          {/* Ensure uniStu.jpg is in your public folder */}
          <img src="/uniStu.jpg" alt="Campus students" className="hero-image" />
        </div>
      </section>
      {/* New: Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why UniLink?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <h3>Post & Share Knowledge</h3>
            <p>
              Share notes, ask questions, and post important announcements for
              your campus community.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👍💬</span>
            <h3>Engage & Interact</h3>
            <p>
              Like posts that resonate, leave insightful comments, and start
              discussions with peers.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🧑‍🎓</span>
            <h3>Connect with Peers</h3>
            <p>
              Find students from your department or year, and build a strong
              academic network.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <h3>Personalized Dashboard</h3>
            <p>
              Track your activity, manage your profile, and see your
              contributions at a glance.
            </p>
          </div>
        </div>
      </section>
      {/* New: Call to Action Section */}
      <section className="cta-join-section" >
        <h2 className="section-title">Ready to Join Your Campus Community?</h2>
        <p className="section-subtitle">
          Sign up today and start connecting with thousands of students like
          you!
        </p>
        <Link
          to="/register"
          className="cta-button secondary"
        >
          Sign Up Now
        </Link>
      </section>
      {/* Footer Component */}
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default HomePage;
