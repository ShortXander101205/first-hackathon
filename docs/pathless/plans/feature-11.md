---
doc: implementation-plan
feature: 11-ux-copy-and-simplification
project: PathLess - Framework v2
status: proposed
gate: PENDING_USER_APPROVAL
---

# Feature 11: Phased Implementation Plan
## UX Copy and Simplification — Architecture, Microcopy & Decluttering Blueprint

This implementation plan defines the phased, sequential execution blueprint for **Feature 11: UX Copy and Simplification** on branch `feature/11-ux-copy-and-simplification`, operationalizing the approved technical contract ([docs/pathless/contracts/feature-11.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-11.md)).

---

## 1. Overview of Execution Strategy

Feature 11 conducts a comprehensive **plain-language rewrite, user interface declutter, and 100% copy centralization** across both the student discovery journey and the advisor portal:

1. **100% Copy Centralization**: Extract all hardcoded string literals from JSX components into typed immutable copy dictionaries in `src/content/guideCopy.ts`, `src/content/advisorCopy.ts`, and `src/content/intakeQuestions.ts`.
2. **Automated Prohibited Terminology Purge**: Enforce zero occurrences of prohibited technical and clinical terms (`dossier`, `PathwayAI`, `Triage`, `Counselor`, `algorithm`, `AI model`, `synthesis engine`, `fallback`, `database`) across all content dictionaries and user-facing UI markup.
3. **8th-to-12th Grade Plain-Language Calibration**: Restructure all 10 intake questions, helper hints, option cards, and error messages to score comfortably within an 8th-to-12th grade reading level (Flesch Reading Ease $\ge 60.0$, conversational prompt $\text{FKGL} \le 10.0$), eliminating anxiety-inducing terminology like *"dread"* and *"friction"*.
4. **Declarative Component Copy Bindings**: Refactor student intake components (`IntakeForm`, `QuestionCard`, `WelcomeProfileStep`), results presentation views (`ResultsContainer`, `CareerMatchCard`, `WhereToStudySection`, `ResultsFooter`), print layouts (`PrintHeader`), global app shell (`Header`), and educator workspace (`AdvisorDashboard`, `PasscodeLogin`, `StudentTable`, `StudentDetailModal`, `AdvisorNotesEditor`).
5. **Accessible Design & Decluttering**: Enforce WCAG 2.1 AA text contrast ($\ge 4.5:1$ for body and secondary text, eliminating low-contrast `text-slate-400` on white), explicit form label linkage, $44 \times 44\text{ px}$ minimum touch targets, fluid text wrapping down to 320px, and 200% zoom defense.
6. **Strict Scope Discipline**:
   - Advanced rate-limiting, IP reputation, and payload sanitization are deferred to `feature/12-safety-and-guardrails`.
   - Cypress/Playwright E2E automation and GitHub Actions CI pipelines are deferred to `feature/13-deployment-and-e2e`.

---

## 2. Phased Execution Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PHASED EXECUTION PIPELINE                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Centralized Content Repositories & 10 Intake Questions Modularization                   │
│          • Create src/content/intakeQuestions.ts (10 plain-language questions & options)         │
│          • Update src/content/guideCopy.ts (brand, shell, nav, results, whereToStudy, print)     │
│          • Update src/content/advisorCopy.ts (portal, login, directory, drawer, notes, archive)  │
│                                    ↓                                                             │
│ Phase 2: Automated Copy Auditing & Prohibited Terminology Test Suites                            │
│          • Create tests/unit/prohibitedTerms.test.ts (zero forbidden words scanner)              │
│          • Create tests/unit/copyAudit.test.ts (key presence, Flesch-Kincaid, bound checks)      │
│                                    ↓                                                             │
│ Phase 3: Global Header & Navigation Jargon Eradication                                           │
│          • Update src/components/layout/Header.tsx (rebrand PathwayAI -> PathLess, purge Triage) │
│                                    ↓                                                             │
│ Phase 4: Student Intake Wizard & Microcopy Component Refactoring                                 │
│          • Create src/components/intake/QuestionCard.tsx (accessible, plain-language card)       │
│          • Refactor src/components/intake/IntakeForm.tsx & IntakeWizardContainer.tsx             │
│          • Refactor src/components/intake/QuestionStepView.tsx                                   │
│          • Refactor src/components/intake/WelcomeProfileStep.tsx                                 │
│          • Update src/components/intake/index.ts                                                 │
│                                    ↓                                                             │
│ Phase 5: Results Presentation, Milestone Cards & University Panel Copy Bindings                  │
│          • Update src/components/results/ResultsContainer.tsx                                    │
│          • Update src/components/results/ResultsHeader.tsx & ResultsFooter.tsx                   │
│          • Update src/components/results/CareerMatchCard.tsx (minor prefix, contrast fix)        │
│          • Update src/components/results/WhereToStudySection.tsx (curation copy, zero AI terms)  │
│                                    ↓                                                             │
│ Phase 6: Print Header & Responsive Print Layout Verification                                     │
│          • Update src/components/results/PrintHeader.tsx (centralized print copy, privacy guard) │
│          • Verify @media print expansion across all 4 career concentration cards                 │
│                                    ↓                                                             │
│ Phase 7: School Advisor Dashboard Suite Refactoring                                             │
│          • Refactor src/components/advisor/AdvisorDashboard.tsx (framework badge, nav copy)      │
│          • Refactor src/components/advisor/PasscodeLogin.tsx (passcode helpers, purge counselor) │
│          • Refactor src/components/advisor/StudentTable.tsx (grade options map, responsive cols) │
│          • Refactor src/components/advisor/StudentDetailModal.tsx (plain-language metadata labels)│
│          • Refactor src/components/advisor/AdvisorNotesEditor.tsx (composer & counter bindings)  │
│                                    ↓                                                             │
│ Phase 8: Quality Gates & Full Verification Pipeline                                              │
│          • Run npm test, npm run type-check, npm run lint, npm run build                         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. File Change Inventory

```
┌───────────────────────────────────────────────┬────────────┬────────────────────────────────────────────────────────┐
│ File Path                                     │ Action     │ Primary Purpose                                        │
├───────────────────────────────────────────────┼────────────┼────────────────────────────────────────────────────────┤
│ src/content/intakeQuestions.ts                │ Create     │ 10 rewritten plain-language intake questions & options │
│ src/content/guideCopy.ts                      │ Modify     │ Centralized student guide, nav, results, & print copy  │
│ src/content/advisorCopy.ts                    │ Modify     │ Centralized educator portal, login, drawer, & notes    │
│ tests/unit/prohibitedTerms.test.ts            │ Create     │ Automated scanner verifying zero forbidden terms       │
│ tests/unit/copyAudit.test.ts                  │ Create     │ Unit test suite for key presence & readability scoring │
│ src/components/layout/Header.tsx              │ Modify     │ Rebrand navbar to PathLess; purge PathwayAI & Triage   │
│ src/components/intake/QuestionCard.tsx        │ Create     │ Accessible option card and question renderer           │
│ src/components/intake/IntakeForm.tsx          │ Create     │ Form coordinator export matching feature architecture  │
│ src/components/intake/IntakeWizardContainer.tsx│ Modify    │ Bind step titles, progress, reset dialog, & errors     │
│ src/components/intake/QuestionStepView.tsx    │ Modify     │ Bind 10 question steps to INTAKE_QUESTIONS             │
│ src/components/intake/WelcomeProfileStep.tsx  │ Modify     │ Bind hero copy, privacy notice, & form fields          │
│ src/components/intake/index.ts                │ Modify     │ Export IntakeForm and QuestionCard                     │
│ src/components/results/ResultsContainer.tsx   │ Modify     │ Bind landmarks and clear dialog to RESULTS_COPY        │
│ src/components/results/ResultsHeader.tsx      │ Modify     │ Bind archetype fallbacks, advisory note, & subtitle    │
│ src/components/results/ResultsFooter.tsx      │ Modify     │ Bind print action, reset triggers, & clear confirmation│
│ src/components/results/CareerMatchCard.tsx    │ Modify     │ Bind minor prefix, milestones, and fix text contrast   │
│ src/components/results/WhereToStudySection.tsx│ Modify     │ Replace AI/fallback terms with advisor curation copy   │
│ src/components/results/PrintHeader.tsx        │ Modify     │ Bind printable report header to RESULTS_COPY.printHeader│
│ src/components/advisor/AdvisorDashboard.tsx   │ Modify     │ Bind portal brand, framework badge, & logout button    │
│ src/components/advisor/PasscodeLogin.tsx      │ Modify     │ Bind passcode labels, helpers, & purge "counselor"     │
│ src/components/advisor/StudentTable.tsx       │ Modify     │ Bind grade filter options & empty state copy           │
│ src/components/advisor/StudentDetailModal.tsx │ Modify     │ Bind metadata labels, milestones, & error fallback     │
│ src/components/advisor/AdvisorNotesEditor.tsx │ Modify     │ Bind composer labels, feedback alerts, & counter text  │
└───────────────────────────────────────────────┴────────────┴────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Phase Specifications

### Phase 1: Centralized Content Repositories & 10 Intake Questions Modularization
**Goal**: Establish complete, typed, immutable content dictionaries covering 100% of user-facing copy for both students and educators, eliminating prohibited terms and Silicon Valley jargon.  
**Acceptance Criteria Mapped**: `AC-COPY-01`, `AC-COPY-02`, `AC-COPY-03`, `AC-COPY-05`

#### 1.1 Create `src/content/intakeQuestions.ts`
- Export interface definitions: `IntakeQuestionOption`, `IntakeQuestionDefinition`.
- Export `INTAKE_QUESTIONS: Record<string, IntakeQuestionDefinition>` for `q1` through `q10`.
- **Text Calibration Rules**:
  - `q1`: Tasks feeling natural $\rightarrow$ *Building & Fixing Things*, *Solving Puzzles & Exploring Questions*, *Helping & Supporting Others*, *Writing, Art & Creative Expression*, *Organizing & Bringing People Together*.
  - `q2`: Curiosity subject $\rightarrow$ *Technology & Computing*, *Health, Medicine & Biology*, *Business & Social Enterprise*, *Arts, Design & Media*, *Law, Policy & Community Impact*, *Engineering & Applied Sciences*.
  - `q3`: Academic hesitation $\rightarrow$ Rephrase from *"dread"* to *"What feels most challenging or stressful when you think about college classes?"*; placeholder: *"e.g., I love science, but high-level math tests make me nervous..."*.
  - `q4`: Work environment $\rightarrow$ *Quiet Digital Desk*, *Active Team Studio or Office*, *Hands-On Lab, Workshop, or Outdoors*, *Community or Healthcare Setting*.
  - `q5`: Problem solving $\rightarrow$ *One Step at a Time*, *Brainstorming Many Ideas*, *Talking It Through with Others*, *Trying It Out by Doing*.
  - `q6`: Social energy $\rightarrow$ *Mostly Independent Focus*, *A Healthy Mix of Both*, *People-First & Energetic*.
  - `q7`: Structure $\rightarrow$ *Clear Expectations & Reliable Routine*, *Clear Goals with Freedom in How You Work*, *Flexible Freedom & Rapid Changes*.
  - `q8`: Schoolwork friction $\rightarrow$ Replace graduate dissertation jargon with high school realities: *Heavy Theoretical Mathematics*, *High-Stakes Public Presentations*, *Massive Rote Memorization*, *Lengthy Abstract Research Papers*, *Pure Theory Without Real Examples*.
  - `q9`: Horizon priority $\rightarrow$ *Financial Stability & High Security*, *Purpose & Helping Others*, *Creative Freedom & Expression*, *Mastery & Continuous Learning*, *Healthy Work-Life Harmony*.
  - `q10`: Next chapter $\rightarrow$ *Starting a Career Right Away (2 to 4 Years)*, *Continuing into Graduate School*, *Launching a Project or Exploring*.

#### 1.2 Update `src/content/guideCopy.ts`
- Add `nav` section to `GUIDE_COPY`:
  ```typescript
  nav: {
    brandName: 'PathLess',
    brandTagline: 'College & Career Discovery',
    studentGuideLink: 'Discovery Guide',
    advisorPortalLink: 'Advisor Portal',
  }
  ```
- Add `stepTitles` mapping steps 0 through 10 (renaming step 3 from *"Academic Dread"* to *"Academic Hesitation & Worry"*).
- Add `shell.stepPercentLabel: (percent: number) => `${percent}% Complete``.
- Update `RESULTS_COPY`:
  - Standardize `RESULTS_COPY.badges` on `'Top Match'` and `'Explore Also'` (per Feature 14).
  - Delete obsolete `RESULTS_COPY.tiers` (`Primary Direct Match`, `Moonshot Trajectory`, etc.) to eliminate vocabulary dead weight.
  - In `RESULTS_COPY.card`: add `minorPrefix: 'Minor: '`, `defaultRoleTitle: 'Specialist Concentration'`, `defaultBroadField: 'Applied Discipline'`.
  - In `RESULTS_COPY.header`: add `defaultArchetype: 'The Thoughtful Explorer'`, `defaultNarrative: 'Here are 4 distinct, supportive pathways designed around what naturally energizes you.'`.
  - In `RESULTS_COPY.whereToStudy`: replace `fallbackTitle` and `fallbackDescription` with `curationNoticeTitle` and `curationNoticeDescription`; replace `zeroHallucinationNote` with `advisorVerificationNote: 'Zero unverified claims. All university pathway data is verified by academic advisors.'`.
  - In `RESULTS_COPY.printHeader`: add `defaultStudentName: 'Student'`, `defaultGrade: 'Secondary Education'`, `defaultDate: 'Current Session'`.
- Re-export `INTAKE_QUESTIONS` so existing imports continue to function without disruption.

#### 1.3 Update `src/content/advisorCopy.ts`
- In `ADVISOR_COPY.portal`: add `frameworkBadge: 'Framework v2'`.
- In `ADVISOR_COPY.login`:
  - `passcodeHelper`: Change from *"head counselor"* to *"Ask your school guidance lead or principal if you do not know your school passcode."*.
  - `authorNamePlaceholder`: Change from *"Counselor Davis"* to *"e.g., Kru Nan / Advisor Davis"*.
- In `ADVISOR_COPY.directory`:
  - Add typed `gradeOptions` map for dropdown filters:
    ```typescript
    gradeOptions: {
      grade_10: '10th Grade',
      grade_11: '11th Grade',
      grade_12: '12th Grade',
      college_freshman: 'Freshman (Yr 1)',
      college_sophomore: 'Sophomore (Yr 2)',
    }
    ```
- In `ADVISOR_COPY.drawer`:
  - Add missing labels: `loadingText`, `gradeLevelLabel`, `academicYearLabel`, `submittedDateLabel`, `subjectLabel`, `environmentLabel`, `thinkingStyleLabel`, `priorityLabel`, `stage1MilestoneLabel`, `stage2MilestoneLabel`, `stage3MilestoneLabel`, `relevantMajorsLabel`, `errorFallback`.
  - Change `pathwaysSectionTitle` from *"Synthesized Pathway Recommendations"* to *"Recommended Pathways"*.

---

### Phase 2: Automated Copy Auditing & Prohibited Terminology Test Suites
**Goal**: Implement unit test suites enforcing zero prohibited terms and validating reading levels and copy dictionary completeness.  
**Acceptance Criteria Mapped**: `AC-COPY-01`, `AC-COPY-02`, `AC-COPY-03`

#### 2.1 Create `tests/unit/prohibitedTerms.test.ts`
- Read all exported string values in `src/content/guideCopy.ts`, `src/content/advisorCopy.ts`, and `src/content/intakeQuestions.ts`.
- Scan against the forbidden regex pattern (with word boundaries and inflection support):
  ```typescript
  const PROHIBITED_PATTERN = /\b(dossier(s)?|pathwayai|triage(d)?|counsel(or|ors|ing)?|algorith(m|ms|mic)?|ai model|synthesis engine|(ai )?engine(s)?|database|db)\b/i;
  ```
- In addition, scan the rendered JSX of key components ([Header.tsx](file:///d:/Hackathon/Beta_Folder/src/components/layout/Header.tsx), [CareerMatchCard.tsx](file:///d:/Hackathon/Beta_Folder/src/components/results/CareerMatchCard.tsx), [WhereToStudySection.tsx](file:///d:/Hackathon/Beta_Folder/src/components/results/WhereToStudySection.tsx), [AdvisorDashboard.tsx](file:///d:/Hackathon/Beta_Folder/src/components/advisor/AdvisorDashboard.tsx)) to ensure zero user-facing string occurrences.
- Assert that zero matches are detected.

#### 2.2 Create `tests/unit/copyAudit.test.ts`
- Implement pure Flesch-Kincaid & Flesch Reading Ease scoring utility:
  ```typescript
  function calculateReadability(text: string): { fleschReadingEase: number; fleschKincaidGrade: number }
  ```
- **Readability Rules**:
  - For question titles & short microcopy ($\le 15$ words): assert $\text{FRE} \ge 60.0$ and $\text{FKGL} \le 10.0$ (no minimum floor).
  - For descriptive paragraphs (welcome subheading, privacy promise, whereToStudy description): assert $\text{FRE} \ge 55.0$ and $7.0 \le \text{FKGL} \le 12.0$.
- **Dictionary Completeness Check**:
  - Verify every required key exists in `GUIDE_COPY`, `ADVISOR_COPY`, `RESULTS_COPY`, and `INTAKE_QUESTIONS`.
  - Verify template functions return non-empty strings under zero, single, plural, and empty/whitespace arguments.
- **Length Ceilings**:
  - Button text: $\le 35$ characters.
  - Option descriptions: $\le 25$ words.
  - Question helper hints: $\le 150$ characters.

---

### Phase 3: Global Header & Navigation Jargon Eradication
**Goal**: Eradicate `PathwayAI`, `Triage`, and developer quota metrics from the persistent top navigation bar.  
**Acceptance Criteria Mapped**: `AC-COPY-01`, `AC-COPY-02`

#### 3.1 Refactor `src/components/layout/Header.tsx`
- Replace logo branding:
  ```tsx
  <span className="font-bold text-base sm:text-lg leading-tight tracking-tight text-edu-slate-900">
    {GUIDE_COPY.nav.brandName}
  </span>
  <span className="hidden sm:inline text-[11px] font-medium text-edu-slate-500 leading-none">
    {GUIDE_COPY.nav.brandTagline}
  </span>
  ```
- Replace navigation links:
  - `"Student Triage"` $\rightarrow$ `GUIDE_COPY.nav.studentGuideLink` (`"Discovery Guide"`).
  - `"Advisor Portal"` $\rightarrow$ `GUIDE_COPY.nav.advisorPortalLink` (`"Advisor Portal"`).
- Remove developer telemetry badge (`"Gemini 1.5 Flash • 15 RPM Guard"`) from the public header.

---

### Phase 4: Student Intake Wizard & Microcopy Component Refactoring
**Goal**: Eliminate all hardcoded inline text in the intake wizard, bind all questions to `INTAKE_QUESTIONS`, and guarantee WCAG AA contrast.  
**Acceptance Criteria Mapped**: `AC-COPY-01`, `AC-COPY-02`, `AC-COPY-03`

#### 4.1 Create `src/components/intake/QuestionCard.tsx`
- Build a dedicated, accessible question renderer:
  - Renders question title (`h2`), helper text (`p`), and selection counter chip.
  - Renders options grid (`grid-cols-1 sm:grid-cols-2 gap-3.5`) with accessible roles (`role="checkbox"` for Q1, `role="radio"` for Q2/Q4–Q10).
  - Maintains $44 \times 44\text{ px}$ minimum touch target.
  - High-contrast selected/hover states using `border-edu-interactive` and `bg-reassurance-50/70`.

#### 4.2 Create `src/components/intake/IntakeForm.tsx` & Refactor `IntakeWizardContainer.tsx`
- `src/components/intake/IntakeForm.tsx`: Clean wrapper/facade exporting `IntakeWizardContainer` to fulfill the contract interface.
- In `IntakeWizardContainer.tsx`:
  - Replace local `STEP_TITLES` dictionary with `GUIDE_COPY.stepTitles`.
  - Bind progress label and percentage text:
    ```tsx
    <span>{GUIDE_COPY.shell.stepProgressLabel(currentStep, 10)}: <strong className="text-edu-slate-900">{stepTitle}</strong></span>
    <span>{GUIDE_COPY.shell.stepPercentLabel(progressPercent)}</span>
    ```
  - Bind reset dialog button, modal title, description, and actions to `GUIDE_COPY.resetDialog`.
  - Bind navigation buttons (`Previous`, `Continue`, `Finish & Explore Pathways`) to `GUIDE_COPY.navigation`.

#### 4.3 Refactor `src/components/intake/QuestionStepView.tsx`
- Delegate rendering of individual question options to `QuestionCard.tsx` or bind directly to `INTAKE_QUESTIONS[qKey]`.
- For Step 3 (free-text hesitation):
  - Bind title, helper, placeholder, and character counter to `INTAKE_QUESTIONS.q3`.
  - Ensure counter text uses `text-slate-500` ($4.61:1$, WCAG AA compliant).

#### 4.4 Refactor `src/components/intake/WelcomeProfileStep.tsx`
- Bind heading, subheading, and badge to `GUIDE_COPY.welcome` and `GUIDE_COPY.shell.badge`.
- Bind privacy promise title and body to `GUIDE_COPY.welcome.privacyPromiseTitle` and `GUIDE_COPY.welcome.privacyPromiseBody`.
- Bind full name, grade level, and student ID field labels, placeholders, and helpers to `GUIDE_COPY.welcome.fields`.
- Bind grade options dropdown directly to `GUIDE_COPY.welcome.fields.gradeOptions`.
- Bind all validation error text to `GUIDE_COPY.validation`.

#### 4.5 Update `src/components/intake/index.ts`
- Export `IntakeForm`, `QuestionCard`, `IntakeWizardContainer`, `QuestionStepView`, and `WelcomeProfileStep`.

---

### Phase 5: Results Presentation, Milestone Cards & University Panel Copy Bindings
**Goal**: Unify plain-language copy across results cards, progressive disclosure toggles, 3-stage milestones, and the Thai university section.  
**Acceptance Criteria Mapped**: `AC-COPY-01`, `AC-COPY-02`, `AC-COPY-04`

#### 5.1 Refactor `src/components/results/ResultsContainer.tsx`
- Bind region landmark to `RESULTS_COPY.a11y.resultsLandmark`.
- Ensure all clear/reset modal copy binds to `RESULTS_COPY.actions`.

#### 5.2 Refactor `src/components/results/ResultsHeader.tsx`
- Bind personalized title to `RESULTS_COPY.header.personalizedTitle(name)` or `RESULTS_COPY.header.defaultTitle`.
- Bind archetype fallback to `RESULTS_COPY.header.defaultArchetype`.
- Bind narrative fallback to `RESULTS_COPY.header.defaultNarrative`.
- Bind advisory notice card to `RESULTS_COPY.header.advisoryNoteTitle` and `RESULTS_COPY.header.advisoryNoteBody`.
- Bind demonstration sample badge to `RESULTS_COPY.header.sampleDataNotice`.

#### 5.3 Refactor `src/components/results/ResultsFooter.tsx`
- Bind print button label and ARIA label to `RESULTS_COPY.actions.printButton` and `RESULTS_COPY.actions.printButtonAriaLabel`.
- Bind start over button and reset modal to `RESULTS_COPY.actions.clearButton`, `clearDialogTitle`, `clearDialogDescription`, `confirmClear`, and `cancelClear`.

#### 5.4 Refactor `src/components/results/CareerMatchCard.tsx`
- Replace inline `'Minor: '` with `copy.minorPrefix`.
- Replace inline fallback `'Specialist Concentration'` with `copy.defaultRoleTitle`.
- Replace inline fallback `'Applied Discipline'` with `copy.defaultBroadField`.
- Bind 3-stage milestone headers to `RESULTS_COPY.milestones.heading`, `subheading`, `stage1Label`, `stage2Label`, `stage3Label`.
- Bind daily tasks, study path, reassurance, trial courses, and overview to `RESULTS_COPY.card`.
- **WCAG AA Contrast Fix**: Update `courseSearchHint` text from `text-slate-400` ($2.34:1$) to `text-slate-500` ($4.61:1$).

#### 5.5 Refactor `src/components/results/WhereToStudySection.tsx`
- Bind section title, badge, and description to `RESULTS_COPY.whereToStudy`.
- Bind official admissions disclaimer to `admissionsNoticeTitle` and `admissionsNoticeBody`.
- Replace `fallbackTitle` and `fallbackDescription` with `curationNoticeTitle` and `curationNoticeDescription`.
- Replace `zeroHallucinationNote` with `advisorVerificationNote`.

---

### Phase 6: Print Header & Responsive Print Layout Verification
**Goal**: Guarantee high-fidelity browser print output using centralized plain-language print copy and strict student privacy protection.  
**Acceptance Criteria Mapped**: `AC-COPY-01`, `AC-COPY-06`

#### 6.1 Refactor `src/components/results/PrintHeader.tsx`
- Bind institution title, confidential notice, and labels (`Student Name`, `Grade / Year`, `Date Generated`) to `RESULTS_COPY.printHeader`.
- Bind fallbacks (`defaultStudentName`, `defaultGrade`, `defaultDate`) to `RESULTS_COPY.printHeader`.
- Bind persistent advisor discussion note title and body to `RESULTS_COPY.printHeader.advisorNoteTitle` and `advisorNoteBody`.
- **Privacy Rule**: Verify Student ID is completely excluded from the printed output.

#### 6.2 Verify Print Expansion & Break Protection
- Confirm that `CareerMatchCard.tsx` preserves DOM persistence with `isExpanded ? 'block' : 'hidden print:block'`.
- Confirm that `@media print` cleanly prints all 4 cards without text clipping or truncated accordions.

---

### Phase 7: School Advisor Dashboard Suite Refactoring
**Goal**: Eliminate database and SQL jargon across educator screens, replace hardcoded strings with `ADVISOR_COPY`, and ensure responsive layouts down to 320px.  
**Acceptance Criteria Mapped**: `AC-COPY-01`, `AC-COPY-02`, `AC-COPY-05`

#### 7.1 Refactor `src/components/advisor/AdvisorDashboard.tsx`
- Bind portal brand name to `ADVISOR_COPY.portal.brandName` and framework version badge to `ADVISOR_COPY.portal.frameworkBadge`.
- Bind page title, tagline, and logout button to `ADVISOR_COPY.portal`.

#### 7.2 Refactor `src/components/advisor/PasscodeLogin.tsx`
- Bind title, subtitle, passcode label, placeholder, helper, author label, placeholder, submit button, loading state, error alert, and privacy notice to `ADVISOR_COPY.login`.
- Verify complete elimination of the word *"counselor"*.

#### 7.3 Refactor `src/components/advisor/StudentTable.tsx`
- Bind search input label and placeholder to `ADVISOR_COPY.directory.searchLabel` and `searchPlaceholder`.
- Bind grade filter select label, all grades option, and dropdown `<option>` items to `ADVISOR_COPY.directory.gradeFilterLabel`, `allGradesOption`, and `gradeOptions`.
- Bind date filter select to `ADVISOR_COPY.directory.dateFilterLabel` and `dateOptions`.
- Bind table caption, column headers, view guide CTA, empty state, and records count function to `ADVISOR_COPY.directory`.
- **Responsive Decluttering**: Add `hidden sm:table-cell` to non-critical columns (`Submission Date`, `Top Pathway`) to prevent mobile horizontal scroll blowouts on viewports $< 400\text{px}$.

#### 7.4 Refactor `src/components/advisor/StudentDetailModal.tsx`
- Bind profile section title, grade level label, student ID label, academic year label, submitted date label, and not provided fallback to `ADVISOR_COPY.drawer`.
- Bind intake answers title, hesitation section title, and answer category labels to `ADVISOR_COPY.drawer`.
- Bind pathway recommendations title to `ADVISOR_COPY.drawer.pathwaysSectionTitle` (*"Recommended Pathways"*).
- Bind 3-stage milestone labels (`stage1MilestoneLabel`, `stage2MilestoneLabel`, `stage3MilestoneLabel`) and `relevantMajorsLabel` to `ADVISOR_COPY.drawer`.
- Bind loading message and error notice to `ADVISOR_COPY.drawer.loadingText` and `errorFallback`.

#### 7.5 Refactor `src/components/advisor/AdvisorNotesEditor.tsx`
- Bind section title, empty notes notice, new note label, placeholder, author label, default author, save button, saving state, saved confirmation, character counter, and error message to `ADVISOR_COPY.notes` and `ADVISOR_COPY.drawer`.

---

### Phase 8: Quality Gates & Full Verification Pipeline
**Goal**: Execute comprehensive verification across unit tests, type safety, linting, and Next.js production build.  
**Acceptance Criteria Mapped**: `AC-COPY-01` through `AC-COPY-06`

#### 8.1 Exact Commands (Sourced Directly from `package.json`)
```bash
# 1. Run all unit and integration test suites (including copyAudit and prohibitedTerms)
npm test

# 2. Verify strict TypeScript compilation with zero type errors
npm run type-check

# 3. Verify zero lint errors or warnings across components and copy dictionaries
npm run lint

# 4. Verify Next.js production bundle compiles cleanly
npm run build
```

---

## 5. Traceability Matrix to Acceptance Criteria

```
┌─────────────────┬───────────────────────────────────────────────────────┬───────────────────────────────────────────┐
│ Acceptance ID   │ Criterion Summary                                     │ Responsible Phase & Verification Target   │
├─────────────────┼───────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-01      │ 100% of strings sourced from centralized dictionaries │ Phase 1, Phase 3, Phase 4, Phase 5,       │
│                 │ with zero hardcoded inline text in JSX components.    │ Phase 7; verified by copyAudit.test.ts    │
├─────────────────┼───────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-02      │ User-facing text passes automated linting against all  │ Phase 1, Phase 2, Phase 3, Phase 7;       │
│                 │ 9 prohibited terms (dossier, PathwayAI, Triage, etc.) │ verified by prohibitedTerms.test.ts       │
├─────────────────┼───────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-03      │ All intake prompts, choices, and tips read at an      │ Phase 1, Phase 4;                         │
│                 │ 8th-to-12th grade level with supportive microcopy.    │ verified by copyAudit.test.ts             │
├─────────────────┼───────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-04      │ Results cards, milestones, and Where to Study panels  │ Phase 1, Phase 5;                         │
│                 │ display unified plain-language explanations.          │ verified by copyAudit.test.ts             │
├─────────────────┼───────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-05      │ Advisor login & dashboard copy communicate supportive  │ Phase 1, Phase 7;                         │
│                 │ educator guidance, avoiding database/query jargon.    │ verified by copyAudit.test.ts             │
├─────────────────┼───────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ AC-COPY-06      │ Browser print preview matches the plain-language      │ Phase 1, Phase 6;                         │
│                 │ voice, showing student metadata & disclaimers cleanly.│ verified by copyAudit.test.ts             │
└─────────────────┴───────────────────────────────────────────────────────┴───────────────────────────────────────────┘
```

---

## 6. Execution Gate & User Sign-Off

This implementation plan is currently in status **`PENDING_USER_APPROVAL`**. In accordance with instructions, **no application code or test files will be modified or created until you explicitly provide your approval to execute this plan**.
