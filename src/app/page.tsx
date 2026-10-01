import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Icons } from '@/components/ui/icons';

export default function HomePage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Calming Reassurance Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-reassurance-50 border border-reassurance-100 text-reassurance-700 text-xs sm:text-sm font-medium shadow-sm">
            <Icons.frictionAlert className="w-4 h-4 text-reassurance-500" aria-hidden="true" />
            <span>Overcome Academic Dread &amp; Major Indecision</span>
          </div>

          {/* Main Scholastic Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-edu-slate-900 leading-[1.15]">
            College Major &amp; Career Triage for{' '}
            <span className="text-edu-primary underline decoration-edu-blue-300 decoration-wavy decoration-2">
              Stressed Students
            </span>
          </h1>

          {/* Calming Intro Copy */}
          <p className="text-base sm:text-lg text-edu-slate-600 max-w-2xl mx-auto leading-relaxed">
            Skip the overwhelming 100-question career tests. Answer 4 high-yield questions
            about your energy drivers, problem context, and academic anxieties to unlock
            tailored career pathways and zero-risk trial courses.
          </p>

          {/* Clean Interactive Action Placeholder */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/counselor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-edu-interactive hover:bg-edu-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
            >
              <span>Explore Counselor Dashboard</span>
              <Icons.arrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Scaffolding Status Indicator Card */}
          <div className="mt-12 p-6 rounded-xl border border-edu-slate-200 bg-white/70 backdrop-blur-sm shadow-sm text-left max-w-xl mx-auto">
            <div className="flex items-center gap-2.5 mb-2 font-semibold text-sm text-edu-slate-800">
              <Icons.directMatch className="w-4 h-4 text-edu-interactive" aria-hidden="true" />
              <span>Feature 2 Scaffolding Active</span>
            </div>
            <p className="text-xs text-edu-slate-500 leading-relaxed">
              Application shell initialized with Educational Blue &amp; Slate theme, Next.js App Router,
              and accessible landmark components. Ready for Feature 3 (4-Question Intake Engine).
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
