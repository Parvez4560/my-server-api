require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const routes = require('./routes'); // ← নতুন ফাইল থেকে লিস্ট import

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware
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

// ✅ Attach routes from the list
routes.forEach(route => {
  app.use(route.path, route.handler);
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to Salafi API');
});

// ✅ 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack || err);
  res.status(500).json({ message: 'Internal server error' });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});