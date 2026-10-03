'use client';

import React from 'react';
import type {
  WizardStep,
  IntakeAnswersState,
  WorkEnvironment,
  ProblemSolvingStyle,
  SocialEnergyStyle,
  StructureTolerance,
  FrictionTolerance,
  HorizonPriority,
  AmbitionTimeline,
} from '@/types/intake';
import { GUIDE_COPY } from '@/content/guideCopy';
import { Icons } from '@/components/ui/icons';

export interface QuestionStepViewProps {
  step: WizardStep;
  answers: IntakeAnswersState;
  validationError?: string;
  onToggleTask: (taskId: string) => void;
  onSelectSubject: (subjectId: string) => void;
  onChangeHesitation: (text: string) => void;
  onSelectEnvironment: (env: WorkEnvironment) => void;
  onSelectProblemSolving: (style: ProblemSolvingStyle) => void;
  onSelectSocialEnergy: (social: SocialEnergyStyle) => void;
  onSelectStructure: (structure: StructureTolerance) => void;
  onSelectFriction: (friction: FrictionTolerance) => void;
  onSelectPriority: (priority: HorizonPriority) => void;
  onSelectAmbition: (ambition: AmbitionTimeline) => void;
}

export function QuestionStepView({
  step,
  answers,
  validationError,
  onToggleTask,
  onSelectSubject,
  onChangeHesitation,
  onSelectEnvironment,
  onSelectProblemSolving,
  onSelectSocialEnergy,
  onSelectStructure,
  onSelectFriction,
  onSelectPriority,
  onSelectAmbition,
}: QuestionStepViewProps) {
  // If step is out of question bounds
  if (step < 1 || step > 10) return null;

  const questions = GUIDE_COPY.questions;

  // Render Question 1: Daily Focus & Task Energy (Multi-Select Chips, Max 2)
  if (step === 1) {
    const q = questions.q1;
    const selectedCount = answers.q1TaskIds.length;

    return (
      <fieldset className="space-y-6 text-left">
        <legend className="w-full text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-3xl font-extrabold text-edu-slate-900 leading-snug">
            {q.title}
          </h2>
          <p className="text-xs sm:text-sm text-edu-slate-600 max-w-xl mx-auto">
            {q.helperText}
          </p>
          <div className="pt-1">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                selectedCount === 2
                  ? 'bg-reassurance-100 text-reassurance-800'
                  : 'bg-edu-slate-100 text-edu-slate-700'
              }`}
            >
              {q.selectionStatus(selectedCount, q.maxSelections)}
            </span>
          </div>
        </legend>

        <div
          role="group"
          aria-label={q.title}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
        >
          {q.options.map((opt) => {
            const isSelected = answers.q1TaskIds.includes(opt.id);
            const isMaxReached = selectedCount >= 2 && !isSelected;

            return (
              <button
                key={opt.id}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                disabled={isMaxReached}
                onClick={() => onToggleTask(opt.id)}
                className={`min-h-[44px] p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none ${
                  isSelected
                    ? 'border-edu-interactive bg-reassurance-50/70 ring-1 ring-edu-interactive shadow-sm'
                    : isMaxReached
                    ? 'border-edu-border-subtle bg-edu-slate-50 opacity-60 cursor-not-allowed'
                    : 'border-edu-border-subtle bg-white hover:border-edu-slate-300 hover:bg-edu-slate-50/50 shadow-xs'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'border-edu-interactive bg-edu-interactive text-white'
                      : 'border-edu-slate-300 bg-white'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <Icons.check className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base text-edu-slate-900">
                    {opt.title}
                  </div>
                  <p className="text-xs sm:text-sm text-edu-slate-600 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </fieldset>
    );
  }

  // Render Question 2: Academic Curiosity (Single-Select Subject Cards)
  if (step === 2) {
    const q = questions.q2;

    return (
      <fieldset className="space-y-6 text-left">
        <legend className="w-full text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-3xl font-extrabold text-edu-slate-900 leading-snug">
            {q.title}
          </h2>
          <p className="text-xs sm:text-sm text-edu-slate-600 max-w-xl mx-auto">
            {q.helperText}
          </p>
        </legend>

        <div
          role="radiogroup"
          aria-label={q.title}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          {q.options.map((opt) => {
            const isSelected = answers.q2SubjectId === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelectSubject(opt.id)}
                className={`min-h-[44px] p-4 rounded-xl border text-left transition-all flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none ${
                  isSelected
                    ? 'border-edu-interactive bg-reassurance-50/70 ring-1 ring-edu-interactive shadow-sm'
                    : 'border-edu-border-subtle bg-white hover:border-edu-slate-300 hover:bg-edu-slate-50/50 shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-edu-slate-100 text-edu-slate-700 text-xs font-medium">
                    {opt.badge}
                  </span>
                  <div className="font-semibold text-sm sm:text-base text-edu-slate-900">
                    {opt.title}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-edu-interactive bg-edu-interactive'
                        : 'border-edu-slate-300 bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </fieldset>
    );
  }

  // Render Question 3: Academic Dread & Hesitation (Thoughtful Textarea)
  if (step === 3) {
    const q = questions.q3;
    const currentText = answers.q3AcademicHesitation || answers.q2Rationale || '';
    const charCount = currentText.length;

    return (
      <fieldset className="space-y-6 text-left max-w-xl mx-auto">
        <legend className="w-full text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-3xl font-extrabold text-edu-slate-900 leading-snug">
            {q.title}
          </h2>
          <p className="text-xs sm:text-sm text-edu-slate-600 leading-relaxed">
            {q.helperText}
          </p>
        </legend>

        <div className="space-y-2">
          <label htmlFor="academic-hesitation-input" className="sr-only">
            {q.title}
          </label>
          <textarea
            id="academic-hesitation-input"
            rows={4}
            maxLength={q.charLimit}
            value={currentText}
            onChange={(e) => onChangeHesitation(e.target.value.slice(0, q.charLimit))}
            placeholder={q.placeholder}
            aria-describedby="hesitation-counter hesitation-error"
            aria-invalid={Boolean(validationError)}
            className="w-full p-4 rounded-xl border border-edu-border-subtle bg-white text-edu-slate-900 text-sm sm:text-base leading-relaxed placeholder:text-edu-slate-400 shadow-sm focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none transition-all resize-none"
          />

          <div className="flex items-center justify-between text-xs text-edu-slate-500">
            <span>Take all the time you need.</span>
            <span
              id="hesitation-counter"
              className={charCount >= q.charLimit ? 'text-amber-600 font-semibold' : ''}
            >
              {q.charCounter(charCount, q.charLimit)}
            </span>
          </div>
        </div>

        {validationError && (
          <p id="hesitation-error" role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </fieldset>
    );
  }

  // Helper for single-choice card question sections (Q4 to Q10)
  const renderSingleChoiceCards = (
    q: { title: string; helperText: string; options: readonly any[] },
    selectedId: string | null | undefined,
    onSelect: (id: any) => void
  ) => {
    return (
      <fieldset className="space-y-6 text-left">
        <legend className="w-full text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-3xl font-extrabold text-edu-slate-900 leading-snug">
            {q.title}
          </h2>
          <p className="text-xs sm:text-sm text-edu-slate-600 max-w-xl mx-auto">
            {q.helperText}
          </p>
        </legend>

        <div
          role="radiogroup"
          aria-label={q.title}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
        >
          {q.options.map((opt) => {
            const isSelected = selectedId === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelect(opt.id)}
                className={`min-h-[44px] p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none ${
                  isSelected
                    ? 'border-edu-interactive bg-reassurance-50/70 ring-1 ring-edu-interactive shadow-sm'
                    : 'border-edu-border-subtle bg-white hover:border-edu-slate-300 hover:bg-edu-slate-50/50 shadow-xs'
                }`}
              >
                <div className="space-y-1.5">
                  {opt.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-edu-slate-100 text-edu-slate-700 text-xs font-medium">
                      {opt.badge}
                    </span>
                  )}
                  <div className="font-semibold text-sm sm:text-base text-edu-slate-900">
                    {opt.title}
                  </div>
                  {opt.description && (
                    <p className="text-xs sm:text-sm text-edu-slate-600 leading-relaxed">
                      {opt.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-edu-interactive bg-edu-interactive'
                        : 'border-edu-slate-300 bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </fieldset>
    );
  };

  // Render Question 4: Work Environment
  if (step === 4) {
    const q = questions.q4;
    return renderSingleChoiceCards(q, answers.q4Environment || answers.q3Environment, onSelectEnvironment);
  }

  // Render Question 5: Problem Solving Style
  if (step === 5) {
    const q = questions.q5;
    return renderSingleChoiceCards(q, answers.q5ProblemSolving, onSelectProblemSolving);
  }

  // Render Question 6: Social Energy & Collaboration
  if (step === 6) {
    const q = questions.q6;
    return renderSingleChoiceCards(q, answers.q6SocialEnergy, onSelectSocialEnergy);
  }

  // Render Question 7: Structure vs Ambiguity
  if (step === 7) {
    const q = questions.q7;
    return renderSingleChoiceCards(q, answers.q7StructureTolerance, onSelectStructure);
  }

  // Render Question 8: Academic Friction Minimization
  if (step === 8) {
    const q = questions.q8;
    return renderSingleChoiceCards(q, answers.q8AcademicFriction, onSelectFriction);
  }

  // Render Question 9: Core Life Horizon Priority
  if (step === 9) {
    const q = questions.q9;
    return renderSingleChoiceCards(q, answers.q9HorizonPriority, onSelectPriority);
  }

  // Render Question 10: Post-College Next Chapter
  if (step === 10) {
    const q = questions.q10;
    return renderSingleChoiceCards(q, answers.q10PostCollegeAmbition || answers.q4Ambition, onSelectAmbition);
  }

  return null;
}
