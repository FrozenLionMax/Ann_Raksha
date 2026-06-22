import API_BASE, { API_URL } from '../config/api';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ShieldCheck, Loader, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const API = `${API_URL}/users/profile`;
const getAuth = () => ({ headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` } });

export default function FSSAIVerification({ fssaiLicense: initialLicense, fssaiVerified: initialVerified }) {
  const [license, setLicense] = useState(initialLicense || '');
  const [verified, setVerified] = useState(initialVerified || false);
  const [submitted, setSubmitted] = useState(!!initialLicense);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!license.trim() || license.length < 10) return toast.error('Enter a valid 14-digit FSSAI license number');
    setLoading(true);
    try {
      await axios.put(API, { fssaiLicense: license.trim() }, getAuth());
      setSubmitted(true);
      const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
      info.fssaiLicense = license.trim();
      localStorage.setItem('userInfo', JSON.stringify(info));
      toast.success('FSSAI license submitted for verification! 📋');
    } catch { toast.error('Failed to submit'); } finally { setLoading(false); }
  };

  if (verified) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
        <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">FSSAI Verified ✅</p>
          <p className="text-xs text-slate-400 mt-0.5">License: {license}</p>
        </div>
      </div>
    );
  }

  if (submitted && license) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4">
        <AlertCircle className="w-8 h-8 text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-400">Pending Verification ⏳</p>
          <p className="text-xs text-slate-400 mt-0.5">License {license} is being verified by our team</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-3">
        <FileText className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-bold text-white">FSSAI Verification</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        💡 FSSAI verification builds trust with NGOs and receivers. Your 14-digit license will be manually verified by our team.
      </p>
      <div className="flex gap-2">
        <input type="text" value={license} onChange={e => setLicense(e.target.value)} placeholder="Enter 14-digit FSSAI License No."
          maxLength={14}
          className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
        />
        <button onClick={handleSubmit} disabled={loading}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Submit
        </button>
      </div>
    </motion.div>
  );
}
