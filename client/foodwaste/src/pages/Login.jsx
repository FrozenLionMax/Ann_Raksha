import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] via-white to-[#FAFAFA] flex items-center justify-center p-6">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7BAE7F]/8 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2F5D50]/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left Side: Brand & Value Proposition */}
          <div className="hidden md:block">
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  F
                </div>
                <span className="text-2xl font-bold text-[#2F5D50]">FoodFlow</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-[#1F2937] leading-tight">
                  Reduce Food Waste.<br/>
                  <span className="text-[#7BAE7F]">Feed Communities.</span>
                </h1>
                <p className="text-lg text-[#4B5563] leading-relaxed">
                  Join hundreds of organizations and NGOs making a real difference. AI-powered food redistribution connecting donors with those in need.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2F5D50]" />
                  <span className="text-[#4B5563]"><strong>50+</strong> active NGO partners</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2F5D50]" />
                  <span className="text-[#4B5563]"><strong>100K+</strong> meals redistributed</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2F5D50]" />
                  <span className="text-[#4B5563]"><strong>500T+</strong> food waste prevented</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2F5D50]" />
                  <span className="text-[#4B5563]">Industry-leading <strong>food safety standards</strong></span>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB] italic">
                <p className="text-[#4B5563] mb-3">
                  "FoodFlow has revolutionized how we manage surplus food. The AI matching is incredible and our impact is now measurable."
                </p>
                <p className="font-semibold text-[#1F2937]">— Priya Singh, Executive Director, XYZ Foundation</p>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div>
            <div className="bg-white rounded-3xl p-8 border border-[#EDE6DB] shadow-lg">
              {!success ? (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#1F2937] mb-2">Welcome Back</h2>
                    <p className="text-[#4B5563]">Sign in to your account to continue</p>
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
                      <label className="block text-sm font-semibold text-[#1F2937] mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7BAE7F]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                          }}
                          placeholder="you@example.com"
                          className="w-full pl-12 pr-4 py-3 bg-[#FAFAFA] border border-[#EDE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent focus:bg-white transition text-[#1F2937]"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-[#1F2937]">Password</label>
                        <a
                          href="#forgot"
                          className="text-xs text-[#7BAE7F] hover:text-[#2F5D50] transition font-medium"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7BAE7F]" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                          }}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-12 py-3 bg-[#FAFAFA] border border-[#EDE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent focus:bg-white transition text-[#1F2937]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4B5563] hover:text-[#2F5D50] transition"
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
                        className="w-4 h-4 rounded border-[#EDE6DB] text-[#2F5D50] focus:ring-[#7BAE7F] cursor-pointer"
                      />
                      <span className="text-sm text-[#4B5563]">Remember me for 30 days</span>
                    </label>

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#2F5D50] to-[#1F4D40] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-70 mt-6 flex items-center justify-center gap-2 group"
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
                      <div className="w-full border-t border-[#EDE6DB]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-[#4B5563]">Or continue as</span>
                    </div>
                  </div>

                  {/* Social Login Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 rounded-xl border border-[#EDE6DB] text-[#1F2937] font-semibold hover:bg-[#FAFAFA] transition flex items-center justify-center gap-2">
                      <span className="text-lg">🍳</span> Donor
                    </button>
                    <button className="py-3 rounded-xl border border-[#EDE6DB] text-[#1F2937] font-semibold hover:bg-[#FAFAFA] transition flex items-center justify-center gap-2">
                      <span className="text-lg">🤝</span> NGO
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="mt-6 text-center">
                    <p className="text-[#4B5563]">
                      Don't have an account?{' '}
                      <a
                        href="/register"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/register');
                        }}
                        className="text-[#2F5D50] font-semibold hover:text-[#7BAE7F] transition"
                      >
                        Create one now
                      </a>
                    </p>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-6 pt-6 border-t border-[#EDE6DB] flex items-center justify-center gap-2 text-xs text-[#4B5563]">
                    <Shield className="w-4 h-4 text-[#7BAE7F]" />
                    <span>Your data is encrypted and secure</span>
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="text-center py-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Welcome! 🎉</h2>
                  <p className="text-[#4B5563] mb-6">
                    You've successfully signed in. Redirecting to your dashboard...
                  </p>

                  <div className="w-full bg-[#EDE6DB] rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#7BAE7F] to-[#2F5D50] h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-6 text-center text-xs text-[#4B5563] space-y-2">
              <p>Need help? <a href="#support" className="text-[#7BAE7F] hover:text-[#2F5D50] transition font-medium">Contact support</a></p>
              <p>By signing in, you agree to our <a href="#" className="text-[#7BAE7F] hover:text-[#2F5D50] transition">Terms of Service</a> and <a href="#" className="text-[#7BAE7F] hover:text-[#2F5D50] transition">Privacy Policy</a></p>
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
