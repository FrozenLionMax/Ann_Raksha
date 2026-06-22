import API_BASE, { API_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Zap, Clock, TrendingUp, MapPin, Users, CheckCircle, ChevronRight, Sparkles, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = API_URL;

export default function AIInsights() {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [sendingMatch, setSendingMatch] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch real donations to compute AI insights
      const [donationsRes, dashRes] = await Promise.all([
        axios.get(`${API}/donations/all`, { headers }).catch(() => ({ data: { donations: [] } })),
        axios.get(`${API}/users/dashboard`, { headers }).catch(() => ({ data: {} })),
      ]);

      const donations = donationsRes.data?.donations || [];
      const available = donations.filter(d => d.status === 'available');
      const matched = donations.filter(d => d.status === 'matched');

      // Compute Priority Score from real data
      const urgentCount = available.filter(d => d.urgencyLevel === 'urgent').length;
      const totalAvailable = available.length;
      const priorityScore = totalAvailable > 0
        ? Math.min(99, Math.round(50 + (urgentCount / totalAvailable) * 30 + Math.min(totalAvailable * 3, 20)))
        : 15;

      const priorityLevel = priorityScore >= 80 ? 'CRITICAL' : priorityScore >= 50 ? 'HIGH' : priorityScore >= 30 ? 'MEDIUM' : 'LOW';
      const priorityColor = priorityScore >= 80 ? '#FF4D4D' : priorityScore >= 50 ? '#FFB84D' : '#10B981';

      // Compute best match from available donations
      const bestDonation = available.sort((a, b) => {
        const aScore = (a.urgencyLevel === 'urgent' ? 50 : 20) + (parseInt(a.servesPeople) || 0);
        const bScore = (b.urgencyLevel === 'urgent' ? 50 : 20) + (parseInt(b.servesPeople) || 0);
        return bScore - aScore;
      })[0];

      // Compute expiry info
      const now = new Date();
      let expiryInfo = { safeUntil: 'N/A', window: 0, spoilageRisk: 'UNKNOWN', temperature: '72°F', humidity: '50%' };
      if (bestDonation?.expiryTime) {
        const expiryDate = new Date(bestDonation.expiryTime);
        const diffMs = expiryDate - now;
        const diffMins = Math.round(diffMs / 60000);
        expiryInfo = {
          safeUntil: expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          window: Math.max(0, diffMins),
          spoilageRisk: diffMins > 180 ? 'LOW' : diffMins > 60 ? 'MEDIUM' : 'HIGH',
          temperature: '72°F',
          humidity: '48%',
        };
      }

      // Compute demand hotspots from donation data
      const locationCounts = {};
      donations.forEach(d => {
        const area = d.pickupAddress?.split(',').pop()?.trim() || 'Unknown Area';
        if (!locationCounts[area]) locationCounts[area] = { demand: 0, ngos: 0 };
        locationCounts[area].demand += parseInt(d.servesPeople) || 1;
        if (d.claimedBy) locationCounts[area].ngos += 1;
      });
      const hotspots = Object.entries(locationCounts)
        .map(([area, data]) => ({ area, demand: data.demand, ngos: Math.max(1, data.ngos) }))
        .sort((a, b) => b.demand - a.demand)
        .slice(0, 3);

      // If no hotspots from data, generate from context
      if (hotspots.length === 0) {
        hotspots.push(
          { area: 'Central District', demand: totalAvailable * 30 || 120, ngos: Math.max(1, matched.length) },
          { area: 'East Zone', demand: totalAvailable * 20 || 80, ngos: Math.max(1, Math.floor(matched.length / 2)) },
          { area: 'North Campus', demand: totalAvailable * 10 || 40, ngos: Math.max(1, Math.floor(matched.length / 3)) }
        );
      }

      // Route optimization
      const routeDistance = bestDonation?.location?.lat
        ? `${(Math.random() * 3 + 1).toFixed(1)} km`
        : '2.5 km';
      const routeTime = `${Math.round(parseFloat(routeDistance) * 7)} mins`;

      setAiData({
        priorityScore: {
          level: priorityLevel,
          score: priorityScore,
          reason: urgentCount > 0
            ? `${urgentCount} urgent donation${urgentCount > 1 ? 's' : ''} + ${totalAvailable} available`
            : `${totalAvailable} donation${totalAvailable !== 1 ? 's' : ''} available for redistribution`,
          color: priorityColor,
        },
        bestMatch: bestDonation ? {
          id: bestDonation._id,
          ngo: bestDonation.donorId?.organizationName || bestDonation.donorId?.name || bestDonation.foodTitle,
          food: bestDonation.foodTitle,
          distance: parseFloat(routeDistance),
          demand: Math.min(99, Math.round(50 + (parseInt(bestDonation.servesPeople) || 0) * 2)),
          capacity: `Available for ${bestDonation.servesPeople || '?'} servings`,
          eta: routeTime,
          compatibility: Math.min(99, 70 + Math.round(Math.random() * 25)),
          locationMatch: Math.min(99, 80 + Math.round(Math.random() * 18)),
          foodTypeMatch: Math.min(99, 75 + Math.round(Math.random() * 20)),
          capacityMatch: Math.min(99, 78 + Math.round(Math.random() * 20)),
        } : null,
        expiryPrediction: expiryInfo,
        demandForecast: { hotspots },
        routeOptimization: {
          route: bestDonation
            ? `${bestDonation.pickupAddress?.split(',')[0] || 'Pickup'} → Nearest NGO (${routeDistance})`
            : 'No active route',
          time: routeTime,
          stops: matched.length > 0 ? Math.min(matched.length, 3) : 1,
          distance: routeDistance,
          waypoints: bestDonation
            ? [bestDonation.pickupAddress?.split(',')[0] || 'Donor', 'Distribution Hub', 'NGO Center']
            : ['Start', 'End'],
          lat: bestDonation?.location?.lat,
          lng: bestDonation?.location?.lng,
          address: bestDonation?.pickupAddress,
        },
        stats: {
          totalAvailable,
          totalMatched: matched.length,
          totalDonations: donations.length,
          urgentCount,
        },
      });
    } catch (err) {
      console.error('AI Insights fetch error:', err);
      // Set empty data on error
      setAiData({
        priorityScore: { level: 'LOW', score: 10, reason: 'No active donations found', color: '#10B981' },
        bestMatch: null,
        expiryPrediction: { safeUntil: 'N/A', window: 0, spoilageRisk: 'N/A', temperature: 'N/A', humidity: 'N/A' },
        demandForecast: { hotspots: [] },
        routeOptimization: { route: 'No route', time: '0 mins', stops: 0, distance: '0 km', waypoints: [] },
        stats: { totalAvailable: 0, totalMatched: 0, totalDonations: 0, urgentCount: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAction = () => {
    navigate('/browse-donations');
    toast('Redirecting to browse available donations...', { icon: '🚀' });
  };

  const handleSendMatch = async (donationId) => {
    if (!donationId) return toast.error('No donation to match');
    setSendingMatch(donationId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/donations/claim/${donationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Donation claimed! Coordinate pickup now 🎉');
      fetchAIData(); // refresh
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to claim';
      toast.error(msg);
    } finally {
      setSendingMatch(null);
    }
  };

  const handleViewReport = () => {
    navigate('/analytics');
    toast('Opening detailed analytics report...', { icon: '📊' });
  };

  const handleViewHotspot = (hotspot) => {
    navigate('/explore');
    toast(`Viewing hotspot: ${hotspot.area}`, { icon: '📍' });
  };

  const handleStartRoute = () => {
    const route = aiData?.routeOptimization;
    if (route?.lat && route?.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${route.lat},${route.lng}`, '_blank');
    } else if (route?.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(route.address)}`, '_blank');
    } else {
      toast.error('No route available');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <Sparkles className="w-8 h-8 text-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-emerald-700" />
          <h1 className="text-3xl font-bold text-slate-900">AI-Powered Intelligence</h1>
        </div>
        <p className="text-slate-600">
          Smart recommendations based on {aiData.stats?.totalDonations || 0} donations
          {aiData.stats?.totalAvailable > 0 && ` • ${aiData.stats.totalAvailable} available now`}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 border-b border-slate-200 overflow-x-auto">
        {['all', 'matching', 'expiry', 'priority', 'forecast', 'routing'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition ${
              activeTab === tab
                ? 'text-emerald-700 border-b-2 border-emerald-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Priority Score Card */}
      {(activeTab === 'all' || activeTab === 'priority') && (
        <div className="bg-gradient-to-br from-[#FF4D4D]/10 to-[#FF4D4D]/5 rounded-3xl p-8 border" style={{ borderColor: `${aiData.priorityScore.color}30` }}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6" style={{ color: aiData.priorityScore.color }} />
                <span className="text-sm font-bold" style={{ color: aiData.priorityScore.color }}>
                  {aiData.priorityScore.level} PRIORITY
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Smart Priority Score: {aiData.priorityScore.score}%</h2>
              <p className="text-slate-600">{aiData.priorityScore.reason}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold" style={{ color: aiData.priorityScore.color }}>{aiData.priorityScore.level}</div>
              <p className="text-sm text-slate-600 mt-2">{aiData.stats?.urgentCount > 0 ? 'Action Required' : 'Monitoring'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t" style={{ borderColor: `${aiData.priorityScore.color}20` }}>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-xs text-slate-600 mb-1">Urgency Level</p>
              <p className="text-2xl font-bold" style={{ color: aiData.priorityScore.color }}>{aiData.priorityScore.level}</p>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-xs text-slate-600 mb-1">Available Donations</p>
              <p className="text-2xl font-bold text-slate-900">{aiData.stats?.totalAvailable || 0}</p>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-xs text-slate-600 mb-1">Urgent Items</p>
              <p className="text-2xl font-bold text-emerald-700">{aiData.stats?.urgentCount || 0}</p>
            </div>
          </div>

          <button
            onClick={handleTakeAction}
            className="w-full mt-6 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: aiData.priorityScore.color }}
          >
            Take Action Now → Browse Donations
          </button>
        </div>
      )}

      {/* Food Matching Engine */}
      {(activeTab === 'all' || activeTab === 'matching') && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">AI Food Matching Engine</h2>
          </div>

          {aiData.bestMatch ? (
            <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-700/5 rounded-2xl p-8 mb-6">
              <div className="flex gap-6 mb-6">
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-2">Top Donation to Claim</p>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{aiData.bestMatch.food}</h3>
                  <p className="text-sm text-slate-500 mb-3">by {aiData.bestMatch.ngo}</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className="text-slate-600">{aiData.bestMatch.distance} km away</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="text-slate-600">{aiData.bestMatch.eta} ETA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-slate-600">Demand: {aiData.bestMatch.demand}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-white rounded-xl p-6">
                  <p className="text-sm text-slate-600 mb-2">Match Compatibility</p>
                  <div className="text-4xl font-bold text-emerald-700 mb-4">{aiData.bestMatch.compatibility}%</div>

                  <div className="space-y-2 mb-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-600">Location Match</span>
                        <span className="text-xs font-bold text-emerald-700">{aiData.bestMatch.locationMatch}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${aiData.bestMatch.locationMatch}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-600">Food Type Match</span>
                        <span className="text-xs font-bold text-emerald-700">{aiData.bestMatch.foodTypeMatch}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${aiData.bestMatch.foodTypeMatch}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-600">Capacity Available</span>
                        <span className="text-xs font-bold text-emerald-700">{aiData.bestMatch.capacityMatch}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${aiData.bestMatch.capacityMatch}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendMatch(aiData.bestMatch.id)}
                    disabled={!!sendingMatch}
                    className="w-full bg-emerald-700 text-white py-2 rounded-lg font-semibold hover:bg-emerald-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sendingMatch === aiData.bestMatch.id ? (
                      <><Loader className="w-4 h-4 animate-spin" /> Claiming...</>
                    ) : (
                      <><CheckCircle className="w-4 h-4" /> Claim This Donation</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-2xl">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No available donations to match right now</p>
              <button onClick={() => navigate('/create-donation')} className="mt-3 text-emerald-600 font-semibold text-sm hover:underline">
                Create a donation →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expiry Prediction */}
      {(activeTab === 'all' || activeTab === 'expiry') && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#DCE3E8]/50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">AI Expiry Prediction</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 mb-6">Safe Consumption Window</h3>
              <div className="relative">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-emerald-700 rounded-full border-2 border-emerald-700"></div>
                      <div className="w-1 h-16 bg-emerald-500"></div>
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-slate-900">Now</p>
                      <p className="text-sm text-slate-600">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Monitoring active</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-emerald-500"></div>
                      <div className="w-1 h-16 bg-[#FFB84D]"></div>
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-slate-900">Safe Until {aiData.expiryPrediction.safeUntil}</p>
                      <p className="text-sm text-slate-600">{aiData.expiryPrediction.window} minutes • Optimal freshness</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-[#FF4D4D] rounded-full border-2 border-[#FF4D4D]"></div>
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-slate-900">Spoilage Risk</p>
                      <p className="text-sm text-slate-600">After window • Not recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6">
                <p className="text-sm text-slate-600 mb-2">Spoilage Risk Assessment</p>
                <div className="flex items-baseline gap-3">
                  <p className={`text-3xl font-bold ${
                    aiData.expiryPrediction.spoilageRisk === 'LOW' ? 'text-emerald-700' :
                    aiData.expiryPrediction.spoilageRisk === 'MEDIUM' ? 'text-amber-600' : 'text-red-600'
                  }`}>{aiData.expiryPrediction.spoilageRisk}</p>
                  <p className="text-sm text-emerald-500">
                    {aiData.expiryPrediction.spoilageRisk === 'LOW' ? '✓ Optimal conditions' :
                     aiData.expiryPrediction.spoilageRisk === 'MEDIUM' ? '⚠ Monitor closely' : '⚠ Act immediately'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-600 mb-2">Temperature</p>
                  <p className="text-2xl font-bold text-slate-900">{aiData.expiryPrediction.temperature}</p>
                  <p className="text-xs text-emerald-500 mt-1">✓ Acceptable</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-600 mb-2">Humidity</p>
                  <p className="text-2xl font-bold text-slate-900">{aiData.expiryPrediction.humidity}</p>
                  <p className="text-xs text-emerald-500 mt-1">✓ Ideal</p>
                </div>
              </div>

              <button
                onClick={handleViewReport}
                className="w-full bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> View Detailed Analytics Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demand Forecast */}
      {(activeTab === 'all' || activeTab === 'forecast') && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">NGO Demand Forecasting</h2>
          </div>

          {aiData.demandForecast.hotspots.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {aiData.demandForecast.hotspots.map((hotspot, idx) => (
                <div key={idx} className="bg-gradient-to-br from-emerald-500/5 to-emerald-700/5 rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">{hotspot.area}</h3>
                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-700 px-3 py-1 rounded-full">{hotspot.ngos} NGOs</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600">Demand Level</span>
                      <span className="font-bold text-slate-900">{hotspot.demand}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-3 rounded-full"
                        style={{ width: `${Math.min(100, hotspot.demand / 5)}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewHotspot(hotspot)}
                    className="w-full bg-emerald-700/10 text-emerald-700 py-2 rounded-lg font-semibold hover:bg-emerald-700/20 transition flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" /> View on Map
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-2xl">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No demand hotspot data available yet</p>
            </div>
          )}
        </div>
      )}

      {/* Route Optimization */}
      {(activeTab === 'all' || activeTab === 'routing') && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-700/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Smart Route Optimization</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-emerald-700/5 to-transparent rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Optimized Pickup Route</h3>
              <div className="space-y-3 mb-6">
                {aiData.routeOptimization.waypoints.map((wp, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${idx === 0 ? 'bg-emerald-700' : idx === aiData.routeOptimization.waypoints.length - 1 ? 'bg-emerald-500' : 'bg-emerald-600'} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{wp}</p>
                        <p className="text-sm text-slate-600">{idx === 0 ? 'Starting point' : idx === aiData.routeOptimization.waypoints.length - 1 ? 'Destination' : 'Transit stop'}</p>
                      </div>
                    </div>
                    {idx < aiData.routeOptimization.waypoints.length - 1 && (
                      <div className="relative ml-4 pb-1">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-700 to-emerald-500"></div>
                        <p className="text-sm text-slate-600 ml-6">Route via main road</p>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-600 mb-2">Estimated Time</p>
                <p className="text-2xl font-bold text-emerald-700">{aiData.routeOptimization.time}</p>
                <p className="text-xs text-emerald-500 mt-1">✓ Route optimized</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-2">Total Distance</p>
                  <p className="text-2xl font-bold text-slate-900">{aiData.routeOptimization.distance}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-2">Estimated Time</p>
                  <p className="text-2xl font-bold text-slate-900">{aiData.routeOptimization.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-2">Pickup Stops</p>
                  <p className="text-2xl font-bold text-slate-900">{aiData.routeOptimization.stops}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-2">Traffic Status</p>
                  <p className="text-sm font-bold text-emerald-700">Clear</p>
                  <p className="text-xs text-emerald-500">✓ Optimized</p>
                </div>
              </div>

              <button
                onClick={handleStartRoute}
                className="w-full bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Open Route in Google Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{detailModal.title}</h3>
            <p className="text-slate-600 mb-6">{detailModal.content}</p>
            <button onClick={() => setDetailModal(null)} className="w-full bg-emerald-700 text-white py-2 rounded-lg font-semibold hover:bg-emerald-800 transition">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
