import { CheckCircle, Eye, EyeOff, Lock, ShieldCheck, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPT_STAFF_USERS } from '../../data/mockData';
import { deptAuthService } from '../../services/deptAuthService';

export default function DeptLoginPage() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ staffId: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [authError, setAuthError] = useState('');
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (deptAuthService.getLogoutFlag()) setLoggedOut(true);
    if (deptAuthService.getUser()) navigate('/dept/dashboard', { replace: true });
  }, [navigate]);

  const validate = () => {
    const e = {};
    if (!form.staffId.trim()) e.staffId = 'Staff ID is required.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setAuthError(''); setLoading(true);
    const result = await deptAuthService.login(form.staffId, form.password);
    setLoading(false);
    if (result.success) {
      deptAuthService.saveUser(result.user);
      navigate('/dept/dashboard');
    } else {
      setAuthError(result.message);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: field === 'staffId' ? e.target.value.toUpperCase() : e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
    setAuthError('');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#142B4A] px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3">
              <UserCog size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Department Staff Portal</h1>
            <p className="text-blue-200 text-sm mt-1">ExamWatch — Department Access</p>
          </div>

          <div className="px-8 py-7">
            {loggedOut && (
              <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-5">
                <CheckCircle size={16} className="shrink-0" /> You have been logged out successfully.
              </div>
            )}
            {authError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                <span className="mt-0.5 shrink-0">⚠</span> {authError}
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5 text-xs text-amber-800">
              <strong>Note:</strong> This is mock authentication for demonstration. Real department-level
              authorization will be enforced by the backend in Part D.
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Staff ID <span className="text-red-500">*</span></label>
                <div className="relative">
                  <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. STAFF-DISC01"
                    value={form.staffId}
                    onChange={handleChange('staffId')}
                    className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono tracking-wide outline-none
                      focus:ring-2 focus:ring-[#2878D0] focus:border-transparent transition
                      ${errors.staffId ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                </div>
                {errors.staffId && <p className="text-xs text-red-600">{errors.staffId}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange('password')}
                    className={`w-full border rounded-lg pl-9 pr-10 py-2.5 text-sm outline-none
                      focus:ring-2 focus:ring-[#2878D0] focus:border-transparent transition
                      ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2878D0] hover:bg-[#1a5faa] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition text-sm mt-1"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 bg-[#E9F2FC] border border-blue-100 rounded-xl px-4 py-3.5">
              <p className="text-xs font-bold text-[#142B4A] mb-2 uppercase tracking-wide">Demo Credentials (all use password: staff123)</p>
              <div className="space-y-1 text-xs text-gray-600 max-h-36 overflow-y-auto">
                {DEPT_STAFF_USERS.map((u) => (
                  <div key={u.staffId} className="flex justify-between gap-2">
                    <span className="font-mono font-semibold text-[#142B4A]">{u.staffId}</span>
                    <span className="text-gray-400 truncate">{u.department}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-5">
          Access restricted to authorized department staff only.
        </p>
      </div>
    </div>
  );
}
