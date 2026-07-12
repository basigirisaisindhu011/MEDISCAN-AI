import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setMessage('Registration successful. Please log in.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        <h2 className="text-3xl font-semibold text-slate-900">Create your account</h2>
        <p className="mt-2 text-sm text-slate-600">Start scanning prescriptions in minutes</p>
        {message && <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-600">{message}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="w-full rounded-2xl border border-slate-200 p-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded-2xl border border-slate-200 p-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-2xl border border-slate-200 p-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="w-full rounded-2xl bg-blue-600 py-3 text-white" type="submit">Register</button>
        </form>
        <p className="mt-4 text-sm text-slate-600">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </div>
    </div>
  );
}
