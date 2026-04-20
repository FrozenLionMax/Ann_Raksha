import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search, Filter, Package, Clock, MapPin, AlertCircle, CheckCircle,
  ChevronLeft, Loader, UtensilsCrossed, Flame, X, SlidersHorizontal
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000/api/donations";
const getToken = () => JSON.parse(localStorage.getItem("userInfo"))?.token;

export default function BrowseDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [claiming, setClaiming] = useState(null);
  const navigate = useNavigate();

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filterType !== "all") params.append("foodType", filterType);
      if (filterUrgency !== "all") params.append("urgencyLevel", filterUrgency);

      const res = await axios.get(`${API}/all?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDonations(res.data.donations || []);
    } catch (error) {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [filterType, filterUrgency]);

  useEffect(() => {
    const timer = setTimeout(() => fetchDonations(), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClaim = async (id) => {
    setClaiming(id);
    try {
      await axios.post(`${API}/claim/${id}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Donation claimed successfully! 🎉");
      fetchDonations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to claim");
    } finally {
      setClaiming(null);
    }
  };

  const foodTypes = ["all", "cooked", "raw", "packaged", "bakery", "beverages", "fruits", "vegetables", "dairy", "other"];
  const urgencyLevels = ["all", "normal", "urgent"];

  const getStatusBadge = (status) => {
    const styles = {
      available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      matched: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      picked_up: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      completed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };
    return styles[status] || styles.available;
  };

  const getTimeAgo = (date) => {
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-black text-white">
            Browse <span className="text-emerald-400">Donations</span>
          </h1>
          <p className="text-slate-400 mt-1">Find and claim available food donations near you</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-xl"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by food name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Type:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {foodTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterType === type
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Urgency:</span>
            </div>
            <div className="flex gap-1.5">
              {urgencyLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setFilterUrgency(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterUrgency === level
                      ? level === "urgent" ? "bg-red-500 text-white shadow-lg shadow-red-500/25" : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {loading ? "Searching..." : `${donations.length} donation${donations.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-white/10 rounded-lg w-3/4 mb-3" />
                <div className="h-3 bg-white/10 rounded-lg w-1/2 mb-2" />
                <div className="h-3 bg-white/10 rounded-lg w-2/3 mb-4" />
                <div className="h-3 bg-white/10 rounded-lg w-full mb-2" />
                <div className="h-10 bg-white/10 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && donations.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-emerald-500/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No donations found</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {searchQuery || filterType !== "all" || filterUrgency !== "all"
                ? "Try adjusting your search or filters"
                : "No food donations available right now. Check back soon!"}
            </p>
          </motion.div>
        )}

        {/* Donation Cards Grid */}
        {!loading && donations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {donations.map((donation, idx) => (
                <motion.div
                  key={donation._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all duration-300 backdrop-blur-xl"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getStatusBadge(donation.status)}`}>
                        {donation.status}
                      </span>
                      {donation.urgencyLevel === "urgent" && (
                        <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                          <AlertCircle className="w-3 h-3" /> Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">{getTimeAgo(donation.createdAt)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {donation.foodTitle}
                  </h3>

                  {/* Food type badge */}
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-slate-400 rounded-md mb-3 capitalize">
                    {donation.foodType}
                  </span>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-400">
                      <Package className="w-4 h-4 mr-2 text-slate-500" />
                      <span>{donation.quantity} kg • Serves {donation.servesPeople}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <Clock className="w-4 h-4 mr-2 text-slate-500" />
                      <span>Expires: {donation.expiryTime}</span>
                    </div>
                    <div className="flex items-start text-sm text-slate-400">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-slate-500 flex-shrink-0" />
                      <span className="line-clamp-2">{donation.pickupAddress}</span>
                    </div>
                    {donation.donorId?.name && (
                      <div className="flex items-center text-sm text-slate-400">
                        <span className="w-4 h-4 mr-2 text-xs text-center">👤</span>
                        <span>By {donation.donorId.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Claim Button */}
                  {donation.status === "available" && (
                    <button
                      onClick={() => handleClaim(donation._id)}
                      disabled={claiming === donation._id}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {claiming === donation._id ? (
                        <><Loader className="w-4 h-4 animate-spin" /> Claiming...</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Claim Donation</>
                      )}
                    </button>
                  )}

                  {donation.status !== "available" && (
                    <button
                      onClick={() => navigate(`/track/${donation._id}`)}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                    >
                      View Details →
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}