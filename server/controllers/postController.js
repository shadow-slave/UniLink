// server/controllers/postController.js
import Post from "../models/Post.js";
import Comment from "../models/Comment.js"; // Import the new Comment model

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    // req.userId is expected to be set by authMiddleware
    const newPost = new Post({
      title,
      content,
      author: req.userId, // User ID from authMiddleware
    });
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err); // Log the actual error
    res.status(500).json({ error: "Failed to create post." });
  }
};

// Get all posts, populated with author details
export const getAllPosts = async (_req, res) => {
  // console.log("Attempting to fetch all posts...");
  try {
    // Populate author name and email [cite: 1603]
    const posts = await Post.find()
      .populate("author", "name email") // Populates the 'author' field from the 'User' collection
      .sort({ createdAt: -1 }); // Sort by newest first
    // console.log("Posts fetched successfully:", posts.length);
    res.status(200).json(posts);
  } catch (err) {
    // [cite: 1604]
    console.error("Error in getAllPosts:", err); // [cite: 1605]
    res.status(500).json({ error: "Failed to fetch posts." }); // [cite: 1606]
  }
};

// Like or Unlike a post
export const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const userId = req.userId; // User ID from authMiddleware [cite: 1573]

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Ensure likes is always an array (important for older posts or initial setup)
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // User already liked it, so unlike (remove userId)
      post.likes = post.likes.filter(
        (userThatLikedId) => userThatLikedId.toString() !== userId.toString()
      );
    } else {
      // User has not liked it, so like (add userId)
      post.likes.push(userId);
    }

    await post.save(); // Save the updated post with new likes array
    res.status(200).json({ message: "Like status updated", post }); // Respond with the updated post
  } catch (err) {
    // [cite: 1597]
    console.error("Error liking/unliking post:", err); // [cite: 1598]
    res.status(500).json({ error: "Failed to like/unlike post." }); // [cite: 1599]
  }
};

// Add a comment to a specific post
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { content } = req.body; // Comment content
    const authorId = req.userId; // User ID from authMiddleware [cite: 1573]

    if (!content) {
      return res
        .status(400)
        .json({ error: "Comment content cannot be empty." });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const newComment = new Comment({
      content,
      author: authorId,
      post: id, // Link comment to the specific post
    });

    await newComment.save();
    // Populate author info for the response to easily display on frontend
    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "name email"
    );

    res
      .status(201)
      .json({
        message: "Comment added successfully",
        comment: populatedComment,
      });
  } catch (err) {
    // [cite: 1699]
    console.error("Error adding comment:", err); // [cite: 1700]
    res.status(500).json({ error: "Failed to add comment." }); // [cite: 1701]
  }
};

// Get all comments for a specific post
export const getCommentsForPost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const comments = await Comment.find({ post: id }) // Find comments where 'post' field matches the ID
      .populate("author", "name email") // Populate author details
      .sort({ createdAt: 1 }); // Sort by oldest first for chronological order

    res.status(200).json({ comments }); // Wrap comments in an object
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.userId; // User ID from authMiddleware
    const posts = await Post.find({ author: userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ myPosts: posts });
  } catch (err) {
    console.error("Error fetching user's posts:", err);
    res.status(500).json({ error: "Failed to fetch your posts." });
  }
};

// NEW: Get all comments created by the authenticated user
export const getMyComments = async (req, res) => {
  try {
    const userId = req.userId; // User ID from authMiddleware
    const comments = await Comment.find({ author: userId })
      .populate("post", "title") // Populate post title for context
      .populate("author", "name email") // Populate author details (even though it's "me")
      .sort({ createdAt: -1 });
    res.status(200).json({ myComments: comments });
  } catch (err) {
    console.error("Error fetching user's comments:", err);
    res.status(500).json({ error: "Failed to fetch your comments." });
  }
};