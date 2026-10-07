'use client';

import React, { memo, useState, useCallback } from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';
import { AdmissionRequirementEntry } from '@/data/admissionRequirements';

export interface AdmissionTrackChecklistProps {
  admissionEntry: AdmissionRequirementEntry;
}

/**
 * AdmissionTrackChecklist: Interactive, client-side admission readiness checklist.
 *
 * Strict Guardrails:
 * 1. Client-Only State: Checkbox completions remain purely in React local state. Never sent to API or database.
 * 2. Zero Score Collection: Strictly 0% GPA, GPAX, or exam cutoff references.
 * 3. Verified Official Links: Links point directly to official university admissions portals.
 */
export const AdmissionTrackChecklist = memo(function AdmissionTrackChecklist({
  admissionEntry,
}: AdmissionTrackChecklistProps) {
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(() => new Set());
  const copy = RESULTS_COPY.admissions;

  const handleToggle = useCallback((index: number) => {
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const externalAriaLabel = copy.openPortalAria(admissionEntry.universityNameEn);

  return (
    <div
      data-testid={`admission-checklist-${admissionEntry.id}`}
      className="mt-3.5 rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3.5 text-xs text-slate-700 break-inside-avoid print:bg-white print:border-slate-300"
    >
      {/* Top Meta Line: Track Eligibility & Audit Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-800">
            {copy.trackEligibilityLabel}:
          </span>
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800 border border-indigo-200">
            {admissionEntry.trackEligibility}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            ({admissionEntry.trackEligibilityTh})
          </span>
        </div>

        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          {copy.needsCheckingBadge}
        </span>
      </div>

      {/* Interactive Verification Checklist (Pure Client State) */}
      <div className="space-y-2">
        <h6 className="font-bold text-slate-900 text-xs tracking-tight flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-edu-primary flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{copy.checklistHeading}</span>
        </h6>

        <ul className="space-y-1.5" role="list">
          {admissionEntry.studentVerificationChecklist.map((item, idx) => {
            const isChecked = checkedIndices.has(idx);
            const inputId = `checklist-${admissionEntry.id}-${idx}`;

            return (
              <li key={idx} className="flex items-start gap-2.5">
                <label
                  htmlFor={inputId}
                  className="min-h-[44px] flex items-center gap-2.5 cursor-pointer py-1 select-none w-full"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(idx)}
                    className="h-4 w-4 rounded border-slate-300 text-edu-primary focus:ring-edu-primary focus:ring-offset-1 flex-shrink-0 cursor-pointer"
                  />
                  <span
                    className={`leading-relaxed transition-colors ${
                      isChecked ? 'text-slate-400 line-through' : 'text-slate-700'
                    }`}
                  >
                    {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Official TCAS Round Disclaimer */}
      <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 p-3 text-[11px] text-amber-900 leading-relaxed space-y-1">
        <strong className="font-semibold block">{copy.annualDisclaimerTitle}</strong>
        <p>{admissionEntry.advisoryNote}</p>
      </div>

      {/* Official Portal External Link Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
        <span className="text-[11px] text-slate-500 font-medium">
          {copy.zeroScoreGuaranty}
        </span>

        <a
          href={admissionEntry.officialAdmissionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={externalAriaLabel}
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-edu-primary bg-sky-50 hover:bg-sky-100 border border-sky-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-edu-primary focus-visible:ring-offset-2 focus-visible:outline-none print:hidden"
        >
          <span>{copy.officialPortalButton}</span>
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
      </div>
    </div>
  );
});
