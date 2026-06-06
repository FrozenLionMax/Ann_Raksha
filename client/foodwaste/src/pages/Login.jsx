import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Call your auth API
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
           },
          body: JSON.stringify({
            email,
            password
          })
        }
      );
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      }

      setSuccess(true);

      // Redirect after success animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6 transition-colors duration-500">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-700/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left Side: Brand & Value Proposition */}
          <div className="hidden md:block">
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <Logo size="lg" />
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  Reduce Food Waste.<br/>
                  <span className="text-emerald-500">Feed Communities.</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join hundreds of organizations and NGOs making a real difference. AI-powered food redistribution connecting donors with those in need.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                  <span className="text-slate-600 dark:text-gray-300"><strong>50+</strong> active NGO partners</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                  <span className="text-slate-600 dark:text-gray-300"><strong>100K+</strong> meals redistributed</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                  <span className="text-slate-600 dark:text-gray-300"><strong>500T+</strong> food waste prevented</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                  <span className="text-slate-600 dark:text-gray-300">Industry-leading <strong>food safety standards</strong></span>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 italic shadow-sm">
                <p className="text-slate-600 dark:text-slate-400 mb-3 italic">
                  "Ann Raksha has revolutionized how we manage surplus food. The AI matching is incredible and our impact is now measurable."
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">— Priya Singh, Executive Director, XYZ Foundation</p>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
              {!success ? (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-600 dark:text-slate-400">Sign in to your account to continue</p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                          }}
                          placeholder="you@example.com"
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent dark:focus:bg-gray-800 transition text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white">Password</label>
                        <a
                          href="#forgot"
                          className="text-xs text-emerald-500 hover:text-emerald-700 transition font-medium"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                          }}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent dark:focus:bg-gray-800 transition text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-200 text-emerald-700 focus:ring-[#7BAE7F] cursor-pointer"
                      />
                      <span className="text-sm text-slate-600">Remember me for 30 days</span>
                    </label>

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-emerald-700 to-[#1F4D40] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-70 mt-6 flex items-center justify-center gap-2 group"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">Or continue as</span>
                    </div>
                  </div>

                  {/* Social Login Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-semibold hover:bg-white dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
                      <span className="text-lg">🍳</span> Donor
                    </button>
                    <button className="py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-semibold hover:bg-white dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
                      <span className="text-lg">🤝</span> NGO
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="mt-6 text-center">
                    <p className="text-slate-600">
                      Don't have an account?{' '}
                      <a
                        href="/register"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/register');
                        }}
                        className="text-emerald-700 font-semibold hover:text-emerald-500 transition"
                      >
                        Create one now
                      </a>
                    </p>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Your data is encrypted and secure</span>
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="text-center py-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome! 🎉</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    You've successfully signed in. Redirecting to your dashboard...
                  </p>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-6 text-center text-xs text-slate-600 space-y-2">
              <p>Need help? <a href="#support" className="text-emerald-500 hover:text-emerald-700 transition font-medium">Contact support</a></p>
              <p>By signing in, you agree to our <a href="#" className="text-emerald-500 hover:text-emerald-700 transition">Terms of Service</a> and <a href="#" className="text-emerald-500 hover:text-emerald-700 transition">Privacy Policy</a></p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        form {
          animation: slideInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
