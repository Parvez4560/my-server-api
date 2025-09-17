const express = require('express');
const router = express.Router();
const { getTotalBalance, addBalance } = require('../controllers/balanceController');

// GET total balance of a user by phone number
router.get('/total/:phoneNumber', getTotalBalance);

// POST add balance to a user by phone number
router.post('/add/:phoneNumber', addBalance);

module.exports = router;