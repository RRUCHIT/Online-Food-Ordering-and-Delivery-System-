const Menu = require("../models/Menu");
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

exports.getMenuByRestaurant = async (req, res) => {
  try {
    const menu = await Menu.find({
      restaurantId: req.params.restaurantId
    });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const item = new Menu(req.body);

    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const oldItem = await Menu.findById(req.params.id);
    if (oldItem && req.body.image && oldItem.image !== req.body.image) {
        deleteFile(oldItem.image);
    }

    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (item && item.image) {
        deleteFile(item.image);
    }
    await Menu.findByIdAndDelete(req.params.id);

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
