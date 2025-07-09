const express = require('express');
const router = express.Router();
const authenticateToken = require('./auth').authenticateToken; // auth থেকে middleware নেওয়া দরকার

// Transaction ID তৈরি করার জন্য helper function
function generateTransactionID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Transaction ID চেক করার জন্য regex ভ্যালিডেশন
function isValidTransactionID(id) {
  return /^[A-Z0-9]{11}$/.test(id);
}

// Protected Transaction route
router.post('/', authenticateToken, (req, res) => {
  // নতুন transaction id তৈরি করবো
  const transactionID = generateTransactionID();

  // ভ্যালিডেশন চেক (অবশ্যই সফল হবে কারণ আমরা generate করলাম)
  if (!isValidTransactionID(transactionID)) {
    return res.status(500).json({ message: 'Generated Transaction ID invalid' });
  }

  // এখানে আপনি আপনার transaction লজিক যুক্ত করবেন (ডাটাবেজে সংরক্ষণ ইত্যাদি)

  res.json({
    message: 'Transaction successful',
    transactionID: transactionID
  });
});

module.exports = router;