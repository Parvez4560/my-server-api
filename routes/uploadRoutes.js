const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const cloudinary = require('../config/cloudinary');

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'salafi_users'
    });

    res.json({
      success: true,
      url: result.secure_url
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;