import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    sentimentAnalysis: false,
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/signup', formData);
      addToast('Account created successfully! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data || err.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card shadow-lg p-4" style={{ maxWidth: '500px' }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">✨</div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-muted mt-1">Start your journaling journey</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input 
              id="userName" 
              name="userName"
              type="text" 
              value={formData.userName} 
              onChange={handleChange} 
              required 
              placeholder="Choose a username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email"
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="you@example.com (optional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password"
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="Create a strong password"
            />
          </div>
          
          <div className="form-check mt-1">
            <input 
              type="checkbox" 
              id="sentimentAnalysis" 
              name="sentimentAnalysis"
              checked={formData.sentimentAnalysis} 
              onChange={handleChange} 
            />
            <label htmlFor="sentimentAnalysis">Enable AI sentiment analysis for entries</label>
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
