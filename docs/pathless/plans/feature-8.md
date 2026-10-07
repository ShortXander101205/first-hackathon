---
doc: implementation-plan
feature: 8-rework-synthesis-and-results
project: PathLess - Framework v2
status: pending-approval
gate: HOLD
---

# Feature 8: Step-by-Step Implementation Plan
## Synthesis Service and Results UI Rework — Phased Architecture & Execution Blueprint

This implementation plan defines the phased, sequential execution blueprint for **Feature 8: Synthesis Service and Results UI Rework** on branch `feature/8-rework-synthesis-and-results`, implementing the specifications finalized in the approved technical contract ([docs/pathless/contracts/feature-8.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-8.md)).

---

## 1. Overview of Execution Strategy

Feature 8 builds directly on the foundations established in Branches 1 through 7 (most notably Feature 7's 10-question intake wizard and sanitized student profile contracts). It modernizes the backend AI synthesis pipeline and client-side results presentation layer, replacing the legacy v1 PathwayAI prototype with the calm, progressive disclosure architecture of **PathLess Guide v2**.

The implementation is structured into **7 ordered, testable phases** to guarantee continuous build health, strict WCAG 2.1 AA accessibility, and zero regression:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PHASED EXECUTION PIPELINE                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Core TypeScript Contracts & Schema Calibration                                          │
│          - Update src/types/career.ts and src/types/api.ts                                       │
│          - Update src/ai/response-schema.json and src/schemas/career.schema.ts                   │
│          - Enforce PathwayCard, GuideResult, word count bounds (<= 30 overview, <= 65 study path)│
│                                    ↓                                                             │
│ Phase 2: Centralized Results Copy Definitions (`src/content/guideCopy.ts`)                       │
│          - Author RESULTS_COPY dictionary for header, cards, where to study, print, clear, a11y  │
│          - Enforce 8th-to-12th grade reading level, calm tone, zero technical/AI system jargon  │
│          - 100% eradicate legacy tokens (dossier, PathwayAI, Triage, Counselor)                  │
│                                    ↓                                                             │
│ Phase 3: Backend AI Synthesis Service, Grounded Prompts & Resilient Mock Fallback                │
│          - Create src/app/api/guide/route.ts (migrated from legacy /api/triage)                  │
│          - Implement PATHLESS_SYSTEM_PROMPT & buildGuideUserPrompt in src/lib/ai/prompts.ts      │
│          - Implement getMockGuideRecommendations in src/lib/ai/mockFallback.ts                   │
│          - Update src/lib/gemini.ts to call Gemini 2.5 Flash with response-schema.json           │
│          - Enforce RFC 7807 Problem Details with zero technical terms in client error responses  │
│                                    ↓                                                             │
│ Phase 4: Client Synthesis Hook (`src/hooks/useGuideSynthesis.ts`)                                │
│          - Implement useGuideSynthesis hook managing fetch, state, and abort controller          │
│          - Purge legacy useTriageSynthesis hook and update src/hooks/index.ts                    │
│                                    ↓                                                             │
│ Phase 5: Where to Study Shell & Presentational Modules                                           │
│          - Build src/components/results/WhereToStudySection.tsx (React.memo, static shell)       │
│          - Build src/components/results/ResultsHeader.tsx (h1, archetype, advisory disclaimer)   │
│          - Build src/components/results/ResultsFooter.tsx (print/PDF & clear confirmation)       │
│                                    ↓                                                             │
│ Phase 6: Progressive Results Container & Career Match Card with Native Print Optimization        │
│          - Build src/components/results/CareerMatchCard.tsx (collapsed/expanded states)          │
│          - Build src/components/results/ResultsContainer.tsx (4 cards collapsed on initial load) │
│          - Implement DOM persistence rule (hidden print:block) in src/app/globals.css            │
│          - Create src/components/results/index.ts barrel exports                                 │
│                                    ↓                                                             │
│ Phase 7: Verification, Automated Testing & Acceptance Criteria Quality Gate                      │
│          - Implement tests/unit/resultsCopy.test.ts (copy structure, jargon & terminology scan)  │
│          - Implement tests/unit/resultsComponents.test.ts (collapsed/expanded rendering, a11y)  │
│          - Implement tests/integration/guideSynthesis.test.ts (route handler, status codes, mock)│
│          - Execute: npm test, npm run type-check, npm run lint, npm run build                    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. File Change Inventory

```
┌───────────────────────────────────────────────┬────────────┬────────────────────────────────────────────────────────┐
│ File Path                                     │ Action     │ Primary Purpose                                        │
├───────────────────────────────────────────────┼────────────┼────────────────────────────────────────────────────────┤
│ src/types/career.ts                           │ Modify     │ Define PathwayCard, GuideResult, TrialCourse, MatchTier│
│ src/types/api.ts                              │ Modify     │ Define SubmissionPayload, ProblemDetails, GuideApiResp │
│ src/ai/response-schema.json                   │ Modify     │ Gemini structured JSON schema for PathwayCard & tiers  │
│ src/schemas/career.schema.ts                  │ Modify     │ Zod runtime validation schemas for GuideResult & cards │
│ src/content/guideCopy.ts                      │ Modify     │ Add RESULTS_COPY dictionary (header, card, actions)    │
│ src/lib/ai/prompts.ts                         │ Modify     │ Add PATHLESS_SYSTEM_PROMPT and buildGuideUserPrompt    │
│ src/lib/ai/mockFallback.ts                    │ Modify     │ Add getMockGuideRecommendations (curated 4 cards)      │
│ src/lib/gemini.ts                             │ Modify     │ Update synthesis execution for PathLess Guide prompt   │
│ src/app/api/guide/route.ts                    │ Create     │ POST /api/guide handler with RFC 7807 Problem Details  │
│ src/app/api/triage/route.ts                   │ Delete     │ Remove obsolete legacy triage route                    │
│ src/hooks/useGuideSynthesis.ts                │ Create     │ Client synthesis hook managing request & guideResult   │
│ src/hooks/useTriageSynthesis.ts               │ Delete     │ Remove obsolete legacy triage hook                     │
│ src/hooks/index.ts                            │ Modify     │ Export useGuideSynthesis, remove useTriageSynthesis    │
│ src/components/results/WhereToStudySection.tsx│ Create     │ Groundwork placeholder shell (React.memo, min-h-110px) │
│ src/components/results/ResultsHeader.tsx      │ Create     │ Page h1, exploratory advisory disclaimer, archetype    │
│ src/components/results/ResultsFooter.tsx      │ Create     │ Native print button & calm reset confirmation modal    │
│ src/components/results/CareerMatchCard.tsx    │ Create     │ Progressive disclosure card (collapsed/expanded states)│
│ src/components/results/ResultsContainer.tsx   │ Create     │ 4-card progressive disclosure manager (collapsed load) │
│ src/components/results/index.ts               │ Create     │ Barrel export for results presentation components      │
│ src/app/globals.css                           │ Modify     │ Add @media print styles with card expansion rules      │
│ tests/unit/resultsCopy.test.ts                │ Create     │ Unit tests for RESULTS_COPY & terminology scan         │
│ tests/unit/resultsComponents.test.ts          │ Create     │ Unit tests for ResultsContainer, Cards, WhereToStudy   │
│ tests/integration/guideSynthesis.test.ts      │ Create     │ Integration tests for /api/guide route handler         │
└───────────────────────────────────────────────┴────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. Phased Implementation Details

### Phase 1: Core TypeScript Contracts & Schema Calibration

**Objective**: Overhaul core TypeScript contracts in `src/types/career.ts` and `src/types/api.ts`, update `src/ai/response-schema.json`, and define runtime Zod schemas in `src/schemas/career.schema.ts` to enforce strict length limits ($\le 30$ words overview, $\le 65$ words study path and reassurance) and 4-tier output.

#### Exact Files
- **Modify**: `src/types/career.ts`
- **Modify**: `src/types/api.ts`
- **Modify**: `src/ai/response-schema.json`
- **Modify**: `src/schemas/career.schema.ts`

#### Key Interfaces & Schemas
```typescript
// src/types/career.ts
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
  searchQuery?: string;
}

export interface PathwayCard {
  id: string;
  roleTitle: string;
  broadField: string;
  matchTier: MatchTier;
  fitScore: number;
  overview: string;           // 1 sentence, strictly <= 30 words
  dailyTasks: string[];       // 3 to 4 concrete operational tasks
  studyPath: string;          // Coursework topics, strictly <= 65 words
  reassurance: string;        // Academic friction mitigation, strictly <= 65 words
  majors: string[];           // 2 to 3 related college majors
  minors?: string[];
  trialCourses: [TrialCourse, TrialCourse]; // Exactly 2 free platform courses
  whereToStudyReady?: boolean;
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
  pathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard]; // Exactly 4 cards
  meta: GuideMeta;
}
```

```typescript
// src/schemas/career.schema.ts - Word count helper validators
const wordCount = (val: string) => val.trim().split(/\s+/).filter(Boolean).length;

export const pathwayCardSchema = z.object({
  id: z.string().min(1),
  roleTitle: z.string().min(1),
  broadField: z.string().min(1),
  matchTier: z.enum([
    'Primary Direct Match',
    'High-Growth Pathway',
    'Interdisciplinary Pivot',
    'Moonshot Trajectory',
  ]),
  fitScore: z.number().int().min(50).max(100),
  overview: z.string().refine((val) => wordCount(val) <= 30, {
    message: 'Overview must be 30 words or fewer',
  }),
  dailyTasks: z.array(z.string().min(1)).min(3).max(4),
  studyPath: z.string().refine((val) => wordCount(val) <= 65, {
    message: 'Study path must be 65 words or fewer',
  }),
  reassurance: z.string().refine((val) => wordCount(val) <= 65, {
    message: 'Reassurance must be 65 words or fewer',
  }),
  majors: z.array(z.string().min(1)).min(2),
  minors: z.array(z.string()).optional(),
  trialCourses: z.tuple([trialCourseSchema, trialCourseSchema]),
});
```

**Target Acceptance Criteria**: AC-RESULTS-01, AC-RESULTS-03, AC-RESULTS-05.

---

### Phase 2: Centralized Results Copy Definitions (`src/content/guideCopy.ts`)

**Objective**: Author the centralized results dictionary `RESULTS_COPY` in `src/content/guideCopy.ts`, written strictly at an 8th-to-12th grade reading level, containing zero architecture or AI system terms, and completely eliminating all forbidden legacy naming.

#### Exact Files
- **Modify**: `src/content/guideCopy.ts`

#### Key Sections in `RESULTS_COPY`
- `RESULTS_COPY.header`:
  - `badge`: `"Personalized Exploration Pathways"`
  - `defaultTitle`: `"Your Recommended Pathways"`
  - `personalizedTitle`: `(name: string) => `${name}'s Recommended Pathways``
  - `subtitle`: Calm introduction emphasizing that major choice is a flexible springboard.
  - `disclaimerTitle`: `"Advisory Guide Notice"`
  - `disclaimerBody`: Empathetic notice: `"These recommendations are starting points for conversation and discovery, not permanent life decisions. We encourage you to share and discuss these pathways with your school advisor, mentor, or trusted guide."` (strictly zero occurrences of `counselor`).
  - `archetypeLabel`: `"Your Discovery Profile"`
  - `demoModeNotice`: `"Sample pathways are shown for demonstration. Take your time exploring each option."` (zero occurrences of `AI synthesis` or internal system terms).
- `RESULTS_COPY.card`: Labels for daily tasks, foundational study path, trial courses, fit scores, and expandable toggle buttons.
- `RESULTS_COPY.tiers`: Reassuring taglines for all 4 match tiers.
- `RESULTS_COPY.whereToStudy`:
  - `title`: `"Where to Study"`
  - `badge`: `"Regional Pathways Coming Soon"`
  - `description`: Explaining that verified university listings are prepared by regional advisors.
  - `zeroHallucinationNote`: Confirming zero unverified AI university claims.
- `RESULTS_COPY.actions`:
  - `printButton`: `"Print or Save as PDF"`
  - `clearButton`: `"Start Over"`
  - `clearDialogTitle`: `"Start fresh with a clean slate?"`
  - `confirmClear`: `"Yes, start over"`
  - `cancelClear`: `"Keep my pathways"`
- `RESULTS_COPY.loading`: Calm progressive status messages with breathing reassurance.
- `RESULTS_COPY.error`: Non-technical, student-centered recovery options (`"Try Again"`, `"Review My Answers"`).
- `RESULTS_COPY.a11y`: Polite screen reader announcements for card expansion and results landmark.

**Target Acceptance Criteria**: AC-RESULTS-02, AC-RESULTS-04, AC-RESULTS-05.

---

### Phase 3: Backend AI Synthesis Service, Grounded Prompts & Resilient Mock Fallback

**Objective**: Migrate `/api/triage` to `/api/guide`, ground prompt generation in the expanded 10-question intake, enforce Gemini structured JSON response schema, implement high-fidelity curated mock fallback, and return RFC 7807 Problem Details containing zero internal technical jargon.

#### Exact Files
- **Create**: `src/app/api/guide/route.ts`
- **Delete**: `src/app/api/triage/route.ts`
- **Modify**: `src/lib/ai/prompts.ts`
- **Modify**: `src/lib/ai/mockFallback.ts`
- **Modify**: `src/lib/gemini.ts`
- **Create**: `tests/integration/guideSynthesis.test.ts`

#### Route Implementation Details
1. **Content-Type Guard**: Returns 415 with client-safe message if request is not `application/json`.
2. **Payload Size Guard**: Returns 413 if content exceeds 10 KB.
3. **Safe JSON Parse Guard**: Returns 400 Bad Request with non-technical explanation on JSON syntax errors.
4. **Zod Validation Guard**: Validates incoming `SubmissionPayload` with calm, non-technical field error pointers (no raw stack traces).
5. **Rate Limiting Guard**: Uses `checkRateLimit(clientIp)` (3 requests per minute per IP), returning 429 with `Retry-After`.
6. **Resilient Mock Fallback**:
   - If `GEMINI_API_KEY` is missing, blank, or placeholder (`dummy`, `test`, `your_gemini_api_key_here`), activates `getMockGuideRecommendations`.
   - Returns 200 OK with `fallbackUsed: true` and 4 fully grounded, distinct career concentrations satisfying all word limits.
7. **Gemini 2.5 Flash Synthesis**:
   - Calls `client.models.generateContent` with `PATHLESS_SYSTEM_PROMPT` and `buildGuideUserPrompt`.
   - Races against a 15,000ms timeout controller. Returns 504 on timeout.
   - Normalizes and validates output against `guideResultSchema`.
   - Sanitizes upstream errors: Returns 500 without leaking vendor API keys, stack traces, or model names.
8. **Immediate Route & Fallback Integration Testing**:
   - Implement and execute `tests/integration/guideSynthesis.test.ts` immediately upon completing the route and fallback engine.
   - Verify IT-GUIDE-01 through IT-GUIDE-09 (happy path, 415, 413, 400, 429, 504, 500 sanitization, mock fallback, and word limits) to lock in backend correctness BEFORE building any results UI components.

#### Prompt Grounding
- In `buildGuideUserPrompt(payload)`:
  - Isolates untrusted student input (`q3AcademicHesitation`) within `<student_thoughts>` tags.
  - Maps Q1 tasks, Q2 subject, Q4 work setting, Q5 problem solving, Q6 social energy, Q7 structure tolerance, Q8 academic friction, Q9 horizon priority, and Q10 post-college ambition.
  - Explicit directive: Prohibit synthesizing unverified university names, degree programs, regional university rankings, or unverified admissions criteria (such as GPA requirements, standardized test scores, or selective cutoffs).

**Target Acceptance Criteria**: AC-RESULTS-01, AC-RESULTS-04, AC-RESULTS-05.

---

### Phase 4: Client Synthesis Hook (`src/hooks/useGuideSynthesis.ts`)

**Objective**: Create the client data hook `useGuideSynthesis` to manage `/api/guide` synthesis requests, loading states, error handling, and state resets, cleanly purging legacy `useTriageSynthesis.ts`.

#### Exact Files
- **Create**: `src/hooks/useGuideSynthesis.ts`
- **Delete**: `src/hooks/useTriageSynthesis.ts`
- **Modify**: `src/hooks/index.ts`

#### Hook State & Operations
```typescript
export interface UseGuideSynthesisReturn {
  isLoading: boolean;
  guideResult: GuideResult | null;
  error: ProblemDetails | Error | null;
  fetchGuide: (payload: SubmissionPayload) => Promise<void>;
  resetGuide: () => void;
}
```
- Manages an in-flight `AbortController` to abort stale requests upon unmount or duplicate submissions.
- Handles RFC 7807 `ProblemDetails` error payloads gracefully.
- Provides `resetGuide` to cleanly clear result state when student triggers self-clearing.

**Target Acceptance Criteria**: AC-RESULTS-01, AC-RESULTS-02.

---

### Phase 5: Where to Study Shell & Presentational Modules

**Objective**: Create the isolated Where to Study shell component, the results page header, and the results footer actions with strict WCAG 2.1 AA compliance.

#### Exact Files
- **Create**: `src/components/results/WhereToStudySection.tsx`
- **Create**: `src/components/results/ResultsHeader.tsx`
- **Create**: `src/components/results/ResultsFooter.tsx`

#### Component Structure & Behaviors
1. **`WhereToStudySection.tsx`**:
   - Wrapped in `React.memo` to eliminate re-renders when parent card expansion state changes.
   - Contains container with `min-h-[110px]` and CSS `contain: content` to ensure **0.00 Cumulative Layout Shift (CLS)**.
   - Displays informational badge: `Regional Pathways Coming Soon`.
   - Explains that verified university curriculum mappings (including Thai universities under TCAS) are being prepared by university advisors.
   - Enforces zero AI hallucinations of university programs.
2. **`ResultsHeader.tsx`**:
   - Renders page-level `<h1>`: `"Your Recommended Pathways"` (or personalized with student name).
   - Renders exploratory advisory disclaimer callout box with calming styling.
   - Renders archetype banner showing the 3–5 word student archetype and narrative summary.
3. **`ResultsFooter.tsx`**:
   - Renders **Print or Save as PDF** button (`window.print()`).
   - Renders **Start Over** button with calm confirmation dialog (`clearDialogTitle`, `confirmClear`).
   - Enforces minimum $44 \times 44$ pixel touch targets and visible focus rings (`focus-visible:ring-2 focus-visible:ring-edu-interactive`).

**Target Acceptance Criteria**: AC-RESULTS-02, AC-RESULTS-04, AC-RESULTS-05.

---

### Phase 6: Progressive Results Container & Career Match Card with Native Print Optimization

**Objective**: Implement the 4-card progressive disclosure layout, expandable cards with strict word bounds, native print styling with DOM persistence, and assemble the results presentation layer.

#### Exact Files
- **Create**: `src/components/results/CareerMatchCard.tsx`
- **Create**: `src/components/results/ResultsContainer.tsx`
- **Create**: `src/components/results/index.ts`
- **Modify**: `src/app/globals.css`

#### Progressive Disclosure & DOM Persistence Rule
- **Initial Load State**: `ResultsContainer` initializes with `expandedCardIds = new Set<string>()`. All 4 cards render in the **collapsed state**.
- **Card Expansion**: Tapping the card trigger toggles its ID in the set. Multiple cards can be expanded simultaneously.
- **State Isolation & Synthesis Preservation Guarantee**: Expanding or collapsing a card modifies only local UI state (`expandedCardIds`). It never calls `fetchGuide()` or triggers network activity, and because card details remain mounted in the DOM, existing card sub-component states and scroll positions are strictly preserved without wiping or re-fetching.
- **Card Header & Collapsed State**:
  - Semantic `<button>` trigger with `aria-expanded={isExpanded}` and `aria-controls={`card-details-${card.id}`}`.
  - Role title as `<h2>`, broad discipline badge, tier badge, alignment score badge.
  - Single-sentence overview strictly constrained to **30 words or fewer**.
- **Card Details & Expanded State**:
  - Daily operational tasks (3–4 concrete bullets).
  - Foundational study path strictly constrained to **65 words or fewer**.
  - Academic hurdle reassurance strictly constrained to **65 words or fewer**.
  - Related college majors tag list.
  - Exactly 2 zero-cost trial courses with provider badge and estimated hours.
  - Embedded `WhereToStudySection` shell.
- **Critical DOM Persistence for Print Fidelity**:
  - Card details **MUST NOT be conditionally unmounted** with `{isExpanded && <Details />}`.
  - All 4 card detail containers **remain permanently mounted in the DOM**, toggled via Tailwind:
    `className={clsx(isExpanded ? 'block' : 'hidden print:block')}`.
  - In `src/app/globals.css`:
    ```css
    @media print {
      body { background-color: #ffffff !important; }
      .no-print, button, [role="button"] { display: none !important; }
      article { break-inside: avoid; page-break-inside: avoid; border: 1px solid #cbd5e1 !important; box-shadow: none !important; }
    }
    ```
  - This guarantees that triggering `window.print()` prints all 4 expanded pathways completely, even if the student leaves cards collapsed on-screen.

**Target Acceptance Criteria**: AC-RESULTS-02, AC-RESULTS-03, AC-RESULTS-04.

---

### Phase 7: Verification, Automated Testing & Acceptance Criteria Quality Gate

**Objective**: Implement comprehensive unit and integration test suites, verifying contracts, word limits, DOM persistence, a11y attributes, route status codes, mock fallbacks, and zero forbidden terminology.

#### Exact Files
- **Create**: `tests/unit/resultsCopy.test.ts`
- **Create**: `tests/unit/resultsComponents.test.ts`
- **Create**: `tests/integration/guideSynthesis.test.ts`

#### Test Suite Specifications
1. **`tests/unit/resultsCopy.test.ts`**:
   - Verifies structure of `RESULTS_COPY` (all keys non-empty strings).
   - Forbidden terminology scanner: Asserts zero occurrences of `dossier`, `pathwayai`, `triage`, or `counselor` across `RESULTS_COPY`.
   - Zero technical jargon scanner: Asserts zero occurrences of `LLM`, `model`, `prompt`, `tokens`, `schema`, `JSON`, `RFC`, `endpoint`, `AI synthesis`.
   - Word count bounds verification on mock fixtures: Asserts overviews $\le 30$ words and study paths $\le 65$ words.
2. **`tests/unit/resultsComponents.test.ts`**:
   - `ResultsHeader`: Verifies `<h1>`, archetype, and advisory disclaimer.
   - `CareerMatchCard` (Collapsed): Verifies role title, broad field, 30-word overview, tier, score, and `aria-expanded="false"`.
   - `CareerMatchCard` (Expanded): Verifies daily tasks, study path ($\le 65$ words), reassurance, trial courses, and `aria-expanded="true"`.
   - `CareerMatchCard` (DOM Persistence): Verifies details container has `hidden print:block` when collapsed.
   - `WhereToStudySection`: Verifies placeholder badge and absence of hallucinated universities.
   - `ResultsFooter`: Verifies Print and Start Over touch targets ($\ge 44 \times 44$ px) and focus rings.
   - `ResultsContainer`: Verifies all 4 cards initialize collapsed.
3. **`tests/integration/guideSynthesis.test.ts`**:
   - `IT-GUIDE-01`: 200 OK happy path with mocked Gemini client returning 4 distinct concentrations.
   - `IT-GUIDE-02`: 415 Unsupported Media Type on non-JSON request.
   - `IT-GUIDE-03`: 413 Payload Too Large on $> 10$ KB payload.
   - `IT-GUIDE-04`: 400 Bad Request on invalid fields with calm client error guidance.
   - `IT-GUIDE-05`: 429 Too Many Requests on burst limit with `Retry-After`.
   - `IT-GUIDE-06`: 504 Gateway Timeout on upstream delay.
   - `IT-GUIDE-07`: 500 Sanitization on upstream failure without secret leakage.
   - `IT-GUIDE-08`: Curated mock fallback returns 200 OK when `GEMINI_API_KEY` is omitted.
   - `IT-GUIDE-09`: Output satisfies word limits ($\le 30$ overview, $\le 65$ study path).

#### Direct Verification Commands (from `package.json`)
```bash
# 1. Run all unit and integration tests
npm test

# 2. Strict TypeScript type check (zero errors)
npm run type-check

# 3. Next.js ESLint validation
npm run lint

# 4. Next.js production build verification
npm run build
```

**Target Acceptance Criteria**: AC-RESULTS-01, AC-RESULTS-02, AC-RESULTS-03, AC-RESULTS-04, AC-RESULTS-05.

---

## 4. Traceability Matrix: Acceptance Criteria to Implementation Tasks

| Criterion ID | Criterion Summary | Implementing Components & Files | Implementing Phases | Verification Tests |
| :--- | :--- | :--- | :--- | :--- |
| **AC-RESULTS-01** | Synthesis service accepts expanded intake payload and returns 4 distinct career matches with specific sub-field concentrations grounded in task preferences, with resilient mock fallback when API key is absent. | `src/app/api/guide/route.ts`<br>`src/lib/gemini.ts`<br>`src/lib/ai/prompts.ts`<br>`src/lib/ai/mockFallback.ts` | Phase 1, Phase 3 | `tests/integration/guideSynthesis.test.ts`<br>(IT-GUIDE-01, IT-GUIDE-08) |
| **AC-RESULTS-02** | Results view renders calm header, exploratory advisory disclaimer, exactly 4 cards collapsed on load, print or save as PDF button, and clear submission button. | `ResultsContainer.tsx`<br>`ResultsHeader.tsx`<br>`ResultsFooter.tsx` | Phase 2, Phase 5, Phase 6 | `tests/unit/resultsComponents.test.ts`<br>(ResultsContainer, ResultsHeader, ResultsFooter) |
| **AC-RESULTS-03** | Each collapsed card displays role title, broad discipline, overview $\le 30$ words, expanding to reveal daily tasks, study paths $\le 65$ words, 2 free trial course suggestions, and Where to Study shell. | `CareerMatchCard.tsx`<br>`src/schemas/career.schema.ts` | Phase 1, Phase 6 | `tests/unit/resultsComponents.test.ts`<br>(CareerMatchCard collapsed & expanded) |
| **AC-RESULTS-04** | Where to Study section renders clean container with informational placeholder stating regional university pathways are coming soon, with zero AI hallucinations of university programs. | `WhereToStudySection.tsx` | Phase 5, Phase 6 | `tests/unit/resultsComponents.test.ts`<br>(WhereToStudySection) |
| **AC-RESULTS-05** | 100% of user-facing text resides in `src/content/guideCopy.ts` at an 8th-to-12th grade reading level, containing zero architecture or AI system terms and eliminating legacy naming. | `src/content/guideCopy.ts` | Phase 2 | `tests/unit/resultsCopy.test.ts`<br>(Centralized Copy & Terminology Scan) |

---

## 5. Risk Assessment & Architectural Boundary Safeguards

| Architectural Risk | Severity | Specific Mitigation in Implementation Plan |
| :--- | :--- | :--- |
| **DOM Print Blank Cards** | High | Mandate in Phase 6 that card details stay permanently mounted in DOM, using `className={clsx(isExpanded ? 'block' : 'hidden print:block')}`. |
| **AI Word Count Bloat** | High | Dual-tier enforcement: Instruct Gemini in `PATHLESS_SYSTEM_PROMPT` and enforce strictly with Zod `.refine()` in `pathwayCardSchema` before responding. |
| **University Hallucination** | Critical | Explicitly prohibit university names and admissions data in `PATHLESS_SYSTEM_PROMPT`; keep `WhereToStudySection` purely static. |
| **Scope Creep into Feature 9** | Medium | Do not add Thai university lookups or TCAS data in Feature 8. `WhereToStudySection` remains strictly a static placeholder shell. |
| **Scope Creep into Feature 10** | Medium | Do not persist submissions or results to PostgreSQL or Prisma in Feature 8. Keep data in memory and browser session state. |
| **Forbidden Term Regression** | High | Automated AST and string regex scanner in `tests/unit/resultsCopy.test.ts` fails CI if `dossier`, `triage`, `counselor`, or `pathwayai` appear. |

---

## 6. Execution Gate & Approval Request

This phased implementation plan is complete, structurally sound, and aligned with all specifications in [docs/pathless/contracts/feature-8.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-8.md).

> [!IMPORTANT]
> Execution is currently on hold. Implementation will commence only after your formal approval of this plan.
