const User = require('../models/User');
const { ensureBalanceExists } = require('../utils/initBalances');
const calculateTotalBalance = require('../utils/calculateTotalBalance');

// GET total balance (Currency filter optional)
const getTotalBalance = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { currency } = req.query;
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const visibleBalances = user.balances.filter(b =>
      ['salafi', 'bank', 'fms'].includes(b.type) && (!currency || b.currency === currency)
    );

    const total = calculateTotalBalance(visibleBalances, currency);
    res.json({ total, balances: visibleBalances });
  } catch (error) {
    console.error('Get Total Balance Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST add balance
const addBalance = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { type, subType, currency, amount } = req.body;

    if (!type || !subType || !currency || !amount) {
      return res.status(400).json({ error: 'Type, subType, currency, and amount are required' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const balance = ensureBalanceExists(user, type, subType, currency);
    balance.amount += amount;

    await user.save();
    res.json({ message: 'Balance added successfully', balance });
  } catch (error) {
    console.error('Add Balance Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST deduct balance
const deductBalance = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { type, subType, currency, amount } = req.body;

    if (!type || !subType || !currency || !amount) {
      return res.status(400).json({ error: 'Type, subType, currency, and amount are required' });
    }

    if (['my_savings', 'my_loan'].includes(type)) {
      return res.status(400).json({ error: 'Cannot deduct from My Savings or My Loan' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const balance = ensureBalanceExists(user, type, subType, currency);

    if (balance.amount < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    balance.amount -= amount;
    await user.save();
    res.json({ message: 'Balance deducted successfully', balance });
  } catch (error) {
    console.error('Deduct Balance Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTotalBalance, addBalance, deductBalance };