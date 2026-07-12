import { useState } from 'react';

export default function ProfilePage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <form className="mt-6 space-y-4">
        <input className="w-full rounded-2xl border border-slate-200 p-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded-2xl border border-slate-200 p-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-2xl border border-slate-200 p-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="rounded-2xl bg-blue-600 px-6 py-3 text-white" type="submit">Update Profile</button>
      </form>
    </div>
  );
}
