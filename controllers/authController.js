const bcrypt = require('bcrypt');
const User = require('../models/User');
const initBalances = require('../utils/initBalances');
const validateDocuments = require('../utils/validateDocuments');

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

module.exports = { registerUser };