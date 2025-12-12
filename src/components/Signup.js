import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      });

      if (response.data.success) {
        // Redirect to login page with success message
        navigate('/user-login', {
          state: {
            message: 'Account created successfully! Please log in with your credentials.',
            email: formData.email
          }
        });
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="form-container fade-in">
        <div className="login-form">
          <h2>Join TailMate</h2>
          <p>Create your account to start adopting or listing pets</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p>
            Already have an account? <Link to="/user-login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
