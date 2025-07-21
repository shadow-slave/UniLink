// server/app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"; // Import authentication routes
import postRoutes from "./routes/postRoutes.js"; // Import post routes

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend-backend communication [cite: 2563]
app.use(express.json()); // Enable parsing of JSON request bodies [cite: 2583]

// Routes
app.use("/api/auth", authRoutes); // Authentication routes for user registration, login, and profile [cite: 2847]
app.use("/api/posts", postRoutes); // Post-related routes for creation, viewing, likes, and comments

// Base test route (health check) [cite: 2849]
app.get("/", (req, res) => {
  res.send("UniLink backend is running"); // [cite: 2665]
});

// MongoDB connection and Server Start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Connect to MongoDB using URI from .env [cite: 2589, 2854]
      useNewUrlParser: true, // [cite: 2590, 2855]
      useUnifiedTopology: true, // [cite: 2591, 2856]
    });
    console.log("MongoDB connected successfully"); // [cite: 2593, 2858, 2893]

    app.listen(
      PORT,
      () =>
        // Start the Express server [cite: 2594, 2859]
        console.log(`Server is running on port ${PORT}`) // [cite: 2595, 2861, 2894]
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error); // Log connection errors [cite: 2596, 2862, 2894]
    process.exit(1); // Exit process with failure code
  }
};

connectDB(); // Call the function to connect to DB and start server
