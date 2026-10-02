'use client';

import React, { useState, useRef, useEffect } from 'react';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  totalSteps?: number;
  onStepClick?: (step: 1 | 2 | 3 | 4) => void;
  canAccessStep?: (step: 1 | 2 | 3 | 4) => boolean;
  isCompleted?: boolean;
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps = 4,
  onStepClick,
  canAccessStep,
  isCompleted = false,
  className,
}: StepIndicatorProps) {
  const steps = INTAKE_COPY.steps;
  const progressPercent = isCompleted ? 100 : ((currentStep - 1) / (totalSteps - 1)) * 100;
  const currentStepData = steps[currentStep - 1] ?? steps[0];
  const [blockedHint, setBlockedHint] = useState<string | null>(null);
  const blockedTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (blockedTimerRef.current) {
        clearTimeout(blockedTimerRef.current);
      }
    };
  }, []);

  const handleStepClick = (stepNum: 1 | 2 | 3 | 4) => {
    if (!onStepClick) return;

    if (canAccessStep && !canAccessStep(stepNum)) {
      if (blockedTimerRef.current) {
        clearTimeout(blockedTimerRef.current);
      }
      setBlockedHint(INTAKE_COPY.validation.navigationBlocked);
      blockedTimerRef.current = setTimeout(() => {
        setBlockedHint(null);
        blockedTimerRef.current = null;
      }, 3500);
      return;
    }

    if (blockedTimerRef.current) {
      clearTimeout(blockedTimerRef.current);
      blockedTimerRef.current = null;
    }
    setBlockedHint(null);
    onStepClick(stepNum);
  };

  return (
    <nav
      aria-label={INTAKE_COPY.a11y.progressNav}
      role="navigation"
      className={cn('w-full space-y-2', className)}
    >
      {/* Polite Screen Reader Live Region for Blocked Jumps */}
      <div className="sr-only" role="status" aria-live="polite">
        {blockedHint ?? ''}
      </div>

      {/* Mobile Condensed Layout (< 640px) */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-edu-slate-600">
          <span className="font-semibold text-edu-primary">
            {INTAKE_COPY.shell.stepCountLabel(currentStep, totalSteps)}
          </span>
          <span className="text-edu-slate-700">{currentStepData.title}</span>
        </div>
        <div
          className="w-full h-2 rounded-full bg-edu-slate-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={INTAKE_COPY.a11y.stepCurrent(currentStep, currentStepData.title)}
        >
          <div
            className="h-full bg-edu-interactive rounded-full transition-all duration-300 ease-out"
            style={{ width: `${isCompleted ? 100 : (currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / Tablet Full 4-Step Track (>= 640px) */}
      <div className="hidden sm:block relative">
        <ol role="list" className="relative z-10 flex items-center justify-between w-full">
          {steps.map((stepItem) => {
            const stepNum = stepItem.step as 1 | 2 | 3 | 4;
            const isStepDone = isCompleted || stepItem.step < currentStep;
            const isCurrent = !isCompleted && stepItem.step === currentStep;
            const isUpcoming = !isCompleted && stepItem.step > currentStep;
            const isAccessible = canAccessStep ? canAccessStep(stepNum) : true;

            const content = (
              <div className="flex flex-col items-center text-center">
                {/* Node Circle */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 border-2',
                    isStepDone &&
                      'bg-edu-interactive text-white border-edu-interactive shadow-sm',
                    isCurrent &&
                      'bg-edu-primary text-white border-edu-primary ring-4 ring-edu-blue-100 shadow-sm',
                    isUpcoming &&
                      'bg-edu-slate-100 text-edu-slate-400 border-edu-slate-200',
                    onStepClick && isAccessible && !isCurrent &&
                      'group-hover:border-edu-interactive group-hover:scale-105'
                  )}
                  aria-label={
                    isStepDone
                      ? INTAKE_COPY.a11y.stepCompleted(stepItem.step, stepItem.title)
                      : isCurrent
                      ? INTAKE_COPY.a11y.stepCurrent(stepItem.step, stepItem.title)
                      : INTAKE_COPY.a11y.stepUpcoming(stepItem.step, stepItem.title)
                  }
                >
                  {isStepDone ? (
                    <Icons.check className="w-4 h-4 text-white stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <span>{stepItem.step}</span>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="mt-2.5 space-y-0.5">
                  <span
                    className={cn(
                      'block text-xs font-semibold tracking-tight transition-colors',
                      isCurrent
                        ? 'text-edu-primary'
                        : isStepDone
                        ? 'text-edu-slate-700'
                        : 'text-edu-slate-400'
                    )}
                  >
                    {stepItem.title}
                  </span>
                  <span className="block text-[11px] text-edu-slate-500 max-w-[120px] leading-tight">
                    {stepItem.description}
                  </span>
                </div>
              </div>
            );

            return (
              <li
                key={stepItem.step}
                className="relative"
                aria-current={isCurrent ? 'step' : undefined}
              >
                {onStepClick ? (
                  <button
                    type="button"
                    onClick={() => handleStepClick(stepNum)}
                    aria-disabled={!isAccessible ? 'true' : undefined}
                    className={cn(
                      'group flex flex-col items-center text-center transition-all focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2 rounded-xl p-1',
                      isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    )}
                  >
                    {content}
                  </button>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ol>

        {/* Progress Background Connecting Line */}
        <div
          aria-hidden="true"
          className="absolute top-4.5 left-6 right-6 -translate-y-1/2 h-0.5 bg-edu-slate-200 z-0"
        >
          <div
            className="h-full bg-edu-interactive transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Visual Navigation Blocked Notice */}
      {blockedHint && (
        <div
          role="alert"
          className="text-xs text-center text-friction-700 bg-friction-50 border border-friction-200 rounded-lg py-1.5 px-3 max-w-md mx-auto animate-fadeIn"
        >
          {blockedHint}
        </div>
      )}
    </nav>
  );
}
