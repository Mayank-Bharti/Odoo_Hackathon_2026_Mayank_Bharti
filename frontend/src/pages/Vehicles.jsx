import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const { user } = useContext(AuthContext);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    name: "",
    type: "Truck",
    maxLoadCapacity: "",
    odometer: "",
    acquisitionCost: "",
    region: "HQ"
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/vehicles", {
        headers: { "x-auth-token": token }
      });
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/vehicles", formData, {
        headers: { "x-auth-token": token }
      });
      setShowForm(false);
      setFormData({ registrationNumber: "", name: "", type: "Truck", maxLoadCapacity: "", odometer: "", acquisitionCost: "", region: "HQ" });
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add vehicle");
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Vehicle Registry</h1>
        {user?.role === "FleetManager" && (
          <button className="login-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Vehicle"}
          </button>
        )}
      </header>

      {showForm && (
        <div className="login-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
          <h3>Add New Vehicle</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Registration (e.g. Van-05)" required value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} className="input-group" style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <input type="text" placeholder="Model Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <input type="text" placeholder="Type (e.g. Van)" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <select required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }}>
              <option value="HQ">HQ</option>
              <option value="North">North</option>
              <option value="South">South</option>
            </select>
            <input type="number" placeholder="Max Capacity (kg)" required value={formData.maxLoadCapacity} onChange={e => setFormData({...formData, maxLoadCapacity: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <input type="number" placeholder="Odometer" required value={formData.odometer} onChange={e => setFormData({...formData, odometer: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <input type="number" placeholder="Acquisition Cost" required value={formData.acquisitionCost} onChange={e => setFormData({...formData, acquisitionCost: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <button type="submit" className="login-btn" style={{ gridColumn: 'span 2' }}>Save Vehicle</button>
          </form>
        </div>
      )}

      <div className="login-card" style={{ maxWidth: '100%' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Registration</th>
              <th style={{ padding: '1rem' }}>Model</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Capacity (kg)</th>
              <th style={{ padding: '1rem' }}>Region</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No vehicles registered yet.</td></tr>
            ) : (
              vehicles.map(v => (
                <tr key={v._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{v.registrationNumber}</td>
                  <td style={{ padding: '1rem' }}>{v.name}</td>
                  <td style={{ padding: '1rem' }}>{v.type}</td>
                  <td style={{ padding: '1rem' }}>{v.maxLoadCapacity}</td>
                  <td style={{ padding: '1rem' }}>{v.region}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="role-badge" style={{ backgroundColor: v.status === 'Available' ? 'rgba(34, 197, 94, 0.2)' : '', color: v.status === 'Available' ? '#22c55e' : '' }}>
                      {v.status}
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

export default Vehicles;
