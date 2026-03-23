const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  cuisine: {
    type: String,
    default: ""
  },
  deliveryTime: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  ownerId: {
    type: String,
    default: ""
  },
  ownerName: {
    type: String,
    default: ""
  },
  ownerEmail: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
