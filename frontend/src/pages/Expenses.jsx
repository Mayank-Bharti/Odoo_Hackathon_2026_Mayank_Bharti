import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Expenses = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: "", type: "Fuel", cost: "", liters: "" });

  if (user?.role === "Driver" || user?.role === "SafetyOfficer") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchExpenses();
    fetchVehicles();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/expenses", { headers: { "x-auth-token": token } });
      setExpenses(res.data);
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
      await axios.post("http://localhost:5000/api/expenses", formData, { headers: { "x-auth-token": token } });
      setShowForm(false);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Fuel & Expenses</h1>
        {(user?.role === "FleetManager" || user?.role === "FinancialAnalyst" || user?.role === "Driver") && (
          <button className="login-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Log Expense"}
          </button>
        )}
      </header>

      {showForm && (
        <div className="login-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
          <h3>Log New Expense</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }}>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber}</option>)}
            </select>
            <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }}>
              <option value="Fuel">Fuel</option>
              <option value="Toll">Toll</option>
              <option value="Other">Other</option>
            </select>
            <input type="number" placeholder="Total Cost ($)" required value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            {formData.type === "Fuel" && (
              <input type="number" placeholder="Liters Consumed" required value={formData.liters} onChange={e => setFormData({...formData, liters: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid var(--border)' }} />
            )}
            <button type="submit" className="login-btn" style={{ gridColumn: 'span 2' }}>Save Expense</button>
          </form>
        </div>
      )}

      <div className="login-card" style={{ maxWidth: '100%' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Vehicle</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Cost</th>
              <th style={{ padding: '1rem' }}>Liters (if Fuel)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No expenses logged.</td></tr>
            ) : (
              expenses.map(e => (
                <tr key={e._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(e.dateLogged).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{e.vehicleId?.registrationNumber || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="role-badge" style={{ backgroundColor: e.type === 'Fuel' ? 'rgba(59, 130, 246, 0.2)' : '', color: e.type === 'Fuel' ? '#3b82f6' : '' }}>
                      {e.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>${e.cost}</td>
                  <td style={{ padding: '1rem' }}>{e.type === 'Fuel' ? e.liters : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
