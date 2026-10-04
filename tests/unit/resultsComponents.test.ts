import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  WhereToStudySection,
  ResultsHeader,
  ResultsFooter,
  CareerMatchCard,
  ResultsContainer,
} from '@/components/results';
import { PathwayCard, GuideResult } from '@/types/career';

const SAMPLE_PATHWAY_CARD: PathwayCard = {
  id: 'pathway_sample_1',
  roleTitle: 'Cloud Reliability & Operations Specialist',
  broadField: 'Information Technology & Cloud Systems',
  matchTier: 'Primary Direct Match',
  fitScore: 96,
  overview: 'Automates and maintains resilient digital cloud systems so services run smoothly without interruptions.',
  dailyTasks: [
    'Deploy infrastructure automation scripts across virtual servers',
    'Monitor application performance metrics for system bottlenecks',
    'Collaborate on incident prevention and security audits',
  ],
  studyPath: 'Studies encompass operating systems, virtual networking, scripting, and cloud architecture fundamentals in hands-on labs.',
  reassurance: 'Instead of abstract calculus tests, coursework focuses on real virtual server configurations with immediate feedback.',
  majors: ['Cloud Computing Architecture', 'Information Technology'],
  minors: ['Technical Communication'],
  trialCourses: [
    {
      title: 'Cloud Foundations & Infrastructure',
      provider: 'Coursera (Free Audit)',
      description: 'Learn fundamental cloud concepts without fees.',
      estimatedHours: 6,
      searchQuery: 'Cloud foundations free audit course',
    },
    {
      title: 'Linux Command Line Fundamentals',
      provider: 'freeCodeCamp',
      description: 'Essential terminal commands and shell navigation.',
      estimatedHours: 3,
      searchQuery: 'freeCodeCamp Linux command line basics',
    },
  ],
  whereToStudyReady: true,
};

const SAMPLE_GUIDE_RESULT: GuideResult = {
  success: true,
  submissionId: 'sub_test_123',
  studentProfile: {
    fullName: 'Alex Morgan',
    gradeLevel: 'grade_12',
  },
  summary: {
    studentArchetype: 'The Strategic Systems Explorer',
    narrativeSummary: 'Alex demonstrates natural problem-solving strengths. These pathways connect your focus with practical degree programs.',
  },
  pathways: [
    SAMPLE_PATHWAY_CARD,
    {
      ...SAMPLE_PATHWAY_CARD,
      id: 'pathway_sample_2',
      roleTitle: 'Cyber Defense Analyst',
      matchTier: 'High-Growth Pathway',
      overview: 'Monitors digital networks to safeguard data and prevent unauthorized intrusions.',
    },
    {
      ...SAMPLE_PATHWAY_CARD,
      id: 'pathway_sample_3',
      roleTitle: 'Health Systems Data Coordinator',
      matchTier: 'Interdisciplinary Pivot',
      overview: 'Coordinates clinical database systems so healthcare providers have rapid patient access.',
    },
    {
      ...SAMPLE_PATHWAY_CARD,
      id: 'pathway_sample_4',
      roleTitle: 'Autonomous Simulation Specialist',
      matchTier: 'Moonshot Trajectory',
      overview: 'Builds virtual physics simulations to test autonomous robotics safely before deployment.',
    },
  ],
  meta: {
    engine: 'mock-engine',
    fallbackUsed: false,
  },
};

describe('Feature 8: Results UI Components Unit Tests', () => {
  describe('ResultsHeader', () => {
    it('renders personalized h1 heading when student name is provided', () => {
      const html = renderToStaticMarkup(
        React.createElement(ResultsHeader, { studentName: 'Jordan Taylor' })
      );
      assert.ok(html.includes('<h1'));
      assert.ok(html.includes("Jordan&#x27;s Recommended Pathways") || html.includes("Jordan's Recommended Pathways"));
    });

    it('renders default h1 heading when student name is omitted', () => {
      const html = renderToStaticMarkup(React.createElement(ResultsHeader, {}));
      assert.ok(html.includes('<h1'));
      assert.ok(html.includes('Your Recommended Pathways'));
    });

    it('renders advisory disclaimer with mentor guidance and zero counselor mentions', () => {
      const html = renderToStaticMarkup(React.createElement(ResultsHeader, {}));
      assert.ok(html.includes('Advisory Guide Notice'));
      assert.ok(html.includes('school advisor, mentor, or trusted guide'));
      assert.ok(!html.toLowerCase().includes('counselor'));
    });

    it('renders archetype banner and demo badge when fallback is active', () => {
      const html = renderToStaticMarkup(
        React.createElement(ResultsHeader, {
          summary: {
            studentArchetype: 'The Curious Innovator',
            narrativeSummary: 'Calm narrative summary.',
          },
          fallbackUsed: true,
        })
      );
      assert.ok(html.includes('The Curious Innovator'));
      assert.ok(html.includes('Sample pathways are shown for demonstration'));
    });
  });

  describe('WhereToStudySection', () => {
    it('renders groundwork placeholder shell with regional pathways badge', () => {
      const html = renderToStaticMarkup(
        React.createElement(WhereToStudySection, {
          roleTitle: 'Cloud Engineer',
          majors: ['Cloud Architecture', 'Informatics'],
        })
      );
      assert.ok(html.includes('Where to Study'));
      assert.ok(html.includes('Regional Pathways Coming Soon'));
      assert.ok(html.includes('Zero unverified admissions claims'));
      assert.ok(html.includes('contain:content') || html.includes('contain: content'));
    });
  });

  describe('CareerMatchCard', () => {
    it('renders collapsed card state by default with aria-expanded="false" and 30-word overview', () => {
      const html = renderToStaticMarkup(
        React.createElement(CareerMatchCard, {
          card: SAMPLE_PATHWAY_CARD,
          isExpanded: false,
          onToggle: () => {},
        })
      );

      assert.ok(html.includes('aria-expanded="false"'));
      assert.ok(html.includes('Cloud Reliability &amp; Operations Specialist') || html.includes('Cloud Reliability & Operations Specialist'));
      assert.ok(html.includes('Primary Direct Match'));
      assert.ok(html.includes('96%'));
      assert.ok(html.includes('View pathway details'));

      // DOM Persistence: verify details container is mounted with hidden print:block
      assert.ok(html.includes('hidden print:block'));
    });

    it('renders expanded card state with aria-expanded="true" and revealed details', () => {
      const html = renderToStaticMarkup(
        React.createElement(CareerMatchCard, {
          card: SAMPLE_PATHWAY_CARD,
          isExpanded: true,
          onToggle: () => {},
        })
      );

      assert.ok(html.includes('aria-expanded="true"'));
      assert.ok(html.includes('Hide pathway details'));
      assert.ok(html.includes('Deploy infrastructure automation scripts'));
      assert.ok(html.includes('Cloud Foundations &amp; Infrastructure') || html.includes('Cloud Foundations & Infrastructure'));
      assert.ok(html.includes('Where to Study'));
    });
  });

  describe('ResultsFooter', () => {
    it('renders print/save PDF and start over actions with no-print class', () => {
      const html = renderToStaticMarkup(
        React.createElement(ResultsFooter, {
          onClear: () => {},
          onPrint: () => {},
        })
      );

      assert.ok(html.includes('no-print'));
      assert.ok(html.includes('Print or Save as PDF'));
      assert.ok(html.includes('Start Over'));
    });
  });

  describe('ResultsContainer', () => {
    it('renders all 4 cards collapsed by default on initial load', () => {
      const html = renderToStaticMarkup(
        React.createElement(ResultsContainer, {
          result: SAMPLE_GUIDE_RESULT,
          onClear: () => {},
        })
      );

      // Verify all 4 cards have aria-expanded="false"
      const collapsedMatches = html.match(/aria-expanded="false"/g);
      assert.strictEqual(collapsedMatches?.length, 4, 'All 4 cards must be collapsed on load');

      // Verify page h1 rendered
      assert.ok(html.includes("Alex&#x27;s Recommended Pathways") || html.includes("Alex's Recommended Pathways"));

      // Verify footer rendered
      assert.ok(html.includes('Print or Save as PDF'));
    });
  });
});
