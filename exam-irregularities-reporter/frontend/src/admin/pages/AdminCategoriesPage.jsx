import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Eye,
  FileSearch,
  HeartPulse,
  Monitor,
  Volume2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../../components/Badges';
import { reportService } from '../../services/reportService';

const CATEGORY_META = [
  { name: 'Malpractice',     icon: AlertTriangle, color: 'text-red-500 bg-red-50 border-red-100' },
  { name: 'Medical',         icon: HeartPulse,    color: 'text-pink-500 bg-pink-50 border-pink-100' },
  { name: 'Technical',       icon: Monitor,       color: 'text-blue-500 bg-blue-50 border-blue-100' },
  { name: 'Disturbance',     icon: Volume2,       color: 'text-orange-500 bg-orange-50 border-orange-100' },
  { name: 'Missing Script',  icon: FileSearch,    color: 'text-purple-500 bg-purple-50 border-purple-100' },
];

export default function AdminCategoriesPage() {
  const [reports, setReports] = useState([]);
  const [open, setOpen]       = useState({});

  useEffect(() => { reportService.getAll().then(setReports); }, []);

  const toggle = (cat) => setOpen((o) => ({ ...o, [cat]: !o[cat] }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#142B4A]">Category-wise Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Reports grouped by the five irregularity categories.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-7">
        {CATEGORY_META.map(({ name, icon: Icon, color }) => {
          const count = reports.filter((r) => r.category === name).length;
          return (
            <button key={name} onClick={() => toggle(name)}
              className={`border rounded-xl p-4 text-left hover:shadow-md transition ${color}`}>
              <Icon size={20} className="mb-2" />
              <p className="text-2xl font-bold text-[#142B4A]">{count}</p>
              <p className="text-xs font-medium text-gray-600 mt-0.5">{name}</p>
            </button>
          );
        })}
      </div>

      {/* Expandable sections */}
      <div className="space-y-4">
        {CATEGORY_META.map(({ name, icon: Icon, color }) => {
          const catReports = reports.filter((r) => r.category === name);
          const isOpen = open[name];
          return (
            <div key={name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggle(name)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F5F7FB] transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="font-semibold text-[#142B4A] text-sm">{name}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {catReports.length} report{catReports.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>

              {isOpen && (
                <div className="border-t border-gray-100">
                  {catReports.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">No reports in this category.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#F5F7FB] text-gray-500 text-xs uppercase tracking-wide">
                            <th className="text-left px-5 py-2.5">Report ID</th>
                            <th className="text-left px-5 py-2.5">Exam</th>
                            <th className="text-left px-5 py-2.5">Date</th>
                            <th className="text-left px-5 py-2.5">Branch</th>
                            <th className="text-left px-5 py-2.5">Priority</th>
                            <th className="text-left px-5 py-2.5">Status</th>
                            <th className="text-left px-5 py-2.5">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {catReports.map((r) => (
                            <tr key={r.id} className="hover:bg-[#F5F7FB] transition">
                              <td className="px-5 py-2.5 font-mono text-xs text-[#2878D0] font-medium">{r.id}</td>
                              <td className="px-5 py-2.5 text-gray-700 max-w-[180px] truncate">{r.examName}</td>
                              <td className="px-5 py-2.5 text-gray-500 whitespace-nowrap">{r.examDate}</td>
                              <td className="px-5 py-2.5 text-gray-600">{r.branch || '—'}</td>
                              <td className="px-5 py-2.5"><PriorityBadge priority={r.priority} /></td>
                              <td className="px-5 py-2.5"><StatusBadge status={r.status} /></td>
                              <td className="px-5 py-2.5">
                                <Link to={`/admin/reports/${r.id}`}
                                  className="inline-flex items-center gap-1 text-[#2878D0] hover:underline text-xs font-medium">
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
