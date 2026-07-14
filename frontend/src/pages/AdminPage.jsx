import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL + "/api" });

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get('/admin/users').then((res) => setUsers(res.data.data || []));
  }, []);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-slate-500">{user.email} · {user.role}</div>
            </div>
            <button className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
