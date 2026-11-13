import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ClipboardList,
  FileSearch,
  HeartPulse,
  LogIn,
  Monitor,
  ShieldCheck,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    icon: AlertTriangle,
    title: 'Malpractice',
    desc: 'Cheating, unauthorized materials, impersonation and academic dishonesty.',
    accent: 'border-red-200 bg-red-50',
    iconColor: 'text-red-500 bg-red-100',
  },
  {
    icon: HeartPulse,
    title: 'Medical',
    desc: 'Student health emergencies and medical incidents during examinations.',
    accent: 'border-pink-200 bg-pink-50',
    iconColor: 'text-pink-500 bg-pink-100',
  },
  {
    icon: Monitor,
    title: 'Technical',
    desc: 'Power failures, equipment malfunctions and infrastructure issues.',
    accent: 'border-blue-200 bg-blue-50',
    iconColor: 'text-blue-500 bg-blue-100',
  },
  {
    icon: Volume2,
    title: 'Disturbance',
    desc: 'Noise, disruptions, unauthorized entry or environmental disturbances.',
    accent: 'border-orange-200 bg-orange-50',
    iconColor: 'text-orange-500 bg-orange-100',
  },
  {
    icon: FileSearch,
    title: 'Missing Script',
    desc: 'Lost or misplaced answer booklets after collection.',
    accent: 'border-purple-200 bg-purple-50',
    iconColor: 'text-purple-500 bg-purple-100',
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Structured Reporting',
    desc: 'Five defined categories ensure every incident is captured with the right context.',
    color: 'text-[#2878D0] bg-[#E9F2FC]',
  },
  {
    icon: TrendingUp,
    title: 'Auto Prioritization',
    desc: 'The system automatically assigns priority — no manual guesswork required.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: ClipboardList,
    title: 'Full Audit Trail',
    desc: 'Every report is timestamped and tracked from submission to resolution.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: ShieldCheck,
    title: 'Centralized Management',
    desc: 'The examination cell gets a single dashboard to manage all incidents.',
    color: 'text-orange-600 bg-orange-50',
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Invigilator Logs In',
    desc: 'Authorized invigilators sign in using their institutional Invigilator ID.',
  },
  {
    step: 2,
    title: 'Submit Incident Report',
    desc: 'Fill in the structured form with exam details and a clear incident description.',
  },
  {
    step: 3,
    title: 'Automatic Prioritization',
    desc: 'The system assigns priority and routes the report to the relevant department.',
  },
  {
    step: 4,
    title: 'Track & Resolve',
    desc: 'Monitor every report through a transparent five-stage status timeline.',
  },
];

export default function LandingPage() {
  return (
    <div className="text-[#142B4A]">

      {/* ── Hero ── */}
      <section id="home" className="bg-[#142B4A] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 text-blue-200 px-3 py-1 rounded-full mb-5">
              <ShieldCheck size={13} />
              University Examination Management
            </span>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Exam Hall Irregularities,<br />
              <span className="text-[#4A9FE8]">Reported & Resolved Fast</span>
            </h1>
            <p className="text-gray-300 text-base leading-relaxed mb-7 max-w-md">
              ExamWatch gives invigilators a structured, digital way to report incidents —
              from malpractice to missing scripts — with automatic prioritization and
              real-time tracking.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-[#2878D0] hover:bg-[#1a5faa]
                  text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm"
              >
                <LogIn size={16} />
                Invigilator Login
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white
                  text-sm font-medium transition"
              >
                How it works <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Hero stats panel */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { label: 'Reports Processed', value: '1,240+', color: 'bg-white/5 border-white/10' },
              { label: 'Avg. Resolution Time', value: '< 4 hrs', color: 'bg-white/5 border-white/10' },
              { label: 'Departments Covered', value: '5', color: 'bg-white/5 border-white/10' },
              { label: 'Incident Categories', value: '5', color: 'bg-white/5 border-white/10' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`border rounded-xl p-5 ${color}`}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ExamWatch ── */}
      <section id="about" className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-10">
            <h2 className="text-2xl font-bold text-[#142B4A] mb-2">Why ExamWatch?</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Paper-based incident reporting is slow and error-prone. ExamWatch digitizes
              the entire process — from capture to resolution — with full transparency.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition bg-white"
              >
                <div className={`inline-flex p-2.5 rounded-lg mb-4 ${color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold text-[#142B4A] text-sm mb-1.5">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-[#F5F7FB] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-10">
            <h2 className="text-2xl font-bold text-[#142B4A] mb-2">How It Works</h2>
            <p className="text-gray-500 text-sm">A four-step process from incident to resolution.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#E9F2FC] flex items-center justify-center
                  text-[#2878D0] font-bold text-sm mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-[#142B4A] text-sm mb-1.5">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Irregularity Categories ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-10">
            <h2 className="text-2xl font-bold text-[#142B4A] mb-2">Irregularity Categories</h2>
            <p className="text-gray-500 text-sm">
              Five defined categories cover every type of examination incident.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map(({ icon: Icon, title, desc, accent, iconColor }) => (
              <div
                key={title}
                className={`rounded-xl p-5 border ${accent} hover:shadow-md transition`}
              >
                <div className={`inline-flex p-2.5 rounded-lg mb-3 ${iconColor}`}>
                  <Icon size={17} />
                </div>
                <h3 className="font-semibold text-[#142B4A] text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[#142B4A] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Ready to get started?</h2>
            <p className="text-gray-400 text-sm">
              Log in to the invigilator portal to submit and track reports.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#2878D0] hover:bg-[#1a5faa]
              text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm shrink-0"
          >
            <LogIn size={16} />
            Login to Portal
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0e1f35] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#2878D0]" />
            <span className="text-white font-semibold text-sm">ExamWatch</span>
            <span className="text-gray-500 text-sm">— Exam Hall Irregularities Reporter</span>
          </div>
          <p className="text-gray-600 text-xs">© 2024 ExamWatch. Built for examination integrity.</p>
        </div>
      </footer>
    </div>
  );
}
