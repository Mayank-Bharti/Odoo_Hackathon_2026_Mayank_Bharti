import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [regionFilter, setRegionFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [regionFilter]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = regionFilter ? `http://localhost:5000/api/analytics/dashboard?region=${regionFilter}` : `http://localhost:5000/api/analytics/dashboard`;
      
      const res = await axios.get(url, {
        headers: { "x-auth-token": token }
      });
      setMetrics(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!metrics) return;
    const csvContent = `data:text/csv;charset=utf-8,Metric,Value\nTotal Vehicles,${metrics.vehicleMetrics.total}\nActive Vehicles,${metrics.vehicleMetrics.active}\nFleet Utilization,${metrics.vehicleMetrics.utilizationPercent}%\nTotal Operational Cost,$${metrics.financialMetrics.totalOperationalCost}\nFuel Efficiency,${metrics.financialMetrics.fuelEfficiency} km/L`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transitops_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Overview Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            value={regionFilter} 
            onChange={(e) => setRegionFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }}
          >
            <option value="">All Regions</option>
            <option value="HQ">HQ</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
          {(user?.role === "FleetManager" || user?.role === "FinancialAnalyst") && (
            <button className="login-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={handleExportCSV}>Export CSV</button>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="login-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fleet Utilization</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', margin: '10px 0' }}>{metrics.vehicleMetrics.utilizationPercent}%</p>
        </div>
        <div className="login-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Active Vehicles</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{metrics.vehicleMetrics.active} / {metrics.vehicleMetrics.total}</p>
        </div>
        <div className="login-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vehicles in Shop</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', margin: '10px 0' }}>{metrics.vehicleMetrics.inMaintenance}</p>
        </div>
        <div className="login-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Drivers on Duty</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e', margin: '10px 0' }}>{metrics.driverMetrics.onDuty}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="login-card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Trip Status</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>Dispatched (Active)</span>
              <span style={{ fontWeight: 'bold' }}>{metrics.tripMetrics.active}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>Draft (Pending)</span>
              <span style={{ fontWeight: 'bold' }}>{metrics.tripMetrics.pending}</span>
            </li>
          </ul>
        </div>
        
        {(user?.role === "FleetManager" || user?.role === "FinancialAnalyst") && (
          <div className="login-card">
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Financials</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>Total Operational Cost</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>${metrics.financialMetrics.totalOperationalCost}</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>Fuel Efficiency</span>
                <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{metrics.financialMetrics.fuelEfficiency} km/L</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;