import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../../components/Badges';
import { deptAuthService } from '../../services/deptAuthService';
import { dispatchService } from '../../services/dispatchService';

const PAGE_SIZE = 8;

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DeptReportsPage() {
  const user = deptAuthService.getUser();
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterPri, setFilterPri] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage]         = useState(1);

  const load = () => {
    dispatchService.getDeptReports(user.department).then((data) => {
      setReports(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.examName?.toLowerCase().includes(q);
    const matchPri    = !filterPri    || r.priority === filterPri;
    const matchStatus = !filterStatus || r.status   === filterStatus;
    return matchSearch && matchPri && matchStatus;
  });

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => { setSearch(''); setFilterPri(''); setFilterStatus(''); setPage(1); };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-[#2878D0]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#142B4A]">Assigned Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">{user.department} — {reports.length} total reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search ID, category, exam…"
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2878D0]"
          />
        </div>
        <select value={filterPri} onChange={(e) => { setFilterPri(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2878D0] bg-white">
          <option value="">All Priorities</option>
          <option>Critical</option><option>High</option><option>Medium</option>
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2878D0] bg-white">
          <option value="">All Statuses</option>
          <option>Submitted</option><option>Pending</option><option>Assigned</option>
          <option>In Progress</option><option>Resolved</option>
        </select>
        {(search || filterPri || filterStatus) && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition">
            <X size={13} /> Clear
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {slice.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">No reports match your filters.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F7FB] text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-2.5 text-left font-medium">Report ID</th>
                    <th className="px-4 py-2.5 text-left font-medium">Category</th>
                    <th className="px-4 py-2.5 text-left font-medium">Priority</th>
                    <th className="px-4 py-2.5 text-left font-medium">Branch</th>
                    <th className="px-4 py-2.5 text-left font-medium">Hall</th>
                    <th className="px-4 py-2.5 text-left font-medium">Invigilator</th>
                    <th className="px-4 py-2.5 text-left font-medium">Submitted</th>
                    <th className="px-4 py-2.5 text-left font-medium">Status</th>
                    <th className="px-4 py-2.5 text-left font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {slice.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-[#142B4A]">{r.id}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{r.category}</td>
                      <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-700">{r.branch}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{r.hall} / {r.roomNumber}</td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-600">{r.invId}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmt(r.submittedAt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3">
                        <Link to={`/dept/reports/${r.id}`} className="text-xs text-[#2878D0] hover:underline font-medium">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Page {page} of {pages}</span>
                <div className="flex gap-1">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded text-xs font-medium transition ${
                        p === page ? 'bg-[#2878D0] text-white' : 'text-gray-500 hover:bg-gray-100'
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
