import API_BASE, { API_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Repeat, Plus, Trash2, Loader, ToggleLeft, ToggleRight, Calendar, Package, Clock, X } from 'lucide-react';

const API = `${API_URL}/recurring`;
const getAuth = () => ({ headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` } });

const FREQ_LABELS = { daily: 'Daily', weekly: 'Weekly', biweekly: 'Bi-weekly', monthly: 'Monthly' };

export default function RecurringDonations() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    foodTitle: '', foodType: 'cooked', quantity: '', servesPeople: '', pickupAddress: '', frequency: 'weekly',
  });

  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${API}/my`, getAuth());
      setSchedules(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.foodTitle || !form.quantity || !form.pickupAddress) return toast.error('Fill required fields');
    setSaving(true);
    try {
      await axios.post(`${API}/create`, {
        template: { foodTitle: form.foodTitle, foodType: form.foodType, quantity: form.quantity, servesPeople: parseInt(form.servesPeople) || 1, pickupAddress: form.pickupAddress },
        frequency: form.frequency,
      }, getAuth());
      toast.success('Recurring schedule created! 🔄');
      setShowForm(false);
      setForm({ foodTitle: '', foodType: 'cooked', quantity: '', servesPeople: '', pickupAddress: '', frequency: 'weekly' });
      fetchSchedules();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const toggle = async (id) => {
    try {
      await axios.put(`${API}/toggle/${id}`, {}, getAuth());
      fetchSchedules();
      toast.success('Schedule updated');
    } catch { toast.error('Failed'); }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, getAuth());
      fetchSchedules();
      toast.success('Schedule deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Repeat className="w-7 h-7 text-emerald-400" />
              <h1 className="text-3xl font-black text-white">Recurring <span className="text-emerald-400">Donations</span></h1>
            </div>
            <p className="text-slate-400">Automate your food donations on a schedule</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'New Schedule'}
          </button>
        </motion.div>

        {/* Create Form */}
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleCreate} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold text-white mb-4">New Recurring Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={form.foodTitle} onChange={e => setForm({ ...form, foodTitle: e.target.value })} placeholder="Food Title *" className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              <select value={form.foodType} onChange={e => setForm({ ...form, foodType: e.target.value })} className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                <option value="cooked">Cooked</option><option value="raw">Raw</option><option value="packaged">Packaged</option><option value="bakery">Bakery</option><option value="fruits">Fruits</option><option value="other">Other</option>
              </select>
              <input value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="Quantity (kg) *" className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              <input value={form.servesPeople} onChange={e => setForm({ ...form, servesPeople: e.target.value })} placeholder="Serves people" type="number" className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              <input value={form.pickupAddress} onChange={e => setForm({ ...form, pickupAddress: e.target.value })} placeholder="Pickup Address *" className="md:col-span-2 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm text-slate-400">Frequency:</label>
              <div className="flex gap-2">
                {Object.entries(FREQ_LABELS).map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setForm({ ...form, frequency: val })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${form.frequency === val ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
                  >{label}</button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="mt-4 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Repeat className="w-4 h-4" />}
              Create Schedule
            </button>
          </motion.form>
        )}

        {/* Schedules List */}
        {schedules.length === 0 ? (
          <div className="text-center py-16">
            <Repeat className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No recurring schedules</h3>
            <p className="text-slate-400">Set one up to automate your donations!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((s, i) => (
              <motion.div key={s._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white/5 border rounded-2xl p-5 transition-all ${s.isActive ? 'border-emerald-500/20' : 'border-white/10 opacity-60'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{s.template.foodTitle}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {s.template.quantity} kg</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">{FREQ_LABELS[s.frequency]}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Next: {new Date(s.nextRun).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Runs: {s.runCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggle(s._id)} className="p-2 hover:bg-white/5 rounded-xl transition" title={s.isActive ? 'Pause' : 'Resume'}>
                      {s.isActive ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-slate-500" />}
                    </button>
                    <button onClick={() => remove(s._id)} className="p-2 hover:bg-red-500/10 rounded-xl transition text-slate-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
