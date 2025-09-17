const User = require('../models/User');
const calculateTotalBalance = require('../utils/calculateTotalBalance');

// GET total balance (only Salafi + Bank + FMS)
const getTotalBalance = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const visibleBalances = user.balances.filter(b =>
      ['salafi', 'bank', 'fms'].includes(b.type)
    );

    const total = calculateTotalBalance(visibleBalances);
    res.json({ total, balances: visibleBalances });
  } catch (error) {
    console.error('Get Total Balance Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST add balance to user
const addBalance = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { type, subType, amount } = req.body;

    if (!type || (['salafi','bank','fms'].includes(type) && !subType) || !amount) {
      return res.status(400).json({ error: 'Type, subType and amount are required' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const balanceIndex = user.balances.findIndex(
      b => b.type === type && (b.subType || null) === (subType || null)
    );

    if (balanceIndex === -1) return res.status(400).json({ error: 'Balance type/subType not found' });

    user.balances[balanceIndex].amount += amount;
    await user.save();

    res.json({ message: 'Balance added successfully', balance: user.balances[balanceIndex] });
  } catch (error) {
    console.error('Add Balance Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST deduct balance (only Salafi + Bank + FMS)
const deductBalance = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { type, subType, amount } = req.body;

    if (!type || (['salafi','bank','fms'].includes(type) && !subType) || !amount) {
      return res.status(400).json({ error: 'Type, subType and amount are required' });
    }

    if (['my_savings', 'my_loan'].includes(type)) {
      return res.status(400).json({ error: 'Cannot deduct from My Savings or My Loan' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const balanceIndex = user.balances.findIndex(
      b => b.type === type && (b.subType || null) === (subType || null)
    );

    if (balanceIndex === -1) return res.status(400).json({ error: 'Balance type/subType not found' });

    if (user.balances[balanceIndex].amount < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    user.balances[balanceIndex].amount -= amount;
    await user.save();

    res.json({ message: 'Balance deducted successfully', balance: user.balances[balanceIndex] });
  } catch (error) {
    console.error('Deduct Balance Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTotalBalance, addBalance, deductBalance };