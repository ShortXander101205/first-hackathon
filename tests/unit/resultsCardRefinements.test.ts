import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  CareerMatchCard,
  PrintHeader,
  ResultsContainer,
  ResultsHeader,
} from '@/components/results';
import { PathwayCard, GuideResult } from '@/types/career';
import { getMockCareerResults } from '@/data/mockCareerResults';
import { validateGuideSynthesisResult } from '@/lib/guideValidator';

const SAMPLE_FEATURE_14_CARD: PathwayCard = {
  id: 'pathway_test_1',
  roleTitle: 'Software Developer',
  broadField: 'Engineering & Technology',
  badge: 'Top Match',
  groundedRationale:
    'Because you naturally enjoy building systems and tinkering with logic, software development gives you tangible daily problems to solve in a focused digital environment.',
  overview: 'Designs, codes, and maintains web applications and digital tools that help organizations solve operational challenges.',
  milestones: {
    education: 'Bachelor of Science in Computer Science or Software Engineering',
    entryRole: 'Junior Software Engineer or Front-End Developer',
    growthRole: 'Lead Software Architect or Engineering Team Lead',
  },
  dailyTasks: [
    'Write clean, modular code to implement web and mobile features',
    'Test and debug software components in development environments',
    'Review peer code pull requests and participate in sprint standups',
  ],
  studyPath: 'Coursework covers object-oriented programming, data structures, and database foundations.',
  reassurance: 'Instead of abstract mathematical proofs on paper, modern programming is learned through immediate visual trial and error.',
  majors: ['Computer Science', 'Software Engineering'],
  minors: ['Applied Mathematics'],
  trialCourses: [
    {
      title: 'CS50x: Introduction to Computer Science',
      provider: 'edX / Harvard (Free Audit)',
      description: 'A beginner-friendly dive into algorithmic thinking and programming basics.',
      estimatedHours: 8,
      searchQuery: 'edX CS50x introduction to computer science free',
    },
    {
      title: 'Responsive Web Design Certification',
      provider: 'freeCodeCamp',
      description: 'Learn HTML, CSS, and basic interactive layout fundamentals over a weekend.',
      estimatedHours: 5,
      searchQuery: 'freeCodeCamp responsive web design free',
    },
  ],
  whereToStudyReady: true,
};

describe('Feature 14: Simpler Suggestions and Clean PDF Unit Tests', () => {
  describe('CareerMatchCard Refinements (AC-SUGGEST-01, AC-SUGGEST-02, AC-SUGGEST-03)', () => {
    it('renders qualitative badge "Top Match" and completely omits percentage fit scores', () => {
      const html = renderToStaticMarkup(
        React.createElement(CareerMatchCard, {
          card: SAMPLE_FEATURE_14_CARD,
          isExpanded: false,
          onToggle: () => {},
        })
      );

      // Must display locked qualitative badge
      assert.ok(html.includes('Top Match'), 'Must render "Top Match" badge');
      assert.ok(html.includes('Software Developer'), 'Must render role title');
      assert.ok(html.includes('Engineering &amp; Technology') || html.includes('Engineering & Technology'));

      // MUST NOT contain percentage match scores
      assert.ok(!html.includes('95%'), 'Must not render percentage fit scores');
      assert.ok(!html.includes('Natural Fit'), 'Must not render "Natural Fit" score label');
      assert.ok(!html.includes('Moonshot Trajectory'), 'Must not render startup tier labels');
      assert.ok(!html.includes('Interdisciplinary Pivot'), 'Must not render startup tier labels');
    });

    it('renders qualitative badge "Explore Also" for adjacent pathway cards', () => {
      const exploreCard: PathwayCard = {
        ...SAMPLE_FEATURE_14_CARD,
        id: 'pathway_test_2',
        roleTitle: 'UI/UX & Product Designer',
        broadField: 'Design & Creative Arts',
        badge: 'Explore Also',
      };

      const html = renderToStaticMarkup(
        React.createElement(CareerMatchCard, {
          card: exploreCard,
          isExpanded: false,
          onToggle: () => {},
        })
      );

      assert.ok(html.includes('Explore Also'), 'Must render "Explore Also" badge');
      assert.ok(!html.includes('Top Match'), 'Must not render "Top Match" on adjacent cards');
      assert.ok(!html.includes('%'), 'Must not render percentage signs');
    });

    it('renders 3-stage milestone progression line within an ordered list <ol>', () => {
      const html = renderToStaticMarkup(
        React.createElement(CareerMatchCard, {
          card: SAMPLE_FEATURE_14_CARD,
          isExpanded: true,
          onToggle: () => {},
        })
      );

      // Verify semantic <ol> structure
      assert.ok(html.includes('<ol'), 'Milestones must be rendered inside an <ol>');
      assert.ok(html.includes('Career Progression Milestones'));
      assert.ok(html.includes('Bachelor of Science in Computer Science'));
      assert.ok(html.includes('Junior Software Engineer or Front-End Developer'));
      assert.ok(html.includes('Lead Software Architect or Engineering Team Lead'));
      assert.ok(html.includes('1. Education &amp; Degree') || html.includes('1. Education & Degree'));
      assert.ok(html.includes('2. Entry-Level Role'));
      assert.ok(html.includes('3. Long-Term Growth'));
    });

    it('renders grounded rationale connecting daily tasks to student preferences', () => {
      const html = renderToStaticMarkup(
        React.createElement(CareerMatchCard, {
          card: SAMPLE_FEATURE_14_CARD,
          isExpanded: false,
          onToggle: () => {},
        })
      );

      assert.ok(html.includes('Why This Fits You'));
      assert.ok(html.includes('tangible daily problems to solve in a focused digital environment'));
    });

    it('preserves DOM persistence in collapsed state with hidden print:block', () => {
      const html = renderToStaticMarkup(
        React.createElement(CareerMatchCard, {
          card: SAMPLE_FEATURE_14_CARD,
          isExpanded: false,
          onToggle: () => {},
        })
      );

      assert.ok(html.includes('aria-expanded="false"'));
      assert.ok(html.includes('hidden print:block'), 'Details must be mounted with hidden print:block for print auto-expansion');
    });
  });

  describe('PrintHeader Privacy & Formatting (AC-PRINT-01, AC-PRINT-03)', () => {
    it('renders student name, grade level, date, and persistent advisor note', () => {
      const html = renderToStaticMarkup(
        React.createElement(PrintHeader, {
          studentName: 'Alex Morgan',
          gradeLevel: 'grade_12',
          fallbackUsed: false,
        })
      );

      assert.ok(html.includes('Alex Morgan'), 'Must render student name');
      assert.ok(html.includes('Grade 12'), 'Must render formatted grade level');
      assert.ok(html.includes('PathLess Educational Guidance Report'));
      assert.ok(html.includes('Advisor &amp; Student Discussion Note') || html.includes('Advisor & Student Discussion Note'));
      assert.ok(html.includes('starting points for conversation and discovery, not permanent decisions'));
    });

    it('renders sample data notice when fallbackUsed is true', () => {
      const html = renderToStaticMarkup(
        React.createElement(PrintHeader, {
          studentName: 'Alex Morgan',
          gradeLevel: 'grade_12',
          fallbackUsed: true,
        })
      );

      assert.ok(html.includes('Sample Exploration Data'));
    });

    it('STRICT PRIVACY GUARANTEE: strictly omits student ID from print layout (AC-PRINT-03)', () => {
      const html = renderToStaticMarkup(
        React.createElement(PrintHeader, {
          studentName: 'Alex Morgan',
          gradeLevel: 'grade_12',
        })
      );

      // Verify that student ID labels or identifiers never appear
      assert.ok(!html.toLowerCase().includes('student id'));
      assert.ok(!html.includes('STU-'));
      assert.ok(!html.includes('stu_'));
    });
  });

  describe('ResultsContainer & Screen Advisory Copy (AC-SUGGEST-05, AC-PRINT-02)', () => {
    it('renders PrintHeader and persistent screen advisory note ("suggestions, not decisions")', () => {
      const mockResult: GuideResult = getMockCareerResults();
      const html = renderToStaticMarkup(
        React.createElement(ResultsContainer, {
          result: mockResult,
          onClear: () => {},
        })
      );

      // Verify PrintHeader is rendered
      assert.ok(html.includes('PathLess Educational Guidance Report'));

      // Verify Advisory Notice ("suggestions, not decisions")
      assert.ok(html.includes('Suggestions, not decisions'));
      assert.ok(html.includes('school advisor, mentor, or trusted guide'));

      // Verify all 4 cards rendered
      assert.ok(html.includes('Software Developer'));
      assert.ok(html.includes('Data Analyst'));
      assert.ok(html.includes('UI/UX &amp; Product Designer') || html.includes('UI/UX & Product Designer'));
      assert.ok(html.includes('Public Health Coordinator'));
    });
  });

  describe('Route Synthesis Catalog Guardrail (validateGuideSynthesisResult)', () => {
    it('accepts compliant 4-card synthesis with 2 Top Match + 2 Explore Also from catalog', () => {
      const mockResult = getMockCareerResults();
      const isValid = validateGuideSynthesisResult(mockResult);
      assert.strictEqual(isValid, true, 'Valid 4-card catalog result must pass validation');
    });

    it('rejects synthesis result if any role title is not in the curated catalog', () => {
      const mockResult = getMockCareerResults();
      const invalidResult = {
        ...mockResult,
        pathways: [
          {
            ...mockResult.pathways[0],
            roleTitle: 'Hyper-Growth Crypto Hacker',
          },
          mockResult.pathways[1],
          mockResult.pathways[2],
          mockResult.pathways[3],
        ],
      };

      const isValid = validateGuideSynthesisResult(invalidResult);
      assert.strictEqual(isValid, false, 'Non-catalog role title must fail validation');
    });

    it('rejects synthesis result if any major is not in the curated catalog', () => {
      const mockResult = getMockCareerResults();
      const invalidResult = {
        ...mockResult,
        pathways: [
          {
            ...mockResult.pathways[0],
            majors: ['Invented Unaccredited Major', 'Nonexistent Studies'],
          },
          mockResult.pathways[1],
          mockResult.pathways[2],
          mockResult.pathways[3],
        ],
      };

      const isValid = validateGuideSynthesisResult(invalidResult);
      assert.strictEqual(isValid, false, 'Non-catalog major must fail validation');
    });

    it('rejects synthesis result if badge distribution violates 2 Top Match + 2 Explore Also', () => {
      const mockResult = getMockCareerResults();
      const invalidResult = {
        ...mockResult,
        pathways: [
          { ...mockResult.pathways[0], badge: 'Top Match' },
          { ...mockResult.pathways[1], badge: 'Top Match' },
          { ...mockResult.pathways[2], badge: 'Top Match' }, // 3 Top Matches
          { ...mockResult.pathways[3], badge: 'Explore Also' },
        ],
      };

      const isValid = validateGuideSynthesisResult(invalidResult);
      assert.strictEqual(isValid, false, '3 Top Match cards must fail validation');
    });

    it('rejects synthesis result if Explore Also card shares the primary field (violates domain breadth)', () => {
      const mockResult = getMockCareerResults();
      const invalidResult = {
        ...mockResult,
        pathways: [
          mockResult.pathways[0], // Software Developer (Engineering & Technology)
          mockResult.pathways[1], // Data Analyst (Engineering & Technology)
          {
            ...mockResult.pathways[2],
            roleTitle: 'Cybersecurity Specialist', // Also Engineering & Technology!
            broadField: 'Engineering & Technology',
            badge: 'Explore Also',
            majors: ['Cybersecurity and Network Systems', 'Computer Engineering'],
          },
          mockResult.pathways[3],
        ],
      };

      const isValid = validateGuideSynthesisResult(invalidResult);
      assert.strictEqual(isValid, false, 'Explore Also sharing primary field must fail validation');
    });

    it('rejects synthesis result if milestones are missing or empty', () => {
      const mockResult = getMockCareerResults();
      const invalidResult = {
        ...mockResult,
        pathways: [
          {
            ...mockResult.pathways[0],
            milestones: { education: '', entryRole: '', growthRole: '' },
          },
          mockResult.pathways[1],
          mockResult.pathways[2],
          mockResult.pathways[3],
        ],
      };

      const isValid = validateGuideSynthesisResult(invalidResult);
      assert.strictEqual(isValid, false, 'Empty milestones must fail validation');
    });
  });
});
