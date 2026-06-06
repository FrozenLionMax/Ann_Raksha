import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Shield, Building2, BadgeCheck, ChevronLeft, Edit3 } from "lucide-react";
import Logo from "../components/Logo";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(
          localStorage.getItem("userInfo") || "{}"
        );

        if (!userInfo.token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          config
        );

        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Profile Not Found</h1>
        <button onClick={() => navigate('/dashboard')} className="bg-emerald-700 text-white px-6 py-2 rounded-xl">Go Home</button>
      </div>
    );
  }

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
          <button className="bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-800 transition text-sm flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
          
          <div className="relative z-10 w-32 h-32 rounded-full bg-white dark:bg-slate-700 p-2 shadow-xl shrink-0 mt-8 md:mt-12">
            <div className="w-full h-full bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          
          <div className="relative z-10 flex-1 text-center md:text-left mt-4 md:mt-16">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{user.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider rounded-lg">
                {user.role}
              </span>
              {user.verificationStatus === 'approved' ? (
                <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                  <BadgeCheck className="w-4 h-4" /> Verified
                </span>
              ) : (
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-lg">
                  Pending Verification
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 transition-colors">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Email Address</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white break-all">{user.email}</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 transition-colors">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Phone Number</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.phone || "Not provided"}</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 transition-colors">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Organization</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.organizationName || "Independent"}</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 transition-colors">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Account Security</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Password Protected</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;