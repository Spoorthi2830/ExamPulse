import {
  BarChart2,
  BookOpen,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../services/adminAuthService';

const NAV_LINKS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'All Reports', icon: ClipboardList, to: '/admin/reports' },
  { label: 'Categories', icon: BookOpen, to: '/admin/categories' },
  { label: 'Departments', icon: Building2, to: '/admin/departments' },
  { label: 'Analytics', icon: BarChart2, to: '/admin/analytics' },
];

export function AdminHeader({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 md:px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2 font-bold text-base shrink-0">
          <ShieldCheck size={20} className="text-[#2878D0]" />
          <span className="text-[#142B4A]">
            Exam<span className="text-[#2878D0]">Watch</span>
          </span>
          <span className="text-[10px] bg-[#142B4A] text-white px-1.5 py-0.5 rounded font-medium">
            ADMIN
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
          {NAV_LINKS.map(({ label, to }) => {
            const active = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-[#E9F2FC] text-[#2878D0]'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-[#142B4A]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user && (
            <div className="flex items-center gap-2 bg-[#F5F7FB] border border-gray-200 rounded-lg px-3 py-1.5">
              <User size={14} className="text-[#2878D0]" />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#142B4A]">{user.adminId}</p>
                <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600
              border border-red-200 text-sm font-medium px-3 py-1.5 rounded-lg transition"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        <button
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1 shadow-md">
          {NAV_LINKS.map(({ label, icon: Icon, to }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-[#E9F2FC] text-[#2878D0]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 mt-1 border-t border-gray-100 pt-3">
              <User size={14} className="text-[#2878D0]" />
              <div>
                <p className="text-xs font-semibold text-[#142B4A]">{user.adminId}</p>
                <p className="text-[10px] text-gray-400">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-1"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
