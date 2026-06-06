import { useEffect, useState } from "react";
import {
  getAllDonations,
  claimDonation,
  completeDonation,
} from "../services/donationService";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Package, Clock, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import Logo from "../components/Logo";

export default function BrowseDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDonations = async () => {
    try {
      const data = await getAllDonations();
      setDonations(data.donations || []);
    } catch (error) {
      console.error("Failed to fetch donations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleClaim = async (id) => {
    try {
      await claimDonation(id);
      alert("Donation Claimed Successfully");
      fetchDonations();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Claim Failed"
      );
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeDonation(id);
      alert("Donation Marked Completed");
      fetchDonations();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Complete Failed"
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400';
      case 'claimed': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'matched': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'picked_up': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400';
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo size="sm" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Browse Donations</h1>
            <p className="text-slate-600 dark:text-slate-400">Discover and claim food donations available in your area.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Available: </span>
            <span className="text-emerald-700 dark:text-emerald-500 font-bold ml-1">{donations.filter(d => d.status === 'available').length}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No donations available</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-8">There are currently no active food donations available for claiming.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div key={donation._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(donation.status)}`}>
                    {donation.status.replace('_', ' ')}
                  </span>
                  {donation.urgencyLevel === 'urgent' && (
                    <span className="text-red-500 flex items-center gap-1 text-xs font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
                      <AlertCircle className="w-3 h-3" /> Urgent
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition">
                  {donation.foodTitle}
                </h3>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{donation.quantity} kg • {donation.foodType}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Serves: {donation.servesPeople}</span>
                  </div>
                  <div className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{donation.pickupAddress}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                  {donation.status === "available" && (
                    <button
                      onClick={() => handleClaim(donation._id)}
                      className="w-full bg-emerald-700 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-800 transition"
                    >
                      Claim Donation
                    </button>
                  )}
                  {donation.status === "claimed" && (
                    <button
                      onClick={() => handleComplete(donation._id)}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      Mark Complete
                    </button>
                  )}
                  {donation.status !== "available" && donation.status !== "claimed" && (
                    <div className="w-full text-center py-2.5 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded-xl font-semibold text-sm">
                      No actions available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}