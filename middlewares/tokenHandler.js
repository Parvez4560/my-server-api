const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

function tokenWithThreeMinuteExtension(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const now = Math.floor(Date.now() / 1000); // seconds
    const loginTime = decoded.iat; // টোকেন ইস্যুর সময় (seconds)
    const minutesSinceLogin = (now - loginTime) / 60;

    // ৭ মিনিট পেরিয়ে গেলে ৩ মিনিট মেয়াদের নতুন টোকেন পাঠানো হবে
    if (minutesSinceLogin >= 7) {
      const newToken = jwt.sign(
        {
          username: decoded.username,
        },
        JWT_SECRET,
        { expiresIn: '3m' }  // 3 minutes
      );

      // Response header এ নতুন টোকেন যোগ করা
      res.setHeader('x-new-token', newToken);
    }

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = tokenWithThreeMinuteExtension;