import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL + "/api" });

export default function PrescriptionDetailPage() {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get(`/prescriptions/${id}`).then((res) => setPrescription(res.data.data));
  }, [id]);

  if (!prescription) return <div className="p-8">Loading...</div>;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
      <h1 className="text-2xl font-semibold">Prescription Details</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="text-sm text-slate-500">Doctor</div>
          <div className="mt-1 font-medium">{prescription.doctorName}</div>
          <div className="mt-4 text-sm text-slate-500">Hospital</div>
          <div className="mt-1 font-medium">{prescription.hospitalName}</div>
          <div className="mt-4 text-sm text-slate-500">Date</div>
          <div className="mt-1 font-medium">{prescription.prescriptionDate}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="text-sm text-slate-500">Extracted Text</div>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{prescription.extractedText}</p>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold">Medicines</h2>
        <div className="mt-4 space-y-3">
          {(prescription.medicines || []).map((medicine) => (
            <div key={medicine.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="font-medium">{medicine.medicineName}</div>
              <div className="mt-2 text-sm text-slate-600">Dose: {medicine.strength} · Frequency: {medicine.frequency} · Duration: {medicine.duration}</div>
              <div className="mt-1 text-sm text-slate-600">Instructions: {medicine.instructions}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
