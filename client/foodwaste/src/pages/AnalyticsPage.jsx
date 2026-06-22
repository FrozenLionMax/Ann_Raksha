import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BarChart3, Download, Calendar, TrendingUp, Package, Leaf, Droplets, Trophy, Loader } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AnimatedCounter } from '../components/UIEnhancements';

const getAuth = () => ({ headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` } });
const tooltipStyle = { backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '12px' };

const STATUS_COLORS = { available: '#10b981', matched: '#f59e0b', picked_up: '#3b82f6', completed: '#8b5cf6' };
const FOOD_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#6b7280'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [exporting, setExporting] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/dashboard', getAuth());
        setData(res.data);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const exportCSV = async () => {
    setExporting('csv');
    try {
      const res = await axios.get('http://localhost:5000/api/export/donations/csv', { ...getAuth(), responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url; link.download = 'AnnRaksha_Donations.csv'; link.click();
      toast.success('CSV downloaded!');
    } catch { toast.error('Export failed'); } finally { setExporting(''); }
  };

  const exportJSON = async () => {
    setExporting('json');
    try {
      const res = await axios.get('http://localhost:5000/api/export/impact', getAuth());
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'AnnRaksha_Impact_Report.json'; link.click();
      toast.success('Report downloaded!');
    } catch { toast.error('Export failed'); } finally { setExporting(''); }
  };

  const kpis = data?.kpis || {};
  const impact = kpis.impactStats || {};
  const recent = data?.recentDonations || [];

  // Generate chart data from donations
  const weeklyData = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = Array(7).fill(0);
    const meals = Array(7).fill(0);
    recent.forEach(d => {
      const day = new Date(d.createdAt).getDay();
      counts[day]++;
      meals[day] += d.servesPeople || 0;
    });
    return days.map((d, i) => ({ day: d, donations: counts[i], meals: meals[i] }));
  })();

  const statusData = (() => {
    const s = { available: 0, matched: 0, picked_up: 0, completed: 0 };
    recent.forEach(d => { if (s[d.status] !== undefined) s[d.status]++; });
    return Object.entries(s).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] }));
  })();

  const foodTypeData = (() => {
    const types = {};
    recent.forEach(d => { types[d.foodType] = (types[d.foodType] || 0) + 1; });
    return Object.entries(types).map(([name, value], i) => ({ name, value, fill: FOOD_COLORS[i % FOOD_COLORS.length] }));
  })();

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BarChart3 className="w-7 h-7 text-emerald-400" />
              <h1 className="text-3xl font-black text-white">Analytics <span className="text-emerald-400">& Reports</span></h1>
            </div>
            <p className="text-slate-400">Deep dive into your food rescue impact</p>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Donations', value: kpis.totalDonations || 0, icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Meals Provided', value: impact.mealsProvided || 0, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { label: 'CO₂ Prevented', value: impact.co2Saved || 0, icon: Leaf, color: 'text-green-400', bg: 'bg-green-500/10', suffix: ' kg' },
            { label: 'Impact Points', value: kpis.points || 0, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`${kpi.bg} border border-white/5 rounded-2xl p-5`}
            >
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="text-2xl font-black text-white"><AnimatedCounter value={kpi.value} />{kpi.suffix || ''}</p>
              <p className="text-xs text-slate-400 mt-1">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Donation Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Meals Served</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="meals" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Food Type Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={foodTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                  {foodTypeData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center">
              {foodTypeData.map((t, i) => (
                <span key={i} className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.fill }} />{t.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Export */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-white mb-2">Export Data</h3>
          <p className="text-sm text-slate-400 mb-4">Download your donation data and impact reports</p>
          <div className="flex gap-3">
            <button onClick={exportCSV} disabled={!!exporting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {exporting === 'csv' ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export Donations CSV
            </button>
            <button onClick={exportJSON} disabled={!!exporting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {exporting === 'json' ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export Impact Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
