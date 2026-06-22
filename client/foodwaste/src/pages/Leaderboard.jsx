import API_BASE, { API_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Flame, Droplets, Leaf, ChevronUp, Star } from 'lucide-react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const res = await axios.get(`${API_URL}/users/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const podiumColors = [
    { bg: 'from-amber-400 to-yellow-500', ring: 'ring-amber-400/50', text: 'text-amber-400', label: '1ST' },
    { bg: 'from-slate-300 to-slate-400', ring: 'ring-slate-300/50', text: 'text-slate-300', label: '2ND' },
    { bg: 'from-orange-500 to-amber-700', ring: 'ring-orange-500/50', text: 'text-orange-400', label: '3RD' },
  ];

  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd
  const podiumHeights = ['h-32', 'h-44', 'h-24'];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">Impact Champions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Leader<span className="text-emerald-400">board</span>
            </h1>
            <p className="text-slate-400 text-lg">Top food heroes making the biggest impact</p>
          </motion.div>

          {/* Time Filter */}
          <div className="flex justify-center gap-2 mt-6">
            {['week', 'month', 'all'].map(t => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  timeFilter === t
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="max-w-3xl mx-auto px-4 mt-8">
          <div className="flex items-end justify-center gap-3 md:gap-6">
            {podiumOrder.map((rankIdx, displayIdx) => {
              const user = top3[rankIdx];
              if (!user) return null;
              const colors = podiumColors[rankIdx];
              const isCenter = displayIdx === 1;

              return (
                <motion.div
                  key={rankIdx}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: displayIdx * 0.15 }}
                  className={`flex flex-col items-center ${isCenter ? 'mb-4' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`relative mb-3 ${isCenter ? 'scale-110' : ''}`}>
                    {isCenter && (
                      <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 w-7 h-7 text-amber-400 drop-shadow-lg" />
                    )}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-2xl md:text-3xl font-black text-white ring-4 ${colors.ring} shadow-2xl`}>
                      {(user.name || 'U').charAt(0)}
                    </div>
                  </div>

                  {/* Name */}
                  <p className="text-white font-bold text-sm md:text-base text-center max-w-[100px] truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role}</p>
                  <p className={`font-black text-lg md:text-xl mt-1 ${colors.text}`}>{(user.points || 0).toLocaleString()} pts</p>

                  {/* Podium bar */}
                  <div className={`w-24 md:w-28 ${podiumHeights[displayIdx]} mt-3 rounded-t-2xl bg-gradient-to-t ${colors.bg} opacity-20 relative`}>
                    <span className={`absolute top-3 left-1/2 -translate-x-1/2 font-black text-lg ${colors.text}`}>
                      {colors.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Flame, label: 'Total Meals', value: leaders.reduce((s, l) => s + (l.impactStats?.mealsProvided || 0), 0), color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { icon: Leaf, label: 'CO₂ Prevented', value: `${leaders.reduce((s, l) => s + (l.impactStats?.co2Saved || 0), 0).toFixed(0)} kg`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Droplets, label: 'Water Saved', value: `${(leaders.reduce((s, l) => s + (l.impactStats?.waterSaved || 0), 0) / 1000).toFixed(0)}K L`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`${stat.bg} border border-white/5 rounded-2xl p-4 text-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-slate-500 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Full Rankings</h3>
          </div>
          <div className="divide-y divide-white/5">
            {leaders.map((user, idx) => {
              const isMe = user._id === userInfo?._id || user.email === userInfo?.email;
              return (
                <motion.div
                  key={user._id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex items-center gap-4 px-6 py-4 transition-all hover:bg-white/5 ${
                    isMe ? 'bg-emerald-500/5 border-l-4 border-emerald-500' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                    idx === 0 ? 'bg-amber-500/20 text-amber-400' :
                    idx === 1 ? 'bg-slate-400/20 text-slate-300' :
                    idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/5 text-slate-500'
                  }`}>
                    {idx < 3 ? <Star className="w-4 h-4" /> : idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/80 to-teal-500/80 flex items-center justify-center text-white font-bold shadow-lg">
                    {(user.name || 'U').charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold truncate">{user.name}</p>
                      {isMe && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">YOU</span>}
                    </div>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
                    <div className="text-center">
                      <p className="text-white font-semibold">{user.impactStats?.mealsProvided || 0}</p>
                      <p>Meals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">{(user.impactStats?.co2Saved || 0).toFixed(1)}</p>
                      <p>kg CO₂</p>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold text-lg">{(user.points || 0).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500">POINTS</p>
                  </div>

                  {idx < 3 && <ChevronUp className="w-4 h-4 text-emerald-500" />}
                </motion.div>
              );
            })}

            {leaders.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-lg font-semibold">No rankings yet</p>
                <p className="text-slate-500 text-sm mt-1">Start donating to claim your spot!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
