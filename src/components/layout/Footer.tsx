import React from 'react';
import { Container } from './Container';
import { Icons } from '@/components/ui/icons';
import { GUIDE_COPY } from '@/content/guideCopy';

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-edu-slate-200 bg-edu-slate-100 py-8 text-sm text-edu-slate-600 mt-auto"
    >
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Reassurance & Brand Copy */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 font-semibold text-edu-slate-800">
            <Icons.academic className="w-4 h-4 text-edu-primary" aria-hidden="true" />
            <span>{GUIDE_COPY.footer.brandName}</span>
          </div>
          <span className="hidden sm:inline text-edu-slate-400" aria-hidden="true">•</span>
          <p className="text-xs text-edu-slate-600">
            {GUIDE_COPY.footer.tagline}
          </p>
        </div>

        {/* Framework & Version Details */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-edu-slate-600 text-center sm:text-right">
          <div className="flex items-center gap-1.5">
            <Icons.shield className="w-3.5 h-3.5 text-growth-700" aria-hidden="true" />
            <span>{GUIDE_COPY.footer.frameworkBadge}</span>
          </div>
          <span className="hidden sm:inline text-edu-slate-400" aria-hidden="true">•</span>
          <span className="text-edu-slate-600 font-mono">{GUIDE_COPY.footer.versionBadge}</span>
        </div>
      </Container>
    </footer>
  );
}
