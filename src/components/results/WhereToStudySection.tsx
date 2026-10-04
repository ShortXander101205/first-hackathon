'use client';

import React, { memo } from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';

export interface WhereToStudySectionProps {
  roleTitle?: string;
  majors?: string[];
}

/**
 * WhereToStudySection: Groundwork placeholder shell for Feature 9.
 * Isolated with React.memo, min-h-[110px], and CSS contain: content to prevent
 * any layout shifts (CLS = 0.00) or re-renders during card state changes.
 * Strictly guarantees zero AI hallucination of unverified university admissions data.
 */
export const WhereToStudySection = memo(function WhereToStudySection({
  roleTitle,
  majors = [],
}: WhereToStudySectionProps) {
  const copy = RESULTS_COPY.whereToStudy;

  return (
    <section
      aria-label={`${roleTitle ? `${roleTitle} - ` : ''}${copy.title}`}
      className="min-h-[110px] rounded-lg border border-slate-200 bg-slate-50/70 p-4 transition-colors"
      style={{ contain: 'content' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-edu-primary flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {copy.title}
        </h4>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200/60">
          {copy.badge}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-slate-600 mb-2">
        {copy.description}
      </p>

      {majors.length > 0 && (
        <div className="text-xs text-slate-500 mb-2">
          <span className="font-medium text-slate-700">Target Fields:</span>{' '}
          {majors.slice(0, 3).join(', ')}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200/60">
        <svg
          className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>{copy.zeroHallucinationNote}</span>
      </div>
    </section>
  );
});
