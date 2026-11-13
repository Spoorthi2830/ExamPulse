import {
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  Loader2,
  MessageSquare,
  PlayCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../../components/Badges';
import { deptAuthService } from '../../services/deptAuthService';
import { dispatchService } from '../../services/dispatchService';

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 shrink-0 w-32">{label}</span>
      <span className="text-xs font-medium text-[#142B4A] text-right">{value || '—'}</span>
    </div>
  );
}

function Card({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
        <Icon size={15} className="text-[#2878D0]" />
        <h2 className="font-semibold text-[#142B4A] text-sm">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export default function DeptReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = deptAuthService.getUser();

  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark]   = useState('');
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');

  useEffect(() => {
    dispatchService.getDeptReports(user.department).then((data) => {
      const found = data.find((r) => r.id === id);
      if (!found) { navigate('/dept/reports', { replace: true }); return; }
      setReport(found);
      setRemark(found.remarks || '');
      setLoading(false);
    });
  }, [id, user.department, navigate]);

  const handleAccept = async () => {
    setSaving(true);
    const res = await dispatchService.acceptReport(report.id, user.staffId);
    if (res.success) {
      setReport(res.report);
      setMsg('Report accepted and moved to In Progress.');
    } else {
      setMsg(res.message);
    }
    setSaving(false);
  };

  const handleSaveRemark = async () => {
    setSaving(true);
    await dispatchService.addRemark(report.id, remark);
    setMsg('Remark saved.');
    setSaving(false);
  };

  const handleResolve = async () => {
    if (!window.confirm('Mark this report as Resolved?')) return;
    setSaving(true);
    const res = await dispatchService.resolveReport(report.id, remark);
    if (res.success) {
      setReport(res.report);
      setMsg('Report marked as Resolved.');
    } else {
      setMsg(res.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-[#2878D0]" />
      </div>
    );
  }

  const canAccept  = ['Submitted', 'Pending', 'Assigned'].includes(report.status);
  const canResolve = ['In Progress', 'Assigned'].includes(report.status);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <Link to="/dept/reports" className="hover:text-[#2878D0] flex items-center gap-1">
          <ArrowLeft size={13} /> Assigned Reports
        </Link>
        <span>/</span>
        <span className="text-[#142B4A] font-medium">{report.id}</span>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#142B4A]">{report.id}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{report.examName}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <PriorityBadge priority={report.priority} />
            <StatusBadge status={report.status} />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {canAccept && (
            <button onClick={handleAccept} disabled={saving}
              className="flex items-center gap-1.5 text-sm bg-[#2878D0] hover:bg-[#1a5faa] disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition">
              <PlayCircle size={15} /> Accept
            </button>
          )}
          {canResolve && (
            <button onClick={handleResolve} disabled={saving}
              className="flex items-center gap-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition">
              <CheckCircle size={15} /> Mark Resolved
            </button>
          )}
        </div>
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-5">
          {msg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <Card title="Exam Details" icon={ClipboardList}>
          <InfoRow label="Exam Name"   value={report.examName} />
          <InfoRow label="Date"        value={report.examDate} />
          <InfoRow label="Session"     value={report.session} />
          <InfoRow label="Branch"      value={report.branch} />
          <InfoRow label="Hall"        value={report.hall} />
          <InfoRow label="Room"        value={report.roomNumber} />
          <InfoRow label="Seat"        value={report.seatNumber || 'N/A'} />
        </Card>

        <Card title="Incident Details" icon={ClipboardList}>
          <InfoRow label="Category"    value={report.category} />
          <InfoRow label="Incident Time" value={report.incidentTime} />
          <InfoRow label="Invigilator" value={report.invId} />
          <InfoRow label="Submitted"   value={fmt(report.submittedAt)} />
          <InfoRow label="Department"  value={report.department} />
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">{report.description}</p>
          </div>
        </Card>
      </div>

      {/* Evidence placeholder */}
      <Card title="Evidence" icon={ClipboardList}>
        <p className="text-xs text-gray-400 italic">
          No evidence files attached. Evidence upload will be available after backend integration in Part D.
        </p>
      </Card>

      {/* Remarks */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
          <MessageSquare size={15} className="text-[#2878D0]" />
          <h2 className="font-semibold text-[#142B4A] text-sm">Remarks</h2>
        </div>
        <div className="px-5 py-4">
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={report.status === 'Resolved'}
            placeholder="Add remarks or notes about this report…"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none
              focus:ring-2 focus:ring-[#2878D0] resize-none disabled:bg-gray-50 disabled:text-gray-400"
          />
          {report.status !== 'Resolved' && (
            <button onClick={handleSaveRemark} disabled={saving}
              className="mt-2 flex items-center gap-1.5 text-sm bg-[#142B4A] hover:bg-[#1a3a5c] disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
              Save Remark
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      {report.timeline && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <ClipboardList size={15} className="text-[#2878D0]" />
            <h2 className="font-semibold text-[#142B4A] text-sm">Status Timeline</h2>
          </div>
          <div className="px-5 py-4 flex flex-wrap gap-3">
            {report.timeline.map((t) => (
              <div key={t.stage} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                t.done ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${t.done ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="font-medium">{t.stage}</span>
                {t.time && <span className="text-[10px] opacity-70">{fmt(t.time)}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
