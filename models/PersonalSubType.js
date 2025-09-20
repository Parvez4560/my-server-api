const mongoose = require('mongoose');

const personalSubTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // যেমন: General Consumer, Student
  description: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model('PersonalSubType', personalSubTypeSchema);