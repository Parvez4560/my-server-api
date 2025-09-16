// routes/index.js
const { router: authRoutes } = require('./auth');
const transactionRoutes = require('./transaction');
const balanceRoutes = require('./balance');
const userRoutes = require('./user');
const otpRoutes = require('./otp');

const routes = [
  { path: '/auth', handler: authRoutes },
  { path: '/user', handler: userRoutes },
  { path: '/transaction', handler: transactionRoutes },
  { path: '/balance', handler: balanceRoutes },
  { path: '/otp', handler: otpRoutes },
];

module.exports = routes;