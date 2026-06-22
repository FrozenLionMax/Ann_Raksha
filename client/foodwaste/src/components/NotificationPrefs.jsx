import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Bell, Mail, Smartphone, Package, CheckCircle, MapPin, BarChart3, Loader } from 'lucide-react';

const API = 'http://localhost:5000/api/users/profile';
const getAuth = () => ({ headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` } });

function Toggle({ enabled, onToggle, label, desc, icon: Icon }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {desc && <p className="text-xs text-slate-500">{desc}</p>}
        </div>
      </div>
      <button onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default function NotificationPrefs() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [prefs, setPrefs] = useState(userInfo.notificationPrefs || {
    email: true, push: true, donationClaimed: true, donationCompleted: true, newDonationNearby: true, weeklyReport: true,
  });
  const [saving, setSaving] = useState(false);

  const togglePref = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);
    try {
      await axios.put(API, { notificationPrefs: updated }, getAuth());
      const info = { ...userInfo, notificationPrefs: updated };
      localStorage.setItem('userInfo', JSON.stringify(info));
      toast.success('Preferences saved');
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-5">
        <Bell className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
        {saving && <Loader className="w-4 h-4 text-emerald-400 animate-spin" />}
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Channels</p>
        <Toggle icon={Mail} label="Email Notifications" desc="Receive updates via email" enabled={prefs.email} onToggle={() => togglePref('email')} />
        <Toggle icon={Smartphone} label="Push Notifications" desc="Browser push alerts" enabled={prefs.push} onToggle={() => togglePref('push')} />
      </div>

      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Events</p>
        <Toggle icon={Package} label="Donation Claimed" desc="When someone claims your donation" enabled={prefs.donationClaimed} onToggle={() => togglePref('donationClaimed')} />
        <Toggle icon={CheckCircle} label="Donation Completed" desc="When delivery is confirmed" enabled={prefs.donationCompleted} onToggle={() => togglePref('donationCompleted')} />
        <Toggle icon={MapPin} label="New Donations Nearby" desc="When food is available near you" enabled={prefs.newDonationNearby} onToggle={() => togglePref('newDonationNearby')} />
        <Toggle icon={BarChart3} label="Weekly Impact Report" desc="Weekly summary of your impact" enabled={prefs.weeklyReport} onToggle={() => togglePref('weeklyReport')} />
      </div>
    </motion.div>
  );
}
