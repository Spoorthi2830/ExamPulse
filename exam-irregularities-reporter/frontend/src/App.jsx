import { Navigate, Route, Routes } from 'react-router-dom';
import { PortalLayout } from './layouts/PortalLayout';
import { PublicLayout } from './layouts/PublicLayout';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MyReportsPage from './pages/MyReportsPage';
import SubmitReportPage from './pages/SubmitReportPage';
import TrackReportPage from './pages/TrackReportPage';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected portal routes */}
      <Route element={<PortalLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/submit-report" element={<SubmitReportPage />} />
        <Route path="/my-reports" element={<MyReportsPage />} />
        <Route path="/track-report" element={<TrackReportPage />} />
        <Route path="/track-report/:id" element={<TrackReportPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
