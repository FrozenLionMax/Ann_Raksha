import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
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

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SocketManager from "./components/SocketManager";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  return (
    <BrowserRouter>
      <SocketManager />
      <div className="fixed bottom-6 right-6 z-[9999]">
        <DarkModeToggle />
      </div>
      <div className="App dark:bg-slate-900 transition-colors duration-500 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Map Explore Route */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <MapExplore />
            </ProtectedRoute>
          }
        />

        {/* Track Donation Route */}
        <Route
          path="/track/:id"
          element={
            <ProtectedRoute>
              <TrackDonation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-donation"
          element={
            <ProtectedRoute>
              <CreateDonation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-donations"
          element={
            <ProtectedRoute>
              <MyDonations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse-donations"
          element={
            <ProtectedRoute>
              <BrowseDonations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-recipes"
          element={
            <ProtectedRoute>
              <AiRecipes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/corporate-portal"
          element={
            <ProtectedRoute>
              <CorporatePortal />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;