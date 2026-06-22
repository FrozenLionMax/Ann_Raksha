import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, Package, Eye, MapPin, Trophy, Sparkles } from 'lucide-react';

/**
 * #11 - Onboarding Tour
 * Shows a guided walkthrough for first-time users
 */

const donorSteps = [
  { title: 'Welcome to Ann Raksha! 🌱', desc: 'You\'re about to make a real difference. Let\'s show you how to turn surplus food into saved lives.', icon: '👋', cta: 'Let\'s Go!' },
  { title: 'Create a Donation', desc: 'Got surplus food? Post it with a photo, quantity, and pickup location. It takes less than 2 minutes!', icon: '📦', path: '/create-donation', cta: 'Show Me' },
  { title: 'Track Your Impact', desc: 'Watch your dashboard fill up with meals provided, CO₂ prevented, and water saved — in real-time.', icon: '📊', path: '/dashboard', cta: 'Next' },
  { title: 'Climb the Leaderboard', desc: 'Earn points with every donation. Unlock badges and compete with other food heroes!', icon: '🏆', path: '/leaderboard', cta: 'Next' },
  { title: 'You\'re All Set! 🎉', desc: 'Start your first donation now and join thousands of food heroes across India.', icon: '🚀', path: '/create-donation', cta: 'Create My First Donation' },
];

const ngoSteps = [
  { title: 'Welcome to Ann Raksha! 🌱', desc: 'Food is waiting for you. Let\'s show you how to find and claim donations nearby.', icon: '👋', cta: 'Let\'s Go!' },
  { title: 'Browse Available Food', desc: 'See real-time food donations near you. Search by type, filter by urgency, and claim instantly.', icon: '🔍', path: '/browse-donations', cta: 'Show Me' },
  { title: 'Live Map View', desc: 'See donations plotted on an interactive map. Find the nearest surplus food at a glance.', icon: '🗺️', path: '/explore', cta: 'Next' },
  { title: 'Get Real-Time Alerts', desc: 'When new food is posted nearby, you\'ll get an instant notification. Never miss a donation!', icon: '🔔', cta: 'Next' },
  { title: 'You\'re All Set! 🎉', desc: 'Start browsing donations now and make your first claim.', icon: '🚀', path: '/browse-donations', cta: 'Browse Donations' },
];

export default function OnboardingTour() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isNgo = userInfo?.role === 'ngo' || userInfo?.role === 'receiver';
  const steps = isNgo ? ngoSteps : donorSteps;

  useEffect(() => {
    const seen = localStorage.getItem('onboarding_done');
    if (!seen && userInfo?.name) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (step >= steps.length - 1) {
      localStorage.setItem('onboarding_done', 'true');
      setShow(false);
      if (steps[step].path) navigate(steps[step].path);
      return;
    }
    setStep(step + 1);
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_done', 'true');
    setShow(false);
  };

  if (!show) return null;

  const current = steps[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
        >
          {/* Close */}
          <button onClick={handleSkip} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>

          {/* Progress */}
          <div className="flex items-center gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${
                i <= step ? 'w-8 bg-emerald-500' : 'w-4 bg-white/10'
              }`} />
            ))}
          </div>

          {/* Content */}
          <div className="text-center">
            <div className="text-5xl mb-4">{current.icon}</div>
            <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">{current.desc}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {step > 0 && step < steps.length - 1 && (
              <button onClick={handleSkip}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all border border-white/10"
              >
                Skip Tour
              </button>
            )}
            <button onClick={handleNext}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              {current.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Step count */}
          <p className="text-center text-[11px] text-slate-600 mt-4">{step + 1} of {steps.length}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
