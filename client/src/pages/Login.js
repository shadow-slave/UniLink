import { useState,useEffect } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom"; // Make sure Link is included
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // New state to track if message is an error
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home"); // Redirect to dashboard if token exists
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsError(false); // Reset error state

    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      setIsError(false);
      setFormData({ email: "", password: "" }); // Clear form
      // Redirect to homepage after a short delay to show success message
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed. Please check your credentials.";
      setMessage(errorMessage);
      setIsError(true); // Set error state to true
      console.error("Login error:", err); // Log the full error for debugging
    }
  };

  return (
    <div className="login-page-wrapper"> {/* Renamed .body to .login-page-wrapper for clarity */}
      <div className="login-form-container"> {/* Renamed .form-container */}
        <h2>Welcome Back</h2> {/* More engaging heading */}
        {/* Conditional styling for messages */}
        {message && (
          <p className={isError ? "message-error" : "message-success"}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="login-form"> {/* Renamed .form */}
          <div className="input-group"> {/* Group inputs for better layout/labeling */}
            <label htmlFor="email">Email</label> {/* Add labels for accessibility */}
            <input
              type="email"
              id="email" // Link label to input
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              required
              aria-label="Email address" // Accessibility attribute
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password" // Link label to input
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              required
              aria-label="Password"
            />
          </div>
          <button type="submit" className="login-button">Login</button> {/* Renamed button class */}
          <p className="signup-prompt">
            Don't have an account? <Link to="/register">Sign Up</Link> {/* Link to Register page */}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;