'use client';

import React from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';
import { GuideSummary } from '@/types/career';

export interface ResultsHeaderProps {
  studentName?: string;
  summary?: GuideSummary;
  fallbackUsed?: boolean;
}

/**
 * ResultsHeader: Top presentation layer for PathLess Guide v2.
 * Displays page h1, advisory guide disclaimer, and student archetype summary.
 * Strictly free of clinical or technical jargon.
 */
export function ResultsHeader({
  studentName,
  summary,
  fallbackUsed = false,
}: ResultsHeaderProps) {
  const copy = RESULTS_COPY.header;
  const firstName = studentName?.trim() ? studentName.trim().split(/\s+/)[0] : '';
  const title = firstName ? copy.personalizedTitle(firstName) : copy.defaultTitle;
  const archetype = summary?.studentArchetype || summary?.student_archetype || copy.defaultArchetype;
  const narrative =
    summary?.narrativeSummary ||
    summary?.narrative_summary ||
    summary?.triage_narrative ||
    copy.defaultNarrative;

  return (
    <header className="mb-8 space-y-6">
      {/* Brand & Badge Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-edu-tint px-3 py-1 text-xs font-semibold text-edu-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-edu-primary" aria-hidden="true" />
          {copy.badge}
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          {copy.subtitle}
        </p>
      </div>

      {/* Advisory Guide Notice (Empathetic Reassurance) */}
      <div
        role="region"
        aria-label={copy.disclaimerTitle}
        className="rounded-xl border border-sky-200/80 bg-sky-50/70 p-4 text-sky-900 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold text-sky-950">
              {copy.disclaimerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-sky-900 font-medium leading-relaxed">
              {copy.advisoryNote || copy.disclaimerBody}
            </p>
            <p className="text-xs text-sky-800 leading-relaxed">
              {copy.advisorReminder || copy.disclaimerBody}
            </p>
          </div>
        </div>
      </div>

      {/* Student Discovery Profile Archetype */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {copy.archetypeLabel}
          </span>
          {fallbackUsed && (
            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
              {copy.demoModeNotice}
            </span>
          )}
        </div>
        <div className="text-lg sm:text-xl font-bold text-slate-900">
          {archetype}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {narrative}
        </p>
      </div>
    </header>
  );
}
