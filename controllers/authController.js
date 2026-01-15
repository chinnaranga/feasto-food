import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const normalizedUsername = username.toLowerCase();

    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Signup failed',
      error: err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const normalizedUsername = username.toLowerCase();

    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Login failed',
      error: err.message
    });
  }
};
