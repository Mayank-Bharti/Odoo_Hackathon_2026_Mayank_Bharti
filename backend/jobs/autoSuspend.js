const Driver = require("../models/Driver");

// Keep track of emails sent in memory to avoid spamming the console every 10 seconds
const emailedDrivers = new Set();

const runAutoSuspendJob = () => {
  // This job runs every 10 seconds to check for expired licenses
  setInterval(async () => {
    try {
      const today = new Date();
      // 1. Auto-Suspend: Find drivers who are Available but their license has expired
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

      // 2. Email Reminder (Bonus Feature): Find drivers whose license expires in <= 3 days
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      const expiringSoon = await Driver.find({
        status: "Available",
        licenseExpiryDate: { 
          $gte: today,
          $lte: threeDaysFromNow
        }
      }).populate("userId", "email");

      for (let driver of expiringSoon) {
        if (!emailedDrivers.has(driver._id.toString())) {
          // In a real app, this would use Nodemailer/SendGrid. For hackathon, we simulate the email.
          console.log(`\n📧 [EMAIL SENT] To: ${driver.userId?.email || 'driver@example.com'}`);
          console.log(`   Subject: URGENT - License Expiry Reminder`);
          console.log(`   Body: Dear ${driver.name}, your driving license (${driver.licenseNumber}) will expire in less than 3 days. Please renew it immediately to avoid suspension.\n`);
          emailedDrivers.add(driver._id.toString());
        }
      }

    } catch (err) {
      console.error("Auto-suspension job error:", err);
    }
  }, 10000); // Check every 10 seconds for hackathon demo purposes
};

module.exports = runAutoSuspendJob;
