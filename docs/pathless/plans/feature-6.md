---
doc: implementation-plan
feature: 6-dossier-card-ui
project: PathwayAI - College Major and Career Triage MVP
status: ready-for-execution
gate: PASS
---

# Feature 6: Step-by-Step Implementation Plan
## Recommendation Dossier UI, Career Cards, Reality Check & Synthesis Loading View

This implementation plan defines the sequential phases required to execute **Feature 6: Recommendation Dossier UI** on branch `feature/6-dossier-card-ui` in accordance with the approved technical contract ([docs/pathless/contracts/feature-6.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-6.md)).

---

## 1. Overview of Deliverables & Scaffolding Scope

Feature 6 bridges the server-side AI synthesis engine (`POST /api/triage`) finalized in Feature 5 with an empathetic, state-of-the-art presentation layer. It delivers a responsive **Recommendation Dossier** presenting **exactly 4 distinct career cards** (Primary Direct Match, High-Growth Pathway, Interdisciplinary Pivot, Moonshot Trajectory) in a 2x2 desktop grid and single-column mobile stack.

Each card features concrete day-to-day task realities contrasted against common student misconceptions, compassionate reassurance reframing acute academic dread, and exactly two zero-cost exploratory trial courses.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               PHASED EXECUTION PIPELINE                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Centralized Calm Copy Contract (`constants/dossierCopy.ts`)                   │
│          - 100% of user-facing strings, section titles, badges, and button labels       │
│          - Error recovery copy and screen reader announcement tokens                   │
│                                    ↓                                                   │
│ Phase 2: Core Sub-Section Components                                                   │
│          - RealityCheckSection (tasks vs. myth buster card)                            │
│          - CourseChallengeAndReassurance (academic hurdle & empathetic reassurance)    │
│          - TrialCoursesBadgeList (exactly 2 zero-cost exploratory pill badges)         │
│                                    ↓                                                   │
│ Phase 3: Primary Career Card & Resilience Banner                                       │
│          - CareerCard (tier headers, fit score badge, rationale, majors & minors)      │
│          - MockNoticeBanner (calm, non-stigmatizing banner when meta.fallback_used)    │
│                                    ↓                                                   │
│ Phase 4: Dynamic Status State & Action Footer                                          │
│          - SynthesisLoadingView (animated cycling reassurance, prefers-reduced-motion)│
│          - NavigationFooter (Start Over action triggering ResetConfirmationModal)      │
│                                    ↓                                                   │
│ Phase 5: Dossier Container Orchestrator & Barrel Exports                               │
│          - DossierContainer (2x2 desktop grid, 1-col mobile, archetype header)         │
│          - Export barrel in src/components/dossier/index.ts                            │
│                                    ↓                                                   │
│ Phase 6: Synthesis Hook & Home Page Integration                                        │
│          - Custom hook useTriageSynthesis (POST /api/triage lifecycle & error handling)│
│          - Wire IntakeWizardContainer in src/app/page.tsx to render Dossier/Loading    │
│          - Programmatic focus transfer to <h1> on dossier load                         │
│                                    ↓                                                   │
│ Phase 7: Verification, Focused Testing & Acceptance Criteria Gate                      │
│          - Unit tests for copy coverage, sub-sections, cards, and container            │
│          - Integration tests for intake completion -> loading -> dossier transition   │
│          - Full test suite, TypeScript check, and lint audit                           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Hierarchy & File Breakdown

```
src/
├── constants/
│   └── dossierCopy.ts                         # Phase 1: 100% centralized copy contract for Feature 6
├── components/
│   └── dossier/
│       ├── RealityCheckSection.tsx            # Phase 2: Daily tasks vs student misconceptions
│       ├── CourseChallengeAndReassurance.tsx  # Phase 2: Academic hurdle & empathetic reassurance
│       ├── TrialCoursesBadgeList.tsx          # Phase 2: Exactly 2 zero-cost trial course pill badges
│       ├── CareerCard.tsx                     # Phase 3: 4-tier card container, badges & sub-sections
│       ├── MockNoticeBanner.tsx               # Phase 3: Calm fallback notice banner (meta.fallback_used)
│       ├── SynthesisLoadingView.tsx           # Phase 4: Animated progressive reassurance loading state
│       ├── NavigationFooter.tsx               # Phase 4: Bottom footer with accessible Start Over action
│       ├── DossierContainer.tsx               # Phase 5: 2x2 grid orchestrator & student archetype header
│       └── index.ts                           # Phase 5: Dossier barrel exports
├── hooks/
│   ├── useTriageSynthesis.ts                  # Phase 6: Client hook managing POST /api/triage lifecycle
│   └── index.ts                               # Phase 6: Updated hooks barrel export
└── app/
    └── page.tsx                               # Phase 6: Connect wizard completion to synthesis & dossier

tests/
├── unit/
│   ├── dossierCopy.test.ts                    # Phase 7: Tests verifying copy structure, tone, and tokens
│   └── dossierComponents.test.ts              # Phase 7: Tests for sub-sections, cards, and container
└── integration/
    └── dossierIntegration.test.ts             # Phase 7: Tests for wizard-to-dossier flow & session reset
```

---

## 3. TypeScript Prop Interfaces Matching API Synthesis Payload

All components consume types directly from [`src/types/career.ts`](file:///d:/Hackathon/Beta_Folder/src/types/career.ts) and [`src/types/api.ts`](file:///d:/Hackathon/Beta_Folder/src/types/api.ts):

### 3.1 `DossierContainerProps`
```typescript
import type { CareerCard as CareerCardType, TriageSummary, TriageGenerationMeta } from '@/types/career';

export interface DossierContainerProps {
  summary: TriageSummary;
  careers: [CareerCardType, CareerCardType, CareerCardType, CareerCardType];
  meta: TriageGenerationMeta;
  studentNickname?: string;
  onStartOver: () => void;
}
```

### 3.2 `CareerCardProps`
```typescript
import type { CareerCard as CareerCardType } from '@/types/career';

export interface CareerCardProps {
  card: CareerCardType;
  index: number;
}
```

### 3.3 `RealityCheckSectionProps`
```typescript
import type { DayInTheLife } from '@/types/career';

export interface RealityCheckSectionProps {
  dayInTheLife?: DayInTheLife;
  dailyTasks?: string[];
}
```

### 3.4 `CourseChallengeAndReassuranceProps`
```typescript
export interface CourseChallengeAndReassuranceProps {
  challenge: string;
  reassurance: string;
}
```

### 3.5 `TrialCoursesBadgeListProps`
```typescript
import type { TrialCourse } from '@/types/career';

export interface TrialCoursesBadgeListProps {
  trialCourses: [TrialCourse, TrialCourse];
}
```

### 3.6 `SynthesisLoadingViewProps`
```typescript
export interface SynthesisLoadingViewProps {
  studentNickname?: string;
}
```

### 3.7 `MockNoticeBannerProps`
```typescript
export interface MockNoticeBannerProps {
  engine?: string;
}
```

### 3.8 `NavigationFooterProps`
```typescript
export interface NavigationFooterProps {
  onStartOver: () => void;
}
```

### 3.9 `UseTriageSynthesisReturn`
```typescript
import type { TriageSuccessResponse, ProblemDetails } from '@/types/api';
import type { IntakeAnswersState } from '@/types/intake';

export interface UseTriageSynthesisReturn {
  isLoading: boolean;
  dossier: TriageSuccessResponse | null;
  error: ProblemDetails | null;
  fetchDossier: (answers: IntakeAnswersState, studentNickname?: string) => Promise<void>;
  resetDossier: () => void;
}
```

---

## 4. Phased Implementation Steps & Acceptance Criteria Mapping

### Phase 1: Centralized Calm Copy Contract (`src/constants/dossierCopy.ts`)
- **Objective**: Define all strings, badges, section titles, error recovery labels, and screen reader announcements in a single file. Zero raw string literals in JSX.
- **Tone**: Calm, validating, non-judgmental, tailored for 17–19 year olds facing acute academic anxiety.
- **Contents**:
  - `header`: `badge`, `title(nickname)`, `subtitle`, `reassuranceNote`, `archetypeBadgeLabel`.
  - `tiers`: `primary`, `highGrowth`, `interdisciplinary`, `moonshot` labels, shortLabels, and taglines.
  - `card`: `fitScoreLabel(score)`, `fitScoreClarification`, `majorsLabel`, `minorsLabel`, `whyItFitsLabel`.
  - `realityCheck`: `title`, `tasksSubtitle`, `mythTitle`, `mythPrefix`, `realityPrefix`.
  - `academics`: `sectionTitle`, `challengeLabel`, `reassuranceLabel`.
  - `trialCourses`: `sectionTitle`, `sectionHelper`, `hoursBadge(hours)`, `zeroCostBadge`, `exploratoryTag`.
  - `loading`: `title`, `calmNote`, `ariaStatus`, `messages` array (5 progressive cycling phrases).
  - `mockNotice`: `badge`, `title`, `description`.
  - `footer`: `reassurance`, `startOverButton`, `startOverAriaLabel`.
  - `error`: `title`, `message`, `retryButton`, `editAnswersButton`.
  - `a11y`: `dossierLandmark`, `cardTierAnnouncement`, `fitScoreAnnouncement`, `dossierReadyAnnounce`.
- **Target Criterion**: **AC-DOSSIER-01**, **AC-DOSSIER-02**, **AC-DOSSIER-07**, **AC-DOSSIER-08**.

### Phase 2: Core Sub-Section Components
- **Step 2.1: `RealityCheckSection.tsx`**:
  - Render section header with `Icons.briefcase` and `DOSSIER_COPY.realityCheck.title`.
  - Render list of daily tasks ($\ge 3$) with `Icons.check` in emerald/blue accents.
  - Fallback logic: check `dayInTheLife?.tasks ?? dailyTasks ?? []`.
  - Render misconception callout card if `dayInTheLife?.misconceptions` has items.
  - Parse or format `"Myth:"` vs `"Reality:"` with bold semantic labels.
  - **Target Criterion**: **AC-DOSSIER-03**.
- **Step 2.2: `CourseChallengeAndReassurance.tsx`**:
  - Render two-tone callout container (`bg-reassurance-50 border border-reassurance-100 rounded-xl p-4`).
  - Top row: `Icons.academic` with `DOSSIER_COPY.academics.challengeLabel` and `challenge` text.
  - Bottom row: `Icons.verifiedCourse` with `DOSSIER_COPY.academics.reassuranceLabel` and `reassurance` prose.
  - **Target Criterion**: **AC-DOSSIER-04**.
- **Step 2.3: `TrialCoursesBadgeList.tsx`**:
  - Render section label with `Icons.duration` and `DOSSIER_COPY.trialCourses.sectionTitle`.
  - Render flex/grid stack of **exactly 2 exploratory course badges**.
  - Each badge displays: `title`, provider + duration tag (`Coursera • ~6 hrs`), concise description, and `DOSSIER_COPY.trialCourses.zeroCostBadge` ("100% Free / Zero Tuition").
  - Clear static exploratory card styling (no broken link affordance).
  - **Target Criterion**: **AC-DOSSIER-05**.

### Phase 3: Primary Career Card & Resilience Banner
- **Step 3.1: `CareerCard.tsx`**:
  - Implement tier-based visual palette:
    - `Primary Direct Match`: `bg-edu-blue-50/60 border-edu-blue-200 text-edu-blue-800` (`Icons.directMatch`).
    - `High-Growth Pathway`: `bg-growth-50/60 border-growth-200 text-growth-700` (`Icons.highGrowth`).
    - `Interdisciplinary Pivot`: `bg-purple-50/60 border-purple-200 text-purple-700` (`Icons.interdisciplinary`).
    - `Moonshot Trajectory`: `bg-amber-50/60 border-amber-200 text-amber-800` (`Icons.moonshot`).
  - Render header with tier badge on left, fit score badge on right (`DOSSIER_COPY.card.fitScoreLabel(fit_score)`).
  - Render `role_title` as `<h2>` in bold typography (`text-xl font-bold text-edu-slate-900`).
  - Render `fit_rationale` paragraph.
  - Render `majors` pill badges and `minors` pill badges (safely hiding minors row if empty).
  - Embed `<RealityCheckSection />`, `<CourseChallengeAndReassurance />`, and `<TrialCoursesBadgeList />`.
  - Apply `h-full flex flex-col justify-between` for equal-height desktop cards.
  - **Target Criterion**: **AC-DOSSIER-02**.
- **Step 3.2: `MockNoticeBanner.tsx`**:
  - Render inline informational banner (`bg-edu-blue-50 border border-edu-blue-200 text-edu-blue-900 rounded-xl p-4`).
  - Render `Icons.verifiedCourse` with `DOSSIER_COPY.mockNotice.title` and `description`.
  - Completely non-alarmist and supportive.
  - **Target Criterion**: **AC-DOSSIER-07**.

### Phase 4: Dynamic Status State & Action Footer
- **Step 4.1: `SynthesisLoadingView.tsx`**:
  - Centered card (`max-w-xl mx-auto py-12 px-6 text-center space-y-6`).
  - Pulsing animated icon container with `motion-safe:animate-pulse` and `motion-safe:animate-spin`.
  - Cycle through `DOSSIER_COPY.loading.messages` every 2.5s with subtle cross-fade.
  - Set `role="status"` and `aria-live="polite"` with static screen reader text to eliminate speech buffer queueing.
  - **Target Criterion**: **AC-DOSSIER-06**.
- **Step 4.2: `NavigationFooter.tsx`**:
  - Render separator border and flex layout (`border-t border-edu-slate-200 pt-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4`).
  - Render context note `DOSSIER_COPY.footer.reassurance`.
  - Render "Start Over" button with `Icons.reset`, minimum touch target $\ge 44 \times 44$ px, and keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:ring-offset-2`).
  - Click invokes `onStartOver`.
  - **Target Criterion**: **AC-DOSSIER-08**.

### Phase 5: Dossier Container Orchestrator & Barrel Exports
- **Step 5.1: `DossierContainer.tsx`**:
  - Render `<main aria-label={DOSSIER_COPY.a11y.dossierLandmark}>`.
  - Render `<MockNoticeBanner />` conditionally if `meta.fallback_used === true`.
  - Render Student Archetype Header:
    - Badge: `DOSSIER_COPY.header.badge`.
    - Heading `<h1>`: `DOSSIER_COPY.header.title(studentNickname)`.
    - Archetype Callout: `summary.student_archetype` with icon and `summary.triage_narrative`.
    - Reassurance Note: `DOSSIER_COPY.header.reassuranceNote`.
  - Render Responsive Grid:
    - `grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch`.
    - Render 4 `<CareerCard />` instances.
  - Render `<NavigationFooter onStartOver={onStartOver} />`.
  - **Target Criterion**: **AC-DOSSIER-01**.
- **Step 5.2: `src/components/dossier/index.ts`**:
  - Export all components cleanly.

### Phase 6: Synthesis Hook & Home Page Integration
- **Step 6.1: `useTriageSynthesis.ts`**:
  - Manage `isLoading`, `dossier`, `error`.
  - `fetchDossier(answers, studentNickname)`: POSTs to `/api/triage`, sets data or safe error.
  - `resetDossier()`: Clears `dossier` and `error` state.
- **Step 6.2: `src/app/page.tsx`**:
  - When `isCompleted === true` and no dossier loaded: trigger `fetchDossier`.
  - While `isLoading`: render `<SynthesisLoadingView />`.
  - When error occurs: render calm retry state with `DOSSIER_COPY.error`.
  - When dossier is available: render `<DossierContainer />`.
  - Wire `onStartOver`: open `ResetConfirmationModal`. On confirm: call `resetState()` AND `resetDossier()`.
  - Programmatic focus transfer to `<h1>` upon dossier render.
  - **Target Criterion**: **AC-DOSSIER-01**, **AC-DOSSIER-06**, **AC-DOSSIER-08**.

### Phase 7: Verification, Focused Testing & Acceptance Criteria Gate
- Create unit and integration tests using `node:test` and `tsx`.
- Verify full compliance with AC-DOSSIER-01 through AC-DOSSIER-08.
- Verify `npm test`, `npm run type-check`, and `npm run lint`.

---

## 5. Responsive Styling Mechanics (Tailwind CSS)

| Breakpoint | Classes | Visual Behavior |
|---|---|---|
| **Mobile (`< 640px`)** | `grid-cols-1 space-y-6 sm:space-y-8 px-4` | 1-column stack, full width cards, stacked trial course badges, 44px min touch targets. |
| **Tablet (`640px - 1023px`)** | `grid-cols-1 max-w-2xl mx-auto px-6` | Single-column centered cards with optimal line lengths for reading. |
| **Desktop (`$\ge 1024$px`)** | `lg:grid-cols-2 lg:gap-8 max-w-6xl mx-auto` | **Rigid 2x2 grid**, equal-height cards (`h-full flex flex-col justify-between`). |

---

## 6. Unit & Component Test Specifications

### 6.1 Copy Contract Tests (`tests/unit/dossierCopy.test.ts`)
1. Verifies that all expected keys exist in `DOSSIER_COPY` (`header`, `tiers`, `card`, `realityCheck`, `academics`, `trialCourses`, `loading`, `mockNotice`, `footer`, `error`, `a11y`).
2. Verifies dynamic title formatting with and without nickname.
3. Verifies that all 4 match tier keys are defined and non-empty.
4. Verifies loading messages array contains exactly 5 reassuring phrases.

### 6.2 Component Unit Tests (`tests/unit/dossierComponents.test.ts`)
Using `react-dom/server` (`renderToStaticMarkup`):
1. **`RealityCheckSection`**:
   - Renders 3+ daily tasks with check icons.
   - Renders misconception buster card when misconceptions exist.
   - Gracefully handles missing misconceptions.
2. **`CourseChallengeAndReassurance`**:
   - Renders academic hurdle text.
   - Renders reassuring guidance text.
3. **`TrialCoursesBadgeList`**:
   - Renders exactly 2 course badges.
   - Displays provider, estimated hours, and zero-cost badge.
4. **`CareerCard`**:
   - Renders role title, match tier badge, fit score badge, and rationale.
   - Renders majors and minors badges.
   - Applies correct tier-specific visual classes.
5. **`MockNoticeBanner`**:
   - Renders calm informational title and description.
6. **`SynthesisLoadingView`**:
   - Renders `role="status"` and `aria-live="polite"`.
   - Renders initial reassuring message.
7. **`NavigationFooter`**:
   - Renders Start Over button with $\ge 44$px touch target styling and focus rings.

### 6.3 Integration Tests (`tests/integration/dossierIntegration.test.ts`)
1. Verifies end-to-end payload transformation from `POST /api/triage` mock response into `<DossierContainer />`.
2. Verifies that fallback mock responses render `<MockNoticeBanner />`.
3. Verifies that Start Over resets state cleanly.

---

## 7. Exact Commands for Running Focused Component Tests

```bash
# 1. Run only Feature 6 Copy Contract Unit Tests
npx tsx --test tests/unit/dossierCopy.test.ts

# 2. Run only Feature 6 Component Rendering Unit Tests
npx tsx --test tests/unit/dossierComponents.test.ts

# 3. Run only Feature 6 Integration Tests
npx tsx --test tests/integration/dossierIntegration.test.ts

# 4. Run all Feature 6 tests together
npx tsx --test tests/unit/dossierCopy.test.ts tests/unit/dossierComponents.test.ts tests/integration/dossierIntegration.test.ts

# 5. Run complete test suite across all features (1-6)
npm test

# 6. Run TypeScript strict type verification
npm run type-check

# 7. Run ESLint code quality audit
npm run lint
```

---

## 8. Acceptance Criteria Verification Matrix

| AC ID | Description | Verification Method | Implementation Step |
|---|---|---|---|
| **AC-DOSSIER-01** | DossierContainer 2x2 Grid & Archetype Header | Static markup assertion & DOM classes | Step 5.1 |
| **AC-DOSSIER-02** | CareerCard 4 Tiers, Fit Score & Majors/Minors | Static markup assertion across 4 cards | Step 3.1 |
| **AC-DOSSIER-03** | RealityCheckSection Tasks & Misconceptions | Markup check for $\ge 3$ tasks + myth buster | Step 2.1 |
| **AC-DOSSIER-04** | CourseChallengeAndReassurance Component | Markup check for challenge + reassurance | Step 2.2 |
| **AC-DOSSIER-05** | TrialCoursesBadgeList 2-Pill Badges | Assert exactly 2 badges with zero-cost tag | Step 2.3 |
| **AC-DOSSIER-06** | SynthesisLoadingView Animated Reassurance | Assert `role="status"`, `aria-live`, cycling copy | Step 4.1 |
| **AC-DOSSIER-07** | MockNoticeBanner Resilience Indicator | Render with `fallback_used: true`, assert banner | Step 3.2 |
| **AC-DOSSIER-08** | NavigationFooter & Session Reset to Q1 | Assert $\ge 44$px button, focus ring, reset state | Step 4.2 |
