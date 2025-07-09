const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  mobile_number: { type: String, required: true, trim: true },
  email: { type: String, default: null },
  father_name: { type: String, default: null },
  mother_name: { type: String, default: null },
  nid_number: { type: String, default: null },
  date_of_birth: { type: Date, default: null },
  operator: {
    type: String,
    enum: ['grameenphone', 'robi', 'airtel', 'banglalink', 'teletalk', 'skitto'],
    default: null
  },
  address: { type: String, default: null }
}, { _id: false });

module.exports = userInfoSchema;