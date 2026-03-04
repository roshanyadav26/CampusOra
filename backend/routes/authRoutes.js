const express = require("express");
const router = express.Router();

const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

// AUTH
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;