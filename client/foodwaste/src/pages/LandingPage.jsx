import React, { useState, useEffect } from 'react';
import { Leaf, ArrowRight, Shield, Clock, Users, ChevronRight, Activity, MapPin, ChevronDown, CheckCircle, Zap, TrendingUp, Award, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import BackgroundShader from '../components/BackgroundShader';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Active NGO Partners', value: '50+' },
    { label: 'Meals Redistributed', value: '100K+' },
    { label: 'Food Waste Prevented', value: '500T' },
  ];

  const partners = [
    { name: 'XYZ Foundation', category: 'NGO' },
    { name: 'Food For All', category: 'NGO' },
    { name: 'Community Care', category: 'NGO' },
    { name: 'Chef\'s Table Hotel', category: 'Hotel' },
    { name: 'Gourmet Restaurant', category: 'Restaurant' },
    { name: 'Corporate Kitchens', category: 'Corporate' },
  ];

  const testimonials = [
    {
      text: 'Ann Raksha has revolutionized how we manage surplus food. We\'ve reduced waste by 80% and helped thousands.',
      author: 'Priya Singh',
      role: 'Executive Director, XYZ Foundation',
      avatar: '👩‍💼'
    },
    {
      text: 'The AI matching is incredible. Food reaches those who need it most within hours.',
      author: 'Rajesh Kumar',
      role: 'Hotel Manager, Premium Hotels Inc',
      avatar: '👨‍💼'
    },
    {
      text: 'Our CSR impact is now measurable and transparent. This platform is a game-changer.',
      author: 'Anjali Patel',
      role: 'CSR Head, Tech Corp India',
      avatar: '👩‍💻'
    },
  ];

  const faqs = [
    {
      q: 'How does the AI matching work?',
      a: 'Our AI analyzes food type, quantity, expiry time, location, and NGO demand to find the best match in seconds.'
    },
    {
      q: 'Is the food safety verified?',
      a: 'Yes. All donors are verified, food safety checklists are mandatory, and photo proof is required for every donation.'
    },
    {
      q: 'Can restaurants schedule recurring pickups?',
      a: 'Absolutely. Our platform allows scheduled pickups for restaurants, hotels, and corporate donors.'
    },
    {
      q: 'How do NGOs track their impact?',
      a: 'Real-time dashboards show meals distributed, people fed, and environmental impact.'
    },
    {
      q: 'What about liability and legal compliance?',
      a: 'We handle all compliance documentation and liability protection for donors.'
    },
  ];

  return (
    <div className="min-h-screen bg-transparent relative dark:bg-slate-900 transition-colors duration-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <BackgroundShader />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-50 border-b border-slate-200 dark:border-gray-800 shadow-sm transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <Logo size="md" />
          </div>
          
          <div className="hidden md:flex gap-10 text-sm text-slate-900 dark:text-gray-300">
            <a href="#how" className="hover:text-emerald-700 dark:hover:text-emerald-500 transition font-medium">How It Works</a>
            <a href="#impact" className="hover:text-emerald-700 dark:hover:text-emerald-500 transition font-medium">Impact</a>
            <a href="#partners" className="hover:text-emerald-700 dark:hover:text-emerald-500 transition font-medium">Partners</a>
            <a href="#faq" className="hover:text-emerald-700 dark:hover:text-emerald-500 transition font-medium">FAQ</a>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="border border-emerald-700 dark:border-emerald-500 text-emerald-700 dark:text-emerald-500 px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700/5 dark:hover:bg-emerald-500/10 transition"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-emerald-700 dark:bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-emerald-800 dark:hover:bg-[#6A9D6E] transition shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-[#DCE3E8]/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 animate-fade-in">
            <span className="bg-emerald-500/10 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-500/30">
              ✓ Trusted by 50+ NGOs • 100K+ Meals Saved
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight" style={{ animation: 'fadeInUp 0.8s ease-out 0.1s both' }}>
            Reducing Food Waste.<br/>
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-[#A8D3B0] dark:to-emerald-500 bg-clip-text text-transparent">Feeding Communities.</span><br/>
            Empowering NGOs.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light" style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
            Connect restaurants, hotels, and corporate donors with NGOs that need food most. AI-powered matching, real-time verification, and measurable impact tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" style={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
            >
              Launch Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button className="border-2 border-emerald-500 text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-500/5 transition">
              View Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-6 md:gap-10 pt-12 border-t border-slate-200" style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-emerald-700 group-hover:scale-110 transition duration-300">{stat.value}</div>
                <div className="text-sm text-slate-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Four simple steps to reduce waste and feed communities</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                icon: Users, 
                title: 'Donors Register', 
                desc: 'Restaurants, hotels, corporates, or individuals sign up and verify',
                step: '01'
              },
              { 
                icon: Zap, 
                title: 'AI Matching', 
                desc: 'Smart system finds the best NGO based on location & urgency',
                step: '02'
              },
              { 
                icon: Clock, 
                title: 'Pickup & Delivery', 
                desc: 'Volunteers collect within the safe food window',
                step: '03'
              },
              { 
                icon: TrendingUp, 
                title: 'Track Impact', 
                desc: 'Real-time statistics on meals served and lives touched',
                step: '04'
              }
            ].map((item, idx) => (
              <div key={idx} className="group">
                <div className="bg-gradient-to-br from-[#FAFAFA] to-[#F8F6F2] dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-emerald-500/30 transition duration-300 h-full">
                  <div className="text-4xl font-bold text-emerald-500/20 dark:text-emerald-500/40 mb-4">{item.step}</div>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-700/5 dark:from-emerald-500/20 dark:to-emerald-700/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                    <item.icon className="w-7 h-7 text-emerald-700 dark:text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Impact Section */}
      <section id="impact" className="py-24 px-6 bg-gradient-to-b from-emerald-500/5 dark:from-emerald-500/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Real Impact, Real Numbers</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Every donation counts. Here's the proof.</p>
          </div>

            {['Heart', 'Leaf', 'Award'].map((item, idx) => {
              const items = [
                { icon: Heart, label: 'People Fed', value: '100K+', color: '#7BAE7F' },
                { icon: Leaf, label: 'Waste Prevented', value: '500T', color: '#2F5D50' },
                { icon: Award, label: 'NGO Partners', value: '50+', color: '#DCE3E8' }
              ];
              const current = items[idx];
              return (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-opacity-20" style={{ backgroundColor: current.color }}>
                    <current.icon className="w-6 h-6 text-emerald-700 dark:text-emerald-500 m-3" />
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{current.label}</p>
                <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-500">{current.value}</p>
              </div>
            )})}
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Trusted by Leading Organizations</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">NGOs, restaurants, hotels, and corporates working together</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {partners.map((partner, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#FAFAFA] to-[#F8F6F2] dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{partner.name}</p>
                    <p className="text-xs text-emerald-500 mt-1">{partner.category}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gradient-to-b from-emerald-500/5 dark:from-emerald-500/10 to-white dark:to-gray-900 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">What People Are Saying</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-emerald-500">★</span>
                  ))}
                </div>
                <p className="text-slate-900 dark:text-gray-300 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-2 mb-4">
                  <Logo size="sm" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-gradient-to-br from-[#FAFAFA] to-[#F8F6F2] dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:border-emerald-500/50 transition">
                <summary className="flex items-center justify-between font-semibold text-slate-900 dark:text-white list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-emerald-500 group-open:rotate-180 transition" />
                </summary>
                <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-emerald-700 to-[#1F4D40] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-lg mb-10 text-white/90 max-w-2xl mx-auto">Join hundreds of organizations reducing food waste and feeding communities. Start today.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-50 transition shadow-lg"
            >
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg"></div>
                <span className="font-bold text-lg">FoodFlow</span>
              </div>
              <p className="text-white/60 text-sm">Reducing food waste. Feeding communities. Empowering NGOs.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Dashboard</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
            <p>&copy; 2024 Ann Raksha. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
