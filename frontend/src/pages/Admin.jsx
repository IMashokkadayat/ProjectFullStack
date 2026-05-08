import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [creating, setCreating] = useState(false);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/all-users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError("You don't have ADMIN privileges to view this page.");
      } else {
        setError(err.response?.data || "Failed to load users. Ensure you have the ADMIN role.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/create-admin-user', formData);
      addToast('Admin user created successfully', 'success');
      setFormData({ username: '', password: '', email: '' });
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data || 'Failed to create admin', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await api.get('/admin/clear-app-cache');
      addToast('Application cache cleared', 'success');
    } catch (err) {
      addToast('Failed to clear cache', 'error');
    }
  };

  if (error) {
    return (
      <div className="container page-wrapper">
        <div className="alert alert-danger">
          <h3 className="font-bold mb-1">Access Denied</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage users and system settings.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleClearCache}>
          Clear App Cache
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 350px)', alignItems: 'start' }}>
        {/* Users List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">All Users</h2>
            <button className="btn btn-sm btn-secondary" onClick={fetchUsers} disabled={loading}>
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card shadow-sm"><div className="card-body placeholder-glow"><div className="skeleton h-4 w-1/2 mb-2"></div><div className="skeleton h-3 w-3/4"></div></div></div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="alert alert-info">No users found.</div>
          ) : (
            <div className="grid grid-2">
              {users.map(u => (
                <div key={u.id || u.username} className="card">
                  <div className="card-body">
                    <h3 className="font-bold">{u.username}</h3>
                    <p className="text-sm text-muted mb-3">{u.email || 'No email'}</p>
                    <div className="flex flex-wrap gap-1">
                      {(u.roles || []).map(r => (
                        <span key={r} className={`badge ${r === 'ADMIN' ? 'badge-blue' : 'badge-muted'}`}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Admin Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-bold">Create Admin</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateAdmin} className="flex flex-col gap-3">
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary mt-2" disabled={creating}>
                {creating ? 'Creating...' : 'Create Admin User'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
