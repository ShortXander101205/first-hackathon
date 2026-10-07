---
doc: contract
feature: 3-intake-wizard-ui
project: PathwayAI - College Major and Career Triage MVP
status: approved
gate: PASS
---

# Feature 3: Intake Wizard UI — Technical Contract & Specification

## 1. Executive Summary & Objective

This specification establishes the technical and presentation contract for **Feature 3: Intake Wizard UI** of **PathwayAI: College Major and Career Triage MVP** on branch `feature/3-intake-wizard-ui`.

Feature 3 delivers the complete presentation layer for the **4-Question High-Yield Student Intake Wizard**. Designed specifically to alleviate decision paralysis and dread in anxious 17–19 year old high school juniors/seniors and early college undergraduates, this feature implements the visual architecture, interactive controls, accessible progress tracking, and centralized empathetic copy required for a friction-free student experience.

### Primary Objectives
1. **Calm, Validating Visual Atmosphere**: Deliver a clean, reassuring UI built upon the established **Educational Blue & Slate** design tokens (`#1E3A8A` primary, `#2563EB` interactive, `#F8FAFC` canvas, `#0F172A` text ink).
2. **Componentized Presentation Architecture**: Implement isolated, testable presentation components: `WizardShell`, `StepIndicator`, `QuestionOneTaskView`, `QuestionTwoSubjectView`, `QuestionThreeEnvironmentView`, `QuestionFourAmbitionView`, and `NavigationControls`.
3. **100% Centralized Anxiety-Reducing Copy**: Isolate all user-facing strings, questions, helper microcopy, placeholder text, and navigation labels strictly into `src/constants/intakeCopy.ts`, utilizing a warm, non-judgmental, validating tone.
4. **Universal Accessibility & Ergonomics**: Guarantee minimum 44×44px touch targets, complete keyboard navigation (Tab, Shift+Tab, Space, Enter), visible focus rings, and WCAG AA/AAA contrast ratios.
5. **Fluid Mobile Responsiveness**: Ensure flawless rendering and ergonomic touch operation across devices from 320px mobile screens to large desktop monitors.

---

## 2. Scope & Boundary Clarifications

To maintain tight architectural hygiene and prevent feature creep, Feature 3 is strictly confined to presentation components and local UI rendering.

### In Scope for Feature 3
- Component presentation layouts: `WizardShell`, `StepIndicator`, `NavigationControls`.
- 4 Question presentation views:
  - `QuestionOneTaskView` (4 task chips supporting 1–2 visual selections).
  - `QuestionTwoSubjectView` (subject chips + 150-character capped text area with visual live character counter).
  - `QuestionThreeEnvironmentView` (binary toggle chips for remote/desk versus active/field/lab).
  - `QuestionFourAmbitionView` (binary toggle chips for 2–4 year workforce versus graduate study).
- Interactive presentation state (visual selection toggles, hover/focus rings, active and disabled button styling).
- Copy centralization in `src/constants/intakeCopy.ts`.
- Full keyboard and screen reader accessibility semantics (`aria-current`, `aria-checked`, `aria-describedby`, `aria-live`).
- Mobile-first responsive layout adaptations.
- Numbered Acceptance Criteria AC-01 through AC-08.

### Explicitly Out of Scope (Deferred to Feature 4 onward)
- **Form validation algorithms**: Client-side validation engines, blocking schema error dialogs, or mandatory submission assertions (deferred to `feature/4-intake-state-machine`).
- **Persistent state machines**: Multi-step state machine orchestrators (e.g., XState, complex reducers, global stores) (deferred to `feature/4-intake-state-machine`).
- **Storage persistence**: `sessionStorage`, `localStorage`, or draft caching (deferred to `feature/4-intake-state-machine`).
- **Database persistence**: SQLite table writes or local record generation (deferred to `feature/4-intake-state-machine` and `feature/6-sqlite-persistence`).
- **API endpoints & network calls**: `POST /api/intake/submit`, Gemini 1.5 Flash generation triggers, and mock fallback execution (deferred to `feature/5-gemini-orchestration`).

---

## 3. Design System Alignment & Psychological Grounding

PathwayAI serves students experiencing severe academic dread, fear of picking the "wrong" major, and fear of failure. Every visual choice must systematically de-escalate anxiety.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ANXIETY-REDUCING UI PRINCIPLES                     │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Zero "Test" Cues: No score indicators, timers, or red error banners. │
│ 2. Grounded Surfaces: Pure white card (#FFFFFF) on soft slate (#F8FAFC) │
│    with subtle 1px slate borders (#E2E8F0) and gentle elevation.        │
│ 3. Generous Breathing Room: Generous line-height (1.6) and responsive   │
│    padding (p-6 sm:p-8) to avoid cognitive crowding.                    │
│ 4. Clear Wayfinding: High-contrast step progress with reassuring micro- │
│    affirmations ("Take your time", "There are no wrong answers").       │
│ 5. Physical Touch Feel: Substantial 44px+ touch targets with tactile    │
│    selected states (light blue background + distinct primary border).   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Semantic Color Mappings in Wizard UI
- **Canvas Base**: `bg-edu-bg` (`#F8FAFC`) — Calming, neutral, glare-free background.
- **Surface Layer**: `bg-white border-edu-slate-200` (`#E2E8F0`) — Clean, elevated container.
- **Primary Ink**: `text-edu-slate-900` (`#0F172A`) — Maximum legibility (15.6:1 contrast ratio, WCAG AAA).
- **Secondary Ink**: `text-edu-slate-600` (`#475569`) — Soft descriptive instructions (5.3:1 contrast ratio, WCAG AA).
- **Interactive Action**: `bg-edu-interactive` (`#2563EB`) / `hover:bg-edu-blue-700` (`#1D4ED8`) — Clear, trustworthy progress actions.
- **Selected Chip Surface**: `bg-edu-blue-50` (`#EFF6FF`) with `border-edu-interactive` (`#2563EB`) — Affirming, high-clarity selection feedback.
- **Unselected Chip Surface**: `bg-white` with `border-edu-slate-200` (`#E2E8F0`) — Clean, unpressured neutral cards.
- **Reassurance Badge**: `bg-reassurance-50` (`#F0F9FF`) with `text-reassurance-700` (`#0369A1`) — Compassionate micro-prompts.
- **Character Counter Near-Limit Warning**: `text-friction-700` (`#B45309`) on `friction-50` (`#FFFBEB`) — Gentle guidance without harsh red alarms.

---

## 4. Centralized Copy Contract (`src/constants/intakeCopy.ts`)

To guarantee psychological consistency, eliminate ad-hoc copywriting, and enable rapid refinement for 17–19 year old students, **100% of user-facing copy must reside in `src/constants/intakeCopy.ts`**. No component may render hardcoded raw strings.

### 4.1 Copy Tone Guidelines
- **Plain and Direct**: Avoid academic jargon, psychometric terminology ("vocational aptitude", "cognitive alignment"), and formal corporate phrasing.
- **Validating and Safe**: Affirm that confusion is normal and that exploring interests carries zero risk.
- **Empathetic Microcopy**: Replace clinical instructional imperatives ("You must answer all fields") with human reassurance ("Select what feels most natural right now").

### 4.2 Exact Copy Specification
```typescript
/**
 * PathwayAI: College Major & Career Triage MVP
 * Centralized User-Facing Copy for Intake Wizard
 * Tone: Calm, validating, plain language tailored for anxious 17-19 year olds.
 */

export const INTAKE_COPY = {
  // Global & Shell Copy
  shell: {
    badge: 'Zero-Pressure Exploration',
    subBadge: 'Takes ~2 minutes • No test scores or grades required',
    reassuranceNote:
      'There are no right or wrong answers. Choose what feels natural to you right now—your pathways are built to fit your comfort, not test your knowledge.',
    stepCountLabel: (current: number, total: number) => `Step ${current} of ${total}`,
  },

  // Step Indicator Labels
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
        ? `Select 1 or 2 options`
        : count === 1
        ? `1 of ${max} selected (you can pick 1 more)`
        : `${count} of ${max} selected (maximum reached)`,
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
    textAreaLabel: 'What makes you curious or nervous about this area? (Optional)',
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
    disabledNotice: 'Select an option above to continue',
  },
} as const;
```

---

## 5. Presentation Component Specifications

All presentation components are pure React client components (`'use client'`) operating strictly through typed props. They do not invoke network requests or instantiate persistent state machines.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              WizardShell                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ StepIndicator (Steps 1 → 2 → 3 → 4)                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Question View Slot:                                              │  │
│  │   - QuestionOneTaskView        (1-2 Task Chips)                  │  │
│  │   - QuestionTwoSubjectView     (Subject Chips + 150-char Area)   │  │
│  │   - QuestionThreeEnvironmentView (Binary Remote vs Active)       │  │
│  │   - QuestionFourAmbitionView   (Binary Workforce vs Grad)        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ NavigationControls: [Previous (Disabled on 1)]       [Continue]  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5.1 Component: `WizardShell`
- **Location**: `src/components/wizard/WizardShell.tsx`
- **Semantic HTML**: `<section aria-label="College Major and Career Intake Wizard" className="w-full max-w-3xl mx-auto ...">`
- **Visual Styling**:
  - Border: `border border-edu-slate-200`
  - Background: `bg-white shadow-sm rounded-2xl`
  - Padding: `p-6 sm:p-8 lg:p-10`
  - Reassurance Header: Includes a calm top pill (`bg-reassurance-50 border border-reassurance-100 text-reassurance-700`) emphasizing zero-pressure exploration.
- **Props Interface**:
  ```typescript
  export interface WizardShellProps {
    children: React.ReactNode;
    currentStep: 1 | 2 | 3 | 4;
    totalSteps?: number;
    className?: string;
  }
  ```
- **Structure**:
  ```tsx
  <div className="w-full py-6 sm:py-10">
    <Container>
      <section aria-label="College Major and Career Intake Wizard" className="max-w-3xl mx-auto bg-white border border-edu-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
        {/* Reassurance Header Banner */}
        <div className="mb-6 ...">...</div>
        {/* Step Indicator Header */}
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        {/* Question View Slot */}
        <div className="mt-8">{children}</div>
      </section>
    </Container>
  </div>
  ```

---

### 5.2 Component: `StepIndicator`
- **Location**: `src/components/wizard/StepIndicator.tsx`
- **Semantic HTML**: `<nav aria-label="Intake progress" role="navigation">` wrapping an ordered list `<ol role="list">`.
- **Steps**: Exactly 4 steps:
  1. Energy & Tasks
  2. Subjects & Focus
  3. Work Setting
  4. Future Ambition
- **State Semantics**:
  - `completed` (step < currentStep): Renders filled circle with checkmark icon (`Icons.verifiedCourse`), accessible label `"Step N completed"`.
  - `current` (step === currentStep): Renders high-contrast filled circle (`bg-edu-primary text-white ring-4 ring-edu-blue-100`), marked with `aria-current="step"`.
  - `upcoming` (step > currentStep): Renders neutral circle (`bg-edu-slate-100 text-edu-slate-400 border border-edu-slate-200`).
- **Visual Progress Bar**: A subtle 2px background track (`bg-edu-slate-200`) with an animated/proportional filled track (`bg-edu-interactive`) connecting step nodes.
- **Mobile Adaptability**: On screens `< 640px`, renders a condensed progress summary (e.g., active step counter text `"Step 2 of 4 • Subjects & Focus"` plus linear progress bar) to conserve vertical space, while rendering full numbered nodes and titles on `sm:` and larger screens.
- **Props Interface**:
  ```typescript
  export interface StepIndicatorProps {
    currentStep: 1 | 2 | 3 | 4;
    totalSteps?: number; // default 4
    className?: string;
  }
  ```

---

### 5.3 Component: `QuestionOneTaskView`
- **Location**: `src/components/wizard/questions/QuestionOneTaskView.tsx`
- **Purpose**: Captures student intellectual energy through 4 distinct task chips with 1–2 visual multi-selection capability.
- **Data Options** (from `INTAKE_COPY.questionOne.options`):
  1. `BUILD_SYSTEMS`: Building & Designing Systems
  2. `ANALYZE_PATTERNS`: Investigating & Solving Puzzles
  3. `HELP_HUMANS`: Guiding & Supporting People
  4. `LEAD_ORGANIZING`: Organizing & Leading Initiatives
- **Visual Chip Specification**:
  - Layout: `grid grid-cols-1 sm:grid-cols-2 gap-4`
  - Chip Height & Padding: `min-h-[72px] p-4 rounded-xl` (comfortably exceeds the 44px touch target).
  - Unselected State: `bg-white border-2 border-edu-slate-200 text-edu-slate-800 hover:border-edu-blue-300 hover:bg-edu-blue-50/40 transition-colors`.
  - Selected State: `bg-edu-blue-50 border-2 border-edu-interactive text-edu-blue-950 shadow-sm ring-1 ring-edu-interactive/30`.
  - Selection Badge: A subtle check badge or indicator icon (`CheckCircle2`) renders on selected chips.
- **Multi-Selection Logic (Visual Contract)**:
  - Supports selecting 1 or 2 chips simultaneously.
  - Active selection counter displays: `"1 of 2 selected"` or `"2 of 2 selected (maximum reached)"`.
  - If a user clicks a 3rd chip while 2 are selected, the UI triggers a soft visual hint rather than a blocking error.
- **Accessibility**:
  - Container: `<fieldset>` with `<legend>` containing the question prompt.
  - Each chip: Native `<button type="button" role="checkbox" aria-checked={isSelected}>` with clear label and description.
- **Props Interface**:
  ```typescript
  export interface QuestionOneTaskViewProps {
    selectedTaskIds: string[];
    onToggleTask: (taskId: string) => void;
    className?: string;
  }
  ```

---

### 5.4 Component: `QuestionTwoSubjectView`
- **Location**: `src/components/wizard/questions/QuestionTwoSubjectView.tsx`
- **Purpose**: Captures academic subject interest and allows students to express specific anxieties/dreads in a 150-character capped text area.
- **Subject Chips** (from `INTAKE_COPY.questionTwo.options`):
  - 5 selectable subject pills:
    1. Technology & Computing
    2. Health, Medicine & Biology
    3. Business & Social Innovation
    4. Arts, Writing & Media
    5. Law, Policy & Community Impact
  - Visual State: Single-select chips (`flex flex-wrap gap-2.5`). Unselected: `bg-edu-slate-100 text-edu-slate-700 hover:bg-edu-blue-50 border border-edu-slate-200`. Selected: `bg-edu-primary text-white border border-edu-primary shadow-sm`.
  - Minimum touch target: `min-h-[44px] px-4 py-2.5 rounded-full text-sm font-medium`.
- **150-Character Capped Text Area**:
  - `<textarea>` with strict `maxLength={150}` attribute.
  - Accessible `<label>` explicitly tied via `htmlFor`.
  - Live character counter: renders dynamic count string (e.g. `0/150 characters`).
  - Counter Near-Limit State: When characters reach `140/150`, character counter highlights gently in `text-friction-700` (`#B45309`) with `aria-live="polite"`.
  - Calming placeholder text: *"e.g., I love laboratory experiments, but advanced theoretical calculus stresses me out..."*
  - Focus Ring: `focus:border-edu-interactive focus:ring-2 focus:ring-edu-interactive/30 focus:outline-none`.
- **Props Interface**:
  ```typescript
  export interface QuestionTwoSubjectViewProps {
    selectedSubjectId: string | null;
    onSelectSubject: (subjectId: string) => void;
    noteText: string;
    onChangeNoteText: (text: string) => void;
    className?: string;
  }
  ```

---

### 5.5 Component: `QuestionThreeEnvironmentView`
- **Location**: `src/components/wizard/questions/QuestionThreeEnvironmentView.tsx`
- **Purpose**: Solicits preferred day-to-day work environment via binary toggle cards.
- **Binary Options** (from `INTAKE_COPY.questionThree.options`):
  1. `REMOTE_DESK`: Remote & Focused Desk (digital, flexible, independent workspace)
  2. `ACTIVE_FIELD_LAB`: Active, Field & Lab (hands-on, dynamic, moving, collaborative physical space)
- **Visual Presentation**:
  - Two high-clarity cards arranged side-by-side on desktop (`sm:grid-cols-2`) and stacked on mobile (`grid-cols-1`).
  - Card Height: `min-h-[140px] p-5 rounded-xl border-2`.
  - Inactive State: `border-edu-slate-200 bg-white hover:border-edu-slate-300 hover:bg-edu-slate-50/50`.
  - Active State: `border-edu-interactive bg-edu-blue-50/80 shadow-sm ring-1 ring-edu-interactive/30`.
  - Iconography: Contextual icons for digital desk vs. hands-on active lab environment.
- **Accessibility**:
  - Container: `<fieldset role="radiogroup" aria-labelledby="q3-title">`
  - Interactive Card: `<button type="button" role="radio" aria-checked={isSelected}>` with Space/Enter activation.
- **Props Interface**:
  ```typescript
  export type EnvironmentChoice = 'REMOTE_DESK' | 'ACTIVE_FIELD_LAB';

  export interface QuestionThreeEnvironmentViewProps {
    selectedEnvironment: EnvironmentChoice | null;
    onSelectEnvironment: (env: EnvironmentChoice) => void;
    className?: string;
  }
  ```

---

### 5.6 Component: `QuestionFourAmbitionView`
- **Location**: `src/components/wizard/questions/QuestionFourAmbitionView.tsx`
- **Purpose**: Captures post-graduation horizon preferences via binary toggle cards.
- **Binary Options** (from `INTAKE_COPY.questionFour.options`):
  1. `WORKFORCE_DIRECT`: Direct 2–4 Year Workforce (rapid employment, financial independence, on-the-job mastery)
  2. `GRADUATE_STUDY`: Graduate & Specialized Study (master’s, medical/law, doctoral, deep academic research)
- **Visual Presentation**:
  - Two prominent binary cards arranged in a responsive 2-column grid (`sm:grid-cols-2 gap-4`).
  - Card Height: `min-h-[140px] p-5 rounded-xl border-2`.
  - Inactive State: `border-edu-slate-200 bg-white hover:border-edu-slate-300 hover:bg-edu-slate-50/50`.
  - Active State: `border-edu-interactive bg-edu-blue-50/80 shadow-sm ring-1 ring-edu-interactive/30`.
- **Accessibility**:
  - Container: `<fieldset role="radiogroup" aria-labelledby="q4-title">`
  - Interactive Card: `<button type="button" role="radio" aria-checked={isSelected}>` with Space/Enter activation.
- **Props Interface**:
  ```typescript
  export type AmbitionChoice = 'WORKFORCE_DIRECT' | 'GRADUATE_STUDY';

  export interface QuestionFourAmbitionViewProps {
    selectedAmbition: AmbitionChoice | null;
    onSelectAmbition: (ambition: AmbitionChoice) => void;
    className?: string;
  }
  ```

---

### 5.7 Component: `NavigationControls`
- **Location**: `src/components/wizard/NavigationControls.tsx`
- **Purpose**: Controls navigation between steps 1 through 4 with clear visual disabled/active states.
- **Controls**:
  - **Previous Button ("Previous")**:
    - Step 1 State: Visually disabled (`opacity-40 cursor-not-allowed border-edu-slate-200 text-edu-slate-400 bg-edu-slate-50`).
    - Steps 2–4 Active State: `border border-edu-slate-300 bg-white text-edu-slate-700 hover:bg-edu-slate-100 hover:text-edu-slate-900`.
    - Touch Target: `min-h-[44px] min-w-[100px] px-5 py-2.5 rounded-lg text-sm font-medium`.
  - **Next Button ("Continue" or "Review Pathways")**:
    - Label: Reads `"Continue"` for steps 1–3; reads `"Review Pathways"` on step 4.
    - Active State: `bg-edu-interactive text-white hover:bg-edu-blue-700 shadow-sm hover:shadow`.
    - Visually Disabled State: `opacity-50 cursor-not-allowed bg-edu-slate-300 text-edu-slate-500 shadow-none`.
    - Touch Target: `min-h-[44px] min-w-[130px] px-6 py-2.5 rounded-lg text-sm font-semibold`.
- **Visual Dividers & Layout**:
  - Sits in a dedicated footer bar (`pt-6 mt-8 border-t border-edu-slate-200 flex items-center justify-between gap-4`).
- **Props Interface**:
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

---

## 6. Accessibility & Usability Engineering

All components are engineered to adhere strictly to **WCAG 2.1 Level AA** standards with key AAA contrast alignments:

### 6.1 Keyboard Navigation Matrix
| Component / Target | Key Interaction | Expected Behavioral Contract |
|---|---|---|
| **Any Chip / Option Button** | `Tab` / `Shift+Tab` | Moves focus between interactive options with visible focus outline. |
| **Task Chip (`QuestionOneTaskView`)** | `Space` or `Enter` | Toggles selection state (`aria-checked="true" \| "false"`). |
| **Subject Chip (`QuestionTwoSubjectView`)** | `Space` or `Enter` | Selects current subject; updates active visual styling. |
| **Text Area (`QuestionTwoSubjectView`)** | Standard Typing | Inputs text; live character count increments. Does not accept characters past 150. |
| **Binary Toggle Card (Q3 / Q4)** | `Space` or `Enter` | Selects radio card; announces active state to screen readers. |
| **Previous / Next Buttons** | `Space` or `Enter` | Triggers `onPrevious` or `onNext` callbacks when active. Inert when disabled. |

### 6.2 Minimum 44×44px Touch Targets
Per WCAG 2.5.5 (Target Size) and WCAG 2.5.8 (Target Size Minimum):
- All buttons, chips, and interactive cards enforce a minimum height of `44px` (`min-h-[44px]`) and width of `44px` (`min-w-[44px]`).
- Spacing between adjacent interactive targets is at least `8px` (`gap-2` or `gap-4`) to eliminate accidental tapping on mobile devices.

### 6.3 Screen Reader Semantics & ARIA Landmarks
- **Progress Tracking**: `<nav aria-label="Intake progress">` with `<ol role="list">`. The active step node bears `aria-current="step"`.
- **Live Regions**: Character counter uses `aria-live="polite"` so screen reader users are notified when nearing the 150-character limit without intrusive interruptions.
- **Form Grouping**: Each question view uses semantic `<fieldset>` with an accessible `<legend className="text-lg font-bold ...">` defining the question.
- **Visible Focus Rings**: All interactive controls feature explicit Tailwind focus classes: `focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2`.

---

## 7. Mobile Responsiveness & Layout Adaptations

| Screen Width | Viewport Tier | Wizard Shell Adaptations | Question View Adaptations | Navigation Controls |
|---|---|---|---|---|
| **< 640px** | Mobile Portrait | Padding `p-4 sm:p-6`. Single column container. | Compact StepIndicator (progress bar + "Step X of 4" text). Chips render as single-column stacks (`grid-cols-1`). | Full-width or stacked buttons with prominent 48px touch targets. |
| **640px – 1023px** | Tablet | Padding `p-8`. Centered max-w-2xl. | Full 4-step progress nodes with concise labels. Task chips render in 2-column grid (`grid-cols-2`). | Flex row (`justify-between`), buttons auto-width (`min-w-[120px]`). |
| **>= 1024px** | Desktop | Padding `p-10`. Centered max-w-3xl. | Full 4-step progress nodes with titles and descriptions. Binary toggles side-by-side. | Standard flex row with generous spacing. |

---

## 8. Files to Touch & Architecture Map

Feature 3 creates dedicated presentation directories under `src/components/wizard/` and centralized copy under `src/constants/`:

```
src/
├── constants/
│   └── intakeCopy.ts                   # Centralized copy dictionary for all wizard text
├── components/
│   └── wizard/
│       ├── WizardShell.tsx             # Outer card shell, reassurance banner & layout
│       ├── StepIndicator.tsx           # Accessible 4-step progress indicator
│       ├── NavigationControls.tsx      # Previous / Next navigation buttons
│       ├── index.ts                    # Barrel export for wizard components
│       └── questions/
│           ├── QuestionOneTaskView.tsx          # 4 task chips (1-2 selections)
│           ├── QuestionTwoSubjectView.tsx       # Subject chips + 150-char textarea
│           ├── QuestionThreeEnvironmentView.tsx # Binary remote vs. active toggle
│           └── QuestionFourAmbitionView.tsx    # Binary workforce vs. grad study toggle
└── app/
    └── page.tsx                        # Root page integrating the Wizard preview
```

---

## 9. Verification & Acceptance Criteria Matrix (AC-01 through AC-08)

| Criterion ID | Target Requirement | Verification Procedure | Pass Criteria |
|---|---|---|---|
| **AC-01** | **Centralized Reassuring Copy Contract** | Inspect `src/constants/intakeCopy.ts` and component JSX files. | 100% of user-facing questions, microcopy, button labels, step titles, character count labels, and placeholders reside in `src/constants/intakeCopy.ts`. Zero hardcoded user strings in JSX. Tone is calm, plain, and non-judgmental. |
| **AC-02** | **WizardShell Presentation Layout** | Inspect `WizardShell.tsx` rendering on `/`. | `WizardShell` renders a calming centered card (`max-w-3xl`) utilizing the Educational Blue & Slate theme (`bg-white`, `border-edu-slate-200`, `shadow-sm`), featuring a reassurance header banner and embedding the active question and navigation slots. |
| **AC-03** | **StepIndicator Navigation & States (Steps 1–4)** | Inspect `StepIndicator.tsx` across steps 1 through 4. | Renders 4 steps inside an accessible `<nav>` wrapper with `<ol role="list">`. Correctly exhibits `completed` (check icon), `current` (`aria-current="step"`, `bg-edu-primary`), and `upcoming` (slate neutral) visual states. |
| **AC-04** | **QuestionOneTaskView (1–2 Task Selection Chips)** | Render `QuestionOneTaskView` and toggle selections. | Renders 4 task chips. Allows 1 or 2 visual selections with distinct active/unselected styles. Displays dynamic counter (`"1 of 2 selected"`, `"2 of 2 selected"`). Touch targets exceed 44px. |
| **AC-05** | **QuestionTwoSubjectView (Subject Chips & Capped Textarea)** | Render `QuestionTwoSubjectView`, select chips, and type in textarea. | Renders selectable subject chips and a `<textarea>` with strict `maxLength={150}`. Live character counter updates dynamically (`X/150`). When nearing cap (>=140 chars), counter shifts to gentle warning tint (`text-friction-700`). |
| **AC-06** | **QuestionThreeEnvironmentView (Binary Work Setting Toggle)** | Render `QuestionThreeEnvironmentView` and toggle options. | Renders binary toggle cards for "Remote & Focused Desk" vs. "Active, Field & Lab" with distinct active (`border-edu-interactive bg-edu-blue-50`) and unselected states. Accessible radio semantics enforced. |
| **AC-07** | **QuestionFourAmbitionView (Binary Post-College Toggle)** | Render `QuestionFourAmbitionView` and toggle options. | Renders binary toggle cards for "Direct 2–4 Year Workforce" vs. "Graduate & Specialized Study" with distinct active and unselected styling. Accessible radio semantics enforced. |
| **AC-08** | **NavigationControls & Accessibility Guarantees** | Inspect `NavigationControls.tsx` and run keyboard navigation test. | Previous and Next buttons render with distinct active and visually disabled states (Previous disabled on Step 1). All interactive controls across the wizard maintain minimum 44×44px touch targets, full keyboard accessibility (Tab, Space, Enter), and visible focus rings. Next.js builds with zero TypeScript errors. |

---

## 10. Decisions, Simplifications & Tradeoffs

1. **Strict Copy Centralization in `intakeCopy.ts`**:
   - *Decision*: Place every user-facing string in a single typed constant module rather than inlining copy inside component JSX.
   - *Rationale*: High school students experiencing academic anxiety are sensitive to phrasing. Centralizing copy enables rapid tuning of tone, tone audits, and future localization without modifying component logic.
2. **Presentation Props without Internal State Machine**:
   - *Decision*: Keep presentation components controlled via props (`selectedTaskIds`, `onToggleTask`, etc.) rather than introducing XState or complex reducer state machines in Feature 3.
   - *Rationale*: Adheres to single-responsibility engineering. Feature 3 validates the visual contracts, touch ergonomics, and accessibility landmarks. Feature 4 will layer on the state machine, input validation, and draft persistence.
3. **150-Character Textarea Hard Cap**:
   - *Decision*: Enforce a strict 150-character limit directly on the Question 2 textarea.
   - *Rationale*: Prevents prompt injection and excessive token consumption when forwarded to Gemini 1.5 Flash in downstream features, while preventing cognitive fatigue for students writing their thoughts.
4. **Binary Toggles for Q3 and Q4**:
   - *Decision*: Present Questions 3 and 4 as clean 2-choice binary toggle cards.
   - *Rationale*: Reduces decision paralysis. Students facing overwhelming choices benefit from high-contrast, binary dilemmas rather than sprawling 10-choice menus.

---

## 11. Specification Gate Assessment

### Gate Status: **SPECIFICATION GATE: PASS**

**Rationale**:
- All presentation components for Feature 3 (`WizardShell`, `StepIndicator`, `QuestionOneTaskView`, `QuestionTwoSubjectView`, `QuestionThreeEnvironmentView`, `QuestionFourAmbitionView`, `NavigationControls`) are fully defined with explicit prop interfaces, semantic HTML tags, and visual state styling.
- Out-of-scope boundaries (state machines, validation algorithms, storage persistence, API endpoints) are strictly declared and deferred.
- Copy centralization contract (`src/constants/intakeCopy.ts`) specifies exact text, calming tone rules, and character counter strings.
- Accessibility standards (WCAG AA/AAA, 44px touch targets, keyboard navigation, `aria-current`, `aria-live`) are rigorously specified.
- Mobile responsiveness, layout breakpoints, and component file hierarchy are comprehensively mapped.
- Numbered Acceptance Criteria AC-01 through AC-08 provide verifiable verification benchmarks.
- Ready for implementation on branch `feature/3-intake-wizard-ui`.
