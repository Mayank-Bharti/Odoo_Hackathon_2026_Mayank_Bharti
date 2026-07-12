const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user (Usually done by admin, but we expose it for Hackathon seeding)
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      email,
      password: hashedPassword,
      role: role || "Driver" // Default role
    });

    await user.save();

    // Dynamic Profile Creation based on Role
    if (user.role === "Driver") {
      const Driver = require("../models/Driver");
      const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber } = req.body;
      
      const newDriver = new Driver({
        userId: user._id,
        name: name || email.split('@')[0], // Fallback if name is missing
        licenseNumber: licenseNumber || `TEMP-${Date.now()}`,
        licenseCategory: licenseCategory || "Class B",
        licenseExpiryDate: licenseExpiryDate || new Date(Date.now() + 31536000000), // Default 1 yr
        contactNumber: contactNumber || "0000000000"
      });
      await newDriver.save();
    }

    // Generate token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role, email: user.email });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role, email: user.email });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
