import API_BASE, { API_URL } from '../config/api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Utensils, ArrowRight, Loader, KeyRound, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [resetMode, setResetMode] = useState(null); // null | 'email' | 'otp' | 'done'
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      localStorage.setItem('token', res.data.token);
      toast.success(`Welcome back, ${res.data.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return toast.error('Enter your email');
    setResetLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email: resetEmail });
      toast.success(res.data.message);
      setResetMode('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) return toast.error('Fill all fields');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setResetLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, { email: resetEmail, otp, newPassword });
      toast.success(res.data.message);
      setResetMode(null);
      setOtp('');
      setNewPassword('');
      setResetEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.08),transparent_50%)]" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">Ann <span className="text-emerald-400">Raksha</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {resetMode ? 'Reset Password' : 'Welcome back'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {resetMode === 'email' ? 'Enter your email to receive a reset OTP' :
             resetMode === 'otp' ? 'Enter the OTP sent to your email' :
             'Sign in to continue saving meals'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Login Form */}
          {!resetMode && (
            <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl space-y-5"
            >
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => { setResetMode('email'); setResetEmail(form.email); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Signing in...</> : <><span>Sign In</span> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </motion.form>
          )}

          {/* Forgot Password - Step 1: Enter email */}
          {resetMode === 'email' && (
            <motion.div key="reset-email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl space-y-5"
            >
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <button onClick={handleForgotPassword} disabled={resetLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {resetLoading ? <><Loader className="w-4 h-4 animate-spin" /> Sending OTP...</> : <><KeyRound className="w-4 h-4" /> Send Reset OTP</>}
              </button>

              <button onClick={() => setResetMode(null)}
                className="w-full py-2 text-sm text-slate-400 hover:text-white flex items-center justify-center gap-1 transition"
              >
                <ArrowLeft className="w-3 h-3" /> Back to login
              </button>
            </motion.div>
          )}

          {/* Forgot Password - Step 2: Enter OTP + new password */}
          {resetMode === 'otp' && (
            <motion.div key="reset-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl space-y-5"
            >
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">6-Digit OTP</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456" maxLength={6}
                  className="w-full px-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-[0.5em] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="password" value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <button onClick={handleResetPassword} disabled={resetLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {resetLoading ? <><Loader className="w-4 h-4 animate-spin" /> Resetting...</> : <><KeyRound className="w-4 h-4" /> Reset Password</>}
              </button>

              <button onClick={() => setResetMode('email')}
                className="w-full py-2 text-sm text-slate-400 hover:text-white flex items-center justify-center gap-1 transition"
              >
                <ArrowLeft className="w-3 h-3" /> Resend OTP
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
