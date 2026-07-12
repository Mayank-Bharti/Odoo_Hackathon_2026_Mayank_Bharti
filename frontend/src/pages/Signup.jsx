import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FleetManager");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        role
      });
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
      <div className="login-card">
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
