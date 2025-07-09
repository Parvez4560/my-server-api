const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// 🔐 Config
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const TOKEN_EXPIRY_MINUTES = parseInt(process.env.TOKEN_EXPIRY_MINUTES || '10');
const TOKEN_REFRESH_WINDOW = parseInt(process.env.TOKEN_REFRESH_WINDOW || '3');

// ✅ Middleware: Verify + Refresh Token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const now = Date.now();
    const issuedAt = decoded.iat * 1000;
    const usedTime = (now - issuedAt) / (60 * 1000);

    const user = await User.findOne({ phoneNumber: decoded.phoneNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Auto-refresh token if needed
    if (usedTime > (TOKEN_EXPIRY_MINUTES - TOKEN_REFRESH_WINDOW)) {
      const refreshedToken = jwt.sign(
        { phoneNumber: user.phoneNumber },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY_MINUTES * 60 }
      );
      res.setHeader('x-refreshed-token', refreshedToken);
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Register
router.post('/register', async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Phone and password required' });
    }

    const exists = await User.findOne({ phoneNumber });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ phoneNumber, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }

    const token = jwt.sign(
      { phoneNumber: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY_MINUTES * 60 }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.user.phoneNumber }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Update Password
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ phoneNumber: req.user.phoneNumber });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Sample Protected Route
router.post('/transaction', authenticateToken, (req, res) => {
  res.json({ message: 'Transaction successful', user: req.user });
});

// ✅ Check if Account Exists (Used by App)
router.get('/check-account', async (req, res) => {
  try {
    const phone = req.query.phone;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = await User.findOne({ phoneNumber: phone });
    res.json({ exists: !!user });
  } catch (err) {
    console.error('❌ Error in /auth/check-account:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Export
module.exports = {
  router,
  authenticateToken
};