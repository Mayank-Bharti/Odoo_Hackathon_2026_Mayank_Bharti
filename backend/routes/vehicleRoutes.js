const express = require("express");
const router = express.Router();
const { getVehicles, createVehicle, updateVehicle, deleteVehicle } = require("../controllers/vehicleController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All vehicle routes require authentication
router.use(protect);

router.route("/")
  .get(getVehicles)
  .post(authorize("FleetManager"), createVehicle); // Only Fleet Manager can create

router.route("/:id")
  .put(authorize("FleetManager"), updateVehicle)
  .delete(authorize("FleetManager"), deleteVehicle);

module.exports = router;
