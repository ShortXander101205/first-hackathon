'use client';

import React from 'react';
import { StepIndicator } from '@/components/wizard/StepIndicator';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface WizardShellProps {
  children: React.ReactNode;
  currentStep: 1 | 2 | 3 | 4;
  totalSteps?: number;
  className?: string;
}

export function WizardShell({
  children,
  currentStep,
  totalSteps = 4,
  className,
}: WizardShellProps) {
  return (
    <section
      aria-label={INTAKE_COPY.a11y.wizardLandmark}
      className={cn(
        'w-full max-w-3xl mx-auto bg-white border border-edu-slate-200 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-8 lg:p-10',
        className
      )}
    >
      {/* Calming Reassurance Banner */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-edu-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-reassurance-50 border border-reassurance-100 text-reassurance-700 text-xs font-semibold w-fit">
            <Icons.frictionAlert className="w-3.5 h-3.5 text-reassurance-500 shrink-0" aria-hidden="true" />
            <span>{INTAKE_COPY.shell.badge}</span>
          </div>
          <span className="text-[11px] sm:text-xs text-edu-slate-500 font-medium">
            {INTAKE_COPY.shell.subBadge}
          </span>
        </div>
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-edu-slate-600 leading-relaxed">
          {INTAKE_COPY.shell.reassuranceNote}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6 sm:mb-8">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Question View Content Slot */}
      <div className="w-full">
        {children}
      </div>
    </section>
  );
}
