/**
 * PathwayAI: College Major & Career Triage MVP
 * Centralized User-Facing Copy for Intake Wizard
 * Tone: Calm, validating, plain language tailored for anxious 17-19 year olds.
 * 
 * Strict Contract: 100% of user-facing strings, questions, helper copy,
 * button labels, step titles, character count labels, and ARIA announcements
 * must live strictly in this file.
 */

export const INTAKE_COPY = {
  // Global Shell & Reassurance Copy
  shell: {
    badge: 'Zero-Pressure Exploration',
    subBadge: 'Takes ~2 minutes • No test scores or grades required',
    reassuranceNote:
      'There are no right or wrong answers. Choose what feels natural to you right now—your pathways are built to fit your comfort, not test your knowledge.',
    stepCountLabel: (current: number, total: number) => `Step ${current} of ${total}`,
    completionBannerTitle: 'Intake Presentation Review Ready',
    completionBannerMessage:
      'You have explored all 4 intake questions! This presentation layer is ready for Feature 4 state machine integration.',
  },

  // Step Indicator Definitions
  steps: [
    {
      step: 1,
      title: 'Energy & Tasks',
      shortLabel: 'Tasks',
      description: 'What activates your focus',
    },
    {
      step: 2,
      title: 'Subjects & Focus',
      shortLabel: 'Subjects',
      description: 'Curiosities and hesitations',
    },
    {
      step: 3,
      title: 'Work Setting',
      shortLabel: 'Setting',
      description: 'Your ideal day-to-day environment',
    },
    {
      step: 4,
      title: 'Future Ambition',
      shortLabel: 'Horizon',
      description: 'Your next horizon after college',
    },
  ],

  // Question 1: Task View (Intellectual Energy)
  questionOne: {
    stepNumber: 1,
    title: 'When you lose track of time, what kinds of tasks feel most natural?',
    helperText: 'Pick 1 or 2 that feel most like you. There is no need to overthink it.',
    selectionCountLabel: (count: number, max: number) =>
      count === 0
        ? 'Select 1 or 2 options'
        : count === 1
        ? `1 of ${max} selected (you can pick 1 more)`
        : `${count} of ${max} selected (maximum reached)`,
    maxReachedHint: 'You have selected 2 tasks. Deselect one to choose this instead.',
    options: [
      {
        id: 'BUILD_SYSTEMS',
        title: 'Building & Designing Systems',
        description:
          'Fixing things, coding, sketching physical projects, or assembling parts to see how they work together.',
      },
      {
        id: 'ANALYZE_PATTERNS',
        title: 'Investigating & Solving Puzzles',
        description:
          'Digging into curious questions, spotting hidden patterns, researching facts, and untangling mysteries.',
      },
      {
        id: 'HELP_HUMANS',
        title: 'Guiding & Supporting People',
        description:
          'Listening closely to others, offering advice, teaching concepts, and helping friends navigate challenges.',
      },
      {
        id: 'LEAD_ORGANIZING',
        title: 'Organizing & Leading Initiatives',
        description:
          'Bringing groups together, mapping out schedules, coordinating events, and turning scattered ideas into action.',
      },
    ],
  },

  // Question 2: Subject View (Academic Affinity & Dread)
  questionTwo: {
    stepNumber: 2,
    title: 'Which academic areas interest you, and what gives you hesitation?',
    helperText:
      'Choose the subject field you lean toward, then share a quick thought about what excites or worries you.',
    subjectChipSectionLabel: 'Select primary subject area:',
    options: [
      {
        id: 'STEM_TECH',
        title: 'Technology & Computing',
        badge: 'Tech & Math',
      },
      {
        id: 'HEALTH_BIO',
        title: 'Health, Medicine & Biology',
        badge: 'Life Sciences',
      },
      {
        id: 'BUSINESS_SOCIETY',
        title: 'Business & Social Innovation',
        badge: 'Economics & Org',
      },
      {
        id: 'ARTS_HUMANITIES',
        title: 'Arts, Writing & Media',
        badge: 'Creative & Culture',
      },
      {
        id: 'PUBLIC_POLICY',
        title: 'Law, Policy & Community Impact',
        badge: 'Civics & Society',
      },
    ],
    textAreaLabel: 'What makes you curious or nervous about this area? (A sentence or two)',
    textAreaPlaceholder:
      'e.g., I love laboratory experiments, but advanced theoretical calculus stresses me out...',
    characterCounter: (current: number, max: number) => `${current}/${max} characters`,
    characterLimitWarning: 'Approaching maximum length (150 characters max).',
    characterMaxLimit: 150,
  },

  // Question 3: Environment View (Work Setting)
  questionThree: {
    stepNumber: 3,
    title: 'What day-to-day setting sounds most sustainable for your energy?',
    helperText:
      'Think about where you feel calm and capable, rather than where you think you "should" work.',
    options: [
      {
        id: 'REMOTE_DESK',
        title: 'Remote & Focused Desk',
        badge: 'Digital & Flexible',
        description:
          'Quiet focus, flexible digital workspace, deep independent projects, and collaborating through virtual tools.',
      },
      {
        id: 'ACTIVE_FIELD_LAB',
        title: 'Active, Field & Lab',
        badge: 'Hands-on & Dynamic',
        description:
          'On-your-feet movement, laboratories, workshops, clinical facilities, or engaging with people face-to-face.',
      },
    ],
  },

  // Question 4: Ambition View (Post-College Horizon)
  questionFour: {
    stepNumber: 4,
    title: 'Looking past college, what timeline feels right for your next step?',
    helperText:
      'Remember: your choice is never permanent. Choose what fits your peace of mind today.',
    options: [
      {
        id: 'WORKFORCE_DIRECT',
        title: 'Direct 2–4 Year Workforce',
        badge: 'Career & Independence',
        description:
          'Step directly into professional employment soon after graduation, build financial independence, and learn on the job.',
      },
      {
        id: 'GRADUATE_STUDY',
        title: 'Graduate & Specialized Study',
        badge: 'Advanced Degrees',
        description:
          'Continue into master’s programs, medical/law school, doctoral research, or specialized clinical training.',
      },
    ],
  },

  // Navigation Controls Copy
  navigation: {
    previous: 'Previous',
    next: 'Continue',
    review: 'Review Pathways',
    previousAriaLabel: 'Return to previous question',
    nextAriaLabel: 'Proceed to next question',
    reviewAriaLabel: 'Proceed to review generated pathways',
    disabledNotice: 'Select an option above to continue',
  },

  // Validation Prompts (Calm, non-judgmental tone)
  validation: {
    step1Required: 'Please select 1 or 2 tasks that feel natural to you.',
    step2SubjectRequired: 'Please choose a subject area that interests you.',
    step2RationaleRequired: 'Please share a brief thought (at least 1 character) about what excites or worries you.',
    step2RationaleMaxLength: 'Please keep your thought within 150 characters.',
    step3EnvironmentRequired: 'Please choose which day-to-day setting sounds best for your energy.',
    step4AmbitionRequired: 'Please choose which post-college timeline feels right today.',
    navigationBlocked: 'Please complete the question above before moving forward. Take your time.',
  },

  // Reset Dialog Copy (Calm, non-punitive tone)
  resetDialog: {
    triggerButton: 'Start Over',
    counselorTriggerButton: 'Reset Intake Data',
    title: 'Start fresh with a clean slate?',
    description:
      'This will clear all your answers and return you to Question 1. You can take as much time as you need.',
    confirm: 'Yes, start over',
    cancel: 'Keep my answers',
    ariaLabel: 'Reset intake questionnaire confirmation',
  },

  // Student Nickname & Personalization Copy
  nicknamePrompt: {
    label: 'First name or nickname (optional)',
    placeholder: 'e.g., Alex',
    helperText: 'Used only to personalize your career pathways. You can leave this blank if you prefer.',
  },

  // Storage Notices & Edge Case Guidance
  storageNotice: {
    inMemoryFallback:
      'Note: Browser session storage is disabled. Your answers will be saved in memory for this session only.',
  },

  // Accessibility & ARIA Announcements
  a11y: {
    wizardLandmark: 'College Major and Career Intake Wizard',
    progressNav: 'Intake questionnaire progress',
    stepCompleted: (stepNumber: number, title: string) => `Step ${stepNumber}: ${title} completed`,
    stepCurrent: (stepNumber: number, title: string) => `Current Step ${stepNumber}: ${title}`,
    stepUpcoming: (stepNumber: number, title: string) => `Upcoming Step ${stepNumber}: ${title}`,
    characterMilestoneWarning: (remaining: number) => `${remaining} characters remaining`,
    characterLimitReached: 'Maximum 150 character limit reached',
    taskMaxReachedHint: 'You have selected 2 tasks. Deselect one to choose this instead.',
    resetCompleted: 'Intake answers have been reset to Question 1.',
    navigationBlocked: 'Please complete the current question before moving forward.',
    selected: 'Selected',
    unselected: 'Not selected',
  },

  // Home Page Presentation & Preview Sandbox Copy
  home: {
    headingPrefix: 'College Major & Career Triage for ',
    headingHighlight: 'Stressed Students',
    counselorLink: 'Counselor Dashboard',
    quickSwitcherLabel: 'Jump to question view:',
    summaryTitle: (nickname?: string) =>
      nickname?.trim() ? `${nickname.trim()}'s Pathway Summary` : 'Your Pathway Summary',
    summaryEnergyLabel: 'Q1 Energy:',
    summarySubjectLabel: 'Q2 Subject:',
    summarySettingLabel: 'Q3 Setting:',
    summaryAmbitionLabel: 'Q4 Ambition:',
    restartButton: 'Restart Intake Preview',
  },

  // Server & API Error Copy for Feature 5
  serverErrors: {
    validationFailed:
      'We could not process your responses. Please verify that each question has been answered and try again.',
    payloadTooLarge:
      'The submission payload was too large. Please shorten your response and try again.',
    unsupportedMediaType:
      'The request format is unsupported. Please submit your responses as application/json.',
    rateLimited:
      'PathwayAI is experiencing high demand right now. Please take a deep breath and try again in a few moments.',
    serviceUnavailable:
      'Our career synthesis service is taking a brief moment to recharge. Your answers are safe—please try submitting again shortly.',
    timeout:
      'Generating your pathways took a little longer than expected. Please try submitting again.',
    demoModeActive:
      'Career synthesis is operating in demo mode. High-fidelity realistic pathways will be provided.',
    generic:
      'Something unexpected occurred while crafting your pathways. Please try again in a moment.',
  },

  // Loading & Progressive Reassurance Copy
  loadingReassurance: [
    'Reviewing your natural energy and focus...',
    'Exploring modern, high-demand career pathways...',
    'Connecting day-to-day tasks with low-friction college majors...',
    'Addressing your academic dread with supportive reassurance...',
    'Curating zero-cost weekend trial courses...',
  ],
} as const;

export type IntakeCopyType = typeof INTAKE_COPY;


