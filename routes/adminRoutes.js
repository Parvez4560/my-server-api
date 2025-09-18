const express = require('express');
const { adminLogin, getAdmins, createAdmin } = require('../controllers/adminController');
const verifyAdmin = require('../middlewares/adminAuth');

const router = express.Router();

// Login route (no token required)
router.post("/login", adminLogin);

// Get all admins (protected)
router.get("/", verifyAdmin, getAdmins);

// Create admin (protected)
router.post("/", verifyAdmin, createAdmin);

module.exports = router;