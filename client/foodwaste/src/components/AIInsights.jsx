import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, Clock, TrendingUp, MapPin, Users, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';

export default function AIInsights() {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate AI data fetch
    setTimeout(() => {
      setAiData({
        priorityScore: {
          level: 'CRITICAL',
          score: 92,
          reason: 'Expires in 1.5 hours + high demand area',
          color: '#FF4D4D',
          icon: AlertCircle
        },
        bestMatch: {
          ngo: 'Food For All Foundation',
          distance: 2.3,
          demand: 95,
          capacity: 'Available for 50 meals',
          eta: '18 mins',
          compatibility: 98,
          icon: Users
        },
        expiryPrediction: {
          safeUntil: '4:30 PM',
          window: 150,
          spoilageRisk: 'LOW',
          temperature: '68°F',
          humidity: '45%',
          icon: Clock
        },
        demandForecast: {
          hotspots: [
            { area: 'East District', demand: 450, ngos: 8 },
            { area: 'Central Zone', demand: 380, ngos: 12 },
            { area: 'North Campus', demand: 200, ngos: 5 }
          ]
        },
        routeOptimization: {
          route: 'Hotel → Food For All (2.3km)',
          time: '18 mins',
          stops: 2,
          distance: '2.3 km',
          waypoints: ['Hotel Paradise', 'Central Hub', 'Food For All']
        }
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <Sparkles className="w-8 h-8 text-[#7BAE7F]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-[#2F5D50]" />
          <h1 className="text-3xl font-bold text-[#1F2937]">AI-Powered Intelligence</h1>
        </div>
        <p className="text-[#4B5563]">Smart recommendations for optimal food redistribution</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 border-b border-[#EDE6DB] overflow-x-auto">
        {['all', 'matching', 'expiry', 'priority', 'forecast', 'routing'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition ${
              activeTab === tab
                ? 'text-[#2F5D50] border-b-2 border-[#2F5D50]'
                : 'text-[#4B5563] hover:text-[#1F2937]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Priority Score Card */}
      {(activeTab === 'all' || activeTab === 'priority') && (
        <div className="bg-gradient-to-br from-[#FF4D4D]/10 to-[#FF4D4D]/5 rounded-3xl p-8 border border-[#FF4D4D]/30">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-[#FF4D4D]" />
                <span className="text-sm font-bold text-[#FF4D4D]">CRITICAL PRIORITY</span>
              </div>
              <h2 className="text-3xl font-bold text-[#1F2937] mb-2">Smart Priority Score: {aiData.priorityScore.score}%</h2>
              <p className="text-[#4B5563]">{aiData.priorityScore.reason}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-[#FF4D4D]">{aiData.priorityScore.level}</div>
              <p className="text-sm text-[#4B5563] mt-2">Action Required</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#FF4D4D]/20">
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-xs text-[#4B5563] mb-1">Urgency Level</p>
              <p className="text-2xl font-bold text-[#FF4D4D]">Critical</p>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-xs text-[#4B5563] mb-1">Time to Spoilage</p>
              <p className="text-2xl font-bold text-[#1F2937]">1.5h</p>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-xs text-[#4B5563] mb-1">Demand Match</p>
              <p className="text-2xl font-bold text-[#2F5D50]">95%</p>
            </div>
          </div>

          <button className="w-full mt-6 bg-[#FF4D4D] text-white py-3 rounded-xl font-semibold hover:bg-[#E63939] transition">
            Take Action Now
          </button>
        </div>
      )}

      {/* Food Matching Engine */}
      {(activeTab === 'all' || activeTab === 'matching') && (
        <div className="bg-white rounded-3xl p-8 border border-[#EDE6DB] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#7BAE7F]/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#2F5D50]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937]">AI Food Matching Engine</h2>
          </div>

          <div className="bg-gradient-to-br from-[#7BAE7F]/5 to-[#2F5D50]/5 rounded-2xl p-8 mb-6">
            <div className="flex gap-6 mb-6">
              <div className="flex-1">
                <p className="text-sm text-[#4B5563] mb-2">Recommended NGO</p>
                <h3 className="text-2xl font-bold text-[#1F2937] mb-3">{aiData.bestMatch.ngo}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7BAE7F]" />
                    <span className="text-[#4B5563]">{aiData.bestMatch.distance} km away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7BAE7F]" />
                    <span className="text-[#4B5563]">{aiData.bestMatch.eta} ETA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#7BAE7F]" />
                    <span className="text-[#4B5563]">Demand: {aiData.bestMatch.demand}%</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-xl p-6">
                <p className="text-sm text-[#4B5563] mb-2">Match Compatibility</p>
                <div className="text-4xl font-bold text-[#2F5D50] mb-4">{aiData.bestMatch.compatibility}%</div>
                
                <div className="space-y-2 mb-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#4B5563]">Location Match</span>
                      <span className="text-xs font-bold text-[#2F5D50]">98%</span>
                    </div>
                    <div className="w-full bg-[#EDE6DB] rounded-full h-2">
                      <div className="bg-[#7BAE7F] h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#4B5563]">Food Type Match</span>
                      <span className="text-xs font-bold text-[#2F5D50]">95%</span>
                    </div>
                    <div className="w-full bg-[#EDE6DB] rounded-full h-2">
                      <div className="bg-[#7BAE7F] h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#4B5563]">Capacity Available</span>
                      <span className="text-xs font-bold text-[#2F5D50]">96%</span>
                    </div>
                    <div className="w-full bg-[#EDE6DB] rounded-full h-2">
                      <div className="bg-[#7BAE7F] h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#2F5D50] text-white py-2 rounded-lg font-semibold hover:bg-[#1F4D40] transition">
                  Send Match
                </button>
              </div>
            </div>
          </div>

          {/* Alternative Matches */}
          <div>
            <h3 className="font-semibold text-[#1F2937] mb-4">Alternative Matches</h3>
            <div className="space-y-3">
              {[
                { name: 'Community Care NGO', distance: 3.5, compatibility: 87, status: 'Available' },
                { name: 'Food Justice Initiative', distance: 4.2, compatibility: 82, status: 'Available' },
                { name: 'Meal for Everyone', distance: 5.1, compatibility: 78, status: 'Limited Capacity' }
              ].map((alt, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl hover:bg-white transition border border-[#EDE6DB]">
                  <div className="flex-1">
                    <p className="font-semibold text-[#1F2937]">{alt.name}</p>
                    <p className="text-sm text-[#4B5563]">{alt.distance} km • {alt.compatibility}% match</p>
                  </div>
                  <span className="text-xs font-semibold text-[#7BAE7F] bg-[#7BAE7F]/10 px-3 py-1 rounded-full">{alt.status}</span>
                  <ChevronRight className="w-5 h-5 text-[#4B5563] ml-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expiry Prediction */}
      {(activeTab === 'all' || activeTab === 'expiry') && (
        <div className="bg-white rounded-3xl p-8 border border-[#EDE6DB] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#DCE3E8]/50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#2F5D50]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937]">AI Expiry Prediction</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Timeline */}
            <div className="bg-gradient-to-br from-[#7BAE7F]/5 to-transparent rounded-2xl p-6">
              <h3 className="font-semibold text-[#1F2937] mb-6">Safe Consumption Window</h3>
              
              <div className="relative">
                {/* Timeline */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-[#2F5D50] rounded-full border-2 border-[#2F5D50]"></div>
                      <div className="w-1 h-16 bg-[#7BAE7F]"></div>
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-[#1F2937]">Now</p>
                      <p className="text-sm text-[#4B5563]">2:00 PM • Food received</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-[#7BAE7F] rounded-full border-2 border-[#7BAE7F]"></div>
                      <div className="w-1 h-16 bg-[#FFB84D]"></div>
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-[#1F2937]">Safe Until 4:30 PM</p>
                      <p className="text-sm text-[#4B5563]">150 minutes • Optimal freshness</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-[#FF4D4D] rounded-full border-2 border-[#FF4D4D]"></div>
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-[#1F2937]">Spoilage Risk</p>
                      <p className="text-sm text-[#4B5563]">After 5:30 PM • Not recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Data */}
            <div className="space-y-4">
              <div className="bg-[#F8F6F2] rounded-2xl p-6">
                <p className="text-sm text-[#4B5563] mb-2">Spoilage Risk Assessment</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-[#2F5D50]">LOW</p>
                  <p className="text-sm text-[#7BAE7F]">✓ Optimal conditions</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#EDE6DB] rounded-xl p-4">
                  <p className="text-xs text-[#4B5563] mb-2">Temperature</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{aiData.expiryPrediction.temperature}</p>
                  <p className="text-xs text-[#7BAE7F] mt-1">✓ Acceptable</p>
                </div>
                <div className="bg-white border border-[#EDE6DB] rounded-xl p-4">
                  <p className="text-xs text-[#4B5563] mb-2">Humidity</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{aiData.expiryPrediction.humidity}</p>
                  <p className="text-xs text-[#7BAE7F] mt-1">✓ Ideal</p>
                </div>
              </div>

              <button className="w-full bg-[#2F5D50] text-white py-3 rounded-xl font-semibold hover:bg-[#1F4D40] transition">
                View Detailed Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demand Forecast */}
      {(activeTab === 'all' || activeTab === 'forecast') && (
        <div className="bg-white rounded-3xl p-8 border border-[#EDE6DB] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#7BAE7F]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#2F5D50]" />
                </div>
            <h2 className="text-2xl font-bold text-[#1F2937]">NGO Demand Forecasting</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {aiData.demandForecast.hotspots.map((hotspot, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#7BAE7F]/5 to-[#2F5D50]/5 rounded-2xl p-6 border border-[#7BAE7F]/20 hover:border-[#7BAE7F]/50 transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1F2937]">{hotspot.area}</h3>
                  <span className="text-xs font-bold bg-[#7BAE7F]/20 text-[#2F5D50] px-3 py-1 rounded-full">{hotspot.ngos} NGOs</span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#4B5563]">Demand Level</span>
                    <span className="font-bold text-[#1F2937]">{hotspot.demand}</span>
                  </div>
                  <div className="w-full bg-[#EDE6DB] rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#7BAE7F] to-[#2F5D50] h-3 rounded-full"
                      style={{ width: `${hotspot.demand / 5}%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full bg-[#2F5D50]/10 text-[#2F5D50] py-2 rounded-lg font-semibold hover:bg-[#2F5D50]/20 transition">
                  View Hotspot
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Route Optimization */}
      {(activeTab === 'all' || activeTab === 'routing') && (
        <div className="bg-white rounded-3xl p-8 border border-[#EDE6DB] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#2F5D50]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937]">Smart Route Optimization</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Route Details */}
            <div className="bg-gradient-to-br from-[#2F5D50]/5 to-transparent rounded-2xl p-6">
              <h3 className="font-semibold text-[#1F2937] mb-4">Optimized Pickup Route</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#2F5D50] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-semibold text-[#1F2937]">Hotel Paradise</p>
                    <p className="text-sm text-[#4B5563]">Starting point</p>
                  </div>
                </div>

                <div className="relative ml-4 pb-3">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2F5D50] to-[#7BAE7F]"></div>
                  <p className="text-sm text-[#4B5563] ml-6">Route: 2.3 km via Main Street</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#7BAE7F] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-semibold text-[#1F2937]">Food For All Foundation</p>
                    <p className="text-sm text-[#4B5563]">Destination</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#EDE6DB]">
                <p className="text-xs text-[#4B5563] mb-2">Estimated Time</p>
                <p className="text-2xl font-bold text-[#2F5D50]">18 minutes</p>
                <p className="text-xs text-[#7BAE7F] mt-1">✓ All roads clear</p>
              </div>
            </div>

            {/* Route Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8F6F2] rounded-xl p-4">
                  <p className="text-sm text-[#4B5563] mb-2">Total Distance</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{aiData.routeOptimization.distance}</p>
                </div>
                <div className="bg-[#F8F6F2] rounded-xl p-4">
                  <p className="text-sm text-[#4B5563] mb-2">Estimated Time</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{aiData.routeOptimization.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#EDE6DB] rounded-xl p-4">
                  <p className="text-sm text-[#4B5563] mb-2">Pickup Stops</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{aiData.routeOptimization.stops}</p>
                </div>
                <div className="bg-white border border-[#EDE6DB] rounded-xl p-4">
                  <p className="text-sm text-[#4B5563] mb-2">Traffic Status</p>
                  <p className="text-sm font-bold text-[#2F5D50]">Clear</p>
                  <p className="text-xs text-[#7BAE7F]">✓ Optimized</p>
                </div>
              </div>

              <button className="w-full bg-[#2F5D50] text-white py-3 rounded-xl font-semibold hover:bg-[#1F4D40] transition">
                Start Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
