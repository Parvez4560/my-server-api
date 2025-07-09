const mongoose = require('mongoose');

// ✅ Sub-schemas
const userInfoSchema = require('./schemas/userInfoSchema');
const userAccountSchema = require('./schemas/userAccountSchema');
const validateBalanceType = require('./schemas/userBalanceValidation');

// ✅ Main User Schema
const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    default: null,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false // OTP-based login হলে password লাগবে না
  },
  userInfo: {
    type: userInfoSchema,
    required: true
  },
  accountInfo: {
    type: userAccountSchema,
    required: true
  },
  operator: {
    type: String,
    enum: ['GP', 'Robi', 'Banglalink', 'Teletalk', 'Airtel', null],
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'deactivated'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  nidVerified: {
    type: Boolean,
    default: false
  },
  verificationLog: {
    type: [String],
    default: []
  },
  defaultBalanceType: {
    type: String,
    enum: ['salafi_balance', 'mobile_banking_balance', 'bank_balance'],
    default: 'salafi_balance'
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  referredBy: {
    type: String,
    default: null,
    trim: true
  },
  loginTime: {
    type: Date,
    default: null
  },
  lastTransactionTime: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Pre-save middleware: validate default balance type
userSchema.pre('save', validateBalanceType);

// ✅ Export model
module.exports = mongoose.model('User', userSchema);