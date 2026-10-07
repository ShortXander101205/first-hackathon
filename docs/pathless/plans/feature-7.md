---
doc: implementation-plan
feature: 7-rework-intake-and-contracts
project: PathLess - Framework v2
status: pending-approval
gate: HOLD
---

# Feature 7: Step-by-Step Implementation Plan
## Intake and Contracts Rework — Step 0 Onboarding, 10-Question Questionnaire & Type Contracts

This implementation plan defines the phased, sequential execution blueprint for **Feature 7: Intake and Contracts Rework** on branch `feature/7-rework-intake-and-contracts`, implementing the specifications finalized in the approved technical contract ([docs/pathless/contracts/feature-7.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-7.md)).

---

## 1. Overview of Execution Strategy

Feature 7 executes a forward architectural evolution from the legacy v1 PathwayAI prototype to the **PathLess Framework v2**. The implementation is organized into **7 ordered phases**, moving from foundational TypeScript data contracts and centralized copy to state machine logic, presentation components, page integration, and automated verification suites.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PHASED EXECUTION PIPELINE                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Core Type Contracts & Forbidden Terminology Purge                                       │
│          - Update src/types/intake.ts, career.ts, api.ts, index.ts                               │
│          - Enforce StudentProfile, IntakeAnswers, SubmissionPayload, GuideResult                 │
│          - Purge legacy naming: PathwayAI, Triage, Counselor, dossier                            │
│                                    ↓                                                             │
│ Phase 2: Centralized Guide Copy Contract (`src/content/guideCopy.ts`)                             │
│          - Author 100% of user-facing copy for Step 0 and all 10 questions                       │
│          - Enforce 8th-to-12th grade reading level, calm tone, zero technical jargon            │
│                                    ↓                                                             │
│ Phase 3: State Machine, Pure Validation Engine & Session Persistence                             │
│          - Update src/context/IntakeContext.tsx & src/hooks/useWizardSession.ts                  │
│          - Implement isStep0Valid through isStep10Valid and canAccessStep navigation guard       │
│          - Handle sessionStorage key 'pathless_intake_v2' with safe in-memory fallback           │
│                                    ↓                                                             │
│ Phase 4: Step 0 Welcome & Student Profile Component                                             │
│          - Build src/components/intake/WelcomeProfileStep.tsx                                    │
│          - Implement Full Name & Grade Level required validation, optional Student ID            │
│          - Enforce zero collection of email/phone/password, 44x44px touch targets                │
│                                    ↓                                                             │
│ Phase 5: Dynamic Question Step View Component                                                   │
│          - Build src/components/intake/QuestionStepView.tsx                                      │
│          - Multi-select task chips (Q1), single-select radio cards (Q2, Q4-Q10), textarea (Q3)   │
│          - Accessible roles, roving tabindex, visible focus rings, character counter             │
│                                    ↓                                                             │
│ Phase 6: Wizard Step Manager & Home Page Integration                                             │
│          - Build src/components/intake/IntakeWizardContainer.tsx                                │
│          - Progress tracking, polite aria-live announcements, navigation footer                  │
│          - Wire src/app/page.tsx to render new v2 wizard                                         │
│                                    ↓                                                             │
│ Phase 7: Verification, Unit Testing & Acceptance Criteria Quality Gate                           │
│          - Implement tests/unit/intakeContracts.test.ts (schemas, privacy, forbidden tokens)    │
│          - Implement tests/unit/intakeStateMachine.test.ts (validation, guards, persistence)     │
│          - Execute npm test, npm run type-check, npm run lint, npm run build                     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. File Change Inventory

```
┌───────────────────────────────────────────────┬────────────┬────────────────────────────────────────────────────────┐
│ File Path                                     │ Action     │ Primary Purpose                                        │
├───────────────────────────────────────────────┼────────────┼────────────────────────────────────────────────────────┤
│ src/types/intake.ts                           │ Modify     │ Define StudentProfile, 10-Q IntakeAnswers, state/action│
│ src/types/career.ts                           │ Modify     │ Define PathwayCard, GuideSummary, GuideResult          │
│ src/types/api.ts                              │ Modify     │ Define SubmissionPayload, GuideApiResponse, Problem    │
│ src/types/index.ts                            │ Modify     │ Barrel export updated types; purge ./counselor         │
│ src/types/counselor.ts                        │ Delete     │ Purge obsolete legacy counselor contract file          │
│ src/content/guideCopy.ts                      │ Create     │ 100% centralized guide copy (Step 0 + Q1-Q10)          │
│ src/hooks/useWizardSession.ts                 │ Modify     │ Transient sessionStorage manager ('pathless_intake_v2')│
│ src/context/IntakeContext.tsx                 │ Modify     │ 11-step reducer, pure validators, canAccessStep guard  │
│ src/components/intake/WelcomeProfileStep.tsx   │ Create     │ Step 0 Welcome and Student Profile onboarding view     │
│ src/components/intake/QuestionStepView.tsx    │ Create     │ Dynamic question presenter (chips, radios, textarea)   │
│ src/components/intake/IntakeWizardContainer.tsx│ Create    │ Step manager, progress tracking, accessible aria-live  │
│ src/app/page.tsx                              │ Modify     │ Wire IntakeWizardContainer to root exploration view    │
│ tests/unit/intakeContracts.test.ts            │ Create     │ Unit tests for contracts, privacy, forbidden terms     │
│ tests/unit/intakeStateMachine.test.ts         │ Create     │ Unit tests for Step 0-10 validation & navigation guards│
└───────────────────────────────────────────────┴────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. Phased Implementation Details

### Phase 1: Core Type Contracts & Forbidden Terminology Purge

**Objective**: Overhaul core TypeScript contracts to support the PathLess Framework v2 identity, capturing required student profile data while enforcing zero collection of email/phone/password and eradicating all legacy terms (`PathwayAI`, `Triage`, `Counselor`, `dossier`).

#### Exact Files
- **Modify**: `src/types/intake.ts`
- **Modify**: `src/types/career.ts`
- **Modify**: `src/types/api.ts`
- **Modify**: `src/types/index.ts`
- **Delete**: `src/types/counselor.ts`

#### Key Interfaces & Types
```typescript
// src/types/intake.ts

export type GradeLevel =
  | 'grade_10'
  | 'grade_11'
  | 'grade_12'
  | 'college_freshman'
  | 'college_sophomore';

export interface StudentProfile {
  fullName: string;        // 1 to 100 chars, trimmed (Required)
  gradeLevel: GradeLevel;  // Educational level (Required)
  studentId?: string;      // Opaque string, max 64 chars (Optional)
}

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
  q1TaskIds: string[];
  q2SubjectId: string;
  q3AcademicHesitation: string;
  q4Environment: WorkEnvironment;
  q5ProblemSolving: ProblemSolvingStyle;
  q6SocialEnergy: SocialEnergyStyle;
  q7StructureTolerance: StructureTolerance;
  q8AcademicFriction: FrictionTolerance;
  q9HorizonPriority: HorizonPriority;
  q10PostCollegeAmbition: AmbitionTimeline;
}

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
```

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
  pathways: PathwayCard[];
  meta: GuideMeta;
}

// Type placeholder for future Advisor Dashboard (Feature 10)
export interface AdvisorReview {
  id: string;
  submissionId: string;
  advisorName: string;
  status: 'PENDING' | 'REVIEWED' | 'DISCUSSED';
  notes: string;
  updatedAt: string;
}
```

```typescript
// src/types/api.ts
import { StudentProfile, IntakeAnswers } from './intake';
import { GuideResult } from './career';

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

```typescript
// src/types/index.ts
export * from './intake';
export * from './career';
export * from './api';
```

**Target Acceptance Criteria**: AC-INTAKE-04.

---

### Phase 2: Centralized Guide Copy Contract (`src/content/guideCopy.ts`)

**Objective**: Establish a single source of truth for 100% of user-facing strings across Step 0 and all 10 intake questions, adhering strictly to an 8th-to-12th grade reading level with calm, reassuring phrasing.

#### Exact Files
- **Create**: `src/content/guideCopy.ts`

#### Key Structure & Copy Sections
- `GUIDE_COPY.brand`: PathLess name, taglines, guide titles.
- `GUIDE_COPY.shell`: Badges, progress label generator, reassurance notices.
- `GUIDE_COPY.welcome`:
  - Heading: *"Find Your Direction Without the Anxiety"*
  - Subheading: Explains PathLess Guide without technical jargon.
  - Privacy Promise: Explicitly confirms zero collection of email, phone, or passwords.
  - Field labels, placeholders, helper text, grade level options.
  - CTA Button: *"Begin PathLess Guide"*
- `GUIDE_COPY.questions.q1` through `q10`:
  - Q1: Tasks & energy (multi-select, max 2 selections).
  - Q2: Academic subject curiosity (6 subject cards with badges).
  - Q3: Academic dread & hesitation (200-char max textarea with counter).
  - Q4: Physical work setting (4 environment cards).
  - Q5: Problem-solving style (4 instinctive approach cards).
  - Q6: Social battery & collaboration (3 interaction style cards).
  - Q7: Structure vs. ambiguity (3 workflow routine cards).
  - Q8: Academic demand friction (5 academic stress boundary cards).
  - Q9: Life & career driver (5 peace-of-mind horizon cards).
  - Q10: Immediate post-college next chapter (3 timeline options).
- `GUIDE_COPY.navigation`: Previous, Continue, Finish & Explore Pathways, disabled notices.
- `GUIDE_COPY.validation`: Inline validation error copy for all steps.
- `GUIDE_COPY.resetDialog`: Reassuring, non-punitive reset confirmation dialog text.
- `GUIDE_COPY.a11y`: ARIA announcements for step transitions and character milestones.

**Target Acceptance Criteria**: AC-INTAKE-05.

---

### Phase 3: State Machine, Pure Validation Engine & Session Persistence

**Objective**: Implement deterministic state management in `src/context/IntakeContext.tsx` supporting Steps 0 through 10, linear forward navigation guards, unrestricted backward navigation, and safe transient `sessionStorage` synchronization.

#### Exact Files
- **Modify**: `src/hooks/useWizardSession.ts`
- **Modify**: `src/context/IntakeContext.tsx`

#### State Machine Definition
```typescript
export interface IntakeState {
  currentStep: WizardStep;                  // 0..10
  profile: StudentProfile;                 // Step 0 data
  answers: Partial<IntakeAnswers>;          // Steps 1..10 data
  validationErrors: IntakeValidationErrors; // Field-level errors
  isResetDialogOpen: boolean;
  isCompleted: boolean;
  isHydrated: boolean;
}
```

#### Pure Validation Functions
- `isStep0Valid(profile)`: Requires non-empty `fullName` ($\ge 1$, $\le 100$ chars) and valid `gradeLevel`; allows empty `studentId` or string $\le 64$ chars.
- `isStep1Valid(answers)`: Requires 1 to 2 distinct non-empty task IDs.
- `isStep2Valid(answers)`: Requires non-empty `q2SubjectId`.
- `isStep3Valid(answers)`: Requires non-empty `q3AcademicHesitation` ($\ge 1$, $\le 200$ chars).
- `isStep4Valid(answers)`: Requires valid `WorkEnvironment` enum.
- `isStep5Valid(answers)`: Requires valid `ProblemSolvingStyle` enum.
- `isStep6Valid(answers)`: Requires valid `SocialEnergyStyle` enum.
- `isStep7Valid(answers)`: Requires valid `StructureTolerance` enum.
- `isStep8Valid(answers)`: Requires valid `FrictionTolerance` enum.
- `isStep9Valid(answers)`: Requires valid `HorizonPriority` enum.
- `isStep10Valid(answers)`: Requires valid `AmbitionTimeline` enum.
- `validateStep(step, profile, answers)`: Central dispatch validator.
- `canAccessStep(targetStep, currentStep, profile, answers)`:
  - Step 0 always accessible.
  - Backward navigation (`targetStep <= currentStep`) always allowed.
  - Cannot skip forward $> currentStep + 1$.
  - Forward transition requires all prior steps ($0$ to $targetStep - 1$) to be valid.

#### Storage Adapter Update (`src/hooks/useWizardSession.ts`)
- Storage key: `pathless_intake_v2`.
- Hydration check: Purges legacy `pathway_ai_wizard_state` on detection.
- Safe serialization with in-memory fallback for private browsing mode.

**Target Acceptance Criteria**: AC-INTAKE-01, AC-INTAKE-02, AC-INTAKE-03.

---

### Phase 4: Step 0 Welcome and Student Profile Component

**Objective**: Create the Step 0 presentation component to welcome the student, explain the PathLess Guide with zero jargon, communicate privacy assurances, and capture required name and grade level.

#### Exact Files
- **Create**: `src/components/intake/WelcomeProfileStep.tsx`

#### Component Structure & Behaviors
- **Hero Banner**: Zero-pressure exploration badge, calm title and subtitle.
- **Privacy Assurance Box**: Visually distinct callout reassuring students that email, phone, and passwords are never collected.
- **Form Controls**:
  - `fullName`: `<input id="student-full-name" autoComplete="name" maxLength={100} ... />` with explicit `<label htmlFor="student-full-name">`. Inline error with `role="alert"` and `aria-describedby="full-name-error"`.
  - `gradeLevel`: Accessible select dropdown or segmented control with `<label htmlFor="student-grade-level">`.
  - `studentId`: `<input id="student-id" autoComplete="off" maxLength={64} ... />` with `<label htmlFor="student-id">` and helper text explaining it is optional.
- **Action Button**: Primary CTA *"Begin PathLess Guide"* with minimum $44 \times 44$ px touch target, `focus-visible:ring-2 focus-visible:ring-edu-interactive`, disabled until Step 0 satisfies `isStep0Valid`.

**Target Acceptance Criteria**: AC-INTAKE-01.

---

### Phase 5: Dynamic Question Step View Component

**Objective**: Implement a dynamic, accessible presentation component for Questions 1 through 10, rendering the appropriate input modality while enforcing WCAG 2.1 AA accessibility.

#### Exact Files
- **Create**: `src/components/intake/QuestionStepView.tsx`

#### Component Modalities
1. **Multi-Select Task Chips (Q1 Tasks)**:
   - Container: `role="group"` with `aria-label`.
   - Option pills: `<button role="checkbox" aria-checked={isSelected} ... />`.
   - Enforces 1–2 selection limit; displays helpful selection counter.
2. **Single-Select Radio Cards (Q2, Q4, Q5, Q6, Q7, Q8, Q9, Q10)**:
   - Container: `role="radiogroup"` with `aria-labelledby`.
   - Option cards: `role="radio"`, `aria-checked={isSelected}`, roving tabindex (`tabIndex={isSelected ? 0 : -1}`).
   - Arrow keys navigate between options; Space/Enter selects.
   - Distinct selected visual styling with visible focus ring.
3. **Open Reflection Textarea (Q3 Hesitation & Dread)**:
   - `<textarea id="q3-hesitation" maxLength={200} ... />` with explicit `<label>`.
   - Live character counter (`aria-describedby="q3-char-counter"`).
   - Announces character milestones politely to screen readers.

**Target Acceptance Criteria**: AC-INTAKE-02.

---

### Phase 6: Wizard Step Manager & Home Page Integration

**Objective**: Assemble the complete wizard shell coordinating Step 0 through Step 10, manage progress tracking, provide screen reader announcements, and integrate the wizard into the main page.

#### Exact Files
- **Create**: `src/components/intake/IntakeWizardContainer.tsx`
- **Modify**: `src/app/page.tsx`

#### Step Manager Responsibilities
- **Header**: Displays PathLess branding and *"Start Over"* trigger.
- **Progress Tracking**:
  - Step 0 displays a welcoming badge.
  - Steps 1–10 render an accessible progress bar (`role="progressbar"`, `aria-valuenow={currentStep}`, `aria-valuemin={0}`, `aria-valuemax={10}`).
- **Screen Reader Live Region**: `<div aria-live="polite" aria-atomic="true" class="sr-only">` announcing step number and title upon navigation.
- **Stage Renderer**: Renders `<WelcomeProfileStep />` when `currentStep === 0`; renders `<QuestionStepView />` when `currentStep >= 1 && currentStep <= 10`.
- **Navigation Controls**:
  - Previous button: Hidden on Step 0, active on Steps 1–10. Minimum $44 \times 44$ px touch target.
  - Continue button: Renders *"Continue"* on Steps 0–9; renders *"Finish & Explore Pathways"* on Step 10. Automatically disabled if current step is invalid.
  - Reset modal: Accessible confirmation modal to clear answers and return to Step 0.
- **Page Wiring**: Update `src/app/page.tsx` to wrap `IntakeWizardContainer` within `IntakeProvider`.

**Target Acceptance Criteria**: AC-INTAKE-01, AC-INTAKE-02, AC-INTAKE-03.

---

### Phase 7: Verification, Unit Testing & Acceptance Criteria Quality Gate

**Objective**: Validate the entire Feature 7 implementation through comprehensive unit tests and automated verification scripts.

#### Exact Files
- **Create**: `tests/unit/intakeContracts.test.ts`
- **Create**: `tests/unit/intakeStateMachine.test.ts`

#### Unit Test Specifications
1. **`intakeContracts.test.ts`**:
   - Validates structure of `StudentProfile`, `IntakeAnswers`, `SubmissionPayload`, `GuideResult`.
   - Privacy test: Asserts `StudentProfile` contains zero `email`, `phone`, or `password` properties.
   - Forbidden terminology scanner: Parses `src/types/` and `src/content/guideCopy.ts`, asserting zero occurrences of `pathwayai`, `triage`, `counselor`, or `dossier`.
   - Copy completeness: Asserts 100% of copy strings in `GUIDE_COPY` are non-empty strings.
2. **`intakeStateMachine.test.ts`**:
   - Step 0 validation: Tests empty name, whitespace name, missing grade, valid student ID, and oversized student ID.
   - Steps 1–10 validation: Tests each question validator against valid, invalid, and boundary inputs.
   - Navigation guards: Tests `canAccessStep` to ensure illegal forward jumps are blocked while backward navigation is always permitted.
   - Reducer actions: Tests state updates across all actions (`SET_PROFILE`, `TOGGLE_Q1_TASK`, `NEXT_STEP`, `RESET_STATE`).
   - Session storage: Tests serialization and hydration using mock storage.

#### Verification Commands (from `package.json`)
```bash
# 1. Run all unit tests
npm test

# 2. Verify strict TypeScript compilation with zero errors
npm run type-check

# 3. Verify ESLint compliance
npm run lint

# 4. Verify Next.js production build bundle
npm run build
```

**Target Acceptance Criteria**: AC-INTAKE-01, AC-INTAKE-02, AC-INTAKE-03, AC-INTAKE-04, AC-INTAKE-05.

---

## 4. Traceability Matrix: Acceptance Criteria to Implementation Tasks

| Criterion ID | Criterion Summary | Primary Implementing Files | Verification Tests |
| :--- | :--- | :--- | :--- |
| **AC-INTAKE-01** | Step 0 Welcome & Profile screen introduces PathLess Guide, requires Full Name and Grade Level, treats Student ID as optional opaque string, zero email/phone/password. | `WelcomeProfileStep.tsx`<br>`IntakeContext.tsx`<br>`guideCopy.ts` | `tests/unit/intakeStateMachine.test.ts` (`Step 0 Profile Validation`) |
| **AC-INTAKE-02** | Questionnaire delivers 10-question sequence assessing concrete tasks, settings, and academic tolerances with single-question navigation and progress tracking. | `QuestionStepView.tsx`<br>`IntakeWizardContainer.tsx`<br>`guideCopy.ts` | `tests/unit/intakeStateMachine.test.ts` (`10-Question Validation Engine`) |
| **AC-INTAKE-03** | State machine validates each step, manages sequential forward/backward navigation, and persists state in sessionStorage (`pathless_intake_v2`). | `IntakeContext.tsx`<br>`useWizardSession.ts` | `tests/unit/intakeStateMachine.test.ts` (`Navigation & Session Persistence`) |
| **AC-INTAKE-04** | TypeScript contracts in `src/types/` enforce StudentProfile and updated answer types; 100% remove legacy triage, counselor, dossier, and PathwayAI naming. | `src/types/intake.ts`<br>`src/types/career.ts`<br>`src/types/api.ts`<br>`src/types/index.ts` | `tests/unit/intakeContracts.test.ts` (`Contracts & Terminology Purge`) |
| **AC-INTAKE-05** | 100% of user-facing strings across Step 0 and all intake questions reside in `src/content/guideCopy.ts` at an 8th-to-12th grade reading level. | `src/content/guideCopy.ts` | `tests/unit/intakeContracts.test.ts` (`Centralized Guide Copy Integrity`) |

---

## 5. Risk Assessment & Mitigation

| Potential Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Cross-Version Storage Collision** | High | Purge legacy keys (`pathway_ai_wizard_state`) during session hydration before mounting `pathless_intake_v2`. |
| **Accidental Autofill Leakage** | Medium | Specify `autoComplete="name"` for Full Name and `autoComplete="off"` for Student ID. |
| **Forbidden Term Regression** | High | Automated AST/regex scanner in `tests/unit/intakeContracts.test.ts` fails CI if forbidden tokens appear in contracts or copy. |
| **Downstream Feature Overlap** | Medium | Strictly freeze `SubmissionPayload` shape and defer all AI synthesis routes to Feature 8 and database schemas to Feature 10. |

---

## 6. Execution Gate & Approval Request

This implementation plan is complete and fully aligned with the approved technical contract.

> [!IMPORTANT]
> In accordance with project instructions, execution is paused. Code implementation will begin immediately upon your explicit approval of this plan.
