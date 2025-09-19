// models/User.js
const mongoose = require('mongoose');
const documentSchema = require('./schemas/documentSchema');
const balanceSchema = require('./schemas/balanceSchema');
const { initBalances } = require('../utils/initBalances');

// ----------------- User Schema -----------------
const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Main account type
  accountType: { 
    type: String, 
    enum: ['Personal', 'Agent', 'Merchant'], 
    required: true 
  },

  // Subtype (set by admin when approving request)
  subType: { type: String, default: null },

  // For merchants → subtype will come from MerchantType model
  merchantSubType: { type: mongoose.Schema.Types.ObjectId, ref: 'MerchantType', default: null },

  // Merchant & Agent specific fields
  businessName: { type: String, default: null }, // mandatory for Merchant
  commissionRate: { type: Number, default: 0 },  // for Agent subType control

  // Common fields
  documents: { type: [documentSchema], default: [] },
  balances: { type: [balanceSchema], default: [] },

  // Status flow
  status: {
    type: String,
    enum: [
      'pending',         // registration request submitted
      'active',          // after admin approves & assigns type/subType
      'deactivated',
      'closed',
      'debit_block',
      'register_failed'
    ],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now }
});

// ----------------- Balance Init Middleware -----------------
userSchema.pre('save', function (next) {
  if (this.isNew) {
    // fresh user → setup balances
    this.balances = initBalances(this.accountType, this.balances);
  } else if (this.balances && this.balances.length > 0) {
    // updating existing user → re-check balances if subType changes
    this.balances = initBalances(this.accountType, this.balances);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);