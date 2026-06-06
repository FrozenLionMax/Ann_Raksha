import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Users, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

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

const SearchField = () => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Enter address, city or pin...'
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
};

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
        const mappableDonations = (res.data.donations || []).filter(d => d.location && d.location.lat && d.location.lng);
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
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-emerald-500" />
          Explore Donations
        </h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex-1 relative z-0">
        {!loading && (
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <SearchField />
            <TileLayer 
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
              attribution="&copy; <a href='https://carto.com/'>carto.com</a> contributors"
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
                      <h3 className="font-bold text-lg text-slate-900">{donation.foodTitle}</h3>
                      {donation.urgencyLevel === 'urgent' && (
                        <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> URGENT
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 mb-3 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><Package className="w-4 h-4" /> {donation.quantity}</p>
                      <p className="flex items-center gap-2"><Users className="w-4 h-4" /> Serves {donation.servesPeople}</p>
                      <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> Expires: {donation.expiryTime}</p>
                    </div>

                    <button 
                      onClick={() => handleClaim(donation._id)}
                      className="w-full bg-emerald-700 text-white py-2 rounded-lg font-semibold text-sm hover:bg-emerald-800 transition"
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
        /* Custom map search styling */
        .leaflet-geosearch-bar {
          z-index: 1000;
          margin-top: 20px !important;
        }
        .leaflet-geosearch-bar form {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
          border: 2px solid #7BAE7F;
        }
        .leaflet-geosearch-bar form input {
          padding: 0 15px;
          height: 40px;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
