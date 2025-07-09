const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY_MINUTES = parseInt(process.env.TOKEN_EXPIRY_MINUTES || 10);
const TOKEN_REFRESH_WINDOW = parseInt(process.env.TOKEN_REFRESH_WINDOW || 3);

function tokenManager(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token invalid or expired' });

    const now = Date.now();
    const issuedAt = decoded.iat * 1000;
    const expiresAt = issuedAt + TOKEN_EXPIRY_MINUTES * 60 * 1000;

    // যদি এখন সময় ৭ মিনিট পার হয়েছে (70% এর বেশি)
    const timeSinceIssued = now - issuedAt;
    const tokenUsedTimeMin = timeSinceIssued / (60 * 1000);

    if (tokenUsedTimeMin > 7 && now < expiresAt) {
      // তখন ৩ মিনিট রিফ্রেশ সহ নতুন token দেওয়া হবে
      const refreshedToken = jwt.sign(
        { username: decoded.username },
        JWT_SECRET,
        { expiresIn: TOKEN_REFRESH_WINDOW * 60 }
      );
      res.setHeader('x-refreshed-token', refreshedToken);
    }

    req.user = decoded;
    next();
  });
}

module.exports = tokenManager;