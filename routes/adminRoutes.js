const express = require('express');
const { adminLogin, getAdmins, createAdmin } = require('../controllers/adminController');
const verifyAdmin = require('../middlewares/adminAuth');

const router = express.Router();

router.post("/login", adminLogin);
router.get("/", verifyAdmin, getAdmins);
router.post("/", verifyAdmin, createAdmin);

module.exports = router; // ✅ CommonJS style export