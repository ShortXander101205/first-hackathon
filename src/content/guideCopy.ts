/**
 * PathLess: College Major and Career Discovery Guide v2
 * Centralized User-Facing Copy for Guide, Intake Wizard, Results and Print
 * Tone: Calm, validating, plain language tailored for 16-20 year old students (8th–12th grade level).
 * 
 * Strict Invariant: 100% of user-facing strings, questions, helper copy,
 * button labels, step titles, character count labels, and ARIA announcements
 * must live strictly in this file and modularized content files.
 * Invariant: Zero legacy branding or clinical jargon permitted.
 */

import { INTAKE_QUESTIONS } from './intakeQuestions';
export { INTAKE_QUESTIONS } from './intakeQuestions';

export const GUIDE_COPY = {
  brand: {
    name: 'PathLess',
    tagline: 'College Major and Career Exploration Without the Pressure',
    guideTitle: 'PathLess Guide',
  },

  nav: {
    brandName: 'PathLess',
    brandTagline: 'College & Career Discovery',
    studentGuideLink: 'Discovery Guide',
    advisorPortalLink: 'Advisor Portal',
  },

  footer: {
    brandName: 'PathLess',
    tagline: 'Turning college major anxiety into calm, confident exploration.',
    frameworkBadge: 'PathLess Framework v2',
    versionBadge: 'v2.0.0',
  },

  meta: {
    title: 'PathLess — College Major and Career Discovery Guide',
    template: '%s | PathLess',
    description:
      'A calm, zero-pressure college major and career discovery guide helping high school and early college students find clarity and explore realistic pathways.',
    siteName: 'PathLess',
    keywords: [
      'college major discovery',
      'career pathway exploration',
      'student guidance',
      'education guide',
      'academic reassurance',
    ],
  },

  shell: {
    badge: 'Zero-Pressure Exploration',
    subBadge: '12 Questions • Takes ~3–4 minutes • No test scores or grades required',
    reassuranceNote:
      'There are no right or wrong answers. Choose what feels natural to you right now—your pathways are built to fit your comfort, not test your knowledge.',
    stepProgressLabel: (current: number, total: number = 12) => `Question ${current} of ${total}`,
    stepPercentLabel: (percent: number) => `${percent}% Complete`,
    welcomeStepLabel: 'Welcome & Profile',
    brandSuffix: 'Guide',
    completionTitle: 'You Have Completed the PathLess Guide!',
    completionMessage: 'Your 12 responses have been validated and saved for personal synthesis.',
    reviewAnswersButton: 'Review Answers',
  },

  stepTitles: {
    0: 'Welcome and Student Profile',
    1: 'Daily Focus & Task Energy',
    2: 'Academic Curiosity',
    3: 'High School Study Track',
    4: 'Academic Hesitation & Worry',
    5: 'Physical Work Environment',
    6: 'Social Energy & Collaboration',
    7: 'Problem-Solving Instinct',
    8: 'Structure vs. Ambiguity',
    9: 'Practical Work Context',
    10: 'Academic Stress Minimization',
    11: 'Core Life & Career Horizon',
    12: 'Post-College Next Chapter',
  },

  welcome: {
    stepNumber: 0,
    heading: 'Find Your Direction Without the Anxiety',
    subheading:
      'The PathLess Guide connects what you naturally enjoy with college majors and career pathways that make sense for you. No resumes, no test scores, and no judgment.',
    privacyPromiseTitle: 'Your Privacy Matters',
    privacyPromiseBody:
      'We only ask for your name and grade level to personalize your pathways. We never ask for your email address, phone number, or a password. Your answers are stored only in your browser session.',
    fields: {
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g., Alex Morgan',
      fullNameHelper: 'Enter your first and last name so we can address your guide personally.',
      gradeLevelLabel: 'Current Grade or College Year',
      gradeLevelPlaceholder: 'Select your current level',
      gradeOptions: [
        { value: 'grade_10', label: '10th Grade (High School Sophomore)' },
        { value: 'grade_11', label: '11th Grade (High School Junior)' },
        { value: 'grade_12', label: '12th Grade (High School Senior)' },
        { value: 'college_freshman', label: 'College Freshman (1st Year)' },
        { value: 'college_sophomore', label: 'College Sophomore (2nd Year)' },
      ],
      studentIdLabel: 'Student ID (Optional)',
      studentIdPlaceholder: 'e.g., STU-88412',
      studentIdHelper: 'If your school or advisor gave you a student code, enter it here. Otherwise, feel free to leave this blank.',
    },
    ctaButton: 'Begin PathLess Guide',
  },

  questions: INTAKE_QUESTIONS,

  navigation: {
    previous: 'Previous',
    next: 'Continue',
    finish: 'Finish & Explore Pathways',
    previousAriaLabel: 'Return to previous step',
    nextAriaLabel: 'Proceed to next question',
    finishAriaLabel: 'Submit responses and generate personalized pathways',
    disabledNotice: 'Please complete the question above to continue.',
  },

  validation: {
    fullNameRequired: 'Please enter your full name (at least 1 character).',
    fullNameMaxLength: 'Name must be 100 characters or fewer.',
    gradeLevelRequired: 'Please select your current grade or college year.',
    studentIdMaxLength: 'Student ID must be 64 characters or fewer.',
    q1Required: 'Please select 1 or 2 tasks that feel natural to you.',
    q2SubjectRequired: 'Please choose a subject area that sparks your curiosity.',
    q3TrackRequired: 'Please choose your high school study track or stream.',
    q3HesitationRequired: 'Please share a quick thought (at least 1 character) about what worries or excites you.',
    q3HesitationMaxLength: 'Please keep your thought within 200 characters.',
    q4HesitationRequired: 'Please share a quick thought (at least 1 character) about what worries or excites you.',
    q4HesitationMaxLength: 'Please keep your thought within 200 characters.',
    q4EnvironmentRequired: 'Please select the physical work setting where you feel most comfortable.',
    q5EnvironmentRequired: 'Please select the physical work setting where you feel most comfortable.',
    q5ProblemSolvingRequired: 'Please select how you instinctively approach tough problems.',
    q6SocialEnergyRequired: 'Please select how social interaction affects your energy.',
    q6CollaborationRequired: 'Please select how you prefer collaborating on a daily basis.',
    q7ProblemSolvingRequired: 'Please select how you instinctively approach tough problems.',
    q7StructureRequired: 'Please choose the level of day-to-day structure you prefer.',
    q8StructureRequired: 'Please choose the level of day-to-day structure you prefer.',
    q8FrictionRequired: 'Please select the academic demand that causes you the most stress.',
    q9WorkContextRequired: 'Please choose a real-world work context that sounds engaging.',
    q9PriorityRequired: 'Please choose what matters most for your future peace of mind.',
    q10AcademicFrictionRequired: 'Please select the academic demand that causes you the most stress.',
    q10FrictionRequired: 'Please select the academic demand that causes you the most stress.',
    q10AmbitionRequired: 'Please select the timeline that feels right for your next chapter.',
    q11PriorityRequired: 'Please choose what matters most for your future peace of mind.',
    q12AmbitionRequired: 'Please select the timeline that feels right for your next chapter.',
    navigationBlocked: 'Please complete the current question before moving forward. Take all the time you need.',
  },

  resetDialog: {
    triggerButton: 'Start Over',
    title: 'Start fresh with a clean slate?',
    description: 'This will clear all your answers and return you to the Welcome screen. You can take as much time as you need.',
    confirm: 'Yes, start over',
    cancel: 'Keep my answers',
    ariaLabel: 'Reset intake questionnaire confirmation dialog',
  },

  a11y: {
    wizardLandmark: 'PathLess College Major and Career Exploration Guide',
    progressNav: 'Questionnaire progress navigation',
    stepAnnouncement: (current: number, total: number, title: string) =>
      `Step ${current} of ${total}: ${title}`,
    characterMilestoneWarning: (remaining: number) => `${remaining} characters remaining`,
    characterLimitReached: 'Maximum 200 character limit reached',
    resetCompleted: 'Answers have been reset. Welcome to PathLess Guide.',
  },

  apiErrors: {
    RATE_LIMITED: {
      title: 'High Community Activity',
      detail:
        'PathLess is experiencing high interest right now. Please take a gentle breath and try submitting again in a few moments.',
      retryPrompt: (seconds: number) =>
        `Please wait ${Math.ceil(seconds)} seconds before exploring new pathways.`,
    },
    VALIDATION_FAILED: {
      title: 'Check Your Responses',
      detail:
        'We could not process your responses. Please verify that each question has been answered and try again.',
    },
    PAYLOAD_TOO_LARGE: {
      title: 'Response Too Detailed',
      detail:
        'Your answers exceeded our submission size limit. Please shorten your written thoughts and try again.',
    },
    UNSUPPORTED_MEDIA_TYPE: {
      title: 'Unsupported Request Format',
      detail:
        'Please submit your responses as standard JSON data.',
    },
    UNAUTHORIZED: {
      title: 'Authorization Required',
      detail:
        'Please provide valid authorization credentials to access this service.',
    },
    GATEWAY_TIMEOUT: {
      title: 'Taking Longer Than Usual',
      detail:
        'Generating your pathways took longer than expected. Please try submitting again.',
    },
    INTERNAL_ERROR: {
      title: 'Temporary System Pause',
      detail:
        'We encountered a temporary bump assembling your guide. Please try again in a moment.',
    },
  },

  clientErrors: {
    defaultTitle: 'Something Went Off Course',
    defaultMessage:
      'We ran into an unexpected display issue. Your answers are safe, and you can reload the view to continue exploring.',
    retryButton: 'Try Again',
    reloadAppButton: 'Reload PathLess',
    routeErrorTitle: 'Unable to Load This Section',
    routeErrorMessage:
      'A temporary glitch prevented this page from displaying properly. Please refresh to pick up where you left off.',
    globalErrorTitle: 'PathLess Is Temporarily Paused',
    globalErrorMessage:
      'An unexpected application issue occurred. Please reload your browser to start fresh.',
  },
} as const;

export const RESULTS_COPY = {
  header: {
    badge: 'Personalized Exploration Pathways',
    defaultTitle: 'Your Recommended Pathways',
    personalizedTitle: (name: string) => `${name}'s Recommended Pathways`,
    subtitle:
      'College major choice is a flexible springboard, not a permanent trap. Here are 4 distinct pathways aligned with what naturally energizes you.',
    advisoryNoteTitle: 'Suggestions, Not Decisions',
    advisoryNoteBody:
      'These recommendations are starting points for conversation and personal discovery, not permanent life decisions. We encourage you to share and discuss these pathways with your school advisor, mentor, or trusted guide.',
    disclaimerTitle: 'Advisory Guide Notice',
    disclaimerBody:
      'These recommendations are starting points for conversation and discovery, not permanent life decisions. We encourage you to share and discuss these pathways with your school advisor, mentor, or trusted guide.',
    advisoryNote:
      'Suggestions, not decisions. These pathways are starting points for conversation and personal discovery.',
    advisorReminder:
      'We encourage you to share and discuss these pathways with your school advisor, mentor, or trusted guide.',
    archetypeLabel: 'Your Discovery Profile',
    defaultArchetype: 'The Thoughtful Explorer',
    defaultNarrative: 'Here are 4 distinct, supportive pathways designed around what naturally energizes you.',
    sampleDataNotice: 'Sample Exploration Data • Showing representative pathways',
    pathwaysSectionLabel: 'Recommended Career Pathways',
    demoModeNotice:
      'Sample pathways are shown for demonstration. Take your time exploring each option.',
  },

  badges: {
    'Top Match': {
      label: 'Top Match',
      badge: 'Top Match',
      description: 'Closest alignment with your natural problem-solving interests and preferred environment.',
    },
    'Explore Also': {
      label: 'Explore Also',
      badge: 'Explore Also',
      description: 'Adjacent pathways that broaden your options across related fields.',
    },
    topMatch: {
      label: 'Top Match',
      badge: 'Top Match',
      description: 'Closest alignment with your natural problem-solving interests and preferred environment.',
    },
    exploreAlso: {
      label: 'Explore Also',
      badge: 'Explore Also',
      description: 'Adjacent pathways that broaden your options across related fields.',
    },
  },

  tiers: {
    'Primary Direct Match': {
      label: 'Primary Direct Match',
      badge: 'Top Match',
      description: 'Closest immediate alignment with your task interests and comfort zone.',
    },
    'High-Growth Pathway': {
      label: 'High-Growth Pathway',
      badge: 'Top Match',
      description: 'Expanding fields with strong emerging demand and practical applications.',
    },
    'Interdisciplinary Pivot': {
      label: 'Interdisciplinary Pivot',
      badge: 'Explore Also',
      description: 'Combines multiple subjects for versatile, creative problem solvers.',
    },
    'Moonshot Trajectory': {
      label: 'Moonshot Trajectory',
      badge: 'Explore Also',
      description: 'An ambitious stretch pathway with high creative or technical upside.',
    },
  },

  milestones: {
    heading: 'Career Progression Milestones',
    subheading: 'A realistic 3-stage journey from university study to professional growth in Thailand',
    stage1Label: '1. College Major',
    stage2Label: '2. First Job',
    stage3Label: '3. Growth Role',
  },

  printHeader: {
    institution: 'PathLess Educational Guidance Report',
    confidentialNotice: 'Student Guidance Document • For Academic Discovery Only',
    nameLabel: 'Student Name',
    gradeLabel: 'Grade / Year',
    dateLabel: 'Date Generated',
    defaultStudentName: 'Student',
    defaultGrade: 'Secondary Education',
    defaultDate: 'Current Session',
    advisorNoteTitle: 'Advisor & Student Discussion Note',
    advisorNoteBody:
      'These career and major pathways are starting points for conversation and discovery, not permanent decisions. Discuss these options with your school advisor, teacher, or family mentor.',
    sampleDataNotice: 'Sample Exploration Data • Showing representative pathways',
  },

  card: {
    collapsedCta: 'View pathway details',
    expandedCta: 'Hide pathway details',
    fitScoreLabel: 'Natural Fit',
    fitScoreTooltip: 'Reflects how closely this pathway matches your daily task preferences and work comfort.',
    groundedRationaleLabel: 'Why This Fits You',
    milestonesHeading: 'Career Progression Milestones',
    dailyTasksLabel: 'What a Typical Day Looks Like',
    dailyTasksSublabel: 'Real responsibilities and daily projects',
    studyPathLabel: 'Foundational Study Path',
    studyPathSublabel: 'Helpful classes and topics to build your skills',
    reassuranceLabel: 'Working Through Common Challenges',
    reassuranceSublabel: 'How to navigate friction and feel supported',
    majorsLabel: 'Related College Majors',
    minorsLabel: 'Complementary Minors',
    minorPrefix: 'Minor: ',
    defaultRoleTitle: 'Specialist Concentration',
    defaultBroadField: 'Applied Discipline',
    trialCoursesLabel: 'Free Ways to Try This Out',
    trialCoursesSublabel: 'Low-pressure, zero-cost introductory courses from trusted platforms',
    hoursEstimated: (hours: number) => `~${hours} hrs to complete`,
    courseSearchHint: 'Search for this course on free educational platforms',
    overviewLabel: 'Overview',
  },

  whereToStudy: {
    title: 'Where to Study',
    verifiedRegistryBadge: 'Verified Institution Directory',
    description:
      'Explore standard undergraduate degree programs at verified universities across Thailand. Pathways are human-curated to help you and your advisor discover genuine academic environments.',
    publicAutonomousLabel: 'Public / Autonomous',
    privateLabel: 'Private University',
    needsCheckingBadge: 'Needs Checking',
    verifiedBadge: 'Verified',
    lastCheckedLabel: 'Last checked',
    targetMajorsLabel: 'Target Fields',
    visitOfficialProgramCta: 'Visit official department page',
    openProgramLinkAria: (program: string, university: string) =>
      `Visit official ${program} program page at ${university} (opens in new tab)`,
    admissionsNoticeTitle: 'Official Admissions Advisory',
    admissionsNoticeBody:
      'Admission requirements, portfolio guidelines, and annual seat allocations are determined independently by each university and change each academic cycle. We strongly encourage you to consult the official university admissions office and discuss requirements with your school advisor.',
    curationNoticeTitle: 'Curating Pathways for This Major',
    curationNoticeDescription: (major: string) =>
      `Verified institutional degree mappings for ${major} are currently being audited by regional advisors. We recommend exploring general university catalog listings or discussing options with your mentor.`,
    fallbackTitle: 'Curating Pathways for This Major',
    fallbackDescription: (major: string) =>
      `Verified institutional degree mappings for ${major} are currently being audited by regional advisors. We recommend exploring general university catalog listings or discussing options with your mentor.`,
    advisorVerificationNote:
      'Zero unverified admissions claims. All university pathway data is verified by academic advisors.',
    zeroHallucinationNote:
      'Zero unverified admissions claims. All university pathway data is verified by academic advisors.',
  },

  exploreMore: {
    heading: 'Curious About Other Directions?',
    badge: 'Complementary Directions',
    description:
      'Curious about other directions? These complementary pathways from our curated catalog share similar strengths, without any pressure to decide right now.',
    majorsLabel: 'Key College Majors',
  },

  admissions: {
    badge: 'Admission Track Guidance',
    needsCheckingBadge: 'Needs Checking • Annual Audit',
    checklistHeading: 'Student Verification Checklist',
    officialPortalButton: 'Visit Official Admissions Portal',
    openPortalAria: (university: string) =>
      `Visit official admissions portal for ${university} (opens in new tab)`,
    annualDisclaimerTitle: 'Annual TCAS Admissions Advisory',
    annualDisclaimerBody:
      'Admission criteria, required minimum science credits, and portfolio guidelines are determined independently by each university and change each TCAS round (Rounds 1–4). Always confirm current requirements directly on the university\'s official admissions portal.',
    trackEligibilityLabel: 'High School Track Eligibility',
    zeroScoreGuaranty:
      'Zero exam score or GPA cutoffs collected. All requirements are verified through official portals.',
  },

  actions: {
    printButton: 'Print or Save as PDF',
    printButtonAriaLabel: 'Print or save these 4 career pathway recommendations as a PDF document',
    clearButton: 'Start Over',
    clearButtonAriaLabel: 'Start over and clear all recommendations',
    clearDialogTitle: 'Start fresh with a clean slate?',
    clearDialogDescription:
      'This will clear your current pathways and answers, allowing you to retake the guide whenever you are ready.',
    confirmClear: 'Yes, start over',
    cancelClear: 'Keep my pathways',
  },

  loading: {
    title: 'Discovering Your Pathways...',
    messages: [
      'Reflecting on what naturally energizes you...',
      'Mapping out supportive college majors...',
      'Finding zero-cost exploratory trial courses...',
      'Assembling your personalized guide...',
    ],
    reassurance: 'Take a gentle breath. Discovery takes time, and there is no rush.',
  },

  error: {
    title: 'We hit a temporary bump',
    description:
      'We were unable to assemble your pathways right now. Your answers are completely safe. Please try again in a few moments, or review your answers.',
    retryButton: 'Try Again',
    editAnswersButton: 'Review My Answers',
    startOverButton: 'Start Over',
  },

  a11y: {
    resultsLandmark: 'College major and career discovery pathways',
    cardExpandedAnnouncement: (title: string) => `Expanded details for ${title}`,
    cardCollapsedAnnouncement: (title: string) => `Collapsed details for ${title}`,
    printTriggered: 'Opening print dialog to save your pathways',
    clearTriggered: 'Answers and pathways cleared. Returning to welcome screen.',
  },
} as const;

export type GuideCopyType = typeof GUIDE_COPY;
export type ResultsCopyType = typeof RESULTS_COPY;
