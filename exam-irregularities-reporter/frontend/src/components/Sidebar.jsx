import {
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  Search,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Submit Report', icon: FileText, path: '/submit-report' },
  { label: 'My Reports', icon: ClipboardList, path: '/my-reports' },
  { label: 'Track Report', icon: Search, path: '/track-report' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-52 shrink-0 bg-[#142B4A] text-white flex-col">
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          // "Home" is active only on exact "/", all others match their path
          const active =
            path === '/'
              ? location.pathname === '/'
              : location.pathname === path ||
                location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                active
                  ? 'bg-[#2878D0] text-white font-medium'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom label */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Invigilator Portal</p>
      </div>
    </aside>
  );
}
