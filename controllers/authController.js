const bcrypt = require('bcrypt');
const User = require('../models/User');
const { initBalances } = require('../utils/initBalances');
const validateDocuments = require('../utils/validateDocuments');

// Generate temporary PIN
const generateTempPin = () => {
  const pinLength = Math.floor(Math.random() * 3) + 4; // 4-6 digit
  const pin = Math.floor(Math.random() * Math.pow(10, pinLength))
    .toString()
    .padStart(pinLength, '0');
  return pin;
};

// User registration
const registerUser = async (req, res) => {
  try {
    const { phoneNumber, password, accountType, subType, merchantSubType, documents } = req.body;

    if (!phoneNumber || !accountType) {
      return res.status(400).json({ error: 'Phone number and account type are required' });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const docError = validateDocuments(accountType, documents);
    if (docError) return res.status(400).json({ error: docError });

    let hashedPassword = null;
    let tempPasswordHash = null;
    let tempPasswordExpiry = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      const tempPin = generateTempPin();
      tempPasswordHash = await bcrypt.hash(tempPin, 10);
      tempPasswordExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72h
      console.log(`Generated Temporary PIN for ${phoneNumber}: ${tempPin}`);
    }

    const balances = initBalances(accountType);

    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      tempPassword: tempPasswordHash,
      tempPasswordExpiry,
      accountType,
      subType: subType || null,
      merchantSubType: merchantSubType || null,
      documents,
      balances,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Account registered successfully. Pending verification.',
      userId: newUser._id,
      accountType: newUser.accountType,
      status: newUser.status,
      tempPasswordIssued: !password,
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check account by phone number
const checkAccount = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ exists: false, message: 'Account not found' });
    }

    res.json({
      exists: true,
      account: {
        phoneNumber: user.phoneNumber,
        accountType: user.accountType,
        subType: user.subType || null,
        merchantSubType: user.merchantSubType || null,
        status: user.status === 'active' ? 'Active' : 'Inactive',
      },
    });
  } catch (error) {
    console.error('Check Account Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Set / Update permanent password
const setPassword = async (req, res) => {
  try {
    const { phoneNumber, tempPin, newPassword } = req.body;

    if (!phoneNumber || !tempPin || !newPassword) {
      return res.status(400).json({ error: 'Phone number, temp PIN, and new password are required' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user || !user.tempPassword) {
      return res.status(404).json({ error: 'Temporary password not found or account does not exist' });
    }

    const isValidPin = await bcrypt.compare(tempPin, user.tempPassword);
    if (!isValidPin) return res.status(400).json({ error: 'Invalid temporary PIN' });

    if (user.tempPasswordExpiry && user.tempPasswordExpiry < new Date()) {
      return res.status(400).json({ error: 'Temporary PIN expired' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.tempPassword = null;
    user.tempPasswordExpiry = null;

    await user.save();

    res.json({ message: 'Password set successfully' });
  } catch (error) {
    console.error('Set Password Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser, checkAccount, setPassword };