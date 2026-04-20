import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  MapPin, Package, Clock, AlertCircle, CheckCircle, Navigation, Loader, RefreshCw
} from "lucide-react";

const API = "http://localhost:5000/api/donations";
const getToken = () => JSON.parse(localStorage.getItem("userInfo"))?.token;

// Custom marker icon
const createIcon = (urgent) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;
    background:${urgent ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#10b981,#059669)'};
    box-shadow:0 4px 14px ${urgent ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'};
    border:2px solid rgba(255,255,255,0.3);color:white;font-size:16px;
  ">🍽️</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const userIcon = L.divIcon({
  className: 'user-marker',
  html: `<div style="
    width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;
    box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 4px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function SetViewOnClick({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 13); }, [center]);
  return null;
}

export default function MapExplore() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [center, setCenter] = useState([28.6139, 77.209]); // Default Delhi
  const [claiming, setClaiming] = useState(null);

  useEffect(() => {
    fetchDonations();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(coords);
          setCenter(coords);
        },
        () => toast("Couldn't get your location, showing default", { icon: '📍' })
      );
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDonations((res.data.donations || []).filter(d => d.location?.lat && d.location?.lng));
    } catch {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id) => {
    setClaiming(id);
    try {
      await axios.post(`${API}/claim/${id}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Claimed! 🎉");
      fetchDonations();
    } catch (e) {
      toast.error(e.response?.data?.message || "Claim failed");
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">
                Explore <span className="text-emerald-400">Map</span>
              </h1>
              <p className="text-slate-400 mt-1">
                {donations.length} donation{donations.length !== 1 ? 's' : ''} with location data
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={getUserLocation}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="Center on my location"
              >
                <Navigation className="w-5 h-5" />
              </button>
              <button onClick={fetchDonations}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ height: '70vh' }}
        >
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap'
            />
            <SetViewOnClick center={center} />

            {/* User location */}
            {userPos && (
              <Marker position={userPos} icon={userIcon}>
                <Popup className="custom-popup">
                  <div className="text-center p-1">
                    <p className="font-bold text-sm">📍 You are here</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Donation markers */}
            {donations.map(d => (
              <Marker
                key={d._id}
                position={[d.location.lat, d.location.lng]}
                icon={createIcon(d.urgencyLevel === 'urgent')}
              >
                <Popup className="custom-popup" maxWidth={280}>
                  <div className="p-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        d.urgencyLevel === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {d.urgencyLevel}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{d.foodTitle}</h3>
                    <p className="text-xs text-gray-500 mb-1">{d.foodType} • {d.quantity} kg • Serves {d.servesPeople}</p>
                    <p className="text-xs text-gray-500 mb-1">📍 {d.pickupAddress}</p>
                    <p className="text-xs text-gray-500 mb-2">⏰ Expires: {d.expiryTime}</p>
                    {d.donorId?.name && <p className="text-xs text-gray-400 mb-2">By {d.donorId.name}</p>}
                    {d.status === 'available' && (
                      <button
                        onClick={() => handleClaim(d._id)}
                        disabled={claiming === d._id}
                        className="w-full py-2 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition disabled:opacity-50"
                      >
                        {claiming === d._id ? '...' : '✓ Claim This Donation'}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-4 h-4 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600" />
            Normal
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-4 h-4 rounded-md bg-gradient-to-br from-red-500 to-red-600" />
            Urgent
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
            You
          </div>
        </div>
      </div>
    </div>
  );
}
