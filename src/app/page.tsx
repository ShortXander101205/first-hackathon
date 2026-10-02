'use client';

import React from 'react';
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
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { IntakeProvider } from '@/context/IntakeContext';
import { useIntake } from '@/hooks/useIntake';

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

  return (
    <>
      <WizardShell
        currentStep={currentStep}
        onStepClick={goToStep}
        canAccessStep={canAccessStep}
        onResetClick={openResetDialog}
        studentNickname={studentNickname}
        onNicknameChange={setNickname}
        isCompleted={isCompleted}
      >
        {!isCompleted ? (
          <>
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
          </>
        ) : (
          /* Calming Presentation Completion Review Banner */
          <div className="py-8 text-center space-y-5 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-growth-50 text-growth-700 border border-growth-200 flex items-center justify-center mx-auto shadow-sm">
              <Icons.verifiedCourse className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-edu-slate-900">
                {INTAKE_COPY.shell.completionBannerTitle}
              </h2>
              <p className="text-sm text-edu-slate-600 max-w-lg mx-auto leading-relaxed">
                {INTAKE_COPY.shell.completionBannerMessage}
              </p>
            </div>

            {/* Selected Responses Summary Review Card */}
            <div className="p-4 sm:p-5 rounded-xl border border-edu-slate-200 bg-edu-slate-50 text-left max-w-lg mx-auto space-y-2.5 text-xs">
              <div className="font-bold text-edu-slate-800 text-sm border-b border-edu-slate-200 pb-2 flex items-center justify-between">
                <span>{INTAKE_COPY.home.summaryTitle(studentNickname)}</span>
                {studentNickname && (
                  <span className="text-xs font-normal text-edu-primary bg-edu-blue-50 border border-edu-blue-200 px-2 py-0.5 rounded-full">
                    {studentNickname}
                  </span>
                )}
              </div>
              <div>
                <span className="font-semibold text-edu-slate-700">{INTAKE_COPY.home.summaryEnergyLabel} </span>
                <span className="text-edu-slate-600">
                  {answers.q1TaskIds.length > 0 ? answers.q1TaskIds.join(', ') : 'None'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-edu-slate-700">{INTAKE_COPY.home.summarySubjectLabel} </span>
                <span className="text-edu-slate-600">{answers.q2SubjectId ?? 'None'}</span>
                {answers.q2Rationale && (
                  <p className="mt-1 italic text-edu-slate-600 bg-white p-2.5 rounded-lg border border-edu-slate-200">
                    &quot;{answers.q2Rationale}&quot;
                  </p>
                )}
              </div>
              <div>
                <span className="font-semibold text-edu-slate-700">{INTAKE_COPY.home.summarySettingLabel} </span>
                <span className="text-edu-slate-600">{answers.q3Environment ?? 'None'}</span>
              </div>
              <div>
                <span className="font-semibold text-edu-slate-700">{INTAKE_COPY.home.summaryAmbitionLabel} </span>
                <span className="text-edu-slate-600">{answers.q4Ambition ?? 'None'}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={previousStep}
                className="px-4 py-2.5 rounded-lg border border-edu-slate-300 hover:bg-edu-slate-100 text-edu-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
              >
                {INTAKE_COPY.navigation.previous}
              </button>

              <button
                type="button"
                onClick={openResetDialog}
                className="px-5 py-2.5 rounded-lg bg-edu-interactive hover:bg-edu-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
              >
                {INTAKE_COPY.home.restartButton}
              </button>
            </div>
          </div>
        )}
      </WizardShell>

      {/* Accessible Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isResetDialogOpen}
        onConfirm={resetState}
        onCancel={closeResetDialog}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <IntakeProvider>
      <div className="py-5 sm:py-10 lg:py-14">
        <Container>
          {/* Scholastic Heading Area */}
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

          {/* Connected Wizard Shell & State Machine */}
          <IntakeWizardContainer />
        </Container>
      </div>
    </IntakeProvider>
  );
}
