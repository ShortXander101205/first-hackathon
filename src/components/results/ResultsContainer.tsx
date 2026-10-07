'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';
import { GuideResult } from '@/types/career';
import { ApprovedField, getRelatedCatalogRoles } from '@/data/careerCatalog';
import { ResultsHeader } from './ResultsHeader';
import { PrintHeader } from './PrintHeader';
import { CareerMatchCard } from './CareerMatchCard';
import { ExploreMorePaths } from './ExploreMorePaths';
import { ResultsFooter } from './ResultsFooter';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export interface ResultsContainerProps {
  result: GuideResult;
  onClear: () => void;
  onPrint?: () => void;
}

/**
 * ResultsContainer: Main presentational coordinator for PathLess Guide v2 results.
 * Manages 4 progressive disclosure cards (all 4 cards collapsed on load).
 * Toggling cards modifies only local UI state without re-triggering synthesis or resetting card state.
 */
export function ResultsContainer({ result, onClear, onPrint }: ResultsContainerProps) {
  // All 4 cards collapsed on initial load
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(() => new Set());

  const handleToggleCard = useCallback((cardId: string) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  }, []);

  const pathways = useMemo(
    () => result.pathways || result.careers || [],
    [result.pathways, result.careers]
  );
  const studentName = result.studentProfile?.fullName;
  const summary = result.summary;
  const fallbackUsed = result.meta?.fallbackUsed ?? false;

  const primaryTitles = useMemo(
    () =>
      pathways
        .map((c) => c.roleTitle)
        .filter((t): t is string => typeof t === 'string' && t.length > 0),
    [pathways]
  );
  const preferredFields = useMemo(
    () =>
      pathways
        .map((c) => {
          const field = 'broadField' in c ? c.broadField : (c as unknown as { field?: string }).field;
          return field as ApprovedField;
        })
        .filter((f): f is ApprovedField => Boolean(f)),
    [pathways]
  );
  const relatedRoles = useMemo(
    () => getRelatedCatalogRoles(primaryTitles, preferredFields, 3),
    [primaryTitles, preferredFields]
  );

  return (
    <div
      role="region"
      aria-label={RESULTS_COPY.a11y.resultsLandmark}
      className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12"
    >
      {/* Dedicated Print & PDF Export Header (Hidden on Screen, Visible in Print) */}
      <PrintHeader
        studentName={studentName}
        gradeLevel={result.studentProfile?.gradeLevel}
        fallbackUsed={fallbackUsed}
      />

      {/* Calm Advisory Header */}
      <ResultsHeader
        studentName={studentName}
        summary={summary}
        fallbackUsed={fallbackUsed}
      />

      {/* 4 Progressive Disclosure Career Concentration Cards */}
      <ErrorBoundary componentName="ResultsContainer" onReset={onClear}>
        <main className="space-y-6" aria-label={RESULTS_COPY.header.pathwaysSectionLabel}>
          {pathways.map((card) => {
            const isExpanded = expandedCardIds.has(card.id);
            return (
              <CareerMatchCard
                key={card.id}
                card={card}
                isExpanded={isExpanded}
                onToggle={handleToggleCard}
              />
            );
          })}
        </main>
      </ErrorBoundary>

      {/* Complementary Exploration Paths (AC-FIX-05) */}
      <ExploreMorePaths relatedRoles={relatedRoles} />

      {/* Native Print & Reset Footer Actions */}
      <ResultsFooter onClear={onClear} onPrint={onPrint} />
    </div>
  );
}
