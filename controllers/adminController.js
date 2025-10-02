const Admin = require('../models/Admin');
const User = require('../models/User'); // ✅ User approve জন্য
const MerchantType = require('../models/MerchantSubType'); // ✅ নতুন
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ========================
// Admin Login
// ========================
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (!admin.status) return res.status(403).json({ message: "Admin inactive" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// Get All Admins
// ========================
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// Create Admin
// ========================
const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// Approve / Reject User Account (UserId-based)
// ========================
const approveUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, accountType, subType, merchantSubType } = req.body;

    const allowedStatus = ['active', 'deactivated', 'closed'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (accountType) user.accountType = accountType;
    if (subType) user.subType = subType;
    if (merchantSubType) user.merchantSubType = merchantSubType;

    user.status = status;
    await user.save();

    res.json({ message: `User ${status} successfully`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ========================
// Approve Merchant by Phone (New)
// ========================
const approveMerchantByPhone = async (req, res) => {
  try {
    const { phoneNumber, merchantTypeId } = req.body;

    const user = await User.findOne({ phoneNumber });
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
};

module.exports = {
  adminLogin,
  getAdmins,
  createAdmin,
  approveUserAccount,       // UserId-based (পুরানো)
  approveMerchantByPhone,   // ফোন নাম্বার-based (নতুন)
};