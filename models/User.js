const mongoose = require('mongoose');
const documentSchema = require('./schemas/documentSchema');
const balanceSchema = require('./schemas/balanceSchema');
const { initBalances } = require('../utils/initBalances');

// ----------------- Helper: Temp Password Expiry -----------------
const addHours = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

// ----------------- User Schema -----------------
const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },

  // Password Handling
  password: { type: String, default: null },        // permanent password
  tempPassword: { type: String, default: null },    // temporary password
  tempPasswordExpiry: { type: Date, default: null },// expiry date-time

  // Main account type
  accountType: { 
    type: String, 
    enum: ['Personal', 'Agent', 'Merchant'], 
    required: true 
  },

  // SubTypes
  personalSubType: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalSubType', default: null },
  agentSubType: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentSubType', default: null },
  merchantSubType: { type: mongoose.Schema.Types.ObjectId, ref: 'MerchantType', default: null },

  // Merchant & Agent specific fields
  businessName: { type: String, default: null }, 
  commissionRate: { type: Number, default: 0 },  

  // Common fields
  documents: { type: [documentSchema], default: [] },
  balances: { type: [balanceSchema], default: [] },

  // Extra fields for registration (Flutter app is sending these)
  faceImage: { type: String, default: null },
  additionalInfo: { type: Object, default: {} },
  otgData: { type: Object, default: {} },

  // Status flow
  status: {
    type: String,
    enum: [
      'pending',
      'active',
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
        this.status = 'deactivated';
        return next(new Error('Personal account must have a personalSubType.'));
      }
      this.agentSubType = null;
      this.merchantSubType = null;
      break;

    case 'Agent':
      if (!this.agentSubType) {
        this.status = 'deactivated';
        return next(new Error('Agent account must have an agentSubType.'));
      }
      this.personalSubType = null;
      this.merchantSubType = null;
      break;

    case 'Merchant':
      if (!this.merchantSubType) {
        this.status = 'deactivated';
        return next(new Error('Merchant account must have a merchantSubType.'));
      }
      this.personalSubType = null;
      this.agentSubType = null;
      break;

    default:
      this.status = 'deactivated';
      return next(new Error('Invalid accountType.'));
  }

  next();
});

// ----------------- Balance Init Middleware -----------------
userSchema.pre('save', function (next) {
  if (this.isNew || (this.balances && this.balances.length > 0)) {
    this.balances = initBalances(this.accountType, this.balances);
  }

  // যদি permanent password না থাকে তাহলে temp password তৈরি হবে
  if (this.isNew && !this.password) {
    const randomPIN = Math.floor(1000 + Math.random() * 900000).toString();
    this.tempPassword = randomPIN;
    this.tempPasswordExpiry = addHours(new Date(), 72); 
  }

  next();
});

module.exports = mongoose.model('User', userSchema);