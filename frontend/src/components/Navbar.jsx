import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon">📔</span>
          <span>Journal App</span>
        </Link>

        {/* Nav links */}
        <ul className="navbar-nav">
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/entries" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  Entries
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  Admin
                </NavLink>
              </li>
              <li>
                <button
                  id="logout-btn"
                  className="btn btn-danger btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  Login
                </NavLink>
              </li>
              <li>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
