// models/MerchantType.js
const mongoose = require('mongoose');

const merchantTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },   // যেমন: Shop, NGO, Education
  description: { type: String, default: "" },             // Extra info
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model('MerchantType', merchantTypeSchema);