const Driver = require("../models/Driver");

const runAutoSuspendJob = () => {
  // This job runs every 10 seconds to check for expired licenses
  setInterval(async () => {
    try {
      const today = new Date();
      // Find drivers who are Available but their license has expired
      const expiredDrivers = await Driver.find({
        status: "Available",
        licenseExpiryDate: { $lt: today }
      });

      if (expiredDrivers.length > 0) {
        console.log(`[Auto-System Job] Found ${expiredDrivers.length} drivers with expired licenses. Auto-suspending...`);
        for (let driver of expiredDrivers) {
          driver.status = "Suspended";
          await driver.save();
        }
      }
    } catch (err) {
      console.error("Auto-suspension job error:", err);
    }
  }, 10000); // Check every 10 seconds for hackathon demo purposes
};

module.exports = runAutoSuspendJob;
