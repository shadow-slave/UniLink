// src/components/Footer.js
import React from "react";
import "../styles/Footer.css"; // Create this CSS file next

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} UniLink. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
