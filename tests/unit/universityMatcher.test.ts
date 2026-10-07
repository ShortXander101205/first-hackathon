import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  matchProgramsForCard,
  findProgramsByMajor,
  findProgramsByField,
  getUniversityById,
  getAllUniversities,
  getAllPrograms,
} from '@/lib/universityMatcher';
import { WhereToStudySection } from '@/components/results/WhereToStudySection';
import { UniversityProgramBadge } from '@/components/results/UniversityProgramBadge';

describe('Feature 9: University Matcher & WhereToStudy UI Tests', () => {
  describe('Pure Deterministic Lookup Functions', () => {
    it('returns consistent and deterministic results on multiple identical invocations', () => {
      const card = {
        majors: ['Computer Engineering', 'Computer Science'],
        broadField: 'Engineering & Technology',
      };

      const result1 = matchProgramsForCard(card);
      const result2 = matchProgramsForCard(card);

      assert.deepStrictEqual(result1, result2, 'Matcher must be 100% deterministic');
      assert.strictEqual(result1.strategy, 'DIRECT_MAJOR');
      assert.strictEqual(result1.fallbackNoticeRequired, false);
      assert.ok(result1.matchedPrograms.length >= 1 && result1.matchedPrograms.length <= 3);
    });

    it('matches standard majors directly to verified institutional programs', () => {
      const cpePrograms = findProgramsByMajor('Computer Engineering');
      assert.ok(cpePrograms.length >= 3, 'Must match at least 3 institutions for Computer Engineering');

      const uniIds = cpePrograms.map((p) => p.universityId);
      assert.ok(uniIds.includes('chulalongkorn'), 'Must match Chulalongkorn');
      assert.ok(uniIds.includes('kmutt'), 'Must match KMUTT');
      assert.ok(uniIds.includes('cmu'), 'Must match Chiang Mai University');
      assert.ok(uniIds.includes('psu'), 'Must match Prince of Songkla University');
    });

    it('enforces a maximum ceiling of 3 programs and deduplicates by institution', () => {
      const card = {
        majors: ['Computer Engineering', 'Software Engineering', 'Information Technology'],
        broadField: 'Engineering & Technology',
      };

      const result = matchProgramsForCard(card);
      assert.ok(
        result.matchedPrograms.length <= 3,
        `Matched programs must not exceed 3, got ${result.matchedPrograms.length}`
      );

      const universityIds = result.matchedPrograms.map((p) => p.universityId);
      const uniqueIds = new Set(universityIds);
      assert.strictEqual(
        universityIds.length,
        uniqueIds.size,
        'Matched programs must come from distinct institutions'
      );
    });

    it('applies the Regional Balancing Heuristic so regional institutions are not crowded out', () => {
      const card = {
        majors: ['Computer Engineering'],
        broadField: 'Engineering & Technology',
      };

      const result = matchProgramsForCard(card);
      assert.strictEqual(result.matchedPrograms.length, 3);

      const regions = result.matchedPrograms.map((p) => p.region);
      const hasNonCentral = regions.some((r) => r !== 'Central');

      assert.ok(
        hasNonCentral,
        `Regional balancing must include at least 1 non-Central regional institution (regions found: ${regions.join(', ')})`
      );
    });

    it('falls back to broad field matching when specific majors have no direct matches', () => {
      const card = {
        majors: ['NonExistentMajor123'],
        broadField: 'Environmental & Agricultural Sciences',
      };

      const result = matchProgramsForCard(card);
      assert.strictEqual(result.strategy, 'BROAD_FIELD');
      assert.strictEqual(result.fallbackNoticeRequired, false);
      assert.ok(result.matchedPrograms.length >= 1 && result.matchedPrograms.length <= 3);

      for (const program of result.matchedPrograms) {
        assert.strictEqual(program.field, 'Environmental & Agricultural Sciences');
      }
    });

    it('returns a clean fallback state when both major and field yield zero matches', () => {
      const card = {
        majors: ['NonExistentMajor123'],
        broadField: 'CompletelyFakeFieldXYZ',
      };

      const result = matchProgramsForCard(card);
      assert.strictEqual(result.strategy, 'NONE');
      assert.strictEqual(result.fallbackNoticeRequired, true);
      assert.strictEqual(result.matchedPrograms.length, 0);
    });
  });

  describe('WhereToStudySection UI & Component Rendering', () => {
    it('renders verified program cards with official external link affordances and disclaimer', () => {
      const html = renderToStaticMarkup(
        React.createElement(WhereToStudySection, {
          roleTitle: 'Software Developer',
          majors: ['Computer Engineering', 'Computer Science'],
          broadField: 'Engineering & Technology',
        })
      );

      // Verify title & badge
      assert.ok(html.includes('Where to Study'), 'Must render section title');
      assert.ok(html.includes('Verified Institution Directory'), 'Must render verified directory badge');

      // Verify admissions advisory disclaimer
      assert.ok(html.includes('Official Admissions Advisory'), 'Must render admissions notice title');
      assert.ok(
        html.includes('Admission requirements, portfolio guidelines, and annual seat allocations'),
        'Must render admissions notice body'
      );

      // Verify zero hallucination note
      assert.ok(html.includes('Zero unverified admissions claims'), 'Must render zero hallucination note');

      // Verify external link security affordances
      assert.ok(html.includes('rel="noopener noreferrer"'), 'Must include rel="noopener noreferrer"');
      assert.ok(html.includes('target="_blank"'), 'Must include target="_blank"');
      assert.ok(html.includes('min-h-[44px] min-w-[44px]'), 'Must include 44x44px touch target');
      assert.ok(html.includes('aria-label='), 'Must include descriptive aria-label');
      assert.ok(html.includes('opens in new tab'), 'aria-label must mention opening in new tab');

      // Verify layout containment style
      assert.ok(html.includes('contain:content') || html.includes('contain: content'));
    });

    it('renders calm curation fallback notice when no programs match', () => {
      const html = renderToStaticMarkup(
        React.createElement(WhereToStudySection, {
          roleTitle: 'Quantum Astrobiologist',
          majors: ['Quantum Astrobiology'],
          broadField: 'Unknown Field',
        })
      );

      assert.ok(html.includes('Curating Pathways for This Major'), 'Must render fallback title');
      assert.ok(
        html.includes('Verified institutional degree mappings for Quantum Astrobiology are currently being audited'),
        'Must render major-specific fallback description'
      );
    });

    it('verifies that UniversityProgramBadge displays bilingual names, degree type, and campus', () => {
      const programCard = matchProgramsForCard({
        majors: ['Computer Engineering'],
      }).matchedPrograms[0];

      assert.ok(programCard, 'Must have at least one matched program');

      const html = renderToStaticMarkup(
        React.createElement(UniversityProgramBadge, {
          program: programCard,
        })
      );

      assert.ok(html.includes(programCard.universityNameEn), 'Must include English university name');
      assert.ok(html.includes(programCard.universityNameTh), 'Must include Thai university name');
      assert.ok(html.includes(programCard.programNameEn), 'Must include English program name');
      assert.ok(html.includes(programCard.programNameTh), 'Must include Thai program name');
      assert.ok(html.includes(programCard.degreeType), 'Must include degree abbreviation');
      assert.ok(html.includes(programCard.campus), 'Must include campus location');
      assert.ok(html.includes(programCard.lastChecked), 'Must include last checked timestamp');
      assert.ok(html.includes('Needs Checking'), 'Must render Needs Checking audit tag');
    });

    it('verifies zero forbidden terminology in rendered markup', () => {
      const html = renderToStaticMarkup(
        React.createElement(WhereToStudySection, {
          roleTitle: 'Data Analyst',
          majors: ['Data Science and Analytics'],
          broadField: 'Engineering & Technology',
        })
      );

      const forbiddenTerms = [
        'counselor',
        'triage',
        'dossier',
        'fit score',
        'percent',
        'moonshot',
        'interdisciplinary pivot',
        'tuition',
        'ranking',
      ];

      for (const term of forbiddenTerms) {
        assert.ok(
          !html.toLowerCase().includes(term),
          `Rendered HTML must not contain forbidden term: "${term}"`
        );
      }
    });
  });
});
