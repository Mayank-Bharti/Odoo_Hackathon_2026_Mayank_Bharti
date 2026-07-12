import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const DashboardPlaceholder = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>TransitOps</h2>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/vehicles">Vehicles</Link></li>
            <li><Link to="/drivers">Drivers</Link></li>
            <li><Link to="/trips">Trips</Link></li>
          </ul>
        </nav>
        <div className="user-info">
          <p>{user?.email}</p>
          <span className="role-badge">{user?.role}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <header>
          <h1>Overview</h1>
        </header>
        <div className="content-area">
          <div className="kpi-card">Active Vehicles: 12</div>
          <div className="kpi-card">Available Drivers: 8</div>
          <div className="kpi-card">Active Trips: 4</div>
        </div>
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
            <Route path="/" element={<DashboardPlaceholder />} />
            {/* Future routes will go here */}
            <Route path="/vehicles" element={<div>Vehicles Page</div>} />
            <Route path="/drivers" element={<div>Drivers Page</div>} />
            <Route path="/trips" element={<div>Trips Page</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;