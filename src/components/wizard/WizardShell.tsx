'use client';

import React from 'react';
import { StepIndicator } from '@/components/wizard/StepIndicator';
import { NicknameInput } from '@/components/wizard/NicknameInput';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface WizardShellProps {
  children: React.ReactNode;
  currentStep: 1 | 2 | 3 | 4;
  totalSteps?: number;
  onStepClick?: (step: 1 | 2 | 3 | 4) => void;
  canAccessStep?: (step: 1 | 2 | 3 | 4) => boolean;
  onResetClick?: () => void;
  studentNickname?: string;
  onNicknameChange?: (nickname: string) => void;
  isCompleted?: boolean;
  className?: string;
}

export function WizardShell({
  children,
  currentStep,
  totalSteps = 4,
  onStepClick,
  canAccessStep,
  onResetClick,
  studentNickname = '',
  onNicknameChange,
  isCompleted = false,
  className,
}: WizardShellProps) {
  return (
    <section
      aria-label={INTAKE_COPY.a11y.wizardLandmark}
      className={cn(
        'w-full max-w-3xl mx-auto bg-white border border-edu-slate-200 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-8 lg:p-10',
        'transition-opacity duration-200',
        className
      )}
    >
      {/* Calming Reassurance Banner & Reset Action Header */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-edu-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-reassurance-50 border border-reassurance-100 text-reassurance-700 text-xs font-semibold w-fit">
              <Icons.frictionAlert className="w-3.5 h-3.5 text-reassurance-500 shrink-0" aria-hidden="true" />
              <span>{INTAKE_COPY.shell.badge}</span>
            </div>
            <span className="text-[11px] sm:text-xs text-edu-slate-500 font-medium">
              {INTAKE_COPY.shell.subBadge}
            </span>
          </div>

          {/* Teacher & Student Reset Trigger Button */}
          {onResetClick && (
            <button
              type="button"
              onClick={onResetClick}
              className="inline-flex items-center gap-1.5 text-xs text-edu-slate-500 hover:text-edu-slate-800 transition-colors py-1 px-2 rounded-md hover:bg-edu-slate-100 focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2 self-start sm:self-auto"
            >
              <Icons.reset className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{INTAKE_COPY.resetDialog.triggerButton}</span>
            </button>
          )}
        </div>

        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-edu-slate-600 leading-relaxed">
          {INTAKE_COPY.shell.reassuranceNote}
        </p>

        {/* Optional Student Nickname Input (Presented gently on Step 1) */}
        {currentStep === 1 && onNicknameChange && (
          <div className="mt-4 pt-4 border-t border-edu-slate-100 max-w-md">
            <NicknameInput
              value={studentNickname}
              onChange={onNicknameChange}
            />
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mb-6 sm:mb-8">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={onStepClick}
          canAccessStep={canAccessStep}
          isCompleted={isCompleted}
        />
      </div>

      {/* Question View Content Slot */}
      <div className="w-full">
        {children}
      </div>
    </section>
  );
}
