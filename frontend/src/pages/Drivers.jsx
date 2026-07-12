import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/drivers", {
        headers: { "x-auth-token": token }
      });
      setDrivers(res.data);
    } catch (err) {
      console.error("Error fetching drivers", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/drivers/${id}`, { status: newStatus }, {
        headers: { "x-auth-token": token }
      });
      fetchDrivers();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const updateScore = async (id, currentScore) => {
    const newScore = prompt("Enter new Safety Score (0-100):", currentScore);
    if (newScore !== null && !isNaN(newScore)) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:5000/api/drivers/${id}`, { safetyScore: Number(newScore) }, {
          headers: { "x-auth-token": token }
        });
        fetchDrivers();
      } catch (err) {
        alert("Error updating score");
      }
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Driver Profiles</h1>
      </header>

      <div className="login-card" style={{ maxWidth: '100%' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>License Number</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Safety Score</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No drivers registered yet.</td></tr>
            ) : (
              drivers.map(d => (
                <tr key={d._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{d.name}</td>
                  <td style={{ padding: '1rem' }}>{d.licenseNumber}</td>
                  <td style={{ padding: '1rem' }}>{d.licenseCategory}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: d.safetyScore < 50 ? '#ef4444' : 'inherit' }}>{d.safetyScore}/100</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="role-badge" style={{ backgroundColor: d.status === 'Available' ? 'rgba(34, 197, 94, 0.2)' : (d.status === 'Suspended' ? 'rgba(239, 68, 68, 0.2)' : ''), color: d.status === 'Available' ? '#22c55e' : (d.status === 'Suspended' ? '#ef4444' : 'var(--text-muted)') }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {(user?.role === "SafetyOfficer" || user?.role === "FleetManager") && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button onClick={() => updateScore(d._id, d.safetyScore)} style={{ background: '#3b82f6', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update Score</button>
                        {d.status !== "Suspended" && (
                          <button onClick={() => updateStatus(d._id, "Suspended")} style={{ background: '#ef4444', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Suspend</button>
                        )}
                        {d.status !== "Off Duty" && d.status !== "On Trip" && (
                          <button onClick={() => updateStatus(d._id, "Off Duty")} style={{ background: '#f59e0b', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Off Duty</button>
                        )}
                        {d.status !== "Available" && d.status !== "On Trip" && (
                          <button onClick={() => updateStatus(d._id, "Available")} style={{ background: '#22c55e', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Make Available</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drivers;
