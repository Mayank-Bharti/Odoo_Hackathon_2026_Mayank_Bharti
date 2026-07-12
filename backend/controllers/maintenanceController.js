const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

// @desc    Get all maintenance logs
// @route   GET /api/maintenance
// @access  Private
exports.getMaintenanceLogs = async (req, res) => {
  try {
    const logs = await Maintenance.find().populate("vehicleId", "registrationNumber name status");
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a maintenance log
// @route   POST /api/maintenance
// @access  Private (FleetManager)
exports.createMaintenanceLog = async (req, res) => {
  try {
    const { vehicleId, description, cost } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Business Rule: Creating active maintenance automatically changes vehicle status to In Shop
    const log = new Maintenance({
      vehicleId,
      description,
      cost,
      status: "Active"
    });

    await log.save();

    // Auto update vehicle status to hide from dispatch
    vehicle.status = "In Shop";
    await vehicle.save();

    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Close a maintenance log
// @route   PUT /api/maintenance/:id/close
// @access  Private (FleetManager)
exports.closeMaintenanceLog = async (req, res) => {
  try {
    const log = await Maintenance.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Log not found" });

    log.status = "Closed";
    await log.save();

    // Business Rule: Closing maintenance restores vehicle to Available (unless retired)
    const vehicle = await Vehicle.findById(log.vehicleId);
    if (vehicle && vehicle.status !== "Retired") {
      vehicle.status = "Available";
      await vehicle.save();
    }

    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
