import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth as firebaseAuth } from '../config/firebase.js';

/**
 * Firebase to JWT Token Exchange
 * Converts Firebase ID token to application JWT with roles/scopes
 */
export const firebaseToJWT = async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    return res.status(400).json({ error: 'Firebase token required' });
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(firebaseToken);

    // Get user from database (Firestore or MongoDB)
    const userId = decodedToken.uid;
    const userDoc = await req.db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // Create JWT payload with standardized format
    const jwtPayload = {
      uid: userId,
      role: userData.role || 'user',
      scope: userData.scope || [],
      email: decodedToken.email
    };

    // Sign access token (short-lived)
    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
    });

    // Sign refresh token (long-lived) - optional
    const refreshToken = jwt.sign(
      { uid: userId },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
    );

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        uid: userId,
        email: decodedToken.email,
        role: userData.role,
        name: userData.name
      }
    });
  } catch (error) {
    console.error('Firebase token exchange error:', error);
    return res.status(401).json({ error: 'Invalid Firebase token' });
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