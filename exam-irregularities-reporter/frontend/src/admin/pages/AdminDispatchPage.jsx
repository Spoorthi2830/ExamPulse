import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  Info,
  Loader2,
  PlayCircle,
  RefreshCw,
  Send,
  Timer,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { PriorityBadge, StatusBadge } from '../../components/Badges';
import { StatCard } from '../../components/StatCard';
import { dispatchService } from '../../services/dispatchService';

const PAGE_SIZE = 6;

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function waitDuration(iso) {
  if (!iso) return '—';
  const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function PriorityDot({ priority }) {
  const colors = { Critical: 'bg-red-500', High: 'bg-orange-400', Medium: 'bg-blue-400' };
  return <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${colors[priority] ?? 'bg-gray-400'}`} />;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-xs font-medium text-[#142B4A] text-right">{value || '—'}</span>
    </div>
  );
}

export default function AdminDispatchPage() {
  const [queue, setQueue] = useState({ processing: null, waiting: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [histPage, setHistPage] = useState(1);
  const [histSearch, setHistSearch] = useState('');
  const [histFilter, setHistFilter] = useState('');

  const load = useCallback(async () => {
    const data = await dispatchService.getQueue();
    setQueue(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleProcessNext = async () => {
    setAdvancing(true);
    await dispatchService.processNext();
    await load();
    setAdvancing(false);
  };

  const { processing, waiting, history } = queue;

  const critical = waiting.filter((r) => r.priority === 'Critical').length;
  const high     = waiting.filter((r) => r.priority === 'High').length;
  const medium   = waiting.filter((r) => r.priority === 'Medium').length;

  // Filtered history
  const filteredHist = history.filter((r) => {
    const q = histSearch.toLowerCase();
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
    const matchFilter = !histFilter || r.priority === histFilter;
    return matchSearch && matchFilter;
  });
  const histPages = Math.max(1, Math.ceil(filteredHist.length / PAGE_SIZE));
  const histSlice = filteredHist.slice((histPage - 1) * PAGE_SIZE, histPage * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-[#2878D0]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#142B4A]">Dispatch Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Non-preemptive priority queue — Critical &gt; High &gt; Medium, FIFO within same priority.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#142B4A] border border-gray-200 px-3 py-1.5 rounded-lg transition"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={handleProcessNext}
            disabled={advancing || (waiting.length === 0 && !processing)}
            className="flex items-center gap-1.5 text-sm bg-[#2878D0] hover:bg-[#1a5faa] disabled:opacity-50
              text-white font-semibold px-4 py-1.5 rounded-lg transition"
          >
            {advancing ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
            {processing ? 'Complete & Next' : 'Start Next'}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-7">
        <StatCard label="In Queue"       value={waiting.length}  icon={Timer}         color="blue"   />
        <StatCard label="Critical"       value={critical}        icon={AlertTriangle} color="red"    />
        <StatCard label="High"           value={high}            icon={AlertTriangle} color="orange" />
        <StatCard label="Medium"         value={medium}          icon={Info}          color="purple" />
        <StatCard label="Processing"     value={processing ? 1 : 0} icon={PlayCircle} color="orange" />
        <StatCard label="Completed"      value={history.length}  icon={CheckCircle}   color="blue"   />
      </div>

      {/* Currently Processing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
          <PlayCircle size={16} className="text-[#2878D0]" />
          <h2 className="font-semibold text-[#142B4A] text-sm">Currently Processing</h2>
          {processing && (
            <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium animate-pulse">
              LIVE
            </span>
          )}
        </div>
        {processing ? (
          <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <p className="text-xs text-gray-400 mb-1">Report ID</p>
              <p className="font-mono font-bold text-[#142B4A] text-sm">{processing.id}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <PriorityBadge priority={processing.priority} />
                <StatusBadge status={processing.status} />
              </div>
            </div>
            <div>
              <InfoRow label="Category"   value={processing.category} />
              <InfoRow label="Department" value={processing.department} />
              <InfoRow label="Branch"     value={processing.branch} />
            </div>
            <div>
              <InfoRow label="Hall"       value={`${processing.hall} / ${processing.roomNumber}`} />
              <InfoRow label="Submitted"  value={fmt(processing.submittedAt)} />
              <InfoRow label="Started"    value={fmt(processing.processingStartedAt)} />
            </div>
            <div>
              <InfoRow label="Invigilator" value={processing.invId} />
              <InfoRow label="Exam"        value={processing.examName} />
              <InfoRow label="Session"     value={processing.session} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-5 py-8 text-gray-400">
            <Clock size={20} />
            <span className="text-sm">No report is currently being processed. Click "Start Next" to begin.</span>
          </div>
        )}
      </div>

      {/* Waiting Queue */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
          <Timer size={16} className="text-[#2878D0]" />
          <h2 className="font-semibold text-[#142B4A] text-sm">Waiting Queue</h2>
          <span className="ml-1 text-xs bg-[#E9F2FC] text-[#2878D0] px-2 py-0.5 rounded-full font-medium">
            {waiting.length} reports
          </span>
          <span className="ml-auto text-xs text-gray-400">Sorted by priority → FIFO</span>
        </div>
        {waiting.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">Queue is empty.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FB] text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-2.5 text-left font-medium">#</th>
                  <th className="px-4 py-2.5 text-left font-medium">Report ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Category</th>
                  <th className="px-4 py-2.5 text-left font-medium">Priority</th>
                  <th className="px-4 py-2.5 text-left font-medium">Department</th>
                  <th className="px-4 py-2.5 text-left font-medium">Branch</th>
                  <th className="px-4 py-2.5 text-left font-medium">Submitted</th>
                  <th className="px-4 py-2.5 text-left font-medium">Waiting</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {waiting.map((r, i) => (
                  <tr key={r.id} className={`hover:bg-gray-50 transition ${i === 0 ? 'bg-orange-50/40' : ''}`}>
                    <td className="px-4 py-3 font-bold text-gray-400 text-xs">
                      {i === 0 ? (
                        <span className="text-[#2878D0] font-bold">NEXT</span>
                      ) : i + 1}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#142B4A]">{r.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{r.category}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center">
                        <PriorityDot priority={r.priority} />
                        <PriorityBadge priority={r.priority} />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{r.department}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">{r.branch}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{fmt(r.submittedAt)}</td>
                    <td className="px-4 py-3 text-xs text-orange-600 font-medium">{waitDuration(r.submittedAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dispatch History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 flex-wrap gap-y-2">
          <Send size={16} className="text-[#2878D0]" />
          <h2 className="font-semibold text-[#142B4A] text-sm">Dispatch History</h2>
          <div className="ml-auto flex gap-2 flex-wrap">
            <input
              value={histSearch}
              onChange={(e) => { setHistSearch(e.target.value); setHistPage(1); }}
              placeholder="Search ID / category…"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2878D0] w-44"
            />
            <select
              value={histFilter}
              onChange={(e) => { setHistFilter(e.target.value); setHistPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2878D0] bg-white"
            >
              <option value="">All Priorities</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </div>
        </div>
        {histSlice.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No completed dispatches yet.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F7FB] text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-2.5 text-left font-medium">Report ID</th>
                    <th className="px-4 py-2.5 text-left font-medium">Category</th>
                    <th className="px-4 py-2.5 text-left font-medium">Department</th>
                    <th className="px-4 py-2.5 text-left font-medium">Priority</th>
                    <th className="px-4 py-2.5 text-left font-medium">Branch</th>
                    <th className="px-4 py-2.5 text-left font-medium">Submitted</th>
                    <th className="px-4 py-2.5 text-left font-medium">Completed</th>
                    <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {histSlice.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-[#142B4A]">{r.id}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{r.category}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{r.department}</td>
                      <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-700">{r.branch}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmt(r.submittedAt)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmt(r.completedAt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {histPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {filteredHist.length} records · Page {histPage} of {histPages}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: histPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setHistPage(p)}
                      className={`w-7 h-7 rounded text-xs font-medium transition ${
                        p === histPage ? 'bg-[#2878D0] text-white' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
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
