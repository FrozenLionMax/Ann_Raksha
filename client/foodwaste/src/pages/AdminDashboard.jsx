import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Users, Package, CheckCircle, AlertCircle, Shield, TrendingUp,
  Leaf, Flame, Droplets, BarChart3, Clock, Eye
} from "lucide-react";

const API = "http://localhost:5000/api/admin";
const getToken = () => JSON.parse(localStorage.getItem("userInfo"))?.token;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API}/stats`, { headers }).catch(() => ({ data: {} })),
        axios.get(`${API}/users`, { headers }).catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = [
    { label: "Total Users", value: stats?.totalUsers || users.length || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total Donations", value: stats?.totalDonations || 0, icon: Package, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Completed", value: stats?.completedDonations || 0, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Active Now", value: stats?.activeDonations || 0, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  const roleCounts = {};
  users.forEach(u => { roleCounts[u.role] = (roleCounts[u.role] || 0) + 1; });

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h1 className="text-3xl font-black text-white">
              Admin <span className="text-emerald-400">Panel</span>
            </h1>
          </div>
          <p className="text-slate-400">Platform overview and user management</p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`${kpi.bg} border border-white/5 rounded-2xl p-5`}
            >
              <kpi.icon className={`w-6 h-6 ${kpi.color} mb-3`} />
              <p className="text-3xl font-black text-white">{kpi.value}</p>
              <p className="text-sm text-slate-400 mt-1">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Role Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-xl"
        >
          <h2 className="text-lg font-bold text-white mb-4">Users by Role</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {["donor", "ngo", "receiver", "volunteer", "admin"].map(role => (
              <div key={role} className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{roleCounts[role] || 0}</p>
                <p className="text-xs text-slate-400 capitalize mt-1">{role}s</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">All Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["User", "Role", "Points", "Donations", "Status", "Joined"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                          {(user.name || "U").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white font-semibold">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-lg capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-amber-400 font-semibold">{user.points || 0}</td>
                    <td className="px-6 py-4 text-sm text-white">{user.impactStats?.totalDonations || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-lg ${
                        user.verificationStatus === "approved" ? "bg-emerald-500/10 text-emerald-400" :
                        user.verificationStatus === "pending" ? "bg-amber-500/10 text-amber-400" :
                        "bg-slate-500/10 text-slate-400"
                      }`}>
                        {user.verificationStatus || "unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
