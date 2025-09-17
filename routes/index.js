const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const balanceRoutes = require('./balanceRoutes');

const routes = [
  { path: '/auth', handler: authRoutes },
  { path: '/user', handler: userRoutes },
  { path: '/balance', handler: balanceRoutes },
];

module.exports = routes;