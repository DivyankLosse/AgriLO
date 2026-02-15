import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { LanguageProvider } from './context/LanguageContext';

// Eagerly load critical pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

// Lazy load feature pages
const DetectPage = lazy(() => import('./pages/DetectPage'));
const AnalysisResultPage = lazy(() => import('./pages/AnalysisResultPage'));
const SoilPage = lazy(() => import('./pages/SoilPage'));
const RootPage = lazy(() => import('./pages/RootPage'));
const FertilizerPage = lazy(() => import('./pages/FertilizerPage'));
const MarketPage = lazy(() => import('./pages/MarketPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

// Simple Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected Routes (Layout applied) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/soil" element={<SoilPage />} />
                  <Route path="/detect" element={<DetectPage />} />
                  <Route path="/analysis/result" element={<AnalysisResultPage />} />
                  <Route path="/root" element={<RootPage />} />
                  <Route path="/fertilizer" element={<FertilizerPage />} />
                  <Route path="/market" element={<MarketPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/book-test" element={<BookingPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
