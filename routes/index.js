const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const balanceRoutes = require('./balanceRoutes');
const mySavingsRoutes = require('./mySavingsRoutes');
const myLoanRoutes = require('./myLoanRoutes');
const adminRoutes = require('./adminRoutes');

const routes = [
  { path: '/auth', handler: authRoutes },
  { path: '/user', handler: userRoutes },
  { path: '/balance', handler: balanceRoutes },
  { path: '/my-savings', handler: mySavingsRoutes },
  { path: '/my-loan', handler: myLoanRoutes },
  routes.push({ path: '/admin/login', handler: adminRoutes });
];

module.exports = routes;