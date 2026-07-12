const express = require("express");
const router = express.Router();
const { getDrivers, createDriver, updateDriver, deleteDriver } = require("../controllers/driverController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All driver routes require authentication
router.use(protect);

router.route("/")
  .get(getDrivers)
  .post(authorize("FleetManager", "SafetyOfficer"), createDriver); 

router.route("/:id")
  .put(authorize("FleetManager", "SafetyOfficer"), updateDriver)
  .delete(authorize("FleetManager"), deleteDriver);

module.exports = router;
