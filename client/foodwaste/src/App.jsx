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

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SocketManager from "./components/SocketManager";
import Navbar from "./components/Navbar";

function AppLayout() {
  const location = useLocation();
  const publicRoutes = ['/', '/login', '/register'];
  const showNavbar = !publicRoutes.includes(location.pathname);

  return (
    <>
      <SocketManager />
      {showNavbar && <Navbar />}
      <div className="App dark:bg-slate-900 transition-colors duration-500 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
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

          {/* Admin Route */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
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
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;