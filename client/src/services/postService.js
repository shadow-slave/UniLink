// src/services/postService.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
});

// Interceptor to add Authorization header to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // FIX: Add "Bearer " prefix to the token
      config.headers.Authorization = `Bearer ${token}`; // Corrected line
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Post-related API calls
export const fetchAllPosts = () => API.get("/posts");
export const createNewPost = (postData) => API.post("/posts", postData); // This might already be in authService, we are centralizing

// Like/Unlike API calls
export const likeUnlikePost = (postId) => API.post(`/posts/${postId}/like`);

// Comment API calls
export const addCommentToPost = (postId, commentData) =>
  API.post(`/posts/${postId}/comments`, commentData);
export const fetchCommentsForPost = (postId) =>
  API.get(`/posts/${postId}/comments`);

// API calls for user's own posts and comments
export const fetchMyPosts = () => API.get("/posts/my-posts");
export const fetchMyComments = () => API.get("/posts/my-comments");
// Delete a post
export const deletePost = (postId) => API.delete(`/posts/${postId}`);
