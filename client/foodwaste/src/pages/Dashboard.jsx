import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, CheckCircle, TrendingUp, Clock, Trophy, Leaf, Droplets, Flame,
  Plus, Eye, ChevronRight, ArrowUpRight, MapPin, AlertCircle
} from 'lucide-react';
import { getDashboardStats } from '../services/dashboardService';
import { AnimatedCounter, Confetti, ShareButton } from '../components/UIEnhancements';
import BadgeGrid from '../components/BadgeSystem';
import CommunityFeed from '../components/CommunityFeed';
import ImpactCertificate from '../components/ImpactCertificate';
import CarbonCreditCalc from '../components/CarbonCreditCalc';
import { DonationTrendChart, MealsBarChart, FoodTypePieChart } from '../components/DashboardCharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isNgo = userInfo?.role === 'ngo' || userInfo?.role === 'receiver';

  useEffect(() => {
    const fetch = async () => {
      try {
        const d = await getDashboardStats();
        setData(d);
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const kpis = data?.kpis || {};
  const recent = data?.recentDonations || [];

  const kpiCards = isNgo ? [
    { title: 'Available Donations', value: kpis.availableDonations || 0, icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { title: 'My Claims', value: kpis.myClaimedDonations || 0, icon: CheckCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { title: 'Completed', value: kpis.completedDonations || 0, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { title: 'Impact Points', value: kpis.points || 0, icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ] : [
    { title: 'Total Donations', value: kpis.totalDonations || 0, icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { title: 'Claimed', value: kpis.claimedDonations || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { title: 'Completed', value: kpis.completedDonations || 0, icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { title: 'Impact Points', value: kpis.points || 0, icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  const impact = kpis.impactStats || {};
  const impactCards = [
    { label: 'Meals Provided', value: impact.mealsProvided || 0, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', suffix: '' },
    { label: 'CO₂ Prevented', value: impact.co2Saved || 0, icon: Leaf, color: 'text-green-400', bg: 'bg-green-500/10', suffix: ' kg', decimals: 1 },
    { label: 'Water Saved', value: (impact.waterSaved || 0) / 1000, icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10', suffix: 'K L', decimals: 1 },
    { label: 'Total Donations', value: impact.totalDonations || 0, icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10', suffix: '' },
  ];

  const quickActions = isNgo ? [
    { label: 'Browse Donations', path: '/browse-donations', icon: Eye, desc: 'Find available food nearby' },
    { label: 'My Claims', path: '/my-donations', icon: Package, desc: 'Track claimed donations' },
    { label: 'Explore Map', path: '/explore', icon: MapPin, desc: 'View donations on map' },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy, desc: 'See top contributors' },
  ] : [
    { label: 'Create Donation', path: '/create-donation', icon: Plus, desc: 'Post surplus food' },
    { label: 'My Donations', path: '/my-donations', icon: Package, desc: 'Track your donations' },
    { label: 'Explore Map', path: '/explore', icon: MapPin, desc: 'View donations on map' },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy, desc: 'See top contributors' },
  ];

  const statusStyles = {
    available: 'bg-emerald-500/10 text-emerald-400',
    matched: 'bg-amber-500/10 text-amber-400',
    picked_up: 'bg-blue-500/10 text-blue-400',
    completed: 'bg-slate-500/10 text-slate-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Confetti active={showConfetti} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">
              Welcome back, <span className="text-emerald-400">{userInfo.name?.split(' ')[0] || 'Hero'}</span> 👋
            </h1>
            <p className="text-slate-400 mt-1">Here's your food rescue impact at a glance</p>
          </div>
          <ShareButton
            meals={impact.mealsProvided || 0}
            co2={impact.co2Saved || 0}
            donations={impact.totalDonations || 0}
          />
        </motion.div>

        {/* KPI Cards with Animated Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiCards.map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`${kpi.bg} border ${kpi.border} rounded-2xl p-5 backdrop-blur-xl group hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-3xl font-black text-white">
                <AnimatedCounter value={kpi.value} />
              </p>
              <p className="text-sm text-slate-400 mt-1">{kpi.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Impact Stats with Animated Counters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Your Environmental Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {impactCards.map((card, i) => (
              <div key={i} className={`${card.bg} border border-white/5 rounded-2xl p-4 text-center`}>
                <card.icon className={`w-5 h-5 ${card.color} mx-auto mb-2`} />
                <p className="text-xl font-bold text-white">
                  <AnimatedCounter value={card.value} decimals={card.decimals || 0} suffix={card.suffix} />
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Your Badges</h2>
          <BadgeGrid impactStats={impact} points={kpis.points || 0} compact />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-lg font-bold text-white mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button key={i} onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition">
                    <action.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <button onClick={() => navigate('/my-donations')} className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold">View All →</button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
              {recent.length === 0 ? (
                <div className="p-10 text-center">
                  <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-semibold">No recent activity</p>
                  <p className="text-sm text-slate-500 mt-1">{isNgo ? "Browse donations to get started" : "Create your first donation"}</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recent.map((donation, i) => (
                    <div key={donation._id || i} onClick={() => navigate(`/track/${donation._id}`)}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">{donation.foodTitle}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{donation.quantity} kg</span>
                          <span>•</span>
                          <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${statusStyles[donation.status] || 'bg-white/5 text-slate-400'}`}>
                        {donation.status?.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Community Feed + Carbon Credits + Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <CommunityFeed />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <CarbonCreditCalc impactStats={impact} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <ImpactCertificate
              userName={userInfo.name}
              impactStats={impact}
              points={kpis.points || 0}
            />
          </motion.div>
        </div>

        {/* Analytics Charts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DonationTrendChart totalDonations={impact.totalDonations || 0} />
            <MealsBarChart totalDonations={impact.totalDonations || 0} />
            <FoodTypePieChart />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
