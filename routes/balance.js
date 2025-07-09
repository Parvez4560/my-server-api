const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('./auth');

// ব্যালেন্স দেখার রাউট
router.get('/', authenticateToken, async (req, res) => {
  try {
    // ফোন নাম্বার দিয়ে ইউজার খোঁজা (Token থেকে username = phoneNumber)
    const user = await User.findOne({ phoneNumber: req.user.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ব্যালেন্স ইনফো accountInfo.balance থেকে পাওয়া যাচ্ছে
    const balance = user.accountInfo?.balance || {};

    res.json({
      defaultBalanceType: user.defaultBalanceType || 'salafi_balance',
      balance
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;