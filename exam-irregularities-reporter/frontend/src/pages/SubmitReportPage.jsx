import { CheckCircle, ChevronRight, Paperclip, Upload } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput, FormSelect, FormTextarea } from '../components/FormFields';
import { BRANCHES, CATEGORIES, SESSIONS } from '../data/mockData';
import { reportService } from '../services/reportService';

const INITIAL = {
  examName: '',
  examDate: '',
  session: '',
  branch: '',
  hall: '',
  roomNumber: '',
  seatNumber: '',
  category: '',
  description: '',
  incidentTime: '',
  evidence: null,
};

export default function SubmitReportPage() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const navigate = useNavigate();

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.examName.trim()) e.examName = 'Examination name is required.';
    if (!form.examDate) e.examDate = 'Examination date is required.';
    if (!form.session) e.session = 'Session is required.';
    if (!form.branch) e.branch = 'Branch is required.';
    if (!form.hall.trim()) e.hall = 'Examination hall is required.';
    if (!form.roomNumber.trim()) e.roomNumber = 'Room number is required.';
    if (!form.category) e.category = 'Category is required.';
    if (!form.description.trim()) e.description = 'Incident description is required.';
    if (!form.incidentTime) e.incidentTime = 'Incident time is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await reportService.submit(form);
    setLoading(false);
    if (result.success) setSubmitted(result.report);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#142B4A] mb-2">Report Submitted</h2>
          <p className="text-gray-500 mb-6">
            Your irregularity report has been submitted successfully. The system will automatically
            assign a priority and route it to the relevant department.
          </p>
          <div className="bg-[#E9F2FC] rounded-xl px-6 py-4 mb-6 inline-block">
            <p className="text-xs text-gray-500 mb-1">Report ID</p>
            <p className="text-2xl font-bold font-mono text-[#2878D0]">{submitted.id}</p>
          </div>
          <div className="text-sm text-gray-600 mb-8 space-y-1">
            <p><span className="font-medium">Exam:</span> {submitted.examName}</p>
            <p><span className="font-medium">Branch:</span> {submitted.branch}</p>
            <p><span className="font-medium">Category:</span> {submitted.category}</p>
            <p><span className="font-medium">Submitted:</span> {new Date(submitted.submittedAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link
              to="/my-reports"
              className="bg-[#2878D0] hover:bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
            >
              View My Reports
            </Link>
            <button
              onClick={() => { setSubmitted(null); setForm(INITIAL); }}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium px-6 py-2.5 rounded-lg transition"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb + Back */}
      <div className="flex items-center justify-between mb-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link to="/dashboard" className="hover:text-[#2878D0] font-medium transition">Dashboard</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-[#142B4A] font-semibold">Submit Report</span>
        </nav>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-[#142B4A] transition flex items-center gap-1"
        >
          ← Back
        </button>
      </div>

      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#142B4A]">Submit Irregularity Report</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in all required fields. Priority will be automatically assigned by the system.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="font-semibold text-[#142B4A] mb-4 pb-2 border-b border-gray-100">
            Examination Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormInput
                label="Examination Name"
                required
                placeholder="e.g. Data Structures and Algorithms"
                value={form.examName}
                onChange={set('examName')}
                error={errors.examName}
              />
            </div>
            <FormInput
              label="Examination Date"
              required
              type="date"
              value={form.examDate}
              onChange={set('examDate')}
              error={errors.examDate}
            />
            <FormSelect
              label="Session"
              required
              value={form.session}
              onChange={set('session')}
              error={errors.session}
            >
              <option value="">Select session</option>
              {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </FormSelect>
            <FormSelect
              label="Branch"
              required
              value={form.branch}
              onChange={set('branch')}
              error={errors.branch}
            >
              <option value="">Select Branch</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </FormSelect>
            <FormInput
              label="Examination Hall"
              required
              placeholder="e.g. Block A"
              value={form.hall}
              onChange={set('hall')}
              error={errors.hall}
            />
            <FormInput
              label="Room Number"
              required
              placeholder="e.g. A101"
              value={form.roomNumber}
              onChange={set('roomNumber')}
              error={errors.roomNumber}
            />
            <FormInput
              label="Seat Number (if applicable)"
              placeholder="e.g. 14"
              value={form.seatNumber}
              onChange={set('seatNumber')}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="font-semibold text-[#142B4A] mb-4 pb-2 border-b border-gray-100">
            Incident Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <FormSelect
              label="Irregularity Category"
              required
              value={form.category}
              onChange={set('category')}
              error={errors.category}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </FormSelect>
            <FormInput
              label="Incident Time"
              required
              type="time"
              value={form.incidentTime}
              onChange={set('incidentTime')}
              error={errors.incidentTime}
            />
            <div className="md:col-span-2">
              <FormTextarea
                label="Incident Description"
                required
                placeholder="Describe the irregularity in detail…"
                value={form.description}
                onChange={set('description')}
                error={errors.description}
              />
            </div>
          </div>
        </div>

        {/* Evidence */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-[#142B4A] mb-4 pb-2 border-b border-gray-100">
            Evidence Attachment <span className="text-gray-400 font-normal text-sm">(Optional)</span>
          </h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#2878D0] hover:bg-[#E9F2FC]/30 transition">
            <Upload size={24} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {form.evidence ? (
                <span className="flex items-center gap-1 text-[#2878D0]">
                  <Paperclip size={14} /> {form.evidence.name}
                </span>
              ) : (
                'Click to upload or drag and drop'
              )}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
            <input
              type="file"
              className="hidden"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => setForm((f) => ({ ...f, evidence: e.target.files[0] || null }))}
            />
          </label>
        </div>

        {/* Priority notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-[#2878D0] mb-6">
          ℹ️ Priority and department assignment are handled automatically by the system after submission.
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2878D0] hover:bg-blue-600 disabled:opacity-60 text-white font-semibold px-8 py-2.5 rounded-lg transition text-sm"
          >
            {loading ? 'Submitting…' : 'Submit Report'}
          </button>
          <button
            type="button"
            onClick={() => { setForm(INITIAL); setErrors({}); }}
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition text-sm"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
