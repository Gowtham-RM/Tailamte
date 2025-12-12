import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OwnerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:'' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/owner-signup', form);
      
      if (response.data.success) {
        setSuccess(response.data.message || 'Owner account created successfully!');
        // Clear the form
        setForm({ name:'', email:'', password:'', phone:'', address:'' });
        
        // Redirect to owner login after 2 seconds
        setTimeout(() => {
          navigate('/owner-login');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Owner signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="page-container" style={{maxWidth:520}}>
        <h1>Owner Signup</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message" style={{color: '#2d9c5a', background: '#f0f9f0', padding: '0.75rem', borderRadius: '5px', marginBottom: '1rem'}}>{success}</div>}
        <form onSubmit={onSubmit} className="signup-form">
          <div className="form-group"><label>Name</label><input name="name" value={form.name} onChange={onChange} required disabled={loading} /></div>
          <div className="form-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={onChange} required disabled={loading} /></div>
          <div className="form-group"><label>Password</label><input type="password" name="password" value={form.password} onChange={onChange} required disabled={loading} /></div>
          <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={onChange} required disabled={loading} /></div>
          <div className="form-group"><label>Address</label><input name="address" value={form.address} onChange={onChange} required disabled={loading} /></div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/owner-login')} disabled={loading}>
              Back to Login
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OwnerSignup;
