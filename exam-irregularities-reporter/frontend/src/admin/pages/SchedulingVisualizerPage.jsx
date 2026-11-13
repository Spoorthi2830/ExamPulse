import {
  AlertTriangle,
  ChevronRight,
  Info,
  Loader2,
  PlayCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PriorityBadge } from '../../components/Badges';

// ── Demo scenario ─────────────────────────────────────────────────────────────
// Carefully crafted to show:
//  1. Reports arriving at different times with different priorities
//  2. FIFO ordering for equal priorities
//  3. A Critical report arriving mid-processing and jumping the queue
//  4. Non-preemptive: current report is never interrupted

const DEMO_REPORTS = [
  { id: 'EW-VIZ-001', category: 'Technical',      priority: 'Medium',   branch: 'CSE', department: 'Technical Support',      submittedAt: '2024-11-20T09:00:00Z', examName: 'Data Structures' },
  { id: 'EW-VIZ-002', category: 'Disturbance',    priority: 'Medium',   branch: 'ECE', department: 'Security Department',    submittedAt: '2024-11-20T09:02:00Z', examName: 'Circuit Theory' },
  { id: 'EW-VIZ-003', category: 'Medical',        priority: 'High',     branch: 'ME',  department: 'Medical Support',        submittedAt: '2024-11-20T09:04:00Z', examName: 'Thermodynamics' },
  { id: 'EW-VIZ-004', category: 'Missing Script', priority: 'High',     branch: 'ISE', department: 'Examination Section',    submittedAt: '2024-11-20T09:06:00Z', examName: 'Software Eng.' },
  { id: 'EW-VIZ-005', category: 'Malpractice',    priority: 'Critical', branch: 'EEE', department: 'Examination Discipline', submittedAt: '2024-11-20T09:10:00Z', examName: 'Power Systems' },
  { id: 'EW-VIZ-006', category: 'Technical',      priority: 'Medium',   branch: 'CIVL',department: 'Technical Support',      submittedAt: '2024-11-20T09:12:00Z', examName: 'Structural Analysis' },
  { id: 'EW-VIZ-007', category: 'Malpractice',    priority: 'Critical', branch: 'CSE', department: 'Examination Discipline', submittedAt: '2024-11-20T09:15:00Z', examName: 'OS' },
];

const PRIORITY_WEIGHT = { Critical: 3, High: 2, Medium: 1 };

function prioritySort(a, b) {
  const diff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
  if (diff !== 0) return diff;
  return new Date(a.submittedAt) - new Date(b.submittedAt);
}

const PRIORITY_COLORS = {
  Critical: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700', dot: 'bg-red-500', badge: 'bg-red-500' },
  High:     { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', dot: 'bg-orange-400', badge: 'bg-orange-400' },
  Medium:   { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-400', badge: 'bg-blue-400' },
};

function ReportCard({ report, position, isNext, isNew }) {
  const c = PRIORITY_COLORS[report.priority] ?? PRIORITY_COLORS.Medium;
  return (
    <div className={`relative rounded-xl border-2 p-3 transition-all duration-500 ${c.bg} ${c.border}
      ${isNext ? 'ring-2 ring-[#2878D0] ring-offset-1' : ''}
      ${isNew ? 'animate-pulse' : ''}`}
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
          NEW
        </span>
      )}
      {isNext && (
        <span className="absolute -top-2 -left-2 text-[10px] bg-[#2878D0] text-white px-1.5 py-0.5 rounded-full font-bold">
          NEXT
        </span>
      )}
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs font-bold text-gray-700">{report.id}</span>
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      </div>
      <PriorityBadge priority={report.priority} />
      <p className="text-xs text-gray-600 mt-1.5 truncate">{report.category}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{report.branch} · {report.department.split(' ')[0]}</p>
      {position !== undefined && (
        <p className="text-[10px] text-gray-400 mt-1">Queue pos: <strong>{position + 1}</strong></p>
      )}
    </div>
  );
}

function ProcessingSlot({ report }) {
  if (!report) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-gray-400 min-h-[160px]">
        <PlayCircle size={28} className="mb-2 opacity-40" />
        <p className="text-sm">Idle — no report processing</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border-2 border-[#2878D0] bg-[#E9F2FC] p-4 min-h-[160px]">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-bold text-[#2878D0] uppercase tracking-wide">Processing Now</span>
      </div>
      <p className="font-mono font-bold text-[#142B4A] text-sm mb-1">{report.id}</p>
      <PriorityBadge priority={report.priority} />
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-600">{report.category}</p>
        <p className="text-xs text-gray-500">{report.department}</p>
        <p className="text-xs text-gray-500">{report.branch} · {report.examName}</p>
      </div>
    </div>
  );
}

export default function SchedulingVisualizerPage() {
  const [arrived, setArrived]       = useState([]);   // reports that have arrived
  const [waiting, setWaiting]       = useState([]);   // sorted queue
  const [processing, setProcessing] = useState(null);
  const [completed, setCompleted]   = useState([]);
  const [log, setLog]               = useState([]);
  const [step, setStep]             = useState(0);    // which demo report to arrive next
  const [autoPlay, setAutoPlay]     = useState(false);
  const [newId, setNewId]           = useState(null); // highlight newly arrived
  const timerRef = useRef(null);
  const logRef   = useRef(null);

  const addLog = useCallback((msg, type = 'info') => {
    const entry = { msg, type, time: new Date().toLocaleTimeString('en-IN') };
    setLog((prev) => [entry, ...prev].slice(0, 30));
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setArrived([]); setWaiting([]); setProcessing(null);
    setCompleted([]); setLog([]); setStep(0); setAutoPlay(false); setNewId(null);
    addLog('Demo reset. Click "Arrive Next" to start.', 'system');
  }, [addLog]);

  useEffect(() => { addLog('Demo ready. Click "Arrive Next" to begin.', 'system'); }, [addLog]);

  // Arrive next report
  const arriveNext = useCallback(() => {
    if (step >= DEMO_REPORTS.length) {
      addLog('All demo reports have arrived.', 'system');
      return;
    }
    const report = DEMO_REPORTS[step];
    setStep((s) => s + 1);
    setArrived((prev) => [...prev, report]);
    setNewId(report.id);
    setTimeout(() => setNewId(null), 2000);

    setWaiting((prev) => {
      const updated = [...prev, report].sort(prioritySort);
      const pos = updated.findIndex((r) => r.id === report.id);
      addLog(
        `📥 ${report.id} arrived — ${report.priority} priority. Queue position: ${pos + 1}.`,
        report.priority === 'Critical' ? 'critical' : report.priority === 'High' ? 'high' : 'info'
      );
      if (pos === 0 && processing) {
        addLog(
          `⚡ ${report.id} (Critical) jumped to front of queue — but current report is NOT interrupted (non-preemptive).`,
          'critical'
        );
      }
      return updated;
    });
  }, [step, processing, addLog]);

  // Process next from queue
  const processNext = useCallback(() => {
    if (processing) {
      // Complete current
      const done = { ...processing, completedAt: new Date().toISOString() };
      setCompleted((prev) => [done, ...prev]);
      addLog(`✅ ${processing.id} completed and dispatched.`, 'success');
      setProcessing(null);
    }

    setWaiting((prev) => {
      if (prev.length === 0) {
        addLog('Queue is empty — nothing to process.', 'system');
        return prev;
      }
      const [next, ...rest] = prev;
      setProcessing(next);
      addLog(`▶ Started processing ${next.id} (${next.priority} — ${next.category}).`, 'info');
      return rest;
    });
  }, [processing, addLog]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      if (step < DEMO_REPORTS.length) {
        arriveNext();
      } else {
        processNext();
        if (step >= DEMO_REPORTS.length && waiting.length === 0 && !processing) {
          setAutoPlay(false);
          addLog('🎉 Demo complete — all reports processed.', 'success');
        }
      }
    }, 1800);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, step, arriveNext, processNext, waiting.length, processing, addLog]);

  const logColors = { critical: 'text-red-600', high: 'text-orange-500', success: 'text-green-600', system: 'text-gray-400', info: 'text-gray-700' };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#142B4A]">Scheduling Visualizer</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Non-preemptive priority scheduling demo — Critical &gt; High &gt; Medium, FIFO within same priority.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reset} className="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-500 hover:text-[#142B4A] px-3 py-1.5 rounded-lg transition">
            <RefreshCw size={14} /> Reset
          </button>
          <button
            onClick={() => setAutoPlay((v) => !v)}
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-lg transition ${
              autoPlay ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-[#142B4A] hover:bg-[#1a3a5c] text-white'
            }`}
          >
            <Zap size={14} /> {autoPlay ? 'Pause Auto' : 'Auto Play'}
          </button>
          <button
            onClick={arriveNext}
            disabled={step >= DEMO_REPORTS.length}
            className="flex items-center gap-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-semibold px-4 py-1.5 rounded-lg transition"
          >
            <ChevronRight size={14} /> Arrive Next
          </button>
          <button
            onClick={processNext}
            disabled={waiting.length === 0 && !processing}
            className="flex items-center gap-1.5 text-sm bg-[#2878D0] hover:bg-[#1a5faa] disabled:opacity-40 text-white font-semibold px-4 py-1.5 rounded-lg transition"
          >
            <PlayCircle size={14} /> {processing ? 'Complete & Next' : 'Start Next'}
          </button>
        </div>
      </div>

      {/* Algorithm legend */}
      <div className="bg-[#E9F2FC] border border-blue-100 rounded-xl px-5 py-3.5 mb-6 flex flex-wrap gap-4 items-center">
        <Info size={16} className="text-[#2878D0] shrink-0" />
        <div className="flex flex-wrap gap-4 text-xs text-[#142B4A]">
          <span><strong>Non-preemptive:</strong> Current report runs to completion — never interrupted.</span>
          <span><strong>Priority order:</strong> Critical → High → Medium</span>
          <span><strong>Tiebreak:</strong> FIFO by submission time</span>
          <span><strong>Critical arrival:</strong> Jumps queue but waits for current to finish.</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Processing + Queue */}
        <div className="lg:col-span-2 space-y-5">
          {/* Processing slot */}
          <div>
            <h2 className="text-sm font-semibold text-[#142B4A] mb-2 flex items-center gap-2">
              <PlayCircle size={15} className="text-[#2878D0]" /> CPU / Processing Slot
            </h2>
            <ProcessingSlot report={processing} />
          </div>

          {/* Waiting queue */}
          <div>
            <h2 className="text-sm font-semibold text-[#142B4A] mb-2 flex items-center gap-2">
              <AlertTriangle size={15} className="text-orange-500" />
              Waiting Queue
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{waiting.length}</span>
            </h2>
            {waiting.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-gray-400 text-sm">
                Queue empty
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {waiting.map((r, i) => (
                  <ReportCard
                    key={r.id}
                    report={r}
                    position={i}
                    isNext={i === 0}
                    isNew={r.id === newId}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[#142B4A] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Completed ({completed.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {completed.map((r) => (
                  <span key={r.id} className="text-xs bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-lg font-mono font-medium">
                    ✓ {r.id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Event log + Arrived */}
        <div className="space-y-5">
          {/* Event log */}
          <div className="bg-[#0e1f35] rounded-xl p-4 min-h-[280px] max-h-[380px] overflow-y-auto" ref={logRef}>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Event Log</p>
            {log.length === 0 && <p className="text-gray-500 text-xs">No events yet.</p>}
            {log.map((entry, i) => (
              <div key={i} className="mb-1.5">
                <span className="text-[10px] text-gray-600 mr-2">{entry.time}</span>
                <span className={`text-xs ${logColors[entry.type] ?? 'text-gray-300'}`}>{entry.msg}</span>
              </div>
            ))}
          </div>

          {/* Arrived reports summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-[#142B4A] mb-3 uppercase tracking-wide">
              Arrived ({arrived.length} / {DEMO_REPORTS.length})
            </p>
            <div className="space-y-1.5">
              {DEMO_REPORTS.map((r, i) => {
                const hasArrived = i < step;
                const isProcessing = processing?.id === r.id;
                const isDone = completed.some((c) => c.id === r.id);
                return (
                  <div key={r.id} className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 transition ${
                    isProcessing ? 'bg-[#E9F2FC]' : isDone ? 'bg-green-50' : hasArrived ? 'bg-gray-50' : 'opacity-30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isProcessing ? 'bg-[#2878D0] animate-pulse' : isDone ? 'bg-green-500' : hasArrived ? PRIORITY_COLORS[r.priority]?.dot : 'bg-gray-300'
                    }`} />
                    <span className="font-mono font-semibold text-gray-700">{r.id}</span>
                    <PriorityBadge priority={r.priority} />
                    <span className="ml-auto text-gray-400">
                      {isDone ? '✓' : isProcessing ? '▶' : hasArrived ? '⏳' : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
