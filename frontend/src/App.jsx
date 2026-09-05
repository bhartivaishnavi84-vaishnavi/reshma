import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewTextPage from './pages/InterviewTextPage';
import InterviewVoicePage from './pages/InterviewVoicePage';
import ResultsPage from './pages/ResultsPage';
import PersonalizedPlanPage from './pages/PersonalizedPlanPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import PerformanceDashboardPage from './pages/PerformanceDashboardPage';
import ProfilePage from './pages/ProfilePage';
import ResumeUploadPage from './pages/ResumeUploadPage';

import './theme.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InterviewProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/interview/setup" element={<ProtectedRoute><InterviewSetupPage /></ProtectedRoute>} />
                <Route path="/interview/text" element={<ProtectedRoute><InterviewTextPage /></ProtectedRoute>} />
                <Route path="/interview/voice" element={<ProtectedRoute><InterviewVoicePage /></ProtectedRoute>} />
                <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
                <Route path="/plan" element={<ProtectedRoute><PersonalizedPlanPage /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><InterviewHistoryPage /></ProtectedRoute>} />
                <Route path="/performance" element={<ProtectedRoute><PerformanceDashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/resume" element={<ProtectedRoute><ResumeUploadPage /></ProtectedRoute>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </InterviewProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
