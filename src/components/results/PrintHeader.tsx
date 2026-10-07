'use client';

import React, { useState, useEffect } from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';

export interface PrintHeaderProps {
  studentName?: string;
  gradeLevel?: string;
  fallbackUsed?: boolean;
}

/**
 * PrintHeader: Dedicated print-optimized header block.
 * Visible exclusively in print view (`hidden print:block`).
 * 
 * Strict Privacy Rule (AC-PRINT-03):
 * Strictly displays Student Name, Grade Level, and Date Generated.
 * Student ID is strictly omitted for student privacy.
 */
export function PrintHeader({
  studentName,
  gradeLevel,
  fallbackUsed = false,
}: PrintHeaderProps) {
  const copy = RESULTS_COPY.printHeader;
  const [mountedDate, setMountedDate] = useState<string>('');

  useEffect(() => {
    // Generate localized date only on client mount to prevent SSR hydration mismatch
    const now = new Date();
    setMountedDate(
      now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const formattedGrade = gradeLevel
    ? gradeLevel.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : copy.defaultGrade;

  return (
    <header className="hidden print:block mb-8 pb-6 border-b-2 border-slate-300 text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {copy.institution}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {copy.confidentialNotice}
          </p>
        </div>
        {fallbackUsed && (
          <div className="border border-amber-300 bg-amber-50 px-3 py-1 rounded text-xs font-semibold text-amber-800">
            {copy.sampleDataNotice}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-200 text-xs">
        <div>
          <span className="font-semibold text-slate-600 block">{copy.nameLabel}</span>
          <span className="text-sm font-bold text-slate-900">
            {studentName?.trim() || copy.defaultStudentName}
          </span>
        </div>
        <div>
          <span className="font-semibold text-slate-600 block">{copy.gradeLabel}</span>
          <span className="text-sm font-medium text-slate-900">
            {formattedGrade}
          </span>
        </div>
        <div>
          <span className="font-semibold text-slate-600 block">{copy.dateLabel}</span>
          <span className="text-sm font-medium text-slate-900">
            {mountedDate || copy.defaultDate}
          </span>
        </div>
      </div>

      {/* Persistent Advisor & Student Discussion Note */}
      <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
        <strong className="text-slate-900">{copy.advisorNoteTitle}: </strong>
        <span>{copy.advisorNoteBody}</span>
      </div>
    </header>
  );
}
