import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Clock,
  AlertCircle,
  ChevronRight,
  Search,
  Bell,
  Settings,
  LogOut,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
} from 'lucide-react';
import Logo from '../components/Logo';
import NotificationCenter from '../components/NotificationCenter';
import { getDashboardStats } from '../services/dashboardService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isNgo = userInfo?.role === 'ngo';

  // Dynamic KPI Data
  const defaultKpis = [
    {
      title: isNgo ? 'Available Donations' : 'Total Donations',
      value: isNgo ? (dashboardData?.kpis?.availableDonations || 0) : (dashboardData?.kpis?.totalDonations || 0),
      change: 'Real-time',
      icon: Package,
      color: '#10b981', // emerald-500
      bgColor: '#10b981',
      trend: 'up'
    },
    {
      title: isNgo ? 'My Claimed Donations' : 'Claimed Donations',
      value: isNgo ? (dashboardData?.kpis?.myClaimedDonations || 0) : (dashboardData?.kpis?.claimedDonations || 0),
      change: 'Real-time',
      icon: CheckCircle,
      color: '#047857', // emerald-700
      bgColor: '#047857',
      trend: 'up'
    },
    {
      title: isNgo ? 'People Served' : 'Completed Donations',
      value: dashboardData?.kpis?.peopleServed || 0,
      change: 'Real-time',
      icon: TrendingUp,
      color: '#34d399', // emerald-400
      bgColor: '#34d399',
      trend: 'up'
    },
    {
      title: isNgo ? 'Upcoming Pickups' : 'Pending Pickups',
      value: dashboardData?.kpis?.upcomingPickups || 0,
      change: 'Real-time',
      icon: Clock,
      color: '#f59e0b', // amber-500
      bgColor: '#f59e0b',
      trend: isNgo ? 'neutral' : 'down'
    },
  ];

  const kpis = defaultKpis;

  // Sample Recent Activity
  const recentActivity = dashboardData?.recentActivity || [];

  // AI Insights
  const aiInsights = dashboardData?.aiInsights || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Logo size="sm" />
          </div>

          <div className="flex-1 max-w-xs mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent dark:text-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition relative group"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && <NotificationCenter />}
            </div>

            <button 
              onClick={() => navigate('/my-donations')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition relative group"
              title="My Donations"
            >
              <Package className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition" />
            </button>

            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition group"
              title="Settings & Profile"
            >
              <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-6">
              <button 
                onClick={() => navigate('/profile')}
                className="text-left hover:opacity-80 transition cursor-pointer"
                title="View Profile"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{userInfo?.name || 'User'}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">{userInfo?.role || 'Donor'}</p>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
            Welcome back, {userInfo?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">Here's what's happening with your donations today</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {isNgo ? (
            <button
              onClick={() => navigate('/browse-donations')}
              className="bg-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Package className="w-5 h-5" /> Browse Donations
            </button>
          ) : (
            <button
              onClick={() => navigate('/create-donation')}
              className="bg-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" /> Create Donation
            </button>
          )}
          <button
            onClick={() => navigate('/explore')}
            className="bg-white dark:bg-slate-800 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-500 px-6 py-4 rounded-2xl font-semibold hover:bg-emerald-500/5 transition flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" /> Explore Map
          </button>
          <button 
            onClick={() => navigate('/corporate-portal')}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-6 py-4 rounded-2xl font-semibold hover:bg-white dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
            <BarChart3 className="w-5 h-5" /> View Reports
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition duration-300"
                    style={{ backgroundColor: `${kpi.bgColor}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                  </div>
                  <span className={`text-sm font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-slate-600 dark:text-slate-400 font-medium mb-1">{kpi.title}</h3>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{kpi.value}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Donation Trends Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Donation Trends</h2>
              <select className="bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 text-sm text-slate-900 dark:text-white">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>

            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-3">
              {[65, 45, 78, 90, 75, 88, 95].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-700 rounded-t-lg hover:shadow-lg transition" style={{ height: `${height}%`, minHeight: '40px' }}></div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-8">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total This Week</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">536</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Average Daily</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-500">76.6</p>
              </div>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">🤖 AI Insights</h2>
            {aiInsights.map((insight, idx) => {
              const Icon = insight.icon || AlertCircle;
              return (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{insight.title}</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{insight.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{insight.detail}</p>
                  <button 
                    onClick={() => alert(`${insight.action} triggered successfully!`)}
                    className="text-xs font-semibold text-emerald-500 hover:text-emerald-700 transition">
                    {insight.action} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
              <a href="#" className="text-emerald-500 font-semibold text-sm flex items-center gap-1 hover:text-emerald-700 transition">
                View All <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, idx) => {
                const statusColors = {
                  available: { bg: '#1890FF', text: '#fff' },
                  urgent: { bg: '#FF4D4D', text: '#fff' },
                  claimed: { bg: '#FFB84D', text: '#fff' },
                  matched: { bg: '#FFB84D', text: '#fff' },
                  completed: { bg: '#52C41A', text: '#fff' },
                  scheduled: { bg: '#1890FF', text: '#fff' },
                };
                const colors = statusColors[activity.status] || { bg: '#6B7280', text: '#fff' };
                
                // Determine icon based on status since API doesn't return component
                let Icon = Package;
                if (activity.status === 'claimed' || activity.status === 'matched') Icon = Clock;
                if (activity.status === 'completed') Icon = CheckCircle;

                return (
                  <div key={activity.id || idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: colors.text }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{activity.message}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{activity.detail}</p>
                    </div>

                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700/50 px-3 py-1 rounded-full whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-emerald-700 to-[#1F4D40] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
          <p className="mb-4 text-white/90">Contact our support team or explore our help documentation</p>
          <button 
            onClick={() => alert("Support team contacted! We'll email you shortly.")}
            className="bg-white text-emerald-700 px-6 py-2 rounded-full font-semibold hover:bg-slate-50 transition">
            Get Support
          </button>
        </div>
      </div>

      <style>{`
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #7BAE7F;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2F5D50;
        }
      `}</style>
    </div>
  );
}
