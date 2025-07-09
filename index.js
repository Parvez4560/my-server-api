require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// ✅ Middleware Setup
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// ✅ Routes Import
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const balanceRoutes = require('./routes/balance');
const userRoutes = require('./routes/user');
const otpRoutes = require('./routes/otp');

// ✅ Use Routes
app.use('/auth', authRoutes);
app.use('/transaction', transactionRoutes);
app.use('/balance', balanceRoutes);
app.use('/user', userRoutes);
app.use('/otp', otpRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to Salafi API');
});

// ✅ 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack || err);
  res.status(500).json({ message: 'Internal server error' });
});

// ✅ Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});