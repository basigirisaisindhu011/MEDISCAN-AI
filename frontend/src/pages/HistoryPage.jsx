import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL + "/api" });

export default function HistoryPage() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get('/prescriptions').then((res) => setPrescriptions(res.data.data || []));
  }, []);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
      <h1 className="text-2xl font-semibold">Prescription History</h1>
      <div className="mt-6 space-y-3">
        {prescriptions.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div>
              <div className="font-medium">{item.doctorName || 'Doctor'}</div>
              <div className="text-sm text-slate-500">{item.hospitalName || 'Hospital'} · {item.prescriptionDate || 'Unknown date'}</div>
            </div>
            <Link to={`/prescriptions/${item.id}`} className="text-sm text-blue-600">Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
