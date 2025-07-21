import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; // Import your CSS for styling
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        UniLink
      </Link>
      <div className="navbar-links">
        <Link to="/feed" className="nav-item">
          Feed
        </Link>

        {!token ? (
          <>
            <Link to="/login" className="nav-item">
              Login
            </Link>
            <Link to="/register" className="nav-item nav-button-primary">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/create" className="nav-item">
              Create Post
            </Link>
            <Link to="/home" className="nav-item">
              Dashboard
            </Link>{" "}
            {/* Added for a logged-in user home */}
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
