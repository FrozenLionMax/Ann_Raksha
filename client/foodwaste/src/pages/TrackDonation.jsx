import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Package, Clock, MapPin, CheckCircle, Loader, ArrowLeft, User,
  Phone, AlertCircle, Truck, Gift
} from "lucide-react";

const API = "http://localhost:5000/api/donations";
const getToken = () => JSON.parse(localStorage.getItem("userInfo"))?.token;

export default function TrackDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    fetchDonation();
  }, [id]);

  const fetchDonation = async () => {
    try {
      const res = await axios.get(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDonation(res.data);
    } catch {
      toast.error("Donation not found");
      navigate("/my-donations");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, status) => {
    setActing(true);
    try {
      if (action === "claim") {
        await axios.post(`${API}/claim/${id}`, {}, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        toast.success("Donation claimed! 🎉");
      } else if (action === "complete") {
        await axios.put(`${API}/complete/${id}`, {}, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        toast.success("Donation completed! Impact points earned! 🏆");
      } else if (action === "status") {
        await axios.put(`${API}/status/${id}`, { status }, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        toast.success(`Status updated to ${status}`);
      }
      fetchDonation();
    } catch (e) {
      toast.error(e.response?.data?.message || "Action failed");
    } finally {
      setActing(false);
    }
  };

  const steps = [
    { key: "available", label: "Listed", desc: "Donation posted by donor", icon: Gift },
    { key: "matched", label: "Claimed", desc: "Claimed by an NGO/receiver", icon: CheckCircle },
    { key: "picked_up", label: "Picked Up", desc: "Food collected from donor", icon: Truck },
    { key: "completed", label: "Completed", desc: "Delivered successfully", icon: Package },
  ];

  const getStepIndex = (status) => steps.findIndex(s => s.key === status);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!donation) return null;

  const currentStep = getStepIndex(donation.status);
  const isOwner = donation.donorId?._id === userInfo._id || donation.donorId === userInfo._id;
  const isClaimer = donation.claimedBy?._id === userInfo._id || donation.claimedBy === userInfo._id;

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-white">{donation.foodTitle}</h1>
                {donation.urgencyLevel === "urgent" && (
                  <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-3 h-3" /> Urgent
                  </span>
                )}
              </div>
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/5 text-slate-400 rounded-lg capitalize mb-3">
                {donation.foodType}
              </span>
              {donation.description && (
                <p className="text-slate-400 text-sm mb-3">{donation.description}</p>
              )}
            </div>
            <span className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl ${
              donation.status === "available" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              donation.status === "matched" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              donation.status === "picked_up" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
              "bg-slate-500/10 text-slate-400 border border-slate-500/20"
            }`}>
              {donation.status.replace("_", " ")}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <DetailItem icon={Package} label="Quantity" value={`${donation.quantity} kg`} />
            <DetailItem icon={User} label="Serves" value={`${donation.servesPeople} people`} />
            <DetailItem icon={Clock} label="Cooked At" value={donation.cookedTime} />
            <DetailItem icon={AlertCircle} label="Expires" value={donation.expiryTime} />
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-start gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
              <span>{donation.pickupAddress}</span>
            </div>
          </div>

          {/* Donor / Claimer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
            {donation.donorId?.name && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                  {donation.donorId.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Donated by</p>
                  <p className="text-sm text-white font-semibold">{donation.donorId.name}</p>
                </div>
              </div>
            )}
            {donation.claimedBy?.name && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
                  {donation.claimedBy.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Claimed by</p>
                  <p className="text-sm text-white font-semibold">{donation.claimedBy.name}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Progress Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl mb-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Donation Timeline</h2>
          <div className="relative">
            {steps.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-start gap-4 mb-8 last:mb-0 relative">
                  {/* Line */}
                  {i < steps.length - 1 && (
                    <div className={`absolute left-5 top-10 w-0.5 h-full ${
                      i < currentStep ? 'bg-emerald-500' : 'bg-white/10'
                    }`} />
                  )}
                  {/* Circle */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10 ${
                    done ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' :
                    active ? 'bg-amber-500 shadow-lg shadow-amber-500/30 animate-pulse' :
                    'bg-white/5 border border-white/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${done || active ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  {/* Text */}
                  <div>
                    <p className={`font-semibold ${done ? 'text-white' : 'text-slate-500'}`}>{step.label}</p>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {donation.status === "available" && !isOwner && (
            <button onClick={() => handleAction("claim")} disabled={acting}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {acting ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Claim This Donation
            </button>
          )}

          {donation.status === "matched" && (isClaimer || isOwner) && (
            <button onClick={() => handleAction("status", "picked_up")} disabled={acting}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {acting ? <Loader className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
              Mark as Picked Up
            </button>
          )}

          {(donation.status === "matched" || donation.status === "picked_up") && (isClaimer || isOwner) && (
            <button onClick={() => handleAction("complete")} disabled={acting}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {acting ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Mark as Completed
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm text-white font-semibold">{value}</p>
    </div>
  );
}
