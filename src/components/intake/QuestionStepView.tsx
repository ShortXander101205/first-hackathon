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
import { QuestionCard } from './QuestionCard';

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

  // Step 1: Tasks & Intellectual Energy (Multi-Select, Max 2)
  if (step === 1) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q1}
          selectedIds={answers.q1TaskIds}
          onToggleOption={onToggleTask}
          isMultiSelect={true}
          maxSelections={questions.q1.maxSelections ?? 2}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  // Step 2: Academic Curiosity Subject (Single-Select)
  if (step === 2) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q2}
          selectedIds={answers.q2SubjectId ? [answers.q2SubjectId] : []}
          onToggleOption={onSelectSubject}
          isMultiSelect={false}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  // Step 3: Academic Hesitation & Worry (Free Textarea)
  if (step === 3) {
    const q = questions.q3;
    const currentText = answers.q3AcademicHesitation || answers.q2Rationale || '';
    const charCount = currentText.length;
    const limit = q.charLimit ?? 200;

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
            maxLength={limit}
            value={currentText}
            onChange={(e) => onChangeHesitation(e.target.value.slice(0, limit))}
            placeholder={q.placeholder}
            aria-describedby="hesitation-counter hesitation-error"
            aria-invalid={Boolean(validationError)}
            className="w-full p-4 rounded-xl border border-edu-border-subtle bg-white text-edu-slate-900 text-sm sm:text-base leading-relaxed placeholder:text-edu-slate-400 shadow-sm focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none transition-all resize-none"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{q.reassuranceHint || 'Take all the time you need.'}</span>
            <span
              id="hesitation-counter"
              className={charCount >= limit ? 'text-amber-600 font-semibold' : ''}
            >
              {q.charCounter ? q.charCounter(charCount, limit) : `${charCount}/${limit}`}
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

  // Step 4: Physical Work Setting
  if (step === 4) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q4}
          selectedIds={answers.q4Environment ? [answers.q4Environment] : []}
          onToggleOption={(id) => onSelectEnvironment(id as WorkEnvironment)}
          isMultiSelect={false}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  // Step 5: Problem Solving Mindset
  if (step === 5) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q5}
          selectedIds={answers.q5ProblemSolving ? [answers.q5ProblemSolving] : []}
          onToggleOption={(id) => onSelectProblemSolving(id as ProblemSolvingStyle)}
          isMultiSelect={false}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  // Step 6: Social Interaction & Energy Rhythm
  if (step === 6) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q6}
          selectedIds={answers.q6SocialEnergy ? [answers.q6SocialEnergy] : []}
          onToggleOption={(id) => onSelectSocialEnergy(id as SocialEnergyStyle)}
          isMultiSelect={false}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  // Step 7: Structure vs Autonomy
  if (step === 7) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q7}
          selectedIds={answers.q7StructureTolerance ? [answers.q7StructureTolerance] : []}
          onToggleOption={(id) => onSelectStructure(id as StructureTolerance)}
          isMultiSelect={false}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  // Step 8: Academic Friction Boundary
  if (step === 8) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q8}
          selectedIds={answers.q8AcademicFriction ? [answers.q8AcademicFriction] : []}
          onToggleOption={(id) => onSelectFriction(id as FrictionTolerance)}
          isMultiSelect={false}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  // Step 9: Core Life Priority & Horizon
  if (step === 9) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q9}
          selectedIds={answers.q9HorizonPriority ? [answers.q9HorizonPriority] : []}
          onToggleOption={(id) => onSelectPriority(id as HorizonPriority)}
          isMultiSelect={false}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  // Step 10: Post-College Next Chapter
  if (step === 10) {
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q10}
          selectedIds={answers.q10PostCollegeAmbition ? [answers.q10PostCollegeAmbition] : []}
          onToggleOption={(id) => onSelectAmbition(id as AmbitionTimeline)}
          isMultiSelect={false}
        />
        {validationError && (
          <p role="alert" className="text-xs sm:text-sm text-red-600 font-medium text-center">
            {validationError}
          </p>
        )}
      </div>
    );
  }

  return null;
}
