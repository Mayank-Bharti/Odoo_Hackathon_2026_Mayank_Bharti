const Vehicle = require("../models/Vehicle");

// @desc    Get all vehicles (with optional region/status filters)
// @route   GET /api/vehicles
// @access  Private
exports.getVehicles = async (req, res) => {
  try {
    const { status, type, region } = req.query;
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (region) query.region = region;

    const vehicles = await Vehicle.find(query);
    res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private (FleetManager only)
exports.createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region } = req.body;

    // Check if vehicle exists
    let existingVehicle = await Vehicle.findOne({ registrationNumber });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle with this Registration Number already exists" });
    }

    const vehicle = new Vehicle({
      registrationNumber,
      name,
      type,
      maxLoadCapacity,
      odometer,
      acquisitionCost,
      region
    });

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
exports.updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
exports.deleteVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
