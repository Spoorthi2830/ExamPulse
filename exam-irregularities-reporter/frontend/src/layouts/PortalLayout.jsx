import { Navigate, Outlet } from 'react-router-dom';
import { PortalHeader } from '../components/PortalHeader';
import { Sidebar } from '../components/Sidebar';
import { authService } from '../services/authService';

export function PortalLayout() {
  const user = authService.getUser();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <PortalHeader user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
