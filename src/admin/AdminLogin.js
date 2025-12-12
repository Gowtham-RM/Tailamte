import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './adminlogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Note: Removed auto-redirect to allow access to login page
  // Users can manually navigate to /admin if already logged in

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(username, password, true);
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          setError('Only admin accounts can log in here.');
        }
      } else {
        setError(result.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <input
            type="text"
            placeholder="Admin Username or Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className="admin-error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;