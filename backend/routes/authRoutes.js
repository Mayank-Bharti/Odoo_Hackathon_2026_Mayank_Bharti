const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public (in production, should be protected for Fleet Manager)
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", login);

// @route   GET /api/auth/me
// @desc    Get current user details (used to verify token on frontend load)
// @access  Private
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
