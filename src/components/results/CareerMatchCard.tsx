'use client';

import React from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';
import { PathwayCard } from '@/types/career';
import { WhereToStudySection } from './WhereToStudySection';

export interface CareerMatchCardProps {
  card: PathwayCard;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export function CareerMatchCard({ card, isExpanded, onToggle }: CareerMatchCardProps) {
  const copy = RESULTS_COPY.card;
  const milestonesCopy = RESULTS_COPY.milestones;

  const roleTitle = card.roleTitle || card.role_title || 'Specialist Concentration';
  const broadField = card.broadField || card.broad_field || 'Applied Discipline';

  // Feature 14: Locked qualitative badges (Top Match or Explore Also)
  const qualitativeBadge =
    card.badge ||
    (card.matchTier === 'Primary Direct Match' || card.matchTier === 'High-Growth Pathway'
      ? 'Top Match'
      : 'Explore Also');

  const isTopMatch = qualitativeBadge === 'Top Match';

  const overview =
    card.overview ||
    'A focused pathway aligned with your natural problem-solving strengths.';
  const groundedRationale =
    card.groundedRationale ||
    card.fitRationale ||
    card.fit_rationale ||
    '';
  const dailyTasks = card.dailyTasks || card.daily_tasks || card.day_in_the_life?.tasks || [];
  const studyPath =
    card.studyPath ||
    card.courseChallenges ||
    card.course_challenges ||
    'Foundational coursework in core principles and applied project methods.';
  const reassurance = card.reassurance || 'Coursework focuses on practical tools with continuous feedback.';
  const majors = card.majors || [];
  const minors = card.minors || [];
  const trialCourses = card.trialCourses || card.trial_courses || [];
  const milestones = card.milestones;

  const detailsId = `pathway-details-${card.id}`;

  return (
    <article
      data-testid={`career-card-${card.id}`}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 overflow-hidden"
    >
      {/* Card Header & Summary (Always Visible) */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Qualitative Badge & Broad Field Discipline */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                isTopMatch
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-sky-50 text-sky-800 border-sky-200'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isTopMatch ? 'bg-emerald-500' : 'bg-sky-500'
                }`}
                aria-hidden="true"
              />
              <span>{qualitativeBadge}</span>
            </span>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>

            <span className="text-xs text-slate-600 font-medium">
              {broadField}
            </span>
          </div>
        </div>

        {/* Role Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {roleTitle}
        </h2>

        {/* Grounded Rationale (Connecting Reality to Student Intake) */}
        {groundedRationale && (
          <p className="text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl p-3 leading-relaxed">
            <strong className="text-slate-900">{copy.groundedRationaleLabel}: </strong>
            {groundedRationale}
          </p>
        )}

        {/* Single-Sentence Overview (Strictly <= 30 words) */}
        <p className="text-sm leading-relaxed text-slate-600">
          {overview}
        </p>

        {/* Progressive Disclosure Toggle Button (Hidden in Print) */}
        <div className="pt-2 no-print">
          <button
            type="button"
            onClick={() => onToggle(card.id)}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 transition-colors min-h-[44px]"
          >
            <span>{isExpanded ? copy.expandedCta : copy.collapsedCta}</span>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 
        Expanded Pathway Details:
        CRITICAL DOM PERSISTENCE RULE FOR PRINT FIDELITY:
        Must NOT be conditionally unmounted ({isExpanded && <Details />})!
        Uses `isExpanded ? 'block' : 'hidden print:block'` so that native window.print()
        prints all 4 expanded pathways completely even when cards are collapsed on screen.
      */}
      <div
        id={detailsId}
        className={`border-t border-slate-100 bg-slate-50/30 p-5 sm:p-6 space-y-6 ${
          isExpanded ? 'block' : 'hidden print:block'
        }`}
      >
        {/* 3-Stage Milestone Progression Line (Familiar in Thailand) */}
        {milestones && (
          <section aria-labelledby={`milestones-heading-${card.id}`} className="space-y-3">
            <div>
              <h3
                id={`milestones-heading-${card.id}`}
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                {milestonesCopy.heading}
              </h3>
              <p className="text-xs text-slate-500">
                {milestonesCopy.subheading}
              </p>
            </div>

            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stage 1: Education */}
              <li className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5 shadow-2xs">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                  {milestonesCopy.stage1Label}
                </span>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {milestones.education}
                </p>
              </li>

              {/* Stage 2: Entry-Level Role */}
              <li className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3.5 space-y-1.5 shadow-2xs">
                <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  {milestonesCopy.stage2Label}
                </span>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {milestones.entryRole}
                </p>
              </li>

              {/* Stage 3: Long-Term Growth */}
              <li className="rounded-xl border border-sky-200/70 bg-sky-50/40 p-3.5 space-y-1.5 shadow-2xs">
                <span className="inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">
                  {milestonesCopy.stage3Label}
                </span>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {milestones.growthRole}
                </p>
              </li>
            </ol>
          </section>
        )}

        {/* Daily Operational Tasks */}
        {dailyTasks.length > 0 && (
          <section aria-labelledby={`tasks-heading-${card.id}`} className="space-y-2">
            <h3
              id={`tasks-heading-${card.id}`}
              className="text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              {copy.dailyTasksLabel}
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {dailyTasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-edu-primary font-bold flex-shrink-0 mt-0.5">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Foundational Study Path (Strictly <= 65 words) */}
        <section aria-labelledby={`study-heading-${card.id}`} className="space-y-2">
          <h3
            id={`study-heading-${card.id}`}
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            {copy.studyPathLabel}
          </h3>
          <p className="text-sm leading-relaxed text-slate-700">
            {studyPath}
          </p>
        </section>

        {/* Academic Hurdle Reassurance (Strictly <= 65 words) */}
        <section aria-labelledby={`reassurance-heading-${card.id}`} className="space-y-2">
          <h3
            id={`reassurance-heading-${card.id}`}
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            {copy.reassuranceLabel}
          </h3>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 text-xs sm:text-sm text-emerald-950 leading-relaxed flex items-start gap-2.5">
            <svg
              className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{reassurance}</span>
          </div>
        </section>

        {/* Associated College Majors & Minors */}
        {majors.length > 0 && (
          <section aria-labelledby={`majors-heading-${card.id}`} className="space-y-2">
            <h3
              id={`majors-heading-${card.id}`}
              className="text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              {copy.majorsLabel}
            </h3>
            <div className="flex flex-wrap gap-2">
              {majors.map((major, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-800 border border-slate-200 shadow-2xs"
                >
                  {major}
                </span>
              ))}
              {minors.map((minor, idx) => (
                <span
                  key={`minor-${idx}`}
                  className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200/60"
                >
                  Minor: {minor}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Exactly 2 Zero-Cost Trial Courses */}
        {trialCourses.length > 0 && (
          <section aria-labelledby={`courses-heading-${card.id}`} className="space-y-3">
            <div>
              <h3
                id={`courses-heading-${card.id}`}
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                {copy.trialCoursesLabel}
              </h3>
              <p className="text-xs text-slate-500">
                {copy.trialCoursesSublabel}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trialCourses.map((course, idx) => {
                const hours = course.estimatedHours ?? course.estimated_hours ?? 4;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800 border border-sky-100">
                        {course.provider}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {copy.hoursEstimated(hours)}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {course.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="pt-1 text-[11px] text-slate-400 no-print">
                      <span>💡 {copy.courseSearchHint}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Feature 9: Regional Thai Higher Education Guidance Panel */}
        <WhereToStudySection
          roleTitle={roleTitle}
          majors={majors}
          broadField={card.broadField || card.broad_field}
        />
      </div>
    </article>
  );
}
