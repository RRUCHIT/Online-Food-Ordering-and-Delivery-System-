const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: String,
  customerName: String,
  customerEmail: String,
  phone: String,
  restaurantId: String,
  restaurantName: String,
  items: Array,
  total: Number,
  status: {
    type: String,
    enum: [
      "pending",
      "preparing",
      "out_for_delivery",
      "delivered",
      "rejected"
    ],
    default: "pending"
  },
  deliveryType: {
    type: String,
    enum: ["address", "live_location"],
    default: "address"
  },
  deliveryAddress: String,
  liveLocation: String,
  paymentMethod: {
    type: String,
    enum: ["cash_on_delivery", "upi", "card"],
    default: "cash_on_delivery"
  },
  paymentDetails: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  notes: String,
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
