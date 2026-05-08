import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Profile() {
  const [greeting, setGreeting] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/user')
      .then((res) => {
        setGreeting(res.data);
      })
      .catch((err) => {
        addToast(err.response?.data || 'Failed to load profile data', 'error');
      });
  }, [addToast]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/user', formData);
      addToast('Profile updated. Please login again.', 'success');
      logout();
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This cannot be undone.')) return;
    
    try {
      await api.delete('/user');
      addToast('Account deleted successfully', 'success');
      logout();
      navigate('/signup');
    } catch (err) {
      addToast(err.response?.data || 'Failed to delete account', 'error');
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Manage your account details and preferences.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 350px)', alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-bold">Update Account</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="form-group">
                <label htmlFor="username">New Username</label>
                <input 
                  id="username" 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  placeholder="Enter new username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input 
                  id="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
              <p className="text-xs text-muted mt-2">
                Note: Updating your credentials will log you out, requiring you to sign in again.
              </p>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="card-body text-center py-4">
              <div className="text-3xl mb-2">👋</div>
              {greeting ? (
                <div className="font-medium">{greeting}</div>
              ) : (
                <div className="skeleton mx-auto" style={{ height: '20px', width: '80%' }} />
              )}
            </div>
          </div>

          <div className="card border-red-500" style={{ borderColor: 'rgba(248, 113, 113, 0.3)' }}>
            <div className="card-body">
              <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
              <p className="text-sm text-muted mb-4">
                Permanently delete your account and all of your journal entries.
              </p>
              <button 
                className="btn btn-danger w-full" 
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
