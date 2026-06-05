import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Users, MapPin, ChevronRight, AlertCircle } from 'lucide-react';

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom urgent icon
const urgentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapExplore() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/donations/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Only keep donations that have location data
        const mappableDonations = res.data.filter(d => d.location && d.location.lat && d.location.lng);
        setDonations(mappableDonations);
      } catch (error) {
        console.error("Error fetching donations for map:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleClaim = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/donations/claim/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Donation claimed successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to claim donation');
    }
  };

  return (
    <div className="h-screen w-full relative flex flex-col">
      <div className="bg-white dark:bg-gray-900 border-b border-[#EDE6DB] dark:border-gray-800 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#7BAE7F]" />
          Explore Donations
        </h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm font-semibold text-[#4B5563] dark:text-gray-400 hover:text-[#2F5D50] dark:hover:text-[#7BAE7F] transition"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex-1 relative z-0">
        {!loading && (
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution="&copy; OpenStreetMap contributors"
            />
            
            {donations.map((donation) => (
              <Marker 
                key={donation._id} 
                position={[donation.location.lat, donation.location.lng]}
                icon={donation.urgencyLevel === 'urgent' ? urgentIcon : new L.Icon.Default()}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-[#1F2937]">{donation.foodTitle}</h3>
                      {donation.urgencyLevel === 'urgent' && (
                        <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> URGENT
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 mb-3 text-sm text-[#4B5563]">
                      <p className="flex items-center gap-2"><Package className="w-4 h-4" /> {donation.quantity}</p>
                      <p className="flex items-center gap-2"><Users className="w-4 h-4" /> Serves {donation.servesPeople}</p>
                      <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> Expires: {donation.expiryTime}</p>
                    </div>

                    <button 
                      onClick={() => handleClaim(donation._id)}
                      className="w-full bg-[#2F5D50] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#1F4D40] transition"
                    >
                      Claim Donation
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  );
}
