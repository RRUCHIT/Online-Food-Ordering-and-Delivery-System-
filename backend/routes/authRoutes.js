const express = require("express");

const router = express.Router();

const {
  register,
  login,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updateProfile
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", verifyToken, changePassword);
router.put("/update-profile", verifyToken, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;