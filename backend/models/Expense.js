const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  type: {
    type: String,
    enum: ["Fuel", "Toll", "Other"],
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  liters: {
    type: Number, // Only relevant if type is Fuel
    default: 0
  },
  dateLogged: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Expense", ExpenseSchema);
