import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Sparkles,
  Menu,
  X,
  Clapperboard,
  TrendingUp,
  Flame,
  Code2,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/studio', label: 'Content Studio', icon: <Clapperboard className="w-4 h-4" /> },
    { path: '/ads', label: 'Ad Lab', icon: <TrendingUp className="w-4 h-4" /> },
    { path: '/viral', label: 'Viral Lab', icon: <Flame className="w-4 h-4" /> },
    { path: '/prompts', label: 'Prompt Library', icon: <Code2 className="w-4 h-4" /> },
  ];

  const handleRunSample = () => {
    navigate('/studio?sample=true');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F6F4FF]/90 backdrop-blur-md border-b border-[#ECE9F8]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* MySivi-inspired Chat Bubble Icon with Gradient */}
          <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md shadow-brand-blue/25 group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 text-white"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-ink flex items-center gap-1">
              Growth<span className="text-gradient">Lab</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-body/80 -mt-1">
              for MySivi
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-white text-[#6D4AFF] shadow-sm border border-[#ECE9F8]'
                    : 'text-body hover:text-ink hover:bg-white/60'
                )}
              >
                <span className={isActive ? 'text-brand-purple' : 'text-body/70'}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={handleRunSample}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F0EEFF] text-[#6D4AFF] hover:bg-[#E6E2FF] border border-[#DDD8F5] transition-all duration-150 shadow-sm hover:shadow active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-purple animate-pulse-subtle" />
            <span>Run sample</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={handleRunSample}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F0EEFF] text-[#6D4AFF] border border-[#DDD8F5]"
          >
            <Sparkles className="w-3 h-3 text-brand-purple" />
            <span>Sample</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl bg-white border border-[#ECE9F8] text-body hover:text-ink"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#ECE9F8] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-lavender-100 text-brand-purple'
                    : 'text-body hover:bg-lavender-50 hover:text-ink'
                )}
              >
                <span className={isActive ? 'text-brand-purple' : 'text-body/70'}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
