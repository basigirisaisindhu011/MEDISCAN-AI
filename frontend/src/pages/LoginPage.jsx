import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import GoogleAuthModal from '../components/GoogleAuthModal';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl border border-white/20">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 mb-4">
            M
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-600">Sign in to your MediScan AI account</p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-slate-400 text-lg" />
              <input 
                className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                placeholder="user@example.com" 
                type="email" 
                required
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-slate-400 text-lg" />
              <input 
                className="w-full rounded-2xl border border-slate-200 pl-11 pr-12 py-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
                required
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 text-lg"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 transition" 
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-xs uppercase text-slate-400 font-semibold">Or continue with</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <button 
          onClick={() => setShowGoogleModal(true)}
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account? <Link className="font-semibold text-blue-600 hover:underline" to="/register">Create Account</Link>
        </p>
      </div>

      <GoogleAuthModal 
        isOpen={showGoogleModal} 
        onClose={() => setShowGoogleModal(false)} 
      />
    </div>
  );
}
