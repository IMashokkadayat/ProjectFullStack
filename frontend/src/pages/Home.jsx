import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    // Ping health check on load
    api.get('/public/Health-check')
      .then((res) => {
        setHealthStatus(res.data || 'Online');
      })
      .catch(() => {
        setHealthStatus('Offline / Error');
      });
  }, []);

  return (
    <div className="hero">
      <div className="container">
        <h1 className="hero-title">Your secure, minimal journal.</h1>
        <p className="hero-subtitle">
          Capture your thoughts, track your sentiments, and manage everything with JWT-secured endpoints. 
          A full-stack project powered by Spring Boot & React.
        </p>

        <div className="flex justify-center flex-wrap gap-2 mt-4">
          {isAuthenticated ? (
            <a href="/entries" className="btn btn-primary btn-lg">Go to your Entries</a>
          ) : (
            <>
              <a href="/login" className="btn btn-primary btn-lg">Login</a>
              <a href="/signup" className="btn btn-secondary btn-lg">Create account</a>
            </>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <div className="badge badge-muted">
            API Status: <span className={healthStatus.toLowerCase().includes('ok') || healthStatus.toLowerCase().includes('online') ? 'text-green-400' : 'text-red-400'}>{healthStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
