---
doc: contract
feature: 7-rework-intake-and-contracts
project: PathLess - Framework v2
status: approved
gate: PASS
---

# Feature 7: Intake and Contracts Rework — Technical Contract & Specification

## 1. Executive Summary & Objective

This specification establishes the technical, architectural, behavioral, and accessibility contract for **Feature 7: Intake and Contracts Rework** of the **PathLess Framework v2** on branch `feature/7-rework-intake-and-contracts`.

Feature 7 executes a forward architectural evolution from the legacy v1 PathwayAI prototype to the **PathLess Framework v2**. The legacy v1 implementation featured a 4-question intake sequence without a welcome or onboarding view, captured minimal unstructured chips and binary toggles, and utilized high-pressure, clinical terminology (such as "triage", "counselor", and "dossier"). 

PathLess v2 reframes college major and career discovery into an empathetic, student-centered experience designed for anxious 16–20-year-old high school students and early college undergraduates. Feature 7 introduces **Step 0 (Welcome and Student Profile screen)**, expands the intake journey into a comprehensive **8-to-10 question intake sequence** (specifically structured as 10 concrete, progressive questions), establishes updated TypeScript contracts capturing required student identity while strictly protecting student privacy (zero collection of email, phone numbers, or passwords), and completely eliminates all forbidden legacy terminology across all codebase symbols, interfaces, and user-facing copy.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    PATHLESS FRAMEWORK v2 EVOLUTION                               │
├─────────────────────────────────────────────────┬────────────────────────────────────────────────┤
│           Legacy PathwayAI (v1)                 │               PathLess Guide (v2)              │
├─────────────────────────────────────────────────┼────────────────────────────────────────────────┤
│ • 4 basic questions (task chips, binary toggles)│ • Step 0 Welcome & Profile + 10-Question Flow  │
│ • No student onboarding or identity foundation  │ • Full Name & Grade Level required             │
│ • Optional nickname string only                 │ • Student ID optional (opaque string)          │
│ • Legacy clinical terms: triage, counselor,     │ • Zero collection of email, phone, passwords   │
│   dossier, PathwayAI                            │ • Empathetic terms: Guide, Advisor, Pathways   │
│ • Scattered copy across legacy constants        │ • 100% centralized copy in content/guideCopy.ts│
│ • Minimal input validation                      │ • Strict multi-step validation & sessionStorage│
└─────────────────────────────────────────────────┴────────────────────────────────────────────────┘
```

### Primary Objectives
1. **Step 0 Welcome & Student Profile**: Implement a calming, zero-jargon onboarding view collecting required `fullName` (trimmed string, 1–100 chars), required `gradeLevel` (enum), and optional `studentId` (opaque string, max 64 chars). Explicitly enforce zero collection of email addresses, phone numbers, or passwords.
2. **10-Question Progressive Intake Questionnaire**: Expand the questionnaire from the legacy 4 questions to an empathetic, 10-question sequence assessing concrete day-to-day task preferences, academic curiosities, dread/friction tolerances, physical workplace settings, problem-solving styles, social batteries, structure tolerances, life priorities, and post-graduation horizons.
3. **Core TypeScript Contracts Overhaul**: Define immutable v2 types (`StudentProfile`, `IntakeAnswers`, `SubmissionPayload`, `GuideResult`) in `src/types/` and purge all legacy naming conventions (`PathwayAI`, `Triage`, `Counselor`, `dossier`).
4. **Forbidden Terminology Eradication**: Remove 100% of forbidden tokens across all types, interfaces, component names, filenames, and copy dictionaries.
5. **Centralized Guide Copy Definition (`src/content/guideCopy.ts`)**: Consolidate 100% of user-facing copy into `src/content/guideCopy.ts`, written strictly at an 8th-to-12th grade reading level with calm, reassuring phrasing.
6. **Robust Client State Machine & Session Persistence**: Extend `IntakeContext` to manage sequential navigation across Steps 0 through 10, preventing illegal step skips, enforcing inline validation, and synchronizing transient progress safely in `sessionStorage` under the versioned key `pathless_intake_v2`.
7. **Accessibility & WCAG 2.1 AA Compliance**: Enforce explicit `<label>` associations for every input, minimum $44 \times 44$ pixel interactive touch targets, visible focus rings (`focus-visible:ring-2 focus-visible:ring-edu-interactive`), and polite screen reader announcements (`aria-live="polite"`) upon step navigation.
8. **Numbered Acceptance Criteria**: Establish criteria **AC-INTAKE-01** through **AC-INTAKE-05** with complete verification and traceability mapping.

---

## 2. Scope & Boundary Clarifications

Feature 7 focuses strictly on the front-end intake wizard, student profile collection, state machine, data contracts, copy centralization, and unit test suites. Downstream AI processing, database persistence, and specialized UI components belong to subsequent features.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     FEATURE 7 BOUNDARY MAP                                       │
├──────────────────────────────────────┬───────────────────────────────────────────────────────────┤
│          IN SCOPE (Feature 7)        │               DEFERRED (Downstream Features)              │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ • Step 0 Welcome and Profile View    │ • AI synthesis prompt engineering & Gemini schema updates │
│ • 10-Question Progressive Intake     │   (Deferred to feature/8-rework-synthesis-and-results)    │
│ • Types: StudentProfile,             │ • Progressive disclosure result card UI                   │
│   IntakeAnswers, SubmissionPayload,  │   (Deferred to feature/8-rework-synthesis-and-results)    │
│   GuideResult                        │ • Thai university registry & regional curriculum mappings │
│ • Zero collection of email/phone/pass│   (Deferred to feature/9-thai-university-scaffold)        │
│ • Eradicate forbidden terms          │ • PostgreSQL persistence, Prisma migrations, and Advisor  │
│ • Centralized src/content/guideCopy  │   dashboard (Deferred to feature/10-advisor-dashboard-db) │
│ • State machine & sessionStorage     │ • Global UX plain-language copy hardening                 │
│ • WCAG 2.1 AA touch targets & a11y   │   (Deferred to feature/11-ux-copy-and-simplification)     │
│ • Unit tests for contracts & state   │ • Live backend API route implementation                   │
│   machine transitions                │   (Route handler updates deferred to Feature 8)           │
└──────────────────────────────────────┴───────────────────────────────────────────────────────────┘
```

### Explicitly In Scope
- **Step 0 Welcome & Profile Component**: `src/components/intake/WelcomeProfileStep.tsx`.
- **Intake Wizard Container**: `src/components/intake/IntakeWizardContainer.tsx` supporting Steps 0 through 10.
- **Dynamic Question Step Component**: `src/components/intake/QuestionStepView.tsx`.
- **TypeScript Contracts**: `src/types/intake.ts`, `src/types/career.ts`, `src/types/api.ts`.
- **Guide Copy Dictionary**: `src/content/guideCopy.ts` containing 100% of user-facing strings for Step 0 and all 10 questions.
- **State Machine & Context**: `src/context/IntakeContext.tsx` handling Step 0 through Step 10 actions, validation, and storage.
- **Unit Test Suites**: `tests/unit/intakeContracts.test.ts` and `tests/unit/intakeStateMachine.test.ts`.

### Explicitly Out of Scope
- **AI Synthesis Prompt Updates**: Modifying system instructions, prompt templates, or Gemini 2.5 Flash calling mechanics is deferred to `feature/8-rework-synthesis-and-results`.
- **Results Presentation UI**: Building the progressive disclosure career cards, fit score visuals, or trial course badges is deferred to `feature/8-rework-synthesis-and-results`.
- **Thai University Registry & Regional Normalization**: Incorporating Thai university database mappings (TCAS, Chulalongkorn, Mahidol, CMU, etc.) is deferred to `feature/9-thai-university-scaffold`.
- **PostgreSQL / Prisma / Advisor Dashboard**: Database migrations, advisor notes, and student management views are deferred to `feature/10-advisor-dashboard-db`.
- **Global Plain-Language Hardening**: Comprehensive audit and refinement of all post-synthesis text is deferred to `feature/11-ux-copy-and-simplification`.

---

## 3. Architecture & Data Flow

The following diagram illustrates how user interactions in the intake sequence flow through validation, the pure reducer, transient session storage, and culminate in a validated submission payload:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       STUDENT CLIENT BROWSER                                     │
│                                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              IntakeWizardContainer (Step Manager)                          │  │
│  │   - Header Progress Tracker: Active Step Indicator (Step 0 to 10) + Polite aria-live       │  │
│  │   - Main Content Stage:                                                                    │  │
│  │       • Step 0: WelcomeProfileStep (Full Name, Grade Level, Optional Student ID)           │  │
│  │       • Steps 1-10: QuestionStepView (Dynamic Question Renderer)                           │  │
│  │   - Navigation Controls: Previous (min 44px), Continue/Next (min 44px), Start Over Reset   │  │
│  └─────────────────────────────────────────────┬──────────────────────────────────────────────┘  │
│                                                │                                                 │
│                                                ▼ Semantic Actions (e.g. SET_PROFILE, SET_ANSWER) │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                IntakeContext (Pure State Machine)                          │  │
│  │   - State: currentStep (0..10), profile, answers (10 questions), errors, isCompleted       │  │
│  │   - Pure Step Validation Functions (isStep0Valid, isStep1Valid ... isStep10Valid)          │  │
│  │   - Step Navigation Guard: canAccessStep(targetStep, currentStep, state)                   │  │
│  └───────────────────────┬────────────────────────────────────────────┬───────────────────────┘  │
│                          │ Sync on State Change                       │ On Step 10 Completion    │
│                          ▼                                            ▼                          │
│  ┌──────────────────────────────────────────────┐   ┌─────────────────────────────────────────┐  │
│  │       Browser sessionStorage Cache           │   │    SubmissionPayload (Contract Export)  │  │
│  │   - Storage Key: "pathless_intake_v2"        │   │   - studentProfile (Name, Grade, ID)    │  │
│  │   - Version: 2                               │   │   - intakeAnswers (10 validated answers)│  │
│  │   - Safe serialization with in-memory fallback│  │   - clientTimestamp & schemaVersion     │  │
│  └──────────────────────────────────────────────┘   └─────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Step Lifecycle & Navigation Rules
1. **Initialization**: On mount, `IntakeContext` checks `sessionStorage` for `pathless_intake_v2`. If valid v2 state exists, it hydrates the state machine and sets `isHydrated: true`. If no state exists or legacy v1 data is detected, it purges obsolete storage keys and initializes at Step 0.
2. **Step 0 Enforcement**: A student cannot advance to Step 1 unless `fullName.trim().length >= 1` and `gradeLevel` is selected.
3. **Linear Progress Guard (`canAccessStep`)**: A student may freely navigate backward to any previously completed step. However, they cannot navigate forward beyond `currentStep + 1`, and cannot advance to step $N+1$ until step $N$ satisfies its pure validation check.
4. **Completion State**: When the student completes Step 10 and clicks "Finish & Explore Pathways", `state.isCompleted` is marked `true`, locking the answers and preparing the immutable `SubmissionPayload` for Feature 8.

---

## 4. Forbidden Terminology Removal & Terminology Mapping Matrix

To eliminate clinical, high-stakes, or proprietary legacy branding, the following terminology replacement matrix is strictly enforced across all files, code symbols, comments, tests, and user-facing copy:

```
┌──────────────────┬─────────────────────────────┬────────────────────────────────────────────────────────┐
│ Legacy Token     │ PathLess v2 Replacement     │ Architectural & Educational Justification              │
├──────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ PathwayAI        │ PathLess / PathLess Guide   │ Brand identity evolution: focuses on stress-free       │
│                  │                             │ exploration rather than robotic algorithmic triage.    │
├──────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Triage / triage  │ Guide / Assessment /        │ Eliminates emergency room / medical sorting connotation│
│                  │ Synthesis / Pathways        │ that elevates anxiety in stressed high schoolers.      │
│                  │ (e.g. GuideResult)          │                                                        │
├──────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Counselor        │ Advisor / Guide             │ Professionalizes collegiate and secondary guidance     │
│                  │ (e.g. AdvisorReview)        │ role while adhering to modern educational standards.   │
├──────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ dossier / Dossier│ Recommendation / Results /  │ Eradicates bureaucratic, intelligence-dossier language.│
│                  │ Pathways / GuideResult      │ Replaces it with encouraging, student-friendly pathways│
├──────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ studentNickname  │ fullName (StudentProfile)   │ Replaced by formal StudentProfile structure capturing  │
│                  │                             │ real first & last name, grade level, and student ID.   │
└──────────────────┴─────────────────────────────┴────────────────────────────────────────────────────────┘
```

### Forbidden Terminology Verification Rule
Automated tests in `tests/unit/intakeContracts.test.ts` will parse all exported identifiers, types, schemas, and string constants in `src/types/` and `src/content/guideCopy.ts` to assert zero occurrences of:
- `PathwayAI` / `pathwayAi` / `pathway-ai`
- `Triage` / `triage`
- `Counselor` / `counselor`
- `Dossier` / `dossier`

---

## 5. Core Data Contracts & TypeScript Specifications

### 5.1 Student Profile & Privacy Model (`src/types/intake.ts`)

Student identity is managed via `StudentProfile`. To respect youth privacy and minimize friction:
- **Required**: `fullName` (1–100 characters) and `gradeLevel`.
- **Optional**: `studentId` (opaque string, max 64 characters, used for school-issued alphanumeric IDs).
- **Prohibited**: Under no circumstances will email, phone number, physical address, or password fields exist in `StudentProfile`.

```typescript
// src/types/intake.ts

export type GradeLevel =
  | 'grade_10'
  | 'grade_11'
  | 'grade_12'
  | 'college_freshman'
  | 'college_sophomore';

export interface StudentProfile {
  fullName: string;        // 1 to 100 characters, trimmed
  gradeLevel: GradeLevel;  // Required educational level
  studentId?: string;      // Optional opaque alphanumeric ID (e.g. "STU-99214")
}
```

### 5.2 10-Question Intake Answer Schema (`src/types/intake.ts`)

The questionnaire is expanded to 10 concrete, grounded questions assessing daily activity preferences, academic inclinations, anxiety triggers, and future horizons:

```typescript
// src/types/intake.ts

export type WorkEnvironment =
  | 'REMOTE_DIGITAL'
  | 'COLLABORATIVE_STUDIO'
  | 'ACTIVE_FIELD_LAB'
  | 'HEALTHCARE_COMMUNITY';

export type ProblemSolvingStyle =
  | 'SYSTEMATIC_LOGIC'
  | 'CREATIVE_EXPLORATION'
  | 'PEOPLE_RELATIONAL'
  | 'PRACTICAL_HANDS_ON';

export type SocialEnergyStyle =
  | 'INDEPENDENT_DEEP_FOCUS'
  | 'BALANCED_TEAM'
  | 'HIGH_CONTACT_PEOPLE';

export type StructureTolerance =
  | 'HIGH_STRUCTURE_CLEAR_RULES'
  | 'BALANCED_MILESTONES'
  | 'HIGH_AUTONOMY_AMBIGUITY';

export type FrictionTolerance =
  | 'ADVANCED_MATH'
  | 'PUBLIC_SPEAKING'
  | 'HEAVY_MEMORIZATION'
  | 'INTENSIVE_WRITING'
  | 'ISOLATED_THEORY';

export type HorizonPriority =
  | 'FINANCIAL_STABILITY'
  | 'PURPOSE_IMPACT'
  | 'CREATIVE_AUTONOMY'
  | 'INTELLECTUAL_DEPTH'
  | 'WORK_LIFE_BALANCE';

export type AmbitionTimeline =
  | 'WORKFORCE_DIRECT'
  | 'GRADUATE_STUDY'
  | 'FLEXIBLE_ENTREPRENEURSHIP';

export interface IntakeAnswers {
  q1TaskIds: string[];                          // 1 to 2 task identifiers
  q2SubjectId: string;                          // Primary academic subject curiosity
  q3AcademicHesitation: string;                 // Brief thought on academic dread/worry (1-200 chars)
  q4Environment: WorkEnvironment;               // Day-to-day physical setting preference
  q5ProblemSolving: ProblemSolvingStyle;        // Instinctive thinking modality
  q6SocialEnergy: SocialEnergyStyle;            // Daily social battery & collaboration style
  q7StructureTolerance: StructureTolerance;      // Comfort level with routine vs. ambiguity
  q8AcademicFriction: FrictionTolerance;        // Specific academic pressure to minimize/manage
  q9HorizonPriority: HorizonPriority;            // Core personal/career driver
  q10PostCollegeAmbition: AmbitionTimeline;      // Immediate horizon after graduation
}

export interface IntakeValidationErrors {
  fullName?: string;
  gradeLevel?: string;
  studentId?: string;
  q1?: string;
  q2Subject?: string;
  q3Hesitation?: string;
  q4Environment?: string;
  q5ProblemSolving?: string;
  q6SocialEnergy?: string;
  q7Structure?: string;
  q8Friction?: string;
  q9Priority?: string;
  q10Ambition?: string;
  general?: string;
}
```

### 5.3 Intake State Machine Contracts (`src/types/intake.ts`)

```typescript
// src/types/intake.ts

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface IntakeState {
  currentStep: WizardStep;
  profile: StudentProfile;
  answers: Partial<IntakeAnswers>;
  validationErrors: IntakeValidationErrors;
  isResetDialogOpen: boolean;
  isCompleted: boolean;
  isHydrated: boolean;
}

export type IntakeAction =
  | { type: 'SET_PROFILE'; payload: Partial<StudentProfile> }
  | { type: 'SET_FULL_NAME'; payload: string }
  | { type: 'SET_GRADE_LEVEL'; payload: GradeLevel }
  | { type: 'SET_STUDENT_ID'; payload: string }
  | { type: 'TOGGLE_Q1_TASK'; payload: string }
  | { type: 'SET_Q2_SUBJECT'; payload: string }
  | { type: 'SET_Q3_HESITATION'; payload: string }
  | { type: 'SET_Q4_ENVIRONMENT'; payload: WorkEnvironment }
  | { type: 'SET_Q5_PROBLEM_SOLVING'; payload: ProblemSolvingStyle }
  | { type: 'SET_Q6_SOCIAL_ENERGY'; payload: SocialEnergyStyle }
  | { type: 'SET_Q7_STRUCTURE'; payload: StructureTolerance }
  | { type: 'SET_Q8_ACADEMIC_FRICTION'; payload: FrictionTolerance }
  | { type: 'SET_Q9_HORIZON_PRIORITY'; payload: HorizonPriority }
  | { type: 'SET_Q10_AMBITION'; payload: AmbitionTimeline }
  | { type: 'GO_TO_STEP'; payload: WizardStep }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'OPEN_RESET_DIALOG' }
  | { type: 'CLOSE_RESET_DIALOG' }
  | { type: 'RESET_STATE' }
  | { type: 'HYDRATE_STATE'; payload: Partial<IntakeState> }
  | { type: 'SET_HYDRATED' };

export interface IntakeContextValue {
  state: IntakeState;
  dispatch: React.Dispatch<IntakeAction>;
  isStepValid: (step: WizardStep) => boolean;
  canAccessStep: (targetStep: WizardStep) => boolean;
  isCurrentStepValid: boolean;
  setProfile: (profile: Partial<StudentProfile>) => void;
  setFullName: (name: string) => void;
  setGradeLevel: (grade: GradeLevel) => void;
  setStudentId: (id: string) => void;
  toggleQ1Task: (taskId: string) => void;
  setQ2Subject: (subjectId: string) => void;
  setQ3Hesitation: (hesitation: string) => void;
  setQ4Environment: (env: WorkEnvironment) => void;
  setQ5ProblemSolving: (style: ProblemSolvingStyle) => void;
  setQ6SocialEnergy: (social: SocialEnergyStyle) => void;
  setQ7Structure: (structure: StructureTolerance) => void;
  setQ8AcademicFriction: (friction: FrictionTolerance) => void;
  setQ9HorizonPriority: (priority: HorizonPriority) => void;
  setQ10Ambition: (ambition: AmbitionTimeline) => void;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  openResetDialog: () => void;
  closeResetDialog: () => void;
  resetState: () => void;
}
```

### 5.4 Career & Recommendation Contracts (`src/types/career.ts`)

Replaces all legacy triage and counselor entities with PathLess Guide entities:

```typescript
// src/types/career.ts
import { StudentProfile, IntakeAnswers } from './intake';

export type MatchTier =
  | 'Primary Direct Match'
  | 'High-Growth Pathway'
  | 'Interdisciplinary Pivot'
  | 'Moonshot Trajectory';

export interface TrialCourse {
  title: string;
  provider: string;
  description: string;
  estimatedHours: number;
}

export interface PathwayCard {
  id: string;
  roleTitle: string;
  matchTier: MatchTier;
  fitScore: number;
  fitRationale: string;
  majors: string[];
  minors?: string[];
  dailyTasks: string[];
  misconceptions: string[];
  courseChallenges: string;
  reassurance: string;
  trialCourses: [TrialCourse, TrialCourse];
}

export interface GuideSummary {
  studentArchetype: string;
  narrativeSummary: string;
}

export interface GuideMeta {
  engine: string;
  generationLatencyMs: number;
  fallbackUsed: boolean;
}

export interface GuideResult {
  success: boolean;
  submissionId: string;
  studentProfile: StudentProfile;
  summary: GuideSummary;
  pathways: PathwayCard[]; // Array of 4 recommended pathway cards
  meta: GuideMeta;
}

export interface AdvisorReview {
  id: string;
  submissionId: string;
  advisorName: string;
  status: 'PENDING' | 'REVIEWED' | 'DISCUSSED';
  notes: string;
  updatedAt: string;
}
```

### 5.5 API & Submission Contracts (`src/types/api.ts`)

```typescript
// src/types/api.ts
import { StudentProfile, IntakeAnswers } from './intake';
import { GuideResult } from './career';

export type ProblemErrorCode =
  | 'VALIDATION_FAILED'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'RATE_LIMITED'
  | 'AI_SYNTHESIS_FAILED'
  | 'GATEWAY_TIMEOUT';

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: ProblemErrorCode;
  requestId: string;
  invalidParams?: Array<{
    name: string;
    reason: string;
  }>;
}

export interface SubmissionPayload {
  studentProfile: StudentProfile;
  intakeAnswers: IntakeAnswers;
  metadata?: {
    clientTimestamp: string;
    schemaVersion: number;
  };
}

export type GuideApiResponse = GuideResult | ProblemDetails;
```

---

## 6. Centralized Guide Copy Specification (`src/content/guideCopy.ts`)

To guarantee psychological safety and calm reassurance, **100% of user-facing strings across Step 0 and all 10 intake questions must reside in `src/content/guideCopy.ts`**. No hardcoded strings are permitted in React JSX.

Reading level constraint: **8th-to-12th grade readability (Flesch-Kincaid grade level 8.0–11.9)**. Phrasing must be validating, non-punitive, and conversational.

```typescript
// src/content/guideCopy.ts

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

  questions: {
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
          title: 'Building & Designing',
          description: 'Fixing things, coding, assembling physical projects, or figuring out how mechanical and digital systems connect.',
        },
        {
          id: 'ANALYZE_PATTERNS',
          title: 'Investigating & Solving Puzzles',
          description: 'Digging into curious questions, spotting hidden trends, researching facts, and untangling complicated mysteries.',
        },
        {
          id: 'HELP_HUMANS',
          title: 'Guiding & Supporting Others',
          description: 'Listening closely to people, offering thoughtful advice, teaching concepts, and helping friends navigate tricky problems.',
        },
        {
          id: 'CREATE_EXPRESS',
          title: 'Creating & Storytelling',
          description: 'Writing, designing graphics, editing media, visual art, or communicating ideas through creative expression.',
        },
        {
          id: 'LEAD_ORGANIZING',
          title: 'Organizing & Leading Initiatives',
          description: 'Bringing groups together, mapping out schedules, coordinating events, and turning scattered ideas into action.',
        },
      ],
    },

    q2: {
      stepNumber: 2,
      title: 'Which general subject area sparks the most genuine curiosity for you?',
      helperText: 'Choose the subject field you lean toward when you get to pick what you learn.',
      options: [
        { id: 'TECH_COMPUTING', title: 'Technology & Computing', badge: 'Software & Systems' },
        { id: 'HEALTH_MEDICINE', title: 'Health, Medicine & Biology', badge: 'Life Sciences' },
        { id: 'BUSINESS_INNOVATION', title: 'Business & Social Enterprise', badge: 'Strategy & Org' },
        { id: 'ARTS_MEDIA', title: 'Arts, Design & Media', badge: 'Creative Expression' },
        { id: 'CIVICS_SOCIETY', title: 'Law, Policy & Community Impact', badge: 'Society & Justice' },
        { id: 'ENGINEERING_PHYSICAL', title: 'Engineering & Applied Sciences', badge: 'Physical World' },
      ],
    },

    q3: {
      stepNumber: 3,
      title: 'What gives you hesitation or worry when thinking about this subject or college in general?',
      helperText: 'A sentence or two is plenty. We use this to pair you with supportive academic reassurance.',
      placeholder: 'e.g., I love building things, but advanced calculus stresses me out...',
      charLimit: 200,
      charCounter: (current: number, max: number) => `${current}/${max} characters`,
    },

    q4: {
      stepNumber: 4,
      title: 'What day-to-day physical work environment sounds most comfortable for you?',
      helperText: 'Think about where your body feels calm and relaxed, rather than what sounds most impressive.',
      options: [
        {
          id: 'REMOTE_DIGITAL',
          title: 'Quiet Digital Desk',
          badge: 'Flexible & Focused',
          description: 'Working primarily from a laptop with quiet focus, flexible hours, and collaboration through digital tools.',
        },
        {
          id: 'COLLABORATIVE_STUDIO',
          title: 'Active Team Studio or Office',
          badge: 'Interactive & Social',
          description: 'Working around energetic teammates, whiteboard sessions, group discussions, and shared creative energy.',
        },
        {
          id: 'ACTIVE_FIELD_LAB',
          title: 'Hands-On Lab, Workshop, or Field',
          badge: 'Movement & Tangible',
          description: 'On-your-feet movement, scientific equipment, outdoor fieldwork, or working directly with tools and materials.',
        },
        {
          id: 'HEALTHCARE_COMMUNITY',
          title: 'Community or Healthcare Setting',
          badge: 'Human-Centered',
          description: 'Direct in-person interaction supporting patients, clients, students, or community members in dynamic settings.',
        },
      ],
    },

    q5: {
      stepNumber: 5,
      title: 'When faced with a tough, unfamiliar problem, how do you instinctively begin?',
      helperText: 'Choose the problem-solving style that feels like your default mindset.',
      options: [
        {
          id: 'SYSTEMATIC_LOGIC',
          title: 'Step-by-Step Logic',
          description: 'Breaking the problem down into orderly, manageable components and testing solutions methodically.',
        },
        {
          id: 'CREATIVE_EXPLORATION',
          title: 'Open Brainstorming',
          description: 'Sketching out wild ideas, looking for unconventional angles, and trying unexpected combinations.',
        },
        {
          id: 'PEOPLE_RELATIONAL',
          title: 'Talking It Through',
          description: 'Asking people about their experiences, listening to different perspectives, and collaborating on answers.',
        },
        {
          id: 'PRACTICAL_HANDS_ON',
          title: 'Tinkering by Doing',
          description: 'Jumping straight in, building a quick rough draft or prototype, and learning from immediate trial and error.',
        },
      ],
    },

    q6: {
      stepNumber: 6,
      title: 'How does social interaction affect your energy across a typical day?',
      helperText: 'Be honest about your social battery—sustainable careers align with your natural rhythm.',
      options: [
        {
          id: 'INDEPENDENT_DEEP_FOCUS',
          title: 'Mostly Independent Focus',
          description: 'You recharge with solo deep work and prefer having just a few scheduled meetings a week.',
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
      title: 'What level of day-to-day structure helps you feel at your best?',
      helperText: 'Think about whether uncertainty excites you or stresses you out.',
      options: [
        {
          id: 'HIGH_STRUCTURE_CLEAR_RULES',
          title: 'Clear Expectations & Defined Guidelines',
          description: 'You thrive when goals, workflows, and deliverables are clearly outlined with reliable consistency.',
        },
        {
          id: 'BALANCED_MILESTONES',
          title: 'Defined Goals with Freedom in How You Work',
          description: 'You like having clear milestones, but prefer choosing your own path and schedule to reach them.',
        },
        {
          id: 'HIGH_AUTONOMY_AMBIGUITY',
          title: 'Open-Ended Freedom & Fast Changes',
          description: 'You get bored by repetition and love charting your own course through unpredictable challenges.',
        },
      ],
    },

    q8: {
      stepNumber: 8,
      title: 'Which academic demand tends to create the most stress or friction for you?',
      helperText: 'We will ensure your pathway recommendations include strategies and courses that respect this boundary.',
      options: [
        {
          id: 'ADVANCED_MATH',
          title: 'High-Level Theoretical Mathematics',
          badge: 'Heavy Formulas',
          description: 'Calculus proofs, abstract algebra, and heavy numerical theory cause acute frustration.',
        },
        {
          id: 'PUBLIC_SPEAKING',
          title: 'High-Stakes Public Presentations',
          badge: 'Stage Anxiety',
          description: 'Speaking in front of large auditoriums, formal debates, or cold-calling unfamiliar crowds.',
        },
        {
          id: 'HEAVY_MEMORIZATION',
          title: 'Massive Rote Memorization',
          badge: 'Flashcards & Anatomy',
          description: 'Memorizing hundreds of Latin terms, formulas, or historical dates under timed exam conditions.',
        },
        {
          id: 'INTENSIVE_WRITING',
          title: 'Lengthy Abstract Academic Essays',
          badge: '30-Page Research',
          description: 'Drafting extensive theoretical dissertations, dense citations, and endless literary analyses.',
        },
        {
          id: 'ISOLATED_THEORY',
          title: 'Hyper-Isolated Solitary Theory',
          badge: 'No Real-World Context',
          description: 'Spending months studying pure theory without any tangible, real-world practical application.',
        },
      ],
    },

    q9: {
      stepNumber: 9,
      title: 'Looking at your future, what matters most for your peace of mind?',
      helperText: 'Your core priority helps us weight pathways that align with your personal definition of success.',
      options: [
        {
          id: 'FINANCIAL_STABILITY',
          title: 'Financial Stability & High Security',
          description: 'A reliable, predictable paycheck, strong health benefits, and high job security.',
        },
        {
          id: 'PURPOSE_IMPACT',
          title: 'Purpose & Meaningful Contribution',
          description: 'Knowing your daily work directly improves other people’s lives or protects the planet.',
        },
        {
          id: 'CREATIVE_AUTONOMY',
          title: 'Creative Freedom & Expression',
          description: 'Having the autonomy to make original work, experiment, and bring your unique voice to life.',
        },
        {
          id: 'INTELLECTUAL_DEPTH',
          title: 'Mastery & Intellectual Challenge',
          description: 'Diving deep into complex domains, becoming a genuine expert, and continuous lifelong learning.',
        },
        {
          id: 'WORK_LIFE_BALANCE',
          title: 'Sustainable Work-Life Harmony',
          description: 'Strict 40-hour weeks that leave plenty of time and emotional energy for family, hobbies, and rest.',
        },
      ],
    },

    q10: {
      stepNumber: 10,
      title: 'Looking immediately past college, what timeline feels right for your next chapter?',
      helperText: 'Remember: your choice is never permanent. Choose what fits your peace of mind today.',
      options: [
        {
          id: 'WORKFORCE_DIRECT',
          title: 'Direct Career Entry (2 to 4-Year Horizon)',
          badge: 'Independence First',
          description: 'Step directly into professional employment soon after graduation to earn an income and learn on the job.',
        },
        {
          id: 'GRADUATE_STUDY',
          title: 'Graduate or Professional School',
          badge: 'Advanced Specialization',
          description: 'Continue into master’s degrees, medical or law school, or specialized clinical training.',
        },
        {
          id: 'FLEXIBLE_ENTREPRENEURSHIP',
          title: 'Entrepreneurship or Exploratory Projects',
          badge: 'Self-Directed',
          description: 'Launch a project, join an early-stage startup, or take a flexible gap year to build your own path.',
        },
      ],
    },
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

export type GuideCopyType = typeof GUIDE_COPY;
```

---

## 7. Component Specifications

### 7.1 Step 0: Welcome and Student Profile View (`src/components/intake/WelcomeProfileStep.tsx`)

The Welcome and Student Profile view introduces the PathLess Guide, establishes psychological safety, and collects required student identity with inline validation.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              WelcomeProfileStep.tsx Layout                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Badge: Zero-Pressure Exploration • 10 Questions • ~3 Minutes]                         │
│                                                                                        │
│ <h1> Find Your Direction Without the Anxiety </h1>                                     │
│ <p> The PathLess Guide connects what you naturally enjoy with college majors... </p>   │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔒 Your Privacy Matters                                                            │ │
│ │ We only ask for your name and grade level to personalize your pathways. We never   │ │
│ │ ask for your email address, phone number, or a password.                           │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ Full Name *                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Alex Morgan                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│ helper: Enter your first and last name so we can address your guide personally.        │
│                                                                                        │
│ Current Grade or College Year *                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 11th Grade (High School Junior)                                                  ▼ │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ Student ID (Optional)                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ STU-88412                                                                          │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│ helper: If your school or advisor gave you a student code, enter it here.            │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [ Begin PathLess Guide ➔ ] (min-h-[44px], focus-visible:ring-2)                    │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Technical & Accessibility Requirements
- **Inputs**:
  - `fullName`: `<input id="student-full-name" type="text" required maxLength={100} ... />` with matching `<label htmlFor="student-full-name">`.
  - `gradeLevel`: `<select id="student-grade-level" required ... />` or custom accessible radio/listbox with matching `<label htmlFor="student-grade-level">`.
  - `studentId`: `<input id="student-id" type="text" maxLength={64} ... />` with matching `<label htmlFor="student-id">`.
- **Validation on Blur & Change**:
  - `fullName`: Invalid if empty after trim; error displayed in `<p id="full-name-error" role="alert">` with `aria-describedby="full-name-error"`.
  - `gradeLevel`: Invalid if unselected.
  - `studentId`: Treated as opaque string; trimmed; optional; invalid only if $> 64$ characters.
- **Privacy Assurance Callout**: Explicit callout banner highlighting that no email, phone, or password will ever be requested.
- **Primary CTA**: Minimum touch target of $44 \times 44$ px, disabled until `fullName.trim().length >= 1` and `gradeLevel` is selected.

---

### 7.2 Intake Wizard Step Manager (`src/components/intake/IntakeWizardContainer.tsx`)

The Intake Wizard Step Manager coordinates the entire journey from Step 0 through Step 10, managing progress calculation, screen reader announcements, and navigation buttons.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          IntakeWizardContainer.tsx Layout                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [PathLess Guide]                                                   [ Start Over ⟲ ]    │
│                                                                                        │
│ Step Progress: Question 3 of 10                                       [ 30% Complete ] │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                                                                        │
│ <main> (Dynamic View based on state.currentStep)                                       │
│   - If currentStep === 0 -> <WelcomeProfileStep />                                     │
│   - If currentStep >= 1 && currentStep <= 10 -> <QuestionStepView step={currentStep} />│
│ </main>                                                                                │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [ ❮ Previous ] (min 44x44px)                       [ Continue ❯ ] (min 44x44px)   │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│ <div aria-live="polite" class="sr-only"> Step 3 of 10: Academic Hesitation </div>      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Step Manager Responsibilities
1. **Progress Bar**:
   - Step 0 displays a welcoming badge with 0% progress.
   - Steps 1 through 10 display `aria-valuenow={currentStep}`, `aria-valuemin={0}`, `aria-valuemax={10}`, and visual width `(currentStep / 10) * 100%`.
2. **Screen Reader Announcement**:
   - Persistent element with `aria-live="polite"` and `aria-atomic="true"` announces `GUIDE_COPY.a11y.stepAnnouncement(currentStep, 10, stepTitle)` upon step changes.
3. **Navigation Bar**:
   - `Previous` button: Hidden on Step 0; enabled on Steps 1 through 10. Minimum dimensions: $44 \times 44$ px.
   - `Continue` button: Renders `GUIDE_COPY.navigation.next` on Steps 1–9; renders `GUIDE_COPY.navigation.finish` on Step 10. Automatically disabled if `!isCurrentStepValid`.
   - `Reset` trigger: Opens accessible `ResetConfirmationModal`.

---

### 7.3 Dynamic Question Step View (`src/components/intake/QuestionStepView.tsx`)

A unified, accessible presenter for Questions 1 through 10 that dynamically renders the appropriate UI control based on the active question definition:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              QuestionStepView.tsx Layout                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ <fieldset>                                                                             │
│   <legend>                                                                             │
│     <h2 class="text-xl font-semibold"> Question Title </h2>                            │
│     <p class="text-sm text-edu-subtle"> Helper Text & Guidance </p>                    │
│   </legend>                                                                            │
│                                                                                        │
│   [ Case 1: Multi-Select Chips (Q1 Tasks - Limit 2) ]                                  │
│   - Role: group with aria-label                                                        │
│   - Pills: role="button" aria-pressed={isSelected}                                     │
│                                                                                        │
│   [ Case 2: Single-Select Radio Cards (Q2, Q4, Q5, Q6, Q7, Q8, Q9, Q10) ]              │
│   - Role: radiogroup                                                                   │
│   - Option cards: role="radio" aria-checked={isSelected} tabindex={isSelected ? 0 : -1}│
│   - Includes badge, title, and description                                             │
│                                                                                        │
│   [ Case 3: Thoughtful Textarea (Q3 Hesitation - 200 Char Max) ]                       │
│   - <textarea id="q3-hesitation" maxLength={200} ... />                                │
│   - Live character counter: "42/200 characters"                                        │
│   - aria-describedby="q3-char-counter q3-error"                                        │
│ </fieldset>                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Question View Interaction Details
- **Multi-Select Task Chips (Q1)**:
  - Supports 1 or 2 task selections.
  - If a student attempts to select a 3rd task, selection is rejected and an empathetic helper message (`GUIDE_COPY.questions.q1.selectionStatus`) explains that the 2-task maximum has been reached.
- **Single-Select Radio Cards (Q2, Q4–Q10)**:
  - Fully accessible via standard keyboard navigation (Arrow keys move focus between options, Space/Enter selects).
  - Selected cards display `border-edu-interactive ring-2 ring-edu-interactive bg-edu-surface-selected`.
- **Open Hesitation Input (Q3)**:
  - Monitored live; character count announced to screen readers at milestones (50, 100, 150, 190 characters).

---

## 8. State Machine Engine & Validation Rules (`IntakeContext.tsx`)

### 8.1 Pure Step Validation Functions

Every step has a deterministic, side-effect-free pure validator:

```typescript
// src/context/IntakeContext.tsx validation logic

export function isStep0Valid(profile: Partial<StudentProfile>): boolean {
  if (!profile) return false;
  const hasName = typeof profile.fullName === 'string' && profile.fullName.trim().length >= 1 && profile.fullName.length <= 100;
  const validGrades: GradeLevel[] = ['grade_10', 'grade_11', 'grade_12', 'college_freshman', 'college_sophomore'];
  const hasGrade = Boolean(profile.gradeLevel && validGrades.includes(profile.gradeLevel));
  const hasValidId = !profile.studentId || (typeof profile.studentId === 'string' && profile.studentId.trim().length <= 64);
  return hasName && hasGrade && hasValidId;
}

export function isStep1Valid(answers: Partial<IntakeAnswers>): boolean {
  if (!answers?.q1TaskIds || !Array.isArray(answers.q1TaskIds)) return false;
  const unique = new Set(answers.q1TaskIds.filter((t) => typeof t === 'string' && t.trim().length > 0));
  return unique.size >= 1 && unique.size <= 2 && unique.size === answers.q1TaskIds.length;
}

export function isStep2Valid(answers: Partial<IntakeAnswers>): boolean {
  return typeof answers?.q2SubjectId === 'string' && answers.q2SubjectId.trim().length > 0;
}

export function isStep3Valid(answers: Partial<IntakeAnswers>): boolean {
  const text = typeof answers?.q3AcademicHesitation === 'string' ? answers.q3AcademicHesitation.trim() : '';
  return text.length >= 1 && text.length <= 200;
}

export function isStep4Valid(answers: Partial<IntakeAnswers>): boolean {
  const valid: WorkEnvironment[] = ['REMOTE_DIGITAL', 'COLLABORATIVE_STUDIO', 'ACTIVE_FIELD_LAB', 'HEALTHCARE_COMMUNITY'];
  return Boolean(answers?.q4Environment && valid.includes(answers.q4Environment));
}

export function isStep5Valid(answers: Partial<IntakeAnswers>): boolean {
  const valid: ProblemSolvingStyle[] = ['SYSTEMATIC_LOGIC', 'CREATIVE_EXPLORATION', 'PEOPLE_RELATIONAL', 'PRACTICAL_HANDS_ON'];
  return Boolean(answers?.q5ProblemSolving && valid.includes(answers.q5ProblemSolving));
}

export function isStep6Valid(answers: Partial<IntakeAnswers>): boolean {
  const valid: SocialEnergyStyle[] = ['INDEPENDENT_DEEP_FOCUS', 'BALANCED_TEAM', 'HIGH_CONTACT_PEOPLE'];
  return Boolean(answers?.q6SocialEnergy && valid.includes(answers.q6SocialEnergy));
}

export function isStep7Valid(answers: Partial<IntakeAnswers>): boolean {
  const valid: StructureTolerance[] = ['HIGH_STRUCTURE_CLEAR_RULES', 'BALANCED_MILESTONES', 'HIGH_AUTONOMY_AMBIGUITY'];
  return Boolean(answers?.q7StructureTolerance && valid.includes(answers.q7StructureTolerance));
}

export function isStep8Valid(answers: Partial<IntakeAnswers>): boolean {
  const valid: FrictionTolerance[] = ['ADVANCED_MATH', 'PUBLIC_SPEAKING', 'HEAVY_MEMORIZATION', 'INTENSIVE_WRITING', 'ISOLATED_THEORY'];
  return Boolean(answers?.q8AcademicFriction && valid.includes(answers.q8AcademicFriction));
}

export function isStep9Valid(answers: Partial<IntakeAnswers>): boolean {
  const valid: HorizonPriority[] = ['FINANCIAL_STABILITY', 'PURPOSE_IMPACT', 'CREATIVE_AUTONOMY', 'INTELLECTUAL_DEPTH', 'WORK_LIFE_BALANCE'];
  return Boolean(answers?.q9HorizonPriority && valid.includes(answers.q9HorizonPriority));
}

export function isStep10Valid(answers: Partial<IntakeAnswers>): boolean {
  const valid: AmbitionTimeline[] = ['WORKFORCE_DIRECT', 'GRADUATE_STUDY', 'FLEXIBLE_ENTREPRENEURSHIP'];
  return Boolean(answers?.q10PostCollegeAmbition && valid.includes(answers.q10PostCollegeAmbition));
}

export function validateStep(step: WizardStep, profile: Partial<StudentProfile>, answers: Partial<IntakeAnswers>): boolean {
  switch (step) {
    case 0: return isStep0Valid(profile);
    case 1: return isStep1Valid(answers);
    case 2: return isStep2Valid(answers);
    case 3: return isStep3Valid(answers);
    case 4: return isStep4Valid(answers);
    case 5: return isStep5Valid(answers);
    case 6: return isStep6Valid(answers);
    case 7: return isStep7Valid(answers);
    case 8: return isStep8Valid(answers);
    case 9: return isStep9Valid(answers);
    case 10: return isStep10Valid(answers);
    default: return false;
  }
}
```

### 8.2 Step Navigation Guard (`canAccessStep`)

```typescript
export function canAccessStep(
  targetStep: WizardStep,
  currentStep: WizardStep,
  profile: Partial<StudentProfile>,
  answers: Partial<IntakeAnswers>
): boolean {
  // Step 0 is always accessible
  if (targetStep === 0) return true;

  // Backward navigation to any previous step is always allowed
  if (targetStep <= currentStep) return true;

  // Cannot skip ahead more than 1 step past current
  if (targetStep > currentStep + 1) return false;

  // Forward transition requires all prior steps to be valid
  for (let s = 0; s < targetStep; s++) {
    if (!validateStep(s as WizardStep, profile, answers)) {
      return false;
    }
  }

  return true;
}
```

---

## 9. Session Storage & Transient Persistence Strategy

To preserve student input across accidental browser refreshes while strictly honoring zero-persistence privacy:
1. **Storage Mechanism**: Use browser `sessionStorage` (cleared automatically when the browser tab closes).
2. **Storage Key**: `pathless_intake_v2`.
3. **Data Envelope**:
   ```typescript
   export interface StoredIntakeStateV2 {
     version: 2;
     currentStep: WizardStep;
     profile: StudentProfile;
     answers: Partial<IntakeAnswers>;
     savedAt: number;
   }
   ```
4. **Legacy Storage Purge**: During hydration, if `sessionStorage.getItem('pathway_ai_wizard_state')` or any v1 key is detected, it is immediately removed to prevent cross-version corruption.
5. **Safe Fallback**: If `sessionStorage` is disabled (e.g. strict private mode or quota exceeded), `IntakeContext` falls back seamlessly to in-memory state without crashing or blocking the student.

---

## 10. Accessibility (a11y) & WCAG 2.1 AA Requirements

| Requirement | Implementation Specification | Validation Method |
| :--- | :--- | :--- |
| **Explicit Form Labels** | Every `<input>` and `<select>` has an explicit `<label>` with matching `htmlFor` and `id`. | Automated axe audit + unit test contract check |
| **Minimum Touch Targets** | All buttons, option chips, and interactive cards enforce `min-h-[44px] min-w-[44px]`. | CSS inspection + automated DOM dimension checks |
| **Visible Focus Rings** | All interactive controls apply `focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:outline-none`. | Keyboard Tab traversal inspection |
| **Polite Step Announcements** | Step manager mounts `<div aria-live="polite" aria-atomic="true" class="sr-only">` announcing step numbers and titles. | Screen reader simulation & test assertion |
| **Character Counter a11y** | Textarea for Q3 links counter via `aria-describedby` and alerts at limit via `role="status"`. | Screen reader test |
| **Error Feedback** | Inline validation errors use `role="alert"` and link to inputs via `aria-invalid="true"` and `aria-describedby`. | DOM assertion |

---

## 11. Verification & Testing Strategy

Implementation of Feature 7 will be accompanied by two comprehensive unit test suites:

### 11.1 `tests/unit/intakeContracts.test.ts`
- **Schema Validation**: Tests that `StudentProfile`, `IntakeAnswers`, `SubmissionPayload`, and `GuideResult` conform strictly to expected shapes.
- **Privacy Enforcement**: Asserts that `StudentProfile` does NOT contain `email`, `phone`, `password`, or contact attributes.
- **Forbidden Terminology Scanner**: Inspects all exported identifiers and types across `src/types/intake.ts`, `src/types/career.ts`, `src/types/api.ts`, and `src/content/guideCopy.ts`. Fails if any token contains `triage`, `counselor`, `dossier`, or `pathwayai` (case-insensitive).
- **Copy Completeness**: Asserts that 100% of question titles, helper strings, options, badges, and validation messages in `GUIDE_COPY` are non-empty strings.

### 11.2 `tests/unit/intakeStateMachine.test.ts`
- **Step 0 Validation**: Verifies that Step 0 fails validation when `fullName` is empty or whitespace, or when `gradeLevel` is invalid; verifies that optional `studentId` passes whether omitted or populated with an opaque string.
- **Questions 1–10 Validation**: Tests all 10 question validation functions against valid, invalid, and boundary inputs.
- **Step Navigation Guards**: Tests `canAccessStep` to verify:
  - Backward navigation is always permitted.
  - Forward navigation is blocked if current step is invalid.
  - Direct jump to an unreached future step (e.g. Step 0 to Step 5) is rejected.
- **Reducer Action Dispatching**: Tests all semantic reducer actions (`SET_PROFILE`, `TOGGLE_Q1_TASK`, `SET_Q3_HESITATION`, `NEXT_STEP`, `PREVIOUS_STEP`, `RESET_STATE`).
- **Session Storage Persistence**: Verifies serialization to `pathless_intake_v2`, recovery on hydration, and clean purge upon `RESET_STATE`.

---

## 12. Acceptance Criteria & Traceability Matrix

| ID | Criterion Statement | Implementing Components & Files | Verification Test |
| :--- | :--- | :--- | :--- |
| **AC-INTAKE-01** | Welcome screen renders at Step 0, introduces the PathLess Guide with zero technical jargon, requires non-empty Full Name and Grade Level before proceeding, and treats Student ID as an optional opaque string. | `src/components/intake/WelcomeProfileStep.tsx`, `src/context/IntakeContext.tsx`, `src/content/guideCopy.ts` | `tests/unit/intakeStateMachine.test.ts` (`describe('Step 0 Profile Validation')`) |
| **AC-INTAKE-02** | Questionnaire delivers an 8-to-10 question intake sequence assessing concrete day-to-day task preferences, work settings, and academic tolerances with single-question view navigation and active progress tracking. | `src/components/intake/IntakeWizardContainer.tsx`, `src/components/intake/QuestionStepView.tsx`, `src/content/guideCopy.ts` | `tests/unit/intakeStateMachine.test.ts` (`describe('10-Question Validation Engine')`) |
| **AC-INTAKE-03** | Intake state machine validates each step, manages sequential forward and backward navigation through the final question, and persists transient state cleanly in sessionStorage. | `src/context/IntakeContext.tsx`, `src/hooks/useWizardSession.ts` | `tests/unit/intakeStateMachine.test.ts` (`describe('Navigation & Session Persistence')`) |
| **AC-INTAKE-04** | TypeScript contracts in `src/types/` enforce `StudentProfile`, updated 8-to-10 question answer types, and remove all references to legacy triage, counselor, and dossier naming. | `src/types/intake.ts`, `src/types/career.ts`, `src/types/api.ts` | `tests/unit/intakeContracts.test.ts` (`describe('Contracts & Terminology Purge')`) |
| **AC-INTAKE-05** | 100% of user-facing strings across Step 0 and all intake questions reside in `src/content/guideCopy.ts`, adhering to an 8th-to-12th grade reading level with calm, reassuring phrasing. | `src/content/guideCopy.ts` | `tests/unit/intakeContracts.test.ts` (`describe('Centralized Guide Copy Integrity')`) |

---

## 13. Summary of Files to Touch During Implementation

When proceeding to code implementation, the following files will be created or updated in accordance with this contract:

1. `src/types/intake.ts`: Define `StudentProfile`, `GradeLevel`, `IntakeAnswers`, `IntakeState`, `IntakeAction`, and `IntakeContextValue`.
2. `src/types/career.ts`: Define `PathwayCard`, `GuideSummary`, `GuideResult`, `AdvisorReview`, and remove legacy dossier/triage naming.
3. `src/types/api.ts`: Define `SubmissionPayload`, `GuideApiResponse`, and remove legacy triage route types.
4. `src/content/guideCopy.ts`: Author the complete centralized copy dictionary for Step 0 and Questions 1–10.
5. `src/context/IntakeContext.tsx`: Implement the 11-step (Step 0 to 10) state machine, validation engine, and session storage persistence.
6. `src/components/intake/IntakeWizardContainer.tsx`: Implement the wizard shell, progress indicator, and navigation footer.
7. `src/components/intake/WelcomeProfileStep.tsx`: Implement Step 0 Welcome and Student Profile onboarding view.
8. `src/components/intake/QuestionStepView.tsx`: Implement dynamic single-question renderer for Questions 1 through 10.
9. `src/types/index.ts`: Update barrel exports to export `./intake`, `./career`, and `./api`, purging obsolete `./counselor`.
10. `tests/unit/intakeContracts.test.ts`: Implement contract schemas, privacy enforcement, and forbidden terminology unit tests.
11. `tests/unit/intakeStateMachine.test.ts`: Implement step validation, navigation rules, and session persistence unit tests.
