import {
  ChevronRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const NAV_LINKS = [
  { label: 'Home', icon: Home, to: '/', external: true },
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'My Reports', icon: ClipboardList, to: '/my-reports' },
];

// Breadcrumb config keyed by pathname
const BREADCRUMBS = {
  '/dashboard': [{ label: 'Dashboard' }],
  '/submit-report': [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Submit Report' },
  ],
  '/my-reports': [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'My Reports' },
  ],
  '/track-report': [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'My Reports', to: '/my-reports' },
    { label: 'Track Report' },
  ],
};

function getBreadcrumbs(pathname) {
  // Handle /track-report/:id
  if (pathname.startsWith('/track-report/')) {
    return [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'My Reports', to: '/my-reports' },
      { label: 'Track Report' },
    ];
  }
  return BREADCRUMBS[pathname] || [];
}

export function PortalHeader({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 md:px-6 h-14 flex items-center justify-between gap-4">

        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-base shrink-0 text-[#142B4A] hover:opacity-80 transition"
        >
          <ShieldCheck size={20} className="text-[#2878D0]" />
          <span>Exam<span className="text-[#2878D0]">Watch</span></span>
        </Link>

        {/* Center: Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
          {NAV_LINKS.map(({ label, icon: Icon, to }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-[#E9F2FC] text-[#2878D0]'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-[#142B4A]'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: User chip + Logout */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user && (
            <div className="flex items-center gap-2 bg-[#F5F7FB] border border-gray-200 rounded-lg px-3 py-1.5">
              <User size={14} className="text-[#2878D0]" />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#142B4A]">{user.invId}</p>
                <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{user.department}</p>
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-700 transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Breadcrumbs bar — only when there are crumbs */}
      {breadcrumbs.length > 1 && (
        <div className="hidden md:flex items-center gap-1.5 px-6 py-1.5 bg-[#F5F7FB] border-t border-gray-100 text-xs text-gray-500">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-[#2878D0] transition font-medium">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#142B4A] font-semibold">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Mobile dropdown menu */}
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
                  active
                    ? 'bg-[#E9F2FC] text-[#2878D0]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}

          {/* Mobile user info */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 mt-1 border-t border-gray-100 pt-3">
              <User size={14} className="text-[#2878D0]" />
              <div>
                <p className="text-xs font-semibold text-[#142B4A]">{user.invId}</p>
                <p className="text-[10px] text-gray-400">{user.department}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
              text-red-600 hover:bg-red-50 transition mt-1"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
