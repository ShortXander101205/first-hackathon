import React from 'react';
import type { CareerCard as CareerCardType, MatchTier } from '@/types/career';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';
import { RealityCheckSection } from './RealityCheckSection';
import { CourseChallengeAndReassurance } from './CourseChallengeAndReassurance';
import { TrialCoursesBadgeList } from './TrialCoursesBadgeList';

export interface CareerCardProps {
  card: CareerCardType;
  index: number;
}

interface TierStyleConfig {
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cardBorderHighlight: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
}

function getTierConfig(tier: MatchTier): TierStyleConfig {
  switch (tier) {
    case 'Primary Direct Match':
      return {
        badgeBg: 'bg-edu-blue-50',
        badgeBorder: 'border-edu-blue-200',
        badgeText: 'text-edu-blue-800',
        cardBorderHighlight: 'hover:border-edu-blue-300',
        icon: Icons.directMatch,
        tagline: DOSSIER_COPY.tiers.primary.tagline,
      };
    case 'High-Growth Pathway':
      return {
        badgeBg: 'bg-growth-50',
        badgeBorder: 'border-growth-200',
        badgeText: 'text-growth-700',
        cardBorderHighlight: 'hover:border-growth-300',
        icon: Icons.highGrowth,
        tagline: DOSSIER_COPY.tiers.highGrowth.tagline,
      };
    case 'Interdisciplinary Pivot':
      return {
        badgeBg: 'bg-purple-50',
        badgeBorder: 'border-purple-200',
        badgeText: 'text-purple-700',
        cardBorderHighlight: 'hover:border-purple-300',
        icon: Icons.interdisciplinary,
        tagline: DOSSIER_COPY.tiers.interdisciplinary.tagline,
      };
    case 'Moonshot Trajectory':
      return {
        badgeBg: 'bg-amber-50',
        badgeBorder: 'border-amber-200',
        badgeText: 'text-amber-800',
        cardBorderHighlight: 'hover:border-amber-300',
        icon: Icons.moonshot,
        tagline: DOSSIER_COPY.tiers.moonshot.tagline,
      };
    default:
      return {
        badgeBg: 'bg-edu-slate-100',
        badgeBorder: 'border-edu-slate-200',
        badgeText: 'text-edu-slate-800',
        cardBorderHighlight: 'hover:border-edu-slate-300',
        icon: Icons.academic,
        tagline: '',
      };
  }
}

export function CareerCard({ card, index }: CareerCardProps) {
  const tierConfig = getTierConfig(card.match_tier);
  const TierIcon = tierConfig.icon;
  const copy = DOSSIER_COPY.card;

  return (
    <article
      aria-labelledby={`career-card-title-${card.id || index}`}
      className={`bg-white rounded-2xl border border-edu-slate-200 shadow-sm p-5 sm:p-6 lg:p-7 flex flex-col h-full justify-between space-y-6 hover:shadow-md transition-shadow min-w-0 ${tierConfig.cardBorderHighlight}`}
    >
      {/* Upper Group: Header, Title, Rationale, Majors/Minors */}
      <div className="space-y-4 min-w-0">
        {/* Tier Badge & Fit Score Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Match Tier Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tierConfig.badgeBg} ${tierConfig.badgeBorder} ${tierConfig.badgeText}`}
          >
            <TierIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{card.match_tier}</span>
          </div>

          {/* Fit Score Badge */}
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-edu-slate-100 text-edu-slate-800 border border-edu-slate-200 shrink-0"
            aria-label={DOSSIER_COPY.a11y.fitScoreAnnouncement(card.fit_score)}
            title={copy.fitScoreClarification}
          >
            <Icons.verifiedCourse className="w-3 h-3 text-edu-interactive" aria-hidden="true" />
            <span>{copy.fitScoreLabel(card.fit_score)}</span>
          </div>
        </div>

        {/* Role Title */}
        <h2
          id={`career-card-title-${card.id || index}`}
          className="text-lg sm:text-xl font-bold text-edu-slate-900 tracking-tight leading-snug min-w-0 break-words"
        >
          {card.role_title}
        </h2>

        {/* Fit Rationale */}
        <p className="text-xs sm:text-sm text-edu-slate-600 leading-relaxed min-w-0 break-words">
          {card.fit_rationale}
        </p>

        {/* Connected Majors & Minors */}
        <div className="space-y-2.5 pt-1">
          {/* Majors */}
          {card.majors && card.majors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-edu-slate-700 block">
                {copy.majorsLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {card.majors.map((major, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-edu-blue-50 text-edu-blue-900 border border-edu-blue-200 min-w-0 break-words"
                  >
                    {major}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Minors */}
          {card.minors && card.minors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-edu-slate-600 block">
                {copy.minorsLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {card.minors.map((minor, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-edu-slate-100 text-edu-slate-700 border border-edu-slate-200 min-w-0 break-words"
                  >
                    {minor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lower Group: Reality Check, Academics, Trial Courses */}
      <div className="space-y-4 pt-2 border-t border-edu-slate-100 min-w-0">
        {/* Reality Check Section */}
        <RealityCheckSection
          dayInTheLife={card.day_in_the_life}
          dailyTasks={card.daily_tasks}
        />

        {/* Course Challenge & Reassurance */}
        <CourseChallengeAndReassurance
          challenge={card.course_challenges}
          reassurance={card.reassurance}
        />

        {/* Trial Courses Badges */}
        <TrialCoursesBadgeList trialCourses={card.trial_courses} />
      </div>
    </article>
  );
}
