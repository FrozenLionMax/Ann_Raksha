import API_BASE, { API_URL } from '../config/api';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Package, Clock, MapPin, AlertCircle, CheckCircle, Loader,
  ChevronRight, Trash2, Eye, Filter
} from "lucide-react";

const API = "${API_URL}/donations";
const getToken = () => JSON.parse(localStorage.getItem("userInfo"))?.token;

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [completing, setCompleting] = useState(null);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isNgo = userInfo.role === "ngo" || userInfo.role === "receiver";

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/my-donations`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDonations(res.data.donations || []);
    } catch (error) {
      toast.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleComplete = async (id) => {
    setCompleting(id);
    try {
      await axios.put(`${API}/complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Donation marked as completed! 🎉");
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete");
    } finally {
      setCompleting(null);
    }
  };

  const tabs = [
    { key: "all", label: "All", count: donations.length },
    { key: "available", label: "Available", count: donations.filter(d => d.status === "available").length },
    { key: "matched", label: "Claimed", count: donations.filter(d => d.status === "matched").length },
    { key: "completed", label: "Completed", count: donations.filter(d => d.status === "completed").length },
  ];

  const filtered = activeTab === "all" ? donations : donations.filter(d => d.status === activeTab);

  const statusStyles = {
    available: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-500" },
    matched: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-500" },
    picked_up: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", dot: "bg-blue-500" },
    completed: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", dot: "bg-slate-500" },
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-black text-white">
            My <span className="text-emerald-400">Donations</span>
          </h1>
          <p className="text-slate-400 mt-1">
            {isNgo ? "Donations you've claimed" : "Track your food donations"}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                activeTab === tab.key ? "bg-white/20" : "bg-white/5"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded-lg w-1/3 mb-2" />
                    <div className="h-3 bg-white/10 rounded-lg w-1/2" />
                  </div>
                  <div className="h-8 w-24 bg-white/10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
              <Package className="w-10 h-10 text-emerald-500/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === "all" ? "No donations yet" : `No ${activeTab} donations`}
            </h3>
            <p className="text-slate-400 mb-6">
              {isNgo ? "Browse available donations to get started" : "Create your first food donation to save meals"}
            </p>
            <button
              onClick={() => navigate(isNgo ? "/browse-donations" : "/create-donation")}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              {isNgo ? "Browse Donations" : "Create Donation"}
            </button>
          </motion.div>
        )}

        {/* Donation List */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((donation, idx) => {
                const style = statusStyles[donation.status] || statusStyles.available;
                return (
                  <motion.div
                    key={donation._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all cursor-pointer"
                    onClick={() => navigate(`/track/${donation._id}`)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Status Icon */}
                      <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
                        {donation.status === "completed" ? (
                          <CheckCircle className={`w-5 h-5 ${style.text}`} />
                        ) : donation.status === "matched" ? (
                          <Clock className={`w-5 h-5 ${style.text}`} />
                        ) : (
                          <Package className={`w-5 h-5 ${style.text}`} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-white font-semibold truncate group-hover:text-emerald-400 transition-colors">
                            {donation.foodTitle}
                          </h3>
                          {donation.urgencyLevel === "urgent" && (
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{donation.quantity} kg • {donation.servesPeople} servings</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{donation.pickupAddress}</span>
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-3">
                        <span className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${style.bg} ${style.text} ${style.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {donation.status.replace("_", " ")}
                        </span>

                        {/* Quick Action */}
                        {donation.status === "matched" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleComplete(donation._id); }}
                            disabled={completing === donation._id}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                          >
                            {completing === donation._id ? "..." : "✓ Complete"}
                          </button>
                        )}

                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}