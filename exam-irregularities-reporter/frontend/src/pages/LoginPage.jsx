import { BadgeCheck, CheckCircle, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, validateInvId } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);
  const [form, setForm] = useState({ invId: '', password: '' });

  useEffect(() => {
    if (sessionStorage.getItem('examwatch_logged_out')) {
      setLoggedOut(true);
      sessionStorage.removeItem('examwatch_logged_out');
    }
  }, []);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const e = {};
    const idCheck = validateInvId(form.invId);
    if (!idCheck.valid) e.invId = idCheck.message;
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setAuthError('');
    setLoading(true);
    const result = await authService.login(form.invId, form.password);
    setLoading(false);
    if (result.success) {
      authService.saveUser(result.user);
      navigate('/dashboard');
    } else {
      setAuthError(result.message);
    }
  };

  const handleChange = (field) => (e) => {
    const val = field === 'invId' ? e.target.value.toUpperCase() : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((er) => ({ ...er, [field]: '' }));
    setAuthError('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-[#F5F7FB]">
      <div className="w-full max-w-[420px]">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Card header strip */}
          <div className="bg-[#142B4A] px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Invigilator Portal</h1>
            <p className="text-blue-200 text-sm mt-1">ExamWatch — Sign in to continue</p>
          </div>

          <div className="px-8 py-7">
            {/* Logout success toast */}
          {loggedOut && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-5">
              <CheckCircle size={16} className="shrink-0" />
              You have been logged out successfully.
            </div>
          )}

          {/* Auth error */}
            {authError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Invigilator ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Invigilator ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BadgeCheck
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="e.g. INVCSE2121"
                    value={form.invId}
                    onChange={handleChange('invId')}
                    autoComplete="username"
                    spellCheck={false}
                    className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono tracking-wide outline-none
                      focus:ring-2 focus:ring-[#2878D0] focus:border-transparent transition
                      ${errors.invId ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                  />
                </div>
                {errors.invId && (
                  <p className="text-xs text-red-600 leading-snug">{errors.invId}</p>
                )}
                <p className="text-xs text-gray-400">
                  Format: INV + dept code (CSE / ECE / EEE / CIVL / ME) + 4 digits
                </p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange('password')}
                    autoComplete="current-password"
                    className={`w-full border rounded-lg pl-9 pr-10 py-2.5 text-sm outline-none
                      focus:ring-2 focus:ring-[#2878D0] focus:border-transparent transition
                      ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2878D0] hover:bg-[#1a5faa] disabled:opacity-60
                  text-white font-semibold py-2.5 rounded-lg transition text-sm mt-1"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 bg-[#E9F2FC] border border-blue-100 rounded-xl px-4 py-3.5">
              <p className="text-xs font-bold text-[#142B4A] mb-2 uppercase tracking-wide">
                Demo Credentials
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-500">Invigilator ID</span>
                  <span className="font-mono font-semibold text-[#142B4A]">INVCSE2121</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Password</span>
                  <span className="font-mono font-semibold text-[#142B4A]">invigilator123</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Access is restricted to authorized invigilators only.
        </p>
      </div>
    </div>
  );
}
