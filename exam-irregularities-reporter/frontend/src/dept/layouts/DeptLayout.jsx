import { Navigate, Outlet } from 'react-router-dom';
import { deptAuthService } from '../../services/deptAuthService';
import { DeptHeader } from '../components/DeptHeader';
import { DeptSidebar } from '../components/DeptSidebar';

export function DeptLayout() {
  const user = deptAuthService.getUser();
  if (!user) return <Navigate to="/dept/login" replace />;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <DeptHeader user={user} />
      <div className="flex flex-1 overflow-hidden">
        <DeptSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
