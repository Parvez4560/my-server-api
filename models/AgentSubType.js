const mongoose = require('mongoose');

const agentSubTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // যেমন: Super Agent, Mini Agent
  description: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model('AgentSubType', agentSubTypeSchema);