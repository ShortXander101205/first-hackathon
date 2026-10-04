'use client';

import React, { memo } from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';
import { UniversityProgramCardData } from '@/types/university';

export interface UniversityProgramBadgeProps {
  program: UniversityProgramCardData;
}

export const UniversityProgramBadge = memo(function UniversityProgramBadge({
  program,
}: UniversityProgramBadgeProps) {
  const copy = RESULTS_COPY.whereToStudy;

  const isPublic = program.institutionType === 'PUBLIC_AUTONOMOUS';
  const typeLabel = isPublic ? copy.publicAutonomousLabel : copy.privateLabel;
  const statusLabel =
    program.verificationStatus === 'NEEDS_CHECKING'
      ? copy.needsCheckingBadge
      : copy.verifiedBadge;

  const externalAriaLabel = copy.openProgramLinkAria(
    program.programNameEn,
    program.universityNameEn
  );

  return (
    <article
      data-testid={`university-program-${program.programId}`}
      className="rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:border-slate-300 hover:shadow-2xs space-y-2.5 break-inside-avoid"
    >
      {/* Top Meta Line: Institution, Badges, Region */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-xs text-slate-900">
            {program.universityNameEn}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            ({program.universityNameTh})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
              isPublic
                ? 'bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
            }`}
          >
            {typeLabel}
          </span>

          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Program Name & Faculty */}
      <div>
        <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
          <span className="text-edu-primary font-semibold mr-1">[{program.degreeType}]</span>
          {program.programNameEn}
        </h5>
        <p className="text-[11px] text-slate-600 mt-0.5">
          <span className="text-slate-700 font-medium mr-1">({program.degreeTypeTh})</span>
          {program.programNameTh} • {program.facultyEn} ({program.facultyTh})
        </p>
      </div>

      {/* Footer: Campus, Last Checked, and External Link Touch Target */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>📍 {program.campus} ({program.region})</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            {copy.lastCheckedLabel}: {program.lastChecked}
          </span>
        </div>

        {/* 44x44px Minimum Touch Target Anchor (Clean text fallback in print) */}
        <a
          href={program.officialWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={externalAriaLabel}
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-edu-primary bg-sky-50 hover:bg-sky-100 border border-sky-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-edu-primary focus-visible:ring-offset-2 focus-visible:outline-none print:hidden"
        >
          <span>{copy.visitOfficialProgramCta}</span>
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <span className="hidden print:inline text-[10px] text-slate-500 font-mono">
          {program.officialWebsiteUrl}
        </span>
      </div>
    </article>
  );
});
