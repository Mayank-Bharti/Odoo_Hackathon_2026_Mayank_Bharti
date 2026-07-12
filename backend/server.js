const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas using the URI from .env
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected successfully to TransitOps Database"))
.catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("TransitOps Core API Running...");
});

// Import TransitOps Models
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const Driver = require("./models/Driver");
const Trip = require("./models/Trip");

// Import Routes
const authRoutes = require("./routes/authRoutes");

// Mount Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));