import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  RealityCheckSection,
  CourseChallengeAndReassurance,
  TrialCoursesBadgeList,
  CareerCard,
  MockNoticeBanner,
  SynthesisLoadingView,
  SynthesisErrorView,
  NavigationFooter,
  DossierContainer,
} from '@/components/dossier';
import type { CareerCard as CareerCardType, TrialCourse, DayInTheLife } from '@/types/career';

const SAMPLE_TRIAL_COURSES: [TrialCourse, TrialCourse] = [
  {
    title: 'Introduction to Cloud Architecture',
    provider: 'AWS Skill Builder',
    description: 'A beginner overview of fundamental virtual servers and cloud storage.',
    estimated_hours: 6,
  },
  {
    title: 'Linux Command Line Foundations',
    provider: 'freeCodeCamp',
    description: 'Learn practical shell commands in an interactive, non-intimidating format.',
    estimated_hours: 3,
  },
];

const SAMPLE_DAY_IN_THE_LIFE: DayInTheLife = {
  tasks: [
    'Write infrastructure-as-code scripts for server deployment',
    'Monitor telemetry dashboards to prevent performance bottlenecks',
    'Automate failover procedures and review container security alerts',
  ],
  misconceptions: [
    'Myth: Requires advanced calculus proofs all day. Reality: Focuses on architectural logic and configuration tools.',
  ],
};

const SAMPLE_CAREER_CARD: CareerCardType = {
  id: 'career_test_1',
  role_title: 'Cloud Infrastructure & Systems Reliability Specialist',
  match_tier: 'Primary Direct Match',
  fit_score: 96,
  fit_rationale: 'Directly converges hands-on systems building with remote workflows.',
  majors: ['Cloud Computing', 'Computer Information Systems', 'Network Technology'],
  minors: ['Applied Data Analysis', 'Technical Writing'],
  day_in_the_life: SAMPLE_DAY_IN_THE_LIFE,
  course_challenges: 'Applied Operating Systems and Network Protocols',
  reassurance: 'Systems coursework is grounded in hands-on terminals rather than abstract theoretical calculus.',
  trial_courses: SAMPLE_TRIAL_COURSES,
};

describe('Feature 6 Dossier Components Unit Tests', () => {
  describe('RealityCheckSection', () => {
    it('renders daily tasks and myth buster when dayInTheLife is provided', () => {
      const html = renderToStaticMarkup(
        React.createElement(RealityCheckSection, {
          dayInTheLife: SAMPLE_DAY_IN_THE_LIFE,
        })
      );

      assert.ok(html.includes('Day-in-the-Life Reality Check'));
      assert.ok(html.includes('Write infrastructure-as-code scripts'));
      assert.ok(html.includes('Monitor telemetry dashboards'));
      assert.ok(html.includes('Automate failover procedures'));
      assert.ok(html.includes('Myth:'));
      assert.ok(html.includes('Reality:'));
      assert.ok(html.includes('Requires advanced calculus proofs'));
    });

    it('falls back to dailyTasks array when dayInTheLife is not supplied', () => {
      const html = renderToStaticMarkup(
        React.createElement(RealityCheckSection, {
          dailyTasks: ['Calibrate hospital telemetry monitors', 'Perform safety inspection'],
        })
      );

      assert.ok(html.includes('Calibrate hospital telemetry monitors'));
      assert.ok(html.includes('Perform safety inspection'));
      assert.ok(!html.includes('Myth:'));
    });

    it('returns empty/null when no tasks or misconceptions are provided', () => {
      const html = renderToStaticMarkup(React.createElement(RealityCheckSection, {}));
      assert.equal(html, '');
    });
  });

  describe('CourseChallengeAndReassurance', () => {
    it('renders authentic course challenge and supportive reassurance', () => {
      const html = renderToStaticMarkup(
        React.createElement(CourseChallengeAndReassurance, {
          challenge: 'Applied Operating Systems and Network Protocols',
          reassurance: 'Systems coursework is visual, tangible, and interactive.',
        })
      );

      assert.ok(html.includes('Academic Navigation &amp; Support') || html.includes('Academic Navigation & Support'));
      assert.ok(html.includes('The Real College Hurdle:'));
      assert.ok(html.includes('Applied Operating Systems and Network Protocols'));
      assert.ok(html.includes('Why You Can Handle It:'));
      assert.ok(html.includes('Systems coursework is visual, tangible, and interactive.'));
    });

    it('returns empty/null when both challenge and reassurance are empty', () => {
      const html = renderToStaticMarkup(
        React.createElement(CourseChallengeAndReassurance, {
          challenge: '',
          reassurance: '',
        })
      );
      assert.equal(html, '');
    });
  });

  describe('TrialCoursesBadgeList', () => {
    it('renders exactly 2 foundational exploratory courses with hours and zero-cost badge', () => {
      const html = renderToStaticMarkup(
        React.createElement(TrialCoursesBadgeList, {
          trialCourses: SAMPLE_TRIAL_COURSES,
        })
      );

      assert.ok(html.includes('Zero-Cost Weekend Trial Courses'));
      assert.ok(html.includes('Introduction to Cloud Architecture'));
      assert.ok(html.includes('AWS Skill Builder'));
      assert.ok(html.includes('~6 hrs'));
      assert.ok(html.includes('Linux Command Line Foundations'));
      assert.ok(html.includes('freeCodeCamp'));
      assert.ok(html.includes('~3 hrs'));
      assert.ok(html.includes('Zero Tuition • Free Audit'));
    });
  });

  describe('CareerCard', () => {
    it('renders role title, tier badge, fit score, majors, minors and sub-sections', () => {
      const html = renderToStaticMarkup(
        React.createElement(CareerCard, {
          card: SAMPLE_CAREER_CARD,
          index: 0,
        })
      );

      assert.ok(html.includes('Primary Direct Match'));
      assert.ok(html.includes('96% Alignment'));
      assert.ok(html.includes('Cloud Infrastructure &amp; Systems Reliability Specialist') || html.includes('Cloud Infrastructure & Systems Reliability Specialist'));
      assert.ok(html.includes('Directly converges hands-on systems building'));
      assert.ok(html.includes('Cloud Computing'));
      assert.ok(html.includes('Computer Information Systems'));
      assert.ok(html.includes('Applied Data Analysis'));
      assert.ok(html.includes('Technical Writing'));
      // Sub-sections
      assert.ok(html.includes('Day-in-the-Life Reality Check'));
      assert.ok(html.includes('The Real College Hurdle:'));
      assert.ok(html.includes('Zero-Cost Weekend Trial Courses'));
    });

    it('applies tier-specific styling classes for different tiers', () => {
      const highGrowthCard: CareerCardType = {
        ...SAMPLE_CAREER_CARD,
        match_tier: 'High-Growth Pathway',
      };
      const html = renderToStaticMarkup(
        React.createElement(CareerCard, {
          card: highGrowthCard,
          index: 1,
        })
      );

      assert.ok(html.includes('High-Growth Pathway'));
      assert.ok(html.includes('bg-growth-50'));
    });
  });

  describe('MockNoticeBanner', () => {
    it('renders non-stigmatizing banner with demo notice and description', () => {
      const html = renderToStaticMarkup(
        React.createElement(MockNoticeBanner, {
          engine: 'mock-triage-fallback',
        })
      );

      assert.ok(html.includes('Curated Demonstration Pathways Active'));
      assert.ok(html.includes('Demo Mode Active'));
      assert.ok(html.includes('mock-triage-fallback'));
      assert.ok(!html.includes('429'));
      assert.ok(!html.includes('error'));
    });
  });

  describe('SynthesisLoadingView', () => {
    it('renders role="status", aria-live="polite", and animation elements', () => {
      const html = renderToStaticMarkup(
        React.createElement(SynthesisLoadingView, {
          studentNickname: 'Jordan',
        })
      );

      assert.ok(html.includes('role="status"'));
      assert.ok(html.includes('aria-live="polite"'));
      assert.ok(html.includes('aria-busy="true"'));
      assert.ok(html.includes('Jordan'));
      assert.ok(html.includes('deep breath'));
    });
  });

  describe('SynthesisErrorView', () => {
    it('renders error title, message, and action buttons', () => {
      const html = renderToStaticMarkup(
        React.createElement(SynthesisErrorView, {
          onRetry: () => {},
          onEditAnswers: () => {},
          errorMessage: 'Server timeout test error',
        })
      );

      assert.ok(html.includes('role="alert"'));
      assert.ok(html.includes('We need a brief moment to recharge'));
      assert.ok(html.includes('Server timeout test error'));
      assert.ok(html.includes('Try Again'));
      assert.ok(html.includes('Review My Answers'));
    });
  });

  describe('NavigationFooter', () => {
    it('renders Start Over action with >= 44px min-height styling and focus ring classes', () => {
      const html = renderToStaticMarkup(
        React.createElement(NavigationFooter, {
          onStartOver: () => {},
        })
      );

      assert.ok(html.includes('role="contentinfo"') || html.includes('<footer'));
      assert.ok(html.includes('Start Over'));
      assert.ok(html.includes('min-h-[44px]'));
      assert.ok(html.includes('focus-visible:ring-2'));
      assert.ok(html.includes('focus-visible:ring-edu-interactive'));
    });
  });

  describe('DossierContainer', () => {
    it('renders main landmark, archetype header, 4 cards in responsive grid, and footer', () => {
      const careersTuple: [CareerCardType, CareerCardType, CareerCardType, CareerCardType] = [
        { ...SAMPLE_CAREER_CARD, id: 'c1', match_tier: 'Primary Direct Match', role_title: 'Cloud Architect' },
        { ...SAMPLE_CAREER_CARD, id: 'c2', match_tier: 'High-Growth Pathway', role_title: 'Security Analyst' },
        { ...SAMPLE_CAREER_CARD, id: 'c3', match_tier: 'Interdisciplinary Pivot', role_title: 'Health Informatics' },
        { ...SAMPLE_CAREER_CARD, id: 'c4', match_tier: 'Moonshot Trajectory', role_title: 'Robotics Specialist' },
      ];

      const html = renderToStaticMarkup(
        React.createElement(DossierContainer, {
          summary: {
            student_archetype: 'The Practical Systems Architect',
            triage_narrative: 'Jordan demonstrates strong natural instincts for diagnosing technical systems.',
          },
          careers: careersTuple,
          meta: {
            engine: 'gemini-2.5-flash',
            generation_latency_ms: 1200,
            fallback_used: true,
          },
          studentNickname: 'Jordan',
          onStartOver: () => {},
        })
      );

      // Main Landmark
      assert.ok(html.includes('aria-label="Career recommendation dossier results"'));
      // Fallback Banner
      assert.ok(html.includes('Curated Demonstration Pathways Active'));
      // Header & Archetype
      assert.ok(html.includes("Jordan&#x27;s Career &amp; Major Pathways") || html.includes("Jordan's Career & Major Pathways"));
      assert.ok(html.includes('The Practical Systems Architect'));
      assert.ok(html.includes('Jordan demonstrates strong natural instincts'));
      // 4 Cards in Grid
      assert.ok(html.includes('Cloud Architect'));
      assert.ok(html.includes('Security Analyst'));
      assert.ok(html.includes('Health Informatics'));
      assert.ok(html.includes('Robotics Specialist'));
      // Footer
      assert.ok(html.includes('Start Over'));
    });
  });
});
