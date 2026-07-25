import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../api';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setMessage('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post('/prescriptions/upload', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      const data = res.data.data;
      setResult(data);
      setMessage(res.data.message || 'Prescription analyzed successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setMessage('');
  };

  const getImageSrc = () => {
    if (result?.imagePath) {
      return result.imagePath.startsWith('http') 
        ? result.imagePath 
        : `${BASE_URL}/${result.imagePath.replace(/^\/+/, '')}`;
    }
    return previewUrl;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-semibold">Upload & Analyze Prescription</h1>
        <p className="mt-2 text-slate-600">Upload a prescription image in JPG, PNG, or JPEG format (up to 10 MB) for AI analysis.</p>

        {!result ? (
          <form onSubmit={handleUpload} className="mt-8 space-y-6">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 hover:border-blue-500 transition bg-slate-50">
              <input 
                type="file" 
                accept="image/png,image/jpg,image/jpeg" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
              />
              {previewUrl && (
                <div className="mt-4 w-full flex flex-col items-center">
                  <span className="text-xs font-medium text-slate-500 mb-2">Image Selected Preview:</span>
                  <img src={previewUrl} alt="Selected Preview" className="max-h-64 rounded-xl border border-slate-200 object-contain shadow-sm" />
                </div>
              )}
            </div>

            <button 
              disabled={loading || !file}
              className="w-full rounded-2xl bg-blue-600 py-3.5 px-6 font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition" 
              type="submit"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Prescription with AI...
                </span>
              ) : 'Analyze Prescription'}
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-emerald-600 font-semibold flex items-center gap-2">
                ✓ Prescription Analyzed Successfully
              </div>
              <button 
                onClick={resetUpload}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Upload Another
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Prescription Image & Details */}
              <div className="rounded-2xl border border-slate-200 p-5 space-y-4 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Prescription Image</h3>
                {getImageSrc() ? (
                  <div className="flex justify-center bg-white p-2 rounded-xl border border-slate-200">
                    <img 
                      src={getImageSrc()} 
                      alt="Analyzed Prescription" 
                      className="max-h-72 object-contain rounded-lg shadow-sm"
                      onError={(e) => {
                        // Fallback to local file preview blob if available
                        if (previewUrl && e.target.src !== previewUrl) {
                          e.target.src = previewUrl;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 text-sm">No image preview available</div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs">Doctor</span>
                    <span className="font-medium text-slate-900">{result.doctorName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Hospital / Clinic</span>
                    <span className="font-medium text-slate-900">{result.hospitalName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Date</span>
                    <span className="font-medium text-slate-900">{result.prescriptionDate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Extracted OCR Text */}
              <div className="rounded-2xl border border-slate-200 p-5 space-y-2 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Extracted Text (OCR)</h3>
                <p className="whitespace-pre-line text-sm text-slate-700 font-mono bg-white p-4 rounded-xl border border-slate-200 max-h-72 overflow-y-auto">
                  {result.extractedText || 'No text extracted.'}
                </p>
              </div>
            </div>

            {/* Medicines Extracted */}
            <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">Extracted Medicines</h3>
              <div className="space-y-3">
                {(result.medicines || []).map((med, idx) => (
                  <div key={idx} className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                    <div className="font-semibold text-blue-950">{med.medicineName || 'Medicine'}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Strength: {med.strength || 'N/A'} · Frequency: {med.frequency || 'N/A'} · Duration: {med.duration || 'N/A'}
                    </div>
                    {med.instructions && (
                      <div className="mt-1 text-sm text-slate-500">Instructions: {med.instructions}</div>
                    )}
                  </div>
                ))}
                {(!result.medicines || result.medicines.length === 0) && (
                  <div className="text-slate-500 text-sm italic">No medicines structured from text.</div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Link 
                to={`/prescriptions/${result.id}`} 
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                View Full Details Page
              </Link>
              <Link 
                to="/history" 
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Go to History
              </Link>
            </div>
          </div>
        )}

        {message && !result && (
          <div className={`mt-4 rounded-2xl p-4 text-sm font-medium ${message.includes('failed') || message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
