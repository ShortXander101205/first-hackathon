/**
 * PathwayAI: College Major & Career Triage MVP
 * Centralized Copy Contract for Recommendation Dossier UI
 * Tone: Calm, validating, plain language tailored for anxious 17-19 year olds.
 * 
 * Strict Contract: 100% of user-facing strings, section titles, reassuring helper notes,
 * course badges, and button labels must live strictly in this file.
 */

export const DOSSIER_COPY = {
  // Top-Level Dossier Header & Archetype Copy
  header: {
    badge: 'Your Personalized Triage Dossier',
    title: (nickname?: string) =>
      nickname?.trim()
        ? `${nickname.trim()}'s Career & Major Pathways`
        : 'Your Career & Major Pathways',
    subtitle:
      'Synthesized by Alex, your collegiate academic advisor, based on your natural focus and comfort zone.',
    reassuranceNote:
      'Remember: these pathways are starting springboards, not permanent life sentences. Every major can lead to multiple meaningful careers.',
    archetypeBadgeLabel: 'Your Triage Archetype:',
    preparedFor: (nickname: string) => `Prepared for ${nickname.trim()}`,
    careerSectionLabel: 'Recommended Career Pathways',
  },

  // 4-Card Match Tier Labels & Badges
  tiers: {
    primary: {
      label: 'Primary Direct Match',
      shortLabel: 'Direct Match',
      tagline: 'Highest alignment with your natural energy and preferred work setting.',
    },
    highGrowth: {
      label: 'High-Growth Pathway',
      shortLabel: 'High Growth',
      tagline: 'Strong employer hiring demand, economic stability, and clear entry paths.',
    },
    interdisciplinary: {
      label: 'Interdisciplinary Pivot',
      shortLabel: 'Creative Pivot',
      tagline: 'A creative bridge combining your secondary strengths with low friction.',
    },
    moonshot: {
      label: 'Moonshot Trajectory',
      shortLabel: 'Moonshot',
      tagline: 'An ambitious, high-impact career that broadens your horizon.',
    },
  },

  // Career Card Common Elements
  card: {
    fitScoreLabel: (score: number) => `${score}% Alignment`,
    fitScoreClarification: 'Reflects alignment with your intake answers, not an academic grade.',
    majorsLabel: 'Connected College Majors:',
    minorsLabel: 'Complementary Minors:',
    whyItFitsLabel: 'Why This Fits You:',
  },

  // Reality Check Section Copy (Day-to-day tasks vs misconceptions)
  realityCheck: {
    title: 'Day-in-the-Life Reality Check',
    tasksSubtitle: 'What you actually do on a typical workday:',
    mythTitle: 'Student Misconception vs. Reality:',
    mythPrefix: 'Myth:',
    realityPrefix: 'Reality:',
  },

  // Academic Challenge & Empathetic Reassurance Copy
  academics: {
    sectionTitle: 'Academic Navigation & Support',
    challengeLabel: 'The Real College Hurdle:',
    reassuranceLabel: 'Why You Can Handle It:',
  },

  // Zero-Cost Trial Courses Copy
  trialCourses: {
    sectionTitle: 'Zero-Cost Weekend Trial Courses',
    sectionHelper: 'Low-stakes, free modules to explore this field with zero financial risk:',
    hoursBadge: (hours: number) => `~${hours} hrs`,
    zeroCostBadge: 'Zero Tuition • Free Audit',
    exploratoryTag: 'Exploratory Course',
  },

  // Animated Synthesis Loading State Copy
  loading: {
    title: 'Alex is crafting your pathways...',
    personalizedTitle: (nickname: string) => `Alex is crafting pathways for ${nickname.trim()}...`,
    calmNote: 'Take a deep breath—your personalized dossier is being thoughtfully synthesized.',
    ariaStatus: 'Synthesizing your 4-career recommendation dossier. Please wait.',
    messages: [
      'Reviewing your natural energy and focus...',
      'Exploring modern, high-demand career pathways...',
      'Connecting day-to-day tasks with low-friction college majors...',
      'Addressing your academic dread with supportive reassurance...',
      'Curating zero-cost weekend trial courses...',
    ],
  },

  // Mock / Fallback Mode Notice Banner
  mockNotice: {
    badge: 'Demo Mode Active',
    title: 'Curated Demonstration Pathways Active',
    description:
      'These high-fidelity recommendations are actively curated based on your answers to guarantee 100% demo uptime and uninterrupted exploration.',
  },

  // Bottom Navigation & Reset Footer
  footer: {
    reassurance: 'Want to explore different tasks, subjects, or settings? You can start fresh at any time.',
    startOverButton: 'Start Over',
    startOverAriaLabel: 'Start over and reset all intake questions',
    backToWizardAriaLabel: 'Return to question intake',
  },

  // Error Recovery Copy
  error: {
    badge: 'Brief Pause',
    title: 'We need a brief moment to recharge',
    message:
      'Our career synthesis service is taking a brief moment. Your answers are safe—please tap below to try again or review your answers.',
    retryButton: 'Try Again',
    editAnswersButton: 'Review My Answers',
  },

  // Accessibility Announcements
  a11y: {
    dossierLandmark: 'Career recommendation dossier results',
    cardTierAnnouncement: (tier: string, role: string) => `${tier}: ${role}`,
    fitScoreAnnouncement: (score: number) => `Calculated profile alignment score of ${score} percent`,
    dossierReadyAnnounce: 'Your personalized career recommendation dossier is ready to explore.',
    loadingAnnounce: 'Alex is synthesizing your pathways based on your intake responses. Please wait.',
  },
} as const;

export type DossierCopyType = typeof DOSSIER_COPY;
