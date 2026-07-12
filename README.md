# TransitOps - Fleet Management System 🚛

TransitOps is an enterprise-grade Fleet Management System built for the Odoo Hackathon 2026. It provides a robust, role-based platform to manage vehicles, drivers, trips, maintenance, and financial analytics.

### 🎥 [Watch the Demo Video Here](https://drive.google.com/drive/folders/1VMIGhPp5_1AesHU1rpjpwYD5QitAFzpe?usp=sharing)
## 🌟 Key Features

### 1. Strict Role-Based Access Control (RBAC)

The system is deeply encapsulated based on 4 distinct user roles:

- **Fleet Manager:** Has full oversight of the system. Manages the vehicle registry, retires old vehicles, and monitors overall fleet health.
- **Driver:** Focused purely on operations. Creates trips, dispatches vehicles, logs fuel, and completes trips.
- **Safety Officer:** Monitors driver compliance. Can update safety scores and manually suspend drivers for violations.
- **Financial Analyst:** Dedicated access to the Analytics Dashboard to monitor total operational costs, fuel efficiency, vehicle ROI, and export CSV reports.

### 2. Dynamic Analytics & Automation (Smart Triggers)

The backend is designed to simulate a real-world, sensor-driven environment:

- **Speed Math & Auto-Penalty:** When a trip is completed, the system calculates simulated speed. Overspeeding automatically deducts the driver's safety score.
- **Auto-Suspension Background Job:** A background cron job continually checks driver licenses. If a license expires, the driver is automatically suspended.
- **Safe Driving Rewards:** Drivers are automatically rewarded with +10 safety score points after 3 consecutive safe trips.
- **Auto-Maintenance Logging:** When a vehicle crosses a 5,000km threshold, the system automatically creates a maintenance log and changes the vehicle's status to "In Shop".

### 3. Comprehensive Dashboards

- Real-time KPIs for Active Vehicles, Fleet Utilization %, Drivers on Duty, and Trip Statuses.
- Region-based filtering (HQ, North, South).
- CSV Export functionality for financial reporting.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), React Router, Context API, Vanilla CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB.
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs.

---

## 🚀 Installation & Setup

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/)

### 1. Clone the repository

```bash
git clone https://github.com/Mayank-Bharti/Odoo_Hackathon_2026_Mayank_Bharti.git
cd Odoo_Hackathon_2026_Mayank_Bharti
```

### 2. Setup the Backend

```bash
cd backend
npm install

```

Run the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

---

## 🎮 How to Test the Demo

1. Open the app in your browser (usually `http://localhost:5173`).
2. Go to the **Signup** page and create 4 different accounts, selecting a different Role for each (e.g., Fleet Manager, Driver, Safety Officer, Financial Analyst).
3. **Login as Fleet Manager:** Add a new vehicle to the registry.
4. **Login as Driver:** Create a trip, select the vehicle you just made, and dispatch it.
5. **Complete the Trip:** Enter an odometer reading and fuel amount. Watch the backend automatically calculate speed, deduct/reward safety scores, or trigger auto-maintenance!
6. **Login as Financial Analyst:** View the updated operational costs and export the CSV report.
