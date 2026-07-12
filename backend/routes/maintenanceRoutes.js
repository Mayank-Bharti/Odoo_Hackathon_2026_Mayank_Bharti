const express = require("express");
const router = express.Router();
const { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog } = require("../controllers/maintenanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/")
  .get(getMaintenanceLogs)
  .post(authorize("FleetManager"), createMaintenanceLog);

router.put("/:id/close", authorize("FleetManager"), closeMaintenanceLog);

module.exports = router;
