import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
import Maintenance from "./pages/Maintenance";
import Expenses from "./pages/Expenses";
import Dashboard from "./pages/Dashboard";

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>TransitOps</h2>
        <nav>
          <ul>
            <li><Link to="/">Overview</Link></li>
            {user?.role === "FleetManager" && (
              <li><Link to="/vehicles">Vehicles</Link></li>
            )}
            {(user?.role === "FleetManager" || user?.role === "SafetyOfficer") && (
              <li><Link to="/drivers">Drivers</Link></li>
            )}
            {(user?.role === "FleetManager" || user?.role === "Driver") && (
              <li><Link to="/trips">Trips</Link></li>
            )}
            {(user?.role === "FleetManager" || user?.role === "FinancialAnalyst") && (
              <li><Link to="/maintenance">Maintenance</Link></li>
            )}
            {(user?.role === "FleetManager" || user?.role === "FinancialAnalyst") && (
              <li><Link to="/expenses">Expenses</Link></li>
            )}
          </ul>
        </nav>
        <div className="user-info">
          <p>{user?.email}</p>
          <span className="role-badge">{user?.role}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/expenses" element={<Expenses />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;