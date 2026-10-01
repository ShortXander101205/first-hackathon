import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Icons } from '@/components/ui/icons';

export default function CounselorPlaceholderPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Breadcrumb / Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-edu-slate-500 hover:text-edu-primary transition-colors"
          >
            <Icons.arrowRight className="w-3.5 h-3.5 rotate-180" aria-hidden="true" />
            <span>Back to Student Triage</span>
          </Link>

          {/* Heading & Intro */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edu-blue-50 border border-edu-blue-100 text-edu-primary text-xs font-semibold">
              <Icons.shield className="w-3.5 h-3.5 text-edu-interactive" aria-hidden="true" />
              <span>Advising &amp; Triage Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-edu-slate-900 tracking-tight">
              Counselor Triage Dashboard
            </h1>
            <p className="text-sm text-edu-slate-600">
              Review student submissions, inspect academic anxiety friction tags, and prepare structured advising notes before 1-on-1 sessions.
            </p>
          </div>

          {/* Scaffolding Placeholder Box */}
          <div className="p-8 rounded-xl border border-dashed border-edu-slate-300 bg-white/50 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-edu-slate-100 text-edu-slate-400 mx-auto flex items-center justify-center">
              <Icons.users className="w-6 h-6 text-edu-slate-500" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-edu-slate-800">
              Counselor Triage Pipeline (Feature 5)
            </h2>
            <p className="text-xs text-edu-slate-500 max-w-md mx-auto leading-relaxed">
              The live student triage queue, anxiety metrics, review status toggles, and detail inspection drawer will be populated during Feature 5.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
