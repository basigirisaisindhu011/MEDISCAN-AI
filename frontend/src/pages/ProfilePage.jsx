import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiShield, FiCalendar } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', password: '' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        password: form.password ? form.password : undefined
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-500 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <FiShield className="text-9xl text-white" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
            {getInitials(user?.name)}
          </div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-bold">{user?.name || 'User Profile'}</h1>
            <p className="text-blue-100 text-sm flex items-center justify-center md:justify-start gap-2">
              <FiMail /> {user?.email}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm border border-white/20">
                <FiShield /> Role: {user?.role || 'USER'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm border border-white/20">
                <FiCalendar /> Active Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Account Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Update your personal information and account security password.</p>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-2xl p-4 text-sm font-medium flex items-center gap-2 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            <FiCheckCircle className="text-lg shrink-0" />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-slate-400 text-lg" />
                <input 
                  className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                  placeholder="Enter your full name" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-slate-400 text-lg" />
                <input 
                  className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                  placeholder="name@example.com" 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">New Password (leave blank to keep current password)</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-slate-400 text-lg" />
              <input 
                className="w-full rounded-2xl border border-slate-200 pl-11 pr-12 py-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
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

          <div className="pt-2 flex justify-end">
            <button 
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 transition" 
              type="submit"
            >
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
