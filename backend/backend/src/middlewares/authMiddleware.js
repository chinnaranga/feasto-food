import { auth } from "../config/firebase.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // 1. Verify Firebase ID Token
    const decodedToken = await auth.verifyIdToken(token);

    // 2. Sync with MongoDB
    let user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      user = await User.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || "User",
        photoURL: decodedToken.picture,
        role: 'user' // Default role
      });
    }

    // 3. Attach User to Request
    req.user = user;

    next();
  } catch (err) {
    console.error(`Auth Middleware Error: ${err.message}. Token length: ${token.length}, Starts with: ${token.substring(0, 15)}...`);
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
