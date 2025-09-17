const express = require('express');
const router = express.Router();
const { getMyLoan, updateMyLoan } = require('../controllers/myLoanController');

router.get('/:phoneNumber', getMyLoan);
router.post('/:phoneNumber', updateMyLoan); // amount in body

module.exports = router;