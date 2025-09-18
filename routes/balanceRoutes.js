const express = require('express');
const router = express.Router();
const { getTotalBalance, addBalance, deductBalance } = require('../controllers/balanceController');

// GET total balance of a user (currency optional)
router.get('/total/:phoneNumber', getTotalBalance);

// POST add balance to a user
router.post('/add/:phoneNumber', addBalance);

// POST deduct balance from a user
router.post('/deduct/:phoneNumber', deductBalance);

module.exports = router;