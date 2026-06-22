import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import 'leaflet/dist/leaflet.css';

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateDonation from "./pages/CreateDonation";
import MyDonations from "./pages/MyDonations";
import BrowseDonations from "./pages/BrowseDonations";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AiRecipes from "./pages/AiRecipes";
import AdminDashboard from "./pages/AdminDashboard";
import MapExplore from "./pages/MapExplore";
import TrackDonation from "./pages/TrackDonation";
import CorporatePortal from "./pages/CorporatePortal";
import Leaderboard from "./pages/Leaderboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SocketManager from "./components/SocketManager";
import Navbar from "./components/Navbar";
import OnboardingTour from "./components/OnboardingTour";
import AIChatbot from "./components/AIChatbot";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { LanguageProvider } from "./components/i18n";

function AppLayout() {
  const location = useLocation();
  const publicRoutes = ['/', '/login', '/register'];
  const isPublic = publicRoutes.includes(location.pathname);

  return (
    <>
      <SocketManager />
      {!isPublic && <Navbar />}
      {!isPublic && <OnboardingTour />}
      {!isPublic && <AIChatbot />}
      <PWAInstallPrompt />
      <div className="App bg-slate-900 min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <AppLayout />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;