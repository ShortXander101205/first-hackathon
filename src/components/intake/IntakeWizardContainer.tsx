'use client';

import React, { useRef, useEffect } from 'react';
import { useIntake } from '@/hooks/useIntake';
import { GUIDE_COPY } from '@/content/guideCopy';
import { Icons } from '@/components/ui/icons';
import { WelcomeProfileStep } from './WelcomeProfileStep';
import { QuestionStepView } from './QuestionStepView';
import type { WizardStep } from '@/types/intake';

const STEP_TITLES: Record<WizardStep, string> = {
  0: 'Welcome and Student Profile',
  1: 'Daily Focus & Task Energy',
  2: 'Academic Curiosity',
  3: 'Academic Dread & Hesitation',
  4: 'Physical Work Environment',
  5: 'Problem-Solving Instinct',
  6: 'Social Energy & Collaboration',
  7: 'Structure vs. Ambiguity',
  8: 'Academic Stress Minimization',
  9: 'Core Life & Career Horizon',
  10: 'Post-College Next Chapter',
};

export function IntakeWizardContainer() {
  const {
    state,
    isCurrentStepValid,
    setProfile,
    toggleQ1Task,
    toggleTask,
    setQ2Subject,
    setSubject,
    setQ3Hesitation,
    setRationale,
    setQ4Environment,
    setEnvironment,
    setQ5ProblemSolving,
    setQ6SocialEnergy,
    setQ7Structure,
    setQ8AcademicFriction,
    setQ9HorizonPriority,
    setQ10Ambition,
    setAmbition,
    nextStep,
    previousStep,
    openResetDialog,
    closeResetDialog,
    resetState,
  } = useIntake();

  const {
    currentStep,
    profile,
    answers,
    validationErrors,
    isResetDialogOpen,
    isCompleted,
  } = state;

  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  // Focus management for reset dialog
  useEffect(() => {
    if (isResetDialogOpen) {
      const timer = setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isResetDialogOpen]);

  const stepTitle = STEP_TITLES[currentStep] || 'Intake Step';
  const progressPercent = currentStep === 0 ? 0 : Math.round((currentStep / 10) * 100);

  // Error message for active question
  const activeQuestionError =
    currentStep === 1
      ? validationErrors.q1
      : currentStep === 2
      ? validationErrors.q2Subject
      : currentStep === 3
      ? validationErrors.q3Hesitation || validationErrors.q2Rationale
      : currentStep === 4
      ? validationErrors.q4Environment || validationErrors.q3
      : currentStep === 5
      ? validationErrors.q5ProblemSolving
      : currentStep === 6
      ? validationErrors.q6SocialEnergy
      : currentStep === 7
      ? validationErrors.q7Structure
      : currentStep === 8
      ? validationErrors.q8Friction
      : currentStep === 9
      ? validationErrors.q9Priority
      : currentStep === 10
      ? validationErrors.q10Ambition || validationErrors.q4
      : undefined;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {GUIDE_COPY.a11y.stepAnnouncement(currentStep, 10, stepTitle)}
      </div>

      {/* Top Header Bar */}
      <header className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-edu-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-edu-interactive text-white flex items-center justify-center font-bold text-sm shadow-xs">
            PL
          </div>
          <span className="font-bold text-base sm:text-lg text-edu-slate-900 tracking-tight">
            {GUIDE_COPY.brand.name} <span className="font-normal text-edu-slate-500 text-sm">Guide</span>
          </span>
        </div>

        {currentStep > 0 && (
          <button
            type="button"
            onClick={openResetDialog}
            className="min-h-[44px] min-w-[44px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-edu-slate-600 hover:text-edu-slate-900 hover:bg-edu-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none flex items-center gap-1.5"
            aria-label={GUIDE_COPY.resetDialog.ariaLabel}
          >
            <Icons.reset className="w-4 h-4" aria-hidden="true" />
            <span>{GUIDE_COPY.resetDialog.triggerButton}</span>
          </button>
        )}
      </header>

      {/* Progress Bar (Visible on Steps 1 to 10) */}
      {currentStep > 0 && (
        <nav
          className="mb-8 space-y-2"
          aria-label={GUIDE_COPY.a11y.progressNav}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-edu-slate-600">
            <span>{GUIDE_COPY.shell.stepProgressLabel(currentStep, 10)}: <strong className="text-edu-slate-900">{stepTitle}</strong></span>
            <span>{progressPercent}% Complete</span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={0}
            aria-valuemax={10}
            aria-valuetext={`${currentStep} of 10 completed: ${stepTitle}`}
            className="w-full h-2 rounded-full bg-edu-slate-100 overflow-hidden"
          >
            <div
              className="h-full bg-edu-interactive rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </nav>
      )}

      {/* Main Content Stage */}
      <main className="min-w-0">
        {currentStep === 0 && (
          <WelcomeProfileStep
            profile={profile || { fullName: '', gradeLevel: 'grade_10' }}
            validationErrors={validationErrors}
            onUpdateProfile={(p) => setProfile?.(p)}
            onContinue={nextStep}
            isValid={isCurrentStepValid}
          />
        )}

        {currentStep >= 1 && currentStep <= 10 && !isCompleted && (
          <QuestionStepView
            step={currentStep}
            answers={answers}
            validationError={activeQuestionError}
            onToggleTask={(id) => {
              toggleQ1Task ? toggleQ1Task(id) : toggleTask(id);
            }}
            onSelectSubject={(id) => {
              setQ2Subject ? setQ2Subject(id) : setSubject(id);
            }}
            onChangeHesitation={(text) => {
              setQ3Hesitation ? setQ3Hesitation(text) : setRationale(text);
            }}
            onSelectEnvironment={(env) => {
              setQ4Environment ? setQ4Environment(env) : setEnvironment(env as any);
            }}
            onSelectProblemSolving={(style) => setQ5ProblemSolving?.(style)}
            onSelectSocialEnergy={(social) => setQ6SocialEnergy?.(social)}
            onSelectStructure={(structure) => setQ7Structure?.(structure)}
            onSelectFriction={(friction) => setQ8AcademicFriction?.(friction)}
            onSelectPriority={(priority) => setQ9HorizonPriority?.(priority)}
            onSelectAmbition={(ambition) => {
              setQ10Ambition ? setQ10Ambition(ambition) : setAmbition(ambition as any);
            }}
          />
        )}

        {/* Completion Review Banner */}
        {isCompleted && (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-reassurance-100 text-reassurance-700 flex items-center justify-center mx-auto shadow-xs">
              <Icons.check className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-edu-slate-900">
              You Have Completed the PathLess Guide!
            </h2>
            <p className="text-sm text-edu-slate-600 max-w-md mx-auto">
              Your 10 responses have been validated and saved for personal synthesis.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <button
                type="button"
                onClick={previousStep}
                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-edu-border-subtle bg-white text-edu-slate-700 font-medium text-sm hover:bg-edu-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={openResetDialog}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-edu-slate-100 text-edu-slate-700 font-medium text-sm hover:bg-edu-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Controls Footer (Visible on Steps 1 to 10) */}
      {currentStep >= 1 && currentStep <= 10 && !isCompleted && (
        <footer className="mt-10 pt-6 border-t border-edu-border-subtle flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={previousStep}
            className="min-h-[44px] min-w-[44px] px-5 py-2.5 rounded-xl border border-edu-border-subtle bg-white hover:bg-edu-slate-50 text-edu-slate-700 text-sm sm:text-base font-semibold transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none flex items-center gap-2"
            aria-label={GUIDE_COPY.navigation.previousAriaLabel}
          >
            <Icons.arrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{GUIDE_COPY.navigation.previous}</span>
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={!isCurrentStepValid}
            className="min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-xl bg-edu-interactive hover:bg-edu-interactive-hover disabled:bg-edu-slate-200 disabled:text-edu-slate-400 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:ring-offset-2 focus-visible:outline-none flex items-center gap-2"
            aria-label={
              currentStep === 10
                ? GUIDE_COPY.navigation.finishAriaLabel
                : GUIDE_COPY.navigation.nextAriaLabel
            }
          >
            <span>
              {currentStep === 10
                ? GUIDE_COPY.navigation.finish
                : GUIDE_COPY.navigation.next}
            </span>
            <Icons.arrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </footer>
      )}

      {/* Accessible Reset Confirmation Dialog */}
      {isResetDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          aria-describedby="reset-modal-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-edu-slate-900/40 backdrop-blur-xs"
        >
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-edu-border-subtle space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Icons.frictionAlert className="w-5 h-5" aria-hidden="true" />
            </div>

            <div className="space-y-1.5 text-left">
              <h3 id="reset-modal-title" className="text-lg font-bold text-edu-slate-900">
                {GUIDE_COPY.resetDialog.title}
              </h3>
              <p id="reset-modal-desc" className="text-sm text-edu-slate-600 leading-relaxed">
                {GUIDE_COPY.resetDialog.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                ref={cancelBtnRef}
                type="button"
                onClick={closeResetDialog}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-edu-border-subtle bg-white hover:bg-edu-slate-50 text-edu-slate-700 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none"
              >
                {GUIDE_COPY.resetDialog.cancel}
              </button>
              <button
                ref={confirmBtnRef}
                type="button"
                onClick={() => {
                  resetState();
                  closeResetDialog();
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none"
              >
                {GUIDE_COPY.resetDialog.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
