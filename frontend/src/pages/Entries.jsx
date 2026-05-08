import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null); // null means create new
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  
  const { addToast } = useToast();

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/journal');
      // Backend returns either array or 404 if empty
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status === 404) {
        setEntries([]); // Empty list is 404 in this API
      } else {
        addToast(err.response?.data || 'Failed to load entries', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this entry permanently?')) return;
    
    try {
      await api.delete(`/journal/id/${id}`);
      addToast('Entry deleted', 'success');
      fetchEntries();
    } catch (err) {
      addToast('Failed to delete entry', 'error');
    }
  };

  const openModal = (entry = null) => {
    setCurrentEntry(entry);
    setFormData({
      title: entry?.title || '',
      content: entry?.content || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEntry(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentEntry?.id) {
        // Update
        await api.put(`/journal/id/${currentEntry.id}`, formData);
        addToast('Entry updated', 'success');
      } else {
        // Create
        await api.post('/journal', formData);
        addToast('Entry created', 'success');
      }
      closeModal();
      fetchEntries();
    } catch (err) {
      addToast(err.response?.data || 'Failed to save entry', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your Entries</h1>
          <p className="page-subtitle">Manage your daily thoughts securely.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={fetchEntries} disabled={loading}>
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + New Entry
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card shadow-sm" style={{ height: '180px' }}>
              <div className="card-body">
                <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '80%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="text-xl mb-1">No entries yet</h3>
          <p className="text-muted mb-4">Start writing your first journal entry.</p>
          <button className="btn btn-primary" onClick={() => openModal()}>Create Entry</button>
        </div>
      ) : (
        <div className="grid grid-3">
          {/* Slice and reverse to show newest first if dates exist */}
          {[...entries].reverse().map((entry) => (
            <div 
              key={entry.id} 
              className="card entry-card flex flex-col justify-between" 
              onClick={() => openModal(entry)}
            >
              <div className="card-body">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold truncate">{entry.title || '(untitled)'}</h3>
                  {entry.sentiment && (
                    <span className="badge badge-purple sentiment-badge">{entry.sentiment}</span>
                  )}
                </div>
                <p className="text-sm text-muted truncate-2">{entry.content || 'No content'}</p>
              </div>
              <div className="card-footer bg-transparent flex justify-between items-center py-3">
                <span className="text-xs text-muted">
                  {entry.date ? new Date(entry.date).toLocaleDateString() : '—'}
                </span>
                <button 
                  className="btn btn-danger btn-sm" 
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={(e) => handleDelete(entry.id, e)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentEntry ? 'Edit Entry' : 'New Entry'}</h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input 
                    id="title" 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    required 
                    placeholder="Entry title"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content">Content</label>
                  <textarea 
                    id="content" 
                    value={formData.content} 
                    onChange={(e) => setFormData({...formData, content: e.target.value})} 
                    placeholder="Write your thoughts here..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
