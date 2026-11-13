import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Circle,
  Clock,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import { reportService } from '../services/reportService';

const STAGES = ['Submitted', 'Pending', 'Assigned', 'In Progress', 'Resolved'];

function TimelineStep({ stage, time, done, active }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            done
              ? 'bg-[#2878D0] text-white'
              : active
              ? 'border-2 border-[#2878D0] text-[#2878D0]'
              : 'border-2 border-gray-200 text-gray-300'
          }`}
        >
          {done ? <CheckCircle size={16} /> : <Circle size={16} />}
        </div>
      </div>
      <div className="pb-6">
        <p className={`text-sm font-medium ${done ? 'text-[#142B4A]' : 'text-gray-400'}`}>
          {stage}
        </p>
        {time && (
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <Clock size={11} />
            {new Date(time).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

function TrackByIdPage({ id }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getById(id).then((r) => {
      setReport(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>;
  if (!report) return (
    <div className="py-16 text-center">
      <p className="text-gray-500 mb-4">Report not found for ID: <strong>{id}</strong></p>
      <Link to="/track-report" className="text-[#2878D0] hover:underline text-sm">Search again</Link>
    </div>
  );

  const currentStageIndex = STAGES.indexOf(report.status);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Info */}
      <div className="md:col-span-2 space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#142B4A]">Report Information</h2>
            <span className="font-mono text-xs text-[#2878D0] font-medium">{report.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              ['Examination', report.examName],
              ['Date', report.examDate],
              ['Session', report.session],
              ['Branch', report.branch || '—'],
              ['Hall', report.hall],
              ['Room', report.roomNumber],
              ['Seat', report.seatNumber || '—'],
              ['Category', report.category],
              ['Incident Time', report.incidentTime],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="text-gray-700 font-medium">{value}</p>
              </div>
            ))}
            <div className="col-span-2">
              <p className="text-gray-400 text-xs">Description</p>
              <p className="text-gray-700">{report.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-[#142B4A] mb-4">Assignment Details</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Priority</p>
              <PriorityBadge priority={report.priority} />
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Department</p>
              <p className="text-gray-700 font-medium">{report.department || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Current Status</p>
              <StatusBadge status={report.status} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-1">Submitted At</p>
            <p className="text-gray-700 text-sm">{new Date(report.submittedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
        <h2 className="font-semibold text-[#142B4A] mb-5">Status Timeline</h2>
        <div>
          {report.timeline.map((step, i) => (
            <TimelineStep
              key={step.stage}
              stage={step.stage}
              time={step.time}
              done={step.done}
              active={i === currentStageIndex + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TrackReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [activeId, setActiveId] = useState(id || '');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) setActiveId(searchId.trim().toUpperCase());
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb + Back */}
      <div className="flex items-center justify-between mb-5">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link to="/dashboard" className="hover:text-[#2878D0] font-medium transition">Dashboard</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <Link to="/my-reports" className="hover:text-[#2878D0] font-medium transition">My Reports</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-[#142B4A] font-semibold">Track Report</span>
        </nav>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#142B4A] transition"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#142B4A]">Track Report</h1>
        <p className="text-gray-500 text-sm mt-0.5">View the status and details of a submitted report.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter Report ID (e.g. EW-2024-001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2878D0] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-[#2878D0] hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          Track
        </button>
      </form>

      {activeId ? (
        <TrackByIdPage id={activeId} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center text-gray-400 text-sm">
          Enter a Report ID above to track its status.
        </div>
      )}
    </div>
  );
}
