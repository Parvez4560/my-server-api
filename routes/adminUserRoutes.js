const express = require('express');
const User = require('../models/User');
const MerchantType = require('../models/MerchantType');
const router = express.Router();

// মার্চেন্ট approve করে সাবটাইপ অ্যাসাইন ফোন নাম্বার দিয়ে
router.post('/approve-merchant', async (req, res) => {
  try {
    const { phoneNumber, merchantTypeId } = req.body;

    // ইউজার খোঁজা
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: "User not found" });

    // একাউন্ট টাইপ চেক
    if (user.accountType !== "Merchant") {
      return res.status(400).json({ error: "Not a merchant account" });
    }

    // সাবটাইপ চেক
    if (!merchantTypeId) {
      return res.status(400).json({ error: "MerchantSubType is required to approve" });
    }

    const mType = await MerchantType.findById(merchantTypeId);
    if (!mType) return res.status(404).json({ error: "Merchant type not found" });

    // অ্যাসাইন এবং স্ট্যাটাস আপডেট
    user.merchantSubType = mType._id;
    user.status = "active"; // শুধুমাত্র সঠিক সাবটাইপ দিলে active হবে
    await user.save();

    res.json({ message: "Merchant approved successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve merchant" });
  }
});

module.exports = router;