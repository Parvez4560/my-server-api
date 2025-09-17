const User = require('../models/User');

// Get My Loan balance for a user
const getMyLoan = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await User.findOne({ phoneNumber });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const loanBalance = user.balances.find(b => b.type === 'my_loan') || { amount: 0 };
    res.json({ myLoan: loanBalance.amount });

  } catch (err) {
    console.error('Error getting My Loan:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update My Loan balance (admin only)
const updateMyLoan = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { amount } = req.body; // positive to add, negative to reduce

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const loanBalance = user.balances.find(b => b.type === 'my_loan');
    if (!loanBalance) {
      user.balances.push({ type: 'my_loan', amount: amount || 0 });
    } else {
      loanBalance.amount += amount || 0;
    }

    await user.save();
    res.json({ message: 'My Loan updated', myLoan: loanBalance ? loanBalance.amount : amount });

  } catch (err) {
    console.error('Error updating My Loan:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMyLoan, updateMyLoan };