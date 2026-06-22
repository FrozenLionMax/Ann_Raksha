import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import 'leaflet/dist/leaflet.css';

// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary";

// Core components (always loaded)
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SocketManager from "./components/SocketManager";
import Navbar from "./components/Navbar";
import OnboardingTour from "./components/OnboardingTour";
import AIChatbot from "./components/AIChatbot";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PageTransition from "./components/PageTransition";
import { LanguageProvider } from "./components/i18n";
import { ThemeProvider } from "./components/ThemeToggle";

// #15 Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateDonation = lazy(() => import("./pages/CreateDonation"));
const MyDonations = lazy(() => import("./pages/MyDonations"));
const BrowseDonations = lazy(() => import("./pages/BrowseDonations"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AiRecipes = lazy(() => import("./pages/AiRecipes"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MapExplore = lazy(() => import("./pages/MapExplore"));
const TrackDonation = lazy(() => import("./pages/TrackDonation"));
const CorporatePortal = lazy(() => import("./pages/CorporatePortal"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const VolunteerDashboard = lazy(() => import("./pages/VolunteerDashboard"));
const RecurringDonations = lazy(() => import("./pages/RecurringDonations"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const publicRoutes = ['/', '/login', '/register'];
  const isPublic = publicRoutes.includes(location.pathname);

  return (
    <>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      <SocketManager />
      {!isPublic && <Navbar />}
      {!isPublic && <OnboardingTour />}
      {!isPublic && <AIChatbot />}
      <PWAInstallPrompt />

      <main id="main-content" className="App bg-slate-900 min-h-screen" role="main">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/explore" element={<ProtectedRoute><MapExplore /></ProtectedRoute>} />
                <Route path="/track/:id" element={<ProtectedRoute><TrackDonation /></ProtectedRoute>} />
                <Route path="/create-donation" element={<ProtectedRoute><CreateDonation /></ProtectedRoute>} />
                <Route path="/my-donations" element={<ProtectedRoute><MyDonations /></ProtectedRoute>} />
                <Route path="/browse-donations" element={<ProtectedRoute><BrowseDonations /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/ai-recipes" element={<ProtectedRoute><AiRecipes /></ProtectedRoute>} />
                <Route path="/corporate-portal" element={<ProtectedRoute><CorporatePortal /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="/volunteer" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
                <Route path="/recurring" element={<ProtectedRoute><RecurringDonations /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </main>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e293b', color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', backdropFilter: 'blur(12px)',
                  fontFamily: 'Inter, sans-serif',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
            <AppLayout />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;