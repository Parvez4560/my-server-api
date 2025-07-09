const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

/**
 * Generate JWT token
 * @param {string} username - ইউজারের নাম
 * @param {boolean} isFirstLogin - এটা কি প্রথম লগইন?
 * @returns {string} token
 */
function generateToken(username, isFirstLogin = false) {
  const expiresIn = isFirstLogin ? '10m' : '3m'; // প্রথমবার ১০ মিনিট, পরে ৩ মিনিট
  return jwt.sign({ username }, JWT_SECRET, { expiresIn });
}

module.exports = { generateToken };