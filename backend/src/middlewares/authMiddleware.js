import { auth } from "../config/firebase.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify Firebase ID Token
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // attach user info (uid, email, etc.)
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
