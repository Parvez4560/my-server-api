const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  docType: { type: String, required: true },
  docNumber: { type: String, required: true },
  docFile: { type: String, required: true },
  verified: { type: Boolean, default: false }
}, { _id: false });

module.exports = documentSchema;