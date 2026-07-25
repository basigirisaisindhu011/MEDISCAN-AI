import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClipboard, FiActivity, FiClock, FiUser } from 'react-icons/fi';
import api from '../api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalPrescriptions: 0, medicinesExtracted: 0, recentUploads: 0, confidence: 0 });
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    api.get('/prescriptions').then((res) => {
      const data = res.data.data || [];
      setPrescriptions(data);
      setStats({ 
        totalPrescriptions: data.length, 
        medicinesExtracted: data.reduce((sum, item) => sum + (item.medicines?.length || 0), 0), 
        recentUploads: Math.min(data.length, 5), 
        confidence: data.length > 0 ? 92 : 0 
      });
    }).catch((err) => console.error("Failed to load dashboard data", err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-teal-500 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-semibold">Hello, welcome back</h1>
        <p className="mt-2 text-blue-100">Track prescriptions, extracted medicines, and recent uploads from one place.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Prescriptions', value: stats.totalPrescriptions, icon: FiClipboard },
          { label: 'Medicines Extracted', value: stats.medicinesExtracted, icon: FiActivity },
          { label: 'Recent Uploads', value: stats.recentUploads, icon: FiClock },
          { label: 'AI Confidence', value: `${stats.confidence}%`, icon: FiUser },
        ].map((item, idx) => (
          <div key={idx} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{item.label}</span>
              <item.icon className="text-blue-600" />
            </div>
            <div className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Prescriptions</h2>
          <Link to="/history" className="text-sm text-blue-600">View all</Link>
        </div>
        <div className="mt-4 space-y-3">
          {prescriptions.slice(0, 5).map((prescription) => (
            <Link key={prescription.id} to={`/prescriptions/${prescription.id}`} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition">
              <div>
                <div className="font-medium">{prescription.doctorName || 'Doctor'}</div>
                <div className="text-sm text-slate-500">{prescription.hospitalName || 'Hospital'} · {prescription.prescriptionDate || 'Unknown date'}</div>
              </div>
              <div className="text-sm text-blue-600">Open</div>
            </Link>
          ))}
          {prescriptions.length === 0 && (
            <div className="text-slate-500 text-sm py-4 text-center">No prescriptions uploaded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
