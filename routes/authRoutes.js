const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post('/signup', async (req, res) => {
  console.log("✅ [Signup] Route hit");

  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'Please provide name, email, phone number, and password' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ [Signup] Email already exists:", email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    console.log("✅ [Signup] User created:", user.email);
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error("❌ [Signup] Error:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login an existing user
 */
router.post('/login', async (req, res) => {
  console.log("✅ [Login] Route hit");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ [Login] Invalid credentials: Email not found ->", email);
      return res.status(401).json({ message: 'Invalid credentials (email not found)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🧪 [Login] Password match:", isMatch);

    if (!isMatch) {
      console.warn("⚠️ [Login] Invalid credentials: Password mismatch ->", email);
      return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
    }

    // ✅ Generate JWT token with fallback secret
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'defaultSecret123',
      { expiresIn: '1d' }
    );

    console.log("✅ [Login] Login successful for:", user.email);

    // ✅ Send token and user in response
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("❌ [Login] Error:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
