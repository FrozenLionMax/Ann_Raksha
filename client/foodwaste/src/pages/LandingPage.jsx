import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Utensils, ArrowRight, CheckCircle, Users, Leaf, Droplets, Flame,
  Shield, Zap, Globe, Award, ChevronDown, Star, TrendingUp, MapPin,
  BarChart3, Heart, Clock, Sparkles
} from 'lucide-react';

const stats = [
  { value: '68.7M', label: 'Tonnes Food Wasted/Year', icon: Flame, color: 'text-orange-400' },
  { value: '190M+', label: 'Indians Go Hungry Daily', icon: Heart, color: 'text-red-400' },
  { value: '₹92K Cr', label: 'Worth of Food Thrown', icon: TrendingUp, color: 'text-amber-400' },
  { value: '8-10%', label: 'Global Emissions from Waste', icon: Leaf, color: 'text-emerald-400' },
];

const features = [
  { icon: Zap, title: 'Real-Time Matching', desc: 'Instant donor-to-NGO connection via live WebSocket notifications. No delays, no phone calls.', color: 'from-emerald-500 to-teal-500' },
  { icon: BarChart3, title: 'Impact Dashboard', desc: 'Track meals served, CO₂ prevented, water saved. Role-based analytics for donors, NGOs & corporates.', color: 'from-blue-500 to-indigo-500' },
  { icon: Award, title: 'Gamification Engine', desc: 'Earn points, unlock badges, climb leaderboards. Make donating addictive, not a chore.', color: 'from-amber-500 to-orange-500' },
  { icon: MapPin, title: 'GPS Live Map', desc: 'Browse donations on an interactive dark map. Find & claim nearby surplus food instantly.', color: 'from-purple-500 to-pink-500' },
  { icon: Shield, title: 'Role-Based Access', desc: '5 user roles: Donor, NGO, Receiver, Volunteer, Admin — each with tailored workflows.', color: 'from-cyan-500 to-blue-500' },
  { icon: Sparkles, title: 'AI-Powered Features', desc: 'Smart recipe suggestions from surplus items, AI expiry prediction, and intelligent NGO matching.', color: 'from-rose-500 to-red-500' },
];

const steps = [
  { step: '01', title: 'Post Surplus Food', desc: 'Donors list food with photos, quantity, expiry & pickup location in seconds.', icon: '📦' },
  { step: '02', title: 'NGO Gets Notified', desc: 'Nearby NGOs receive instant real-time alerts about available donations.', icon: '🔔' },
  { step: '03', title: 'Claim & Pickup', desc: 'NGO claims the donation, volunteer coordinates pickup logistics.', icon: '🤝' },
  { step: '04', title: 'Impact Tracked', desc: 'Meals served, CO₂ saved, points earned — all tracked in real-time.', icon: '📊' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Restaurant Owner, Delhi', quote: 'We used to throw away 20kg of food daily. Now it feeds 50 people. Ann Raksha made donating effortless.', rating: 5 },
  { name: 'Rajesh Kumar', role: 'NGO Director, Mumbai', quote: 'The real-time notifications are a game-changer. We know exactly when food is available nearby.', rating: 5 },
  { name: 'Anita Desai', role: 'Corporate CSR Lead', quote: 'Finally, quantifiable ESG metrics we can put in our sustainability reports. The impact dashboard is incredible.', rating: 5 },
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current * 10) / 10);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  const prefix = target.replace(/[0-9.]/g, '').replace('+', '');
  return <span>{prefix}{count % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{target.includes('+') ? '+' : ''}{target.includes('K') ? 'K' : ''}{suffix}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Utensils className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-black">Ann <span className="text-emerald-400">Raksha</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm text-slate-400 hover:text-white transition">Problem</a>
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition">Features</a>
            <a href="#how" className="text-sm text-slate-400 hover:text-white transition">How It Works</a>
            <a href="#testimonials" className="text-sm text-slate-400 hover:text-white transition">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition">Sign In</button>
            <button onClick={() => navigate('/register')} className="px-5 py-2.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/25">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-emerald-400">Rescuing food in real-time across India</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6">
              Turn Surplus Food
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">Into Saved Lives</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              India wastes 68M tonnes of food yearly while 190M go hungry.
              Ann Raksha connects surplus food donors with NGOs & communities — in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all flex items-center gap-3"
              >
                Start Saving Food
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                Sign In →
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          >
            <ChevronDown className="w-6 h-6 text-slate-600" />
          </motion.div>
        </div>
      </section>

      {/* Problem Stats */}
      <section id="problem" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-red-400 uppercase tracking-widest">The Crisis</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">The Hunger-Waste Paradox</h2>
            <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">India has enough food for everyone. The problem isn't supply — it's a logistics & awareness gap.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-xl hover:bg-white/[0.07] transition-all"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-slate-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent_70%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Platform</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">Built for Impact</h2>
            <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">Every feature is designed to make food rescue effortless, transparent, and rewarding.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all backdrop-blur-xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-amber-400 uppercase tracking-widest">Process</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">How It Works</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-emerald-500/30 to-transparent z-0" />
                )}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative z-10 hover:bg-white/[0.07] transition-all">
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Step {s.step}</span>
                  <h3 className="text-lg font-bold text-white mt-2 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-purple-400 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">Loved by Heroes</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)]" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to Save Meals?</h2>
              <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto">Join thousands of food heroes turning waste into hope. Every meal counts.</p>
              <button
                onClick={() => navigate('/register')}
                className="group px-10 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-lg font-bold transition-all hover:shadow-2xl hover:shadow-emerald-500/30 inline-flex items-center gap-3"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black">Ann <span className="text-emerald-400">Raksha</span></span>
            </div>
            <p className="text-sm text-slate-500">Built with ❤️ by Team Prizzm — Ayush Kushwaha & Khushi Pandey</p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/FrozenLionMax/Ann_Raksha" target="_blank" rel="noopener" className="text-sm text-slate-500 hover:text-white transition">GitHub</a>
              <span className="text-slate-700">•</span>
              <span className="text-sm text-slate-500">BuildX'26</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
