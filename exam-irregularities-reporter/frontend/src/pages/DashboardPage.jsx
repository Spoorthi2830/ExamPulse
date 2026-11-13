import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  FileText,
  Info,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import { StatCard } from '../components/StatCard';
import { authService } from '../services/authService';
import { reportService } from '../services/reportService';

export default function DashboardPage() {
  const user = authService.getUser();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    reportService.getAll().then(setReports);
  }, []);

  const stats = {
    total: reports.length,
    critical: reports.filter((r) => r.priority === 'Critical').length,
    high: reports.filter((r) => r.priority === 'High').length,
    medium: reports.filter((r) => r.priority === 'Medium').length,
  };

  const recent = reports.slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#142B4A]">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {user?.invId} · {user?.department}
          </p>
        </div>
        <Link
          to="/submit-report"
          className="inline-flex items-center gap-2 bg-[#2878D0] hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          <FileText size={16} />
          Submit New Report
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Reports" value={stats.total} icon={ClipboardList} color="blue" />
        <StatCard label="Critical" value={stats.critical} icon={AlertTriangle} color="red" />
        <StatCard label="High Priority" value={stats.high} icon={AlertTriangle} color="orange" />
        <StatCard label="Medium Priority" value={stats.medium} icon={Info} color="purple" />
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#142B4A]">Recent Reports</h2>
          <Link
            to="/my-reports"
            className="text-sm text-[#2878D0] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F7FB] text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-3">Report ID</th>
                <th className="text-left px-6 py-3">Exam</th>
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-left px-6 py-3">Priority</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recent.map((r) => (
                <tr key={r.id} className="hover:bg-[#F5F7FB] transition">
                  <td className="px-6 py-3 font-mono text-xs text-[#2878D0] font-medium">{r.id}</td>
                  <td className="px-6 py-3 text-gray-700 max-w-[180px] truncate">{r.examName}</td>
                  <td className="px-6 py-3 text-gray-600">{r.category}</td>
                  <td className="px-6 py-3"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-6 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-3 text-gray-500">{r.examDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
