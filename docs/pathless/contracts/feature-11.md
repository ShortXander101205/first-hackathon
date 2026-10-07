---
doc: contract
feature: 11-ux-copy-and-simplification
project: PathLess - Framework v2
status: approved
gate: PASS
---

# Feature 11: UX Copy and Simplification — Technical Contract & Specification

## 1. Executive Summary & Objective

This specification establishes the technical, architectural, behavioral, and accessibility contract for **Feature 11: UX Copy and Simplification** of the **PathLess Framework v2** on branch `feature/11-ux-copy-and-simplification`.

Through Features 1 through 10 and Feature 14, PathLess assembled a zero-pressure career and major discovery platform for 16-to-20-year-old learners and their school educators. The system contains functional application logic across intake wizards, progressive-disclosure recommendation cards, verified Thai university listings, high-fidelity browser print views, and an educator advising dashboard. However, rapid multi-feature evolution left residual developer jargon, disparate phrasing, hardcoded JSX strings, and clinical diagnostic terminology scattered across client components.

Feature 11 executes a comprehensive **plain-language rewrite, user interface declutter, and 100% copy centralization** across both the student discovery journey and the advisor portal.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                FEATURE BASELINE vs FEATURE 11 REVISION                           │
├────────────────────────────────────────────────┬─────────────────────────────────────────────────┤
│            Prior Baseline (Features 1–10, 14)  │          Feature 11 (Unified Plain Language)    │
├────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ • Scattered inline string literals in JSX      │ • 100% of user-facing strings centralized in    │
│   (e.g., "1. College Major:", "Minor: ", etc.) │   src/content/guideCopy.ts & advisorCopy.ts     │
│ • Residual developer & clinical jargon:        │ • Strict automated zero-tolerance purge of:     │
│   "dossier", "triage", "fallback", "database", │   dossier, PathwayAI, Triage, Counselor,        │
│   "synthesis engine", "algorithm", "AI model"  │   algorithm, AI model, engine, fallback, DB    │
│ • Intake questions contain academic density    │ • 100% of intake prompts, options, and tips     │
│   and clinical terminology ("dread", etc.)     │   meet 8th–12th grade reading level (FRE > 60)  │
│ • Advisor views leak technical schema terms    │ • Supportive educator terminology:              │
│   ("database", "records count", "purge")       │   "Student Submissions", "Annual Archive"       │
│ • Visual clutter, tight margins, text wrapping │ • Decluttered spacing, 200% zoom defense,       │
│   breakages on small viewports (<360px)        │   WCAG 2.1 AA text contrast & 44px min targets  │
│ • Unmapped questions mixed in general copy     │ • Modularized src/content/intakeQuestions.ts    │
│   without dedicated microcopy schemas          │   with structured microcopy & validation rules  │
└────────────────────────────────────────────────┴─────────────────────────────────────────────────┘
```

### Primary Objectives

1. **100% Centralized Content Repositories (`src/content/guideCopy.ts`, `src/content/advisorCopy.ts`, `src/content/intakeQuestions.ts`)**:
   Extract every single student-facing and educator-facing string literal into typed, immutable copy dictionaries. Zero hardcoded inline strings permitted in JSX components.
2. **Automated Prohibited Terminology Purge (`tests/unit/prohibitedTerms.test.ts`)**:
   Enforce zero occurrences of prohibited technical and clinical terms (`dossier`, `PathwayAI`, `Triage`, `Counselor`, `algorithm`, `AI model`, `synthesis engine`, `fallback`, `database`) across all content dictionaries and user-facing UI markup.
3. **8th-to-12th Grade Reading Level & Microcopy Overhaul (`src/content/intakeQuestions.ts`, `tests/unit/copyAudit.test.ts`)**:
   Rewrite all 10 intake questions, option titles, card descriptions, and validation error messages to score comfortably between **Grade 8.0 and 12.0** on the Flesch-Kincaid Grade Level index, with Flesch Reading Ease score $> 60$. Eliminate anxiety-inducing words like "dread" and "friction".
4. **Declarative Component Copy Bindings across Intake & Results (`IntakeForm.tsx`, `QuestionCard.tsx`, `ResultsContainer.tsx`, `CareerMatchCard.tsx`, `WhereToStudySection.tsx`)**:
   Refactor student intake and results presentation components to read directly from centralized copy objects. Standardize progressive-disclosure controls, milestone progression labels, and regional university advisories.
5. **Educator-Focused Advisor Portal Microcopy (`AdvisorDashboard.tsx`, `PasscodeLogin.tsx`, `StudentDetailModal.tsx`)**:
   Audit all educator views to replace database, backend, and security terminology with calm, supportive educational language (e.g., *Student Submission*, *Academic Cycle*, *Check-in Notes*).
6. **Print Consistency & Privacy Alignment (`PrintHeader.tsx`)**:
   Ensure browser print preview uses centralized print copy, cleanly displaying student name, grade, date, and advisor discussion disclaimers, while strictly omitting internal student IDs.
7. **Visual Spacing, Decluttering & Responsive Text Wrapping**:
   Eliminate visual clutter, ensure all text wraps gracefully across mobile screens (down to 320px width), prevent text clipping under 200% browser zoom, and maintain WCAG 2.1 AA contrast ratios ($4.5:1$ text, $3:1$ UI components).

---

## 2. Scope & Boundary Clarifications

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     FEATURE 11 BOUNDARY MAP                                      │
├──────────────────────────────────────┬───────────────────────────────────────────────────────────┤
│          IN SCOPE (Feature 11)       │               DEFERRED (Downstream Features)              │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ • Centralizing 100% of user-facing   │ • Advanced IP reputation scoring, distributed token       │
│   strings into guideCopy.ts,         │   bucket rate-limiting, and payload sanitization          │
│   advisorCopy.ts, & intakeQuestions.ts│   --> Deferred to feature/12-safety-and-guardrails        │
│ • Purging all prohibited terms from   │ • Cypress/Playwright end-to-end multi-browser test        │
│   content files and JSX components   │   automation and CI/CD GitHub Actions pipelines           │
│ • Rewriting 10 intake questions to    │   --> Deferred to feature/13-deployment-and-e2e          │
│   8th–12th grade plain language      │ • Modifying database schema or Prisma migrations          │
│ • Component copy bindings across     │   --> Preserved from Feature 10                           │
│   IntakeForm, QuestionCard, Results, │ • Modifying backend synthesis Gemini prompting or AI      │
│   Cards, WhereToStudy, Print, Advisor│   catalog whitelists                                      │
│ • Decluttering visual spacing,       │   --> Preserved from Features 8, 9, 10, and 14            │
│   padding, line heights, and borders │ • Multi-language localization (e.g., Thai translations)   │
│ • Flesch-Kincaid & prohibited terms  │   --> Out of scope for v2 proof of concept                │
│   automated unit test suites         │                                                           │
└──────────────────────────────────────┴───────────────────────────────────────────────────────────┘
```

### Explicitly In Scope
- **Copy Centralization**: Extracting all inline text, placeholders, labels, button text, empty states, and dynamic status messages from UI components into `src/content/guideCopy.ts`, `src/content/advisorCopy.ts`, and `src/content/intakeQuestions.ts`.
- **Prohibited Terms Elimination**: Removing all mentions of `dossier`, `PathwayAI`, `Triage`, `Counselor`, `algorithm`, `AI model`, `AI`, `synthesis engine`, `fallback`, and `database` from user-facing screens and copy dictionaries.
- **Intake Question Simplification**: Restructuring the 10 questionnaire prompts and choices into friendly, zero-pressure questions calibrated for high school students.
- **Component Refactoring**:
  - `src/components/intake/IntakeForm.tsx` (form coordinator and progress navigation)
  - `src/components/intake/QuestionCard.tsx` (accessible question presentation card)
  - `src/components/results/ResultsContainer.tsx` (advisory header and card coordinator)
  - `src/components/results/CareerMatchCard.tsx` (progressive disclosure card and milestones)
  - `src/components/results/WhereToStudySection.tsx` (Thai university degree panel)
  - `src/components/results/PrintHeader.tsx` (printable report header)
  - `src/components/advisor/AdvisorDashboard.tsx` (educator navigation and header)
  - `src/components/advisor/PasscodeLogin.tsx` (passcode authentication modal)
  - `src/components/advisor/StudentDetailModal.tsx` (student guide inspection drawer)
- **Unit Test Suites**:
  - `tests/unit/copyAudit.test.ts`: Complete key presence, template function correctness, and Flesch-Kincaid grade level validator.
  - `tests/unit/prohibitedTerms.test.ts`: Regex scan of copy dictionaries and component files against all forbidden terms.

### Explicitly Out of Scope
- **Rate-Limiting & Security Guardrails**: Network throttling, sliding-window rate limiters, and SQL injection sanitization are deferred to `feature/12-safety-and-guardrails`.
- **End-to-End Test Automation**: Full-browser Cypress/Playwright workflows and cloud CI runs are deferred to `feature/13-deployment-and-e2e`.
- **Modifying Core Database Tables**: No changes to Prisma schema or PostgreSQL relations.

---

## 3. Forbidden Terminology & Plain-Language Copy Matrix

To honor the PathLess educational philosophy of calm, non-judgmental discovery, the following 9 prohibited terms and technical jargon patterns are strictly banned from all student-facing and educator-facing interfaces:

```
┌──────────────────────────────────────┬──────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Prohibited Term / Jargon             │ Approved Plain-Language Term     │ Educational & Pedagogical Justification                │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ dossier                              │ Guide / Summary / Pathways       │ "Dossier" sounds like a secret investigative file.     │
│ (e.g., "Student Career Dossier")     │ (e.g., "Personalized Pathways")  │ "Guide" or "Pathways" conveys supportive exploration.  │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ PathwayAI                            │ PathLess                         │ Rebrands legacy hackathon prototype name to the        │
│ (e.g., "Powered by PathwayAI")       │ (e.g., "PathLess Guide")         │ validated PathLess Framework v2 branding.              │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Triage                               │ Discovery / Exploration / Intake │ "Triage" implies medical emergency or prioritizing the │
│ (e.g., "Career Triage Wizard")       │ (e.g., "Career Discovery Guide") │ wounded. College exploration is a journey of growth.   │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Counselor                            │ Advisor / Mentor / Educator      │ "Counselor" has clinical and mental-health connota-    │
│ (e.g., "School head counselor")      │ (e.g., "School Advisor")         │ tions; "Advisor" or "Mentor" feels supportive.        │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ algorithm                            │ Guide / Discovery System         │ "Algorithm" creates black-box anxiety and implies an   │
│ (e.g., "Matching algorithm")         │ (e.g., "Exploration matching")   │ unchallengeable computational judgment of the student. │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ AI model / AI                        │ Exploration Tool / Guide System  │ Emphasizing "AI" distracts students and invites        │
│ (e.g., "Zero AI hallucination")      │ (e.g., "Verified by advisors")   │ skepticism. The focus belongs on human curation.       │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ synthesis engine / engine            │ PathLess Guide / Generator       │ Mechanical engineering jargon distances non-technical  │
│ (e.g., "Recommendation engine")      │ (e.g., "Personalized pathways")  │ students from personal self-reflection.                │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ fallback                             │ Sample Data / Curated Pathways   │ "Fallback" indicates system failure or second-rate     │
│ (e.g., "fallbackTitle", "fallback")  │ (e.g., "Demonstration pathways") │ options; "Sample Pathways" explains preview state.     │
├──────────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ database / SQL / query               │ Student Record / School Archive  │ Technical infrastructure terms alarm non-technical     │
│ (e.g., "Saved to database", "query") │ (e.g., "Submission saved")       │ teachers and create privacy confusion.                 │
└──────────────────────────────────────┴──────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 4. Readability & Tone Specification

### 4.1 Flesch-Kincaid & Flesch Reading Ease Formulae

To ensure all copy remains easily accessible to students aged 16 to 20 without condescension or academic stiffness, user-facing prose must adhere to mathematical readability criteria:

1. **Flesch Reading Ease (FRE)**:
   $$\text{FRE} = 206.835 - 1.015 \left(\frac{\text{Total Words}}{\text{Total Sentences}}\right) - 84.6 \left(\frac{\text{Total Syllables}}{\text{Total Words}}\right)$$
   - **Target**: $\text{FRE} \ge 60.0$ (Plain English, conversational, easy for teenagers).

2. **Flesch-Kincaid Grade Level (FKGL)**:
   $$\text{FKGL} = 0.39 \left(\frac{\text{Total Words}}{\text{Total Sentences}}\right) + 11.8 \left(\frac{\text{Total Syllables}}{\text{Total Words}}\right) - 15.59$$
   - **Target**: $8.0 \le \text{FKGL} \le 12.0$ (Calibrated for high school sophomores through seniors).

### 4.2 Tone Principles

- **Validating, Not Testing**: Never ask questions as if there is a correct response. Every option represents a valid, respectable working style.
- **Concrete, Not Abstract**: Use tangible daily activities ("Fixing physical equipment", "Writing stories", "Checking in with a close team") rather than abstract taxonomy terms ("Mechanical aptitude", "Interpersonal orientation").
- **Zero Guilt Microcopy**: Character counters and progress bars encourage thoughtful completion without scolding or sounding urgent.
- **Short Sentences**: Question titles are strictly $\le 15$ words; option descriptions are strictly $\le 25$ words; card overviews are strictly $\le 30$ words.

---

## 5. System Architecture & Centralized Copy Repositories

### 5.1 Architecture & Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             PATHLESS FEATURE 11 COPY ARCHITECTURE                                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────────────────────────────────────┐
   │                          CENTRALIZED CONTENT REPOSITORIES                               │
   ├───────────────────────────────┬─────────────────────────────┬───────────────────────────┤
   │    src/content/guideCopy.ts   │ src/content/intakeQuestions │ src/content/advisorCopy.ts│
   │  • Brand, Shell, Navigation   │  • 10 Intake Questions      │  • Advisor Portal Brand   │
   │  • Welcome Step Profile       │  • Option Titles & Badges   │  • Passcode Login Form    │
   │  • Validation & Reset Modal   │  • Plain-Language Helpers   │  • Student Table & Filters│
   │  • Results Header & Badges    │  • Selection Status Fn      │  • Detail Drawer Sections │
   │  • 3-Stage Milestone Labels   │  • Character Limit Labels   │  • Educator Notes Editor  │
   │  • WhereToStudy Curated Copy  │  • 8th–12th Grade Tuned     │  • Annual Archive Notice  │
   │  • Print Header & Disclaimers │  • Zero Prohibited Terms    │  • Calm Error Banners     │
   └──────────────┬────────────────┴──────────────┬──────────────┴─────────────┬─────────────┘
                  │                               │                            │
                  ▼                               ▼                            ▼
   ┌───────────────────────────────┐ ┌───────────────────────────┐ ┌─────────────────────────┐
   │    STUDENT INTAKE VIEWS       │ │   RESULTS PRESENTATION    │ │   ADVISOR PORTAL VIEWS  │
   ├───────────────────────────────┤ ├───────────────────────────┤ ├─────────────────────────┤
   │ • IntakeForm.tsx              │ │ • ResultsContainer.tsx    │ │ • AdvisorDashboard.tsx  │
   │ • QuestionCard.tsx            │ │ • CareerMatchCard.tsx     │ │ • PasscodeLogin.tsx     │
   │ • QuestionStepView.tsx        │ │ • WhereToStudySection.tsx │ │ • StudentDetailModal.tsx│
   │ • WelcomeProfileStep.tsx      │ │ • PrintHeader.tsx         │ │ • StudentTable.tsx      │
   └───────────────────────────────┘ └───────────────────────────┘ └─────────────────────────┘
                  │                               │                            │
                  └───────────────────────────────┼────────────────────────────┘
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │       AUTOMATED QUALITY GATES   │
                                 ├─────────────────────────────────┤
                                 │ • tests/unit/copyAudit.test.ts  │
                                 │   - 100% Key Presence Check     │
                                 │   - Flesch-Kincaid (8.0–12.0)   │
                                 │   - Word Count Ceilings         │
                                 │ • tests/unit/prohibitedTerms    │
                                 │   - Zero Forbidden Terms Check  │
                                 └─────────────────────────────────┘
```

---

## 6. Detailed Module Specifications

### 6.1 Centralized Student Guide Copy Repository (`src/content/guideCopy.ts`)

The student guide repository exposes `GUIDE_COPY` and `RESULTS_COPY`. All text must be declared as `const` with `as const` assertions to provide full TypeScript autocompletion and prevent accidental runtime mutations.

```typescript
export const GUIDE_COPY = {
  brand: {
    name: 'PathLess',
    tagline: 'College Major and Career Exploration Without the Pressure',
    guideTitle: 'PathLess Guide',
  },
  shell: {
    badge: 'Zero-Pressure Exploration',
    subBadge: '10 Questions • Takes ~3 minutes • No test scores or grades required',
    reassuranceNote:
      'There are no right or wrong answers. Choose what feels natural to you right now—your pathways are built to fit your comfort, not test your knowledge.',
    stepProgressLabel: (current: number, total: number) => `Question ${current} of ${total}`,
    stepPercentLabel: (percent: number) => `${percent}% Complete`,
    welcomeStepLabel: 'Welcome & Profile',
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
  stepTitles: {
    0: 'Welcome and Student Profile',
    1: 'Daily Focus & Task Energy',
    2: 'Academic Curiosity',
    3: 'Academic Hesitation & Worry',
    4: 'Physical Work Environment',
    5: 'Problem-Solving Instinct',
    6: 'Social Energy & Collaboration',
    7: 'Structure vs. Ambiguity',
    8: 'Academic Stress Minimization',
    9: 'Core Life & Career Horizon',
    10: 'Post-College Next Chapter',
  },
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
    q3HesitationRequired: 'Please share a quick thought (at least 1 character) about what worries or excites you.',
    q3HesitationMaxLength: 'Please keep your thought within 200 characters.',
    q4EnvironmentRequired: 'Please select the physical work setting where you feel most comfortable.',
    q5ProblemSolvingRequired: 'Please select how you instinctively approach tough problems.',
    q6SocialEnergyRequired: 'Please select how social interaction affects your energy.',
    q7StructureRequired: 'Please choose the level of day-to-day structure you prefer.',
    q8FrictionRequired: 'Please select the academic demand that causes you the most stress.',
    q9PriorityRequired: 'Please choose what matters most for your future peace of mind.',
    q10AmbitionRequired: 'Please select the timeline that feels right for your next chapter.',
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
      'These career and major pathways are starting points for conversation and discovery, not permanent life decisions. We encourage you to share and discuss these pathways with your school advisor, mentor, or trusted guide.',
    sampleDataNotice: 'Sample Exploration Data • Showing representative pathways',
    archetypeLabel: 'Your Discovery Profile',
  },
  badges: {
    topMatch: {
      label: 'Top Match',
      description: 'Closest alignment with your natural problem-solving interests and preferred environment.',
    },
    exploreAlso: {
      label: 'Explore Also',
      description: 'Adjacent pathways that broaden your options across related fields.',
    },
  },
  milestones: {
    heading: 'Career Progression Milestones',
    subheading: 'A realistic 3-stage journey from university study to professional growth in Thailand',
    stage1Label: '1. College Major',
    stage2Label: '2. First Job',
    stage3Label: '3. Growth Role',
  },
  card: {
    collapsedCta: 'View pathway details',
    expandedCta: 'Hide pathway details',
    fitScoreLabel: 'Natural Fit',
    fitScoreTooltip: 'Reflects how closely this pathway matches your daily task preferences and work comfort.',
    groundedRationaleLabel: 'Why This Fits You',
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
    advisorVerificationNote:
      'Zero unverified claims. All university pathway data is verified by academic advisors.',
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
      'These career and major pathways are starting points for conversation and discovery, not permanent decisions. Discuss these options with your school advisor, mentor, or family guide.',
    sampleDataNotice: 'Sample Exploration Data • Showing representative pathways',
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
      'We were unable to assemble your pathways right now. Please try again in a few moments, or review your answers.',
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
```

---

### 6.2 10 Intake Questions Modularized Repository (`src/content/intakeQuestions.ts`)

To prevent monolithic bloat and enable isolated readability audits, the 10 intake questions are extracted into `src/content/intakeQuestions.ts`. All questions are rephrased to achieve an **8th-to-12th grade comprehension score** with zero clinical jargon:

```typescript
export interface IntakeQuestionOption {
  id: string;
  title: string;
  description?: string;
  badge?: string;
}

export interface IntakeQuestionDefinition {
  stepNumber: number;
  title: string;
  helperText: string;
  maxSelections?: number;
  selectionStatus?: (count: number, max: number) => string;
  placeholder?: string;
  charLimit?: number;
  charCounter?: (current: number, max: number) => string;
  options?: IntakeQuestionOption[];
}

export const INTAKE_QUESTIONS: Record<string, IntakeQuestionDefinition> = {
  q1: {
    stepNumber: 1,
    title: 'When you lose track of time, what kinds of tasks feel most natural?',
    helperText: 'Pick 1 or 2 options that feel most like you. There is no need to overthink it.',
    maxSelections: 2,
    selectionStatus: (count: number, max: number) =>
      count === 0
        ? 'Select 1 or 2 options'
        : count === 1
        ? `1 of ${max} selected (you can pick 1 more)`
        : `${count} of ${max} selected (maximum reached)`,
    options: [
      {
        id: 'BUILD_SYSTEMS',
        title: 'Building & Fixing Things',
        description: 'Fixing physical gadgets, coding software, assembling crafts, or understanding how machines and programs work.',
      },
      {
        id: 'ANALYZE_PATTERNS',
        title: 'Solving Puzzles & Exploring Questions',
        description: 'Digging into curious questions, finding hidden patterns, researching facts, and untangling mysteries.',
      },
      {
        id: 'HELP_HUMANS',
        title: 'Helping & Supporting Others',
        description: 'Listening closely to people, offering thoughtful advice, teaching concepts, and helping friends solve personal problems.',
      },
      {
        id: 'CREATE_EXPRESS',
        title: 'Writing, Art & Creative Expression',
        description: 'Writing stories, designing graphics, filming videos, making art, or sharing ideas through creative projects.',
      },
      {
        id: 'LEAD_ORGANIZING',
        title: 'Organizing & Bringing People Together',
        description: 'Planning group activities, mapping out schedules, coordinating school events, and turning ideas into real action.',
      },
    ],
  },

  q2: {
    stepNumber: 2,
    title: 'Which subject area makes you most curious to learn more?',
    helperText: 'Choose the subject field you lean toward when you get to pick what you study.',
    options: [
      { id: 'TECH_COMPUTING', title: 'Technology & Computing', badge: 'Software & Digital' },
      { id: 'HEALTH_MEDICINE', title: 'Health, Medicine & Biology', badge: 'Life Sciences' },
      { id: 'BUSINESS_INNOVATION', title: 'Business & Social Enterprise', badge: 'Leadership & Strategy' },
      { id: 'ARTS_MEDIA', title: 'Arts, Design & Media', badge: 'Creative Media' },
      { id: 'CIVICS_SOCIETY', title: 'Law, Policy & Community Impact', badge: 'Community & Society' },
      { id: 'ENGINEERING_PHYSICAL', title: 'Engineering & Applied Sciences', badge: 'Physical Sciences' },
    ],
  },

  q3: {
    stepNumber: 3,
    title: 'What feels most challenging or stressful when you think about college classes?',
    helperText: 'A sentence or two is plenty. We use this to make sure your pathways feel manageable and supportive.',
    placeholder: 'e.g., I love science, but high-level math tests make me nervous...',
    charLimit: 200,
    charCounter: (current: number, max: number) => `${current}/${max} characters`,
  },

  q4: {
    stepNumber: 4,
    title: 'Where would you feel most comfortable working every day?',
    helperText: 'Think about where your body feels calm and relaxed, rather than what sounds most impressive.',
    options: [
      {
        id: 'REMOTE_DIGITAL',
        title: 'Quiet Digital Desk',
        badge: 'Flexible & Focused',
        description: 'Working mainly from a laptop with quiet focus, flexible hours, and chatting with team members online.',
      },
      {
        id: 'COLLABORATIVE_STUDIO',
        title: 'Active Team Studio or Office',
        badge: 'Social & Energetic',
        description: 'Working around friendly teammates, whiteboard brainstorming sessions, and shared creative energy.',
      },
      {
        id: 'ACTIVE_FIELD_LAB',
        title: 'Hands-On Lab, Workshop, or Outdoors',
        badge: 'Active & Tangible',
        description: 'Moving around on your feet, working with lab equipment, outdoor fieldwork, or crafting with physical tools.',
      },
      {
        id: 'HEALTHCARE_COMMUNITY',
        title: 'Community or Healthcare Setting',
        badge: 'People-Centered',
        description: 'Direct in-person interaction supporting patients, students, clients, or community members in welcoming spaces.',
      },
    ],
  },

  q5: {
    stepNumber: 5,
    title: 'When you face a new, tricky problem, how do you like to start?',
    helperText: 'Choose the problem-solving style that feels most natural to you.',
    options: [
      {
        id: 'SYSTEMATIC_LOGIC',
        title: 'One Step at a Time',
        description: 'Breaking the problem down into orderly, manageable components and testing solutions methodically.',
      },
      {
        id: 'CREATIVE_EXPLORATION',
        title: 'Brainstorming Many Ideas',
        description: 'Sketching out wild ideas, looking for unconventional angles, and trying unexpected combinations.',
      },
      {
        id: 'PEOPLE_RELATIONAL',
        title: 'Talking It Through with Others',
        description: 'Asking people about their experiences, listening to different perspectives, and collaborating on answers.',
      },
      {
        id: 'PRACTICAL_HANDS_ON',
        title: 'Trying It Out by Doing',
        description: 'Jumping straight in, building a quick rough draft or prototype, and learning from immediate trial and error.',
      },
    ],
  },

  q6: {
    stepNumber: 6,
    title: 'How do you feel about working with people during a typical day?',
    helperText: 'Be honest about your social battery—sustainable careers match your natural rhythm.',
    options: [
      {
        id: 'INDEPENDENT_DEEP_FOCUS',
        title: 'Mostly Independent Focus',
        description: 'You recharge with solo deep work and prefer having just a few scheduled meetings each week.',
      },
      {
        id: 'BALANCED_TEAM',
        title: 'A Healthy Mix of Both',
        description: 'You like checking in with a close team, collaborating on projects, but still having quiet hours to yourself.',
      },
      {
        id: 'HIGH_CONTACT_PEOPLE',
        title: 'People-First & Energetic',
        description: 'Being around people energizes you; you enjoy meeting new faces, presenting, and constant conversation.',
      },
    ],
  },

  q7: {
    stepNumber: 7,
    title: 'What daily routine helps you do your best work?',
    helperText: 'Think about whether unexpected changes excite you or stress you out.',
    options: [
      {
        id: 'HIGH_STRUCTURE_CLEAR_RULES',
        title: 'Clear Expectations & Reliable Routine',
        description: 'You thrive when goals, workflows, and daily schedules are clearly outlined with reliable consistency.',
      },
      {
        id: 'BALANCED_MILESTONES',
        title: 'Clear Goals with Freedom in How You Work',
        description: 'You like having clear milestones, but prefer choosing your own path and schedule to reach them.',
      },
      {
        id: 'HIGH_AUTONOMY_AMBIGUITY',
        title: 'Flexible Freedom & Rapid Changes',
        description: 'You get bored by repetition and love charting your own course through unpredictable challenges.',
      },
    ],
  },

  q8: {
    stepNumber: 8,
    title: 'Which type of schoolwork stresses you out the most?',
    helperText: 'We will ensure your pathway recommendations include strategies that respect this comfort boundary.',
    options: [
      {
        id: 'ADVANCED_MATH',
        title: 'Heavy Theoretical Mathematics',
        badge: 'Complex Formulas',
        description: 'Calculus proofs, abstract algebra, and heavy numerical equations cause you acute stress.',
      },
      {
        id: 'PUBLIC_SPEAKING',
        title: 'High-Stakes Public Presentations',
        badge: 'Stage Anxiety',
        description: 'Speaking in front of large auditoriums, formal debates, or cold-calling unfamiliar audiences.',
      },
      {
        id: 'HEAVY_MEMORIZATION',
        title: 'Massive Rote Memorization',
        badge: 'Heavy Recall',
        description: 'Memorizing hundreds of anatomical terms, formulas, or historical dates under timed exam conditions.',
      },
      {
        id: 'INTENSIVE_WRITING',
        title: 'Lengthy Abstract Research Papers',
        badge: 'Long Essays',
        description: 'Drafting extensive theoretical dissertations, dense citations, and endless literary analyses.',
      },
      {
        id: 'ISOLATED_THEORY',
        title: 'Pure Theory Without Real Examples',
        badge: 'No Real Context',
        description: 'Spending months studying pure theory without any tangible, hands-on practical application.',
      },
    ],
  },

  q9: {
    stepNumber: 9,
    title: 'Looking ahead, what matters most for your happiness and peace of mind?',
    helperText: 'Your core priority helps us highlight pathways that match your personal definition of success.',
    options: [
      {
        id: 'FINANCIAL_STABILITY',
        title: 'Financial Stability & High Security',
        description: 'A reliable, predictable paycheck, strong health benefits, and long-term peace of mind.',
      },
      {
        id: 'PURPOSE_IMPACT',
        title: 'Purpose & Helping Others',
        description: 'Knowing your daily work directly improves other people’s lives or protects the environment.',
      },
      {
        id: 'CREATIVE_AUTONOMY',
        title: 'Creative Freedom & Expression',
        description: 'Having the autonomy to make original work, experiment, and bring your unique voice to life.',
      },
      {
        id: 'INTELLECTUAL_DEPTH',
        title: 'Mastery & Continuous Learning',
        description: 'Diving deep into complex domains, becoming a genuine expert, and continuous lifelong learning.',
      },
      {
        id: 'WORK_LIFE_BALANCE',
        title: 'Healthy Work-Life Harmony',
        description: 'Predictable work hours that leave plenty of time and emotional energy for family, hobbies, and rest.',
      },
    ],
  },

  q10: {
    stepNumber: 10,
    title: 'When you finish college, what path sounds best for your next chapter?',
    helperText: 'Remember: your choice is never permanent. Choose what fits your peace of mind today.',
    options: [
      {
        id: 'WORKFORCE_DIRECT',
        title: 'Starting a Career Right Away (2 to 4 Years)',
        badge: 'Independence First',
        description: 'Step directly into professional employment soon after graduation to earn an income and learn on the job.',
      },
      {
        id: 'GRADUATE_STUDY',
        title: 'Continuing into Graduate School',
        badge: 'Advanced Study',
        description: 'Continue into master’s degrees, medical or law school, or specialized research training.',
      },
      {
        id: 'FLEXIBLE_ENTREPRENEURSHIP',
        title: 'Launching a Project or Exploring',
        badge: 'Self-Directed',
        description: 'Launch an entrepreneurial project, join an early-stage startup, or take a flexible year to explore.',
      },
    ],
  },
} as const;
```

---

### 6.3 Centralized Advisor Portal Copy Repository (`src/content/advisorCopy.ts`)

The educator repository provides supportive, non-technical strings for school mentors, career advisors, and teachers. All database jargon (`database`, `SQL`, `query`, `table`, `schema`, `purge`, `401 unauthorized`) is strictly prohibited. Notice that prohibited terms like "counselor" are purged:

```typescript
export const ADVISOR_COPY = {
  portal: {
    brandName: 'PathLess for Advisors',
    pageTitle: 'School Advisor & Mentor Directory',
    tagline: 'Review student career reflections, exploratory majors, and notes with zero pressure.',
    frameworkBadge: 'Framework v2',
    logoutButton: 'Sign Out',
    logoutAriaLabel: 'Sign out of the Advisor Portal',
  },

  login: {
    title: 'School Advisor Access',
    subtitle: 'Enter your school passcode to access your students’ pathway reflections and session notes.',
    passcodeLabel: 'School Passcode',
    passcodePlaceholder: 'e.g., <ADVISOR_PASSCODE>',
    passcodeHelper: 'Ask your school guidance lead or principal if you do not know your school passcode.',
    authorNameLabel: 'Your Name or Advisor Title (Optional)',
    authorNamePlaceholder: 'e.g., Kru Nan / Advisor Davis',
    authorNameHelper: 'This will be attached to any private notes you write during student meetings.',
    submitButton: 'Open Advisor Directory',
    authenticatingButton: 'Verifying Passcode...',
    errorMessage: 'The passcode entered does not match our school records. Please check the code and try again.',
    privacyNote: 'Student submissions are kept private to your school community and auto-archived annually.',
  },

  directory: {
    searchPlaceholder: 'Search by student name or student ID...',
    searchLabel: 'Search students',
    gradeFilterLabel: 'Filter by grade level',
    allGradesOption: 'All Grades & Years',
    gradeOptions: {
      grade_10: '10th Grade',
      grade_11: '11th Grade',
      grade_12: '12th Grade',
      college_freshman: 'Freshman (Yr 1)',
      college_sophomore: 'Sophomore (Yr 2)',
    },
    dateFilterLabel: 'Filter by date',
    dateOptions: {
      all: 'All Time',
      past7Days: 'Past 7 Days',
      past30Days: 'Past 30 Days',
      currentYear: 'Current Academic Year',
    },
    tableCaption: 'Student Discovery Submissions Directory',
    tableHeaders: {
      student: 'Student',
      grade: 'Grade Level',
      topDirection: 'Top Pathway',
      submittedDate: 'Submission Date',
      notesCount: 'Advisor Notes',
      actions: 'Actions',
    },
    viewDetailCta: 'View Full Guide',
    viewDetailAria: (name: string) => `View full pathway discovery details for ${name}`,
    emptyStateTitle: 'No Student Submissions Found',
    emptyStateDescription: 'No student guides match your current search or filter. Submissions will appear here once students complete their intake.',
    loadingText: 'Loading student directory...',
    recordsCount: (count: number) => `${count} student ${count === 1 ? 'submission' : 'submissions'} found`,
  },

  drawer: {
    closeButtonAria: 'Close student details',
    loadingText: 'Retrieving student guide and recommendations...',
    profileSectionTitle: 'Student Profile & Context',
    gradeLevelLabel: 'Grade Level',
    studentIdLabel: 'Student ID',
    academicYearLabel: 'Academic Year',
    submittedDateLabel: 'Submitted',
    notProvided: 'Not provided',
    intakeAnswersTitle: 'What Naturally Energizes Them',
    hesitationSectionTitle: 'Academic Hesitation & Worry',
    subjectLabel: 'Curiosity Subject',
    environmentLabel: 'Work Environment',
    thinkingStyleLabel: 'Thinking Style',
    priorityLabel: 'Core Priority',
    pathwaysSectionTitle: 'Recommended Pathways',
    stage1MilestoneLabel: '1. College Major:',
    stage2MilestoneLabel: '2. First Job:',
    stage3MilestoneLabel: '3. Growth Role:',
    relevantMajorsLabel: 'Related Majors:',
    matchedUnisTitle: 'Verified Regional Higher Education Programs',
    notesSectionTitle: 'Private Advisor Session Notes',
    noNotesNotice: 'No notes have been recorded for this student yet. Use the form below to record notes from your advising conversation.',
    errorFallback: 'Unable to load student record details. Please try again.',
  },

  notes: {
    composerLabel: 'New Advisor Note',
    composerPlaceholder: 'Record discussion points, university preferences, or follow-up milestones for this student...',
    authorLabel: 'Author',
    authorDefault: 'Advisor',
    saveButton: 'Save Note',
    savingButton: 'Saving Note...',
    savedNotice: 'Note saved successfully to student record.',
    charCount: (current: number, max: number) => `${current}/${max} characters`,
    errorMessage: 'Unable to save your note right now. Please try again.',
  },

  purgeNotice: {
    title: 'Annual Academic Archive',
    description: 'PathLess automatically removes student submissions created prior to July 1 of the active school year to safeguard student privacy.',
    statusMessage: (count: number, date: string) =>
      `Archived ${count} submissions from prior academic cycles (cut-off: ${date}).`,
  },

  errors: {
    sessionExpired: 'Your advisor session has expired. Please enter your school passcode again.',
    networkError: 'We could not reach the school server. Please verify your connection.',
    unauthorized: 'Advisor authentication required.',
  },
} as const;
```

---

## 7. Component Copy Bindings & UI Decluttering Specifications

### 7.1 Student Intake Flow (`IntakeForm.tsx`, `QuestionCard.tsx`, `IntakeWizardContainer.tsx`)

1. **`IntakeForm.tsx` / `IntakeWizardContainer.tsx`**:
   - Bind top header brand name and guide title to `GUIDE_COPY.brand`.
   - Bind reset button, modal title, description, and action buttons to `GUIDE_COPY.resetDialog`.
   - Bind progress indicators (`Question X of Y`, `Z% Complete`) strictly to `GUIDE_COPY.shell.stepProgressLabel` and `GUIDE_COPY.shell.stepPercentLabel`.
   - Replace local `STEP_TITLES` dictionary with `GUIDE_COPY.stepTitles`.
   - Remove hardcoded `'Intake Step'` fallback; use `GUIDE_COPY.shell.welcomeStepLabel`.
   - Bind ARIA live announcements to `GUIDE_COPY.a11y.stepAnnouncement`.
2. **`QuestionCard.tsx` / `QuestionStepView.tsx`**:
   - Bind all option chips, badges, titles, descriptions, and selection status chips to `INTAKE_QUESTIONS[qKey]`.
   - Maintain minimum $44 \times 44$ pixel touch targets for all selectable cards.
   - For Step 3 (free text hesitation): bind character counter strictly to `q3.charCounter(current, 200)` and character limit milestone warning to `GUIDE_COPY.a11y.characterMilestoneWarning`.
3. **`WelcomeProfileStep.tsx`**:
   - Bind hero heading, subheading, and badge to `GUIDE_COPY.welcome` and `GUIDE_COPY.shell.badge`.
   - Bind privacy banner heading and body to `GUIDE_COPY.welcome.privacyPromiseTitle` and `GUIDE_COPY.welcome.privacyPromiseBody`.
   - Bind form field labels, placeholders, helper hints, and grade select options to `GUIDE_COPY.welcome.fields`.
   - Ensure all input errors read from `GUIDE_COPY.validation`.

### 7.2 Results Presentation & Progressive Disclosure (`ResultsContainer.tsx`, `CareerMatchCard.tsx`, `WhereToStudySection.tsx`)

1. **`ResultsContainer.tsx`**:
   - Bind region landmark to `RESULTS_COPY.a11y.resultsLandmark`.
   - Bind advisory header and student name title to `RESULTS_COPY.header.personalizedTitle(name)` or `RESULTS_COPY.header.defaultTitle`.
   - Bind reset and print action buttons to `RESULTS_COPY.actions`.
2. **`CareerMatchCard.tsx`**:
   - Replace hardcoded `'Specialist Concentration'` with `RESULTS_COPY.card.defaultRoleTitle`.
   - Replace hardcoded `'Applied Discipline'` with `RESULTS_COPY.card.defaultBroadField`.
   - Replace hardcoded `'Minor: '` with `RESULTS_COPY.card.minorPrefix`.
   - Bind 3-stage milestone headings and stage labels to `RESULTS_COPY.milestones`.
   - Bind daily tasks, study path, reassurance, and trial course sections to `RESULTS_COPY.card`.
   - Retain the strict print expansion rule: `isExpanded ? 'block' : 'hidden print:block'` so native browser print automatically renders all 4 expanded pathways.
3. **`WhereToStudySection.tsx`**:
   - Bind section header, badge, and description to `RESULTS_COPY.whereToStudy`.
   - Replace any references to "AI hallucination" or "fallback" with `RESULTS_COPY.whereToStudy.advisorVerificationNote` and `RESULTS_COPY.whereToStudy.curationNoticeTitle`.
   - Bind official admissions disclaimer to `RESULTS_COPY.whereToStudy.admissionsNoticeTitle` and `RESULTS_COPY.whereToStudy.admissionsNoticeBody`.

### 7.3 Dedicated Print Header & Layout (`PrintHeader.tsx`)

- Visible exclusively under `@media print` (`hidden print:block`).
- Bind institution title, confidential notice, metadata labels (Student Name, Grade / Year, Date Generated), and persistent advisor discussion note strictly to `RESULTS_COPY.printHeader`.
- Provide calm fallbacks (`defaultStudentName`, `defaultGrade`, `defaultDate`) from centralized copy.
- Enforce strict student privacy: **Student ID is permanently omitted from print layout**.

### 7.4 School Advisor Portal Suite (`AdvisorDashboard.tsx`, `PasscodeLogin.tsx`, `StudentDetailModal.tsx`, `StudentTable.tsx`)

1. **`AdvisorDashboard.tsx`**:
   - Bind brand name and framework version badge to `ADVISOR_COPY.portal.brandName` and `ADVISOR_COPY.portal.frameworkBadge`.
   - Bind page title, tagline, and logout button to `ADVISOR_COPY.portal`.
2. **`PasscodeLogin.tsx`**:
   - Bind modal title, subtitle, passcode label, placeholder, helper, author label, placeholder, submit button, loading state, error alert, and privacy note to `ADVISOR_COPY.login`.
   - Purge the word "counselor" from helper copy.
3. **`StudentDetailModal.tsx`**:
   - Bind section titles, student metadata labels (Grade Level, Student ID, Academic Year, Submitted), empty notes notice, and milestone labels (`1. College Major:`, `2. First Job:`, `3. Growth Role:`, `Related Majors:`) to `ADVISOR_COPY.drawer`.
   - Bind loading message to `ADVISOR_COPY.drawer.loadingText` and network error to `ADVISOR_COPY.drawer.errorFallback`.
4. **`StudentTable.tsx`**:
   - Bind search label, placeholder, grade filter label, all grades option, date filter label, date filter options, table caption, headers, view guide CTA, empty state, and record count function to `ADVISOR_COPY.directory`.

---

## 8. Visual Spacing, Decluttering & Responsive Text Wrapping

### 8.1 Visual Spacing Token Matrix

To remove visual clutter and create a breathable, calm user experience, all components adhere to standardized spacing tokens:

```
┌─────────────────────┬───────────────────────┬────────────────────────────────────────────────────────┐
│ UI Element          │ Tailwind Class Token  │ Decluttering Rationale                                 │
├─────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ Page Containers     │ max-w-4xl mx-auto     │ Prevents unwieldy wide-screen line lengths (>80 chars).│
│                     │ px-4 sm:px-6 py-6     │ Comfortable gutter padding across all breakpoints.     │
├─────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ Section Separators  │ space-y-6 sm:space-y-8│ Provides visual pause between questions and card tiers.│
├─────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ Card Padding        │ p-5 sm:p-6            │ Generous internal breathing room for card content.     │
├─────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ Input Fields        │ min-h-[44px] px-3.5   │ Satisfies WCAG 2.1 AA touch target and readable text.  │
│                     │ py-2.5 rounded-xl     │ Soft rounded geometry conveys safety and friendliness. │
├─────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ Option Card Grids   │ grid grid-cols-1      │ Single column on mobile (<640px) to prevent cramped    │
│                     │ sm:grid-cols-2 gap-3.5│ text wrapping; clean two-column on desktop viewports.  │
├─────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ Microcopy Typography│ text-xs sm:text-sm    │ High legibility with controlled leading (relaxed) to   │
│                     │ leading-relaxed       │ prevent vertical collisions during multi-line wraps.   │
└─────────────────────┴───────────────────────┴────────────────────────────────────────────────────────┘
```

### 8.2 Responsive Text Wrapping & 200% Zoom Defense

- **Break-Word Protection**: Use `break-words` and `hyphens-auto` where applicable on long labels or student inputs to prevent layout blowouts on narrow 320px screens.
- **200% Browser Zoom Support**: Avoid fixed pixel widths or fixed pixel heights on text-containing containers. All heights must use `min-h-[...]` or fluid auto layout.
- **Scroll Container Guards**: Modal drawers use `max-h-[calc(85vh-80px)] overflow-y-auto` with touch-friendly scrolling (`-webkit-overflow-scrolling: touch`).

---

## 9. Accessibility & WCAG 2.1 AA Compliance Contract

```
┌───────────────────────────────┬──────────────────────────┬────────────────────────────────────────────────────────┐
│ Accessibility Requirement     │ Standard / Target        │ Technical Implementation Rule                          │
├───────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────────┤
│ Color Contrast (Normal Text)  │ WCAG 2.1 AA (≥ 4.5:1)    │ slate-900 (#0f172a) on white (#ffffff) = 16.1:1.       │
│                               │                          │ slate-600 (#475569) on white (#ffffff) = 7.0:1.        │
├───────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────────┤
│ Color Contrast (Large/Badges) │ WCAG 2.1 AA (≥ 3.0:1)    │ emerald-800 (#065f46) on emerald-50 (#ecfdf5) = 6.8:1. │
│                               │                          │ sky-800 (#075985) on sky-50 (#f0f9ff) = 7.2:1.         │
├───────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────────┤
│ Touch Targets                 │ WCAG 2.1 AA (≥ 44×44 px) │ min-h-[44px] and min-w-[44px] on all buttons, inputs,  │
│                               │                          │ option cards, chips, and links.                        │
├───────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────────┤
│ Form Label Associations       │ WCAG 2.1 AA Success 1.3.1│ Every input/select has an associated <label> with      │
│                               │                          │ explicit htmlFor matching the input's id.              │
├───────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────────┤
│ Helper & Error Linkage        │ WCAG 2.1 AA Success 1.3.1│ Inputs reference helper and error text via             │
│                               │                          │ aria-describedby="[id]-helper [id]-error".             │
├───────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────────┤
│ Dynamic State Announcements   │ WCAG 2.1 AA Success 4.1.3│ aria-live="polite" for wizard step changes and limits; │
│                               │                          │ aria-live="assertive" for form validation errors.      │
├───────────────────────────────┼──────────────────────────┼────────────────────────────────────────────────────────┤
│ Visible Keyboard Focus Rings  │ WCAG 2.1 AA Success 2.4.7│ focus-visible:ring-2 focus-visible:ring-blue-600       │
│                               │                          │ focus-visible:outline-none on all interactive nodes.   │
└───────────────────────────────┴──────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 10. Automated Testing Strategy & Test Contracts

Feature 11 introduces two automated unit test suites in `tests/unit/`:

### 10.1 `tests/unit/copyAudit.test.ts`

Verifies the integrity, completeness, and readability of the centralized copy repositories:
1. **Dictionary Completeness**: Asserts that `GUIDE_COPY`, `ADVISOR_COPY`, `RESULTS_COPY`, and `INTAKE_QUESTIONS` possess all mandatory keys with non-empty string or function values.
2. **Readability Scoring (Flesch-Kincaid Grade Level & Flesch Reading Ease)**:
   - Evaluates all 10 intake question titles, helper texts, and option descriptions.
   - Asserts that every question title has $\text{FRE} \ge 60$ and $6.0 \le \text{FKGL} \le 12.0$.
   - Asserts that welcome screen hero text and results subtitles maintain conversational reading levels.
3. **Template Function Correctness**:
   - Asserts that dynamic string interpolators (`stepProgressLabel`, `selectionStatus`, `personalizedTitle`, `recordsCount`, `openProgramLinkAria`, `statusMessage`) execute cleanly and return non-empty strings across zero, single, plural, and undefined/empty parameters.
4. **Length & Microcopy Bounds**:
   - Asserts that button labels do not exceed 35 characters.
   - Asserts that question helper texts do not exceed 150 characters.

### 10.2 `tests/unit/prohibitedTerms.test.ts`

Scans all centralized copy dictionaries and primary UI components for banned terminology:
1. **Target Word List**:
   - `dossier`
   - `pathwayai`
   - `triage`
   - `counselor`
   - `algorithm`
   - `ai model`
   - `\bai\b` (isolated word "AI" in student/advisor prose)
   - `synthesis engine`
   - `fallback`
   - `database`
2. **Scan Targets**:
   - `src/content/guideCopy.ts`
   - `src/content/advisorCopy.ts`
   - `src/content/intakeQuestions.ts`
   - `src/components/intake/*`
   - `src/components/results/*`
   - `src/components/advisor/*`
3. **Pass Condition**: Exactly 0 matches found in any user-facing string literals, comments, or JSX text nodes.

---

## 11. Traceability Matrix & Verification Plan

```
┌─────────────────┬────────────────────────────────────────────────────────┬───────────────────────────────────────────┐
│ Acceptance ID   │ Acceptance Criterion Summary                           │ Verification Suite / Evidence File        │
├─────────────────┼────────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-01      │ 100% of strings sourced from centralized dictionaries  │ tests/unit/copyAudit.test.ts              │
│                 │ with zero hardcoded inline text in JSX components.     │ Component JSX text audits across files    │
├─────────────────┼────────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-02      │ User-facing text passes automated linting against all   │ tests/unit/prohibitedTerms.test.ts        │
│                 │ 9 prohibited terms (dossier, PathwayAI, Triage, etc.)  │ Zero regex matches across content and UI  │
├─────────────────┼────────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-03      │ All intake prompts, choices, and tips read at an       │ tests/unit/copyAudit.test.ts              │
│                 │ 8th-to-12th grade level with supportive microcopy.     │ Flesch-Kincaid & Reading Ease assertions  │
├─────────────────┼────────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-04      │ Results cards, milestones, and Where to Study panels   │ tests/unit/copyAudit.test.ts              │
│                 │ display unified plain-language explanations.           │ CareerMatchCard & WhereToStudySection JSX │
├─────────────────┼────────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-05      │ Advisor login & dashboard copy communicate supportive   │ tests/unit/copyAudit.test.ts              │
│                 │ educator guidance, avoiding database/query jargon.     │ AdvisorDashboard & PasscodeLogin JSX      │
├─────────────────┼────────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-06      │ Browser print preview matches the plain-language       │ tests/unit/copyAudit.test.ts              │
│                 │ voice, showing student metadata & disclaimers cleanly. │ PrintHeader.tsx & CareerMatchCard print   │
└─────────────────┴────────────────────────────────────────────────────────┴───────────────────────────────────────────┘
```

### Step-by-Step Implementation Sequence (Next Phase)

```
1. Create src/content/intakeQuestions.ts with 10 rewritten 8th–12th grade intake questions.
2. Update src/content/guideCopy.ts and src/content/advisorCopy.ts with 100% centralized strings and zero prohibited terms.
3. Implement tests/unit/copyAudit.test.ts and tests/unit/prohibitedTerms.test.ts.
4. Refactor Intake components (IntakeForm.tsx, QuestionCard.tsx, IntakeWizardContainer.tsx, WelcomeProfileStep.tsx).
5. Refactor Results components (ResultsContainer.tsx, CareerMatchCard.tsx, WhereToStudySection.tsx, PrintHeader.tsx).
6. Refactor Advisor components (AdvisorDashboard.tsx, PasscodeLogin.tsx, StudentDetailModal.tsx, StudentTable.tsx).
7. Run `npm test` and verify that all copy audits and prohibited terms tests pass with 0 errors.
```

---

## 12. Sign-Off & Approvals

- **Document Role**: Architecture, UX Copy, and Technical Contract
- **Target Branch**: `feature/11-ux-copy-and-simplification`
- **Application Code Status**: Locked (contract specification stage). Implementation proceeds upon contract approval.
