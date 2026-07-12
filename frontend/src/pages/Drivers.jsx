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
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No drivers registered yet.</td></tr>
            ) : (
              drivers.map(d => (
                <tr key={d._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{d.name}</td>
                  <td style={{ padding: '1rem' }}>{d.licenseNumber}</td>
                  <td style={{ padding: '1rem' }}>{d.licenseCategory}</td>
                  <td style={{ padding: '1rem' }}>{d.safetyScore}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="role-badge" style={{ backgroundColor: d.status === 'Available' ? 'rgba(34, 197, 94, 0.2)' : '', color: d.status === 'Available' ? '#22c55e' : '' }}>
                      {d.status}
                    </span>
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
