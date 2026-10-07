---
doc: implementation-plan
feature: 15-fixes-questions-and-admissions
project: PathLess - Framework v2
status: pending-approval
gate: PENDING
---

# Feature 15: Phased Step-by-Step Implementation Plan
## Fixes, Questions Refinement, and Admissions Guidance

This implementation plan defines the phased, sequential execution blueprint for **Feature 15: Fixes, Questions Refinement, and Admissions Guidance** on branch `feature/15-fixes-questions-and-admissions`. It operationalizes the approved technical contract ([docs/pathless/contracts/feature-15.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-15.md)) while incorporating the architectural review safeguards (safe test revalidation handling, backward-compatible Zod schema transformation, and deterministic catalog role selection).

---

## 1. Overview & Phased Architecture Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PHASED EXECUTION PIPELINE                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Core Bug Fixes & Resilient State Management                                            │
│          • Submissions cache revalidation via revalidatePath('/advisor') & safe test wrapper     │
│          • Cache-Control: no-store headers on GET /api/advisor/students                          │
│          • Client synthesis failure fallback card hardening (retry option, zero stack traces)   │
│          • "Not sure" exploratory weighting in prompt builder & mock fallback data               │
│                                    ↓                                                             │
│ Phase 2: Intake Expansion to 12 Questions (Grades 10–12 Context)                                 │
│          • Add Q3 (Study Track: Science-Math, Arts-Language, etc.) & Q9 (Practical Work Context)│
│          • Refine Q6 (Collaboration Style) & Q2 (add EXPLORATORY_OPEN option)                    │
│          • Update types, Zod schemas with backward-compatibility transform, and centralized copy │
│          • Progress counter updates (Question X of 12, aria-valuenow 0-12, landmark a11y)       │
│                                    ↓                                                             │
│ Phase 3: "Explore More Paths" Compact Results Component                                          │
│          • Implement deterministic selector getRelatedCatalogRoles in careerCatalog.ts           │
│          • Create src/components/results/ExploreMorePaths.tsx (2–4 related catalog roles)        │
│          • Mount ExploreMorePaths below the 4 primary cards in ResultsContainer.tsx              │
│          • Preserve 4-card locked print layout and @media print fidelity                         │
│                                    ↓                                                             │
│ Phase 4: Curated Flagship University Admission Track Guide                                       │
│          • Scaffold static dataset src/data/admissionRequirements.ts for 7 flagship institutions │
│          • High school track eligibility, verified portal links, last checked date, check badge │
│          • Create src/components/results/AdmissionTrackChecklist.tsx with annual round advisory  │
│          • Mount checklist inside WhereToStudySection.tsx (0% student GPAs, 0% AI cutoffs)       │
│                                    ↓                                                             │
│ Phase 5: Verification, Automated Testing & Quality Gate                                          │
│          • Unit test suite: tests/unit/intakeQuestions.test.ts                                   │
│          • Unit test suite: tests/unit/admissionRequirements.test.ts                             │
│          • Integration test suite: tests/integration/advisorRevalidation.test.ts                 │
│          • Full verification gate: type-check, lint, test, and production build                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. File Change Inventory

```
┌───────────────────────────────────────────────┬────────────┬────────────────────────────────────────────────────────┐
│ File Path                                     │ Action     │ Primary Purpose                                        │
├───────────────────────────────────────────────┼────────────┼────────────────────────────────────────────────────────┤
│ src/app/api/guide/route.ts                    │ Modify     │ Trigger revalidatePath('/advisor') defensively         │
│ src/app/api/advisor/students/route.ts         │ Modify     │ Add Cache-Control: no-store, must-revalidate headers    │
│ src/lib/ai/prompts.ts                         │ Modify     │ Add <student_exploration_signal> directive for prompts │
│ src/data/mockCareerResults.ts                 │ Modify     │ Return cross-domain 4-pack for EXPLORATORY_OPEN        │
│ src/types/intake.ts                           │ Modify     │ Add HighSchoolTrack, PracticalWorkContext, 12 steps    │
│ src/schemas/intake.schema.ts                  │ Modify     │ Dual-support Zod schema transform (legacy & 12-q)      │
│ src/content/intakeQuestions.ts                │ Modify     │ Expand to 12 questions with high school stream options │
│ src/content/guideCopy.ts                      │ Modify     │ Update counters (X of 12), step titles, admission copy │
│ src/components/intake/QuestionStepView.tsx    │ Modify     │ Render steps 1 through 12 cleanly                      │
│ src/components/intake/IntakeWizardContainer.tsx│ Modify    │ Update bounds (12 steps), harden calm error retry card │
│ src/components/intake/QuestionCard.tsx        │ Modify     │ Enforce min 44x44px touch targets & keyboard a11y      │
│ src/data/careerCatalog.ts                     │ Modify     │ Add getRelatedCatalogRoles deterministic selector      │
│ src/components/results/ExploreMorePaths.tsx   │ Create     │ Render 2–4 related roles from curated catalog          │
│ src/components/results/ResultsContainer.tsx   │ Modify     │ Mount ExploreMorePaths below the 4 primary cards       │
│ src/components/results/index.ts               │ Modify     │ Export ExploreMorePaths                                │
│ src/data/admissionRequirements.ts             │ Create     │ Static track eligibility for 7 flagship institutions   │
│ src/components/results/AdmissionTrackChecklist.tsx│ Create │ Interactive checklist, official portal link, advisory  │
│ src/components/results/WhereToStudySection.tsx│ Modify     │ Mount AdmissionTrackChecklist for matched universities │
│ tests/unit/intakeQuestions.test.ts            │ Create     │ Unit tests for 12 questions & "not sure" heuristics    │
│ tests/unit/admissionRequirements.test.ts      │ Create     │ Unit tests for 7 universities & checklist invariants   │
│ tests/integration/advisorRevalidation.test.ts │ Create     │ Integration tests for advisor revalidation (AC-FIX-01) │
└───────────────────────────────────────────────┴────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Implementation Phases

### Phase 1: Core Bug Fixes & Resilient State Management
**Target Acceptance Criteria**: `AC-FIX-01`, `AC-FIX-02`, `AC-FIX-04`

#### 1.1 Next.js Server Cache Revalidation for `/advisor`
- **Files to Modify**:
  - `src/app/api/guide/route.ts`
  - `src/app/api/advisor/students/route.ts`
- **Logic & Implementation**:
  - In `src/app/api/guide/route.ts`:
    Define a safe revalidation helper that prevents static generation store crashes in pure Node.js test runners (`tsx --test`):
    ```typescript
    import { revalidatePath } from 'next/cache';

    export type RevalidationHook = (path: string) => void;
    let customRevalidateHook: RevalidationHook | null = null;

    export function setRevalidateAdvisorHook(hook: RevalidationHook | null): void {
      customRevalidateHook = hook;
    }

    export function safeRevalidateAdvisorCache(): void {
      if (customRevalidateHook) {
        customRevalidateHook('/advisor');
        return;
      }
      if (process.env.NODE_ENV === 'test') {
        return;
      }
      try {
        revalidatePath('/advisor');
      } catch (err) {
        console.warn('[PathLess Guide Route] Cache revalidation non-fatal notice:', err);
      }
    }
    ```
    Invoke `safeRevalidateAdvisorCache()` immediately after `persistSubmissionSafely` completes in all execution paths (AI synthesis success, catalog fallback, and mock mode).
  - In `src/app/api/advisor/students/route.ts`:
    Attach HTTP response headers to prevent browser/proxy stale caching:
    ```typescript
    return NextResponse.json(
      { success: true, students: items },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        },
      }
    );
    ```

#### 1.2 Resilient Client Synthesis Error Fallback Card
- **Files to Modify**:
  - `src/components/intake/IntakeWizardContainer.tsx`
  - `src/content/guideCopy.ts`
- **UI State & Layout**:
  - In `src/components/intake/IntakeWizardContainer.tsx`, harden the failure view (`isCompleted && error && !guideResult`):
    - Container with `role="alert"` and `aria-live="polite"`.
    - Calm, non-punitive icon: soft amber reassurance badge.
    - Title: `RESULTS_COPY.error.title` (`"We hit a temporary bump"`).
    - Description: `RESULTS_COPY.error.description` (`"We were unable to assemble your pathways right now. Your answers are completely safe. Please try again in a few moments, or review your answers."`).
    - Primary Retry Button: `min-h-[44px] min-w-[44px]`, triggers `handleTriggerSynthesis()`.
    - Secondary Action Button: `min-h-[44px] min-w-[44px]`, calls `goToStep(1)` or `previousStep()`.
    - Zero technical jargon: suppress `error.message` if it contains code stacks, file paths, or HTTP numbers (`500`, `FetchError`).

#### 1.3 Exploratory "Not Sure" Weighting & Openness Signal
- **Files to Modify**:
  - `src/lib/ai/prompts.ts`
  - `src/data/mockCareerResults.ts`
- **Logic & Prompt Boundaries**:
  - In `src/lib/ai/prompts.ts`:
    In `buildGuideUserPrompt`, detect when `q2SubjectId === 'EXPLORATORY_OPEN'` or `answers.q3HighSchoolTrack === 'TRACK_EXPLORING'`. Inject:
    ```text
    <student_exploration_signal>
    The student has expressed openness and uncertainty ('Not Sure Yet').
    DO NOT default arbitrarily to a single technical field.
    Treat uncertainty as an openness signal: synthesize pathways spanning at least 3 distinct broad fields across the 8-field catalog (e.g., Design, Humanities, Healthcare, Business). Highlight versatile degree majors that keep options flexible and foster cross-disciplinary skills.
    </student_exploration_signal>
    ```
  - In `src/data/mockCareerResults.ts`:
    When `payload?.intakeAnswers?.q2SubjectId === 'EXPLORATORY_OPEN'`, synthesize:
    - Card 1: `UI/UX & Product Designer` (`Design & Creative Arts`) — Top Match
    - Card 2: `Data Analyst` (`Engineering & Technology`) — Top Match
    - Card 3: `Public Health Coordinator` (`Healthcare & Life Sciences`) — Explore Also
    - Card 4: `Technical Writer & Content Strategist` (`Communication & Humanities`) — Explore Also
    - Summary Archetype: `"The Interdisciplinary Explorer"`
    - Narrative: `"Because you are open to exploring multiple fields, your pathways bridge creative design, practical data analysis, and human-centered communication to keep your future flexible."`

---

### Phase 2: Expanding Intake to 12 Questions (Grades 10–12 Context)
**Target Acceptance Criteria**: `AC-FIX-03`, `AC-FIX-04`

#### 2.1 TypeScript Contracts & Backward-Compatible Zod Schema
- **Files to Modify**:
  - `src/types/intake.ts`
  - `src/schemas/intake.schema.ts`
- **Data Models**:
  - In `src/types/intake.ts`:
    ```typescript
    export type HighSchoolTrack =
      | 'SCIENCE_MATH'
      | 'ARTS_MATH'
      | 'ARTS_LANGUAGE'
      | 'VOCATIONAL_APPLIED'
      | 'TRACK_EXPLORING';

    export type PracticalWorkContext =
      | 'DIGITAL_TECH_PRODUCTS'
      | 'HEALTH_WELLNESS_CARE'
      | 'ENTERPRISE_GROWTH'
      | 'CREATIVE_MEDIA_STORYTELLING'
      | 'PUBLIC_GOOD_COMMUNITY';

    export type CollaborationStyle =
      | 'INDEPENDENT_DEEP_FOCUS'
      | 'BALANCED_TEAM'
      | 'HIGH_CONTACT_PEOPLE';

    export interface IntakeAnswers {
      q1TaskIds: string[];                        // 1-2 natural daily tasks
      q2SubjectId: string;                        // Academic curiosity (or EXPLORATORY_OPEN)
      q3HighSchoolTrack: HighSchoolTrack;         // High school study track [NEW Q3]
      q4AcademicHesitation: string;               // Academic hesitation thought [NEW Q4]
      q5Environment: WorkEnvironment;             // Physical work setting [NEW Q5]
      q6CollaborationStyle: CollaborationStyle;   // Collaboration & team style [NEW Q6]
      q7ProblemSolving: ProblemSolvingStyle;      // Problem-solving modality [NEW Q7]
      q8StructureTolerance: StructureTolerance;    // Routine vs. autonomy [NEW Q8]
      q9WorkContext: PracticalWorkContext;        // Practical work context [NEW Q9]
      q10AcademicFriction: FrictionTolerance;      // Stress boundary to minimize [NEW Q10]
      q11HorizonPriority: HorizonPriority;        // Life & career driver [NEW Q11]
      q12PostCollegeAmbition: AmbitionTimeline;    // Next chapter horizon [NEW Q12]
    }

    export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    ```
  - In `src/schemas/intake.schema.ts`:
    Implement dual-support `.transform()` so existing 10-question test payloads validate without regressions:
    - `q3HighSchoolTrack` defaults to `'TRACK_EXPLORING'` if omitted.
    - `q4AcademicHesitation` falls back to `q3AcademicHesitation`.
    - `q9WorkContext` defaults to `'DIGITAL_TECH_PRODUCTS'` if omitted.
    - Fields map cleanly to internal state.

#### 2.2 Question Registry & Centralized Copy Updates
- **Files to Modify**:
  - `src/content/intakeQuestions.ts`
  - `src/content/guideCopy.ts`
- **Question Definitions (`INTAKE_QUESTIONS`)**:
  - `q1`: Tasks & Natural Energy (Multi-select, max 2).
  - `q2`: Academic Curiosity (Single-select, adds `EXPLORATORY_OPEN`: *"Not Sure Yet — Open to Exploring"*).
  - `q3`: High School Study Track (Single-select: `SCIENCE_MATH`, `ARTS_MATH`, `ARTS_LANGUAGE`, `VOCATIONAL_APPLIED`, `TRACK_EXPLORING`).
  - `q4`: Academic Hesitation & Worry (Free text, max 200 chars).
  - `q5`: Physical Work Environment (Quiet Digital Desk, Active Studio, Hands-on Lab/Outdoors, Community/Healthcare).
  - `q6`: Real-World Collaboration Style (Independent Focus, Small Project Team, People-First / Community-Facing).
  - `q7`: Problem-Solving Modality (Systematic Logic, Creative Brainstorming, Talking with Others, Learning by Doing).
  - `q8`: Daily Routine Preference (Clear Routine, Balanced Milestones, High Autonomy).
  - `q9`: Practical Work Context (Digital Systems, Life & Health, Enterprise Strategy, Creative Media, Public Good).
  - `q10`: Academic Friction to Minimize (Advanced Math, Public Speaking, Memorization, Long Essays, Pure Theory).
  - `q11`: Core Life Priority (Financial Stability, Purpose & Helping, Creative Freedom, Mastery, Work-Life Harmony).
  - `q12`: Post-College Next Chapter (Direct Workforce, Graduate Study, Flexible Project/Exploring).
- **Copy & Progress Counters (`GUIDE_COPY`)**:
  - `stepProgressLabel(current, 12)` -> `"Question {current} of 12"`
  - `stepPercentLabel(percent)` -> `"{percent}% Complete"`
  - `stepAnnouncement(current, 12, title)` -> `"Step {current} of 12: {title}"`
  - `stepTitles`: 0 through 12 mapped with clear plain-language labels.

#### 2.3 Wizard View & Step Navigation
- **Files to Modify**:
  - `src/components/intake/QuestionStepView.tsx`
  - `src/components/intake/IntakeWizardContainer.tsx`
  - `src/components/intake/QuestionCard.tsx`
- **Implementation**:
  - `QuestionStepView.tsx`: renders cases for `step === 1` through `step === 12`.
  - `IntakeWizardContainer.tsx`: updates progressbar bounds (`aria-valuemax={12}`, width calculation `(step / 12) * 100%`).
  - `QuestionCard.tsx`: preserves `min-h-[44px]` touch targets, keyboard navigation (Space/Enter to select, Tab to navigate), and visible focus rings.

---

### Phase 3: "Explore More Paths" Compact Results Component
**Target Acceptance Criteria**: `AC-FIX-05`

#### 3.1 Pure Deterministic Catalog Selector
- **Files to Modify**:
  - `src/data/careerCatalog.ts`
- **Implementation**:
  ```typescript
  export interface RelatedRoleItem {
    id: string;
    roleTitle: string;
    field: ApprovedField;
    summary: string;
    standardMajors: string[];
  }

  export function getRelatedCatalogRoles(
    primaryRoleTitles: string[],
    preferredFields: ApprovedField[] = [],
    count: number = 3
  ): RelatedRoleItem[] {
    const primarySet = new Set(primaryRoleTitles.map((t) => t.toLowerCase().trim()));
    const available = CAREER_CATALOG.filter(
      (entry) => !primarySet.has(entry.roleTitle.toLowerCase().trim())
    );

    // Prioritize roles matching preferred or adjacent fields
    const sorted = [...available].sort((a, b) => {
      const aPref = preferredFields.includes(a.field) ? 1 : 0;
      const bPref = preferredFields.includes(b.field) ? 1 : 0;
      return bPref - aPref;
    });

    return sorted.slice(0, Math.min(Math.max(count, 2), 4)).map((entry) => ({
      id: entry.id,
      roleTitle: entry.roleTitle,
      field: entry.field,
      summary: entry.dayInTheLifeSummary,
      standardMajors: entry.standardMajors.slice(0, 2),
    }));
  }
  ```

#### 3.2 ExploreMorePaths Component
- **Files to Create**:
  - `src/components/results/ExploreMorePaths.tsx`
- **Files to Modify**:
  - `src/components/results/ResultsContainer.tsx`
  - `src/components/results/index.ts`
- **Component Props & UI Layout**:
  ```typescript
  export interface ExploreMorePathsProps {
    relatedRoles: RelatedRoleItem[];
  }
  ```
  - Semantic `<section aria-labelledby="explore-more-heading">`.
  - Heading: `<h3 id="explore-more-heading">` with reassuring badge *"Complementary Directions"*.
  - Helper note: *"Curious about other directions? These complementary pathways from our curated catalog share similar strengths, without any pressure to decide right now."*
  - Card elements: Compact card displaying Role Title, Broad Field Badge, 1-sentence summary (`<= 30 words`), and key college majors.
  - Print layout: High-contrast typography, clean borders, page-break avoidance (`break-inside: avoid`).

---

### Phase 4: Curated Flagship University Admission Track Guide
**Target Acceptance Criteria**: `AC-FIX-06`

#### 4.1 Static Curated Admission Dataset
- **Files to Create**:
  - `src/data/admissionRequirements.ts`
- **Data Schema & Flagship Institutions**:
  ```typescript
  export type HighSchoolTrackEligibility =
    | 'Science-Math track'
    | 'Arts-Math or Science-Math track'
    | 'Arts-Language, Arts-Math, or Science-Math track'
    | 'Vocational or Applied Technology track'
    | 'Open to all tracks';

  export type AdmissionVerificationStatus = 'NEEDS_CHECKING' | 'VERIFIED';

  export interface AdmissionRequirementEntry {
    id: string;
    universityId: string;
    universityNameEn: string;
    universityNameTh: string;
    facultyNameEn: string;
    facultyNameTh: string;
    targetMajors: string[];
    trackEligibility: HighSchoolTrackEligibility;
    trackEligibilityTh: string;
    officialAdmissionsUrl: string;
    lastCheckedDate: string; // '2026-10-01'
    verificationStatus: AdmissionVerificationStatus; // 'NEEDS_CHECKING'
    advisoryNote: string;
    studentVerificationChecklist: string[];
  }
  ```
  - Curated records for 7 flagship institutions:
    1. Chulalongkorn University (`chulalongkorn`)
    2. King Mongkut's University of Technology Thonburi (`kmutt`)
    3. Mahidol University (`mahidol`)
    4. Kasetsart University (`kasetsart`)
    5. Thammasat University (`thammasat`)
    6. Chiang Mai University (`cmu`)
    7. Bangkok University (`bangkok-u`)
  - Pure lookup helper: `getAdmissionRequirementsByUniversityId(universityId: string): AdmissionRequirementEntry | undefined`.

#### 4.2 AdmissionTrackChecklist Component
- **Files to Create**:
  - `src/components/results/AdmissionTrackChecklist.tsx`
- **Files to Modify**:
  - `src/components/results/WhereToStudySection.tsx`
  - `src/content/guideCopy.ts`
- **UI Props & Accessibility**:
  ```typescript
  export interface AdmissionTrackChecklistProps {
    admissionEntry: AdmissionRequirementEntry;
  }
  ```
  - Track eligibility badge (e.g., `Science-Math track` or `Open to all tracks`).
  - Verified official portal link button (`min-h-[44px]`, `target="_blank"`, `rel="noopener noreferrer"`).
  - Badge: `"Needs Checking • Annual Audit"`.
  - Actionable student checklist:
    - Checkbox elements with accessible labels and `min-h-[44px]` touch targets.
    - Checkbox state is stored purely in client-side React component state (`useState`); **never** persisted to database or sent to backend.
  - Annual disclaimer notice:
    *"Admission criteria, required minimum science credits, and portfolio guidelines are determined independently by each university and change each TCAS round (Rounds 1–4). Always confirm current requirements directly on the university's official admissions portal."*
  - Strict guardrails: 0% GPA collection, 0% test score inputs, 0% AI hallucinated cutoff scores.

---

### Phase 5: Verification, Automated Testing & Quality Gate

#### 5.1 Test Suites to Author
1. `tests/integration/advisorRevalidation.test.ts` (NEW):
   - Asserts `safeRevalidateAdvisorCache()` is called upon `POST /api/guide`.
   - Asserts `GET /api/advisor/students` returns newly submitted students immediately and sets `Cache-Control: no-store, must-revalidate`.
2. `tests/unit/intakeQuestions.test.ts` (NEW):
   - Verifies 12-question sequence, options, and progress counters.
   - Verifies `EXPLORATORY_OPEN` triggers broad multi-domain synthesis across $\ge 3$ catalog fields.
   - Verifies Zod schema accepts both new 12-question and legacy 10-question payloads without errors.
3. `tests/unit/admissionRequirements.test.ts` (NEW):
   - Verifies all 7 flagship universities exist in `src/data/admissionRequirements.ts`.
   - Verifies all entries have `verificationStatus: 'NEEDS_CHECKING'`, official HTTPS portal URLs, and last-checked dates.
   - Strictly asserts zero GPA, GPAX, or test score fields in the data contracts.

#### 5.2 Verification Commands (Direct from package.json)
```bash
# 1. Static Type Checking
npm run type-check

# 2. Code Quality & Linting
npm run lint

# 3. Unit & Integration Test Suite
npm test

# 4. Production Next.js Build
npm run build
```

---

## 4. Acceptance Criteria Traceability Matrix

| Task / Component | Target Acceptance Criteria | Verification Target |
|:---|:---|:---|
| Advisor Cache Revalidation Handler | **AC-FIX-01** | `tests/integration/advisorRevalidation.test.ts` |
| Client Results Error Fallback Card | **AC-FIX-02** | `src/components/intake/IntakeWizardContainer.tsx` & tests |
| 12-Question Intake Sequence & Counters | **AC-FIX-03** | `tests/unit/intakeQuestions.test.ts` |
| "Not Sure" Exploratory Multi-Domain Spread | **AC-FIX-04** | `tests/unit/intakeQuestions.test.ts` & `tests/integration/guideSynthesis.test.ts` |
| "Explore More Paths" 2–4 Related Roles | **AC-FIX-05** | `src/components/results/ExploreMorePaths.tsx` & unit tests |
| Curated Admission Track Registry & Checklist | **AC-FIX-06** | `tests/unit/admissionRequirements.test.ts` |

---

## 5. Execution Preconditions
Execution will pause until explicit user confirmation is provided.
