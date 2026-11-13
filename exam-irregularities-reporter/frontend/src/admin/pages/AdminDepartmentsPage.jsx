import { Building2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../../components/Badges';
import { reportService } from '../../services/reportService';

function StatPill({ label, value, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    orange: 'bg-orange-50 text-orange-700',
    green:  'bg-green-50 text-green-700',
  };
  return (
    <div className={`rounded-lg px-3 py-1.5 text-center ${colors[color]}`}>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}

export default function AdminDepartmentsPage() {
  const [reports, setReports] = useState([]);
  const [open, setOpen]       = useState({});

  useEffect(() => { reportService.getAll().then(setReports); }, []);

  const toggle = (dept) => setOpen((o) => ({ ...o, [dept]: !o[dept] }));

  // Group by department
  const departments = [...new Set(reports.map((r) => r.department).filter(Boolean))].sort();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#142B4A]">Department Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Reports grouped by assigned department.
          <span className="ml-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
            Department mapping is placeholder — will be configured in Part C
          </span>
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {departments.map((dept) => {
          const dReports = reports.filter((r) => r.department === dept);
          return (
            <button key={dept} onClick={() => toggle(dept)}
              className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-[#2878D0]" />
                <span className="text-xs font-semibold text-[#142B4A] leading-tight">{dept}</span>
              </div>
              <p className="text-2xl font-bold text-[#142B4A]">{dReports.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">total reports</p>
            </button>
          );
        })}
      </div>

      {/* Expandable department sections */}
      <div className="space-y-4">
        {departments.map((dept) => {
          const dReports = reports.filter((r) => r.department === dept);
          const pending    = dReports.filter((r) => ['Submitted', 'Pending'].includes(r.status)).length;
          const inProgress = dReports.filter((r) => r.status === 'In Progress').length;
          const resolved   = dReports.filter((r) => r.status === 'Resolved').length;
          const isOpen = open[dept];

          return (
            <div key={dept} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button onClick={() => toggle(dept)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F5F7FB] transition">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#2878D0]" />
                    <span className="font-semibold text-[#142B4A] text-sm">{dept}</span>
                  </div>
                  <div className="flex gap-2">
                    <StatPill label="Total"       value={dReports.length} color="blue"   />
                    <StatPill label="Pending"     value={pending}         color="yellow" />
                    <StatPill label="In Progress" value={inProgress}      color="orange" />
                    <StatPill label="Resolved"    value={resolved}        color="green"  />
                  </div>
                </div>
                {isOpen
                  ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                  : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
              </button>

              {isOpen && (
                <div className="border-t border-gray-100">
                  {dReports.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">No reports assigned.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#F5F7FB] text-gray-500 text-xs uppercase tracking-wide">
                            <th className="text-left px-5 py-2.5">Report ID</th>
                            <th className="text-left px-5 py-2.5">Exam</th>
                            <th className="text-left px-5 py-2.5">Branch</th>
                            <th className="text-left px-5 py-2.5">Category</th>
                            <th className="text-left px-5 py-2.5">Priority</th>
                            <th className="text-left px-5 py-2.5">Status</th>
                            <th className="text-left px-5 py-2.5">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {dReports.map((r) => (
                            <tr key={r.id} className="hover:bg-[#F5F7FB] transition">
                              <td className="px-5 py-2.5 font-mono text-xs text-[#2878D0] font-medium">{r.id}</td>
                              <td className="px-5 py-2.5 text-gray-700 max-w-[180px] truncate">{r.examName}</td>
                              <td className="px-5 py-2.5 text-gray-600">{r.branch || '—'}</td>
                              <td className="px-5 py-2.5 text-gray-600">{r.category}</td>
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
