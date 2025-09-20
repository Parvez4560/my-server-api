const express = require('express');
const router = express.Router();
const { registerUser, checkAccount, setPassword } = require('../controllers/authController');

// ✅ User registration
router.post('/register', registerUser);

// ✅ Check if account exists + show status + type
router.post('/check-account', checkAccount);

// ✅ Set / Update permanent password using temporary PIN
router.post('/set-password', setPassword);

module.exports = router;