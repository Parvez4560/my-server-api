const multer = require('multer');

// Memory storage: files will be kept in memory buffer
const storage = multer.memoryStorage();

// File filter: only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max per file
});

module.exports = upload;