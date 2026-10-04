---
doc: implementation-plan
feature: 14-simpler-suggestions-and-clean-pdf
project: PathLess - Framework v2
status: approved
gate: PASS
---

# Feature 14: Step-by-Step Implementation Plan
## Simpler Suggestions and Clean PDF — Phased Architecture & Execution Blueprint

This implementation plan defines the phased, sequential execution blueprint for **Feature 14: Simpler Suggestions and Clean PDF** on branch `feature/14-simpler-suggestions-and-clean-pdf`, implementing the approved technical contract ([docs/pathless/contracts/feature-14.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-14.md)).

---

## 1. Overview of Execution Strategy

Feature 14 refines the results presentation and AI synthesis service on top of Feature 8 to deliver familiar, plain-language career guidance and an accessible print layout:
1. **Curated Career Catalog**: Establishes a confirmed static whitelist of 48 common, recognizable job titles and standard university majors across the 8 approved fields in Thailand (`src/data/careerCatalog.ts`).
2. **Defensive Route Guardrail**: Implements automated catalog whitelist validation in `src/app/api/guide/route.ts` that verifies every role title, major, and the 2 primary + 2 adjacent field spread before serving AI results, falling back to curated sample data (`src/data/mockCareerResults.ts`) with a visible sample notice if any check fails.
3. **Locked Qualitative Badges**: Eliminates all percentage fit scores and replaces startup jargon tiers with `Top Match` (2 primary matches) and `Explore Also` (2 adjacent matches).
4. **3-Stage Milestone Progression**: Adds a clear, 3-stage progression line to every card (college major, entry-level job, later career role) familiar in Thailand.
5. **Print Layout Overhaul**: Implements a dedicated print stylesheet and `PrintHeader` displaying Student Name, Grade Level, Date, persistent Advisor Note, and Sample Data Notice when mock data is used, while strictly omitting Student ID for privacy.
6. **Strict Scope Discipline**: Avoids introducing database writes (deferred to `feature/10-advisor-dashboard-db`), university admissions registries (deferred to `feature/9-thai-university-scaffold`), or global site copy audits (deferred to `feature/11-ux-copy-and-simplification`).

---

## 2. Phased Execution Sequence

The plan enforces a strict bottom-up dependency ordering across **7 testable phases**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PHASED EXECUTION PIPELINE                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Curated Career Catalog & Updated Mock Fallback Data (Data Layer)                        │
│          • Create src/data/careerCatalog.ts with 48 whitelisted entries across 8 approved fields │
│          • Implement helper functions: isWhitelistedTitle, isWhitelistedMajor, getCareersByField │
│          • Create src/data/mockCareerResults.ts strictly populated with catalog roles & badges   │
│                                    ↓                                                             │
│ Phase 2: Schema, Types, Prompt Constraints & Route Catalog Guardrail (Backend & Types)           │
│          • Update src/types/career.ts: add QualitativeBadge, CareerMilestones, purge fitScore    │
│          • Update src/schemas/career.schema.ts & src/ai/response-schema.json                     │
│          • Update src/lib/ai/prompts.ts: enforce catalog constraints & 3-stage milestones        │
│          • Update src/app/api/guide/route.ts: implement validateGuideSynthesisResult guardrail   │
│                                    ↓                                                             │
│ Phase 3: Copy Centralization & Qualitative Badge Definitions                                     │
│          • Update src/content/guideCopy.ts: add locked badges (Top Match / Explore Also),        │
│            milestone labels, permanent advisory notes, and purge percentage fit copy             │
│                                    ↓                                                             │
│ Phase 4: Career Match Card with 3-Stage Milestones & Qualitative Badges (Card UI)                │
│          • Update src/components/results/CareerMatchCard.tsx: render Top Match / Explore Also,   │
│            3-stage milestone progression (<ol>), grounded rationale, and zero percentages        │
│          • Ensure screen accordion toggling remains intact with aria-expanded & detailsId        │
│          • Preserve DOM structure via `isExpanded ? 'block' : 'hidden print:block'`              │
│                                    ↓                                                             │
│ Phase 5: Printable Header & Results Container (Print Layout & Privacy)                           │
│          • Create src/components/results/PrintHeader.tsx: render Name, Grade, Date,              │
│            persistent Advisor Note, Sample Data Notice; STRICTLY OMIT Student ID                 │
│          • Update src/components/results/ResultsContainer.tsx: mount PrintHeader and permanent   │
│            advisory disclaimer ("suggestions, not decisions" & Advisor reminder)                 │
│                                    ↓                                                             │
│ Phase 6: Print Stylesheet Overhaul (@media print)                                                │
│          • Update src/styles/globals.css & src/app/globals.css with @media print rules:         │
│            auto-expand cards ([id^="pathway-details-"] display: block !important), hide buttons  │
│            (.no-print), apply print-color-adjust: exact, and clean page-break rules              │
│                                    ↓                                                             │
│ Phase 7: Verification, Automated Testing & Quality Gate                                          │
│          • Create tests/unit/careerCatalog.test.ts (whitelist coverage, majors, milestones)     │
│          • Create tests/unit/resultsCardRefinements.test.ts (badges, no scores, print privacy)   │
│          • Run: npm run type-check, npm run lint, npm test, npm run build                        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. File Change Inventory

```
┌───────────────────────────────────────────────┬────────────┬────────────────────────────────────────────────────────┐
│ File Path                                     │ Action     │ Primary Purpose                                        │
├───────────────────────────────────────────────┼────────────┼────────────────────────────────────────────────────────┤
│ src/data/careerCatalog.ts                     │ Create     │ Curated static whitelist of 48 roles & standard majors │
│ src/data/mockCareerResults.ts                 │ Create     │ Compliant fallback data strictly matching catalog      │
│ src/types/career.ts                           │ Modify     │ Update PathwayCard, QualitativeBadge, CareerMilestones │
│ src/schemas/career.schema.ts                  │ Modify     │ Zod validation schema aligned with milestones & badges │
│ src/ai/response-schema.json                   │ Modify     │ JSON schema enforcing milestones & purging fitScore    │
│ src/lib/ai/prompts.ts                         │ Modify     │ System & user prompts enforcing catalog & 4-card spread│
│ src/app/api/guide/route.ts                    │ Modify     │ Defensive route validation & sample fallback guardrail │
│ src/content/guideCopy.ts                      │ Modify     │ Copy for locked badges, milestones, and advisory notes │
│ src/components/results/CareerMatchCard.tsx    │ Modify     │ Render qualitative badges, 3-stage milestones & card UI│
│ src/components/results/PrintHeader.tsx        │ Create     │ Printable header with privacy guard (omits Student ID) │
│ src/components/results/ResultsContainer.tsx   │ Modify     │ Mount PrintHeader, permanent advisory notices, layout  │
│ src/components/results/index.ts               │ Modify     │ Export PrintHeader alongside results components        │
│ src/styles/globals.css                        │ Modify     │ @media print styles: auto-expansion & color adjust     │
│ src/app/globals.css                           │ Modify     │ Mirror @media print rules in App Router globals        │
│ tests/unit/careerCatalog.test.ts              │ Create     │ Unit tests for catalog whitelist & helper functions    │
│ tests/unit/resultsCardRefinements.test.ts      │ Create     │ Unit tests for badges, milestones, print header & a11y │
└───────────────────────────────────────────────┴────────────┴────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Implementation Phases

### Phase 1: Curated Career Catalog & Updated Mock Data (Data Layer)
- **Files**:
  - `src/data/careerCatalog.ts` (NEW)
  - `src/data/mockCareerResults.ts` (NEW)
- **Details**:
  - Define `ApprovedField` (8 fields: Engineering & Technology, Healthcare & Life Sciences, Business & Economics, Design & Creative Arts, Communication & Humanities, Social Sciences & Law, Hospitality & Tourism, Environmental & Agricultural Sciences).
  - Define `CareerMilestones` (`education`, `entryRole`, `growthRole`).
  - Populate `CAREER_CATALOG` with all 48 confirmed roles and standard university majors familiar in Thailand as specified in contract Section 5.3.
  - Implement helper functions: `isWhitelistedTitle`, `isWhitelistedMajor`, `getCareersByField`, `getAllWhitelistedTitles`, `getAllWhitelistedMajors`.
  - In `src/data/mockCareerResults.ts`, implement `getMockCareerResults` providing 4 cards: 2 Top Match (Engineering & Technology: Software Developer, Data Analyst) + 2 Explore Also (Design: UI/UX Designer; Healthcare: Public Health Coordinator), complete with 3-stage milestones, grounded rationales, and zero percentage scores.

### Phase 2: Schema, Types, Prompt Constraints & Route Catalog Guardrail
- **Files**:
  - `src/types/career.ts` (MODIFY)
  - `src/schemas/career.schema.ts` (MODIFY)
  - `src/ai/response-schema.json` (MODIFY)
  - `src/lib/ai/prompts.ts` (MODIFY)
  - `src/app/api/guide/route.ts` (MODIFY)
- **Details**:
  - In `src/types/career.ts`:
    - Add `export type QualitativeBadge = 'Top Match' | 'Explore Also';`.
    - Update `PathwayCard` with `badge`, `milestones`, `groundedRationale`, and remove `fitScore`.
  - In `src/schemas/career.schema.ts` & `src/ai/response-schema.json`:
    - Remove `fitScore` / `fit_score` requirement.
    - Add `badge: z.enum(['Top Match', 'Explore Also'])`.
    - Add `milestones: z.object({ education: z.string(), entryRole: z.string(), growthRole: z.string() })`.
    - Add `groundedRationale: z.string()`.
  - In `src/lib/ai/prompts.ts`:
    - Update `PATHLESS_SYSTEM_PROMPT` to constrain suggestions strictly to catalog whitelist, mandate 2 Top Match + 2 Explore Also, require 3-stage milestones, and prohibit numerical scores.
  - In `src/app/api/guide/route.ts`:
    - Implement `validateGuideSynthesisResult`: verifies every `card.roleTitle` and `major` against `CAREER_CATALOG`, checks that there are exactly 2 `Top Match` and 2 `Explore Also` cards, and confirms $\ge 2$ distinct broad fields.
    - If validation fails, discard AI output, log warning, and return `getMockCareerResults(payload)` with `fallbackUsed: true`.

### Phase 3: Copy Centralization & Qualitative Badge Definitions
- **Files**:
  - `src/content/guideCopy.ts` (MODIFY)
- **Details**:
  - Purge legacy `fitScoreLabel` and `fitScoreTooltip`.
  - Purge startup tiers (`Primary Direct Match`, `High-Growth Pathway`, `Interdisciplinary Pivot`, `Moonshot Trajectory`).
  - Add locked qualitative badge copy:
    - `Top Match`: Label, high-contrast badge copy, and description.
    - `Explore Also`: Label, high-contrast badge copy, and description.
  - Add milestone labels: `milestonesTitle`, `stage1Label`, `stage2Label`, `stage3Label`.
  - Add permanent advisory copy: `"suggestions, not decisions"` disclaimer and Advisor consultation reminder.
  - Add PrintHeader copy: `printHeaderTitle`, `printAdvisorNote`, `printDateLabel`, `printGradeLabel`, `printSampleNotice`.

### Phase 4: Career Match Card with 3-Stage Milestones & Qualitative Badges
- **Files**:
  - `src/components/results/CareerMatchCard.tsx` (MODIFY)
- **Details**:
  - Eliminate all percentage score elements (no `95% Natural Fit` pill).
  - Render locked qualitative badge:
    - `Top Match`: `bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold px-3 py-1 text-xs rounded-full`.
    - `Explore Also`: `bg-sky-50 text-sky-800 border-sky-300 font-semibold px-3 py-1 text-xs rounded-full`.
  - Render Grounded Rationale banner linking day-to-day reality to student's intake responses.
  - Render 3-Stage Milestone Progression in an accessible `<ol>` list with stages 1 (What to Study), 2 (First Job), 3 (Later Career Role).
  - **Screen Accordion Invariant**: Keep accordion toggle button (`aria-expanded`, `aria-controls`), ensuring interactive collapse/expand functions seamlessly on screen.
  - **DOM Persistence Invariant**: Keep details container in DOM using `className={isExpanded ? 'block' : 'hidden print:block'}` so `@media print` unhides details without JavaScript.

### Phase 5: Printable Header & Results Container (Print Layout & Privacy)
- **Files**:
  - `src/components/results/PrintHeader.tsx` (NEW)
  - `src/components/results/ResultsContainer.tsx` (MODIFY)
  - `src/components/results/index.ts` (MODIFY)
- **Details**:
  - In `src/components/results/PrintHeader.tsx`:
    - Render `hidden print:block` container at document top.
    - Display Student Name (`studentProfile?.fullName`), Grade Level (`studentProfile?.gradeLevel`), formatted Date, persistent Advisor Note, and Sample Data Notice when `fallbackUsed === true`.
    - **Privacy Guard**: Strictly omit `studentProfile?.studentId`.
    - Prevent SSR hydration mismatch by formatting date in client effect or using static date.
  - In `src/components/results/ResultsContainer.tsx`:
    - Mount `PrintHeader` above results header.
    - Permanently render the "suggestions, not decisions" advisory banner and Advisor consultation reminder above the card stack.

### Phase 6: Print Stylesheet Overhaul (@media print)
- **Files**:
  - `src/styles/globals.css` (MODIFY)
  - `src/app/globals.css` (MODIFY)
- **Details**:
  - Overhaul `@media print` CSS block:
    - Force all card details open: `[id^="pathway-details-"] { display: block !important; visibility: visible !important; height: auto !important; }`.
    - Enable background colors and borders: `-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;`.
    - Hide interactive screen elements: `.no-print, button, [role="button"], nav, footer { display: none !important; }`.
    - Page break optimization: Apply `break-inside: avoid; page-break-inside: avoid;` to card containers and sub-sections (`li`, `.rounded-xl`).
    - High-contrast typography for black-and-white and color printing.

### Phase 7: Verification, Automated Testing & Quality Gate
- **Files**:
  - `tests/unit/careerCatalog.test.ts` (NEW)
  - `tests/unit/resultsCardRefinements.test.ts` (NEW)
- **Details**:
  - `tests/unit/careerCatalog.test.ts`:
    - Verifies 8 approved fields are defined without omission.
    - Verifies all 48 curated entries have valid title, field, standardMajors, milestones, defaultTasks, and dayInTheLifeSummary.
    - Verifies `isWhitelistedTitle` and `isWhitelistedMajor` return true for valid catalog items and false for unknown/invented terms.
    - Verifies zero forbidden legacy terms (`Moonshot`, `Interdisciplinary Pivot`, `Fit Score`, `Triage`, `Dossier`).
  - `tests/unit/resultsCardRefinements.test.ts`:
    - Verifies `Top Match` and `Explore Also` badges render without percentage numbers.
    - Verifies zero percentage scores or `% Natural Fit` appear anywhere in rendered card markup.
    - Verifies 3-stage milestone progression renders all 3 stages with semantic numbering.
    - Verifies grounded rationale renders with student-specific context.
    - Verifies `PrintHeader` renders Student Name, Grade, Date, Advisor Note, and strictly omits Student ID.
    - Verifies permanent "suggestions, not decisions" note and Advisor reminder are visible.
    - Verifies `validateGuideSynthesisResult` rejects invalid roles, non-catalog majors, or incorrect badge spread, activating sample fallback.
  - **Quality Gate Execution**:
    - `npm run type-check` (`tsc --noEmit`)
    - `npm run lint` (`next lint`)
    - `npm test` (`tsx --test tests/**/*.test.ts`)
    - `npm run build` (`next build`)

---

## 5. Architectural Safety Checks & Invariant Audit

| Check # | Requirement | Implementation Plan Verification | Status |
| :--- | :--- | :--- | :--- |
| **Check 1** | Curated catalog & mock data established before modifying UI & print CSS | Phase 1 establishes `careerCatalog.ts` and `mockCareerResults.ts` first. UI modifications in Phase 4 and CSS in Phase 6 depend strictly on completed Phase 1 data structures. | **PASS** |
| **Check 2** | Screen view accordions function normally while print query forces all details open | `CareerMatchCard.tsx` preserves interactive `isExpanded` state and `<button>` toggles for screen view. CSS `@media print` uses `[id^="pathway-details-"] { display: block !important; }` without altering screen state. | **PASS** |
| **Check 3** | Test commands aligned with real scripts in `package.json` | Plan uses exact scripts from `package.json`: `npm test` (`tsx --test tests/**/*.test.ts`), `npm run type-check` (`tsc --noEmit`), `npm run lint` (`next lint`), `npm run build` (`next build`). | **PASS** |
| **Check 4** | Strictly avoids database writes or university admissions data reserved for future branches | Zero database models, PostgreSQL queries, or Prisma operations (deferred to Feature 10). Zero Thai university admissions registries or TCAS cutoffs (deferred to Feature 9). Advisor note is a static print notice. | **PASS** |

---

## 6. Execution Gate

**Status**: PENDING EXPLICIT USER APPROVAL.  
**Gate Condition**: No application code or test files will be written until explicit user approval is granted.
