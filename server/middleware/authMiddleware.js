import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

export default authMiddleware;
// This middleware checks for a JWT in the request headers, verifies it, and attaches the user ID to the request object if valid. If the token is missing or invalid, it sends an appropriate error response. This is useful for protecting routes that require authentication.
// It is typically used in Express.js applications to secure API endpoints, ensuring that only authenticated users can access certain resources or perform specific actions. The middleware can be applied to routes that require user authentication, allowing the application to enforce security measures effectively.
// The middleware can be applied to routes that require user authentication, allowing the application to enforce security measures effectively. For example, it can be used in a route handler like this: