'use client';

import React, { memo, useMemo } from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';
import { matchProgramsForCard } from '@/lib/universityMatcher';
import { UniversityProgramBadge } from './UniversityProgramBadge';
import { ApprovedField } from '@/data/careerCatalog';

export interface WhereToStudySectionProps {
  roleTitle?: string;
  majors?: string[];
  broadField?: ApprovedField | string;
}

/**
 * WhereToStudySection: Verified Regional Higher Education Panel in PathLess Framework v2.
 * Isolated with React.memo, min-h-[110px], and CSS contain: content to prevent
 * any layout shifts (CLS = 0.00) or re-renders during card state changes.
 * Strictly guarantees zero AI hallucination of unverified university admissions data.
 */
export const WhereToStudySection = memo(function WhereToStudySection({
  roleTitle,
  majors = [],
  broadField,
}: WhereToStudySectionProps) {
  const copy = RESULTS_COPY.whereToStudy;

  // Pure deterministic lookup
  const matchResult = useMemo(
    () => matchProgramsForCard({ majors, broadField }),
    [majors, broadField]
  );

  const { matchedPrograms, fallbackNoticeRequired } = matchResult;

  return (
    <section
      aria-label={`${roleTitle ? `${roleTitle} - ` : ''}${copy.title}`}
      className="min-h-[110px] rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 transition-colors space-y-3.5"
      style={{ contain: 'content' }}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
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
          <span>{copy.title}</span>
        </h4>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          {copy.verifiedRegistryBadge}
        </span>
      </div>

      {/* Explanatory Context */}
      <p className="text-xs leading-relaxed text-slate-600">
        {copy.description}
      </p>

      {majors.length > 0 && (
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">{copy.targetMajorsLabel}:</span>{' '}
          {majors.slice(0, 3).join(', ')}
        </div>
      )}

      {/* Verified Programs Grid or Calm Fallback */}
      {!fallbackNoticeRequired && matchedPrograms.length > 0 ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2.5">
            {matchedPrograms.map((program) => (
              <UniversityProgramBadge key={program.programId} program={program} />
            ))}
          </div>

          {/* Official Admissions Office Disclaimer */}
          <div className="rounded-lg border border-amber-200/70 bg-amber-50/60 p-3 text-xs text-amber-900 leading-relaxed">
            <strong className="font-semibold block mb-0.5">{copy.admissionsNoticeTitle}:</strong>
            <span>{copy.admissionsNoticeBody}</span>
          </div>
        </div>
      ) : (
        /* Calm Fallback State */
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <svg
              className="w-4 h-4 text-sky-600 flex-shrink-0"
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
            <span>{copy.fallbackTitle}</span>
          </div>
          <p className="leading-relaxed">
            {copy.fallbackDescription(majors[0] || 'this field')}
          </p>
        </div>
      )}

      {/* Zero AI Hallucination & Advisor Guarantee Footer */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-200/80">
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
