import User from '../models/User.js';
import bcrypt from 'bcryptjs'; // Ensure correct import
import jwt from 'jsonwebtoken';
import { auth as firebaseAuth } from '../config/firebase.js';
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

/**
 * Firebase to JWT Token Exchange
 * Converts Firebase ID token to application JWT with roles/scopes
 */
export const loginWithOTP = async (req, res) => {
  try {
    // 1. Extract Token from Header (Preferred) or Body
    let firebaseToken = req.body.firebaseToken;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      firebaseToken = authHeader.split(" ")[1];
    }

    if (!firebaseToken) {
      return res.status(401).json({ error: "No token provided" }); // 401 for Auth missing
    }

    // 2. Verify with Firebase Admin
    const decoded = await firebaseAuth.verifyIdToken(firebaseToken);
    const uid = decoded.uid;

    // 3. Check for Admin Claim logic
    let role = "user";
    if (decoded.admin === true) {
      role = "admin";
    }

    // Fetch user from DB (Mongo / Firestore) or use decoded info
    const user = { uid, role };

    const access = signAccessToken(user);
    const refresh = signRefreshToken(user);

    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      secure: true, // Use secure cookies in production
      sameSite: "strict"
    });

    res.json({ accessToken: access });
  } catch (error) {
    console.error("Login OTP Error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created', userId: user._id, token });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};