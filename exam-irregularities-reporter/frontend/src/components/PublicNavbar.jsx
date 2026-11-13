import { Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'How It Works', href: '/#how-it-works' },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#142B4A] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6 h-15 flex items-center justify-between" style={{ height: '60px' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <ShieldCheck size={22} className="text-[#2878D0]" />
          <span>Exam<span className="text-[#4A9FE8]">Watch</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Admin Login
          </Link>
          <Link
            to="/dept/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Dept Login
          </Link>
          <Link
            to="/login"
            className="bg-[#2878D0] hover:bg-[#1a5faa] text-white text-sm font-semibold
              px-5 py-2 rounded-lg transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-300 hover:text-white transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0e1f35] border-t border-white/10 px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-gray-300 hover:text-white transition py-1"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="text-sm text-gray-400 hover:text-white transition py-1"
          >
            Admin Login
          </Link>
          <Link
            to="/dept/login"
            onClick={() => setMobileOpen(false)}
            className="text-sm text-gray-400 hover:text-white transition py-1"
          >
            Dept Login
          </Link>
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-1 bg-[#2878D0] hover:bg-[#1a5faa] text-white text-sm font-semibold
              px-5 py-2 rounded-lg transition text-center"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
