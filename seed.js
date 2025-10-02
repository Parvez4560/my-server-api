const mongoose = require('mongoose');
const seedSubTypes = require('./seeders/subTypesSeeder');

const MONGO_URL = 'mongodb+srv://salafipay:sXBjyGRp1lhxBqjx@cluster0.qeyx7jh.mongodb.net/Salafi?retryWrites=true&w=majority&tls=true&appName=Cluster0'; // আপনার DB নাম বসান

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedSubTypes();
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });