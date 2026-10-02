'use client';

import React from 'react';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isLastStep: boolean;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function NavigationControls({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
  isLastStep,
  previousLabel,
  nextLabel,
  className,
}: NavigationControlsProps) {
  const navCopy = INTAKE_COPY.navigation;
  const currentNextLabel =
    nextLabel ?? (isLastStep ? navCopy.review : navCopy.next);
  const currentPreviousLabel = previousLabel ?? navCopy.previous;

  const handleNextClick = (e: React.MouseEvent) => {
    if (isNextDisabled) {
      e.preventDefault();
      return;
    }
    onNext();
  };

  const handlePreviousClick = (e: React.MouseEvent) => {
    if (isPreviousDisabled) {
      e.preventDefault();
      return;
    }
    onPrevious();
  };

  return (
    <div
      className={cn(
        'pt-6 mt-8 border-t border-edu-slate-200',
        'flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full',
        className
      )}
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePreviousClick}
        disabled={isPreviousDisabled}
        aria-disabled={isPreviousDisabled ? 'true' : undefined}
        aria-label={navCopy.previousAriaLabel}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          'min-h-[44px] sm:min-w-[110px] w-full sm:w-auto',
          'focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2',
          isPreviousDisabled &&
            'opacity-40 cursor-not-allowed bg-edu-slate-50 border border-edu-slate-200 text-edu-slate-400',
          !isPreviousDisabled &&
            'bg-white border border-edu-slate-300 text-edu-slate-700 hover:bg-edu-slate-100 hover:text-edu-slate-900 shadow-xs'
        )}
      >
        <Icons.arrowLeft className="w-4 h-4 text-edu-slate-500" aria-hidden="true" />
        <span>{currentPreviousLabel}</span>
      </button>

      {/* Next / Review Button Wrapper */}
      <div className="flex flex-col items-center sm:items-end w-full sm:w-auto gap-1.5">
        <button
          type="button"
          onClick={handleNextClick}
          aria-disabled={isNextDisabled ? 'true' : undefined}
          aria-describedby={isNextDisabled ? 'next-disabled-notice' : undefined}
          aria-label={isLastStep ? navCopy.reviewAriaLabel : navCopy.nextAriaLabel}
          className={cn(
            'inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
            'min-h-[44px] sm:min-w-[140px] w-full sm:w-auto shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2',
            isNextDisabled &&
              'opacity-50 cursor-not-allowed bg-edu-slate-300 text-edu-slate-500 shadow-none',
            !isNextDisabled &&
              'bg-edu-interactive text-white hover:bg-edu-blue-700 hover:shadow'
          )}
        >
          <span>{currentNextLabel}</span>
          <Icons.arrowRight className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Visually Hidden Notification for Screen Readers when Next is Disabled */}
        {isNextDisabled && (
          <span id="next-disabled-notice" className="sr-only">
            {navCopy.disabledNotice}
          </span>
        )}
      </div>
    </div>
  );
}
