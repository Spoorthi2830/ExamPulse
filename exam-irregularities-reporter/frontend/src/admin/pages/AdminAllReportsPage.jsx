import { Eye, Filter, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DispatchBadge, PriorityBadge, StatusBadge } from '../../components/Badges';
import { reportService } from '../../services/reportService';

const PAGE_SIZE = 8;

const EMPTY_FILTERS = {
  search: '', branch: '', category: '', priority: '',
  status: '', dispatchStatus: '', department: '', examDate: '',
};

export default function AdminAllReportsPage() {
  const [reports, setReports]   = useState([]);
  const [filters, setFilters]   = useState(EMPTY_FILTERS);
  const [page, setPage]         = useState(1);

  useEffect(() => { reportService.getAll().then(setReports); }, []);

  const setFilter = (key) => (e) => {
    setFilters((f) => ({ ...f, [key]: e.target.value }));
    setPage(1);
  };

  const clearFilters = () => { setFilters(EMPTY_FILTERS); setPage(1); };

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return reports.filter((r) => {
      if (q && !r.id.toLowerCase().includes(q) && !r.examName.toLowerCase().includes(q)) return false;
      if (filters.branch     && r.branch         !== filters.branch)         return false;
      if (filters.category   && r.category        !== filters.category)       return false;
      if (filters.priority   && r.priority        !== filters.priority)       return false;
      if (filters.status     && r.status          !== filters.status)         return false;
      if (filters.dispatchStatus && r.dispatchStatus !== filters.dispatchStatus) return false;
      if (filters.department && r.department      !== filters.department)     return false;
      if (filters.examDate   && r.examDate        !== filters.examDate)       return false;
      return true;
    });
  }, [reports, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const departments = [...new Set(reports.map((r) => r.department).filter(Boolean))];
  const activeFilters = Object.values(filters).some(Boolean);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#142B4A]">All Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {filtered.length} of {reports.length} reports
        </p>
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Report ID or Exam Name…"
              value={filters.search}
              onChange={setFilter('search')}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2878D0] focus:border-transparent"
            />
          </div>

          <FilterSelect label="Branch"     value={filters.branch}         onChange={setFilter('branch')}
            options={['CSE','ECE','CIVL','ME','EEE','ISE']} />
          <FilterSelect label="Category"   value={filters.category}       onChange={setFilter('category')}
            options={['Malpractice','Medical','Technical','Disturbance','Missing Script']} />
          <FilterSelect label="Priority"   value={filters.priority}       onChange={setFilter('priority')}
            options={['Critical','High','Medium']} />
          <FilterSelect label="Status"     value={filters.status}         onChange={setFilter('status')}
            options={['Submitted','Pending','Assigned','In Progress','Resolved']} />
          <FilterSelect label="Dispatch"   value={filters.dispatchStatus} onChange={setFilter('dispatchStatus')}
            options={['Dispatched','Pending']} />
          <FilterSelect label="Department" value={filters.department}     onChange={setFilter('department')}
            options={departments} />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Date</label>
            <input type="date" value={filters.examDate} onChange={setFilter('examDate')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2878D0] focus:border-transparent" />
          </div>

          {activeFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-2 transition">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center">
            <Filter size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">No reports match the current filters.</p>
            {activeFilters && (
              <button onClick={clearFilters} className="mt-3 text-[#2878D0] text-sm hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FB] text-gray-500 text-xs uppercase tracking-wide">
                  {['Report ID','Exam Name','Date','Branch','Category','Priority',
                    'Hall','Room','Time','Department','Submitted','Status','Dispatch','Action']
                    .map((h) => <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5F7FB] transition">
                    <td className="px-4 py-3 font-mono text-xs text-[#2878D0] font-medium whitespace-nowrap">{r.id}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-[150px] truncate">{r.examName}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.examDate}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.branch || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge priority={r.priority} /></td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.hall}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.roomNumber}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.incidentTime}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap max-w-[130px] truncate">{r.department || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><DispatchBadge status={r.dispatchStatus} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} · {filtered.length} results
            </p>
            <div className="flex gap-1">
              <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PageBtn key={n} active={n === page} onClick={() => setPage(n)}>{n}</PageBtn>
              ))}
              <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next ›</PageBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <select value={value} onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2878D0] focus:border-transparent bg-white min-w-[110px]">
        <option value="">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function PageBtn({ children, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
        active
          ? 'bg-[#2878D0] text-white'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100'
      }`}>
      {children}
    </button>
  );
}
