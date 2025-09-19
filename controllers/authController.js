const bcrypt = require('bcrypt');
const User = require('../models/User');
const initBalances = require('../utils/initBalances');
const validateDocuments = require('../utils/validateDocuments');

// ========================
// User Registration
// ========================
const registerUser = async (req, res) => {
  try {
    const { phoneNumber, password, accountType, subType, merchantSubType, documents } = req.body;

    if (!phoneNumber || !password || !accountType) {
      return res.status(400).json({ error: 'Phone number, password, and account type are required' });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const docError = validateDocuments(accountType, documents);
    if (docError) return res.status(400).json({ error: docError });

    const hashedPassword = await bcrypt.hash(password, 10);
    const balances = initBalances(accountType);

    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      accountType,
      subType: subType || null,
      merchantSubType: merchantSubType || null,
      documents,
      balances
    });

    await newUser.save();

    res.status(201).json({
      message: 'Account registered successfully. Pending verification.',
      userId: newUser._id,
      accountType: newUser.accountType,
      status: newUser.status
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================
// Check Account by Phone Number
// ========================
const checkAccount = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ 
        exists: false, 
        message: 'Account not found' 
      });
    }

    res.json({
      exists: true,
      account: {
        phoneNumber: user.phoneNumber,
        accountType: user.accountType,       // Personal / Agent / Merchant
        subType: user.subType || null,       // Sub-type if assigned
        merchantSubType: user.merchantSubType || null, // Merchant type if any
        status: user.status === 'active' ? 'Active' : 'Inactive' // Active/Inactive
      }
    });

  } catch (error) {
    console.error('Check Account Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser, checkAccount };