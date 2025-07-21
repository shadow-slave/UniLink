// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Expected format: "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // No token provided [cite: 1569]
    return res.status(401).json({ error: "Access denied. No token provided." }); // [cite: 1569, 3654]
  }

  try {
    // Verify the token using your JWT_SECRET [cite: 1572]
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Assign the user ID from the token payload to req.userId [cite: 1573, 3658]
    next(); // Proceed to the next middleware or route handler [cite: 3659]
  } catch (err) {
    // Token is invalid or expired [cite: 1576]
    return res.status(400).json({ error: "Invalid token." }); // [cite: 1576, 3661]
  }
};

export default authMiddleware;
