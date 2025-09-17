const User = require('../models/User');

// GET total balance by phone number
const getTotalBalance = async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const total = user.balances.reduce((sum, b) => sum + (b.amount || 0), 0);
    res.json({ phoneNumber: user.phoneNumber, totalBalance: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST add balance by phone number
const addBalance = async (req, res) => {
  try {
    const { amount, type } = req.body;
    if (!amount || !type) return res.status(400).json({ error: 'Amount and type are required' });

    const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    let balance = user.balances.find(b => b.type === type);
    if (!balance) {
      balance = { type, amount: 0 };
      user.balances.push(balance);
    }

    balance.amount += amount;
    await user.save();

    res.json({ phoneNumber: user.phoneNumber, balances: user.balances });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTotalBalance, addBalance };