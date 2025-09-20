// routes/adminApprove.js
const express = require('express');
const User = require('../models/User');
const PersonalSubType = require('../models/PersonalSubType');
const AgentSubType = require('../models/AgentSubType');
const MerchantType = require('../models/MerchantType');

const router = express.Router();

/**
 * General approve route for any account type
 * Body:
 *  - phoneNumber (required)
 *  - subTypeId (required)
 */
router.post('/approve-user', async (req, res) => {
  try {
    const { phoneNumber, subTypeId } = req.body;

    if (!phoneNumber || !subTypeId) {
      return res.status(400).json({ error: "phoneNumber and subTypeId are required" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: "User not found" });

    switch (user.accountType) {
      case 'Personal':
        const pType = await PersonalSubType.findById(subTypeId);
        if (!pType) return res.status(404).json({ error: "Personal subType not found" });
        user.personalSubType = pType._id;
        user.agentSubType = null;
        user.merchantSubType = null;
        break;

      case 'Agent':
        const aType = await AgentSubType.findById(subTypeId);
        if (!aType) return res.status(404).json({ error: "Agent subType not found" });
        user.agentSubType = aType._id;
        user.personalSubType = null;
        user.merchantSubType = null;
        break;

      case 'Merchant':
        const mType = await MerchantType.findById(subTypeId);
        if (!mType) return res.status(404).json({ error: "Merchant type not found" });
        user.merchantSubType = mType._id;
        user.personalSubType = null;
        user.agentSubType = null;
        break;

      default:
        return res.status(400).json({ error: "Invalid accountType" });
    }

    // Only activate if subType is correctly assigned
    user.status = 'active';
    await user.save();

    res.json({ message: `${user.accountType} approved successfully`, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve user" });
  }
});

module.exports = router;