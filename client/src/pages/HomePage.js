// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom"; // For navigation
import Footer from "../components/Footer"; // Import the Footer component
import "../styles/HomePage.css"; // Create this CSS file next

const HomePage = () => {
  return (
    <div className="home-page-wrapper">
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
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default HomePage;
