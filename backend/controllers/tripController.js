const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
exports.getTrips = async (req, res) => {
  try {
    let query = {};
    // If the user is a driver, only show trips created by them or assigned to them.
    // Based on Hackathon prompt, Driver creates trips. Let's just return all trips for FleetManager and Driver for now to simplify, or filter by creator.
    // The prompt says "Driver: Creates trips, assigns vehicles and drivers...".
    
    const trips = await Trip.find(query)
      .populate("vehicleId", "registrationNumber name maxLoadCapacity")
      .populate("driverId", "name licenseNumber status");
      
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new draft trip
// @route   POST /api/trips
// @access  Private (FleetManager, Driver)
exports.createTrip = async (req, res) => {
  try {
    const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

    // VALIDATION 1: Check vehicle capacity
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(400).json({ message: `Cargo Weight (${cargoWeight}kg) exceeds vehicle maximum capacity (${vehicle.maxLoadCapacity}kg).` });
    }

    // VALIDATION 2: Check if Vehicle is Available
    if (vehicle.status !== "Available") {
      return res.status(400).json({ message: `Cannot assign vehicle. Current status is: ${vehicle.status}` });
    }

    // VALIDATION 3: Check Driver status & License
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    
    if (driver.status !== "Available") {
      return res.status(400).json({ message: `Cannot assign driver. Current status is: ${driver.status}` });
    }

    if (new Date(driver.licenseExpiryDate) < new Date()) {
      return res.status(400).json({ message: "Cannot assign driver with an expired license." });
    }

    const trip = new Trip({
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeight,
      plannedDistance,
      status: "Draft"
    });

    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Dispatch a trip (Auto-updates vehicle and driver status)
// @route   PUT /api/trips/:id/dispatch
// @access  Private
exports.dispatchTrip = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Draft") return res.status(400).json({ message: "Only Draft trips can be dispatched" });

    // Double check availability before dispatching
    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    if (vehicle.status !== "Available" || driver.status !== "Available") {
      return res.status(400).json({ message: "Vehicle or Driver is no longer available for dispatch." });
    }

    // Update Statuses
    trip.status = "Dispatched";
    vehicle.status = "On Trip";
    driver.status = "On Trip";

    await trip.save();
    await vehicle.save();
    await driver.save();

    res.json({ message: "Trip dispatched successfully", trip });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Complete a trip
// @route   PUT /api/trips/:id/complete
// @access  Private
exports.completeTrip = async (req, res) => {
  try {
    const { finalOdometer, fuelConsumed } = req.body;
    let trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Dispatched") return res.status(400).json({ message: "Only dispatched trips can be completed" });

    // Update Statuses
    trip.status = "Completed";
    
    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    if (vehicle) {
      vehicle.status = "Available";
      if (finalOdometer) vehicle.odometer = finalOdometer;
      await vehicle.save();
    }
    if (driver) {
      driver.status = "Available";
      await driver.save();
    }

    // Automatically create a Fuel Expense record from this trip
    if (fuelConsumed && Number(fuelConsumed) > 0) {
      const Expense = require("../models/Expense");
      const fuelCostRate = 2.5; // Dummy cost per liter for hackathon prototype
      const expense = new Expense({
        vehicleId: trip.vehicleId,
        type: "Fuel",
        liters: Number(fuelConsumed),
        cost: Number(fuelConsumed) * fuelCostRate
      });
      await expense.save();
    }

    await trip.save();
    res.json({ message: "Trip completed successfully", trip });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Cancel a trip
// @route   PUT /api/trips/:id/cancel
// @access  Private
exports.cancelTrip = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    
    const previousStatus = trip.status;
    trip.status = "Cancelled";
    await trip.save();

    // If it was already dispatched, restore vehicle and driver to available
    if (previousStatus === "Dispatched") {
      await Vehicle.findByIdAndUpdate(trip.vehicleId, { status: "Available" });
      await Driver.findByIdAndUpdate(trip.driverId, { status: "Available" });
    }

    res.json({ message: "Trip cancelled successfully", trip });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
