import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

//middlewarre
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes); // Use authRoutes for authentication-related endpoints

//BASE route
app.get("/", (req, res) => {
  res.send("Unilink Backend is running");
});

//DB MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Start the server and connect to MongoDB
connectDB();
