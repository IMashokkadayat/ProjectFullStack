import axios from 'axios';

// All API calls go to the same host (proxied via Vite to http://localhost:8081)
// Context path is /journal (from application-dev.yml)
const BASE_URL = '/journal';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request that has auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('journal.jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('journal.jwt');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
