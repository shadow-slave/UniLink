// server/routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile, 
} from "../controllers/authController.js"; // Import controller functions
import authMiddleware from "../middleware/authMiddleware.js"; // Import authentication middleware

const router = express.Router();

router.post("/register", registerUser); // Route for user registration
router.post("/login", loginUser); // Route for user login
router.get("/profile", authMiddleware, getUserProfile); // Protected route to get user profile [cite: 2799, 2800, 2801, 2802]
router.put('/profile', authMiddleware, updateUserProfile); // NEW: Protected route to update profile

export default router;
