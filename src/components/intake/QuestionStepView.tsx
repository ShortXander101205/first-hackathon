'use client';

import React from 'react';
import type {
  WizardStep,
  IntakeAnswersState,
  HighSchoolTrack,
  WorkEnvironment,
  CollaborationStyle,
  SocialEnergyStyle,
  ProblemSolvingStyle,
  StructureTolerance,
  PracticalWorkContext,
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
  onSelectTrack?: (track: HighSchoolTrack) => void;
  onChangeHesitation: (text: string) => void;
  onSelectEnvironment: (env: WorkEnvironment) => void;
  onSelectCollaboration?: (collab: CollaborationStyle) => void;
  onSelectSocialEnergy?: (social: SocialEnergyStyle) => void;
  onSelectProblemSolving: (style: ProblemSolvingStyle) => void;
  onSelectStructure: (structure: StructureTolerance) => void;
  onSelectWorkContext?: (context: PracticalWorkContext) => void;
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
  onSelectTrack,
  onChangeHesitation,
  onSelectEnvironment,
  onSelectCollaboration,
  onSelectSocialEnergy,
  onSelectProblemSolving,
  onSelectStructure,
  onSelectWorkContext,
  onSelectFriction,
  onSelectPriority,
  onSelectAmbition,
}: QuestionStepViewProps) {
  // If step is out of question bounds
  if (step < 1 || step > 12) return null;

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

  // Step 3: High School Study Track (Single-Select)
  if (step === 3) {
    const handleSelectTrack = (id: string) => {
      if (onSelectTrack) {
        onSelectTrack(id as HighSchoolTrack);
      }
    };

    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q3}
          selectedIds={answers.q3HighSchoolTrack ? [answers.q3HighSchoolTrack] : []}
          onToggleOption={handleSelectTrack}
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

  // Step 4: Academic Hesitation & Worry (Free Textarea)
  if (step === 4) {
    const q = questions.q4;
    const currentText =
      answers.q4AcademicHesitation || answers.q3AcademicHesitation || answers.q2Rationale || '';
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

  // Step 5: Physical Work Setting
  if (step === 5) {
    const selected = answers.q5Environment || answers.q4Environment;
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q5}
          selectedIds={selected ? [selected] : []}
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

  // Step 6: Real-World Collaboration Style
  if (step === 6) {
    const selected = answers.q6CollaborationStyle || answers.q6SocialEnergy;
    const handleCollab = (id: string) => {
      if (onSelectCollaboration) {
        onSelectCollaboration(id as CollaborationStyle);
      } else if (onSelectSocialEnergy) {
        onSelectSocialEnergy(id as SocialEnergyStyle);
      }
    };

    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q6}
          selectedIds={selected ? [selected] : []}
          onToggleOption={handleCollab}
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

  // Step 7: Problem Solving Modality
  if (step === 7) {
    const selected = answers.q7ProblemSolving || answers.q5ProblemSolving;
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q7}
          selectedIds={selected ? [selected] : []}
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

  // Step 8: Daily Routine Preference
  if (step === 8) {
    const selected = answers.q8StructureTolerance || answers.q7StructureTolerance;
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q8}
          selectedIds={selected ? [selected] : []}
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

  // Step 9: Practical Work Context
  if (step === 9) {
    const handleWorkContext = (id: string) => {
      if (onSelectWorkContext) {
        onSelectWorkContext(id as PracticalWorkContext);
      }
    };

    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q9}
          selectedIds={answers.q9WorkContext ? [answers.q9WorkContext] : []}
          onToggleOption={handleWorkContext}
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

  // Step 10: Academic Friction to Minimize
  if (step === 10) {
    const selected = answers.q10AcademicFriction || answers.q8AcademicFriction;
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q10}
          selectedIds={selected ? [selected] : []}
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

  // Step 11: Core Life Priority
  if (step === 11) {
    const selected = answers.q11HorizonPriority || answers.q9HorizonPriority;
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q11}
          selectedIds={selected ? [selected] : []}
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

  // Step 12: Post-College Next Chapter
  if (step === 12) {
    const selected = answers.q12PostCollegeAmbition || answers.q10PostCollegeAmbition;
    return (
      <div className="space-y-4">
        <QuestionCard
          question={questions.q12}
          selectedIds={selected ? [selected] : []}
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
