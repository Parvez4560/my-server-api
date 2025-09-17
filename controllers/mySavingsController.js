const User = require('../models/User');

// Get My Savings balance for a user
const getMySavings = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await User.findOne({ phoneNumber });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const savingsBalance = user.balances.find(b => b.type === 'my_savings') || { amount: 0 };
    res.json({ mySavings: savingsBalance.amount });

  } catch (err) {
    console.error('Error getting My Savings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update My Savings balance (admin only)
const updateMySavings = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { amount } = req.body; // positive to add, negative to reduce

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const savingsBalance = user.balances.find(b => b.type === 'my_savings');
    if (!savingsBalance) {
      user.balances.push({ type: 'my_savings', amount: amount || 0 });
    } else {
      savingsBalance.amount += amount || 0;
    }

    await user.save();
    res.json({ message: 'My Savings updated', mySavings: savingsBalance ? savingsBalance.amount : amount });

  } catch (err) {
    console.error('Error updating My Savings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMySavings, updateMySavings };