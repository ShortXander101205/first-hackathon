'use client';

import React, { useEffect, useState } from 'react';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { RESULTS_COPY } from '@/content/guideCopy';
import { AdvisorNotesEditor } from './AdvisorNotesEditor';
import {
  X,
  GraduationCap,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface StudentDetailModalProps {
  submissionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  advisorName?: string;
  onNoteAdded?: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  submissionId,
  isOpen,
  onClose,
  advisorName = ADVISOR_COPY.notes.authorDefault,
  onNoteAdded,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !submissionId) {
      setData(null);
      setError(null);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/advisor/students/${submissionId}`);
        const result = await res.json();
        if (res.ok && result.success && result.submission) {
          setData(result.submission);
        } else {
          setError(result.detail || ADVISOR_COPY.drawer.errorFallback);
        }
      } catch {
        setError(ADVISOR_COPY.errors.networkError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, submissionId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-detail-heading"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {ADVISOR_COPY.drawer.profileSectionTitle}
            </span>
            <h2
              id="student-detail-heading"
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white"
            >
              {data ? data.fullName : ADVISOR_COPY.drawer.loadingText}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={ADVISOR_COPY.drawer.closeButtonAria}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 max-h-[calc(85vh-80px)] overflow-y-auto space-y-8">
          {isLoading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">{ADVISOR_COPY.drawer.loadingText}</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : data ? (
            <>
              {/* Student Metadata Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="text-xs text-slate-500">{ADVISOR_COPY.drawer.gradeLevelLabel}</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {data.gradeLevel.replace(/_/g, ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">{ADVISOR_COPY.drawer.studentIdLabel}</div>
                  <div className="text-sm font-mono text-slate-800 dark:text-slate-200">
                    {data.studentId || ADVISOR_COPY.drawer.notProvided}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">{ADVISOR_COPY.drawer.academicYearLabel}</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {data.academicYear}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">{ADVISOR_COPY.drawer.submittedDateLabel}</div>
                  <div className="text-sm text-slate-800 dark:text-slate-200">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Student Reflection & Academic Hesitation */}
              {data.intakeAnswers && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>{ADVISOR_COPY.drawer.intakeAnswersTitle}</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3 text-sm">
                    {data.intakeAnswers.q3AcademicHesitation && (
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {ADVISOR_COPY.drawer.hesitationSectionTitle}:{' '}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 italic">
                          &ldquo;{data.intakeAnswers.q3AcademicHesitation}&rdquo;
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                      {data.intakeAnswers.q2SubjectId && (
                        <div>
                          <strong>{ADVISOR_COPY.drawer.subjectLabel}:</strong> {data.intakeAnswers.q2SubjectId}
                        </div>
                      )}
                      {data.intakeAnswers.q4Environment && (
                        <div>
                          <strong>{ADVISOR_COPY.drawer.environmentLabel}:</strong> {data.intakeAnswers.q4Environment}
                        </div>
                      )}
                      {data.intakeAnswers.q5ProblemSolving && (
                        <div>
                          <strong>{ADVISOR_COPY.drawer.thinkingStyleLabel}:</strong> {data.intakeAnswers.q5ProblemSolving}
                        </div>
                      )}
                      {data.intakeAnswers.q9HorizonPriority && (
                        <div>
                          <strong>{ADVISOR_COPY.drawer.priorityLabel}:</strong> {data.intakeAnswers.q9HorizonPriority}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4 Pathway Recommendations */}
              {data.synthesisResult?.cards && Array.isArray(data.synthesisResult.cards) && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>{ADVISOR_COPY.drawer.pathwaysSectionTitle}</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.synthesisResult.cards.map((card: any, idx: number) => (
                      <div
                        key={card.id || idx}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-3 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              {card.badge || card.matchBadge || (idx < 2 ? RESULTS_COPY.badges.topMatch.badge : RESULTS_COPY.badges.exploreAlso.badge)}
                            </span>
                            <span className="text-xs text-slate-500">
                              {card.broadField || card.broad_field}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {card.roleTitle || card.role_title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                            {card.overview}
                          </p>

                          {/* 3-Stage Milestones */}
                          {card.milestones && (
                            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1">
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {ADVISOR_COPY.drawer.stage1MilestoneLabel}{' '}
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {card.milestones.education}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {ADVISOR_COPY.drawer.stage2MilestoneLabel}{' '}
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {card.milestones.entryRole}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {ADVISOR_COPY.drawer.stage3MilestoneLabel}{' '}
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {card.milestones.growthRole}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {card.majors && card.majors.length > 0 && (
                          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <strong>{ADVISOR_COPY.drawer.relevantMajorsLabel}</strong> {card.majors.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Private Advisor Notes Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <AdvisorNotesEditor
                  submissionId={data.id}
                  initialNotes={data.notes || []}
                  defaultAuthorName={advisorName}
                  onNoteAdded={() => {
                    if (onNoteAdded) onNoteAdded();
                  }}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
