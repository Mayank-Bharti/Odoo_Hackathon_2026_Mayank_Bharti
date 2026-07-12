import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FleetManager");
  
  // Dynamic fields for Driver
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] = useState("Class B");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password, role };
      
      if (role === "Driver") {
        payload.name = name;
        payload.licenseNumber = licenseNumber;
        payload.licenseCategory = licenseCategory;
        payload.licenseExpiryDate = licenseExpiryDate;
        payload.contactNumber = contactNumber;
      }

      await axios.post("http://localhost:5000/api/auth/register", payload);
      
      setSuccess("Account created successfully! Redirecting to login...");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '500px' }}>
        <h1 className="login-title">TransitOps</h1>
        <p className="login-subtitle">Register New Account</p>
        
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-error" style={{backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.2)'}}>{success}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@transitops.com"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <div className="input-group">
            <label>Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                backgroundColor: '#0f172a',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
            >
              <option value="FleetManager">Fleet Manager</option>
              <option value="Driver">Driver</option>
              <option value="SafetyOfficer">Safety Officer</option>
              <option value="FinancialAnalyst">Financial Analyst</option>
            </select>
          </div>

          {/* DYNAMIC FIELDS FOR DRIVER */}
          {role === "Driver" && (
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--primary)' }}>Driver Profile Details</h3>
              
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Contact Number</label>
                <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>License Number</label>
                <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>License Category</label>
                  <input type="text" value={licenseCategory} onChange={(e) => setLicenseCategory(e.target.value)} placeholder="e.g. Class A" required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Expiry Date</label>
                  <input type="date" value={licenseExpiryDate} onChange={(e) => setLicenseExpiryDate(e.target.value)} required />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="login-btn">Register</button>
        </form>
        <p style={{textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)'}}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
