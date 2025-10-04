const express = require('express');
const router = express.Router();
const { registerUser, checkAccount, setPassword } = require('../controllers/authController');
const upload = require('../middlewares/multer');

// ✅ User registration (support front/back/face images)
router.post(
  '/register',
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
    { name: 'faceImage', maxCount: 1 },
  ]),
  registerUser
);

// ✅ Check if account exists + show status + type
router.post('/check-account', checkAccount);

// ✅ Set / Update permanent password using temporary PIN
router.post('/set-password', setPassword);

module.exports = router;