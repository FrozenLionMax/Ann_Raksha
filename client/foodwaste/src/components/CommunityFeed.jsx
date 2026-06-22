import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Package, CheckCircle, Users, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';

/**
 * #14 - Community Activity Feed
 * Real-time feed of recent platform activity
 */
export default function CommunityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      // Fetch recent donations as activity proxy
      const res = await axios.get('http://localhost:5000/api/donations/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const donations = res.data.donations || [];
      const feed = donations.slice(0, 15).map(d => ({
        id: d._id,
        type: d.status,
        title: d.foodTitle,
        donor: d.donorId?.name || 'Someone',
        quantity: d.quantity,
        serves: d.servesPeople,
        time: d.createdAt,
        foodType: d.foodType,
      }));

      setActivities(feed);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'available': return { icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
      case 'matched': return { icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' };
      case 'completed': return { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' };
      default: return { icon: Activity, color: 'text-slate-400', bg: 'bg-white/5' };
    }
  };

  const getMessage = (item) => {
    switch (item.type) {
      case 'available': return `${item.donor} posted ${item.quantity}kg of ${item.foodType}`;
      case 'matched': return `${item.title} was claimed by an NGO`;
      case 'completed': return `${item.title} delivery completed — ${item.serves} people fed!`;
      default: return `${item.donor} posted "${item.title}"`;
    }
  };

  const timeAgo = (date) => {
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Community Feed</h3>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <button onClick={fetchActivities} className="p-1.5 hover:bg-white/5 rounded-lg transition">
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
        {activities.length === 0 && !loading && (
          <div className="px-5 py-8 text-center">
            <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No activity yet</p>
          </div>
        )}

        <AnimatePresence>
          {activities.map((item, i) => {
            const { icon: Icon, color, bg } = getIcon(item.type);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 px-5 py-3 hover:bg-white/5 transition-all"
              >
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 leading-snug">{getMessage(item)}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {timeAgo(item.time)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
