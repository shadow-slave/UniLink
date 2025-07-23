// src/services/authService.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Make sure this baseURL is correct (your deployed Render URL if applicable)
});

// NEW: Interceptor to add Authorization header to all requests made via this API instance
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Bearer token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);

// NEW: Function to update user profile
export const updateUserProfile = (profileData) =>
  API.put("/auth/profile", profileData);
