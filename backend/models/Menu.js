const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },

  name: String,

  description: String,

  category: String,

  price: Number,

  image: String

});

module.exports = mongoose.model("Menu", menuSchema);