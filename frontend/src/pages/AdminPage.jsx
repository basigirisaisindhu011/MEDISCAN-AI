import { useEffect, useState } from 'react';
import api from '../api';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'));
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>}
      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-slate-500">{user.email} · Role: {user.role}</div>
            </div>
            <button 
              onClick={() => handleDeleteUser(user.id)}
              className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-sm text-white transition"
            >
              Delete
            </button>
          </div>
        ))}
        {users.length === 0 && !error && (
          <div className="text-slate-500 text-sm py-4 text-center">No users registered yet.</div>
        )}
      </div>
    </div>
  );
}
