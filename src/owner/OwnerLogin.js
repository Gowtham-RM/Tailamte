import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

function OwnerLogin() {
  const navigate = useNavigate();
  const { loginOwner } = useAuth();
  const [idOrEmail, setIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await loginOwner(idOrEmail, password);
    if (res.success) {
      navigate('/owner');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="main-content">
      <div className="page-container" style={{maxWidth:480}}>
        <h1>Owner Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email or Username</label>
            <input value={idOrEmail} onChange={(e)=>setIdOrEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={()=>navigate('/')}>Cancel</button>
            <button type="submit" className="submit-btn">Login</button>
          </div>
        </form>
        <div className="signup-link" style={{textAlign: 'center', marginTop: '1rem'}}>
          <p style={{color: '#666', margin: '0.5rem 0'}}>Don't have an owner account? 
            <button 
              type="button" 
              style={{
                background: 'none',
                border: 'none',
                color: '#ffaa64',
                textDecoration: 'underline',
                cursor: 'pointer',
                marginLeft: '0.25rem',
                fontSize: 'inherit'
              }}
              onClick={() => navigate('/owner-signup')}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OwnerLogin;
