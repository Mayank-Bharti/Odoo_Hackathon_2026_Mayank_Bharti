const Driver = require("../models/Driver");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
exports.getDrivers = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    // Populate user email if needed
    const drivers = await Driver.find(query).populate("userId", "email");
    res.json(drivers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new driver (and their User account) manually
// @route   POST /api/drivers
// @access  Private (FleetManager only)
exports.createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, email, password } = req.body;

    // 1. Create User Account first
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || "defaultPass123", salt);

    user = new User({
      email,
      password: hashedPassword,
      role: "Driver"
    });
    await user.save();

    // 2. Create Driver Profile
    let existingDriver = await Driver.findOne({ licenseNumber });
    if (existingDriver) {
      // Rollback user creation (simplistic rollback for hackathon)
      await User.findByIdAndDelete(user._id);
      return res.status(400).json({ message: "Driver with this License Number already exists" });
    }

    const driver = new Driver({
      userId: user._id,
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber
    });

    await driver.save();
    res.json(driver);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private
exports.updateDriver = async (req, res) => {
  try {
    let driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(driver);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private
exports.deleteDriver = async (req, res) => {
  try {
    let driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // Also delete their User account
    await User.findByIdAndDelete(driver.userId);
    await Driver.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Driver and associated User account removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
