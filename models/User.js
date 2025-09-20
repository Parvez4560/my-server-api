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

  // SubTypes (অ্যাকাউন্ট টাইপ অনুযায়ী বাধ্যতামূলক)
  personalSubType: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalSubType', default: null },
  agentSubType: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentSubType', default: null },
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

// ----------------- Validate SubType -----------------
userSchema.pre('validate', function(next) {
  switch (this.accountType) {
    case 'Personal':
      if (!this.personalSubType) {
        this.status = 'deactivated'; // auto deactivate
        return next(new Error('Personal account must have a personalSubType.'));
      }
      this.agentSubType = null;
      this.merchantSubType = null;
      break;

    case 'Agent':
      if (!this.agentSubType) {
        this.status = 'deactivated'; // auto deactivate
        return next(new Error('Agent account must have an agentSubType.'));
      }
      this.personalSubType = null;
      this.merchantSubType = null;
      break;

    case 'Merchant':
      if (!this.merchantSubType) {
        this.status = 'deactivated'; // auto deactivate
        return next(new Error('Merchant account must have a merchantSubType.'));
      }
      this.personalSubType = null;
      this.agentSubType = null;
      break;

    default:
      this.status = 'deactivated'; // invalid type
      return next(new Error('Invalid accountType.'));
  }

  next();
});

// ----------------- Balance Init Middleware -----------------
userSchema.pre('save', function (next) {
  if (this.isNew || (this.balances && this.balances.length > 0)) {
    this.balances = initBalances(this.accountType, this.balances);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);