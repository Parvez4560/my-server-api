const mongoose = require('mongoose');

const merchantSubTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },   // যেমন: Shop, NGO, Education, E-commerce
  description: { type: String, default: "" },             
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model('MerchantSubType', merchantSubTypeSchema);