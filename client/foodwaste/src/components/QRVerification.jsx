import API_BASE, { API_URL } from '../config/api';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { QrCode, CheckCircle, Loader, Download, ShieldCheck } from 'lucide-react';

const API = `${API_URL}/donations`;
const getAuth = () => ({ headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` } });

export default function QRVerification({ donationId, isOwner = false }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/${donationId}/qr`, getAuth());
      setQrCode(res.data.qrCode);
      toast.success('QR Code generated!');
    } catch (err) {
      toast.error('Failed to generate QR');
    } finally { setLoading(false); }
  };

  const verifyPickup = async () => {
    setLoading(true);
    try {
      await axios.put(`${API}/${donationId}/verify-qr`, {}, getAuth());
      setVerified(true);
      toast.success('Pickup verified successfully! ✅');
    } catch (err) {
      toast.error('Verification failed');
    } finally { setLoading(false); }
  };

  if (verified) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center"
      >
        <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <p className="text-white font-bold text-lg">Pickup Verified ✅</p>
        <p className="text-sm text-slate-400 mt-1">This donation has been verified for pickup</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <QrCode className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-bold text-white">Pickup QR Verification</h3>
      </div>

      {!qrCode ? (
        <div className="text-center py-4">
          <p className="text-sm text-slate-400 mb-4">Generate a QR code to verify pickup handoff</p>
          <button onClick={generateQR} disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
            Generate QR Code
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-slate-800 rounded-2xl p-4 inline-block mb-4">
            <img src={qrCode} alt="Donation QR Code" className="w-48 h-48 mx-auto" />
          </div>
          <p className="text-xs text-slate-400 mb-4">
            {isOwner ? 'Show this QR to the pickup volunteer for verification' : 'Scan this QR to verify pickup'}
          </p>
          <div className="flex gap-2 justify-center">
            {!isOwner && (
              <button onClick={verifyPickup} disabled={loading}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Verify Pickup
              </button>
            )}
            <a href={qrCode} download={`donation-${donationId}-qr.png`}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Save QR
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
