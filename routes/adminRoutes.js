const express = require('express');
const { 
  adminLogin, 
  getAdmins, 
  createAdmin, 
  approveUserAccount // ✅ নতুন ফাংশন
} = require('../controllers/adminController');
const verifyAdmin = require('../middlewares/adminAuth');

const router = express.Router();

// 🔑 Admin Login
router.post('/login', adminLogin);

// 👨‍💼 Get all admins
router.get('/', verifyAdmin, getAdmins);

// ➕ Create new admin
router.post('/', verifyAdmin, createAdmin);

// ✅ Approve/Reject user account
// Body: { status: "active" | "deactivated" | "closed" }
router.put('/approve-user/:userId', verifyAdmin, approveUserAccount);

module.exports = router;