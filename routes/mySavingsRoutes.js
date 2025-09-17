const express = require('express');
const router = express.Router();
const { getMySavings, updateMySavings } = require('../controllers/mySavingsController');

router.get('/:phoneNumber', getMySavings);
router.post('/:phoneNumber', updateMySavings); // amount in body

module.exports = router;