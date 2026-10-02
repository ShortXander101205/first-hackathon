'use client';

import React from 'react';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface QuestionTwoSubjectViewProps {
  selectedSubjectId: string | null;
  onSelectSubject: (subjectId: string) => void;
  noteText: string;
  onChangeNoteText: (text: string) => void;
  className?: string;
}

export function QuestionTwoSubjectView({
  selectedSubjectId,
  onSelectSubject,
  noteText,
  onChangeNoteText,
  className,
}: QuestionTwoSubjectViewProps) {
  const qCopy = INTAKE_COPY.questionTwo;
  const currentLength = noteText.length;
  const maxLimit = qCopy.characterMaxLimit;
  const isNearLimit = currentLength >= 140;
  const isAtLimit = currentLength >= maxLimit;

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

      {/* Primary Subject Chips Section */}
      <div className="space-y-3 pt-1">
        <span className="block text-xs font-semibold text-edu-slate-700">
          {qCopy.subjectChipSectionLabel}
        </span>
        <div
          role="radiogroup"
          aria-label={qCopy.subjectChipSectionLabel}
          className="flex flex-wrap gap-2.5 sm:gap-3"
        >
          {qCopy.options.map((subject) => {
            const isSelected = selectedSubjectId === subject.id;

            return (
              <button
                key={subject.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectSubject(subject.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200',
                  'min-h-[44px] min-w-[44px]',
                  'focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2',
                  isSelected &&
                    'bg-edu-primary text-white border-2 border-edu-primary shadow-sm ring-1 ring-edu-primary/20',
                  !isSelected &&
                    'bg-edu-slate-100 text-edu-slate-700 border-2 border-edu-slate-200 hover:border-edu-blue-300 hover:bg-edu-blue-50/50'
                )}
              >
                {isSelected ? (
                  <Icons.check className="w-4 h-4 text-white stroke-[2.5]" aria-hidden="true" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-edu-slate-300 shrink-0" aria-hidden="true" />
                )}
                <span>{subject.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 150-Character Capped Textarea Section */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="q2-friction-notes"
            className="block text-xs sm:text-sm font-semibold text-edu-slate-800"
          >
            {qCopy.textAreaLabel}
          </label>
          {/* Visual Live Character Counter */}
          <span
            className={cn(
              'text-xs font-mono transition-colors',
              isNearLimit ? 'text-friction-700 font-semibold' : 'text-edu-slate-500'
            )}
            aria-hidden="true"
          >
            {qCopy.characterCounter(currentLength, maxLimit)}
          </span>
        </div>

        <textarea
          id="q2-friction-notes"
          value={noteText}
          onChange={(e) => onChangeNoteText(e.target.value.slice(0, maxLimit))}
          maxLength={maxLimit}
          rows={3}
          placeholder={qCopy.textAreaPlaceholder}
          className={cn(
            'w-full p-3.5 rounded-xl border-2 text-sm leading-relaxed transition-all duration-200',
            'placeholder:text-edu-slate-400 bg-white text-edu-slate-900',
            'focus:outline-none focus:border-edu-interactive focus:ring-2 focus:ring-edu-interactive/30',
            isNearLimit && 'border-friction-500/80',
            !isNearLimit && 'border-edu-slate-200'
          )}
        />

        {/* Discrete Milestone Live Announcement for Screen Readers */}
        <div className="sr-only" role="status" aria-live="polite">
          {isAtLimit
            ? INTAKE_COPY.a11y.characterLimitReached
            : isNearLimit
            ? INTAKE_COPY.a11y.characterMilestoneWarning(maxLimit - currentLength)
            : ''}
        </div>

        {/* Visual Near-Limit Warning Hint */}
        {isNearLimit && (
          <p className="text-xs text-friction-700 flex items-center gap-1.5 animate-fadeIn">
            <Icons.frictionAlert className="w-3.5 h-3.5 text-friction-500 shrink-0" aria-hidden="true" />
            <span>{qCopy.characterLimitWarning}</span>
          </p>
        )}
      </div>
    </fieldset>
  );
}
