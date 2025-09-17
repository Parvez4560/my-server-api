// routes/adminBalanceRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { DEFAULT_BALANCES } = require('../utils/initBalances');

// Add new balance type (Admin)
router.post('/add-balance-type', async (req, res) => {
  try {
    const { accountType, type, subTypes } = req.body;
    if (!accountType || !type) {
      return res.status(400).json({ message: 'Account type and balance type required' });
    }

    // DEFAULT_BALANCES আপডেট
    if (!DEFAULT_BALANCES[accountType]) DEFAULT_BALANCES[accountType] = [];
    if (!DEFAULT_BALANCES[accountType].some(b => b.type === type)) {
      DEFAULT_BALANCES[accountType].push({ type, subTypes: subTypes || [] });
    }

    // সব একাউন্টে নতুন ব্যালেন্স যোগ করা
    const filter = { accountType };
    const accounts = await User.find(filter);

    for (let user of accounts) {
      const exists = user.balances.some(b => b.type === type);
      if (!exists) {
        if (subTypes && subTypes.length) {
          subTypes.forEach(st => user.balances.push({ type, subType: st, amount: 0 }));
        } else {
          user.balances.push({ type, amount: 0 });
        }
        await user.save();
      }
    }

    res.json({ message: `Balance type '${type}' added for ${accountType} accounts with zero amount` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add subtype to existing balance type
router.post('/add-subtype', async (req, res) => {
  try {
    const { type, subType } = req.body;
    if (!type || !subType) return res.status(400).json({ message: 'Type and subType required' });

    const accounts = await User.find({ 'balances.type': type });

    for (let user of accounts) {
      const balance = user.balances.find(b => b.type === type);
      if (!balance.subType && !balance.subTypes) balance.subType = subType;
      else if (balance.subTypes && !balance.subTypes.includes(subType)) balance.subTypes.push(subType);
      else if (!balance.subTypes && balance.subType) balance.subTypes = [balance.subType, subType];
      await user.save();
    }

    res.json({ message: `SubType '${subType}' added to balance type '${type}' with zero amount` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List all default balances
router.get('/list-balances', (req, res) => {
  res.json(DEFAULT_BALANCES);
});

module.exports = router;