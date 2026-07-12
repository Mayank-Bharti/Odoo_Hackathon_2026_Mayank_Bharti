const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  source: String,
  destination: String,
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true
  },
  cargoWeight: Number,
  plannedDistance: Number,
  status: {
    type: String,
    enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
    default: "Draft"
  }
}, { timestamps: true });

module.exports = mongoose.model("Trip", TripSchema);
