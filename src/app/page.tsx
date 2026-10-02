'use client';

import React, { useState } from 'react';
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
  type EnvironmentChoice,
  type AmbitionChoice,
} from '@/components/wizard';
import { INTAKE_COPY } from '@/constants/intakeCopy';

export default function HomePage() {
  // Presentational State for Feature 3 UI Preview (Starts fresh with no pre-selected answers)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentChoice | null>(null);
  const [selectedAmbition, setSelectedAmbition] = useState<AmbitionChoice | null>(null);
  const [isCompletedPreview, setIsCompletedPreview] = useState<boolean>(false);

  // Presentational Mock Handlers
  const handleToggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : prev.length < 2
        ? [...prev, taskId]
        : prev
    );
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      setIsCompletedPreview(true);
    }
  };

  const handlePrevious = () => {
    if (isCompletedPreview) {
      setIsCompletedPreview(false);
      return;
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleResetPreview = () => {
    setCurrentStep(1);
    setSelectedTasks([]);
    setSelectedSubject(null);
    setNoteText('');
    setSelectedEnv(null);
    setSelectedAmbition(null);
    setIsCompletedPreview(false);
  };

  // Determine if Next is disabled in presentation view
  const isCurrentStepIncomplete =
    (currentStep === 1 && selectedTasks.length === 0) ||
    (currentStep === 2 && !selectedSubject) ||
    (currentStep === 3 && !selectedEnv) ||
    (currentStep === 4 && !selectedAmbition);

  return (
    <div className="py-5 sm:py-10 lg:py-14">
      <Container>
        {/* Intro Scholastic Heading Area */}
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

        {/* Step Navigation Quick Switcher for Component Inspection */}
        <div className="max-w-3xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-edu-slate-500 px-1 sm:px-2">
          <span className="text-[11px] sm:text-xs">{INTAKE_COPY.home.quickSwitcherLabel}</span>
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {([1, 2, 3, 4] as const).map((stepNum) => (
              <button
                key={stepNum}
                type="button"
                onClick={() => {
                  setCurrentStep(stepNum);
                  setIsCompletedPreview(false);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  currentStep === stepNum && !isCompletedPreview
                    ? 'bg-edu-interactive text-white shadow-xs'
                    : 'bg-edu-slate-100 text-edu-slate-600 hover:bg-edu-slate-200'
                }`}
              >
                {stepNum}
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Presentation Component */}
        <WizardShell currentStep={currentStep}>
          {!isCompletedPreview ? (
            <>
              {/* Question 1: Energy & Tasks */}
              {currentStep === 1 && (
                <QuestionOneTaskView
                  selectedTaskIds={selectedTasks}
                  onToggleTask={handleToggleTask}
                />
              )}

              {/* Question 2: Subjects & Focus */}
              {currentStep === 2 && (
                <QuestionTwoSubjectView
                  selectedSubjectId={selectedSubject}
                  onSelectSubject={setSelectedSubject}
                  noteText={noteText}
                  onChangeNoteText={setNoteText}
                />
              )}

              {/* Question 3: Work Setting */}
              {currentStep === 3 && (
                <QuestionThreeEnvironmentView
                  selectedEnvironment={selectedEnv}
                  onSelectEnvironment={setSelectedEnv}
                />
              )}

              {/* Question 4: Future Ambition */}
              {currentStep === 4 && (
                <QuestionFourAmbitionView
                  selectedAmbition={selectedAmbition}
                  onSelectAmbition={setSelectedAmbition}
                />
              )}

              {/* Accessible Navigation Controls */}
              <NavigationControls
                onPrevious={handlePrevious}
                onNext={handleNext}
                isPreviousDisabled={currentStep === 1}
                isNextDisabled={isCurrentStepIncomplete}
                isLastStep={currentStep === 4}
              />
            </>
          ) : (
            /* Calming Presentation Completion Banner */
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

              {/* Selected Persona Summary Review Card */}
              <div className="p-4 sm:p-5 rounded-xl border border-edu-slate-200 bg-edu-slate-50 text-left max-w-lg mx-auto space-y-2 text-xs">
                <div className="font-bold text-edu-slate-800 text-sm">
                  {INTAKE_COPY.home.summaryTitle}
                </div>
                <div>
                  <span className="font-semibold text-edu-slate-700">{INTAKE_COPY.home.summaryEnergyLabel} </span>
                  <span className="text-edu-slate-600">{selectedTasks.join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold text-edu-slate-700">{INTAKE_COPY.home.summarySubjectLabel} </span>
                  <span className="text-edu-slate-600">{selectedSubject}</span>
                  {noteText && (
                    <p className="mt-1 italic text-edu-slate-500 bg-white p-2 rounded border border-edu-slate-200">
                      &quot;{noteText}&quot;
                    </p>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-edu-slate-700">{INTAKE_COPY.home.summarySettingLabel} </span>
                  <span className="text-edu-slate-600">{selectedEnv}</span>
                </div>
                <div>
                  <span className="font-semibold text-edu-slate-700">{INTAKE_COPY.home.summaryAmbitionLabel} </span>
                  <span className="text-edu-slate-600">{selectedAmbition}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetPreview}
                  className="px-5 py-2.5 rounded-lg bg-edu-interactive hover:bg-edu-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
                >
                  {INTAKE_COPY.home.restartButton}
                </button>
              </div>
            </div>
          )}
        </WizardShell>
      </Container>
    </div>
  );
}
