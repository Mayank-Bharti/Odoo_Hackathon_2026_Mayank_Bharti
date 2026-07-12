# TransitOps – Smart Transport Operations Platform

A centralized, end-to-end transport operations platform designed to digitize vehicle, driver, dispatch, maintenance, and expense management while enforcing business rules and providing operational insights.

**Hackathon Duration:** 8 Hours

---

## 🔍 Problem Context

Many logistics companies still rely on spreadsheets and manual logbooks to manage their transport operations. This often leads to:

- Scheduling conflicts and underutilized vehicles
- Missed maintenance
- Expired driver licenses
- Inaccurate expense tracking
- Poor operational visibility

## 🚀 Solution Overview

**TransitOps** is a centralized platform that allows organizations to manage the complete lifecycle of their transport operations—from vehicle registration and driver management to dispatching, maintenance, fuel logging, and analytics.

### 👥 Target Users & Roles

- **Fleet Manager:** Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency.
- **Driver:** Creates trips, assigns vehicles and drivers, and monitors active deliveries.
- **Safety Officer:** Ensures driver compliance, tracks license validity, and monitors safety scores.
- **Financial Analyst:** Reviews operational expenses, fuel consumption, maintenance costs, and profitability.

---

## ✅ Key Features & Deliverables

### 1. Authentication & Dashboard

- **RBAC Authentication:** Secure login using email and password with Role-Based Access Control.
- **Interactive Dashboard:** Displays KPIs such as Active/Available/Maintenance Vehicles, Active/Pending Trips, Drivers On Duty, and Fleet Utilization (%). Filters by vehicle type, status, and region.

### 2. Vehicle & Driver Management

- **Vehicle Registry:** Master list with Registration Number (unique), Name/Model, Type, Max Load Capacity, Odometer, Acquisition Cost, and Status (`Available`, `On Trip`, `In Shop`, `Retired`).
- **Driver Profiles:** Manages Name, License Number, Category, Expiry Date, Contact Number, Safety Score, and Status (`Available`, `On Trip`, `Off Duty`, `Suspended`).
- **Email Reminders:** Automated reminders for expiring driver licenses.

### 3. Trip & Dispatch Management

- **Smart Dispatch:** Create trips by selecting a source, destination, available vehicle & driver, cargo weight, and planned distance.
- **Lifecycle:** `Draft` ➔ `Dispatched` ➔ `Completed` ➔ `Cancelled`.

### 4. Maintenance & Expenses

- **Maintenance Logs:** Active maintenance automatically sets a vehicle's status to `In Shop`, removing it from the driver's selection pool.
- **Fuel & Expense Tracking:** Log fuel (liters, cost, date) and other expenses (tolls, maintenance). Automatically computes total operational cost per vehicle.

### 5. Reports & Analytics

- **Visual Analytics:** Charts and insights for Fuel Efficiency (Distance/Fuel), Fleet Utilization, Operational Cost, and Vehicle ROI: `[Revenue - (Maintenance + Fuel)] / Acquisition Cost`.
- **Exporting:** Support for CSV and PDF exports.

---

## 🛑 Mandatory Business Rules

1. The **vehicle registration number** must be unique.
2. **Retired** or **In Shop** vehicles must never appear in the dispatch selection.
3. Drivers with **expired licenses** or **Suspended** status cannot be assigned to trips.
4. A driver or vehicle already marked **On Trip** cannot be assigned to another trip.
5. **Cargo Weight** must not exceed the vehicle's maximum load capacity.
6. **Dispatching** a trip automatically changes both the vehicle and driver status to **On Trip**.
7. **Completing/Cancelling** a trip automatically restores both the vehicle and driver status to **Available**.
8. **Creating a maintenance record** automatically changes the vehicle status to **In Shop**. Closing it restores the vehicle to **Available** (unless retired).

---

## 🛣️ Example Workflow

1. **Register Vehicle:** 'Van-05' (Max capacity 500 kg, Status = `Available`).
2. **Register Driver:** 'Alex' with a valid driving license.
3. **Create Trip:** Cargo Weight = 450 kg.
4. **Dispatch:** System validates (450 kg ≤ 500 kg) and allows dispatch.
5. **On Trip:** Vehicle and Driver status automatically become `On Trip`.
6. **Complete Trip:** Enter final odometer and fuel consumed. System marks both Vehicle and Driver as `Available`.
7. **Maintenance:** Log an Oil Change. Vehicle status automatically becomes `In Shop` and is hidden from dispatch.
8. **Reporting:** Reports automatically update operational cost and fuel efficiency based on the latest trip and fuel log.

---

## 🗂️ Expected Database Entities

- **Users, Roles, Vehicles, Drivers, Trips, Maintenance Logs, Fuel Logs, Expenses**

---

## 🧠 Proposed Tech Stack

- **Frontend:** React (Vite) / Responsive web interface with Dark Mode.
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas

---

## 🛠️ Local Setup

```bash
# Clone the repository
git clone https://github.com/Mayank-Bharti/Odoo_Hackathon_2026_Mayank_Bharti.git

# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup
cd ../frontend
npm install
npm run dev

# Open the application
http://localhost:5173
```

---

_Developed for the Odoo Hackathon 2026._
