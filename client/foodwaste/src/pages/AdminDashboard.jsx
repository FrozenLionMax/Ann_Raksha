import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Users, Package, Activity, Loader } from 'lucide-react';
import axios from 'axios';
import BackgroundShader from '../components/BackgroundShader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // In a real app, you'd pass the auth token here
      const [statsRes, ngosRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats'),
        axios.get('http://localhost:5000/api/admin/ngos')
      ]);
      setStats(statsRes.data);
      setNgos(ngosRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const reason = status === 'rejected' ? prompt("Enter rejection reason:") : "";
    if (status === 'rejected' && reason === null) return;

    try {
      await axios.put(`http://localhost:5000/api/admin/ngos/${id}/status`, { status, reason });
      fetchData(); // Refresh data
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Loader className="w-10 h-10 text-[#7BAE7F] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent relative text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <BackgroundShader />
      
      {/* Top Overlay */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md z-[-1]"></div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Command Center</h1>
            <p className="text-gray-400">Platform overview and NGO verification</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Donors</p>
            <p className="text-3xl font-bold">{stats?.users?.totalDonors || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Verified NGOs</p>
            <p className="text-3xl font-bold">{stats?.users?.verifiedNgos || 0} / {stats?.users?.totalNgos || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#7BAE7F]/20 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-[#7BAE7F]" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Donations</p>
            <p className="text-3xl font-bold">{stats?.donations?.totalDonations || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#FFB84D]/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#FFB84D]" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Active Donations</p>
            <p className="text-3xl font-bold">{stats?.donations?.activeDonations || 0}</p>
          </div>
        </div>

        {/* NGO Verification Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">NGO Verification Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Organization Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Document</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ngos.map((ngo) => (
                  <tr key={ngo._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-medium">{ngo.organizationName || ngo.name}</td>
                    <td className="px-6 py-4 text-gray-400">{ngo.email}</td>
                    <td className="px-6 py-4">
                      {ngo.verificationDocument ? (
                        <a href={ngo.verificationDocument} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View Doc</a>
                      ) : (
                        <span className="text-gray-500">None provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ngo.verificationStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                        ngo.verificationStatus === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {ngo.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ngo.verificationStatus !== 'approved' && (
                        <button 
                          onClick={() => handleUpdateStatus(ngo._id, 'approved')}
                          className="text-green-400 hover:text-green-300 ml-3"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {ngo.verificationStatus !== 'rejected' && (
                        <button 
                          onClick={() => handleUpdateStatus(ngo._id, 'rejected')}
                          className="text-red-400 hover:text-red-300 ml-3"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {ngos.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No NGOs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
