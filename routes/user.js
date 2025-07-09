const express = require('express');
const router = express.Router();
const User = require('../models/User');

//  GET /user/all → Get all users (excluding passwords)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  GET /user/by-id/:id → Get single user by Mongo _id
router.get('/by-id/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  GET /user/by-phone/:phoneNumber → Get single user by phone number
router.get('/by-phone/:phoneNumber', async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.params.phoneNumber }, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by phone:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;