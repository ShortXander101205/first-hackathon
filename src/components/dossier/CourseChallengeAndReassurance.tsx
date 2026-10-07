import React from 'react';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';

export interface CourseChallengeAndReassuranceProps {
  challenge: string;
  reassurance: string;
}

export function CourseChallengeAndReassurance({
  challenge,
  reassurance,
}: CourseChallengeAndReassuranceProps) {
  const copy = DOSSIER_COPY.academics;

  if (!challenge && !reassurance) {
    return null;
  }

  return (
    <div className="bg-reassurance-50 border border-reassurance-100 rounded-xl p-4 space-y-3">
      {/* Section Sub-heading */}
      <h3 className="text-xs sm:text-sm font-bold text-edu-slate-800 tracking-tight flex items-center gap-2">
        <Icons.academic className="w-4 h-4 text-edu-primary shrink-0" aria-hidden="true" />
        <span>{copy.sectionTitle}</span>
      </h3>

      {/* The Academic Hurdle */}
      {challenge && (
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-edu-slate-600 block">
            {copy.challengeLabel}
          </span>
          <p className="text-xs sm:text-sm font-medium text-edu-slate-900 leading-snug min-w-0 break-words">
            {challenge}
          </p>
        </div>
      )}

      {/* Supportive Reassurance */}
      {reassurance && (
        <div className="bg-white/80 border border-reassurance-200/80 rounded-lg p-3 space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-growth-700 text-xs font-semibold">
            <Icons.verifiedCourse className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{copy.reassuranceLabel}</span>
          </div>
          <p className="text-xs text-edu-slate-700 leading-relaxed min-w-0 break-words">
            {reassurance}
          </p>
        </div>
      )}
    </div>
  );
}
