// routes/adminUserRoutes.js
const express = require('express');
const User = require('../models/User');
const MerchantType = require('../models/MerchantType');
const router = express.Router();

// মার্চেন্ট approve করে সাবটাইপ অ্যাসাইন
router.post('/approve-merchant/:userId', async (req, res) => {
  try {
    const { merchantTypeId } = req.body; // Admin প্যানেল থেকে আসবে
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.accountType !== "Merchant") {
      return res.status(400).json({ error: "Not a merchant account" });
    }

    const mType = await MerchantType.findById(merchantTypeId);
    if (!mType) return res.status(404).json({ error: "Merchant type not found" });

    user.merchantSubType = mType._id;
    user.status = "active"; // Approve করলে active হবে
    await user.save();

    res.json({ message: "Merchant approved successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve merchant" });
  }
});

module.exports = router;