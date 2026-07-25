import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiHome, FiUpload, FiClock, FiUser, FiShield } from 'react-icons/fi';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'Upload', path: '/upload', icon: FiUpload },
    { label: 'History', path: '/history', icon: FiClock },
    { label: 'Profile', path: '/profile', icon: FiUser },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: FiShield });
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              M
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">MediScan <span className="text-blue-600">AI</span></span>
          </Link>

          <div className="flex items-center gap-1.5 md:gap-2 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="text-base" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            <div className="h-5 w-px bg-slate-200 mx-2"></div>

            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-blue-600">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {getInitials(user?.name)}
                </div>
                <span className="hidden md:inline font-semibold text-xs text-slate-800">{user?.name}</span>
              </Link>

              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                title="Logout"
              >
                <FiLogOut className="text-sm" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
