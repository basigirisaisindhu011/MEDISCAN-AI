import { useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL + "/api" });

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await api.post('/prescriptions/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setMessage(res.data.message || 'Prescription uploaded successfully');
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
      <h1 className="text-2xl font-semibold">Upload Prescription</h1>
      <p className="mt-2 text-slate-600">Upload an image in JPG, PNG, or JPEG format up to 10 MB.</p>
      <form onSubmit={handleUpload} className="mt-8 space-y-4">
        <input type="file" accept="image/png,image/jpg,image/jpeg" onChange={(e) => setFile(e.target.files[0])} className="block w-full rounded-2xl border border-dashed border-slate-300 p-6" />
        <button className="rounded-2xl bg-blue-600 px-6 py-3 text-white" type="submit">Analyze Prescription</button>
      </form>
      {message && <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-blue-700">{message}</div>}
    </div>
  );
}
