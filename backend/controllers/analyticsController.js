const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const Maintenance = require("../models/Maintenance");

// @desc    Get dashboard KPIs
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardKPIs = async (req, res) => {
  try {
    const { region } = req.query; // Dashboard filter
    let vehicleQuery = {};
    if (region) vehicleQuery.region = region;

    // Vehicle KPIs
    const totalVehicles = await Vehicle.countDocuments(vehicleQuery);
    const availableVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: "Available" });
    const inMaintenance = await Vehicle.countDocuments({ ...vehicleQuery, status: "In Shop" });
    const activeVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: "On Trip" });

    // Fleet Utilization = (Active / (Total - Retired)) * 100
    const retiredVehicles = await Vehicle.countDocuments({ ...vehicleQuery, status: "Retired" });
    const totalOperable = totalVehicles - retiredVehicles;
    const fleetUtilization = totalOperable > 0 ? ((activeVehicles / totalOperable) * 100).toFixed(1) : 0;

    // Driver KPIs
    const driversOnDuty = await Driver.countDocuments({ status: "On Trip" });

    // Trip KPIs
    const activeTrips = await Trip.countDocuments({ status: "Dispatched" });
    const pendingTrips = await Trip.countDocuments({ status: "Draft" });

    // Operational Cost (Total Expenses + Total Maintenance)
    const expenses = await Expense.aggregate([
      { $group: { _id: null, totalCost: { $sum: "$cost" }, totalLiters: { $sum: "$liters" } } }
    ]);
    const maintenanceCosts = await Maintenance.aggregate([
      { $group: { _id: null, totalCost: { $sum: "$cost" } } }
    ]);

    const totalExpense = (expenses[0]?.totalCost || 0) + (maintenanceCosts[0]?.totalCost || 0);
    const totalLiters = expenses[0]?.totalLiters || 0;

    // Very simplified Total Distance from Completed Trips
    const completedTrips = await Trip.find({ status: "Completed" });
    const totalDistance = completedTrips.reduce((acc, trip) => acc + (trip.plannedDistance || 0), 0);
    
    const fuelEfficiency = totalLiters > 0 ? (totalDistance / totalLiters).toFixed(2) : 0;

    res.json({
      vehicleMetrics: {
        total: totalVehicles,
        available: availableVehicles,
        inMaintenance: inMaintenance,
        active: activeVehicles,
        utilizationPercent: fleetUtilization
      },
      driverMetrics: {
        onDuty: driversOnDuty
      },
      tripMetrics: {
        active: activeTrips,
        pending: pendingTrips
      },
      financialMetrics: {
        totalOperationalCost: totalExpense,
        fuelEfficiency: fuelEfficiency
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
