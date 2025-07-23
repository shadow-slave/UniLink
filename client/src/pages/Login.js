// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "../styles/registerLogin.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      setIsError(false);
      setFormData({ email: "", password: "" });
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setMessage(errorMessage);
      setIsError(true);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-form-container">
        <h2>Welcome Back</h2>
        {message && (
          <p className={isError ? "message-error" : "message-success"}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              required
              aria-label="Email address"
            />
          </div>
          <div className="input-group password-input-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              required
              aria-label="Password"
            />
            <button
              type="button" 
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <img
                  src="/icons/eye-closed.png"
                  alt="Hide password"
                  style={{ width: "20px", height: "20px" }}
                />
              ) : (
                <img
                  src="/icons/eye-open.png"
                  alt="Show password"
                  style={{ width: "20px", height: "20px"}}
                />
              )}
            </button>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="signup-prompt">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
