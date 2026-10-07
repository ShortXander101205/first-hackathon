'use client';

import React, { memo } from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';
import { RelatedRoleItem } from '@/data/careerCatalog';

export interface ExploreMorePathsProps {
  relatedRoles: RelatedRoleItem[];
}

/**
 * ExploreMorePaths: Displays 2-4 complementary catalog roles beneath the 4 primary recommendation cards.
 * Preserves print fidelity, cognitive calm, and non-prescriptive career exploration.
 */
export const ExploreMorePaths = memo(function ExploreMorePaths({
  relatedRoles,
}: ExploreMorePathsProps) {
  if (!relatedRoles || relatedRoles.length === 0) {
    return null;
  }

  const copy = RESULTS_COPY.exploreMore;

  return (
    <section
      aria-labelledby="explore-more-heading"
      className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-4 break-inside-avoid print:bg-white print:border-slate-300"
    >
      {/* Header Row */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3
            id="explore-more-heading"
            className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2"
          >
            <svg
              className="w-5 h-5 text-edu-primary flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v2m0 8v2M4 12H2m18 0h-2m-2.93-5.07l1.41-1.41M5.52 18.48l1.41-1.41m0-10.14L5.52 5.52m12.96 12.96l-1.41-1.41"
              />
            </svg>
            <span>{copy.heading}</span>
          </h3>

          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 border border-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
            {copy.badge}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {copy.description}
        </p>
      </div>

      {/* Compact Complementary Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {relatedRoles.map((role) => (
          <article
            key={role.id}
            data-testid={`related-role-${role.id}`}
            className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between break-inside-avoid"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                  {role.field}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {role.roleTitle}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {role.summary}
              </p>
            </div>

            {role.standardMajors.length > 0 && (
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">{copy.majorsLabel}: </span>
                <span>{role.standardMajors.join(', ')}</span>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
});
