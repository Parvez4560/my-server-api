const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ Get all users (excluding passwords)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get user by ID
router.get('/by-id/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get user by Number
router.get('/by-number/:number', async (req, res) => {
  try {
    const user = await User.findOne({ number: req.params.number }, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update user balance (Add/Remove/Set)
router.put('/update-balance/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const { type, amount, operation } = req.body; 
    // example body:
    // { "type": "my_savings", "amount": 500, "operation": "set" }
    // operation can be: "set", "increase", "decrease"

    const user = await User.findOne({ number });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find balance by type
    const balance = user.balances.find(b => b.type === type);
    if (!balance) return res.status(400).json({ message: 'Balance type not found' });

    if (operation === 'set') {
      balance.amount = amount;
    } else if (operation === 'increase') {
      balance.amount += amount;
    } else if (operation === 'decrease') {
      balance.amount -= amount;
      if (balance.amount < 0) balance.amount = 0; // নেগেটিভ হলে 0
    } else {
      return res.status(400).json({ message: 'Invalid operation type' });
    }

    await user.save();

    res.json({ 
      message: 'Balance updated successfully', 
      balances: user.balances 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;