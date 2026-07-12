const express = require("express");
const router = express.Router();
const { getDashboardKPIs } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/dashboard", getDashboardKPIs);

module.exports = router;
