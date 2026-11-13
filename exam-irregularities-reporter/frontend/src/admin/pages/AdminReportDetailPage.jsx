import { ArrowLeft, ChevronRight, Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DispatchBadge, PriorityBadge, StatusBadge } from '../../components/Badges';
import { reportService } from '../../services/reportService';

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value || '—'}</p>
    </div>
  );
}

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getById(id).then((r) => { setReport(r); setLoading(false); });
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-400 text-sm py-20">Loading…</div>;
  if (!report) return (
    <div className="p-6 text-center py-20">
      <p className="text-gray-500 mb-4">Report <strong>{id}</strong> not found.</p>
      <Link to="/admin/reports" className="text-[#2878D0] hover:underline text-sm">← Back to All Reports</Link>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb + Back */}
      <div className="flex items-center justify-between mb-5">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link to="/admin/dashboard" className="hover:text-[#2878D0] font-medium transition">Dashboard</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <Link to="/admin/reports" className="hover:text-[#2878D0] font-medium transition">All Reports</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-[#142B4A] font-semibold">{report.id}</span>
        </nav>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#142B4A] transition">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      {/* Header strip */}
      <div className="bg-[#142B4A] rounded-xl px-6 py-4 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-blue-200 text-xs mb-0.5">Report ID</p>
          <p className="text-white font-bold font-mono text-lg">{report.id}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="text-center">
            <p className="text-blue-200 text-xs mb-1">Priority</p>
            <PriorityBadge priority={report.priority} />
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-xs mb-1">Status</p>
            <StatusBadge status={report.status} />
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-xs mb-1">Dispatch</p>
            <DispatchBadge status={report.dispatchStatus} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Examination Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#142B4A] mb-4 pb-2 border-b border-gray-100">
            Examination Details
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <InfoRow label="Invigilator ID"    value={report.invId} />
            <InfoRow label="Examination Name"  value={report.examName} />
            <InfoRow label="Examination Date"  value={report.examDate} />
            <InfoRow label="Session"           value={report.session} />
            <InfoRow label="Branch"            value={report.branch} />
            <InfoRow label="Examination Hall"  value={report.hall} />
            <InfoRow label="Room Number"       value={report.roomNumber} />
            <InfoRow label="Seat Number"       value={report.seatNumber || '—'} />
          </div>
        </div>

        {/* Incident Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#142B4A] mb-4 pb-2 border-b border-gray-100">
            Incident Details
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-3">
            <InfoRow label="Category"      value={report.category} />
            <InfoRow label="Incident Time" value={report.incidentTime} />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{report.description}</p>
          </div>
          {report.evidence && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[#2878D0]">
              <Paperclip size={14} />
              <span>{typeof report.evidence === 'string' ? report.evidence : report.evidence.name}</span>
            </div>
          )}
        </div>

        {/* Assignment Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#142B4A] mb-4 pb-2 border-b border-gray-100">
            Assignment Details
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Priority</p>
              <PriorityBadge priority={report.priority} />
            </div>
            <InfoRow label="Assigned Department" value={report.department} />
            <div>
              <p className="text-xs text-gray-400 mb-1">Report Status</p>
              <StatusBadge status={report.status} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Dispatch Status</p>
              <DispatchBadge status={report.dispatchStatus} />
            </div>
            <div className="col-span-2">
              <InfoRow label="Submission Timestamp"
                value={new Date(report.submittedAt).toLocaleString()} />
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-[#142B4A] mb-4 pb-2 border-b border-gray-100">
            Status Timeline
          </h2>
          <div className="space-y-3">
            {report.timeline.map((step) => (
              <div key={step.stage} className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                  step.done ? 'bg-[#2878D0]' : 'bg-gray-200'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${step.done ? 'text-[#142B4A]' : 'text-gray-400'}`}>
                    {step.stage}
                  </p>
                  {step.time && (
                    <p className="text-xs text-gray-400">{new Date(step.time).toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
