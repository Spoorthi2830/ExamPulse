import { Navigate, Outlet } from 'react-router-dom';
import { AdminHeader } from '../components/AdminHeader';
import { AdminSidebar } from '../components/AdminSidebar';
import { adminAuthService } from '../services/adminAuthService';

export function AdminLayout() {
  const user = adminAuthService.getUser();
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <AdminHeader user={user} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
