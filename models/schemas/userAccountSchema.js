const mongoose = require('mongoose');

const userAccountSchema = new mongoose.Schema({
  account_type: {
    type: String,
    enum: ['personal', 'agent', 'merchant'],
    required: true
  },
  account_sub_type: {
    type: String,
    required: true,
    // Personal এর জন্য: Retailer, Student
    // Agent এর জন্য: Premium Agent, Super Agent, Retail Agent
    // Merchant এর জন্য: Retail, E-commerce, Education, Utility, Corporate
  },
  merchant_detail_type: {
    type: String,
    enum: [
      'Pharmacy', 'Restaurant', 'Grocery', 'Fashion & Clothing', 'Electronics',
      'Furniture', 'Books & Stationery', 'Cosmetics & Beauty', 'Travel Agency',
      'ISP / Broadband', 'Coaching Center', 'University / College', 'NGO / Foundations',
      'E-learning', 'Ride Sharing', 'Event Management', 'Home Services',
      'Donation / Charity', 'Online Seller (Facebook)', 'Mobile Recharge', 'Ticketing',
      'Utility Bill Provider'
    ],
    default: null
  }
}, { _id: false });

module.exports = userAccountSchema;