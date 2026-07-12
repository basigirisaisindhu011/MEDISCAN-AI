import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiHome, FiUpload, FiClock, FiUser, FiShield } from 'react-icons/fi';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-semibold text-blue-600">MediScan AI</Link>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link to="/dashboard" className="flex items-center gap-2"><FiHome /> Dashboard</Link>
            <Link to="/upload" className="flex items-center gap-2"><FiUpload /> Upload</Link>
            <Link to="/history" className="flex items-center gap-2"><FiClock /> History</Link>
            <Link to="/profile" className="flex items-center gap-2"><FiUser /> Profile</Link>
            {user?.role === 'ADMIN' && <Link to="/admin" className="flex items-center gap-2"><FiShield /> Admin</Link>}
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500"><FiLogOut /> Logout</button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
