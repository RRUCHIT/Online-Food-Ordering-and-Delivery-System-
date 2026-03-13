const express = require("express");

const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {
  getRevenueStats
} = require("../controllers/adminController");


/* ADMIN REVENUE STATS */

router.get(
  "/revenue",
  verifyToken,
  isAdmin,
  getRevenueStats
);

module.exports = router;