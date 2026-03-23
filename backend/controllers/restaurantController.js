const Restaurant = require("../models/Restaurant");
const fs = require('fs');
const path = require('path');

const deleteFile = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('/uploads/')) return;
    const filename = imageUrl.split('/').pop();
    const filePath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

exports.getRestaurants = async (req, res) => {
  try {
    const filter = req.query.includeAll === "true"
      ? {}
      : {
          $or: [
            { status: "approved" },
            { status: { $exists: false } },
            { status: null }
          ]
        };

    const restaurants = await Restaurant.find(filter);

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant({
      ...req.body,
      status: req.body.status || "approved"
    });

    const savedRestaurant = await restaurant.save();

    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const oldRestaurant = await Restaurant.findById(req.params.id);
    if (oldRestaurant && req.body.image && oldRestaurant.image !== req.body.image) {
        deleteFile(oldRestaurant.image);
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant && restaurant.image) {
        deleteFile(restaurant.image);
    }
    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({ message: "Restaurant deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantByOwner = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      ownerId: req.params.ownerId
    });

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurantStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid restaurant status" });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
