const express = require("express");

const router = express.Router();

const {
  getMenuByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require("../controllers/menuController");

router.get("/:restaurantId", getMenuByRestaurant);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

module.exports = router;
