// src/components/Navbar.js
import React, { useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; // Ensure this CSS file is comprehensive for burger menu styling

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to manage mobile menu open/close

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle menu state
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false); // Close menu when a nav link is clicked
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={handleNavLinkClick}>
        UniLink
      </Link>

      {/* Burger Icon for Mobile */}
      {/* This div acts as the burger button */}
      <div
        className={`burger-menu ${isMobileMenuOpen ? "open" : ""}`}
        onClick={toggleMobileMenu}
      >
        <div className="line1"></div> {/* Top line of the burger icon */}
        <div className="line2"></div> {/* Middle line */}
        <div className="line3"></div> {/* Bottom line */}
      </div>

      {/* Navigation Links */}
      {/* The 'open' class will control mobile menu visibility and animation */}
      <div className={`navbar-links ${isMobileMenuOpen ? "open" : ""}`}>
        <Link to="/feed" className="nav-item" onClick={handleNavLinkClick}>
          Feed
        </Link>

        {!token ? (
          <>
            <Link to="/login" className="nav-item" onClick={handleNavLinkClick}>
              Login
            </Link>
            <Link
              to="/register"
              className="nav-item nav-button-primary"
              onClick={handleNavLinkClick}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/create"
              className="nav-item"
              onClick={handleNavLinkClick}
            >
              Create Post
            </Link>
            <Link to="/home" className="nav-item" onClick={handleNavLinkClick}>
              Dashboard
            </Link>{" "}
            <button onClick={handleLogout} className="nav-item nav-button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
