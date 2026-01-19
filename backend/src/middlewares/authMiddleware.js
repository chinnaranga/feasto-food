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

export const admin = async (req, res, next) => {
  if (req.user && (req.user.email === "admin@aerobite.com" || req.user.email?.includes("admin"))) {
    next();
  } else {
    // For more robustness, we could fetch firestore user doc here, 
    // but for this MVP phase, email check aligns with frontend logic.
    res.status(403).json({ error: "Not authorized as an admin" });
  }
};
