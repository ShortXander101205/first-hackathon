import React from 'react';
import type { TrialCourse } from '@/types/career';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';

export interface TrialCoursesBadgeListProps {
  trialCourses: [TrialCourse, TrialCourse];
}

export function TrialCoursesBadgeList({ trialCourses }: TrialCoursesBadgeListProps) {
  const copy = DOSSIER_COPY.trialCourses;

  if (!trialCourses || (trialCourses as unknown as TrialCourse[]).length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      {/* Section Header */}
      <div className="space-y-0.5">
        <h3 className="text-xs sm:text-sm font-bold text-edu-slate-800 tracking-tight flex items-center gap-1.5">
          <Icons.duration className="w-4 h-4 text-edu-interactive shrink-0" aria-hidden="true" />
          <span>{copy.sectionTitle}</span>
        </h3>
        <p className="text-[11px] sm:text-xs text-edu-slate-600 leading-normal">
          {copy.sectionHelper}
        </p>
      </div>

      {/* Trial Courses Badges List */}
      <div className="space-y-2">
        {trialCourses.map((course, index) => (
          <div
            key={index}
            className="p-3 bg-white border border-edu-slate-200 rounded-lg text-xs space-y-1.5 shadow-2xs hover:border-edu-interactive/50 transition-colors"
          >
            {/* Title & Duration Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <span className="font-semibold text-edu-slate-900 text-xs min-w-0 break-words line-clamp-1">
                {course.title}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-edu-slate-100 text-edu-slate-700 shrink-0 self-start sm:self-auto">
                <span>{course.provider}</span>
                <span aria-hidden="true">•</span>
                <span>{copy.hoursBadge(course.estimated_hours ?? course.estimatedHours ?? 4)}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-[11px] sm:text-xs text-edu-slate-600 leading-relaxed min-w-0 break-words line-clamp-2">
              {course.description}
            </p>

            {/* Zero-Cost Reassurance Tag */}
            <div className="pt-0.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-growth-700">
              <Icons.verifiedCourse className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{copy.zeroCostBadge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
