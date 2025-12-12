import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Login.css';

function UserLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Pre-fill email if provided
      if (location.state.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
      }
      // Clear the location state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        const redirectTarget = location.state?.from?.pathname || location.state?.from || '/';
        navigate(redirectTarget, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="form-container fade-in">
        <div className="login-form">
          <h2>Welcome Back</h2>
          <p>Sign in to your TailMate account</p>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p>
            Don't have an account? <Link to="/signup">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;