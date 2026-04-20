import React, { useState } from 'react';
import { Building2, TrendingUp, Calendar, BarChart3, Download, Plus, Settings, Users, FileText, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function CorporatePortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Corporate User Data
  const corporateData = {
    name: 'Chef\'s Table Hotels',
    type: 'Premium Hotel Chain',
    totalDonations: 450,
    mealsProvided: 12500,
    wasteReduced: 8.5,
    csr_score: 92,
    nextPickup: '2024-04-22'
  };

  // Impact Metrics
  const impactMetrics = [
    {
      title: 'Total Donations',
      value: '450',
      unit: 'batches',
      change: '+23%',
      icon: Building2,
      color: '#7BAE7F'
    },
    {
      title: 'Meals Provided',
      value: '12.5K',
      unit: 'people fed',
      change: '+45%',
      icon: Users,
      color: '#2F5D50'
    },
    {
      title: 'Waste Prevented',
      value: '8.5T',
      unit: 'food waste',
      change: '+67%',
      icon: TrendingUp,
      color: '#2F5D50'
    },
    {
      title: 'CSR Score',
      value: '92/100',
      unit: 'compliance',
      change: '+12',
      icon: Check,
      color: '#7BAE7F'
    }
  ];

  // Scheduled Pickups
  const scheduledPickups = [
    {
      id: 1,
      date: '2024-04-22',
      time: '2:00 PM',
      ngo: 'Food For All Foundation',
      meals: 200,
      status: 'confirmed',
      location: 'Hotel Kitchen, East Wing'
    },
    {
      id: 2,
      date: '2024-04-23',
      time: '12:30 PM',
      ngo: 'Community Care NGO',
      meals: 150,
      status: 'pending',
      location: 'Main Dining Hall'
    },
    {
      id: 3,
      date: '2024-04-24',
      time: '3:15 PM',
      ngo: 'Meal for Everyone',
      meals: 180,
      status: 'confirmed',
      location: 'Banquet Kitchen'
    }
  ];

  // Recent Donations
  const recentDonations = [
    {
      id: 1,
      date: '2024-04-21',
      ngo: 'XYZ Foundation',
      meals: 250,
      foodType: 'Cooked Rice, Vegetables, Meat',
      status: 'completed',
      rating: 5
    },
    {
      id: 2,
      date: '2024-04-20',
      ngo: 'Food Justice Initiative',
      meals: 180,
      foodType: 'Prepared Meals, Desserts',
      status: 'completed',
      rating: 5
    },
    {
      id: 3,
      date: '2024-04-19',
      ngo: 'Community Care',
      meals: 220,
      foodType: 'Dal, Rice, Breads',
      status: 'completed',
      rating: 4
    }
  ];

  // Monthly Report Data
  const monthlyData = {
    donations: [120, 140, 165, 180, 195, 210],
    meals: [3000, 3500, 4100, 4600, 5200, 5800],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F6F2] to-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white border-b border-[#EDE6DB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-lg flex items-center justify-center text-white font-bold">
                  CT
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1F2937]">{corporateData.name}</h1>
                  <p className="text-sm text-[#4B5563]">{corporateData.type}</p>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-[#2F5D50] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1F4D40] transition">
              <Plus className="w-5 h-5" /> Create Donation
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-[#EDE6DB]">
            {['overview', 'schedule', 'reports', 'csr'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold text-sm transition ${
                  activeTab === tab
                    ? 'text-[#2F5D50] border-b-2 border-[#2F5D50]'
                    : 'text-[#4B5563] hover:text-[#1F2937]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {impactMetrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-[#EDE6DB] hover:shadow-lg transition group">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: metric.color }} />
                      </div>
                      <span className="text-xs font-bold text-green-600">{metric.change}</span>
                    </div>
                    <p className="text-[#4B5563] text-sm mb-2">{metric.title}</p>
                    <p className="text-3xl font-bold text-[#1F2937]">{metric.value}</p>
                    <p className="text-xs text-[#7BAE7F] mt-2">{metric.unit}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Donations & Summary */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Recent Donations */}
              <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#1F2937]">Recent Donations</h2>
                  <a href="#" className="text-[#7BAE7F] font-semibold text-sm flex items-center gap-1 hover:text-[#2F5D50]">
                    View All <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl hover:bg-white transition border border-[#EDE6DB]">
                      <div className="flex-1">
                        <p className="font-semibold text-[#1F2937]">{donation.ngo}</p>
                        <p className="text-sm text-[#4B5563] mt-1">{donation.foodType}</p>
                        <p className="text-xs text-[#7BAE7F] mt-1">📅 {donation.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#2F5D50]">{donation.meals} meals</p>
                        <div className="text-yellow-500 text-sm mt-1">★★★★★</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                {/* Next Pickup */}
                <div className="bg-gradient-to-br from-[#2F5D50] to-[#1F4D40] text-white rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-semibold">Next Pickup</span>
                  </div>
                  <p className="text-2xl font-bold mb-3">{corporateData.nextPickup}</p>
                  <button className="w-full bg-white text-[#2F5D50] py-2 rounded-lg font-semibold hover:bg-[#F8F6F2] transition text-sm">
                    View Details
                  </button>
                </div>

                {/* CSR Score */}
                <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                  <h3 className="font-semibold text-[#1F2937] mb-4">CSR Compliance Score</h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-[#2F5D50] mb-2">{corporateData.csr_score}/100</div>
                    <div className="w-full bg-[#EDE6DB] rounded-full h-2">
                      <div className="bg-[#2F5D50] h-2 rounded-full" style={{ width: `${corporateData.csr_score}%` }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-[#4B5563]">Excellent standing • All compliance met</p>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                  <h3 className="font-semibold text-[#1F2937] mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-[#7BAE7F]/10 text-[#2F5D50] py-2 rounded-lg font-semibold hover:bg-[#7BAE7F]/20 transition text-sm flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" /> Generate Report
                    </button>
                    <button className="w-full bg-[#EDE6DB] text-[#1F2937] py-2 rounded-lg font-semibold hover:bg-[#DCE3E8] transition text-sm flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937]">Pickup Schedule</h2>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="bg-[#2F5D50] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1F4D40] transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Schedule Pickup
              </button>
            </div>

            <div className="space-y-4">
              {scheduledPickups.map((pickup) => (
                <div key={pickup.id} className="bg-white rounded-2xl p-6 border border-[#EDE6DB] hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-[#1F2937] mb-2">{pickup.ngo}</h3>
                      <p className="text-sm text-[#4B5563]">{pickup.location}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      pickup.status === 'confirmed'
                        ? 'bg-[#2F5D50] text-white'
                        : 'bg-[#FFB84D] text-white'
                    }`}>
                      {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#EDE6DB]">
                    <div>
                      <p className="text-xs text-[#4B5563] mb-1">Date & Time</p>
                      <p className="font-semibold text-[#1F2937]">{pickup.date} at {pickup.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4B5563] mb-1">Meals Expected</p>
                      <p className="font-semibold text-[#2F5D50]">{pickup.meals} meals</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4B5563] mb-1">Status</p>
                      <p className="font-semibold text-[#1F2937]">On Track</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#7BAE7F]/10 text-[#2F5D50] py-2 rounded-lg font-semibold hover:bg-[#7BAE7F]/20 transition text-sm">
                      Reschedule
                    </button>
                    <button className="flex-1 bg-[#2F5D50] text-white py-2 rounded-lg font-semibold hover:bg-[#1F4D40] transition text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1F2937]">Impact Reports</h2>
              <button className="bg-[#2F5D50] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1F4D40] transition flex items-center gap-2">
                <Download className="w-5 h-5" /> Download Report
              </button>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Donation Trends */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <h3 className="text-lg font-bold text-[#1F2937] mb-6">Donation Trends</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {monthlyData.donations.map((value, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-[#7BAE7F] to-[#2F5D50] rounded-t-lg hover:shadow-lg transition"
                        style={{ height: `${(value / 250) * 100}%` }}
                      ></div>
                      <p className="text-xs text-[#4B5563] mt-2">{monthlyData.months[idx]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meals Provided */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <h3 className="text-lg font-bold text-[#1F2937] mb-6">Meals Provided</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {monthlyData.meals.map((value, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-[#2F5D50] to-[#7BAE7F] rounded-t-lg hover:shadow-lg transition"
                        style={{ height: `${(value / 6500) * 100}%` }}
                      ></div>
                      <p className="text-xs text-[#4B5563] mt-2">{monthlyData.months[idx]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
              <h3 className="text-lg font-bold text-[#1F2937] mb-6">Key Metrics</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#7BAE7F]/5 to-[#2F5D50]/5 rounded-xl p-4">
                  <p className="text-sm text-[#4B5563] mb-2">Average Donation Size</p>
                  <p className="text-2xl font-bold text-[#1F2937]">157 meals</p>
                </div>
                <div className="bg-gradient-to-br from-[#7BAE7F]/5 to-[#2F5D50]/5 rounded-xl p-4">
                  <p className="text-sm text-[#4B5563] mb-2">Pickup Success Rate</p>
                  <p className="text-2xl font-bold text-[#2F5D50]">98%</p>
                </div>
                <div className="bg-gradient-to-br from-[#7BAE7F]/5 to-[#2F5D50]/5 rounded-xl p-4">
                  <p className="text-sm text-[#4B5563] mb-2">Avg. Response Time</p>
                  <p className="text-2xl font-bold text-[#1F2937]">12 min</p>
                </div>
                <div className="bg-gradient-to-br from-[#7BAE7F]/5 to-[#2F5D50]/5 rounded-xl p-4">
                  <p className="text-sm text-[#4B5563] mb-2">Partner Rating</p>
                  <p className="text-2xl font-bold text-[#2F5D50]">4.9/5 ★</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSR Tab */}
        {activeTab === 'csr' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-[#1F2937]">CSR Impact Summary</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Environmental Impact */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#7BAE7F]/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#2F5D50]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937]">Environmental</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#4B5563] mb-2">Food Waste Prevented</p>
                    <p className="text-3xl font-bold text-[#2F5D50]">8.5 Tons</p>
                    <p className="text-xs text-[#7BAE7F] mt-1">↓ CO₂ Emissions: 25 tons</p>
                  </div>
                  <div className="pt-4 border-t border-[#EDE6DB]">
                    <p className="text-sm text-[#4B5563] mb-2">Water Saved</p>
                    <p className="text-2xl font-bold text-[#1F2937]">850K Liters</p>
                  </div>
                </div>
              </div>

              {/* Social Impact */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#2F5D50]/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#2F5D50]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937]">Social Impact</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#4B5563] mb-2">People Fed</p>
                    <p className="text-3xl font-bold text-[#2F5D50]">12,500</p>
                    <p className="text-xs text-[#7BAE7F] mt-1">Across 50+ community events</p>
                  </div>
                  <div className="pt-4 border-t border-[#EDE6DB]">
                    <p className="text-sm text-[#4B5563] mb-2">Communities Served</p>
                    <p className="text-2xl font-bold text-[#1F2937]">8 Districts</p>
                  </div>
                </div>
              </div>

              {/* Community Partners */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#DCE3E8]/50 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#2F5D50]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937]">Partnerships</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#4B5563] mb-2">Active NGOs</p>
                    <p className="text-3xl font-bold text-[#2F5D50]">15</p>
                    <p className="text-xs text-[#7BAE7F] mt-1">Verified and compliant partners</p>
                  </div>
                  <div className="pt-4 border-t border-[#EDE6DB]">
                    <p className="text-sm text-[#4B5563] mb-2">Volunteer Hours</p>
                    <p className="text-2xl font-bold text-[#1F2937]">480 hrs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
              <h3 className="text-lg font-bold text-[#1F2937] mb-6">Download Reports</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl hover:bg-white transition border border-[#EDE6DB]">
                  <div>
                    <p className="font-semibold text-[#1F2937] text-sm">Monthly Report</p>
                    <p className="text-xs text-[#4B5563] mt-1">April 2024</p>
                  </div>
                  <Download className="w-5 h-5 text-[#7BAE7F]" />
                </button>
                <button className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl hover:bg-white transition border border-[#EDE6DB]">
                  <div>
                    <p className="font-semibold text-[#1F2937] text-sm">Annual Impact Report</p>
                    <p className="text-xs text-[#4B5563] mt-1">2024 Summary</p>
                  </div>
                  <Download className="w-5 h-5 text-[#7BAE7F]" />
                </button>
                <button className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl hover:bg-white transition border border-[#EDE6DB]">
                  <div>
                    <p className="font-semibold text-[#1F2937] text-sm">Compliance Certificate</p>
                    <p className="text-xs text-[#4B5563] mt-1">ISO Certified</p>
                  </div>
                  <Download className="w-5 h-5 text-[#7BAE7F]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
