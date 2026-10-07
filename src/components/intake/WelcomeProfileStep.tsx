'use client';

import React from 'react';
import type { StudentProfile, GradeLevel } from '@/types/intake';
import { GUIDE_COPY } from '@/content/guideCopy';
import { Icons } from '@/components/ui/icons';

export interface WelcomeProfileStepProps {
  profile: StudentProfile;
  validationErrors?: {
    fullName?: string;
    gradeLevel?: string;
    studentId?: string;
  };
  onUpdateProfile: (profile: Partial<StudentProfile>) => void;
  onContinue: () => void;
  isValid: boolean;
}

export function WelcomeProfileStep({
  profile,
  validationErrors,
  onUpdateProfile,
  onContinue,
  isValid,
}: WelcomeProfileStepProps) {
  const copy = GUIDE_COPY.welcome;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProfile({ fullName: e.target.value.slice(0, 100) });
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateProfile({ gradeLevel: e.target.value as GradeLevel });
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProfile({ studentId: e.target.value.slice(0, 64) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onContinue();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2 sm:py-6 px-4 sm:px-6">
      {/* Header & Hero Badge */}
      <div className="text-center space-y-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-reassurance-50 border border-reassurance-100 text-reassurance-700 text-xs sm:text-sm font-medium shadow-sm">
          <Icons.frictionAlert className="w-3.5 h-3.5 text-reassurance-500 shrink-0" aria-hidden="true" />
          <span>{GUIDE_COPY.shell.badge}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-edu-slate-900 leading-snug">
          {copy.heading}
        </h1>

        <p className="text-sm sm:text-base text-edu-slate-600 max-w-xl mx-auto leading-relaxed">
          {copy.subheading}
        </p>
      </div>

      {/* Privacy Assurance Banner */}
      <div
        className="mb-8 p-4 rounded-xl bg-edu-surface-muted border border-edu-border-subtle flex items-start gap-3.5 text-left"
        role="region"
        aria-label={copy.privacyPromiseTitle}
      >
        <Icons.shield className="w-5 h-5 text-reassurance-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <h2 className="text-xs sm:text-sm font-semibold text-edu-slate-900">
            {copy.privacyPromiseTitle}
          </h2>
          <p className="text-xs sm:text-sm text-edu-slate-600 leading-relaxed">
            {copy.privacyPromiseBody}
          </p>
        </div>
      </div>

      {/* Student Profile Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Field 1: Full Name */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="student-full-name"
            className="block text-sm font-semibold text-edu-slate-900"
          >
            {copy.fields.fullNameLabel} <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="student-full-name"
            type="text"
            required
            autoComplete="name"
            maxLength={100}
            value={profile.fullName || ''}
            onChange={handleNameChange}
            placeholder={copy.fields.fullNamePlaceholder}
            aria-describedby="full-name-helper full-name-error"
            aria-invalid={Boolean(validationErrors?.fullName)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-edu-border-subtle bg-white text-edu-slate-900 text-sm sm:text-base shadow-sm placeholder:text-edu-slate-400 focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none transition-all"
          />
          <p id="full-name-helper" className="text-xs text-edu-slate-500">
            {copy.fields.fullNameHelper}
          </p>
          {validationErrors?.fullName && (
            <p id="full-name-error" role="alert" className="text-xs text-red-600 font-medium">
              {validationErrors.fullName}
            </p>
          )}
        </div>

        {/* Field 2: Grade Level */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="student-grade-level"
            className="block text-sm font-semibold text-edu-slate-900"
          >
            {copy.fields.gradeLevelLabel} <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="student-grade-level"
            required
            value={profile.gradeLevel || 'grade_10'}
            onChange={handleGradeChange}
            aria-invalid={Boolean(validationErrors?.gradeLevel)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-edu-border-subtle bg-white text-edu-slate-900 text-sm sm:text-base shadow-sm focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none transition-all"
          >
            {copy.fields.gradeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {validationErrors?.gradeLevel && (
            <p id="grade-level-error" role="alert" className="text-xs text-red-600 font-medium">
              {validationErrors.gradeLevel}
            </p>
          )}
        </div>

        {/* Field 3: Student ID (Optional) */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="student-id"
            className="block text-sm font-semibold text-edu-slate-900"
          >
            {copy.fields.studentIdLabel}
          </label>
          <input
            id="student-id"
            type="text"
            autoComplete="off"
            maxLength={64}
            value={profile.studentId || ''}
            onChange={handleStudentIdChange}
            placeholder={copy.fields.studentIdPlaceholder}
            aria-describedby="student-id-helper"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-edu-border-subtle bg-white text-edu-slate-900 text-sm sm:text-base shadow-sm placeholder:text-edu-slate-400 focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none transition-all"
          />
          <p id="student-id-helper" className="text-xs text-edu-slate-500">
            {copy.fields.studentIdHelper}
          </p>
        </div>

        {/* Submit / Begin Exploration CTA */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isValid}
            className="w-full min-h-[44px] px-6 py-3 rounded-xl bg-edu-interactive hover:bg-edu-interactive-hover disabled:bg-edu-slate-200 disabled:text-edu-slate-400 disabled:cursor-not-allowed text-white font-semibold text-base shadow-sm focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex items-center justify-center gap-2"
          >
            <span>{copy.ctaButton}</span>
            <Icons.arrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
