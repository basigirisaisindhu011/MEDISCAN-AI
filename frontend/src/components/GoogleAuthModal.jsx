import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiX, FiUserPlus, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GoogleAuthModal({ isOpen, onClose }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = async (email, name) => {
    setLoading(true);
    setError('');
    try {
      await googleLogin(email, name);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const name = customName || customEmail.split('@')[0];
    handleSelectAccount(customEmail, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <FiX className="text-xl" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100 mb-3">
            <FcGoogle className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sign in with Google</h3>
          <p className="mt-1 text-xs text-slate-500">Choose an account to continue to <span className="font-semibold text-blue-600">MediScan AI</span></p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Google Email Address</label>
            <input 
              type="email"
              required
              placeholder="user@gmail.com"
              className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Your Name (Optional)</label>
            <input 
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !customEmail}
            className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In with Google Account'}
          </button>
        </form>

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-600 font-medium">
            <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Authenticating with Google...
          </div>
        )}
      </div>
    </div>
  );
}
