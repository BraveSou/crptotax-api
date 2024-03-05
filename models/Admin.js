const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
    },
    price: {
      type: String, 
    },
    username: {
      type: String,
    },
    logo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
