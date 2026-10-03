import React from 'react';
import type { CareerCard as CareerCardType, TriageSummary, TriageGenerationMeta } from '@/types/career';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';
import { MockNoticeBanner } from './MockNoticeBanner';
import { CareerCard } from './CareerCard';
import { NavigationFooter } from './NavigationFooter';

export interface DossierContainerProps {
  summary: TriageSummary;
  careers: [CareerCardType, CareerCardType, CareerCardType, CareerCardType];
  meta: TriageGenerationMeta;
  studentNickname?: string;
  onStartOver: () => void;
}

export function DossierContainer({
  summary,
  careers,
  meta,
  studentNickname,
  onStartOver,
}: DossierContainerProps) {
  const copy = DOSSIER_COPY.header;

  return (
    <main
      aria-label={DOSSIER_COPY.a11y.dossierLandmark}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fadeIn min-w-0"
    >
      {/* Fallback Notice Banner (Rendered when demo mode / rate limit fallback is active) */}
      {meta?.fallback_used && <MockNoticeBanner engine={meta.engine} />}

      {/* Header & Scholastic Intro */}
      <header className="space-y-4 sm:space-y-6 text-center max-w-3xl mx-auto mb-8 sm:mb-12 min-w-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-reassurance-50 border border-reassurance-100 text-reassurance-700 text-xs sm:text-sm font-medium shadow-2xs">
          <Icons.logo className="w-3.5 h-3.5 text-reassurance-500 shrink-0" aria-hidden="true" />
          <span>{copy.badge}</span>
        </div>

        <h1
          tabIndex={-1}
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-edu-slate-900 leading-[1.2] sm:leading-[1.15] break-words focus:outline-none"
        >
          {copy.title(studentNickname)}
        </h1>

        <p className="text-xs sm:text-base text-edu-slate-600 max-w-2xl mx-auto leading-relaxed">
          {copy.subtitle}
        </p>

        {/* Student Archetype & Narrative Card */}
        <div className="p-5 sm:p-7 rounded-2xl bg-edu-slate-50 border border-edu-slate-200 text-left space-y-3.5 shadow-xs min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edu-slate-200/80 pb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-semibold text-edu-slate-600">
                {copy.archetypeBadgeLabel}
              </span>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold bg-edu-blue-100 text-edu-blue-900 border border-edu-blue-200 min-w-0 break-words">
                {summary.student_archetype}
              </span>
            </div>

            {studentNickname?.trim() && (
              <span className="text-xs text-edu-slate-500 font-medium italic">
                {copy.preparedFor(studentNickname)}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-edu-slate-700 leading-relaxed min-w-0 break-words">
            {summary.triage_narrative}
          </p>

          <p className="text-[11px] sm:text-xs text-edu-slate-500 italic pt-1 border-t border-edu-slate-200/50 min-w-0 break-words">
            {copy.reassuranceNote}
          </p>
        </div>
      </header>

      {/* 2x2 Desktop Grid / 1-Column Mobile Stack */}
      <section
        aria-label={copy.careerSectionLabel}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch min-w-0"
      >
        {careers.map((card, index) => (
          <CareerCard key={card.id || index} card={card} index={index} />
        ))}
      </section>

      {/* Accessible Navigation & Reset Footer */}
      <NavigationFooter onStartOver={onStartOver} />
    </main>
  );
}
