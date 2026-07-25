import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { BASE_URL } from '../api';

export default function PrescriptionDetailPage() {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/prescriptions/${id}`)
      .then((res) => setPrescription(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load prescription details'));
  }, [id]);

  if (error) return <div className="p-8 text-red-600 font-medium">{error}</div>;
  if (!prescription) return <div className="p-8">Loading prescription details...</div>;

  const imageUrl = prescription.imagePath 
    ? (prescription.imagePath.startsWith('http') ? prescription.imagePath : `${BASE_URL}/${prescription.imagePath.replace(/^\/+/, '')}`)
    : null;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
      <h1 className="text-2xl font-semibold">Prescription Details</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
          <div>
            <div className="text-sm text-slate-500">Doctor</div>
            <div className="mt-1 font-medium">{prescription.doctorName || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Hospital / Clinic</div>
            <div className="mt-1 font-medium">{prescription.hospitalName || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Date</div>
            <div className="mt-1 font-medium">{prescription.prescriptionDate || 'N/A'}</div>
          </div>
          {imageUrl && (
            <div className="pt-2">
              <div className="text-sm text-slate-500 mb-2">Prescription Image</div>
              <div className="flex justify-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                <img 
                  src={imageUrl} 
                  alt="Prescription" 
                  className="max-h-72 rounded-lg object-contain" 
                />
              </div>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="text-sm text-slate-500">Extracted Text (OCR)</div>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-700 font-mono bg-slate-50 p-4 rounded-xl max-h-96 overflow-y-auto">
            {prescription.extractedText || 'No text extracted.'}
          </p>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold">Medicines</h2>
        <div className="mt-4 space-y-3">
          {(prescription.medicines || []).map((medicine) => (
            <div key={medicine.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="font-medium text-slate-900">{medicine.medicineName}</div>
              <div className="mt-2 text-sm text-slate-600">Dose: {medicine.strength || 'N/A'} · Frequency: {medicine.frequency || 'N/A'} · Duration: {medicine.duration || 'N/A'}</div>
              {medicine.instructions && (
                <div className="mt-1 text-sm text-slate-600">Instructions: {medicine.instructions}</div>
              )}
            </div>
          ))}
          {(!prescription.medicines || prescription.medicines.length === 0) && (
            <div className="text-slate-500 text-sm py-2">No structured medicines extracted.</div>
          )}
        </div>
      </div>
    </div>
  );
}
