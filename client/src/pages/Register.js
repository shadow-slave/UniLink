import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import "../styles/registerLogin.css"; // Ensure this import is correct

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", // Changed from username to name for consistency with backend User model
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // New state to track if message is an error
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Form validation to enable/disable button
  const isFormValid = formData.name && formData.email && formData.password;

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
      await registerUser(formData); // Call the registerUser service [cite: 723]
      setMessage("Registration successful! Redirecting to login...");
      setIsError(false);
      setFormData({ name: "", email: "", password: "" }); // Clear form

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login"); // Navigate to the login route [cite: 1422]
      }, 1500); // Give user time to read the success message
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      setMessage(errorMessage);
      setIsError(true); // Set error state to true
      console.error("Registration error:", err); // Log the full error for debugging
    }
  };

  return (
    <div className="login-page-wrapper">
      {" "}
      {/* Consistent wrapper class for full page background and centering */}
      <div className="login-form-container">
        {" "}
        {/* Consistent container for the glassy form style [cite: 1924] */}
        <h2>Sign Up</h2> {/* Engaging heading */}
        {message && (
          <p className={isError ? "message-error" : "message-success"}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          {" "}
          {/* Consistent form styling [cite: 1947] */}
          <div className="input-group">
            {" "}
            {/* Group inputs with labels for better structure and accessibility */}
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              value={formData.name}
              required
              aria-label="Your full name"
            />
          </div>
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
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              value={formData.password}
              required
              aria-label="Create a password"
            />
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={!isFormValid}
          >
            Register
          </button>
          <p className="signup-prompt">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
