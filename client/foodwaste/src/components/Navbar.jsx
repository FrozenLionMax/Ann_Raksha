import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, Package, PlusCircle, MapPin, Trophy,
  Bell, User, LogOut, Menu, X, ChevronDown, Settings, Utensils, BarChart3, Repeat
} from 'lucide-react';
import Logo from './Logo';
import NotificationCenter from './NotificationCenter';
import { LanguageSwitcher } from './i18n';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/browse-donations', label: 'Browse', icon: Search },
  { path: '/create-donation', label: 'Donate', icon: PlusCircle, hideFor: ['ngo', 'receiver'] },
  { path: '/my-donations', label: 'My Donations', icon: Package },
  { path: '/explore', label: 'Map', icon: MapPin },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/volunteer', label: 'Volunteer', icon: Package, showFor: ['volunteer', 'admin'] },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) setUserInfo(JSON.parse(info));
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (!userInfo) return null;

  const filteredLinks = navLinks.filter(
    link => (!link.hideFor || !link.hideFor.includes(userInfo.role)) &&
            (!link.showFor || link.showFor.includes(userInfo.role))
  );

  const initials = (userInfo.name || 'U').charAt(0).toUpperCase();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:block">
                Ann <span className="text-emerald-400">Raksha</span>
              </span>
            </Link>

            {/* Center: Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {filteredLinks.map(link => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 rounded-xl border border-emerald-500/30 bg-emerald-500/5"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              <LanguageSwitcher compact />
              <ThemeToggle />
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80"
                    >
                      <NotificationCenter />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {initials}
                  </div>
                  <span className="text-sm text-slate-300 hidden md:block max-w-[100px] truncate">{userInfo.name}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/5">
                        <p className="text-sm font-semibold text-white truncate">{userInfo.name}</p>
                        <p className="text-xs text-slate-500 truncate">{userInfo.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-md">
                          {userInfo.role}
                        </span>
                      </div>
                      <div className="p-1.5">
                        <Link
                          to="/profile"
                          onClick={() => setShowProfile(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link
                          to="/ai-recipes"
                          onClick={() => setShowProfile(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Settings className="w-4 h-4" /> AI Recipes
                        </Link>
                        <Link
                          to="/analytics"
                          onClick={() => setShowProfile(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <BarChart3 className="w-4 h-4" /> Analytics
                        </Link>
                        <Link
                          to="/recurring"
                          onClick={() => setShowProfile(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Repeat className="w-4 h-4" /> Recurring
                        </Link>
                        {userInfo.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowProfile(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobile(!showMobile)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {showMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/5 overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {filteredLinks.map(link => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setShowMobile(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
