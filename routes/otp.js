const express = require('express');
const router = express.Router();
const OtpVerification = require('../models/otpVerification');
const { sendSms } = require('../utils/smsService');

// OTP Generate Route
router.post('/generate', async (req, res) => {
  const { userId, phone } = req.body;

  if (!userId || !phone) {
    return res.status(400).json({ success: false, message: "🔴 Missing userId or phone" });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // ৫ মিনিট

  try {
    await OtpVerification.findOneAndUpdate(
      { userId },
      { otpCode, expiryTime, attemptCount: 0 },
      { upsert: true, new: true }
    );

    const smsResult = await sendSms(phone, otpCode);

    if (!smsResult.success) {
      return res.status(500).json({ success: false, message: "❌ Failed to send OTP SMS", error: smsResult.error });
    }

    res.json({
      success: true,
      message: "✅ OTP sent successfully",
      refCode: smsResult.refCode
    });
  } catch (err) {
    console.error("OTP Generate Error:", err);
    res.status(500).json({ success: false, message: "❌ Server error during OTP generation" });
  }
});

// OTP Verify Route
router.post('/verify', async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "🔴 Missing userId or otp" });
  }

  try {
    const record = await OtpVerification.findOne({ userId });
    if (!record) {
      return res.status(404).json({ success: false, message: "❌ No OTP record found for this user" });
    }

    if (record.expiryTime < new Date()) {
      await OtpVerification.deleteOne({ userId }); // Optional: clear expired record
      return res.status(400).json({ success: false, message: "⏰ OTP expired. Please request again." });
    }

    if (record.attemptCount >= 3) {
      return res.status(403).json({ success: false, message: "🚫 Too many invalid attempts. Try again later." });
    }

    if (record.otpCode !== otp) {
      record.attemptCount += 1;
      await record.save();
      return res.status(400).json({ success: false, message: "❌ Invalid OTP. Please check again." });
    }

    await OtpVerification.deleteOne({ userId }); // OTP verified successfully, remove it
    res.json({ success: true, message: "✅ OTP verified successfully" });

  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ success: false, message: "❌ Server error during OTP verification" });
  }
});

module.exports = router;