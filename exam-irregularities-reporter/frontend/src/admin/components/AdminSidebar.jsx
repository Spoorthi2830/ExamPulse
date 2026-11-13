import {
  BarChart2,
  BookOpen,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Send,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard',         icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'All Reports',       icon: ClipboardList,   path: '/admin/reports' },
  { label: 'Categories',        icon: BookOpen,        path: '/admin/categories' },
  { label: 'Departments',       icon: Building2,       path: '/admin/departments' },
  { label: 'Analytics',         icon: BarChart2,       path: '/admin/analytics' },
  { label: 'Dispatch Mgmt',     icon: Send,            path: '/admin/dispatch' },
  { label: 'Scheduler Demo',    icon: Zap,             path: '/admin/scheduler' },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-52 shrink-0 bg-[#142B4A] text-white flex-col">
      <div className="h-14 flex items-center gap-2 px-5 border-b border-white/10">
        <ShieldCheck size={18} className="text-[#2878D0]" />
        <span className="font-bold text-sm">
          Exam<span className="text-[#4A9FE8]">Watch</span>
          <span className="ml-1.5 text-[10px] bg-[#2878D0] text-white px-1.5 py-0.5 rounded font-medium">
            ADMIN
          </span>
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active =
            location.pathname === path ||
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

      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Portal</p>
      </div>
    </aside>
  );
}
