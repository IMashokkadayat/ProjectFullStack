import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="text-4xl mb-4">404</div>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted mb-4">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Return Home</Link>
    </div>
  );
}
