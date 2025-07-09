const bcrypt = require('bcrypt');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      userInfo: {},
      accountInfo: {},
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
};