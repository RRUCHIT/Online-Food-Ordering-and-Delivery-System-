const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["customer", "restaurant", "admin"],
    default: "customer"
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  address: String,
  otp: String,
  otpExpiry: Date
});

module.exports = mongoose.model("User", userSchema);