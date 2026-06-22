import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import {
  User, Mail, Phone, Building2, MapPin, Save, Loader,
  Trophy, Leaf, Droplets, Flame, Package, Edit3, Camera, Shield
} from "lucide-react";
import { AnimatedCounter, ShareButton } from "../components/UIEnhancements";
import BadgeGrid from "../components/BadgeSystem";
import ImpactCertificate from "../components/ImpactCertificate";
import CarbonCreditCalc from "../components/CarbonCreditCalc";

const API = "http://localhost:5000/api/users";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", bio: "", organizationName: "" });

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setUserInfo(info);
    setForm({
      name: info.name || "",
      phone: info.phone || "",
      bio: info.bio || "",
      organizationName: info.organizationName || "",
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API}/profile`, form, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const updated = { ...userInfo, ...res.data.user, token: userInfo.token };
      localStorage.setItem("userInfo", JSON.stringify(updated));
      setUserInfo(updated);
      setEditing(false);
      toast.success("Profile updated! ✨");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!userInfo) return null;

  const stats = userInfo.impactStats || {};
  const impactCards = [
    { icon: Package, label: "Total Donations", value: stats.totalDonations || 0, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: Flame, label: "Meals Provided", value: stats.mealsProvided || 0, color: "text-orange-400", bg: "bg-orange-500/10" },
    { icon: Leaf, label: "CO₂ Prevented", value: `${(stats.co2Saved || 0).toFixed(1)} kg`, color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Droplets, label: "Water Saved", value: `${((stats.waterSaved || 0) / 1000).toFixed(1)}K L`, color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Trophy, label: "Impact Points", value: userInfo.points || 0, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  const initials = (userInfo.name || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-emerald-500/20">
                {initials}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="text-2xl font-black text-white">{userInfo.name}</h1>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                  {userInfo.role}
                </span>
              </div>
              <p className="text-slate-400 text-sm">{userInfo.email}</p>
              {userInfo.bio && <p className="text-slate-300 text-sm mt-2 max-w-md">{userInfo.bio}</p>}
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-amber-400">{userInfo.points || 0}</span> points
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Since {new Date(userInfo.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShareButton meals={stats.mealsProvided || 0} co2={stats.co2Saved || 0} donations={stats.totalDonations || 0} />
              <button onClick={() => setEditing(!editing)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${editing ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"}`}
              >
                {editing ? <><span>✕</span> Cancel</> : <><Edit3 className="w-4 h-4" /> Edit</>}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-bold text-white mb-3">Your Impact</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {impactCards.map((card, i) => (
              <div key={i} className={`${card.bg} border border-white/5 rounded-2xl p-4 text-center`}>
                <card.icon className={`w-5 h-5 ${card.color} mx-auto mb-2`} />
                <p className="text-white font-bold text-lg">{card.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3">Achievements & Badges</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <BadgeGrid impactStats={stats} points={userInfo.points || 0} />
          </div>
        </motion.div>

        {/* Edit Form */}
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl mb-6"
          >
            <h2 className="text-lg font-bold text-white mb-5">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField icon={User} label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
              <InputField icon={Phone} label="Phone Number" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
              <InputField icon={Building2} label="Organization" value={form.organizationName} onChange={v => setForm({ ...form, organizationName: v })} />
              <div className="md:col-span-2">
                <label className="text-sm text-slate-400 mb-1.5 block">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {saving ? <><Loader className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </motion.div>
        )}

        {/* Carbon Credits + Certificate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <CarbonCreditCalc impactStats={stats} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <ImpactCertificate userName={userInfo.name} impactStats={stats} points={userInfo.points || 0} />
          </motion.div>
        </div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl"
        >
          <h2 className="text-lg font-bold text-white mb-5">Account Details</h2>
          <div className="space-y-4">
            <InfoRow icon={User} label="Name" value={userInfo.name} />
            <InfoRow icon={Mail} label="Email" value={userInfo.email} />
            <InfoRow icon={Phone} label="Phone" value={userInfo.phone || "Not set"} muted={!userInfo.phone} />
            <InfoRow icon={Building2} label="Organization" value={userInfo.organizationName || "Not set"} muted={!userInfo.organizationName} />
            <InfoRow icon={Shield} label="Role" value={userInfo.role} capitalize />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({ icon: Icon, label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-slate-400 mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, muted, capitalize }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-medium ${muted ? "text-slate-600 italic" : "text-white"} ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}