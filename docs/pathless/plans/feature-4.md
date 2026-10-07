---
doc: implementation-plan
feature: 4-intake-state-machine
project: PathwayAI - College Major and Career Triage MVP
status: ready-for-execution
gate: PASS
---

# Feature 4: Step-by-Step Implementation Plan
## Intake State Machine, Step Guards, and Transient Session Storage

This implementation plan defines the sequential phases required to execute **Feature 4: Intake State Machine** on branch `feature/4-intake-state-machine` in accordance with the technical contract ([docs/pathway/contracts/feature-4.md](file:///d:/Hackathon/Beta_Folder/docs/pathway/contracts/feature-4.md)).

---

## 1. Overview of Deliverables & Scaffolding Scope

Feature 4 transforms the static presentation layer delivered in Feature 3 into an empathetic, deterministic, client-side state machine. It introduces centralized React Context and reducer management, strict multi-step validation, forward-skipping navigation guards, reload-surviving transient `sessionStorage` with safe in-memory fallback, and a teacher/counselor and student data reset action.

All Gemini AI API queries, server Route Handlers, SQLite database migrations, and 4-card career dossier rendering are strictly excluded and deferred to Feature 5 onward.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               PHASED EXECUTION PIPELINE                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Centralized Copy Updates & Typings Contract                                   │
│          - Update intakeCopy.ts (validation, reset dialog, nickname, storage notice)   │
│          - Declare IntakeState, IntakeAction, IntakeContextValue in intake.ts          │
│          - Define intakeStoredStateSchema in intake.schema.ts                          │
│                                    ↓                                                   │
│ Phase 2: Transient Storage Adapter & Fallback Engine                                   │
│          - Implement SafeStorage interface & safeSessionStorage adapter                │
│          - Implement MemoryStorage fallback for private browsing / SecurityError       │
│                                    ↓                                                   │
│ Phase 3: Hydration-Safe Hook `useWizardSession`                                        │
│          - Manage SSR-safe hydration lifecycle (isHydrated guard)                     │
│          - Auto-sync state to sessionStorage under 'pathway_intake_state_v1'           │
│          - Provide clean purgeSession() method for reset protocol                      │
│                                    ↓                                                   │
│ Phase 4: State Machine Reducer & Validation Engine (`IntakeContext.tsx`)               │
│          - Implement pure validation functions (isStep1Valid, isStep2Valid, etc.)      │
│          - Implement navigation guard logic (canAccessStep)                            │
│          - Implement pure intakeReducer and IntakeProvider context                     │
│                                    ↓                                                   │
│ Phase 5: Consumer Hook & Reset Action Modal                                            │
│          - Create useIntake hook with selectors and semantic dispatchers               │
│          - Build ResetConfirmationModal (accessible, keyboard-trapped, calm copy)      │
│          - Build privacy-safe NicknameInput component (autoComplete="off")             │
│                                    ↓                                                   │
│ Phase 6: Wizard UI Components Integration                                              │
│          - Connect WizardShell, StepIndicator, and NavigationControls                  │
│          - Connect Question views (Q1 tasks, Q2 subject & rationale, Q3 env, Q4 amb)  │
│          - Decommission prototype quick-switcher in src/app/page.tsx                   │
│                                    ↓                                                   │
│ Phase 7: Verification, Focused Testing & Acceptance Criteria Gate                      │
│          - Execute unit tests for reducer, validation, guards, and storage             │
│          - Execute integration tests for Alex persona 4-step flow & reset              │
│          - Run TypeScript check & Next.js production build verification                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Hierarchy & File Breakdown

```
src/
├── constants/
│   └── intakeCopy.ts                   # Phase 1: Centralized validation, reset, and nickname copy
├── types/
│   └── intake.ts                       # Phase 1: State, action, validation, and context type definitions
├── schemas/
│   └── intake.schema.ts                # Phase 1: Zod schema for safe storage hydration parsing
├── lib/
│   └── storage/
│       ├── safeStorage.ts              # Phase 2: SafeStorage interface, safeSessionStorage, MemoryStorage
│       └── index.ts                    # Phase 2: Storage barrel export
├── hooks/
│   ├── useWizardSession.ts             # Phase 3: Hydration-safe sessionStorage synchronization hook
│   ├── useIntake.ts                    # Phase 5: Consumer hook with selectors, guards, and actions
│   └── index.ts                        # Phase 5: Hooks barrel export
├── context/
│   ├── IntakeContext.tsx               # Phase 4: IntakeContext, IntakeProvider, reducer, and validation
│   └── index.ts                        # Phase 4: Context barrel export
├── components/
│   └── wizard/
│       ├── ResetConfirmationModal.tsx  # Phase 5: Accessible confirmation dialog for data reset
│       ├── NicknameInput.tsx           # Phase 5: Optional privacy-safe student nickname input
│       ├── WizardShell.tsx             # Phase 6: Extended with reset button, nickname slot, provider
│       ├── StepIndicator.tsx           # Phase 6: Extended with canAccessStep guarded navigation
│       ├── NavigationControls.tsx      # Phase 6: Connected to current step validity & actions
│       ├── questions/
│       │   ├── QuestionOneTaskView.tsx          # Phase 6: Wired to state.answers.q1TaskIds & errors
│       │   ├── QuestionTwoSubjectView.tsx       # Phase 6: Wired to subject, mandatory rationale & errors
│       │   ├── QuestionThreeEnvironmentView.tsx # Phase 6: Wired to state.answers.q3Environment
│       │   └── QuestionFourAmbitionView.tsx    # Phase 6: Wired to state.answers.q4Ambition
│       └── index.ts                    # Phase 6: Wizard barrel export updates
└── app/
    └── page.tsx                        # Phase 6: Clean refactor consuming IntakeProvider and useIntake
```

---

## 3. State Schema Interfaces & Reducer Action Types

### 3.1 State Schema Interfaces (`src/types/intake.ts`)

```typescript
export type EnvironmentChoice = 'REMOTE_DESK' | 'ACTIVE_FIELD_LAB';
export type AmbitionChoice = 'WORKFORCE_DIRECT' | 'GRADUATE_STUDY';

export interface IntakeAnswersState {
  q1TaskIds: string[];                       // 1-2 items from Task options
  q2SubjectId: string | null;                // 1 item from Subject options
  q2Rationale: string;                       // 1-150 characters (mandatory, trimmed length >= 1)
  q3Environment: EnvironmentChoice | null;   // Binary choice
  q4Ambition: AmbitionChoice | null;         // Binary choice
}

export interface IntakeValidationErrors {
  q1?: string;
  q2Subject?: string;
  q2Rationale?: string;
  q3?: string;
  q4?: string;
  general?: string;
}

export interface IntakeState {
  currentStep: 1 | 2 | 3 | 4;
  studentNickname: string;
  answers: IntakeAnswersState;
  validationErrors: IntakeValidationErrors;
  isResetDialogOpen: boolean;
  isCompleted: boolean;
  isHydrated: boolean;                       // SSR hydration protection flag
}

export interface IntakeStoredState {
  version: number;
  currentStep: 1 | 2 | 3 | 4;
  studentNickname: string;
  answers: IntakeAnswersState;
  timestamp: number;
}
```

### 3.2 Reducer Action Types (`IntakeAction`)

```typescript
export type IntakeAction =
  | { type: 'SET_NICKNAME'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_SUBJECT'; payload: string }
  | { type: 'SET_RATIONALE'; payload: string }
  | { type: 'SET_ENVIRONMENT'; payload: EnvironmentChoice }
  | { type: 'SET_AMBITION'; payload: AmbitionChoice }
  | { type: 'GO_TO_STEP'; payload: 1 | 2 | 3 | 4 }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'OPEN_RESET_DIALOG' }
  | { type: 'CLOSE_RESET_DIALOG' }
  | { type: 'RESET_STATE' }
  | { type: 'HYDRATE_STATE'; payload: Partial<IntakeState> }
  | { type: 'SET_HYDRATED' };
```

### 3.3 Context Value Interface (`IntakeContextValue`)

```typescript
export interface IntakeContextValue {
  state: IntakeState;
  dispatch: React.Dispatch<IntakeAction>;
  
  // Guard & Validation Selectors
  isStepValid: (step: 1 | 2 | 3 | 4) => boolean;
  canAccessStep: (targetStep: 1 | 2 | 3 | 4) => boolean;
  isCurrentStepValid: boolean;
  
  // Semantic Action Callbacks
  setNickname: (nickname: string) => void;
  toggleTask: (taskId: string) => void;
  setSubject: (subjectId: string) => void;
  setRationale: (rationale: string) => void;
  setEnvironment: (env: EnvironmentChoice) => void;
  setAmbition: (ambition: AmbitionChoice) => void;
  goToStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  previousStep: () => void;
  openResetDialog: () => void;
  closeResetDialog: () => void;
  resetState: () => void;
}
```

---

## 4. Custom Hook `useWizardSession` & Transient Storage Specification

### 4.1 Safe Storage Adapter (`src/lib/storage/safeStorage.ts`)

To protect against browser environments that throw `SecurityError` (e.g. strict Safari Private Browsing) or `QuotaExceededError`, all storage calls are routed through an abstraction:

```typescript
export interface SafeStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  isMemoryFallback: boolean;
}
```

- **`MemoryStorage` Class**: Implements `SafeStorage` using an in-memory `Map<string, string>`.
- **`safeSessionStorage` Factory**: Evaluates storage availability using a throwaway key (`__pathway_probe__`). If access succeeds, returns `window.sessionStorage` wrapper; otherwise, returns a persistent `MemoryStorage` instance.

### 4.2 Hook Architecture: `useWizardSession` (`src/hooks/useWizardSession.ts`)

```typescript
export const STORAGE_KEY = 'pathway_intake_state_v1';
export const STORAGE_VERSION = 1;

export function useWizardSession(
  state: IntakeState,
  dispatch: React.Dispatch<IntakeAction>
) {
  // 1. Initial Mount Hydration (SSR-Safe)
  useEffect(() => {
    const storage = getSafeSessionStorage();
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const validated = intakeStoredStateSchema.safeParse(parsed);
        if (validated.success) {
          dispatch({
            type: 'HYDRATE_STATE',
            payload: {
              currentStep: validated.data.currentStep,
              studentNickname: validated.data.studentNickname,
              answers: validated.data.answers,
            },
          });
        } else {
          // Corrupted data: purge and start fresh
          storage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      storage.removeItem(STORAGE_KEY);
    } finally {
      dispatch({ type: 'SET_HYDRATED' });
    }
  }, [dispatch]);

  // 2. State-to-Storage Synchronization (Skipped until hydrated)
  useEffect(() => {
    if (!state.isHydrated) return;

    const storage = getSafeSessionStorage();
    const payload: IntakeStoredState = {
      version: STORAGE_VERSION,
      currentStep: state.currentStep,
      studentNickname: state.studentNickname,
      answers: state.answers,
      timestamp: Date.now(),
    };

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Quietly catches quota exceptions; session continues in memory
    }
  }, [state.answers, state.currentStep, state.studentNickname, state.isHydrated]);

  // 3. Purge Helper for Teacher & Student Reset
  const purgeSession = useCallback(() => {
    const storage = getSafeSessionStorage();
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
  }, []);

  return { purgeSession };
}
```

---

## 5. Pure Validation Engine & Step Guard Logic

### 5.1 Validation Functions

Validation rules are pure functions isolated from React lifecycle:

1. **Step 1 (`isStep1Valid`)**:
   - `answers.q1TaskIds.length >= 1 && answers.q1TaskIds.length <= 2`
2. **Step 2 (`isStep2Valid`)**:
   - Subject selected: `answers.q2SubjectId !== null && answers.q2SubjectId.trim() !== ''`
   - Mandatory Rationale: `answers.q2Rationale.trim().length >= 1 && answers.q2Rationale.length <= 150`
3. **Step 3 (`isStep3Valid`)**:
   - Binary choice: `answers.q3Environment === 'REMOTE_DESK' || answers.q3Environment === 'ACTIVE_FIELD_LAB'`
4. **Step 4 (`isStep4Valid`)**:
   - Binary choice: `answers.q4Ambition === 'WORKFORCE_DIRECT' || answers.q4Ambition === 'GRADUATE_STUDY'`

### 5.2 Navigation Guard (`canAccessStep`)

```typescript
export function canAccessStep(
  targetStep: 1 | 2 | 3 | 4,
  currentStep: 1 | 2 | 3 | 4,
  answers: IntakeAnswersState
): boolean {
  // Step 1 is always accessible
  if (targetStep === 1) return true;

  // Regressive navigation is always permitted
  if (targetStep <= currentStep) return true;

  // Forward navigation requires all prior steps to be valid
  for (let s = 1; s < targetStep; s++) {
    if (!validateStep(s as 1 | 2 | 3 | 4, answers)) {
      return false;
    }
  }

  return true;
}
```

---

## 6. Integration Plan with Feature 3 UI Components

### 6.1 `WizardShell.tsx`
- Wrap question content inside `IntakeProvider`.
- Insert `NicknameInput` component above Question 1 or within the header banner.
- Add a calm `"Start Over"` trigger button in the footer/header invoking `openResetDialog()`.
- Render `ResetConfirmationModal` within the shell container.

### 6.2 `StepIndicator.tsx`
- Replace inert `<div>` step indicators with accessible `<button>` nodes (or interactive nodes with `role="button"`).
- Connect `onClick` to `goToStep(stepItem.step)`.
- If `canAccessStep(stepItem.step)` is false:
  - Add `disabled`, `aria-disabled="true"`, `cursor-not-allowed` styles.
  - Clicking triggers polite ARIA announcement `INTAKE_COPY.validation.navigationBlocked`.

### 6.3 `NavigationControls.tsx`
- Wire `onPrevious` to `previousStep()`.
- Wire `onNext` to `nextStep()`.
- Set `isPreviousDisabled = currentStep === 1`.
- Set `isNextDisabled = !isCurrentStepValid`.
- Set `isLastStep = currentStep === 4`.

### 6.4 Question Views
- **`QuestionOneTaskView`**: Wire `selectedTaskIds` to `state.answers.q1TaskIds` and `onToggleTask` to `toggleTask`. Display validation error if present.
- **`QuestionTwoSubjectView`**: Wire `selectedSubjectId` to `state.answers.q2SubjectId` and `onSelectSubject` to `setSubject`. Wire `noteText` to `state.answers.q2Rationale` and `onChangeNoteText` to `setRationale`. Update label from `(Optional)` to required copy. Display inline validation error if present.
- **`QuestionThreeEnvironmentView`**: Wire `selectedEnvironment` to `state.answers.q3Environment` and `onSelectEnvironment` to `setEnvironment`.
- **`QuestionFourAmbitionView`**: Wire `selectedAmbition` to `state.answers.q4Ambition` and `onSelectAmbition` to `setAmbition`.

### 6.5 `src/app/page.tsx`
- Decommission the prototype quick-switcher (`[1, 2, 3, 4]`).
- Clean up presentational `useState` variables (`selectedTasks`, `selectedSubject`, etc.) and replace them entirely with `useIntake()`.
- Render completion summary dynamically using `studentNickname` if provided.

---

## 7. Teacher/Counselor & Student Data Reset Action Protocol

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA RESET WORKFLOW                             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Trigger: Student/Counselor clicks "Start Over" / "Reset Intake"     │
│ 2. State: dispatch({ type: 'OPEN_RESET_DIALOG' })                      │
│ 3. UI: ResetConfirmationModal opens with aria-modal="true"             │
│    - Trap focus inside dialog                                          │
│    - Default focus lands on "Keep my answers" (Cancel) button          │
│ 4. If Cancel (or Escape key / backdrop click):                         │
│    - dispatch({ type: 'CLOSE_RESET_DIALOG' })                          │
│    - Focus returns to trigger button                                   │
│ 5. If Confirm ("Yes, start over"):                                     │
│    - purgeSession() removes 'pathway_intake_state_v1'                  │
│    - dispatch({ type: 'RESET_STATE' })                                 │
│    - currentStep returns to 1, answers cleared, nickname cleared       │
│    - Dialog closes; focus shifts to Step 1 legend landmark             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Step-by-Step Implementation Roadmap

---

### Step 1: Centralized Copy & Typings Contract
**Target Files**:
- `src/constants/intakeCopy.ts`
- `src/types/intake.ts`
- `src/schemas/intake.schema.ts`

**Implementation Scope**:
1. In `src/constants/intakeCopy.ts`:
   - Update `questionTwo.textAreaLabel` to remove `(Optional)`: `'What makes you curious or nervous about this area? (A sentence or two)'`.
   - Add `validation` dictionary (`step1Required`, `step2SubjectRequired`, `step2RationaleRequired`, `step2RationaleMaxLength`, `step3EnvironmentRequired`, `step4AmbitionRequired`, `navigationBlocked`).
   - Add `resetDialog` dictionary (`triggerButton`, `counselorTriggerButton`, `title`, `description`, `confirm`, `cancel`, `ariaLabel`).
   - Add `nicknamePrompt` dictionary (`label`, `placeholder`, `helperText`).
   - Add `storageNotice` dictionary (`inMemoryFallback`).
2. In `src/types/intake.ts`:
   - Export `IntakeAnswersState`, `IntakeValidationErrors`, `IntakeState`, `IntakeAction`, `IntakeContextValue`, `IntakeStoredState`.
3. In `src/schemas/intake.schema.ts`:
   - Export `intakeStoredStateSchema` validating stored JSON payload on hydration.

**Mapped Acceptance Criteria**:
- **AC-STATE-01** (Context & State Contracts)
- **AC-STATE-02** (Step 1 Copy Alignment)
- **AC-STATE-03** (Step 2 Copy Alignment)

---

### Step 2: Safe Storage Adapter & In-Memory Fallback
**Target Files**:
- `src/lib/storage/safeStorage.ts`
- `src/lib/storage/index.ts`

**Implementation Scope**:
1. Define `SafeStorage` interface (`getItem`, `setItem`, `removeItem`, `clear`, `isMemoryFallback`).
2. Implement `MemoryStorage` class using private `Map<string, string>`.
3. Implement `getSafeSessionStorage()` checking `window.sessionStorage` availability via probe key test.
4. Catch `SecurityError`, `QuotaExceededError`, and SSR environments to transparently return `MemoryStorage`.

**Mapped Acceptance Criteria**:
- **AC-STATE-06** (Transient Storage Adapter)
- **AC-STATE-08** (In-Memory Fallback on Exception)

---

### Step 3: Hydration-Safe Session Hook (`useWizardSession`)
**Target Files**:
- `src/hooks/useWizardSession.ts`

**Implementation Scope**:
1. Create `useWizardSession(state, dispatch)`.
2. On initial mount (`useEffect`), read `pathway_intake_state_v1` through `getSafeSessionStorage()`.
3. Validate payload with `intakeStoredStateSchema`.
4. If valid, dispatch `HYDRATE_STATE`; if invalid/corrupt, purge item. Always dispatch `SET_HYDRATED`.
5. On subsequent updates when `state.isHydrated === true`, serialize state to `sessionStorage`.
6. Export `purgeSession()` function for the reset workflow.

**Mapped Acceptance Criteria**:
- **AC-STATE-06** (Transient `sessionStorage` Persistence)
- **AC-STATE-07** (Storage Purge Protocol)
- **AC-STATE-08** (Safe Storage Sync)

---

### Step 4: Reducer, Validation Engine & Context Provider (`IntakeContext.tsx`)
**Target Files**:
- `src/context/IntakeContext.tsx`
- `src/context/index.ts`

**Implementation Scope**:
1. Implement pure validation functions: `isStep1Valid`, `isStep2Valid`, `isStep3Valid`, `isStep4Valid`, `validateStep`.
2. Implement navigation guard: `canAccessStep(targetStep, currentStep, answers)`.
3. Implement pure `intakeReducer` handling all action types (`TOGGLE_TASK` with 2-chip limit, `SET_SUBJECT`, `SET_RATIONALE` with 150-char slice, `SET_ENVIRONMENT`, `SET_AMBITION`, `GO_TO_STEP`, `NEXT_STEP`, `PREVIOUS_STEP`, `OPEN_RESET_DIALOG`, `CLOSE_RESET_DIALOG`, `RESET_STATE`, `HYDRATE_STATE`, `SET_HYDRATED`).
4. Implement `IntakeProvider` wrapping children, instantiating `useReducer`, and mounting `useWizardSession`.

**Mapped Acceptance Criteria**:
- **AC-STATE-01** (Centralized Context & Reducer State)
- **AC-STATE-02** (Step 1 Validation Engine)
- **AC-STATE-03** (Step 2 Validation Engine)
- **AC-STATE-04** (Steps 3 & 4 Validation Engine)
- **AC-STATE-05** (Step Navigation Guards)

---

### Step 5: Consumer Hook & Reset Modal Components
**Target Files**:
- `src/hooks/useIntake.ts`
- `src/hooks/index.ts`
- `src/components/wizard/ResetConfirmationModal.tsx`
- `src/components/wizard/NicknameInput.tsx`

**Implementation Scope**:
1. Create `useIntake()` hook reading `IntakeContext`. Throw descriptive error if used outside `IntakeProvider`.
2. Build `ResetConfirmationModal.tsx`:
   - Accessible `<div role="dialog" aria-modal="true">` with backdrop.
   - Trap keyboard focus on `Tab` / `Shift+Tab`.
   - Close on `Escape` key or backdrop click.
   - Primary focus on "Keep my answers" (cancel button) to prevent accidental data loss.
   - Confirm button invokes `resetState()` (which calls `purgeSession()` and dispatches `RESET_STATE`).
3. Build `NicknameInput.tsx`:
   - Privacy-safe text input with `autoComplete="off"`, `spellCheck="false"`, `maxLength={50}`.
   - Renders calm helper copy from `INTAKE_COPY.nicknamePrompt`.

**Mapped Acceptance Criteria**:
- **AC-STATE-01** (useIntake Consumer Hook)
- **AC-STATE-07** (Counselor & Student Data Reset Protocol)

---

### Step 6: UI Component Wiring & App Page Refactor
**Target Files**:
- `src/components/wizard/WizardShell.tsx`
- `src/components/wizard/StepIndicator.tsx`
- `src/components/wizard/NavigationControls.tsx`
- `src/components/wizard/questions/QuestionOneTaskView.tsx`
- `src/components/wizard/questions/QuestionTwoSubjectView.tsx`
- `src/components/wizard/questions/QuestionThreeEnvironmentView.tsx`
- `src/components/wizard/questions/QuestionFourAmbitionView.tsx`
- `src/app/page.tsx`

**Implementation Scope**:
1. **`WizardShell.tsx`**: Add "Start Over" button trigger; render `ResetConfirmationModal`; render `NicknameInput`.
2. **`StepIndicator.tsx`**: Add guarded `onClick` using `canAccessStep`. Update visual styling (`cursor-pointer` vs `cursor-not-allowed`, `aria-disabled`).
3. **`NavigationControls.tsx`**: Connect `onPrevious` and `onNext` directly to reducer actions.
4. **Question Views**: Bind components to global state via props; display inline validation messages when touched/invalid.
5. **`src/app/page.tsx`**: Wrap tree in `IntakeProvider`. Remove prototype quick switcher buttons. Bind `useIntake()`. Render completion review banner with personalized nickname.

**Mapped Acceptance Criteria**:
- **AC-STATE-01** through **AC-STATE-07** (Full UI Integration)

---

### Step 7: Verification, Focused Testing & Acceptance Criteria Gate
**Target Files**:
- `tests/unit/intakeReducer.test.ts`
- `tests/unit/stepValidation.test.ts`
- `tests/unit/stepGuards.test.ts`
- `tests/unit/safeStorage.test.ts`
- `tests/integration/useWizardSession.test.tsx`

**Implementation Scope**:
1. Execute unit tests verifying pure state logic.
2. Verify transient persistence survives page reload and purges on reset.
3. Verify memory fallback activates when storage throws exceptions.
4. Run `npm run type-check` (zero TypeScript errors) and `npm run build` (Next.js production build passes).

**Mapped Acceptance Criteria**:
- **AC-STATE-01** through **AC-STATE-08** (Full Verification)

---

## 9. Comprehensive Testing Strategy

### 9.1 Unit Test Specifications

#### 1. Reducer State Transition Unit Tests (`tests/unit/intakeReducer.test.ts`)
- **UT-RED-01**: `TOGGLE_TASK` adds a task ID when 0 selected; adds 2nd task ID when 1 selected; ignores 3rd task ID when 2 selected.
- **UT-RED-02**: `TOGGLE_TASK` removes an existing task ID when clicked again.
- **UT-RED-03**: `SET_SUBJECT` updates `q2SubjectId` and clears `validationErrors.q2Subject`.
- **UT-RED-04**: `SET_RATIONALE` updates `q2Rationale`, clamps input to 150 characters (`.slice(0, 150)`), and clears error when length $\ge$ 1.
- **UT-RED-05**: `SET_ENVIRONMENT` updates `q3Environment` with binary choice (`REMOTE_DESK` or `ACTIVE_FIELD_LAB`).
- **UT-RED-06**: `SET_AMBITION` updates `q4Ambition` with binary choice (`WORKFORCE_DIRECT` or `GRADUATE_STUDY`).
- **UT-RED-07**: `NEXT_STEP` increments `currentStep` from 1 to 2 when Step 1 is valid.
- **UT-RED-08**: `NEXT_STEP` blocks increment and sets validation error when Step 1 has 0 tasks.
- **UT-RED-09**: `PREVIOUS_STEP` decrements `currentStep` from 3 to 2 and preserves all answers.
- **UT-RED-10**: `PREVIOUS_STEP` on Step 1 is a no-op (`currentStep` remains 1).
- **UT-RED-11**: `RESET_STATE` restores `INITIAL_INTAKE_STATE` (step 1, empty answers, closed dialog).
- **UT-RED-12**: `SET_NICKNAME` trims input and limits length to 50 characters.

#### 2. Validation Engine Unit Tests (`tests/unit/stepValidation.test.ts`)
- **UT-VAL-01**: `isStep1Valid` returns `false` for `[]`; returns `true` for `['BUILD_SYSTEMS']`; returns `true` for `['BUILD_SYSTEMS', 'ANALYZE_PATTERNS']`; returns `false` for 3 items.
- **UT-VAL-02**: `isStep2Valid` returns `false` when `q2SubjectId === null`.
- **UT-VAL-03**: `isStep2Valid` returns `false` when rationale is empty (`""`).
- **UT-VAL-04**: `isStep2Valid` returns `false` when rationale is whitespace-only (`"   \n\t  "`).
- **UT-VAL-05**: `isStep2Valid` returns `true` when subject is chosen and rationale is 1 character (`"A"`).
- **UT-VAL-06**: `isStep2Valid` returns `true` when rationale is exactly 150 characters.
- **UT-VAL-07**: `isStep2Valid` returns `false` when rationale exceeds 150 characters.
- **UT-VAL-08**: `isStep3Valid` returns `false` for `null`; returns `true` for `'REMOTE_DESK'`; returns `true` for `'ACTIVE_FIELD_LAB'`.
- **UT-VAL-09**: `isStep4Valid` returns `false` for `null`; returns `true` for `'WORKFORCE_DIRECT'`; returns `true` for `'GRADUATE_STUDY'`.

#### 3. Step Navigation Guards Unit Tests (`tests/unit/stepGuards.test.ts`)
- **UT-GRD-01**: `canAccessStep(1, currentStep, answers)` always returns `true`.
- **UT-GRD-02**: `canAccessStep(2, 1, answers)` returns `true` if Step 1 is valid; returns `false` if Step 1 is invalid.
- **UT-GRD-03**: `canAccessStep(4, 1, answers)` returns `false` when Steps 1, 2, and 3 are incomplete.
- **UT-GRD-04**: `canAccessStep(2, 3, answers)` returns `true` (regressive navigation).
- **UT-GRD-05**: Retroactive invalidation: User is on Step 3, navigates to Step 1, deselects all tasks. `canAccessStep(3, 1, answers)` now returns `false`.

#### 4. Safe Storage Adapter Unit Tests (`tests/unit/safeStorage.test.ts`)
- **UT-STO-01**: Normal operation: sets, gets, and removes item in `sessionStorage`.
- **UT-STO-02**: Private mode simulation: When `sessionStorage.setItem` throws `SecurityError`, adapter transparently falls back to `MemoryStorage`.
- **UT-STO-03**: Quota exhaustion simulation: When `sessionStorage.setItem` throws `QuotaExceededError`, adapter gracefully handles exception.
- **UT-STO-04**: `MemoryStorage` correctly stores and purges items in memory without throwing errors.

---

### 9.2 Component & Integration Test Specifications

#### 1. Hook Integration Tests (`tests/integration/useWizardSession.test.tsx`)
- **IT-SES-01 (Hydration Safety)**: Initial mount renders without hydration mismatch; state hydrates accurately from `sessionStorage`.
- **IT-SES-02 (Reload Survival)**: Changing step to 2 and setting Q1 answers persists to `sessionStorage`; re-mounting hook restores Step 2 with exact answers.
- **IT-SES-03 (Corrupted Storage Recovery)**: Storing invalid JSON under `pathway_intake_state_v1` does not crash app; hook discards key and initializes clean default state.
- **IT-SES-04 (Reset Purge)**: Calling `purgeSession()` removes `pathway_intake_state_v1` completely from storage.

#### 2. End-to-End Persona Walkthrough Test (`Alex Persona Integration`)
- **IT-WIZ-01**:
  1. Student enters nickname `"Alex"`.
  2. Step 1: Selects `BUILD_SYSTEMS` and `ANALYZE_PATTERNS`. Attempts 3rd chip (`HELP_HUMANS`); verify 3rd chip is prevented.
  3. Clicks "Continue" -> Advances to Step 2. Focus shifts to Step 2 landmark.
  4. Step 2: Types `"I love laboratory experiments, but advanced theoretical calculus stresses me out."` (82 chars). Leaves subject unselected.
  5. Clicks "Continue" -> Navigation blocked, inline subject error displayed.
  6. Selects subject `HEALTH_BIO`. Clicks "Continue" -> Advances to Step 3.
  7. Step 3: Selects `REMOTE_DESK`. Clicks "Continue" -> Advances to Step 4.
  8. Step 4: Selects `WORKFORCE_DIRECT`. Clicks "Review Pathways".
  9. Completion banner renders summary with Alex's selected answers.
  10. Student clicks "Start Over" -> Modal appears. Clicks "Yes, start over".
  11. Verifies state returns to Step 1, `sessionStorage` is empty, focus returns to Step 1.

---

## 10. Acceptance Criteria Traceability Matrix

| Acceptance Criterion | Description | Implementing Phase | Verification Artifact |
|---|---|---|---|
| **AC-STATE-01** | Centralized Context Provider & Reducer State | Phase 1, Phase 4, Phase 5 | `IntakeContext.tsx`, `useIntake.ts`, `UT-RED-01..12` |
| **AC-STATE-02** | Step 1 Validation Engine (1–2 Task Chips) | Phase 1, Phase 4, Phase 6 | `QuestionOneTaskView.tsx`, `UT-VAL-01` |
| **AC-STATE-03** | Step 2 Validation Engine (Subject & 1–150 Char Rationale) | Phase 1, Phase 4, Phase 6 | `QuestionTwoSubjectView.tsx`, `UT-VAL-02..07` |
| **AC-STATE-04** | Steps 3 & 4 Binary Choice Validation Engine | Phase 4, Phase 6 | `QuestionThreeEnvironmentView.tsx`, `QuestionFourAmbitionView.tsx`, `UT-VAL-08..09` |
| **AC-STATE-05** | Step Navigation Guards & Skip-Ahead Prevention | Phase 4, Phase 6 | `StepIndicator.tsx`, `NavigationControls.tsx`, `UT-GRD-01..05` |
| **AC-STATE-06** | Transient `sessionStorage` Persistence Across Page Reloads | Phase 2, Phase 3 | `useWizardSession.ts`, `safeStorage.ts`, `IT-SES-01..02` |
| **AC-STATE-07** | Counselor & Student Data Reset Protocol | Phase 3, Phase 5, Phase 6 | `ResetConfirmationModal.tsx`, `WizardShell.tsx`, `IT-WIZ-01` |
| **AC-STATE-08** | Graceful In-Memory Storage Fallback on Exception | Phase 2, Phase 3 | `safeStorage.ts`, `UT-STO-02..04` |

---

## 11. Verification Checklist & Gate Criteria

Before requesting final approval of Feature 4 execution, verify:
- [ ] `npm run type-check` executes with **0 errors**.
- [ ] `npm run lint` executes with **0 errors and 0 warnings**.
- [ ] `npm run build` succeeds cleanly in Next.js App Router production mode.
- [ ] 100% of user-facing strings, validation messages, and reset dialog copy reside in `src/constants/intakeCopy.ts`.
- [ ] `sessionStorage` is strictly used (zero references to `localStorage`).
- [ ] Input fields feature `autoComplete="off"` to prevent browser caching on shared school computers.
- [ ] Step 2 rationale enforces trimmed length $\ge$ 1 and $\le$ 150 characters.
- [ ] Navigation guards block direct jumping to incomplete future steps.
- [ ] Data Reset action completely purges `sessionStorage` and returns state to Step 1.
- [ ] Storage exceptions fallback to in-memory store without console crashes.
- [ ] Zero Gemini API calls, server Route Handlers, SQLite queries, or dossier cards are implemented.
