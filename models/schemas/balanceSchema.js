const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  type: { type: String, required: true }, // main, pgo_income, donation_income, etc.
  amount: { type: Number, default: 0 }
}, { _id: false });

module.exports = balanceSchema;