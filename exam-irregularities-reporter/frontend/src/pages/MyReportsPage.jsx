import { ChevronRight, Eye, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import { reportService } from '../services/reportService';

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getAll().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <Link to="/dashboard" className="hover:text-[#2878D0] font-medium transition">Dashboard</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-[#142B4A] font-semibold">My Reports</span>
      </nav>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#142B4A]">My Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">All irregularity reports submitted by you.</p>
        </div>
        <Link
          to="/submit-report"
          className="inline-flex items-center gap-2 bg-[#2878D0] hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          <FileText size={16} />
          New Report
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading reports…</div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No reports submitted yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FB] text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3">Report ID</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Examination</th>
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-left px-6 py-3">Priority</th>
                  <th className="text-left px-6 py-3">Department</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5F7FB] transition">
                    <td className="px-6 py-3 font-mono text-xs text-[#2878D0] font-medium whitespace-nowrap">
                      {r.id}
                    </td>
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{r.examDate}</td>
                    <td className="px-6 py-3 text-gray-700 max-w-[160px] truncate">{r.examName}</td>
                    <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{r.category}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <PriorityBadge priority={r.priority} />
                    </td>
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                      {r.department || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        to={`/track-report/${r.id}`}
                        className="inline-flex items-center gap-1 text-[#2878D0] hover:underline text-xs font-medium"
                      >
                        <Eye size={13} /> View
                      </Link>
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
