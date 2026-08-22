import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout & Guards
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import TripsPage from './pages/trips/TripsPage';
import ItineraryBuilderPage from './pages/trips/ItineraryBuilderPage';
import ItineraryViewPage from './pages/trips/ItineraryViewPage';
import TripComparePage from './pages/trips/TripComparePage';
import DiscoverPage from './pages/discover/DiscoverPage';
import BudgetPage from './pages/budget/BudgetPage';
import CalendarPage from './pages/calendar/CalendarPage';
import PublicSharePage from './pages/trips/PublicSharePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Public Route Guard (Redirect to dashboard if already logged in)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Animated Cinematic Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Public Share Itinerary Route (NO AUTH REQUIRED) */}
      <Route path="/share/:shareSlug" element={<PublicSharePage />} />

      {/* 3. Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      {/* 4. Protected App Routes with Persistent Floating Navbar Layout & Living Slideshow */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/compare" element={<TripComparePage />} />
          <Route path="/trips/:id" element={<ItineraryViewPage />} />
          <Route path="/trips/:id/builder" element={<ItineraryBuilderPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/itinerary" element={<TripsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
