const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "Closed"],
    default: "Active"
  },
  dateLogged: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
