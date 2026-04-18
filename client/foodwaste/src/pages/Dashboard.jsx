import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Package,
  Search,
  LogOut,
  HeartHandshake,
  Bell,
  TrendingUp,
  Users,
  Leaf,
} from "lucide-react";
import { getDashboardStats } from "../services/dashboardService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const cards = [
    {
      title: "Create Donation",
      subtitle: "Publish fresh food donations for NGOs and receivers",
      icon: PlusCircle,
      route: "/create-donation",
    },
    {
      title: "My Donations",
      subtitle: "Track status, claims, and completed donations",
      icon: Package,
      route: "/my-donations",
    },
    {
      title: "Browse Donations",
      subtitle: "Explore and claim available food donations",
      icon: Search,
      route: "/browse-donations",
    },
    {
      title: "My Profile",
      subtitle: "View your account details and status",
      icon: Users,
      route: "/profile",
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-slate-800">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DCE8D5] flex items-center justify-center shadow-sm">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Food Waste Platform</h1>
              <p className="text-sm text-slate-500">Reduce waste. Deliver impact.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-11 h-11 rounded-2xl border border-[#E6DED2] bg-white flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-2xl bg-white border border-[#E6DED2] shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 mb-4">
              Smart Dashboard
            </p>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              Welcome back,
              <span className="block text-[#7B9E87]">
                {userInfo?.name || "User"}
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Manage food donations, monitor impact, and create measurable social change with a premium operational workflow.
            </p>
          </motion.div>

          <div className="bg-gradient-to-br from-[#E8F1E4] to-[#F5EBDD] rounded-[32px] p-8 shadow-sm border border-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <p className="text-sm text-slate-500">Total Donations</p>
                <h3 className="text-3xl font-bold mt-2">{dashboardData?.totalDonations || 0}</h3>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <p className="text-sm text-slate-500">Completed</p>
                <h3 className="text-3xl font-bold mt-2">{dashboardData?.completedDonations || 0}</h3>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm col-span-2">
                <p className="text-sm text-slate-500">Impact Statement</p>
                <h3 className="text-xl font-semibold mt-2">
                  Every donation reduces waste and feeds someone in need.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-8">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            ["Available", dashboardData?.availableDonations || 0, Leaf],
            ["Claimed", dashboardData?.claimedDonations || 0, Package],
            ["Community Reach", "500+", Users],
            ["Growth", "+18%", TrendingUp],
          ].map(([label, value, Icon]) => (
            <div key={label} className="bg-white rounded-3xl border border-[#ECE6DC] p-6 shadow-sm">
              <Icon className="w-5 h-5 mb-3" />
              <p className="text-sm text-slate-500">{label}</p>
              <h3 className="text-2xl font-bold mt-2">{value}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16 pt-4">
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(card.route)}
                className="bg-white rounded-[28px] p-8 border border-[#ECE6DC] shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F4EFE7] flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold mb-3 tracking-tight">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
