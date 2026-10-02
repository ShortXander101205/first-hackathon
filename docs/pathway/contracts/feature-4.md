---
doc: contract
feature: 4-intake-state-machine
project: PathwayAI - College Major and Career Triage MVP
status: approved
gate: PASS
---

# Feature 4: Intake State Machine — Technical Contract & Specification

## 1. Executive Summary & Objective

This specification establishes the technical and behavioral contract for **Feature 4: Intake State Machine** of **PathwayAI: College Major and Career Triage MVP** on branch `feature/4-intake-state-machine`.

Feature 4 bridges the static presentation layer delivered in Feature 3 (`WizardShell`, `StepIndicator`, `QuestionOneTaskView`, `QuestionTwoSubjectView`, `QuestionThreeEnvironmentView`, `QuestionFourAmbitionView`, `NavigationControls`) with an anxiety-reducing, robust, client-side state machine. Built specifically for anxious 17–19 year old high school and early college students, this state machine guarantees deterministic step validation, prevents cognitive confusion through strict navigation guards, safeguards privacy via transient tab-scoped session persistence, offers a non-punitive reset protocol, and guarantees rock-solid reliability through an in-memory storage fallback.

### Primary Objectives
1. **Deterministic State Management**: Implement a React Context Provider and strictly typed reducer to govern question responses, step progression (1–4), validation states, and an optional student nickname.
2. **Empathetic & Strict Validation Engine**: Enforce explicit validation constraints:
   - **Step 1 (Q1 Tasks)**: 1–2 chips selected.
   - **Step 2 (Q2 Subject & Rationale)**: 1 primary subject chip selected AND a 1–150 character rationale entered (trimmed length $\ge$ 1).
   - **Step 3 (Q3 Work Setting)**: Binary choice (`REMOTE_DESK` vs. `ACTIVE_FIELD_LAB`).
   - **Step 4 (Q4 Future Ambition)**: Binary choice (`WORKFORCE_DIRECT` vs. `GRADUATE_STUDY`).
3. **Step Navigation Guards**: Prevent students from skipping ahead to uncompleted steps while keeping backward navigation completely unblocked and non-destructive.
4. **Transient Browser Persistence (`sessionStorage`)**: Protect students from losing progress on accidental page reloads (`F5`, browser refresh) without leaking sensitive answers across sessions on shared public library or school lab computers.
5. **Counselor & Student Data Reset Protocol**: Provide a calm, accessible "Start Over" action that purges stored state and resets the wizard to Step 1 with a reassuring confirmation dialog.
6. **Safe Storage Adapter with In-Memory Fallback**: Ensure the intake workflow operates seamlessly when `sessionStorage` is disabled (e.g., strict private browsing modes) or throws security/quota exceptions.
7. **100% Centralized Calm Copy**: Direct all validation guidance, reset dialog strings, and notices into `src/constants/intakeCopy.ts` using a calm, validating, plain tone.
8. **Numbered Acceptance Criteria**: Establish criteria **AC-STATE-01** through **AC-STATE-08** for downstream implementation and testing.

---

## 2. Scope & Boundary Clarifications

To protect architectural boundaries and ensure clean delivery, Feature 4 is strictly confined to client-side state orchestration, validation rules, transient persistence, and presentation synchronization.

### In Scope for Feature 4
- **State Management Architecture**:
  - React Context (`IntakeContext`) and Provider (`IntakeProvider`).
  - Pure reducer function (`intakeReducer`) handling typed actions.
  - Custom consumer hook (`useIntake`).
  - State fields: `currentStep` (1|2|3|4), `answers` (Q1, Q2, Q3, Q4), `studentNickname` (optional), `validationErrors`, `isResetDialogOpen`, `isCompleted`.
- **Validation Rules Engine**:
  - Step 1: 1–2 chips selected.
  - Step 2: 1 subject chip selected AND rationale string of 1–150 characters (whitespace trimmed).
  - Step 3: 1 binary environment choice.
  - Step 4: 1 binary ambition choice.
- **Navigation Guard Logic**:
  - Forward progression disabled if active step is invalid.
  - Direct jump navigation guards (preventing skipping to step $K$ unless all preceding steps $< K$ are valid).
  - Backward navigation always enabled (preserves entered data).
- **Transient Browser Persistence (`sessionStorage`)**:
  - Auto-sync state changes to `sessionStorage` under `pathway_intake_state_v1`.
  - Rehydration on mount with schema validation.
  - Scoped strictly to the browser tab to protect student privacy on shared computers.
- **Reset Protocol & Modal**:
  - Counselor and Student Data Reset action.
  - Accessible confirmation dialog (`ResetConfirmationModal`) with reassuring copy.
  - Complete purge of `sessionStorage` and reset to Step 1 default state.
- **Safe Storage Adapter & In-Memory Fallback**:
  - Detection of storage availability and exceptions (`SecurityError`, `QuotaExceededError`).
  - Transparent in-memory fallback dictionary.
- **Centralized Copy Extensions**:
  - All validation prompts, button labels, and dialog strings centralized in `src/constants/intakeCopy.ts`.
- **Integration with Wizard Shell & Home Page**:
  - Wire `src/app/page.tsx` to consume `IntakeProvider` and `useIntake()`.

### Explicitly Out of Scope (Deferred to Feature 5 onward)
- **Calling the Google Gemini API**: No `@google/generative-ai` SDK calls, prompt synthesis, or AI response generation (deferred to `feature/5-ai-synthesis-service`).
- **Server Route Handlers**: No `/api/intake/submit` API handler implementation or backend request processing (deferred to `feature/5-ai-synthesis-service`).
- **Database Queries & Migrations**: No SQLite table creation, database inserts, or queries (deferred to `feature/6-sqlite-persistence`).
- **Rendering Recommendation Dossier Cards**: No 4-career dossier cards, trial course components, or fit rationale cards rendered on client (deferred to `feature/5-ai-synthesis-service` and `feature/7-counselor-dashboard`).
- **External Psychometric Scoring**: No external testing algorithms or standardized testing computations.

---

## 3. State Management Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   IntakeProvider                                       │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                 IntakeState                                    │   │
│   │  - currentStep: 1 | 2 | 3 | 4                                                  │   │
│   │  - studentNickname: string (optional)                                          │   │
│   │  - answers:                                                                    │   │
│   │      q1TaskIds: string[]                  (1-2 IDs)                            │   │
│   │      q2SubjectId: string | null           (1 ID)                               │   │
│   │      q2Rationale: string                  (1-150 characters)                   │   │
│   │      q3Environment: EnvironmentChoice | null  (Binary choice)                  │   │
│   │      q4Ambition: AmbitionChoice | null        (Binary choice)                  │   │
│   │  - validationErrors: Record<string, string>                                    │   │
│   │  - isResetDialogOpen: boolean                                                  │   │
│   │  - isCompleted: boolean                                                        │   │
│   └───────────────────────────────────────┬────────────────────────────────────────┘   │
│                                           │                                            │
│                 dispatch(action)          │ state updates                              │
│                        │                  ▼                                            │
│   ┌────────────────────┴───────────────────────────────────────────────────────────┐   │
│   │                                intakeReducer                                   │   │
│   │  - SET_NICKNAME         - SET_ENVIRONMENT    - PREVIOUS_STEP                       │   │
│   │  - TOGGLE_TASK          - SET_AMBITION       - OPEN_RESET_DIALOG                   │   │
│   │  - SET_SUBJECT          - GO_TO_STEP         - CLOSE_RESET_DIALOG                  │   │
│   │  - SET_RATIONALE        - NEXT_STEP          - RESET_STATE                         │   │
│   │                                              - HYDRATE_STATE                       │   │
│   └────────────────────┬───────────────────────────────────────────────────────────┘   │
│                        │                                                               │
│                        ▼                                                               │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                       safeSessionStorage Adapter                               │   │
│   │  - Primary: window.sessionStorage ('pathway_intake_state_v1')                  │   │
│   │  - Fallback: in-memory Map<string, string> (for SecurityError/Private Mode)    │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
                                   useIntake() Custom Hook
                                            │
                      ┌─────────────────────┼─────────────────────┐
                      ▼                     ▼                     ▼
                 WizardShell         Question Views       NavigationControls
```

### 3.1 Data Contracts & TypeScript Types (`src/types/intake.ts`)

```typescript
export type EnvironmentChoice = 'REMOTE_DESK' | 'ACTIVE_FIELD_LAB';
export type AmbitionChoice = 'WORKFORCE_DIRECT' | 'GRADUATE_STUDY';

export interface IntakeAnswersState {
  q1TaskIds: string[];
  q2SubjectId: string | null;
  q2Rationale: string;
  q3Environment: EnvironmentChoice | null;
  q4Ambition: AmbitionChoice | null;
}

export interface IntakeValidationErrors {
  q1?: string;
  q2Subject?: string;
  q2Rationale?: string;
  q3?: string;
  q4?: string;
}

export interface IntakeState {
  currentStep: 1 | 2 | 3 | 4;
  studentNickname: string;
  answers: IntakeAnswersState;
  validationErrors: IntakeValidationErrors;
  isResetDialogOpen: boolean;
  isCompleted: boolean;
}

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
  | { type: 'HYDRATE_STATE'; payload: Partial<IntakeState> };

export interface IntakeContextValue {
  state: IntakeState;
  dispatch: React.Dispatch<IntakeAction>;
  // Derived Helper Selectors
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

### 3.2 Initial State Definition

```typescript
export const INITIAL_INTAKE_ANSWERS: IntakeAnswersState = {
  q1TaskIds: [],
  q2SubjectId: null,
  q2Rationale: '',
  q3Environment: null,
  q4Ambition: null,
};

export const INITIAL_INTAKE_STATE: IntakeState = {
  currentStep: 1,
  studentNickname: '',
  answers: INITIAL_INTAKE_ANSWERS,
  validationErrors: {},
  isResetDialogOpen: false,
  isCompleted: false,
};
```

### 3.3 Reducer Behavior Specification

The `intakeReducer` must be a pure, deterministic function adhering strictly to these rules:

1. **`SET_NICKNAME`**:
   - Trims leading/trailing whitespace and limits input length to 50 characters (`payload.trim().slice(0, 50)`).
2. **`TOGGLE_TASK`**:
   - If `payload` exists in `answers.q1TaskIds`, remove it.
   - If `payload` does not exist in `answers.q1TaskIds`:
     - If `q1TaskIds.length < 2`, append `payload`.
     - If `q1TaskIds.length >= 2`, return state unchanged (or emit calm max-limit hint; cannot exceed 2).
   - Clear `validationErrors.q1` if the resulting array length is 1 or 2.
3. **`SET_SUBJECT`**:
   - Sets `answers.q2SubjectId = payload`.
   - Clears `validationErrors.q2Subject`.
4. **`SET_RATIONALE`**:
   - Caps string length strictly to 150 characters (`payload.slice(0, 150)`).
   - Clears `validationErrors.q2Rationale` if `payload.trim().length >= 1`.
5. **`SET_ENVIRONMENT`**:
   - Sets `answers.q3Environment = payload`.
   - Clears `validationErrors.q3`.
6. **`SET_AMBITION`**:
   - Sets `answers.q4Ambition = payload`.
   - Clears `validationErrors.q4`.
7. **`NEXT_STEP`**:
   - Evaluates validity of `currentStep`.
   - If `currentStep` is **valid**:
     - If `currentStep < 4`, increments `currentStep` by 1 and clears errors.
     - If `currentStep === 4`, marks `isCompleted = true`.
   - If `currentStep` is **invalid**:
     - Attaches the corresponding calm error message to `validationErrors` for the current step and keeps `currentStep` unchanged.
8. **`PREVIOUS_STEP`**:
   - If `isCompleted` is true, sets `isCompleted = false` and keeps `currentStep = 4`.
   - If `isCompleted` is false and `currentStep > 1`, decrements `currentStep` by 1.
   - Preserves all answers and clears transient validation error prompts.
9. **`GO_TO_STEP`**:
   - Checks navigation guard: target step $K$ is allowed if $K \le currentStep$ OR all steps $1 \dots K-1$ are valid.
   - If allowed, sets `currentStep = payload`, `isCompleted = false`.
   - If not allowed, rejects jump and sets `validationErrors` on the earliest incomplete step.
10. **`OPEN_RESET_DIALOG` / `CLOSE_RESET_DIALOG`**:
    - Toggles `isResetDialogOpen` boolean without modifying intake answers.
11. **`RESET_STATE`**:
    - Returns `INITIAL_INTAKE_STATE` (step 1, empty answers, empty nickname, closed modal).
12. **`HYDRATE_STATE`**:
    - Merges validated payload from `sessionStorage` into state, preserving sane defaults for missing fields.

---

## 4. Step Validation Engine & Rule Matrix

Validation rules are pure functions that evaluate `IntakeAnswersState` and return boolean results and calm validation messages.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STEP VALIDATION RULES                           │
├────────┬─────────────────────────┬─────────────────────────────────────┤
│ Step 1 │ Tasks & Energy          │ 1 <= q1TaskIds.length <= 2          │
├────────┼─────────────────────────┼─────────────────────────────────────┤
│ Step 2 │ Subject & Rationale     │ q2SubjectId !== null &&             │
│        │                         │ q2Rationale.trim().length >= 1 &&   │
│        │                         │ q2Rationale.length <= 150           │
├────────┼─────────────────────────┼─────────────────────────────────────┤
│ Step 3 │ Work Setting            │ q3Environment === 'REMOTE_DESK' ||  │
│        │                         │ q3Environment === 'ACTIVE_FIELD_LAB'│
├────────┼─────────────────────────┼─────────────────────────────────────┤
│ Step 4 │ Future Ambition         │ q4Ambition === 'WORKFORCE_DIRECT'|| │
│        │                         │ q4Ambition === 'GRADUATE_STUDY'     │
└────────┴─────────────────────────┴─────────────────────────────────────┘
```

### 4.1 Detailed Validation Specifications

#### Step 1: Energy & Tasks Validation
- **Condition**: Exactly 1 or 2 task IDs selected from `BUILD_SYSTEMS`, `ANALYZE_PATTERNS`, `HELP_HUMANS`, `LEAD_ORGANIZING`.
- **Invalid State**: 0 chips selected.
- **Enforcement**:
  - The "Continue" button is disabled when `q1TaskIds.length === 0`.
  - If a user triggers progression without selection, error `INTAKE_COPY.validation.step1Required` is shown.
  - Attempting to select a 3rd chip is prevented by the reducer; an inline status prompt `INTAKE_COPY.a11y.taskMaxReachedHint` informs the user.

#### Step 2: Subjects & Focus Validation
- **Condition**:
  1. A primary subject ID is selected from `STEM_TECH`, `HEALTH_BIO`, `BUSINESS_SOCIETY`, `ARTS_HUMANITIES`, `PUBLIC_POLICY`.
  2. The rationale text area contains at least 1 non-whitespace character (`rationale.trim().length >= 1`) and does not exceed 150 characters (`rationale.length <= 150`).
- **Invalid State**:
  - `q2SubjectId === null` (no subject chosen).
  - `q2Rationale.trim().length === 0` (empty or whitespace-only rationale).
  - `q2Rationale.length > 150` (exceeds cap).
- **Enforcement**:
  - "Continue" button is disabled until both subject and rationale conditions are satisfied.
  - Textarea enforces `maxLength={150}` and onChange slice `text.slice(0, 150)`.
  - If subject is missing, error `INTAKE_COPY.validation.step2SubjectRequired` is attached.
  - If rationale is empty, error `INTAKE_COPY.validation.step2RationaleRequired` is attached.

#### Step 3: Work Setting Validation
- **Condition**: A binary choice is selected (`'REMOTE_DESK' | 'ACTIVE_FIELD_LAB'`).
- **Invalid State**: `q3Environment === null`.
- **Enforcement**:
  - "Continue" button is disabled until an environment option is selected.
  - If progression is triggered while unselected, error `INTAKE_COPY.validation.step3EnvironmentRequired` is attached.

#### Step 4: Future Ambition Validation
- **Condition**: A binary choice is selected (`'WORKFORCE_DIRECT' | 'GRADUATE_STUDY'`).
- **Invalid State**: `q4Ambition === null`.
- **Enforcement**:
  - "Review Pathways" button is disabled until an ambition option is selected.
  - If progression is triggered while unselected, error `INTAKE_COPY.validation.step4AmbitionRequired` is attached.

### 4.2 Step Validation Functions Contract

```typescript
export function isStep1Valid(answers: IntakeAnswersState): boolean {
  return answers.q1TaskIds.length >= 1 && answers.q1TaskIds.length <= 2;
}

export function isStep2Valid(answers: IntakeAnswersState): boolean {
  const hasSubject = answers.q2SubjectId !== null && answers.q2SubjectId.trim() !== '';
  const trimmedRationale = answers.q2Rationale.trim();
  const hasValidRationale = trimmedRationale.length >= 1 && answers.q2Rationale.length <= 150;
  return hasSubject && hasValidRationale;
}

export function isStep3Valid(answers: IntakeAnswersState): boolean {
  return answers.q3Environment === 'REMOTE_DESK' || answers.q3Environment === 'ACTIVE_FIELD_LAB';
}

export function isStep4Valid(answers: IntakeAnswersState): boolean {
  return answers.q4Ambition === 'WORKFORCE_DIRECT' || answers.q4Ambition === 'GRADUATE_STUDY';
}

export function validateStep(step: 1 | 2 | 3 | 4, answers: IntakeAnswersState): boolean {
  switch (step) {
    case 1:
      return isStep1Valid(answers);
    case 2:
      return isStep2Valid(answers);
    case 3:
      return isStep3Valid(answers);
    case 4:
      return isStep4Valid(answers);
    default:
      return false;
  }
}
```

---

## 5. Step Navigation Guards & Transition Matrix

To alleviate decision paralysis and prevent corrupted incomplete data payloads, navigation guards govern all step transitions.

### 5.1 Guard Rules
1. **Unconstrained Regressive Navigation**: Moving backwards ($TargetStep < CurrentStep$) is always permitted without running validation on the current step. Existing responses on all steps are preserved intact.
2. **Strict Forward Progression**: Advancing to Step $K$ ($K > CurrentStep$) requires that every step $i \in [1, K-1]$ is completely valid.
3. **StepIndicator Direct Jump Guard**:
   - Step 1 node is always clickable.
   - Step $K$ ($K \in \{2, 3, 4\}$) node is clickable if and only if all steps $1 \dots K-1$ are valid.
   - If a student clicks an inaccessible step node, the transition is prevented, and the wizard gently announces `INTAKE_COPY.validation.navigationBlocked`.
4. **Retroactive Invalidation Guard**:
   - If a student on Step 3 navigates back to Step 1 and deselects all chips, Step 1 becomes invalid.
   - The student cannot advance back to Step 2, 3, or 4 until Step 1 is re-satisfied.

### 5.2 State Transition Matrix

| From Step | Event / Action | Guard Condition | To Step | Side Effect |
|---|---|---|---|---|
| **Step 1** | `NEXT_STEP` | `isStep1Valid === true` | **Step 2** | Persist to `sessionStorage`, focus Step 2 |
| **Step 1** | `NEXT_STEP` | `isStep1Valid === false` | **Step 1** | Attach `validationErrors.q1`, announce error |
| **Step 1** | `PREVIOUS_STEP` | `currentStep === 1` | **Step 1** | None (Previous is disabled) |
| **Step 2** | `PREVIOUS_STEP` | Unconditional | **Step 1** | Preserve Q2 state, focus Step 1 |
| **Step 2** | `NEXT_STEP` | `isStep2Valid === true` | **Step 3** | Persist to `sessionStorage`, focus Step 3 |
| **Step 2** | `NEXT_STEP` | `isStep2Valid === false` | **Step 2** | Attach Q2 errors, announce missing fields |
| **Step 3** | `PREVIOUS_STEP` | Unconditional | **Step 2** | Preserve Q3 state, focus Step 2 |
| **Step 3** | `NEXT_STEP` | `isStep3Valid === true` | **Step 4** | Persist to `sessionStorage`, focus Step 4 |
| **Step 3** | `NEXT_STEP` | `isStep3Valid === false` | **Step 3** | Attach `validationErrors.q3`, announce error |
| **Step 4** | `PREVIOUS_STEP` | Unconditional | **Step 3** | Preserve Q4 state, focus Step 3 |
| **Step 4** | `NEXT_STEP` | `isStep4Valid === true` | **Step 4** (Completed) | Set `isCompleted = true`, display Review banner |
| **Step 4** | `NEXT_STEP` | `isStep4Valid === false` | **Step 4** | Attach `validationErrors.q4`, announce error |
| **Any Step** | `GO_TO_STEP(K)` | $K \le CurrentStep \lor \forall i < K: \text{Valid}(i)$ | **Step K** | Switch view, persist to `sessionStorage` |
| **Any Step** | `GO_TO_STEP(K)` | $\exists i < K: \neg\text{Valid}(i)$ | **Current Step** | Reject transition, announce `navigationBlocked` |
| **Any Step** | `RESET_STATE` | User confirms Reset Dialog | **Step 1** | Purge `sessionStorage`, reset answers, focus Step 1 |

---

## 6. Transient Browser Persistence (`sessionStorage`) & Safe Fallback Adapter

### 6.1 Rationale: `sessionStorage` vs. `localStorage`

PathwayAI strictly utilizes `sessionStorage` rather than `localStorage`:
1. **Accidental Reload Survival**: Survives accidental page refreshes (`F5`, `Ctrl+R`, network reconnection) during intake.
2. **Zero Cross-Session Data Leaks**: High school juniors/seniors often use shared Chromebooks, public library terminals, or counseling center computers. `localStorage` persists across browser sessions indefinitely, creating severe privacy risks by exposing students' stated academic dreads to the next user. `sessionStorage` automatically purges all data the moment the browser tab or window closes.
3. **Tab Isolation**: Distinct tabs running PathwayAI operate completely isolated from one another without cross-tab state collision.

### 6.2 Storage Contract & Schema

- **Storage Key**: `pathway_intake_state_v1`
- **Schema**:
  ```json
  {
    "version": 1,
    "currentStep": 2,
    "studentNickname": "Alex",
    "answers": {
      "q1TaskIds": ["BUILD_SYSTEMS", "ANALYZE_PATTERNS"],
      "q2SubjectId": "STEM_TECH",
      "q2Rationale": "Love software projects but worried about college math.",
      "q3Environment": null,
      "q4Ambition": null
    },
    "timestamp": 1727850000000
  }
  ```
- **Transient Exclusions**: `isResetDialogOpen` and `validationErrors` are UI-transient and are **never** persisted to storage.

### 6.3 Safe Storage Adapter with In-Memory Fallback

Certain environments throw fatal errors when attempting to access `window.sessionStorage`:
- Strict private browsing modes (e.g., Safari Private Browsing with blocked cookies).
- Sandboxed `<iframe>` embeds with `sandbox="allow-scripts"` without `allow-same-origin`.
- Corporate/school browser policies blocking storage.
- Storage quota exhaustion (`QuotaExceededError`).

To guarantee 100% crash-free operation, all storage operations must route through a `SafeStorageAdapter`:

```typescript
export interface SafeStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  isMemoryFallback: boolean;
}
```

#### Safe Storage Implementation Specification
```typescript
class MemoryStorage implements SafeStorage {
  private store = new Map<string, string>();
  public readonly isMemoryFallback = true;

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

export function getSafeSessionStorage(): SafeStorage {
  if (typeof window === 'undefined') {
    return new MemoryStorage();
  }

  try {
    const testKey = '__pathway_test__';
    window.sessionStorage.setItem(testKey, testKey);
    window.sessionStorage.removeItem(testKey);

    return {
      getItem: (key) => window.sessionStorage.getItem(key),
      setItem: (key, val) => window.sessionStorage.setItem(key, val),
      removeItem: (key) => window.sessionStorage.removeItem(key),
      clear: () => window.sessionStorage.clear(),
      isMemoryFallback: false,
    };
  } catch {
    // Falls back seamlessly to MemoryStorage if sessionStorage throws SecurityError or QuotaExceededError
    return new MemoryStorage();
  }
}
```

### 6.4 Hydration & Schema Validation Protocol
On initial client mount (`useEffect`):
1. `getSafeSessionStorage().getItem('pathway_intake_state_v1')` is read.
2. If non-null, JSON parsing is attempted within a `try / catch` block.
3. The parsed payload is validated against a lenient Zod schema (`intakeStoredStateSchema`).
4. If validation succeeds, `dispatch({ type: 'HYDRATE_STATE', payload })` restores state.
5. If parsing or validation fails (e.g., tampered data or stale schema), `removeItem('pathway_intake_state_v1')` purges the corrupted key, and state initializes cleanly to `INITIAL_INTAKE_STATE`.

---

## 7. Counselor & Student Data Reset Protocol

To eliminate anxiety regarding mistaken entries, students and counselors can reset intake data at any time.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA RESET PROTOCOL                             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Trigger: Student clicks "Start Over" or Counselor clicks "Reset"    │
│ 2. Modal Intercept: Opens ResetConfirmationModal (aria-modal="true")   │
│ 3. User Choice:                                                        │
│    - "Keep my answers" -> Closes dialog, focus returns to trigger      │
│    - "Yes, start over" -> Executes Reset Purge:                        │
│         a. safeStorage.removeItem('pathway_intake_state_v1')           │
│         b. dispatch({ type: 'RESET_STATE' })                           │
│         c. Sets currentStep = 1, clears all answers & nickname         │
│         d. Closes modal, shifts focus to Step 1 heading landmark       │
└────────────────────────────────────────────────────────────────────────┘
```

### 7.1 Reset Confirmation Dialog Requirements (`ResetConfirmationModal`)
- **Semantic HTML**: `<div role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title" aria-describedby="reset-dialog-desc">`.
- **Keyboard Trapping**: Traps focus inside the modal when open (`Tab`, `Shift+Tab`).
- **Escape Key**: Pressing `Escape` cancels the reset and restores focus to the trigger button.
- **Backdrop Click**: Clicking outside the modal card cancels the action.
- **Copy**: 100% centralized in `src/constants/intakeCopy.ts` under `resetDialog`.

---

## 8. Centralized Copy Contract Extensions (`src/constants/intakeCopy.ts`)

To ensure emotional safety and zero test-taking intimidation, all new validation strings, reset dialog copy, and nickname prompts must be added directly into `src/constants/intakeCopy.ts`.

### 8.1 Copy Additions Specification

```typescript
export const INTAKE_COPY = {
  // Existing keys: shell, steps, questionOne, questionTwo, questionThree, questionFour, navigation, a11y, home...

  // New Validation Copy for Feature 4
  validation: {
    step1Required: 'Please select 1 or 2 tasks that feel natural to you.',
    step2SubjectRequired: 'Please choose a subject area that interests you.',
    step2RationaleRequired: 'Please share a brief thought (at least 1 character) about what excites or worries you.',
    step2RationaleMaxLength: 'Please keep your thought within 150 characters.',
    step3EnvironmentRequired: 'Please choose which day-to-day setting sounds best for your energy.',
    step4AmbitionRequired: 'Please choose which post-college timeline feels right today.',
    navigationBlocked: 'Please complete the question above before moving forward. Take your time.',
  },

  // New Reset Dialog Copy for Feature 4
  resetDialog: {
    triggerButton: 'Start Over',
    counselorTriggerButton: 'Reset Intake Data',
    title: 'Start fresh with a clean slate?',
    description:
      'This will clear all your answers and return you to Question 1. You can take as much time as you need.',
    confirm: 'Yes, start over',
    cancel: 'Keep my answers',
    ariaLabel: 'Reset intake questionnaire confirmation',
  },

  // Student Nickname & Personalization Copy
  nicknamePrompt: {
    label: 'First name or nickname (optional)',
    placeholder: 'e.g., Alex',
    helperText: 'Used only to personalize your career pathways. You can leave this blank if you prefer.',
  },

  // Storage Notices & Edge Case Guidance
  storageNotice: {
    inMemoryFallback: 'Note: Browser session storage is disabled. Your answers will be saved in memory for this session only.',
  },
} as const;
```

---

## 9. Accessibility, ARIA Semantics & Ergonomics

All state interactions adhere strictly to **WCAG 2.1 Level AA** standards:

1. **Focus Restoration on Step Navigation**:
   - When advancing to the next step, focus automatically programmatically shifts to the active step's `<legend>` or heading (`h2`) with `tabIndex={-1}`, announcing the question to screen reader users.
2. **Accessible Validation Error Announcements**:
   - Validation error messages feature `role="alert"` and `aria-live="polite"` so screen readers speak the guidance immediately upon failed validation without harsh interruption.
   - Form inputs (e.g., Step 2 textarea) dynamically bind `aria-invalid="true"` and `aria-errormessage="q2-error-msg"` when validation fails.
3. **Reset Dialog Semantics**:
   - `role="dialog"`, `aria-modal="true"`.
   - Initial focus automatically lands on the "Keep my answers" (Cancel) button to prevent accidental data loss.
4. **Touch Target Sizing**:
   - The "Start Over" button and all dialog buttons maintain minimum 44×44px touch targets (`min-h-[44px]`).

---

## 10. Comprehensive Edge Cases Matrix

| Edge Case Scenario | Condition / Trigger | System Defense & Behavior | Expected Result |
|---|---|---|---|
| **EC-01: Accidental Page Refresh Mid-Intake** | Student is on Step 2 with partial answers and hits `F5`. | `useEffect` hydrates state from `sessionStorage` (`pathway_intake_state_v1`). | Student resumes on Step 2 with all Q1 chips, chosen Q2 subject, and Q2 rationale intact. |
| **EC-02: Whitespace-Only Step 2 Rationale** | Student inputs `"   \n\t  "` into the Q2 textarea and clicks Continue. | `rationale.trim().length >= 1` check fails. | Navigation is blocked; calm `validation.step2RationaleRequired` inline message appears. |
| **EC-03: Pasting Massive Text in Step 2** | Student pastes a 500-character paragraph into Q2 textarea. | Reducer and component enforce `text.slice(0, 150)`. | Input is immediately truncated to 150 characters; live counter displays `150/150 characters`. |
| **EC-04: Retroactive Step Invalidation** | Student reaches Step 3, clicks Step 1 node, and deselects all tasks. | Step 1 validity becomes false (`q1TaskIds.length === 0`). | Forward navigation is blocked. Clicking "Continue" or Step 3 is guarded until Step 1 is re-completed. |
| **EC-05: Private Browsing Storage Denial** | Student runs Safari Private Browsing with blocked cookies/storage. | `getSafeSessionStorage()` catches `SecurityError` and switches to `MemoryStorage`. | App operates 100% error-free in memory. No console crashes. State works normally across all 4 steps. |
| **EC-06: Storage Quota Exhaustion** | Device storage is full; `sessionStorage.setItem` throws `QuotaExceededError`. | Try/catch block in storage sync catches error and logs quiet warning; falls back to in-memory state. | App continues without crashing; user completes intake successfully. |
| **EC-07: Corrupted Storage JSON** | User or browser extension modifies `pathway_intake_state_v1` with invalid JSON. | JSON parser catch block intercepts syntax error, purges the key, and resets state. | Wizard initializes cleanly to Step 1 without unhandled promise rejections. |
| **EC-08: Multi-Tab Concurrency** | Student opens two tabs of PathwayAI in the same browser. | `sessionStorage` is strictly scoped per window tab. | Tab A and Tab B maintain separate, independent answers without clobbering each other. |
| **EC-09: Rapid Double-Clicking Continue** | Anxious student rapidly clicks "Continue" multiple times. | React state reducer processes sequential synchronous actions. | `currentStep` advances cleanly by 1 without jumping from Step 1 to Step 3. |
| **EC-10: Browser Back / Forward Navigation** | Student clicks the browser's native back button. | View synchronizes with state without desynchronization or page crashes. | State remains preserved; user can navigate forward when ready. |

---

## 11. Files to Touch & Architecture Map

Feature 4 creates dedicated context, hooks, and storage adapters while updating the existing UI components and constants:

```
src/
├── constants/
│   └── intakeCopy.ts                   # EXTEND: validation copy, resetDialog, nicknamePrompt
├── types/
│   └── intake.ts                       # EXTEND: IntakeState, IntakeAction, IntakeContextValue
├── schemas/
│   └── intake.schema.ts                # EXTEND: intakeStoredStateSchema (for safe storage parsing)
├── lib/
│   └── storage/
│       └── safeStorage.ts              # CREATE: SafeStorage interface, safeSessionStorage adapter
├── context/
│   ├── IntakeContext.tsx               # CREATE: IntakeContext, IntakeProvider, intakeReducer
│   └── index.ts                        # CREATE: Barrel export for context
├── hooks/
│   ├── useIntake.ts                    # CREATE: Custom consumer hook with selectors & dispatchers
│   └── index.ts                        # CREATE: Barrel export for hooks
├── components/
│   └── wizard/
│       ├── ResetConfirmationModal.tsx  # CREATE: Accessible confirmation dialog for data reset
│       ├── WizardShell.tsx             # EXTEND: Add Start Over button & Reset dialog trigger
│       ├── StepIndicator.tsx           # EXTEND: Wire onClick with canAccessStep guards
│       ├── NavigationControls.tsx      # EXTEND: Connect to isCurrentStepValid & reducer actions
│       └── questions/
│           ├── QuestionOneTaskView.tsx # EXTEND: Connect validation error rendering
│           └── QuestionTwoSubjectView.tsx # EXTEND: Connect validation error rendering
└── app/
    └── page.tsx                        # REFACTOR: Replace local useState with IntakeProvider/useIntake
```

---

## 12. Verification & Acceptance Criteria Matrix (AC-STATE-01 through AC-STATE-08)

| Criterion ID | Target Requirement | Verification Procedure | Pass Criteria |
|---|---|---|---|
| **AC-STATE-01** | **Centralized Context Provider & Reducer State** | Wrap the application with `IntakeProvider` and inspect `useIntake()`. | State initializes with `currentStep: 1`, empty answers (`q1TaskIds: []`, `q2SubjectId: null`, `q2Rationale: ''`, `q3Environment: null`, `q4Ambition: null`), optional `studentNickname: ''`. State updates occur exclusively through typed actions dispatched to `intakeReducer`. |
| **AC-STATE-02** | **Step 1 Validation Engine (1–2 Task Chips)** | Test Step 1 with 0 chips, 1 chip, 2 chips, and attempt a 3rd chip. | With 0 chips selected, Step 1 is invalid, Next button is disabled, and calm helper copy is rendered. Selecting 1 or 2 chips marks Step 1 valid and enables Next. Selecting a 3rd chip is prevented by the reducer and displays the max-reached notice. |
| **AC-STATE-03** | **Step 2 Validation Engine (Subject & 1–150 Char Rationale)** | Test Step 2 with no subject, whitespace-only rationale, valid rationale, and text > 150 chars. | Step 2 is valid if and only if a subject chip is selected AND rationale has $\ge$ 1 non-whitespace character and $\le$ 150 characters. Whitespace-only string (`"   "`) is rejected. Next button is disabled when invalid. Input is capped strictly at 150 characters. |
| **AC-STATE-04** | **Steps 3 & 4 Binary Choice Validation Engine** | Test Step 3 and Step 4 with unselected state and binary selections. | Step 3 is valid iff `q3Environment` is `'REMOTE_DESK'` or `'ACTIVE_FIELD_LAB'`. Step 4 is valid iff `q4Ambition` is `'WORKFORCE_DIRECT'` or `'GRADUATE_STUDY'`. Unselected states disable forward navigation with reassuring helper copy. |
| **AC-STATE-05** | **Step Navigation Guards & Skip-Ahead Prevention** | Attempt to jump ahead to Step 3 or 4 while Step 1 or 2 is incomplete (via StepIndicator or programmatic dispatch). | Transition to future steps is blocked; current step is retained; calm notification `INTAKE_COPY.validation.navigationBlocked` is announced. Regressive navigation (e.g., Step 3 to Step 1) is always allowed and preserves existing responses. If an earlier step is retroactively invalidated, forward progression is immediately blocked. |
| **AC-STATE-06** | **Transient `sessionStorage` Persistence Across Page Reloads** | Answer Step 1 and Step 2, then reload the page (`F5`). Close tab and open fresh tab. | Upon page reload, state hydrates accurately to Step 2 with all Q1 and Q2 responses intact. Upon closing the tab and opening a new tab, `sessionStorage` contains no prior student data, starting fresh at Step 1 to protect privacy on shared computers. |
| **AC-STATE-07** | **Counselor & Student Data Reset Protocol** | Complete answers up to Step 3, click "Start Over", verify confirmation dialog, confirm reset. | Clicking "Start Over" opens `ResetConfirmationModal`. Clicking "Keep my answers" preserves state. Clicking "Yes, start over" purges `sessionStorage`, resets state to Step 1 default values, and shifts focus to the Step 1 question landmark. |
| **AC-STATE-08** | **Graceful In-Memory Storage Fallback on Exception** | Mock `window.sessionStorage` throwing `SecurityError` or `QuotaExceededError`. Run full intake flow. | Application detects the exception, switches transparently to `MemoryStorage`, logs no uncaught errors, and allows the student to navigate all 4 steps and reset state seamlessly within the active session. |

---

## 13. Architectural Decisions, Simplifications & Tradeoffs

1. **`sessionStorage` over `localStorage`**:
   - *Decision*: Restrict client persistence strictly to `sessionStorage`.
   - *Rationale*: Students using shared high school counseling computers or public libraries would have their private academic insecurities exposed to subsequent users if `localStorage` were used. `sessionStorage` provides reload resilience while guaranteeing automatic cleanup on tab closure.
2. **Context + `useReducer` over External State Libraries (Redux / Zustand / XState)**:
   - *Decision*: Implement state using standard React Context and `useReducer`.
   - *Rationale*: PathwayAI's intake wizard is a focused 4-step workflow. Adding external state libraries introduces unnecessary bundle overhead and dependency complexity. React's native primitives provide zero-cost, fully typed, inspectable state management.
3. **Mandatory Step 2 Rationale ($1–150$ Characters)**:
   - *Decision*: Enforce that the Step 2 rationale note must contain at least 1 character (trimmed) rather than being purely optional.
   - *Rationale*: The downstream Gemini 1.5 Flash triage engine requires student nuance (fears, curiosities, hesitations) to generate hyper-personalized reassurance and course challenge mitigation in Feature 5. Capping at 150 characters prevents prompt token blowup.
4. **Lenient Safe Storage Adapter Pattern**:
   - *Decision*: Wrap storage operations behind a uniform `SafeStorage` interface that gracefully falls back to an in-memory `Map`.
   - *Rationale*: Guarantees that strict browser privacy settings, private browsing modes, or third-party storage restrictions never crash the student's triage session.

---

## 14. Specification Gate Assessment

### Gate Status: **SPECIFICATION GATE: PASS**

**Rationale**:
- State management architecture is exhaustively specified with complete TypeScript interfaces (`IntakeState`, `IntakeAction`, `IntakeContextValue`), initial state values, and pure reducer transitions.
- Validation engine rules for Q1 (1–2 chips), Q2 (subject + 1–150 char rationale), Q3 (binary choice), and Q4 (binary choice) are mathematically unambiguous.
- Step navigation guards prevent forward skipping to incomplete steps while keeping backward navigation non-destructive.
- Transient browser persistence via `sessionStorage` with automatic in-memory fallback covers all privacy, reload, and security constraints.
- Counselor and Student Data Reset action and accessible confirmation dialog are fully articulated.
- All new validation, reset dialog, and nickname strings are isolated in `src/constants/intakeCopy.ts` using a calm, validating tone.
- Acceptance criteria **AC-STATE-01** through **AC-STATE-08** provide verifiable benchmarks.
- Boundary rules (no Gemini API calls, no route handlers, no database writes, no dossier card rendering) are strictly maintained.
- Ready for implementation on branch `feature/4-intake-state-machine`.
