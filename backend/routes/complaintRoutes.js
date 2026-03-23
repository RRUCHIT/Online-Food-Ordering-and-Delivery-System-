const express = require("express");

const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {
  getComplaints,
  createComplaint,
  resolveComplaint
} = require("../controllers/complaintController");

router.get("/", verifyToken, isAdmin, getComplaints);
router.post("/", verifyToken, createComplaint);
router.put("/:id/resolve", verifyToken, isAdmin, resolveComplaint);

module.exports = router;
