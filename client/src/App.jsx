import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// ... other imports ...
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DetectPage from './pages/DetectPage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import SoilPage from './pages/SoilPage'; // Added SoilPage import
import RootPage from './pages/RootPage';
import FertilizerPage from './pages/FertilizerPage';
import MarketPage from './pages/MarketPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';
import HistoryPage from './pages/HistoryPage';
import ChatPage from './pages/ChatPage';
import BookingPage from './pages/BookingPage';
import MainLayout from './components/layout/MainLayout';
import { LanguageProvider } from './context/LanguageContext';


function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
