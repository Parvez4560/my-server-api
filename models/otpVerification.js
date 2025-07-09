const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  otpCode: { type: String, required: true },
  expiryTime: { type: Date, required: true },
  attemptCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('OtpVerification', otpVerificationSchema);