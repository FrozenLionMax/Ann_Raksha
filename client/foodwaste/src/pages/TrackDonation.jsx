import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { Package, Clock, Users, MapPin, Truck, CheckCircle2, ChevronLeft, Shield } from 'lucide-react';
import BackgroundShader from '../components/BackgroundShader';

const steps = [
  { id: 'available', title: 'Available', icon: Package },
  { id: 'matched', title: 'Matched', icon: Shield },
  { id: 'picked_up', title: 'Picked Up', icon: Truck },
  { id: 'completed', title: 'Completed', icon: CheckCircle2 }
];

export default function TrackDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonation();

    const socket = io('http://localhost:5000');
    socket.on('status_update', (data) => {
      if (data.donationId === id) {
        setDonation(prev => prev ? { ...prev, status: data.status } : prev);
      }
    });

    return () => socket.disconnect();
  }, [id]);

  const fetchDonation = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonation(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (newStatus === 'completed') {
        await axios.put(`http://localhost:5000/api/donations/complete/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`http://localhost:5000/api/donations/status/${id}`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      // The socket will update UI automatically
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent relative flex items-center justify-center">
        <BackgroundShader />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-transparent relative flex flex-col items-center justify-center text-white">
        <BackgroundShader />
        <h2 className="text-2xl font-bold mb-4">Donation Not Found</h2>
        <button onClick={() => navigate('/dashboard')} className="bg-emerald-700 px-6 py-2 rounded-full">Go Back</button>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === donation.status);
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-transparent relative dark:bg-slate-900 transition-colors duration-500 font-sans">
      <BackgroundShader />
      <div className="absolute inset-0 bg-gray-900/60 dark:bg-slate-900/80 backdrop-blur-sm z-[-1]"></div>

      <div className="max-w-4xl mx-auto px-6 py-12 text-white">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-md mb-8 shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{donation.foodTitle}</h1>
              <p className="text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {donation.pickupAddress}
              </p>
            </div>
            <div className="text-right">
              <span className="bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-full font-bold text-sm">
                ID: {donation._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Progress Tracker UI */}
          <div className="relative py-12">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-700 rounded-full -translate-y-1/2"></div>
            
            {/* Animated Fill Line */}
            <motion.div 
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full -translate-y-1/2"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            ></motion.div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <motion.div 
                      className={`w-14 h-14 rounded-full flex items-center justify-center z-10 border-4 ${
                        isCompleted ? 'bg-emerald-700 border-emerald-500' : 'bg-gray-800 border-gray-700'
                      }`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: isCurrent ? 1.1 : 1, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-500'}`} />
                    </motion.div>
                    <motion.p 
                      className={`mt-4 font-semibold ${isCompleted ? 'text-white' : 'text-gray-500'}`}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.2 }}
                    >
                      {step.title}
                    </motion.p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Demo Actions (Only visible for demo purposes to simulate NGO actions) */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-bold mb-4 text-gray-300">Simulate NGO Actions (Demo)</h3>
          <div className="flex gap-4">
            <button 
              disabled={currentStepIndex >= 1}
              onClick={() => updateStatus('matched')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
            >
              Mark as Matched
            </button>
            <button 
              disabled={currentStepIndex >= 2 || currentStepIndex < 1}
              onClick={() => updateStatus('picked_up')}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
            >
              Mark as Picked Up
            </button>
            <button 
              disabled={currentStepIndex >= 3 || currentStepIndex < 2}
              onClick={() => updateStatus('completed')}
              className="flex-1 bg-emerald-500 hover:bg-[#6A9D6E] disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
            >
              Mark as Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
