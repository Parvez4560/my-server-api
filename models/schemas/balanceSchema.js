const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  type: { type: String, required: true },       
  subType: { type: String, default: 'main' },   
  currency: { type: String, default: 'BDT' },  
  amount: { type: Number, default: 0 },        
  createdAt: { type: Date, default: Date.now } 
});

module.exports = balanceSchema;