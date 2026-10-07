'use client';

import React from 'react';
import type { IntakeQuestionDefinition } from '@/content/intakeQuestions';
import { Icons } from '@/components/ui/icons';

export interface QuestionCardProps {
  question: IntakeQuestionDefinition;
  selectedIds: string[];
  onToggleOption: (id: string) => void;
  isMultiSelect?: boolean;
  maxSelections?: number;
}

export function QuestionCard({
  question,
  selectedIds,
  onToggleOption,
  isMultiSelect = false,
  maxSelections = 1,
}: QuestionCardProps) {
  const selectedCount = selectedIds.length;

  return (
    <fieldset className="space-y-6 text-left">
      <legend className="w-full text-center space-y-2 mb-6">
        <h2 className="text-xl sm:text-3xl font-extrabold text-edu-slate-900 leading-snug">
          {question.title}
        </h2>
        <p className="text-xs sm:text-sm text-edu-slate-600 max-w-xl mx-auto">
          {question.helperText}
        </p>

        {isMultiSelect && question.selectionStatus && (
          <div className="pt-1">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                selectedCount === maxSelections
                  ? 'bg-reassurance-100 text-reassurance-800'
                  : 'bg-edu-slate-100 text-edu-slate-700'
              }`}
            >
              {question.selectionStatus(selectedCount, maxSelections)}
            </span>
          </div>
        )}
      </legend>

      <div
        role={isMultiSelect ? 'group' : 'radiogroup'}
        aria-label={question.title}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
      >
        {question.options?.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          const isMaxReached = isMultiSelect && selectedCount >= maxSelections && !isSelected;

          return (
            <button
              key={opt.id}
              type="button"
              role={isMultiSelect ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              disabled={isMaxReached}
              onClick={() => onToggleOption(opt.id)}
              className={`min-h-[44px] p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none ${
                isSelected
                  ? 'border-edu-interactive bg-reassurance-50/70 ring-1 ring-edu-interactive shadow-sm'
                  : isMaxReached
                  ? 'border-edu-border-subtle bg-edu-slate-50 opacity-60 cursor-not-allowed'
                  : 'border-edu-border-subtle bg-white hover:border-edu-slate-300 hover:bg-edu-slate-50/50 shadow-xs'
              }`}
            >
              {/* Checkbox / Radio Icon Indicator */}
              <div
                className={`w-5 h-5 rounded-${isMultiSelect ? 'md' : 'full'} border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? 'border-edu-interactive bg-edu-interactive text-white'
                    : 'border-edu-slate-300 bg-white'
                }`}
                aria-hidden="true"
              >
                {isSelected && (
                  isMultiSelect ? (
                    <Icons.check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm sm:text-base text-edu-slate-900">
                    {opt.title}
                  </span>
                  {opt.badge && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-edu-slate-100 text-edu-slate-600">
                      {opt.badge}
                    </span>
                  )}
                </div>

                {opt.description && (
                  <p className="text-xs text-edu-slate-600 leading-relaxed">
                    {opt.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
