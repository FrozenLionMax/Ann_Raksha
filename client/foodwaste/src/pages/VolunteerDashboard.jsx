import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Truck, MapPin, Package, Clock, CheckCircle, Loader,
  Navigation, Phone, AlertCircle, Route
} from 'lucide-react';

/**
 * #12 - Volunteer Pickup Dashboard
 * Volunteers can see claimed donations nearby and offer to deliver
 */

const API = 'http://localhost:5000/api/donations';
const getToken = () => JSON.parse(localStorage.getItem('userInfo'))?.token;

export default function VolunteerDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`${API}/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // Show matched donations that need pickup
      const allDonations = res.data.donations || [];
      setDonations(allDonations);
    } catch {
      toast.error('Failed to load pickups');
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (id) => {
    setAccepting(id);
    try {
      await axios.put(`${API}/status/${id}`, { status: 'picked_up' }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success('Pickup accepted! Navigate to the location. 🚚');
      fetchDonations();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally {
      setAccepting(null);
    }
  };

  const handleComplete = async (id) => {
    setAccepting(id);
    try {
      await axios.put(`${API}/complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success('Delivery completed! Points earned! 🏆');
      fetchDonations();
    } catch (e) {
      toast.error('Failed to complete');
    } finally {
      setAccepting(null);
    }
  };

  const openMap = (donation) => {
    if (donation.location?.lat && donation.location?.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${donation.location.lat},${donation.location.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(donation.pickupAddress)}`, '_blank');
    }
  };

  const matched = donations.filter(d => d.status === 'matched');
  const pickedUp = donations.filter(d => d.status === 'picked_up');
  const available = donations.filter(d => d.status === 'available');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Truck className="w-7 h-7 text-emerald-400" />
            <h1 className="text-3xl font-black text-white">
              Volunteer <span className="text-emerald-400">Hub</span>
            </h1>
          </div>
          <p className="text-slate-400">Help deliver food from donors to NGOs. Every pickup counts!</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-amber-400">{matched.length}</p>
            <p className="text-sm text-slate-400 mt-1">Awaiting Pickup</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-blue-400">{pickedUp.length}</p>
            <p className="text-sm text-slate-400 mt-1">In Transit</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-emerald-400">{available.length}</p>
            <p className="text-sm text-slate-400 mt-1">Available</p>
          </div>
        </div>

        {/* Awaiting Pickup */}
        {matched.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Needs Pickup ({matched.length})
            </h2>
            <div className="space-y-3">
              {matched.map((d, i) => (
                <PickupCard key={d._id} donation={d} index={i}
                  onPickup={() => handlePickup(d._id)}
                  onNavigate={() => openMap(d)}
                  loading={accepting === d._id}
                  actionLabel="Accept Pickup"
                  actionColor="from-amber-500 to-amber-600"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* In Transit */}
        {pickedUp.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              In Transit ({pickedUp.length})
            </h2>
            <div className="space-y-3">
              {pickedUp.map((d, i) => (
                <PickupCard key={d._id} donation={d} index={i}
                  onPickup={() => handleComplete(d._id)}
                  onNavigate={() => openMap(d)}
                  loading={accepting === d._id}
                  actionLabel="Mark Delivered"
                  actionColor="from-emerald-500 to-emerald-600"
                />
              ))}
            </div>
          </motion.div>
        )}

        {matched.length === 0 && pickedUp.length === 0 && (
          <div className="text-center py-16">
            <Truck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No active pickups</h3>
            <p className="text-slate-400 mb-6">Check back soon for new delivery opportunities!</p>
            <button onClick={() => navigate('/browse-donations')}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              Browse Donations →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PickupCard({ donation, index, onPickup, onNavigate, loading, actionLabel, actionColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">{donation.foodTitle}</h3>
            {donation.urgencyLevel === 'urgent' && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                Urgent
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" /> {donation.quantity} kg • {donation.servesPeople} servings
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Exp: {donation.expiryTime}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" /> {donation.pickupAddress}
          </p>
          {donation.contactPhone && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> {donation.contactPhone}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onNavigate}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" /> Navigate
          </button>
          <button onClick={onPickup} disabled={loading}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r ${actionColor} text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-1.5`}
          >
            {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            {actionLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
