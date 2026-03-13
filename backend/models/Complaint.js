const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    required: true
  },
  resolution: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["open", "resolved"],
    default: "open"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);
