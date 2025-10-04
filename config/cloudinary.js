const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'das5dhk4p',
  api_key: '597951767581926',
  api_secret:  'L8msOcV3vBmg9vxoULCcseQHKts',
});

module.exports = cloudinary;