import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Loader2,
  PlayCircle,
  Timer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../../components/Badges';
import { StatCard } from '../../components/StatCard';
import { deptAuthService } from '../../services/deptAuthService';
import { dispatchService } from '../../services/dispatchService';

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function DeptDashboardPage() {
  const user = deptAuthService.getUser();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatchService.getDeptReports(user.department).then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, [user.department]);

  const total      = reports.length;
  const pending    = reports.filter((r) => ['Submitted', 'Pending', 'Assigned'].includes(r.status)).length;
  const inProgress = reports.filter((r) => r.status === 'In Progress').length;
  const resolved   = reports.filter((r) => r.status === 'Resolved').length;
  const critical   = reports.filter((r) => r.priority === 'Critical').length;

  const recent = [...reports]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-[#2878D0]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#142B4A]">Department Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {user.department} · {user.name} · {user.role}
        </p>
      </div>

      {/* Note about dept isolation */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-xs text-amber-800">
        <strong>Scope:</strong> You can only view reports assigned to <strong>{user.department}</strong>.
        Cross-department access is blocked. Full backend authorization will be enforced in Part D.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-7">
        <StatCard label="Total Assigned" value={total}      icon={ClipboardList} color="blue"   />
        <StatCard label="Waiting"        value={pending}    icon={Timer}         color="orange" />
        <StatCard label="In Progress"    value={inProgress} icon={PlayCircle}    color="orange" />
        <StatCard label="Resolved"       value={resolved}   icon={CheckCircle}   color="blue"   />
        <StatCard label="Critical"       value={critical}   icon={AlertTriangle} color="red"    />
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-semibold text-[#142B4A] text-sm">Recent Assigned Reports</h2>
          <Link to="/dept/reports" className="text-xs text-[#2878D0] hover:underline font-medium">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No reports assigned to your department yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FB] text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-2.5 text-left font-medium">Report ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Category</th>
                  <th className="px-4 py-2.5 text-left font-medium">Priority</th>
                  <th className="px-4 py-2.5 text-left font-medium">Branch</th>
                  <th className="px-4 py-2.5 text-left font-medium">Submitted</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#142B4A]">{r.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{r.category}</td>
                    <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">{r.branch}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{fmt(r.submittedAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <Link to={`/dept/reports/${r.id}`} className="text-xs text-[#2878D0] hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
