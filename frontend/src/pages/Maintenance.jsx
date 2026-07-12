import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const { user } = useContext(AuthContext);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: "", description: "", cost: "" });

  useEffect(() => {
    fetchLogs();
    fetchVehicles();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/maintenance", { headers: { "x-auth-token": token } });
      setLogs(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/vehicles", { headers: { "x-auth-token": token } });
      setVehicles(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/maintenance", formData, { headers: { "x-auth-token": token } });
      setShowForm(false);
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add log");
    }
  };

  const closeLog = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/maintenance/${id}/close`, {}, { headers: { "x-auth-token": token } });
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to close log");
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Maintenance Logs</h1>
        {user?.role === "FleetManager" && (
          <button className="login-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Log"}
          </button>
        )}
      </header>

      {showForm && (
        <div className="login-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
          <h3>Log Maintenance (Automatically marks vehicle as 'In Shop')</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber}</option>)}
            </select>
            <input type="text" placeholder="Description (e.g. Oil Change)" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <input type="number" placeholder="Cost ($)" required value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <button type="submit" className="login-btn" style={{ gridColumn: 'span 2' }}>Save Log</button>
          </form>
        </div>
      )}

      <div className="login-card" style={{ maxWidth: '100%' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Vehicle</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Cost</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No maintenance logs.</td></tr>
            ) : (
              logs.map(l => (
                <tr key={l._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{l.vehicleId?.registrationNumber || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>{l.description}</td>
                  <td style={{ padding: '1rem' }}>${l.cost}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="role-badge" style={{ backgroundColor: l.status === 'Active' ? 'rgba(239, 68, 68, 0.2)' : '', color: l.status === 'Active' ? '#ef4444' : '' }}>
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {l.status === "Active" && user?.role === "FleetManager" && (
                      <button onClick={() => closeLog(l._id)} style={{ background: '#22c55e', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
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

export default Maintenance;
