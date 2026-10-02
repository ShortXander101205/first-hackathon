'use client';

import React, { useState } from 'react';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface QuestionOneTaskViewProps {
  selectedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  errorMessage?: string;
  className?: string;
}

export function QuestionOneTaskView({
  selectedTaskIds,
  onToggleTask,
  errorMessage,
  className,
}: QuestionOneTaskViewProps) {
  const qCopy = INTAKE_COPY.questionOne;
  const isMaxSelected = selectedTaskIds.length >= 2;
  const [showMaxHint, setShowMaxHint] = useState(false);

  const handleChipClick = (taskId: string) => {
    const isAlreadySelected = selectedTaskIds.includes(taskId);

    if (!isAlreadySelected && isMaxSelected) {
      setShowMaxHint(true);
      return;
    }

    setShowMaxHint(false);
    onToggleTask(taskId);
  };

  return (
    <fieldset className={cn('w-full space-y-6', className)}>
      {/* Question Header */}
      <legend className="w-full">
        <span className="block text-xs font-bold uppercase tracking-wider text-edu-interactive mb-1">
          {INTAKE_COPY.shell.stepCountLabel(qCopy.stepNumber, 4)}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-edu-slate-900 tracking-tight leading-snug">
          {qCopy.title}
        </h2>
        <p className="mt-2 text-sm text-edu-slate-600 leading-relaxed">
          {qCopy.helperText}
        </p>
      </legend>

      {/* Inline Validation Error Alert if present */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-center gap-2 p-3 rounded-xl bg-friction-50 border border-friction-200 text-xs sm:text-sm text-friction-700 font-medium animate-fadeIn"
        >
          <Icons.frictionAlert className="w-4 h-4 text-friction-500 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selection Status Badge */}
      <div className="flex items-center justify-between text-xs font-medium">

        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors',
            selectedTaskIds.length > 0
              ? 'bg-edu-blue-50 border-edu-blue-200 text-edu-primary font-semibold'
              : 'bg-edu-slate-100 border-edu-slate-200 text-edu-slate-600'
          )}
        >
          <Icons.directMatch className="w-3.5 h-3.5 text-edu-interactive" aria-hidden="true" />
          <span>{qCopy.selectionCountLabel(selectedTaskIds.length, 2)}</span>
        </span>

        {/* Max Reached Inline Hint */}
        {showMaxHint && (
          <span
            role="status"
            aria-live="polite"
            className="text-xs text-friction-700 font-medium animate-fadeIn"
          >
            {INTAKE_COPY.a11y.taskMaxReachedHint}
          </span>
        )}
      </div>

      {/* 4 Task Chips (Mobile-First Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {qCopy.options.map((option) => {
          const isSelected = selectedTaskIds.includes(option.id);
          const isDimmed = !isSelected && isMaxSelected;

          return (
            <button
              key={option.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => handleChipClick(option.id)}
              className={cn(
                'group relative flex flex-col justify-between text-left p-5 rounded-xl border-2 transition-all duration-200',
                'min-h-[88px] sm:min-h-[104px] w-full',
                'focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2',
                isSelected &&
                  'border-edu-interactive bg-edu-blue-50/90 shadow-sm ring-1 ring-edu-interactive/30',
                !isSelected && !isDimmed &&
                  'border-edu-slate-200 bg-white hover:border-edu-blue-300 hover:bg-edu-blue-50/30',
                isDimmed &&
                  'border-edu-slate-200 bg-white opacity-70 hover:opacity-100 hover:border-edu-slate-300'
              )}
            >
              <div className="flex items-start justify-between gap-3 w-full">
                <span
                  className={cn(
                    'font-bold text-sm sm:text-base leading-snug transition-colors',
                    isSelected ? 'text-edu-blue-950' : 'text-edu-slate-800'
                  )}
                >
                  {option.title}
                </span>

                {/* Selection Visual Indicator */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 mt-0.5',
                    isSelected
                      ? 'border-edu-interactive bg-edu-interactive text-white shadow-xs'
                      : 'border-edu-slate-300 bg-white group-hover:border-edu-blue-400'
                  )}
                  aria-hidden="true"
                >
                  {isSelected && <Icons.check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>
              </div>

              <p
                className={cn(
                  'mt-2.5 text-xs sm:text-sm leading-relaxed transition-colors',
                  isSelected ? 'text-edu-blue-900/80' : 'text-edu-slate-600'
                )}
              >
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
