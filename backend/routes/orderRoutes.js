const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getRestaurantOrders,
  getCustomerOrders,
  updateOrderStatus
} = require("../controllers/orderController");


router.post("/", createOrder);

router.get("/", getOrders);

router.get("/restaurant/:restaurantId", getRestaurantOrders);

router.get("/customer/:customerId", getCustomerOrders);

router.put("/:id/status", updateOrderStatus);


module.exports = router;