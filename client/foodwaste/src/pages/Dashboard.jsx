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

  // Sample KPI Data
  const kpis = [
    {
      title: 'Total Donations',
      value: '1,247',
      change: '+12.5%',
      icon: Package,
      color: '#7BAE7F',
      bgColor: '#7BAE7F',
      trend: 'up'
    },
    {
      title: 'Claimed Donations',
      value: '892',
      change: '+8.2%',
      icon: CheckCircle,
      color: '#2F5D50',
      bgColor: '#2F5D50',
      trend: 'up'
    },
    {
      title: 'Completed Donations',
      value: '756',
      change: '+5.3%',
      icon: TrendingUp,
      color: '#2F5D50',
      bgColor: '#2F5D50',
      trend: 'up'
    },
    {
      title: 'Pending Pickups',
      value: '136',
      change: '-2.1%',
      icon: Clock,
      color: '#DCE3E8',
      bgColor: '#DCE3E8',
      trend: 'down'
    },
  ];

  // Sample Recent Activity
  const recentActivity = [
    {
      id: 1,
      type: 'donation_created',
      message: 'New donation from Hotel Paradise',
      detail: '50 meals • Biryani • Expires in 2 hours',
      time: '2 min ago',
      icon: Package,
      status: 'urgent'
    },
    {
      id: 2,
      type: 'donation_claimed',
      message: 'XYZ Foundation claimed donation',
      detail: '30 meals • Chinese • 25 min pickup',
      time: '15 min ago',
      icon: CheckCircle,
      status: 'claimed'
    },
    {
      id: 3,
      type: 'donation_completed',
      message: 'Donation completed successfully',
      detail: '45 meals distributed to Community Care',
      time: '45 min ago',
      icon: CheckCircle,
      status: 'completed'
    },
    {
      id: 4,
      type: 'pickup_scheduled',
      message: 'Pickup scheduled with volunteer',
      detail: 'Route optimized • Estimated 18 mins',
      time: '1 hour ago',
      icon: Clock,
      status: 'scheduled'
    },
  ];

  // Sample AI Insights
  const aiInsights = [
    {
      title: 'AI Priority Score',
      value: 'HIGH',
      detail: 'Urgent donation needing immediate pickup',
      icon: AlertCircle,
      action: 'View Details'
    },
    {
      title: 'Recommended Match',
      value: 'Food For All',
      detail: 'NGO with highest demand match • 2.3 km away',
      icon: Users,
      action: 'Send Match'
    },
    {
      title: 'Safe Window',
      value: '2.5 Hours',
      detail: 'Food safe until 4:30 PM • Expiry prediction active',
      icon: Clock,
      action: 'Extend Window'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F6F2] to-[#FAFAFA]">
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-[#EDE6DB] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <span className="text-xl font-bold text-[#2F5D50]">FoodFlow Dashboard</span>
          </div>

          <div className="flex-1 max-w-xs mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#EDE6DB] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-[#FAFAFA] rounded-full transition relative"
              >
                <Bell className="w-5 h-5 text-[#4B5563]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && <NotificationCenter />}
            </div>

            <button className="p-2 hover:bg-[#FAFAFA] rounded-full transition">
              <Settings className="w-5 h-5 text-[#4B5563]" />
            </button>

            <div className="flex items-center gap-3 border-l border-[#EDE6DB] pl-6">
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">{userInfo?.name || 'User'}</p>
                <p className="text-xs text-[#4B5563]">{userInfo?.role || 'Donor'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-full transition"
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
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-2">
            Welcome back, {userInfo?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[#4B5563]">Here's what's happening with your donations today</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/create-donation')}
            className="bg-[#2F5D50] text-white px-6 py-4 rounded-2xl font-semibold hover:bg-[#1F4D40] transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" /> Create Donation
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="bg-white border-2 border-[#7BAE7F] text-[#2F5D50] px-6 py-4 rounded-2xl font-semibold hover:bg-[#7BAE7F]/5 transition flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" /> Explore Map
          </button>
          <button className="bg-white border border-[#EDE6DB] text-[#1F2937] px-6 py-4 rounded-2xl font-semibold hover:bg-[#FAFAFA] transition flex items-center justify-center gap-2">
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
                className="bg-white rounded-2xl p-6 border border-[#EDE6DB] hover:shadow-lg hover:border-[#7BAE7F]/30 transition duration-300 group"
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
                <p className="text-[#4B5563] text-sm mb-2">{kpi.title}</p>
                <p className="text-3xl font-bold text-[#1F2937]">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Donation Trends Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-[#EDE6DB] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#1F2937]">Donation Trends</h2>
              <select className="bg-[#FAFAFA] border border-[#EDE6DB] rounded-lg px-3 py-1 text-sm text-[#1F2937]">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>

            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-3">
              {[65, 45, 78, 90, 75, 88, 95].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-[#7BAE7F] to-[#2F5D50] rounded-t-lg hover:shadow-lg transition" style={{ height: `${height}%`, minHeight: '40px' }}></div>
                  <p className="text-xs text-[#4B5563] mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#EDE6DB] flex gap-8">
              <div>
                <p className="text-xs text-[#4B5563]">Total This Week</p>
                <p className="text-2xl font-bold text-[#1F2937]">536</p>
              </div>
              <div>
                <p className="text-xs text-[#4B5563]">Average Daily</p>
                <p className="text-2xl font-bold text-[#2F5D50]">76.6</p>
              </div>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F2937] mb-6">🤖 AI Insights</h2>
            {aiInsights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-[#EDE6DB] hover:shadow-lg hover:border-[#7BAE7F]/30 transition">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#7BAE7F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#2F5D50]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[#4B5563] font-medium">{insight.title}</p>
                      <p className="text-lg font-bold text-[#1F2937]">{insight.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#4B5563] mb-3">{insight.detail}</p>
                  <button className="text-xs font-semibold text-[#7BAE7F] hover:text-[#2F5D50] transition">
                    {insight.action} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1F2937]">Recent Activity</h2>
            <a href="#" className="text-[#7BAE7F] font-semibold text-sm flex items-center gap-1 hover:text-[#2F5D50] transition">
              View All <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              const statusColors = {
                urgent: { bg: '#FF4D4D', text: '#fff' },
                claimed: { bg: '#FFB84D', text: '#fff' },
                completed: { bg: '#52C41A', text: '#fff' },
                scheduled: { bg: '#1890FF', text: '#fff' },
              };
              const colors = statusColors[activity.status];

              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#FAFAFA] transition">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: colors.text }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1F2937] text-sm">{activity.message}</p>
                    <p className="text-xs text-[#4B5563] mt-1">{activity.detail}</p>
                  </div>

                  <div className="text-xs text-[#4B5563] font-medium flex-shrink-0">{activity.time}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-[#2F5D50] to-[#1F4D40] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
          <p className="mb-4 text-white/90">Contact our support team or explore our help documentation</p>
          <button className="bg-white text-[#2F5D50] px-6 py-2 rounded-full font-semibold hover:bg-[#F8F6F2] transition">
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
