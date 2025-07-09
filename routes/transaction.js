const express = require('express');
const router = express.Router();
const tokenMiddleware = require('../middlewares/tokenHandler');
const User = require('../models/User');

// এই রাউটটি সুরক্ষিত, এখানে লেনদেন বা অন্য কাজ হবে
router.post('/pay', tokenMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // লেনদেনের সময় আপডেট
    user.lastTransactionTime = new Date();
    await user.save();

    res.json({
      message: 'Transaction successful',
      username: user.username,
      lastTransactionTime: user.lastTransactionTime,
    });
  } catch (err) {
    res.status(500).json({ message: 'Transaction failed', error: err.message });
  }
});

module.exports = router;