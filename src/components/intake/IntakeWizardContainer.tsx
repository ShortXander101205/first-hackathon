'use client';

import React, { useRef, useEffect } from 'react';
import { useIntake } from '@/hooks/useIntake';
import { GUIDE_COPY } from '@/content/guideCopy';
import { Icons } from '@/components/ui/icons';
import { WelcomeProfileStep } from './WelcomeProfileStep';
import { QuestionStepView } from './QuestionStepView';
import { useGuideSynthesis } from '@/hooks/useGuideSynthesis';
import { ResultsContainer } from '@/components/results';
import { RESULTS_COPY } from '@/content/guideCopy';
import type { WizardStep } from '@/types/intake';
import type { SubmissionPayload } from '@/types/api';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function IntakeWizardContainer() {
  const {
    state,
    isCurrentStepValid,
    setProfile,
    toggleQ1Task,
    toggleTask,
    setQ2Subject,
    setSubject,
    setQ3Track,
    setQ3Hesitation,
    setQ4Hesitation,
    setRationale,
    setQ4Environment,
    setQ5Environment,
    setEnvironment,
    setQ5ProblemSolving,
    setQ6Collaboration,
    setQ6SocialEnergy,
    setQ7ProblemSolving,
    setQ7Structure,
    setQ8Structure,
    setQ8AcademicFriction,
    setQ9WorkContext,
    setQ9HorizonPriority,
    setQ10AcademicFriction,
    setQ10Ambition,
    setQ11HorizonPriority,
    setQ12Ambition,
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

  const stepTitle = GUIDE_COPY.stepTitles[currentStep] || GUIDE_COPY.shell.welcomeStepLabel;
  const progressPercent = currentStep === 0 ? 0 : Math.round((currentStep / 12) * 100);

  // Error message for active question
  const activeQuestionError =
    currentStep === 1
      ? validationErrors.q1
      : currentStep === 2
      ? validationErrors.q2Subject
      : currentStep === 3
      ? validationErrors.q3Track || validationErrors.q3Hesitation || validationErrors.q3
      : currentStep === 4
      ? validationErrors.q4Hesitation || validationErrors.q4Environment || validationErrors.q4
      : currentStep === 5
      ? validationErrors.q5Environment || validationErrors.q5ProblemSolving
      : currentStep === 6
      ? validationErrors.q6Collaboration || validationErrors.q6SocialEnergy
      : currentStep === 7
      ? validationErrors.q7ProblemSolving || validationErrors.q7Structure
      : currentStep === 8
      ? validationErrors.q8Structure || validationErrors.q8Friction
      : currentStep === 9
      ? validationErrors.q9WorkContext || validationErrors.q9Priority
      : currentStep === 10
      ? validationErrors.q10Friction || validationErrors.q10AcademicFriction || validationErrors.q10Ambition
      : currentStep === 11
      ? validationErrors.q11Priority || validationErrors.q9Priority
      : currentStep === 12
      ? validationErrors.q12Ambition || validationErrors.q10Ambition
      : undefined;

  const { isLoading, guideResult, error, fetchGuide, resetGuide } = useGuideSynthesis();

  const handleTriggerSynthesis = React.useCallback(() => {
    const payload: SubmissionPayload = {
      studentProfile: {
        fullName: profile?.fullName?.trim() || 'Alex',
        gradeLevel: profile?.gradeLevel || 'grade_12',
        studentId: profile?.studentId?.trim() || undefined,
      },
      intakeAnswers: {
        q1TaskIds: answers.q1TaskIds && answers.q1TaskIds.length > 0 ? answers.q1TaskIds : ['BUILD_SYSTEMS'],
        q2SubjectId: answers.q2SubjectId || 'TECH_COMPUTING',
        q3HighSchoolTrack: answers.q3HighSchoolTrack || 'TRACK_EXPLORING',
        q4AcademicHesitation: answers.q4AcademicHesitation || answers.q3AcademicHesitation || answers.q2Rationale || 'None shared',
        q5Environment: (answers.q5Environment || answers.q4Environment || answers.q3Environment || 'REMOTE_DIGITAL') as any,
        q6CollaborationStyle: (answers.q6CollaborationStyle || answers.q6SocialEnergy || 'BALANCED_TEAM') as any,
        q7ProblemSolving: answers.q7ProblemSolving || answers.q5ProblemSolving || 'SYSTEMATIC_LOGIC',
        q8StructureTolerance: answers.q8StructureTolerance || answers.q7StructureTolerance || 'BALANCED_MILESTONES',
        q9WorkContext: answers.q9WorkContext || 'DIGITAL_TECH_PRODUCTS',
        q10AcademicFriction: answers.q10AcademicFriction || answers.q8AcademicFriction || 'ADVANCED_MATH',
        q11HorizonPriority: answers.q11HorizonPriority || answers.q9HorizonPriority || 'FINANCIAL_STABILITY',
        q12PostCollegeAmbition: (answers.q12PostCollegeAmbition || answers.q10PostCollegeAmbition || answers.q4Ambition || 'WORKFORCE_DIRECT') as any,

        // Legacy mappings for backwards compatibility
        q3AcademicHesitation: answers.q4AcademicHesitation || answers.q3AcademicHesitation || answers.q2Rationale || 'None shared',
        q4Environment: (answers.q5Environment || answers.q4Environment || answers.q3Environment || 'REMOTE_DIGITAL') as any,
        q5ProblemSolving: answers.q7ProblemSolving || answers.q5ProblemSolving || 'SYSTEMATIC_LOGIC',
        q6SocialEnergy: (answers.q6CollaborationStyle || answers.q6SocialEnergy || 'BALANCED_TEAM') as any,
        q7StructureTolerance: answers.q8StructureTolerance || answers.q7StructureTolerance || 'BALANCED_MILESTONES',
        q8AcademicFriction: answers.q10AcademicFriction || answers.q8AcademicFriction || 'ADVANCED_MATH',
        q9HorizonPriority: answers.q11HorizonPriority || answers.q9HorizonPriority || 'FINANCIAL_STABILITY',
        q10PostCollegeAmbition: (answers.q12PostCollegeAmbition || answers.q10PostCollegeAmbition || answers.q4Ambition || 'WORKFORCE_DIRECT') as any,
      },
      metadata: {
        clientTimestamp: new Date().toISOString(),
        schemaVersion: 2,
      },
    };
    fetchGuide(payload);
  }, [profile, answers, fetchGuide]);

  // Auto-trigger synthesis when the student finishes Step 10
  useEffect(() => {
    if (isCompleted && !guideResult && !isLoading && !error) {
      handleTriggerSynthesis();
    }
  }, [isCompleted, guideResult, isLoading, error, handleTriggerSynthesis]);

  // 1. Render ResultsContainer when synthesis successfully completes
  if (isCompleted && guideResult) {
    return (
      <ResultsContainer
        result={guideResult}
        onClear={() => {
          resetGuide();
          resetState();
        }}
      />
    );
  }

  // 2. Render calm recovery view if an upstream error occurs
  if (isCompleted && error && !guideResult) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="w-full max-w-4xl mx-auto py-12 px-4 text-center space-y-5"
      >
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <Icons.frictionAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">{RESULTS_COPY.error.title}</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{RESULTS_COPY.error.description}</p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={handleTriggerSynthesis}
            className="min-h-[44px] min-w-[44px] px-5 py-2.5 rounded-xl bg-edu-interactive hover:bg-edu-interactive-hover text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
          >
            {RESULTS_COPY.error.retryButton}
          </button>
          <button
            type="button"
            onClick={previousStep}
            className="min-h-[44px] min-w-[44px] px-5 py-2.5 rounded-xl border border-edu-border-subtle bg-white text-edu-slate-700 font-medium text-sm hover:bg-edu-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
          >
            {RESULTS_COPY.error.editAnswersButton}
          </button>
        </div>
      </div>
    );
  }

  // 3. Render calm loading state while synthesis is in progress or waiting to complete
  if (isCompleted && !guideResult) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-edu-interactive flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-8 h-8 animate-spin text-edu-interactive" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">{RESULTS_COPY.loading.title}</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{RESULTS_COPY.loading.reassurance}</p>
        </div>
      </div>
    );
  }

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
            {GUIDE_COPY.brand.name} <span className="font-normal text-edu-slate-500 text-sm">{GUIDE_COPY.shell.brandSuffix}</span>
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

      {/* Progress Bar (Visible on Steps 1 to 12) */}
      {currentStep > 0 && (
        <nav
          className="mb-8 space-y-2"
          aria-label={GUIDE_COPY.a11y.progressNav}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-edu-slate-600">
            <span>{GUIDE_COPY.shell.stepProgressLabel(currentStep, 12)}: <strong className="text-edu-slate-900">{stepTitle}</strong></span>
            <span>{GUIDE_COPY.shell.stepPercentLabel(progressPercent)}</span>
          </div>

          <div
            role="progressbar"
            aria-label={GUIDE_COPY.a11y.progressNav}
            aria-valuenow={currentStep}
            aria-valuemin={0}
            aria-valuemax={12}
            aria-valuetext={`${currentStep} of 12 completed: ${stepTitle}`}
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
      <ErrorBoundary componentName="IntakeWizard" onReset={resetState}>
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

          {currentStep >= 1 && currentStep <= 12 && !isCompleted && (
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
              onSelectTrack={(track) => setQ3Track?.(track)}
              onChangeHesitation={(text) => {
                setQ4Hesitation
                  ? setQ4Hesitation(text)
                  : setQ3Hesitation
                  ? setQ3Hesitation(text)
                  : setRationale(text);
              }}
              onSelectEnvironment={(env) => {
                setQ5Environment
                  ? setQ5Environment(env)
                  : setQ4Environment
                  ? setQ4Environment(env)
                  : setEnvironment(env as any);
              }}
              onSelectCollaboration={(collab) => {
                setQ6Collaboration
                  ? setQ6Collaboration(collab)
                  : setQ6SocialEnergy?.(collab as any);
              }}
              onSelectSocialEnergy={(social) => setQ6SocialEnergy?.(social)}
              onSelectProblemSolving={(style) => {
                setQ7ProblemSolving
                  ? setQ7ProblemSolving(style)
                  : setQ5ProblemSolving?.(style);
              }}
              onSelectStructure={(structure) => {
                setQ8Structure
                  ? setQ8Structure(structure)
                  : setQ7Structure?.(structure);
              }}
              onSelectWorkContext={(context) => setQ9WorkContext?.(context)}
              onSelectFriction={(friction) => {
                setQ10AcademicFriction
                  ? setQ10AcademicFriction(friction)
                  : setQ8AcademicFriction?.(friction);
              }}
              onSelectPriority={(priority) => {
                setQ11HorizonPriority
                  ? setQ11HorizonPriority(priority)
                  : setQ9HorizonPriority?.(priority);
              }}
              onSelectAmbition={(ambition) => {
                setQ12Ambition
                  ? setQ12Ambition(ambition)
                  : setQ10Ambition
                  ? setQ10Ambition(ambition)
                  : setAmbition(ambition as any);
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
                {GUIDE_COPY.shell.completionTitle}
              </h2>
              <p className="text-sm text-edu-slate-600 max-w-md mx-auto">
                {GUIDE_COPY.shell.completionMessage}
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={previousStep}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-edu-border-subtle bg-white text-edu-slate-700 font-medium text-sm hover:bg-edu-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none"
                >
                  {GUIDE_COPY.shell.reviewAnswersButton}
                </button>
                <button
                  type="button"
                  onClick={openResetDialog}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-edu-slate-100 text-edu-slate-700 font-medium text-sm hover:bg-edu-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none"
                >
                  {GUIDE_COPY.resetDialog.triggerButton}
                </button>
              </div>
            </div>
          )}
        </main>
      </ErrorBoundary>

      {/* Navigation Controls Footer (Visible on Steps 1 to 12) */}
      {currentStep >= 1 && currentStep <= 12 && !isCompleted && (
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
              currentStep === 12
                ? GUIDE_COPY.navigation.finishAriaLabel
                : GUIDE_COPY.navigation.nextAriaLabel
            }
          >
            <span>
              {currentStep === 12
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
