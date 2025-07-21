// server/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcrypt"; // For password hashing [cite: 2564]
import jwt from "jsonwebtoken"; // For token-based authentication [cite: 2565]

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." }); // [cite: 2751, 2808]
    }

    // Hash the password [cite: 2753]
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      department,
      bio,
    });

    await newUser.save(); // Save the new user to the database
    res.status(201).json({ message: "User registered successfully." }); // [cite: 2762, 2810]
  } catch (err) {
    console.error("Registration error:", err); // Log the actual error
    res.status(500).json({ error: "Registration failed." }); // [cite: 2764, 2813]
  }
};

// Login an existing user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." }); // [cite: 2773, 2810]
    }

    // Compare provided password with hashed password in DB [cite: 2774]
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." }); // [cite: 2775, 2812]
    }

    // Generate JWT token [cite: 2782]
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d", // Token expires in 3 days [cite: 2783]
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        profileImage: user.profileImage,
        bio: user.bio,
      },
    }); // Send token and user info [cite: 2785]
  } catch (err) {
    console.error("Login error:", err); // Log the actual error
    res.status(500).json({ error: "Login failed." }); // [cite: 2797, 2813]
  }
};

// Get authenticated user's profile
export const getUserProfile = async (req, res) => {
  try {
    // req.userId is set by authMiddleware after token verification
    const user = await User.findById(req.userId).select("-password"); // Find user by ID, exclude password from response
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ user }); // Respond with the user object
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};
