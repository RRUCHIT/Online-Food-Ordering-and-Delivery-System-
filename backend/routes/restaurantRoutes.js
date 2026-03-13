const express = require("express");

const router = express.Router();

const {
  getRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantByOwner,
  updateRestaurantStatus
} = require("../controllers/restaurantController");

router.get("/", getRestaurants);
router.get("/owner/:ownerId", getRestaurantByOwner);
router.post("/", addRestaurant);
router.put("/:id", updateRestaurant);
router.patch("/:id/status", updateRestaurantStatus);
router.delete("/:id", deleteRestaurant);

module.exports = router;
