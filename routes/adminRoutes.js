const express = require('express');
const { 
  adminLogin, 
  getAdmins, 
  createAdmin, 
  approveMerchantByPhone // ✅ নতুন ফাংশন ফোন দিয়ে
} = require('../controllers/adminController');
const verifyAdmin = require('../middlewares/adminAuth');

const router = express.Router();

// 🔑 Admin Login
router.post('/login', adminLogin);

// 👨‍💼 Get all admins
router.get('/', verifyAdmin, getAdmins);

// ➕ Create new admin
router.post('/', verifyAdmin, createAdmin);

// ✅ Approve Merchant by Phone
// Body: { phoneNumber: "017XXXXXXXX", merchantTypeId: "<ObjectId>" }
router.post('/approve-merchant', verifyAdmin, approveMerchantByPhone);

module.exports = router;