const express = require("express");
const router = express.Router();
const { getExpenses, createExpense } = require("../controllers/expenseController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/")
  .get(getExpenses)
  .post(authorize("FinancialAnalyst", "FleetManager", "Driver"), createExpense);

module.exports = router;
