import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { DossierContainer, SynthesisLoadingView, MockNoticeBanner } from '@/components/dossier';
import { intakeReducer, INITIAL_INTAKE_STATE } from '@/context/IntakeContext';
import type { TriageSuccessResponse } from '@/types/api';
import type { IntakeState } from '@/types/intake';

// High-fidelity fixture matching Feature 5 synthesis output
const MOCK_TRIAGE_RESPONSE: TriageSuccessResponse = {
  success: true,
  summary: {
    student_archetype: 'The Purposeful Bio-Systems Builder',
    triage_narrative:
      'Alex thrives when engineering tangible systems that directly improve human lives, but carries significant anxiety around abstract higher mathematics. These recommendations focus on applied clinical technology, hardware diagnostics, and healthcare data systems where problem-solving is concrete rather than purely theoretical.',
  },
  careers: [
    {
      id: 'career_1',
      role_title: 'Biomedical Equipment & Systems Technologist',
      match_tier: 'Primary Direct Match',
      fit_score: 96,
      fit_rationale:
        'Directly converges hands-on system building with healthcare impact while applying practical physics rather than theoretical calculus.',
      majors: [
        'Biomedical Engineering Technology',
        'Clinical Laboratory Science',
        'Applied Instrumentation Engineering',
      ],
      minors: ['Technical Communication'],
      day_in_the_life: {
        tasks: [
          'Calibrate and diagnose telemetry, imaging, and dialysis systems in hospital surgical suites',
          'Design customized hardware modifications for patient accessibility equipment',
          'Perform preventive maintenance protocols to guarantee zero-failure healthcare devices',
        ],
        misconceptions: [
          'Myth: Requires calculating complex mathematical proofs all day. Reality: Focuses on architectural logic and hands-on hardware testing.',
        ],
      },
      course_challenges: 'Applied Circuit Theory & Electronics Math',
      reassurance:
        'Unlike abstract theoretical calculus that causes anxiety, circuit math is grounded directly in hands-on breadboards, physical voltage measurements, and immediate visual feedback.',
      trial_courses: [
        {
          title: 'Introduction to Biomedical Technology',
          provider: 'edX / DelftX (Free Audit)',
          description: 'Explore how medical hardware saves lives through practical engineering simulations.',
          estimated_hours: 6,
        },
        {
          title: 'Hands-On Arduino for Beginners',
          provider: 'freeCodeCamp (YouTube)',
          description: 'Build simulated physical circuits online with zero hardware cost using Tinkercad.',
          estimated_hours: 4,
        },
      ],
    },
    {
      id: 'career_2',
      role_title: 'Health Informatics Specialist',
      match_tier: 'High-Growth Pathway',
      fit_score: 92,
      fit_rationale: 'High-demand industry bridging healthcare clinical workflows with structured software systems.',
      majors: ['Health Information Management', 'Bioinformatics', 'Information Systems'],
      minors: ['Health Administration'],
      day_in_the_life: {
        tasks: [
          'Optimize hospital digital workflows to eliminate documentation friction for nurses',
          'Implement patient record interoperability standards across multi-clinic hospital networks',
          'Analyze patient safety data logs to flag adverse drug interactions',
        ],
        misconceptions: [
          'Myth: You need to be a doctor. Reality: You focus purely on information systems and workflow optimization.',
        ],
      },
      course_challenges: 'Relational Database Management & SQL Queries',
      reassurance:
        'Database querying is pure logic and language syntax rather than higher-order mathematics; you will learn it like building with digital LEGO blocks.',
      trial_courses: [
        {
          title: 'Health Informatics 101',
          provider: 'Coursera (Johns Hopkins / Free Audit)',
          description: 'Discover the vital role of medical data in patient outcomes.',
          estimated_hours: 5,
        },
        {
          title: 'SQL for Health Data Beginners',
          provider: 'Khan Academy (Free)',
          description: 'Step-by-step interactive lessons querying sample clinic tables.',
          estimated_hours: 3,
        },
      ],
    },
    {
      id: 'career_3',
      role_title: 'Assistive Technologies Coordinator',
      match_tier: 'Interdisciplinary Pivot',
      fit_score: 88,
      fit_rationale:
        'Combines engineering curiosity with direct human empathy, configuring adaptive tools for people with disabilities.',
      majors: ['Rehabilitation Technology', 'Special Education & Assistive Tech', 'Cognitive Ergonomics'],
      minors: ['Human-Centered Design'],
      day_in_the_life: {
        tasks: [
          'Evaluate student mobility and computer access needs at high schools and universities',
          'Configure screen-reading eye-tracking rigs and customized ergonomic input peripherals',
          'Train teachers, students, and family members on adaptive learning hardware and software',
        ],
        misconceptions: [
          'Myth: You sit isolated at a workbench. Reality: You collaborate warmly with students and educators.',
        ],
      },
      course_challenges: 'Universal Design for Learning (UDL) & Rehabilitation Regulations',
      reassurance:
        'This coursework is centered entirely on human usability and civil rights legal frameworks, with zero advanced math or laboratory chemistry.',
      trial_courses: [
        {
          title: 'Introduction to Assistive Technologies',
          provider: 'edX / Georgia Tech (Free Audit)',
          description: 'Learn how adaptive devices empower individuals across daily activities.',
          estimated_hours: 6,
        },
        {
          title: 'Digital Accessibility Foundations',
          provider: 'W3C / edX (Free)',
          description: 'Explore the principles of inclusive digital products and assistive devices.',
          estimated_hours: 4,
        },
      ],
    },
    {
      id: 'career_4',
      role_title: 'Clinical Robotics & Prosthetics Specialist',
      match_tier: 'Moonshot Trajectory',
      fit_score: 84,
      fit_rationale:
        'An aspirational frontier applying cutting-edge robotic limbs, myoelectric sensors, and neural interfaces.',
      majors: ['Robotics Technology', 'Applied Biomechanics', 'Mechatronics Systems'],
      minors: ['Computational Neuroscience'],
      day_in_the_life: {
        tasks: [
          'Program micro-controllers regulating movement speed in multi-articulated prosthetic hands',
          'Run gait-analysis software in rehabilitation motion capture labs to refine bionic knee responsiveness',
          'Collect electromyographic (EMG) muscle-signal telemetry during patient trial fittings',
        ],
        misconceptions: [
          'Myth: Requires a PhD in neuroscience. Reality: Applied robotics technologists build and tune the physical systems.',
        ],
      },
      course_challenges: 'Applied Kinematics & Sensor Calibration',
      reassurance:
        'Sensor calibration in robotics is visual and physical—you adjust potentiometer settings and watch motor servos physically respond in real time.',
      trial_courses: [
        {
          title: 'Robotics: Mobility Foundations',
          provider: 'Coursera / UPenn (Free Audit)',
          description: 'Explore fundamental mechanics behind wheeled and legged robots with visual simulations.',
          estimated_hours: 8,
        },
        {
          title: 'Interactive Biomechanics Simulation',
          provider: 'Stanford OpenClassroom (Free)',
          description: 'Hands-on exploration of physical muscle and joint motion models in web simulations.',
          estimated_hours: 4,
        },
      ],
    },
  ],
  meta: {
    engine: 'gemini-2.5-flash',
    generation_latency_ms: 1350,
    fallback_used: false,
  },
};

describe('Feature 6 Dossier Integration & State Machine Tests', () => {
  it('renders a full 4-career dossier payload with archetype header, 4 tiers, and footer', () => {
    const html = renderToStaticMarkup(
      React.createElement(DossierContainer, {
        summary: MOCK_TRIAGE_RESPONSE.summary,
        careers: MOCK_TRIAGE_RESPONSE.careers,
        meta: MOCK_TRIAGE_RESPONSE.meta,
        studentNickname: 'Alex',
        onStartOver: () => {},
      })
    );

    // Header & Personalization
    assert.ok(html.includes("Alex&#x27;s Career &amp; Major Pathways") || html.includes("Alex's Career & Major Pathways"));
    assert.ok(html.includes('The Purposeful Bio-Systems Builder'));
    assert.ok(html.includes('Alex thrives when engineering tangible systems'));

    // All 4 Tiers rendered simultaneously
    assert.ok(html.includes('Primary Direct Match'));
    assert.ok(html.includes('Biomedical Equipment &amp; Systems Technologist') || html.includes('Biomedical Equipment & Systems Technologist'));

    assert.ok(html.includes('High-Growth Pathway'));
    assert.ok(html.includes('Health Informatics Specialist'));

    assert.ok(html.includes('Interdisciplinary Pivot'));
    assert.ok(html.includes('Assistive Technologies Coordinator'));

    assert.ok(html.includes('Moonshot Trajectory'));
    assert.ok(html.includes('Clinical Robotics &amp; Prosthetics Specialist') || html.includes('Clinical Robotics & Prosthetics Specialist'));

    // Sub-sections in cards
    assert.ok(html.includes('Day-in-the-Life Reality Check'));
    assert.ok(html.includes('The Real College Hurdle:'));
    assert.ok(html.includes('Zero-Cost Weekend Trial Courses'));

    // Mock banner should NOT render when fallback_used is false
    assert.ok(!html.includes('Curated Demonstration Pathways Active'));

    // Navigation Footer
    assert.ok(html.includes('Start Over'));
  });

  it('renders MockNoticeBanner when meta.fallback_used is true', () => {
    const fallbackMeta = {
      ...MOCK_TRIAGE_RESPONSE.meta,
      fallback_used: true,
      engine: 'mock-triage-fallback',
    };

    const html = renderToStaticMarkup(
      React.createElement(DossierContainer, {
        summary: MOCK_TRIAGE_RESPONSE.summary,
        careers: MOCK_TRIAGE_RESPONSE.careers,
        meta: fallbackMeta,
        onStartOver: () => {},
      })
    );

    assert.ok(html.includes('Curated Demonstration Pathways Active'));
    assert.ok(html.includes('Demo Mode Active'));
    assert.ok(html.includes('mock-triage-fallback'));
  });

  it('verifies that Start Over action resets intake state completely back to Step 1', () => {
    // Simulate an intake state that reached Step 4 and completion
    const completedState: IntakeState = {
      currentStep: 4,
      studentNickname: 'Alex',
      answers: {
        q1TaskIds: ['BUILD_SYSTEMS', 'HELP_HUMANS'],
        q2SubjectId: 'HEALTH_BIO',
        q2Rationale: 'I want to help people but calculus terrifies me.',
        q3Environment: 'ACTIVE_FIELD_LAB',
        q4Ambition: 'WORKFORCE_DIRECT',
      },
      validationErrors: {},
      isResetDialogOpen: true,
      isCompleted: true,
      isHydrated: true,
    };

    // User confirms reset
    const nextState = intakeReducer(completedState, { type: 'RESET_STATE' });

    assert.equal(nextState.currentStep, 1);
    assert.equal(nextState.studentNickname, '');
    assert.equal(nextState.isCompleted, false);
    assert.equal(nextState.isResetDialogOpen, false);
    assert.deepEqual(nextState.answers.q1TaskIds, []);
    assert.equal(nextState.answers.q2SubjectId, null);
    assert.equal(nextState.answers.q2Rationale, '');
    assert.equal(nextState.answers.q3Environment, null);
    assert.equal(nextState.answers.q4Ambition, null);
    assert.deepEqual(nextState.validationErrors, {});
  });

  it('renders SynthesisLoadingView with accessible role and progressive reassurance note', () => {
    const html = renderToStaticMarkup(
      React.createElement(SynthesisLoadingView, {
        studentNickname: 'Sam',
      })
    );

    assert.ok(html.includes('role="status"'));
    assert.ok(html.includes('aria-live="polite"'));
    assert.ok(html.includes('aria-busy="true"'));
    assert.ok(html.includes('Sam'));
    assert.ok(html.includes('deep breath'));
  });
});
