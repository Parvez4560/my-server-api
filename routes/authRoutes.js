const express = require('express');
const router = express.Router();
const { registerUser, checkAccount } = require('../controllers/authController');

// ✅ User registration
router.post('/register', registerUser);

// ✅ Check if account exists + show status + type
router.post('/check-account', checkAccount);

module.exports = router;