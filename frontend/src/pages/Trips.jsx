import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const { user } = useContext(AuthContext);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    source: "", destination: "", vehicleId: "", driverId: "", cargoWeight: "", plannedDistance: ""
  });

  useEffect(() => {
    fetchTrips();
    fetchOptions();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/trips", { headers: { "x-auth-token": token } });
      setTrips(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const vRes = await axios.get("http://localhost:5000/api/vehicles", { headers: { "x-auth-token": token } });
      const dRes = await axios.get("http://localhost:5000/api/drivers", { headers: { "x-auth-token": token } });
      setVehicles(vRes.data.filter(v => v.status === "Available"));
      setDrivers(dRes.data.filter(d => d.status === "Available"));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/trips", formData, { headers: { "x-auth-token": token } });
      setShowForm(false);
      fetchTrips();
      fetchOptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create trip");
    }
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      
      // If completing, we need final odometer and fuel (hardcoded for prototype simplicity)
      let payload = {};
      if (action === 'complete') {
        const odo = prompt("Enter Final Odometer:");
        const fuel = prompt("Enter Fuel Consumed (Liters):");
        if (!odo || !fuel) return alert("Completion cancelled. Odometer and fuel required.");
        payload = { finalOdometer: odo, fuelConsumed: fuel };
      }
      
      await axios.put(`http://localhost:5000/api/trips/${id}/${action}`, payload, { headers: { "x-auth-token": token } });
      fetchTrips();
      fetchOptions();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Trip Management</h1>
        {(user?.role === "FleetManager" || user?.role === "Driver") && (
          <button className="login-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Create Trip"}
          </button>
        )}
      </header>

      {showForm && (
        <div className="login-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
          <h3>Create New Trip</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Source" required value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <input type="text" placeholder="Destination" required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }}>
              <option value="">Select Available Vehicle</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} (Max: {v.maxLoadCapacity}kg)</option>)}
            </select>
            
            <select required value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }}>
              <option value="">Select Available Driver</option>
              {drivers.map(d => <option key={d._id} value={d._id}>{d.name} ({d.licenseNumber})</option>)}
            </select>

            <input type="number" placeholder="Cargo Weight (kg)" required value={formData.cargoWeight} onChange={e => setFormData({...formData, cargoWeight: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            <input type="number" placeholder="Planned Distance (km)" required value={formData.plannedDistance} onChange={e => setFormData({...formData, plannedDistance: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            
            <button type="submit" className="login-btn" style={{ gridColumn: 'span 2' }}>Create Draft Trip</button>
          </form>
        </div>
      )}

      <div className="login-card" style={{ maxWidth: '100%' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Route</th>
              <th style={{ padding: '1rem' }}>Vehicle</th>
              <th style={{ padding: '1rem' }}>Driver</th>
              <th style={{ padding: '1rem' }}>Cargo (kg)</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No trips found.</td></tr>
            ) : (
              trips.map(t => (
                <tr key={t._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{t.source} &rarr; {t.destination}</td>
                  <td style={{ padding: '1rem' }}>{t.vehicleId?.registrationNumber || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>{t.driverId?.name || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>{t.cargoWeight}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="role-badge">{t.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {t.status === "Draft" && (
                      <button onClick={() => handleAction(t._id, 'dispatch')} style={{ marginRight: '10px', background: 'var(--primary)', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Dispatch</button>
                    )}
                    {t.status === "Dispatched" && (
                      <button onClick={() => handleAction(t._id, 'complete')} style={{ marginRight: '10px', background: '#22c55e', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Complete</button>
                    )}
                    {(t.status === "Draft" || t.status === "Dispatched") && (
                      <button onClick={() => handleAction(t._id, 'cancel')} style={{ background: '#ef4444', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
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

export default Trips;
