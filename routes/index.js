const authRoutes = require('./authRoutes');  
const userRoutes = require('./userRoutes');  
const balanceRoutes = require('./balanceRoutes');  
const adminRoutes = require('./adminRoutes');
const personalSubTypeRoutes = require('./PersonalSubTypeRoutes');
const agentSubTypeRoutes = require('./AgentSubTypeRoutes');
const merchantSubTypeRoutes = require('./MerchantSubTypeRoutes');
const uploadRoutes = require('./uploadRoutes');

const routes = [  
  { path: '/auth', handler: authRoutes },  
  { path: '/user', handler: userRoutes },  
  { path: '/balance', handler: balanceRoutes },  
  { path: '/admin', handler: adminRoutes },  
  { path: '/personal-subtypes', handler: personalSubTypeRoutes },
  { path: '/agent-subtypes', handler: agentSubTypeRoutes },
  { path: '/merchant-subtypes', handler: merchantSubTypeRoutes },
  { path: '/upload', handler: uploadRoutes },
];

module.exports = routes;