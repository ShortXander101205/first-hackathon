import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Icons } from '@/components/ui/icons';

export function Header() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b border-edu-slate-200 bg-white/80 backdrop-blur-md transition-all"
    >
      <Container className="flex items-center justify-between h-16">
        {/* Brand & Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-edu-primary hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-edu-interactive rounded-md px-1"
        >
          <div className="w-9 h-9 rounded-lg bg-edu-primary flex items-center justify-center text-white shadow-sm">
            <Icons.logo className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-edu-slate-900">
              Pathway<span className="text-edu-interactive">AI</span>
            </span>
            <span className="text-[11px] font-medium text-edu-slate-500 leading-none">
              Major & Career Triage
            </span>
          </div>
        </Link>

        {/* Primary Navigation & Rate Guard Pill */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-edu-slate-700 hover:text-edu-primary hover:bg-edu-slate-100 transition-colors"
            >
              Student Triage
            </Link>
            <Link
              href="/counselor"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-edu-slate-700 hover:text-edu-primary hover:bg-edu-slate-100 transition-colors"
            >
              Counselor Dashboard
            </Link>
          </nav>

          {/* Zero-Cost Rate Guard Indicator */}
          <div
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edu-slate-100 border border-edu-slate-200 text-xs text-edu-slate-600 font-medium"
            title="Operating under Google Gemini 1.5 Flash zero-cost free-tier quota"
          >
            <span className="w-2 h-2 rounded-full bg-growth-500 animate-pulse" aria-hidden="true" />
            <span className="hidden md:inline">Gemini 1.5 Flash • </span>15 RPM Guard
          </div>
        </div>
      </Container>
    </header>
  );
}
