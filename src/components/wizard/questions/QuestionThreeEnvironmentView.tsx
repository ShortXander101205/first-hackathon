'use client';

import React from 'react';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export type EnvironmentChoice = 'REMOTE_DESK' | 'ACTIVE_FIELD_LAB';

export interface QuestionThreeEnvironmentViewProps {
  selectedEnvironment: EnvironmentChoice | null;
  onSelectEnvironment: (env: EnvironmentChoice) => void;
  className?: string;
}

export function QuestionThreeEnvironmentView({
  selectedEnvironment,
  onSelectEnvironment,
  className,
}: QuestionThreeEnvironmentViewProps) {
  const qCopy = INTAKE_COPY.questionThree;

  return (
    <fieldset className={cn('w-full space-y-6', className)} role="radiogroup">
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

      {/* Binary Toggle Cards (Mobile-First 1-column expanding to 2-column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {qCopy.options.map((option) => {
          const isSelected = selectedEnvironment === option.id;
          const isRemote = option.id === 'REMOTE_DESK';

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectEnvironment(option.id as EnvironmentChoice)}
              className={cn(
                'group relative flex flex-col justify-between text-left p-5 sm:p-6 rounded-xl border-2 transition-all duration-200',
                'min-h-[140px] w-full',
                'focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2',
                isSelected &&
                  'border-edu-interactive bg-edu-blue-50/90 shadow-sm ring-1 ring-edu-interactive/30',
                !isSelected &&
                  'border-edu-slate-200 bg-white hover:border-edu-blue-300 hover:bg-edu-blue-50/30'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isSelected ? 'bg-edu-interactive text-white' : 'bg-edu-slate-100 text-edu-slate-600'
                      )}
                      aria-hidden="true"
                    >
                      {isRemote ? <Icons.laptop className="w-4 h-4" /> : <Icons.flask className="w-4 h-4" />}
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-edu-slate-100 text-edu-slate-600">
                      {option.badge}
                    </span>
                  </div>

                  {/* Radio Visual Checkmark */}
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0',
                      isSelected
                        ? 'border-edu-interactive bg-edu-interactive text-white'
                        : 'border-edu-slate-300 bg-white group-hover:border-edu-blue-400'
                    )}
                    aria-hidden="true"
                  >
                    {isSelected && <Icons.check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </div>

                <h3
                  className={cn(
                    'font-bold text-base leading-snug transition-colors',
                    isSelected ? 'text-edu-blue-950' : 'text-edu-slate-800'
                  )}
                >
                  {option.title}
                </h3>
              </div>

              <p
                className={cn(
                  'mt-3 text-xs sm:text-sm leading-relaxed transition-colors',
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
