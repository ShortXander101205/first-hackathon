import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Icons } from '@/components/ui/icons';
import { GUIDE_COPY } from '@/content/guideCopy';

export function Header() {
  const nav = GUIDE_COPY.nav;

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b border-edu-slate-200 bg-white/80 backdrop-blur-md transition-all"
    >
      <Container className="flex items-center justify-between h-16">
        {/* Brand & Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 text-edu-primary hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-edu-interactive rounded-md px-1 shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-edu-primary flex items-center justify-center text-white shadow-sm shrink-0">
            <Icons.logo className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg leading-tight tracking-tight text-edu-slate-900">
              {nav.brandName}
            </span>
            <span className="hidden sm:inline text-[11px] font-medium text-edu-slate-500 leading-none">
              {nav.brandTagline}
            </span>
          </div>
        </Link>

        {/* Primary Navigation */}
        <div className="flex items-center gap-2 sm:gap-6">
          <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="px-2.5 py-1.5 sm:px-3 rounded-md text-xs sm:text-sm font-medium text-edu-slate-700 hover:text-edu-primary hover:bg-edu-slate-100 transition-colors whitespace-nowrap"
            >
              {nav.studentGuideLink}
            </Link>
            <Link
              href="/advisor"
              className="px-2.5 py-1.5 sm:px-3 rounded-md text-xs sm:text-sm font-medium text-edu-slate-700 hover:text-edu-primary hover:bg-edu-slate-100 transition-colors whitespace-nowrap"
            >
              {nav.advisorPortalLink}
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
