// server/routes/postRoutes.js
import express from "express";
import {
  createPost,
  getAllPosts,
  likeUnlikePost,
  addComment,
  getCommentsForPost,
  getMyPosts, 
  getMyComments,
  deletePost
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import authentication middleware

const router = express.Router();

// Post creation route (protected) [cite: 1614]
router.post("/", authMiddleware, createPost);
// Get all posts route (public) [cite: 1615]
router.get("/", getAllPosts);

// Like/Unlike post route (protected)
router.post("/:id/like", authMiddleware, likeUnlikePost);

// Comment routes
router.post("/:id/comments", authMiddleware, addComment); // Add comment (protected)
router.get("/:id/comments", getCommentsForPost); // Get comments for a post (public)

// Protected routes for Dashboard

router.get("/my-posts", authMiddleware, getMyPosts);     // Get posts by the authenticated user
router.get("/my-comments", authMiddleware, getMyComments); // Get comments by the authenticated user

// Delete post route (protected and only author can delete)
router.delete("/:id", authMiddleware, deletePost);

export default router;
