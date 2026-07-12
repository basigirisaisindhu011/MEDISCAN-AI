import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiShield, FiZap } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-semibold text-blue-600">MediScan AI</div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 rounded-full border border-blue-400 text-blue-600">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded-full bg-blue-600 text-white">Register</Link>
        </div>
      </nav>
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold text-slate-900">AI-powered prescription reading for modern healthcare.</h1>
          <p className="mt-4 text-lg text-slate-600">Upload a prescription image and let MediScan AI extract medicines, dosage, timing, and instructions with OCR and Gemini intelligence.</p>
          <div className="mt-8 flex gap-4">
            <Link to="/register" className="px-6 py-3 rounded-full bg-blue-600 text-white">Get Started</Link>
            <Link to="/login" className="px-6 py-3 rounded-full border border-slate-300">Try Demo</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl bg-white/70 backdrop-blur p-6 shadow-xl border border-slate-200">
          <div className="grid gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
              <FiUploadCloud className="text-2xl text-blue-600" />
              <div><div className="font-semibold">Upload prescription</div><div className="text-sm text-slate-600">Drag and drop or take a photo</div></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-teal-50 p-4">
              <FiZap className="text-2xl text-teal-600" />
              <div><div className="font-semibold">AI extraction</div><div className="text-sm text-slate-600">OCR + Gemini for structured results</div></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <FiShield className="text-2xl text-slate-600" />
              <div><div className="font-semibold">Secure & private</div><div className="text-sm text-slate-600">Jwt protected and role-based access</div></div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
