'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Icons } from '@/components/ui/icons';
import {
  WizardShell,
  QuestionOneTaskView,
  QuestionTwoSubjectView,
  QuestionThreeEnvironmentView,
  QuestionFourAmbitionView,
  NavigationControls,
  ResetConfirmationModal,
} from '@/components/wizard';
import {
  DossierContainer,
  SynthesisLoadingView,
  SynthesisErrorView,
} from '@/components/dossier';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { IntakeProvider } from '@/context/IntakeContext';
import { useIntake } from '@/hooks/useIntake';
import { useTriageSynthesis } from '@/hooks/useTriageSynthesis';

function IntakeWizardContainer() {
  const {
    state,
    isCurrentStepValid,
    canAccessStep,
    setNickname,
    toggleTask,
    setSubject,
    setRationale,
    setEnvironment,
    setAmbition,
    goToStep,
    nextStep,
    previousStep,
    openResetDialog,
    closeResetDialog,
    resetState,
  } = useIntake();

  const {
    currentStep,
    answers,
    validationErrors,
    isResetDialogOpen,
    isCompleted,
    studentNickname,
  } = state;

  const {
    isLoading,
    dossier,
    error,
    fetchDossier,
    resetDossier,
  } = useTriageSynthesis();

  // Trigger AI synthesis when intake wizard is completed
  useEffect(() => {
    if (isCompleted && !dossier && !isLoading && !error) {
      fetchDossier(answers, studentNickname);
    }
  }, [isCompleted, dossier, isLoading, error, fetchDossier, answers, studentNickname]);

  // Combined reset handler to clear intake state and synthesis cache
  const handleConfirmReset = () => {
    resetDossier();
    resetState();
  };

  // 1. Loading State while awaiting AI synthesis
  if (isCompleted && isLoading) {
    return (
      <>
        <SynthesisLoadingView studentNickname={studentNickname} />
        <ResetConfirmationModal
          isOpen={isResetDialogOpen}
          onConfirm={handleConfirmReset}
          onCancel={closeResetDialog}
        />
      </>
    );
  }

  // 2. Error Recovery State if synthesis encounters failure
  if (isCompleted && error) {
    const errorMsg =
      (error as { detail?: string })?.detail ||
      (error as Error)?.message ||
      undefined;

    return (
      <>
        <SynthesisErrorView
          onRetry={() => fetchDossier(answers, studentNickname)}
          onEditAnswers={previousStep}
          errorMessage={errorMsg}
        />
        <ResetConfirmationModal
          isOpen={isResetDialogOpen}
          onConfirm={handleConfirmReset}
          onCancel={closeResetDialog}
        />
      </>
    );
  }

  // 3. Recommendation Dossier Presentation View
  if (isCompleted && dossier) {
    return (
      <>
        <DossierContainer
          summary={dossier.summary}
          careers={dossier.careers}
          meta={dossier.meta}
          studentNickname={studentNickname}
          onStartOver={openResetDialog}
        />
        <ResetConfirmationModal
          isOpen={isResetDialogOpen}
          onConfirm={handleConfirmReset}
          onCancel={closeResetDialog}
        />
      </>
    );
  }

  // 4. Intake Wizard Form View (Steps 1-4)
  return (
    <>
      <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-reassurance-50 border border-reassurance-100 text-reassurance-700 text-xs sm:text-sm font-medium shadow-sm">
          <Icons.frictionAlert className="w-3.5 h-3.5 text-reassurance-500 shrink-0" aria-hidden="true" />
          <span>{INTAKE_COPY.shell.badge}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-edu-slate-900 leading-[1.2] sm:leading-[1.15] break-words">
          {INTAKE_COPY.home.headingPrefix}
          <span className="text-edu-primary underline decoration-edu-blue-300 decoration-wavy decoration-2">
            {INTAKE_COPY.home.headingHighlight}
          </span>
        </h1>

        <p className="text-xs sm:text-base text-edu-slate-600 max-w-2xl mx-auto leading-relaxed px-1">
          {INTAKE_COPY.shell.reassuranceNote}
        </p>

        <div className="pt-2 flex items-center justify-center gap-4">
          <Link
            href="/counselor"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-edu-slate-100 hover:bg-edu-slate-200 text-edu-slate-700 font-medium text-xs sm:text-sm transition-colors"
          >
            <span>{INTAKE_COPY.home.counselorLink}</span>
            <Icons.arrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <WizardShell
        currentStep={currentStep}
        onStepClick={goToStep}
        canAccessStep={canAccessStep}
        onResetClick={openResetDialog}
        studentNickname={studentNickname}
        onNicknameChange={setNickname}
        isCompleted={isCompleted}
      >
        {/* Question 1: Energy & Tasks */}
        {currentStep === 1 && (
          <QuestionOneTaskView
            selectedTaskIds={answers.q1TaskIds}
            onToggleTask={toggleTask}
            errorMessage={validationErrors.q1}
          />
        )}

        {/* Question 2: Subjects & Focus */}
        {currentStep === 2 && (
          <QuestionTwoSubjectView
            selectedSubjectId={answers.q2SubjectId}
            onSelectSubject={setSubject}
            noteText={answers.q2Rationale}
            onChangeNoteText={setRationale}
            subjectErrorMessage={validationErrors.q2Subject}
            rationaleErrorMessage={validationErrors.q2Rationale}
          />
        )}

        {/* Question 3: Work Setting */}
        {currentStep === 3 && (
          <QuestionThreeEnvironmentView
            selectedEnvironment={answers.q3Environment}
            onSelectEnvironment={setEnvironment}
            errorMessage={validationErrors.q3}
          />
        )}

        {/* Question 4: Future Ambition */}
        {currentStep === 4 && (
          <QuestionFourAmbitionView
            selectedAmbition={answers.q4Ambition}
            onSelectAmbition={setAmbition}
            errorMessage={validationErrors.q4}
          />
        )}

        {/* Accessible Navigation Controls */}
        <NavigationControls
          onPrevious={previousStep}
          onNext={nextStep}
          isPreviousDisabled={currentStep === 1}
          isNextDisabled={!isCurrentStepValid}
          isLastStep={currentStep === 4}
        />
      </WizardShell>

      {/* Accessible Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isResetDialogOpen}
        onConfirm={handleConfirmReset}
        onCancel={closeResetDialog}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <IntakeProvider>
      <div className="py-5 sm:py-10 lg:py-14 min-w-0">
        <Container>
          <IntakeWizardContainer />
        </Container>
      </div>
    </IntakeProvider>
  );
}
