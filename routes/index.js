const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const balanceRoutes = require('./balanceRoutes');
const adminRoutes = require('./adminRoutes'); // CommonJS

const routes = [
  { path: '/auth', handler: authRoutes },
  { path: '/user', handler: userRoutes },
  { path: '/balance', handler: balanceRoutes },
  { path: '/admin', handler: adminRoutes },
];

module.exports = routes;