import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building2, Users, ArrowRight, AlertCircle, CheckCircle2, Loader, Shield, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    phone: '',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const accountTypes = [
    {
      id: 'donor',
      label: 'I Want to Donate Food',
      description: 'Restaurant, Hotel, Corporate Kitchen',
      icon: Building2,
      color: '#7BAE7F'
    },
    {
      id: 'ngo',
      label: 'I Represent an NGO',
      description: 'Non-profit Organization',
      icon: Users,
      color: '#2F5D50'
    },
    {
      id: 'volunteer',
      label: 'I Want to Volunteer',
      description: 'Help distribute food',
      icon: Heart,
      color: '#FFB84D'
    }
  ];

  const handleTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name) {
      setError('Please enter your name');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.phone) {
      setError('Please enter your phone number');
      return false;
    }

    if (!formData.agree) {
      setError('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userType
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user));

      setSuccess(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] via-white to-[#FAFAFA] flex items-center justify-center p-6">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7BAE7F]/8 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2F5D50]/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-xl font-bold text-[#2F5D50]">FoodFlow</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-[#4B5563] hover:text-[#1F2937] font-medium transition"
          >
            Already have an account? Sign in
          </button>
        </div>

        {/* Step 1: Account Type Selection */}
        {step === 1 && !success && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#1F2937] mb-3">Join FoodFlow</h1>
              <p className="text-lg text-[#4B5563]">What brings you to our platform?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {accountTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className="bg-white rounded-2xl p-8 border-2 border-[#EDE6DB] hover:border-[#7BAE7F] hover:shadow-lg transition group"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition"
                      style={{ backgroundColor: `${type.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: type.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-[#1F2937] mb-2">{type.label}</h3>
                    <p className="text-sm text-[#4B5563] mb-6">{type.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#7BAE7F]">Get started</span>
                      <ArrowRight className="w-4 h-4 text-[#7BAE7F] group-hover:translate-x-1 transition" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center pt-6 border-t border-[#EDE6DB]">
              <p className="text-sm text-[#4B5563]">
                By continuing, you agree to our <a href="#" className="text-[#7BAE7F] hover:text-[#2F5D50] font-medium">Terms of Service</a> and <a href="#" className="text-[#7BAE7F] hover:text-[#2F5D50] font-medium">Privacy Policy</a>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && !success && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-[#FAFAFA] rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5 text-[#4B5563]" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-[#1F2937]">Create Your Account</h1>
                <p className="text-[#4B5563] mt-1">As {accountTypes.find(t => t.id === userType)?.label}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#EDE6DB] shadow-lg">
              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7BAE7F]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-[#FAFAFA] border border-[#EDE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent focus:bg-white transition text-[#1F2937]"
                    />
                  </div>
                </div>

                {/* Organization Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                    {userType === 'donor' ? 'Restaurant/Hotel/Organization' : userType === 'ngo' ? 'NGO Name' : 'Organization (Optional)'}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7BAE7F]" />
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Organization name"
                      className="w-full pl-12 pr-4 py-3 bg-[#FAFAFA] border border-[#EDE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent focus:bg-white transition text-[#1F2937]"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7BAE7F]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-[#FAFAFA] border border-[#EDE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent focus:bg-white transition text-[#1F2937]"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#EDE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent focus:bg-white transition text-[#1F2937]"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7BAE7F]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 8 characters"
                      className="w-full pl-12 pr-12 py-3 bg-[#FAFAFA] border border-[#EDE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent focus:bg-white transition text-[#1F2937]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4B5563] hover:text-[#2F5D50] transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7BAE7F]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter your password"
                      className="w-full pl-12 pr-12 py-3 bg-[#FAFAFA] border border-[#EDE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] focus:border-transparent focus:bg-white transition text-[#1F2937]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#4B5563] hover:text-[#2F5D50] transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-[#EDE6DB] text-[#2F5D50] focus:ring-[#7BAE7F] cursor-pointer mt-0.5"
                  />
                  <span className="text-sm text-[#4B5563]">
                    I agree to the <a href="#" className="text-[#7BAE7F] hover:text-[#2F5D50] font-medium">Terms of Service</a> and <a href="#" className="text-[#7BAE7F] hover:text-[#2F5D50] font-medium">Privacy Policy</a>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#2F5D50] to-[#1F4D40] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-70 mt-6 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-[#EDE6DB] flex items-center justify-center gap-2 text-xs text-[#4B5563]">
                <Shield className="w-4 h-4 text-[#7BAE7F]" />
                <span>Your data is encrypted and secure</span>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-12 border border-[#EDE6DB] shadow-lg text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-[#1F2937] mb-3">Welcome to FoodFlow! 🎉</h2>
            <p className="text-lg text-[#4B5563] mb-8">
              Your account has been created successfully. Redirecting to your dashboard...
            </p>

            <div className="w-full bg-[#EDE6DB] rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#7BAE7F] to-[#2F5D50] h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
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
