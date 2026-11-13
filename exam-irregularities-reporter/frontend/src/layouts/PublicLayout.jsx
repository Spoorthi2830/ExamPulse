import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <PublicNavbar />
      <Outlet />
    </div>
  );
}
