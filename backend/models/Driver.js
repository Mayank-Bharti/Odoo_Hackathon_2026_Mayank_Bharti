const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  licenseCategory: String,
  licenseExpiryDate: Date,
  contactNumber: String,
  safetyScore: {
    type: Number,
    default: 100
  },
  status: {
    type: String,
    enum: ["Available", "On Trip", "Off Duty", "Suspended"],
    default: "Available"
  }
}, { timestamps: true });

module.exports = mongoose.model("Driver", DriverSchema);
