const express = require("express");
const router = express.Router();
const { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip } = require("../controllers/tripController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All trip routes require authentication
router.use(protect);

router.route("/")
  .get(getTrips)
  .post(authorize("FleetManager", "Driver"), createTrip); // Driver and Fleet Manager can create trips

router.put("/:id/dispatch", authorize("FleetManager", "Driver"), dispatchTrip);
router.put("/:id/complete", authorize("FleetManager", "Driver"), completeTrip);
router.put("/:id/cancel", authorize("FleetManager", "Driver"), cancelTrip);

module.exports = router;
