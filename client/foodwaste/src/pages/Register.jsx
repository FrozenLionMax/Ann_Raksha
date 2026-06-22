import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Utensils, ArrowRight, Loader, User, Phone, Building2 } from 'lucide-react';

const roles = [
  { value: 'donor', label: 'Donor', desc: 'Donate surplus food', emoji: '🍽️' },
  { value: 'ngo', label: 'NGO', desc: 'Receive & distribute food', emoji: '🏛️' },
  { value: 'receiver', label: 'Receiver', desc: 'Receive food donations', emoji: '🙏' },
  { value: 'volunteer', label: 'Volunteer', desc: 'Help with logistics', emoji: '🙋' },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: '', phone: '', organizationName: '',
  });

  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.role) {
      return toast.error('Please fill all required fields');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: form.name, email: form.email, password: form.password,
        role: form.role, phone: form.phone, organizationName: form.organizationName,
      });
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      toast.success(`Welcome to Ann Raksha, ${res.data.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.08),transparent_50%)]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">Ann <span className="text-emerald-400">Raksha</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Join the Movement</h1>
          <p className="text-slate-400 text-sm mt-1">Create an account and start saving meals</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${
              step >= s ? 'w-16 bg-emerald-500' : 'w-8 bg-white/10'
            }`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-white mb-4">I want to join as a...</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => updateForm('role', r.value)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      form.role === r.value
                        ? 'bg-emerald-500/10 border-emerald-500/30 ring-2 ring-emerald-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <p className="text-sm font-semibold text-white mt-2">{r.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <InputField icon={User} label="Full Name *" value={form.name} onChange={v => updateForm('name', v)} placeholder="Ayush Kushwaha" />
                <InputField icon={Mail} label="Email *" type="email" value={form.email} onChange={v => updateForm('email', v)} placeholder="you@example.com" />
              </div>

              <button type="button" onClick={() => {
                if (!form.role) return toast.error('Please select a role');
                if (!form.name || !form.email) return toast.error('Please fill name and email');
                setStep(2);
              }}
                className="w-full mt-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-white mb-4">Almost there!</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPw ? 'text' : 'password'} value={form.password}
                      onChange={e => updateForm('password', e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <InputField icon={Lock} label="Confirm Password *" type="password" value={form.confirmPassword} onChange={v => updateForm('confirmPassword', v)} placeholder="••••••••" />
                <InputField icon={Phone} label="Phone (optional)" value={form.phone} onChange={v => updateForm('phone', v)} placeholder="+91 98765 43210" />
                {(form.role === 'ngo' || form.role === 'donor') && (
                  <InputField icon={Building2} label="Organization Name (optional)" value={form.organizationName} onChange={v => updateForm('organizationName', v)} placeholder="My Organization" />
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-all"
                >← Back</button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? <><Loader className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Account'}
                </button>
              </div>
            </motion.div>
          )}
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}

function InputField({ icon: Icon, label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm text-slate-400 mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
      </div>
    </div>
  );
}
