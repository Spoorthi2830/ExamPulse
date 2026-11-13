import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './admin/layouts/AdminLayout';
import AdminAllReportsPage from './admin/pages/AdminAllReportsPage';
import AdminAnalyticsPage from './admin/pages/AdminAnalyticsPage';
import AdminCategoriesPage from './admin/pages/AdminCategoriesPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminDepartmentsPage from './admin/pages/AdminDepartmentsPage';
import AdminDispatchPage from './admin/pages/AdminDispatchPage';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminReportDetailPage from './admin/pages/AdminReportDetailPage';
import SchedulingVisualizerPage from './admin/pages/SchedulingVisualizerPage';
import { DeptLayout } from './dept/layouts/DeptLayout';
import DeptDashboardPage from './dept/pages/DeptDashboardPage';
import DeptLoginPage from './dept/pages/DeptLoginPage';
import DeptReportDetailPage from './dept/pages/DeptReportDetailPage';
import DeptReportsPage from './dept/pages/DeptReportsPage';
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
      {/* ── Public routes ── */}
      <Route element={<PublicLayout />}>
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ── Invigilator portal (protected) ── */}
      <Route element={<PortalLayout />}>
        <Route path="/dashboard"          element={<DashboardPage />} />
        <Route path="/submit-report"      element={<SubmitReportPage />} />
        <Route path="/my-reports"         element={<MyReportsPage />} />
        <Route path="/track-report"       element={<TrackReportPage />} />
        <Route path="/track-report/:id"   element={<TrackReportPage />} />
      </Route>

      {/* ── Admin portal ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard"    element={<AdminDashboardPage />} />
        <Route path="/admin/reports"      element={<AdminAllReportsPage />} />
        <Route path="/admin/reports/:id"  element={<AdminReportDetailPage />} />
        <Route path="/admin/categories"   element={<AdminCategoriesPage />} />
        <Route path="/admin/departments"  element={<AdminDepartmentsPage />} />
        <Route path="/admin/analytics"    element={<AdminAnalyticsPage />} />
        <Route path="/admin/dispatch"     element={<AdminDispatchPage />} />
        <Route path="/admin/scheduler"    element={<SchedulingVisualizerPage />} />
      </Route>

      {/* ── Department staff portal ── */}
      <Route path="/dept/login" element={<DeptLoginPage />} />
      <Route element={<DeptLayout />}>
        <Route path="/dept/dashboard"         element={<DeptDashboardPage />} />
        <Route path="/dept/reports"           element={<DeptReportsPage />} />
        <Route path="/dept/reports/:id"       element={<DeptReportDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
