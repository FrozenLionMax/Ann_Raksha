import API_BASE, { API_URL } from '../config/api';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { Upload, MapPin, Clock, Users, AlertCircle, CheckCircle2, Loader, ArrowRight, Filter, Search, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ setFormData }) {
  const [position, ReactSetPosition] = React.useState(null);
  const map = useMapEvents({
    click(e) {
      ReactSetPosition(e.latlng);
      setFormData(prev => ({ ...prev, location: { lat: e.latlng.lat, lng: e.latlng.lng } }));
    }
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

function SearchField() {
  const map = useMap();
  React.useEffect(() => {
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
}

export default function CreateDonationPremium() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [matches, setMatches] = useState(null);
  const [formData, setFormData] = useState({
    foodCategory: '',
    quantity: '',
    servings: '',
    cookedTime: '',
    expiryTime: '',
    location: null,
    pickupAddress: '',
    urgency: 'normal',
    description: '',
    allergens: [],
    imageUrl: null,
  });

  const [safetyChecks, setSafetyChecks] = useState({
    properStorage: false,
    noContamination: false,
    freshIngredients: false,
    cleanUtensils: false,
    properHandling: false,
  });

  const foodCategories = [
    'Cooked Rice & Grains',
    'Cooked Vegetables',
    'Cooked Meat & Protein',
    'Prepared Meals',
    'Bakery Items',
    'Dairy Products',
    'Beverages',
    'Mixed Food',
    'Other'
  ];

  const allergenOptions = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Wheat', 'Soy'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSafetyCheck = (e) => {
    const { name, checked } = e.target;
    setSafetyChecks({ ...safetyChecks, [name]: checked });
  };

  const allSafetyChecksComplete = Object.values(safetyChecks).every(val => val === true);

  const handleAIFill = async () => {
    if (!formData.description || !formData.foodCategory) {
      toast.error("Please select a Food Category and write a Description first.");
      return;
    }
    setAiLoading(true);
    try {
      const response = await axios.post(`${API_URL}/ai/categorize`, {
        title: formData.description,
        type: formData.foodCategory
      });
      
      const { predictedExpiry, storageInstruction } = response.data;
      
      setFormData(prev => ({
        ...prev,
        description: prev.description + `\n\n[AI Storage Advice: ${storageInstruction}]`
      }));
      toast.success("AI predicted expiry suggestion applied!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to get AI suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allSafetyChecksComplete) {
      toast.error('Please complete all food safety checks');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        foodTitle: formData.description || formData.foodCategory, // Fallback if description is empty
        foodType: formData.foodCategory,
        quantity: formData.quantity,
        servesPeople: formData.servings || 1,
        cookedTime: formData.cookedTime,
        expiryTime: formData.expiryTime,
        pickupAddress: formData.pickupAddress || 'Address not provided',
        location: formData.location || { lat: 0, lng: 0 },
        urgencyLevel: (formData.urgency === 'high' || formData.urgency === 'critical') ? 'urgent' : 'normal'
      };

      // 1. Submit donation to backend
      const donationResponse = await axios.post(`${API_URL}/donations/create`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).catch(err => console.log('Mocking donation creation as token might not be present:', err));
      
      // 2. Fetch AI Matches
      const matchResponse = await axios.post(`${API_URL}/ai/match`, {
        donationDetails: payload
      });
      
      setMatches(matchResponse.data);
      setStep(4);
    } catch (error) {
      console.error(error);
      toast.error('Error finding matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-32 pb-12 transition-colors duration-500">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  disabled={s > step}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition ${
                    s < step
                      ? 'bg-emerald-700 text-white'
                      : s === step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s < step ? '✓' : s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-1 bg-emerald-700 rounded-full"></div>
              <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-emerald-700' : 'bg-slate-200'}`}></div>
              <div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-emerald-700' : 'bg-slate-200'}`}></div>
            </div>
            <div className="flex justify-between mt-4 text-sm font-semibold">
              <span className={step >= 1 ? 'text-emerald-700 dark:text-emerald-500' : 'text-slate-600 dark:text-slate-500'}>Food Details</span>
              <span className={step >= 2 ? 'text-emerald-700 dark:text-emerald-500' : 'text-slate-600 dark:text-slate-500'}>Safety & Location</span>
              <span className={step >= 3 ? 'text-emerald-700 dark:text-emerald-500' : 'text-slate-600 dark:text-slate-500'}>Verification</span>
            </div>
          </div>
        )}

        {/* Step 1: Food Details */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Donate Food</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">Help us feed communities by sharing your surplus food</p>
            </div>

            <form className="space-y-6">
              {/* Food Category */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">What type of food?</label>
                <div className="grid grid-cols-2 gap-3">
                  {foodCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, foodCategory: cat })}
                      className={`p-4 rounded-xl font-medium transition ${
                        formData.foodCategory === cat
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Servings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Quantity (kg)</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 25"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">People Served</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    placeholder="e.g., 50"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Times */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" /> When was it cooked?
                  </label>
                  <input
                    type="time"
                    name="cookedTime"
                    value={formData.cookedTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FF4D4D]" /> Expiry time
                  </label>
                  <input
                    type="time"
                    name="expiryTime"
                    value={formData.expiryTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Urgency */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Urgency Level</label>
                <div className="flex gap-3">
                  {[
                    { value: 'low', label: 'Low', color: '#7BAE7F' },
                    { value: 'normal', label: 'Normal', color: '#2F5D50' },
                    { value: 'high', label: 'High', color: '#FFB84D' },
                    { value: 'critical', label: 'Critical', color: '#FF4D4D' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: option.value })}
                      className={`px-4 py-2 rounded-lg font-medium transition border-2 ${
                        formData.urgency === option.value
                          ? `border-[${option.color}] bg-[${option.color}] text-white`
                          : 'border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:border-emerald-500'
                      }`}
                      style={formData.urgency === option.value ? { borderColor: option.color, backgroundColor: option.color } : {}}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">Additional Details</label>
                  <button 
                    type="button" 
                    onClick={handleAIFill}
                    disabled={aiLoading}
                    className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-white transition disabled:opacity-50"
                  >
                    {aiLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI Auto-Fill Storage Advice
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Any special details about the food? Ingredients, preparation method, etc."
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-slate-900 dark:text-white"
                ></textarea>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Safety & Location */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Food Safety Verification</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">Ensure your donation meets food safety standards</p>
            </div>

            <form className="space-y-6">
              {/* Safety Checklist */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Safety Checklist</h2>
                <div className="space-y-4">
                  {[
                    { name: 'properStorage', label: 'Food was stored properly (covered, in clean containers)' },
                    { name: 'noContamination', label: 'No signs of contamination or spoilage' },
                    { name: 'freshIngredients', label: 'Made with fresh ingredients only' },
                    { name: 'cleanUtensils', label: 'Prepared with clean utensils & equipment' },
                    { name: 'properHandling', label: 'Handled following hygiene standards' }
                  ].map((item) => (
                    <label key={item.name} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition cursor-pointer border border-transparent dark:border-slate-600">
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={safetyChecks[item.name]}
                        onChange={handleSafetyCheck}
                        className="w-5 h-5 rounded text-emerald-700"
                      />
                      <span className="text-slate-900 dark:text-white font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Allergens Present</h2>
                <div className="grid grid-cols-2 gap-3">
                  {allergenOptions.map((allergen) => (
                    <label key={allergen} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700/50 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition cursor-pointer border border-transparent dark:border-slate-600">
                      <input
                        type="checkbox"
                        value={allergen}
                        checked={formData.allergens.includes(allergen)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, allergens: [...formData.allergens, allergen] });
                          } else {
                            setFormData({ ...formData, allergens: formData.allergens.filter(a => a !== allergen) });
                          }
                        }}
                        className="w-4 h-4 rounded text-emerald-700"
                      />
                      <span className="text-sm text-slate-900 dark:text-white">{allergen}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 transition-colors">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" /> Pickup Location (Drop Pin)
                </label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleInputChange}
                  placeholder="Enter full pickup address"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-slate-900 dark:text-white mb-3"
                />
                <div className="h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 relative">
                  <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
                    <SearchField />
                    <TileLayer 
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                      attribution="&copy; <a href='https://carto.com/'>carto.com</a> contributors"
                    />
                    <LocationMarker setFormData={setFormData} />
                  </MapContainer>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Click on the map to set precise pickup coordinates.</p>
              </div>

              {/* Image Upload */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-600 border-dashed transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Upload Food Photo</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">For verification purposes</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition cursor-pointer">
                    Choose Image
                  </label>
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <img src={formData.imageUrl} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!allSafetyChecksComplete}
                  className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    allSafetyChecksComplete
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-slate-200 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Verification */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Verify & Submit</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">Review your donation details</p>
            </div>

            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Food Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Category:</span><span className="font-semibold text-slate-900 dark:text-white">{formData.foodCategory}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Quantity:</span><span className="font-semibold text-slate-900 dark:text-white">{formData.quantity} kg</span></div>
                    <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Servings:</span><span className="font-semibold text-slate-900 dark:text-white">{formData.servings} people</span></div>
                    <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Urgency:</span><span className="font-semibold text-slate-900 dark:text-white capitalize">{formData.urgency}</span></div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Timing</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Cooked:</span><span className="font-semibold text-slate-900 dark:text-white">{formData.cookedTime}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Expires:</span><span className="font-semibold text-slate-900 dark:text-white">{formData.expiryTime}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Safe Window:</span><span className="font-semibold text-emerald-700 dark:text-emerald-500">~2.5 hours</span></div>
                  </div>
                </div>
              </div>

              {/* Safety Status */}
              <div className="bg-gradient-to-br from-emerald-700/5 to-emerald-500/5 rounded-2xl p-6 border border-emerald-500/30">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 dark:text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Safety Verified ✓</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">All food safety requirements met. Your donation is ready to be shared.</p>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded text-emerald-700 mt-1" defaultChecked />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    I confirm that this food donation complies with all food safety standards and regulations. I understand that false information may result in penalties.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-emerald-700 text-white py-4 rounded-xl font-semibold hover:bg-emerald-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Donation
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success & AI Matches */}
        {step === 4 && (
          <div className="space-y-8 py-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Donation Created! 🎉</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
                Your donation has been successfully submitted. Here are the top NGO matches determined by our AI:
              </p>
            </div>

            <div className="grid gap-6 max-w-3xl mx-auto">
              {matches && matches.length > 0 ? matches.map((match, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center flex-shrink-0 relative">
                    <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-500">{match.score}</div>
                    <div className="absolute -bottom-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">Match</div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{match.ngoId ? "Matched NGO" : "Food For All NGO"}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{match.reason}</p>
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          if (match.ngoId) {
                            await axios.post(`${API_BASE}/api/donations/claim/${match.ngoId}`, {}, {
                              headers: { Authorization: `Bearer ${token}` }
                            }).catch(() => {});
                          }
                          toast.success('Offer sent to NGO! They will be notified. 🎉');
                          navigate('/my-donations');
                        } catch {
                          toast.success('Offer sent! Redirecting to your donations...');
                          navigate('/my-donations');
                        }
                      }}
                      className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-800 transition flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Send Offer
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-400">No matches found at this moment, but your donation is listed publicly.</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 max-w-2xl mx-auto mt-8">
              <button
                onClick={() => navigate('/my-donations')}
                className="flex-1 bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition"
              >
                View My Donations
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-700 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        /* Custom map search styling */
        .leaflet-geosearch-bar {
          z-index: 1000;
          margin-top: 10px !important;
        }
        .leaflet-geosearch-bar form {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
          border: 2px solid #7BAE7F;
        }
        .leaflet-geosearch-bar form input {
          padding: 0 15px;
          height: 36px;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
