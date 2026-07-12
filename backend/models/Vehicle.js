const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  type: String,
  maxLoadCapacity: Number,
  odometer: {
    type: Number,
    default: 0
  },
  acquisitionCost: Number,
  status: {
    type: String,
    enum: ["Available", "On Trip", "In Shop", "Retired"],
    default: "Available"
  }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", VehicleSchema);
