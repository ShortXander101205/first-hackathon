---
doc: implementation-plan
feature: 3-intake-wizard-ui
project: PathwayAI - College Major and Career Triage MVP
status: ready-for-execution
gate: PASS
---

# Feature 3: Step-by-Step Implementation Plan
## Intake Wizard UI Presentation Components & Centralized Reassuring Copy

This implementation plan defines the sequential phases required to execute **Feature 3: Intake Wizard UI** on branch `feature/3-intake-wizard-ui` in accordance with the approved technical contract ([docs/pathway/contracts/feature-3.md](file:///d:/Hackathon/Beta_Folder/docs/pathway/contracts/feature-3.md)).

---

## 1. Overview of Deliverables & Scaffolding Scope

Feature 3 delivers the pure presentation layer for the 4-question student intake wizard. All business logic, state machines, form validation algorithms, persistent storage, and API calls are strictly excluded and deferred to Feature 4 onward.

```
Phase 1: Centralized Reassuring Copy Contract (`src/constants/intakeCopy.ts`)
   ↓
Phase 2: Landmark & Progress Shell Components (`StepIndicator.tsx`, `WizardShell.tsx`)
   ↓
Phase 3: Question 1 Presentation View (`QuestionOneTaskView.tsx` — 1-2 Task Chips)
   ↓
Phase 4: Question 2 Presentation View (`QuestionTwoSubjectView.tsx` — Subject Chips & 150-char Textarea)
   ↓
Phase 5: Questions 3 & 4 Binary Toggle Views (`QuestionThreeEnvironmentView.tsx`, `QuestionFourAmbitionView.tsx`)
   ↓
Phase 6: Navigation Controls & Barrel Exports (`NavigationControls.tsx`, `index.ts`)
   ↓
Phase 7: Presentational Preview Integration (`src/app/page.tsx`) & End-to-End Verification
```

---

## 2. Component Hierarchy & File Breakdown

```
src/
├── constants/
│   └── intakeCopy.ts                   # Phase 1: 100% of user-facing copy & a11y labels (CREATED FIRST)
├── components/
│   └── wizard/
│       ├── WizardShell.tsx             # Phase 2: Calming card shell & layout container
│       ├── StepIndicator.tsx           # Phase 2: Semantic <nav> progress tracker (Steps 1–4)
│       ├── NavigationControls.tsx      # Phase 6: Accessible Previous / Next action buttons
│       ├── index.ts                    # Phase 6: Barrel export of all wizard components
│       └── questions/
│           ├── QuestionOneTaskView.tsx          # Phase 3: 4 task chips (1–2 selections)
│           ├── QuestionTwoSubjectView.tsx       # Phase 4: Subject chips & 150-char textarea
│           ├── QuestionThreeEnvironmentView.tsx # Phase 5: Binary remote vs. active toggle
│           └── QuestionFourAmbitionView.tsx    # Phase 5: Binary workforce vs. grad toggle
└── app/
    └── page.tsx                        # Phase 7: Presentation preview harness
```

---

## 3. Step-by-Step Implementation Roadmap

---

### Step 1: Implement Centralized Reassuring Copy (`src/constants/intakeCopy.ts`)
**Target File**: `src/constants/intakeCopy.ts`  
**Execution Priority**: **FIRST** (Must be authored before any JSX component to prevent hardcoded string leakage).

**Implementation Details**:
1. Create `src/constants/intakeCopy.ts` exporting the typed dictionary `INTAKE_COPY`.
2. Structure sections:
   - `shell`: Calming reassurance badge, sub-badge, intro paragraph, step count helper.
   - `steps`: Array of 4 step objects (`step`, `title`, `shortLabel`, `description`).
   - `questionOne`: Step prompt, helper copy, selection count helper (`"1 of 2 selected"`), `maxReachedHint`, and 4 task options (`BUILD_SYSTEMS`, `ANALYZE_PATTERNS`, `HELP_HUMANS`, `LEAD_ORGANIZING`).
   - `questionTwo`: Step prompt, helper copy, 5 subject options (`STEM_TECH`, `HEALTH_BIO`, `BUSINESS_SOCIETY`, `ARTS_HUMANITIES`, `PUBLIC_POLICY`), textarea label, placeholder, character counter templates (`${current}/${max} characters`), limit warning.
   - `questionThree`: Step prompt, helper copy, 2 binary environment options (`REMOTE_DESK`, `ACTIVE_FIELD_LAB`) with titles, badges, and descriptions.
   - `questionFour`: Step prompt, helper copy, 2 binary ambition options (`WORKFORCE_DIRECT`, `GRADUATE_STUDY`) with titles, badges, and descriptions.
   - `navigation`: Labels for `previous`, `next`, `review`, `disabledNotice`.
   - `a11y`: ARIA landmark descriptions, progress status strings, milestone announcements (`taskMaxReachedHint`, `characterMilestoneWarning`, `characterLimitReached`).
3. Guarantee tone: calm, non-judgmental, zero testing jargon ("exam", "assessment", "failure"), tailored to anxious students like Alex.

**Mapped Acceptance Criteria**:
- **AC-01** (Centralized Reassuring Copy Contract)

**Testing & Verification Procedure**:
- Component test check: Verify that no other wizard component contains hardcoded string literals.
- Static export check: Run `npm run type-check` to verify `INTAKE_COPY as const` types.

---

### Step 2: Implement Progress Landmark & Shell Components (`StepIndicator.tsx` & `WizardShell.tsx`)
**Target Files**:
- `src/components/wizard/StepIndicator.tsx`
- `src/components/wizard/WizardShell.tsx`

**Implementation Details**:
1. **`StepIndicator.tsx`**:
   - Semantic HTML: `<nav aria-label={INTAKE_COPY.a11y.progressNav} role="navigation">` containing `<ol role="list">`.
   - Renders 4 steps with distinct visual states:
     - `completed`: `bg-edu-interactive text-white border-edu-interactive` with checkmark icon (`Icons.verifiedCourse`), label `Step N completed`.
     - `current`: `bg-edu-primary text-white border-edu-primary ring-4 ring-edu-blue-100`, attribute `aria-current="step"`.
     - `upcoming`: `bg-edu-slate-100 text-edu-slate-400 border-edu-slate-200`.
   - Horizontal connector bar with proportional fill (`bg-edu-interactive`).
   - Mobile-First Responsive Layout:
     - Screens `< 640px`: Condensed progress bar with `"Step X of 4"` label plus linear track.
     - Screens `>= 640px`: Full labeled nodes with step titles and descriptions.
   - Prop interface:
     ```typescript
     export interface StepIndicatorProps {
       currentStep: 1 | 2 | 3 | 4;
       totalSteps?: number;
       className?: string;
     }
     ```
2. **`WizardShell.tsx`**:
   - Semantic HTML: `<section aria-label={INTAKE_COPY.a11y.wizardLandmark} className="max-w-3xl mx-auto ...">`.
   - Styled using Educational Blue & Slate: `bg-white border border-edu-slate-200 rounded-2xl shadow-sm p-4 sm:p-8 lg:p-10`.
   - Reassurance top banner with calm badge: `bg-reassurance-50 border border-reassurance-100 text-reassurance-700`.
   - Embeds `StepIndicator` at the top and slots for question content and navigation controls.
   - Prop interface:
     ```typescript
     export interface WizardShellProps {
       children: React.ReactNode;
       currentStep: 1 | 2 | 3 | 4;
       totalSteps?: number;
       className?: string;
     }
     ```

**Mapped Acceptance Criteria**:
- **AC-02** (WizardShell Presentation Layout)
- **AC-03** (StepIndicator Navigation & States)

**Testing & Verification Procedure**:
- Component test check: Render `StepIndicator` with `currentStep = 1, 2, 3, 4`. Verify DOM nodes render correct classes (`ring-4 ring-edu-blue-100` on active, check icon on completed).
- Mobile viewport test: Check that at 320px/375px width, the indicator renders a compact single-line summary without horizontal overflow.
- A11y test: Verify `aria-current="step"` exists strictly on the active step element.

---

### Step 3: Implement Question 1 Presentation View (`QuestionOneTaskView.tsx`)
**Target File**: `src/components/wizard/questions/QuestionOneTaskView.tsx`

**Implementation Details**:
1. Presentation view for intellectual energy tasks.
2. Layout: `<fieldset>` with `<legend>` containing prompt and helper text from `INTAKE_COPY.questionOne`.
3. Displays 4 task chips in a mobile-first responsive grid (`grid-cols-1 sm:grid-cols-2 gap-4`).
4. Chip Visual Styling:
   - **Inactive/Unselected**: `bg-white border-2 border-edu-slate-200 text-edu-slate-800 hover:border-edu-blue-300 hover:bg-edu-blue-50/40 min-h-[72px] p-4 rounded-xl`.
   - **Active/Selected**: `bg-edu-blue-50 border-2 border-edu-interactive text-edu-blue-950 shadow-sm ring-1 ring-edu-interactive/30 min-h-[72px] p-4 rounded-xl`.
   - **Max-Reached Soft State**: If 2 chips are selected, remaining unselected chips receive `opacity-75`.
5. Multi-selection visual behavior & states:
   - State 0: 0 selected ("Select 1 or 2 options").
   - State 1: 1 selected ("1 of 2 selected (you can pick 1 more)").
   - State 2: 2 selected ("2 of 2 selected (maximum reached)").
   - State 3: Clicking an unselected chip when 2 are already selected displays the gentle inline hint: `INTAKE_COPY.a11y.taskMaxReachedHint` without blocking errors.
6. Keyboard Accessibility & Listeners:
   - Each chip rendered as native `<button type="button" role="checkbox" aria-checked={isSelected}>`.
   - Native Space and Enter key triggers handled seamlessly.
   - Focus ring: `focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2`.
   - Touch target: Height `min-h-[72px]` comfortably exceeds 44px.
7. Prop interface:
   ```typescript
   export interface QuestionOneTaskViewProps {
     selectedTaskIds: string[];
     onToggleTask: (taskId: string) => void;
     className?: string;
   }
   ```

**Mapped Acceptance Criteria**:
- **AC-04** (QuestionOneTaskView 1–2 Task Selection Chips)

**Testing & Verification Procedure**:
- Component test check: Render with `selectedTaskIds = []`, `['BUILD_SYSTEMS']`, and `['BUILD_SYSTEMS', 'ANALYZE_PATTERNS']`.
- Keyboard test: Trigger Space and Enter on chip buttons; verify toggle callback invocation.
- Verify `aria-checked="true"` on selected chips and `"false"` on unselected.
- Touch target test: Inspect bounding box height `>= 72px` (>= 44px minimum).

---

### Step 4: Implement Question 2 Presentation View (`QuestionTwoSubjectView.tsx`)
**Target File**: `src/components/wizard/questions/QuestionTwoSubjectView.tsx`

**Implementation Details**:
1. Presentation view for academic interest and friction.
2. Layout: `<fieldset>` with prompt, helper text, and two sub-sections:
   - **Subject Chips Section**: 5 single-select chips (`STEM_TECH`, `HEALTH_BIO`, `BUSINESS_SOCIETY`, `ARTS_HUMANITIES`, `PUBLIC_POLICY`).
     - Button container: Mobile-first `flex flex-wrap gap-2.5 sm:gap-3`.
     - Inactive: `bg-edu-slate-100 text-edu-slate-700 hover:bg-edu-blue-50 border border-edu-slate-200 min-h-[44px] px-4 py-2.5 rounded-full text-sm font-medium`.
     - Active: `bg-edu-primary text-white border border-edu-primary shadow-sm min-h-[44px] px-4 py-2.5 rounded-full text-sm font-medium`.
     - Role: `<button type="button" role="radio" aria-checked={isSelected}>`.
     - Keyboard: Space and Enter selection, visible focus ring.
   - **150-Character Capped Textarea Section**:
     - Semantic `<label htmlFor="q2-notes">` using `INTAKE_COPY.questionTwo.textAreaLabel`.
     - `<textarea id="q2-notes" maxLength={150} rows={3} placeholder={...} />`.
     - Live character counter: Displays `INTAKE_COPY.questionTwo.characterCounter(noteText.length, 150)`.
     - Warning Near-Limit: When `noteText.length >= 140`, counter text switches to `text-friction-700 font-semibold`.
     - A11y milestone announcements: Live region with `aria-live="polite"` at 140 characters and 150 characters.
3. Focus ring: `focus:border-edu-interactive focus:ring-2 focus:ring-edu-interactive/30 focus:outline-none`.
4. Prop interface:
   ```typescript
   export interface QuestionTwoSubjectViewProps {
     selectedSubjectId: string | null;
     onSelectSubject: (subjectId: string) => void;
     noteText: string;
     onChangeNoteText: (text: string) => void;
     className?: string;
   }
   ```

**Mapped Acceptance Criteria**:
- **AC-05** (QuestionTwoSubjectView Subject Chips & Capped Textarea)

**Testing & Verification Procedure**:
- Component test check: Render with `selectedSubjectId = 'HEALTH_BIO'`. Verify active styling on Health chip.
- Keyboard test: Navigate chips with Tab, select via Space/Enter.
- Textarea test: Simulate typing 150 characters; verify visual counter updates from `0/150` to `150/150`.
- Character cap test: Verify typing beyond 150 characters is truncated by `maxLength={150}`.
- Warning state test: Verify `text-friction-700` is applied when length >= 140.

---

### Step 5: Implement Questions 3 & 4 Binary Toggle Views (`QuestionThreeEnvironmentView.tsx` & `QuestionFourAmbitionView.tsx`)
**Target Files**:
- `src/components/wizard/questions/QuestionThreeEnvironmentView.tsx`
- `src/components/wizard/questions/QuestionFourAmbitionView.tsx`

**Implementation Details**:
1. **`QuestionThreeEnvironmentView.tsx`**:
   - Prompt & helper text from `INTAKE_COPY.questionThree`.
   - Button Container: Mobile-first stacked layout expanding to 2 columns on tablet/desktop (`grid grid-cols-1 sm:grid-cols-2 gap-4`).
   - 2 Binary Cards:
     - `REMOTE_DESK`: Remote & Focused Desk
     - `ACTIVE_FIELD_LAB`: Active, Field & Lab
   - Visual Styling:
     - Inactive: `border-2 border-edu-slate-200 bg-white hover:border-edu-slate-300 min-h-[140px] p-5 rounded-xl`.
     - Active: `border-2 border-edu-interactive bg-edu-blue-50/80 shadow-sm ring-1 ring-edu-interactive/30 min-h-[140px] p-5 rounded-xl`.
   - Keyboard: `<button role="radio">` activatable via Space and Enter.
   - Prop interface:
     ```typescript
     export type EnvironmentChoice = 'REMOTE_DESK' | 'ACTIVE_FIELD_LAB';

     export interface QuestionThreeEnvironmentViewProps {
       selectedEnvironment: EnvironmentChoice | null;
       onSelectEnvironment: (env: EnvironmentChoice) => void;
       className?: string;
     }
     ```
2. **`QuestionFourAmbitionView.tsx`**:
   - Prompt & helper text from `INTAKE_COPY.questionFour`.
   - Button Container: Mobile-first stacked layout (`grid grid-cols-1 sm:grid-cols-2 gap-4`).
   - 2 Binary Cards:
     - `WORKFORCE_DIRECT`: Direct 2–4 Year Workforce
     - `GRADUATE_STUDY`: Graduate & Specialized Study
   - Visual Styling: Matches Question 3 binary card styles.
   - Keyboard: Space and Enter activation, visible focus ring.
   - Prop interface:
     ```typescript
     export type AmbitionChoice = 'WORKFORCE_DIRECT' | 'GRADUATE_STUDY';

     export interface QuestionFourAmbitionViewProps {
       selectedAmbition: AmbitionChoice | null;
       onSelectAmbition: (ambition: AmbitionChoice) => void;
       className?: string;
     }
     ```
3. Semantics: `<fieldset role="radiogroup">`, cards render as `<button type="button" role="radio" aria-checked={isSelected}>`.

**Mapped Acceptance Criteria**:
- **AC-06** (QuestionThreeEnvironmentView Binary Work Setting Toggle)
- **AC-07** (QuestionFourAmbitionView Binary Post-College Toggle)

**Testing & Verification Procedure**:
- Component test check: Toggle between options in Q3 and Q4; verify single-selection mutual exclusivity.
- Keyboard test: Space/Enter toggles options; focus outline is visible.
- Touch target test: Inspect bounding box height `>= 140px` (exceeds 44px).

---

### Step 6: Implement Navigation Controls & Wizard Barrel Exports (`NavigationControls.tsx` & `index.ts`)
**Target Files**:
- `src/components/wizard/NavigationControls.tsx`
- `src/components/wizard/index.ts`

**Implementation Details**:
1. **`NavigationControls.tsx`**:
   - **Mobile-First Button Container**:
     - Mobile (`< 640px`): `flex flex-col-reverse gap-3 w-full pt-6 mt-8 border-t border-edu-slate-200`. Buttons stretch full width (`w-full`) providing large, comfortable 48px touch targets for mobile thumbs.
     - Tablet/Desktop (`>= 640px`): `sm:flex-row sm:items-center sm:justify-between sm:gap-4`. Buttons auto-width (`sm:w-auto`).
   - **Previous Button**:
     - Disabled on Step 1: `opacity-40 cursor-not-allowed bg-edu-slate-50 border-edu-slate-200 text-edu-slate-400` with `aria-disabled="true"`.
     - Active on Steps 2–4: `bg-white border border-edu-slate-300 text-edu-slate-700 hover:bg-edu-slate-100 hover:text-edu-slate-900`.
     - Touch target: `min-h-[44px] min-w-[100px] px-5 py-2.5 rounded-lg text-sm font-medium`.
   - **Next / Review Button**:
     - Label: Reads `INTAKE_COPY.navigation.next` (`"Continue"`) on steps 1–3; reads `INTAKE_COPY.navigation.review` (`"Review Pathways"`) on step 4.
     - Active State: `bg-edu-interactive text-white hover:bg-edu-blue-700 shadow-sm`.
     - Disabled State: `opacity-50 cursor-not-allowed bg-edu-slate-300 text-edu-slate-500` with `aria-disabled="true"` and `aria-describedby="next-disabled-notice"`.
     - Touch target: `min-h-[44px] min-w-[130px] px-6 py-2.5 rounded-lg text-sm font-semibold`.
   - Keyboard: Focusable via Tab, activatable via Enter/Space when active.
   - Prop interface:
     ```typescript
     export interface NavigationControlsProps {
       onPrevious: () => void;
       onNext: () => void;
       isPreviousDisabled: boolean;
       isNextDisabled: boolean;
       isLastStep: boolean;
       previousLabel?: string;
       nextLabel?: string;
       className?: string;
     }
     ```
2. **`index.ts`**:
   - Central barrel file exporting `WizardShell`, `StepIndicator`, `NavigationControls`, and all four question views.

**Mapped Acceptance Criteria**:
- **AC-08** (NavigationControls & Accessibility Guarantees)

**Testing & Verification Procedure**:
- Component test check: Render with `isPreviousDisabled = true` (Step 1); verify disabled visual classes.
- Step 4 test: Verify button text switches to `"Review Pathways"`.
- Mobile viewport test: Check that at 320px/375px, buttons stack vertically with full width.
- Focus test: Verify `focus:ring-2 focus:ring-edu-interactive` is visible on keyboard tab.

---

### Step 7: Presentational Preview Integration in `src/app/page.tsx` & End-to-End Verification
**Target File**: `src/app/page.tsx`

**Implementation Details**:
1. Mount the `WizardShell` on `/` with presentational mock handlers (`useState` for active step 1–4, selected tasks, selected subject, note text, selected environment, selected ambition).
2. Wire presentational mock navigation:
   - Step 1: Renders `QuestionOneTaskView`. "Continue" advances to Step 2.
   - Step 2: Renders `QuestionTwoSubjectView`. "Previous" returns to Step 1; "Continue" advances to Step 3.
   - Step 3: Renders `QuestionThreeEnvironmentView`. "Previous" returns to Step 2; "Continue" advances to Step 4.
   - Step 4: Renders `QuestionFourAmbitionView`. "Previous" returns to Step 3; "Review Pathways" triggers a calming presentation completion banner ("Intake UI Complete — Ready for Feature 4 State Machine").
3. Verify Alex persona walkthrough:
   - Selects `BUILD_SYSTEMS`.
   - Selects `HEALTH_BIO` and types *"I love lab experiments, but calculus stresses me out."*
   - Selects `ACTIVE_FIELD_LAB`.
   - Selects `WORKFORCE_DIRECT`.
4. Run strict quality checks:
   - `npm run type-check` (zero TypeScript errors).
   - `npm run lint` (zero ESLint errors/warnings).
   - `npm run build` (successful production bundle).

**Mapped Acceptance Criteria**:
- **AC-01 through AC-08** (Complete Feature 3 Verification)

**Testing & Verification Procedure**:
- Full keyboard traversal test: Navigate from Step 1 to Step 4 using only `Tab`, `Shift+Tab`, `Space`, and `Enter`.
- Responsiveness test: Inspect at 320px (iPhone mini/SE), 768px (iPad), and 1280px (Desktop).
- Contrast ratio audit: Verify all text ink and chip borders meet WCAG AA/AAA.

---

## 4. Verification Matrix & Acceptance Criteria Mapping

| Step | Target File(s) | Mapped AC | Pass Criteria |
|---|---|---|---|
| **1** | `src/constants/intakeCopy.ts` | **AC-01** | 100% of user copy and ARIA labels isolated. Zero raw strings in JSX. |
| **2** | `StepIndicator.tsx`, `WizardShell.tsx` | **AC-02**, **AC-03** | Semantic layout shell rendered with 4-step progress states and responsive mobile bar. |
| **3** | `QuestionOneTaskView.tsx` | **AC-04** | 4 task chips support 1–2 selections with live counter badge and `>= 72px` touch targets. Space/Enter listeners verified. |
| **4** | `QuestionTwoSubjectView.tsx` | **AC-05** | Subject chips + 150-char capped textarea with live counter and friction warning at `>= 140`. |
| **5** | `QuestionThreeEnvironmentView.tsx`, `QuestionFourAmbitionView.tsx` | **AC-06**, **AC-07** | Binary toggle cards for remote vs. active and workforce vs. graduate study with radio semantics. |
| **6** | `NavigationControls.tsx`, `index.ts` | **AC-08** | Step 1 Previous disabled, Step 4 label reads "Review Pathways", mobile-first stacked button container, `>= 44px` targets. |
| **7** | `src/app/page.tsx` | **AC-01–08** | Zero TS errors, zero lint warnings, Next.js build passes. Full 4-step Alex persona flow verified. |

---

## 5. Explicit Out-of-Scope Enforcement Checks

Before marking Feature 3 complete, verify that none of the following were inadvertently introduced:
- [ ] No `zod` schema parsing or blocking validation errors in UI components.
- [ ] No `sessionStorage` or `localStorage` keys created.
- [ ] No `better-sqlite3` imports or database queries.
- [ ] No `fetch('/api/intake/submit')` or API route invocations.
- [ ] No complex external state machine libraries (`xstate`, `zustand`, `redux`).
