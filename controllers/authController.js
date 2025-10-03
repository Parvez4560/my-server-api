const bcrypt = require('bcrypt');
const User = require('../models/User');
const { initBalances } = require('../utils/initBalances');
const validateDocuments = require('../utils/validateDocuments');

const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate temporary PIN
const generateTempPin = () => {
  const pinLength = Math.floor(Math.random() * 3) + 4; // 4-6 digit
  const pin = Math.floor(Math.random() * Math.pow(10, pinLength))
    .toString()
    .padStart(pinLength, '0');
  return pin;
};

// -------------------- REGISTER USER --------------------
const registerUser = async (req, res) => {
  try {
    const { phoneNumber, password, accountType, personalSubType, agentSubType, merchantSubType, documents, faceImage, additionalInfo, otgData } = req.body;

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
    let faceImageUrl = null;

    // -------------------- PASSWORD --------------------
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      const tempPin = generateTempPin();
      tempPasswordHash = await bcrypt.hash(tempPin, 10);
      tempPasswordExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000);
      console.log(`Generated Temporary PIN for ${phoneNumber}: ${tempPin}`);
    }

    // -------------------- UPLOAD FACE IMAGE --------------------
    if (faceImage) {
      try {
        const uploaded = await cloudinary.uploader.upload(faceImage, {
          folder: 'salafi_users',
        });
        faceImageUrl = uploaded.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    const balances = initBalances(accountType);

    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      tempPassword: tempPasswordHash,
      tempPasswordExpiry,
      accountType,
      personalSubType: personalSubType || null,
      agentSubType: agentSubType || null,
      merchantSubType: merchantSubType || null,
      documents,
      balances,
      faceImage: faceImageUrl,
      additionalInfo: additionalInfo || {},
      otgData: otgData || {},
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

// -------------------- CHECK ACCOUNT --------------------
const checkAccount = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) return res.status(400).json({ error: 'Phone number is required' });

    const user = await User.findOne({ phoneNumber });

    if (!user) return res.status(404).json({ exists: false, message: 'Account not found' });

    res.json({
      exists: true,
      account: {
        phoneNumber: user.phoneNumber,
        accountType: user.accountType,
        personalSubType: user.personalSubType || null,
        agentSubType: user.agentSubType || null,
        merchantSubType: user.merchantSubType || null,
        status: user.status === 'active' ? 'Active' : 'Inactive',
      },
    });
  } catch (error) {
    console.error('Check Account Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// -------------------- SET PASSWORD --------------------
const setPassword = async (req, res) => {
  try {
    const { phoneNumber, tempPin, newPassword } = req.body;

    if (!phoneNumber || !tempPin || !newPassword) return res.status(400).json({ error: 'Phone number, temp PIN, and new password are required' });

    const user = await User.findOne({ phoneNumber });
    if (!user || !user.tempPassword) return res.status(404).json({ error: 'Temporary password not found or account does not exist' });

    const isValidPin = await bcrypt.compare(tempPin, user.tempPassword);
    if (!isValidPin) return res.status(400).json({ error: 'Invalid temporary PIN' });

    if (user.tempPasswordExpiry && user.tempPasswordExpiry < new Date()) return res.status(400).json({ error: 'Temporary PIN expired' });

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