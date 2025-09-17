const mongoose = require('mongoose');
const documentSchema = require('./schemas/documentSchema');
const balanceSchema = require('./schemas/balanceSchema');
const { initBalances } = require('../utils/initBalances'); // আপনার ফাইলের নাম ধরে নিচ্ছি balanceUtils.js

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ['Personal', 'Agent', 'Merchant'], required: true },
  subType: { type: String, default: null },
  merchantSubType: { type: mongoose.Schema.Types.ObjectId, ref: 'MerchantType', default: null },
  documents: { type: [documentSchema], default: [] },
  balances: { type: [balanceSchema], default: [] },
  status: {
    type: String,
    enum: ['active', 'deactivated', 'closed', 'pending', 'debit_block', 'register_failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// ✅ নতুন ইউজার তৈরি হলে initial balances সেট করা
userSchema.pre('save', function (next) {
  if (this.isNew && (!this.balances || this.balances.length === 0)) {
    this.balances = initBalances(this.accountType);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);