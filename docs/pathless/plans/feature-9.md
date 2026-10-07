---
doc: implementation-plan
feature: 9-thai-university-scaffold
project: PathLess - Framework v2
status: approved
gate: PASS
---

# Feature 9: Step-by-Step Implementation Plan
## Thai University Scaffold — Phased Architecture & Execution Blueprint

This implementation plan defines the phased, sequential execution blueprint for **Feature 9: Thai University Scaffold** of the **PathLess Framework v2** on branch `feature/9-thai-university-scaffold`, implementing the approved technical contract ([docs/pathless/contracts/feature-9.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-9.md)).

---

## 1. Overview of Execution Strategy

Feature 9 transitions PathLess from preliminary career discovery recommendations to actionable, verified regional higher education guidance across Thailand:
1. **Human-Curated Static Registry (`src/data/thaiUniversities.ts`)**: Establishes an immutable static registry of **17 confirmed Thai higher education institutions** (11 public/autonomous flagships and 6 leading private universities) providing **83 standard bachelor's degree programs** strictly mapped to the **8 Feature 14 approved catalog fields**.
2. **Pure Deterministic Matching with Regional Equity (`src/lib/universityMatcher.ts`)**: Implements pure, side-effect-free TypeScript lookup utilities resolving recommended card majors to up to 3 verified regional programs without runtime Gemini LLM calls (guaranteeing zero AI hallucination of degree titles or admissions criteria). Includes a **Regional Balancing Heuristic** to ensure Northern, Northeastern, Southern, and Eastern institutions are represented alongside Central Bangkok flagships.
3. **Exploratory Audit Status & Disclaimer Guardrails**: Marks all initial entries with `'NEEDS_CHECKING'` audit status and displays prominent notices reminding students and families to verify entrance requirements directly with official university admissions offices.
4. **Interactive Where to Study Panel & Badges (`WhereToStudySection.tsx`, `UniversityProgramBadge.tsx`)**: Replaces the Feature 8 placeholder shell with an accessible, bilingual program list maintaining layout containment (`contain: content`, `min-h-[110px]`, CLS = 0.00).
5. **Calm Fallback State**: Renders a reassuring curation notice when a recommended major does not yet have curated institutional mappings.
6. **Accessibility & Security Compliance**: Enforces explicit `rel="noopener noreferrer"` and `target="_blank"` on all outbound links, $\ge 44 \times 44$ px touch targets, and descriptive assistive technology `aria-label`s.
7. **Strict Scope Discipline**: Operates strictly client-side as a read-only static discovery scaffold, avoiding serverless database writes (deferred to `feature/10-advisor-dashboard-db`) or global copy audits (deferred to `feature/11-ux-copy-and-simplification`).

---

## 2. Acceptance Criteria Traceability Matrix

Every implementation task maps directly to one or more formal acceptance criteria:

```
┌─────────────┬────────────────────────────────────────────────────────┬──────────────────────────────────────────────┐
│ Criteria ID │ Requirement Summary                                    │ Implementing Modules & Files                 │
├─────────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ AC-THAI-01  │ Static registry covers 17 confirmed institutions with   │ src/types/university.ts                      │
│             │ bilingual names, official links, last-checked          │ src/data/thaiUniversities.ts                 │
│             │ timestamps, and zero fees, quotas, or rankings.        │ tests/unit/thaiUniversitiesRegistry.test.ts  │
├─────────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ AC-THAI-02  │ Matching utility maps a career card major to regional  │ src/lib/universityMatcher.ts                 │
│             │ university programs deterministically without AI calls.│ tests/unit/universityMatcher.test.ts         │
├─────────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ AC-THAI-03  │ WhereToStudySection displays verified program cards    │ src/components/results/WhereToStudySection.tsx│
│             │ with external link affordances, last-checked notice,   │ src/components/results/UniversityProgramBadge│
│             │ and an exploratory reminder to consult admissions.     │ tests/unit/universityMatcher.test.ts         │
├─────────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ AC-THAI-04  │ If no verified program matches a recommended major,    │ src/components/results/WhereToStudySection.tsx│
│             │ renders calm notice stating pathways are being curated.│ src/content/guideCopy.ts                     │
├─────────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ AC-THAI-05  │ 100% of user-facing copy resides in guideCopy.ts,      │ src/content/guideCopy.ts                     │
│             │ containing zero jargon, with bilingual titles rendered.│ tests/unit/universityMatcher.test.ts         │
└─────────────┴────────────────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 3. Phased Execution Pipeline

The implementation sequence enforces a strict bottom-up dependency order across **7 distinct phases**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PHASED EXECUTION PIPELINE                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: University TypeScript Contracts & Data Models (Contracts Layer)                         │
│          • Create src/types/university.ts defining ThaiUniversity, UniversityProgram,            │
│            UniversityProgramCardData, MatchingStrategy, and VerificationStatus                   │
│          • Include Thai degree nomenclature (degreeTypeTh: วศ.บ., วท.บ., etc.)                   │
│                                    ↓                                                             │
│ Phase 2: Static Thai University & Program Registry (Data Layer)                                  │
│          • Create src/data/thaiUniversities.ts with 17 institutions & 83 curated programs        │
│          • Map strictly to the 8 Feature 14 ApprovedFields and standard catalog majors           │
│          • Populate official faculty HTTPS URLs, lastChecked: '2026-10-04', and NEEDS_CHECKING   │
│                                    ↓                                                             │
│ Phase 3: Pure Deterministic Matching Utility with Regional Balancing (Domain Logic)              │
│          • Create src/lib/universityMatcher.ts                                                   │
│          • Implement findProgramsByMajor, findProgramsByField, matchProgramsForCard              │
│          • Codify Regional Balancing Heuristic: prevent Central Bangkok monopolization           │
│          • Enforce max 3 programs, institutional deduplication, and zero AI runtime calls        │
│                                    ↓                                                             │
│ Phase 4: Centralized Copy Dictionary & Localization (Content Layer)                              │
│          • Update src/content/guideCopy.ts: overhaul RESULTS_COPY.whereToStudy                   │
│          • Add admissions advisory notice, verified registry badge, needs checking status,       │
│            calm fallback copy, and descriptive ARIA generator functions                          │
│                                    ↓                                                             │
│ Phase 5: Reusable Program Card Badge Component (UI Presentation Layer)                           │
│          • Create src/components/results/UniversityProgramBadge.tsx                              │
│          • Render bilingual university and program titles, degree pill, campus/region badge      │
│          • Implement accessible external link button: target="_blank", rel="noopener noreferrer",│
│            min 44x44px touch target, and high-contrast visible focus rings                       │
│                                    ↓                                                             │
│ Phase 6: Where to Study Container Overhaul & Card Integration (Integration Layer)                │
│          • Update src/components/results/WhereToStudySection.tsx: mount matchResult, render     │
│            badges or calm fallback, preserve contain: content and min-h-[110px] (CLS = 0.00)     │
│          • Update src/components/results/CareerMatchCard.tsx: pass broadField at line 329        │
│          • Update src/components/results/index.ts: export UniversityProgramBadge                 │
│                                    ↓                                                             │
│ Phase 7: Automated Testing, Linting & Build Verification (Quality Gate)                          │
│          • Create tests/unit/thaiUniversitiesRegistry.test.ts (17 institutions, 8 fields)        │
│          • Create tests/unit/universityMatcher.test.ts (determinism, regional spread, a11y)      │
│          • Execute verification suite: npm test, npm run type-check, npm run lint, npm run build │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. File Change Inventory

```
┌───────────────────────────────────────────────┬────────────┬────────────────────────────────────────────────────────┐
│ File Path                                     │ Action     │ Primary Purpose & Responsibilities                     │
├───────────────────────────────────────────────┼────────────┼────────────────────────────────────────────────────────┤
│ src/types/university.ts                       │ Create     │ TypeScript contracts for institutions, programs, cards │
│ src/data/thaiUniversities.ts                  │ Create     │ Static registry of 17 universities & 83 bachelor progs │
│ src/lib/universityMatcher.ts                  │ Create     │ Pure deterministic matcher with regional balancing     │
│ src/content/guideCopy.ts                      │ Modify     │ Centralized user-facing copy for whereToStudy section  │
│ src/components/results/UniversityProgramBadge │ Create     │ Accessible program card badge with safe external link  │
│ src/components/results/WhereToStudySection.tsx│ Modify     │ Interactive regional panel with calm fallback state    │
│ src/components/results/CareerMatchCard.tsx    │ Modify     │ Pass broadField prop into WhereToStudySection call     │
│ src/components/results/index.ts               │ Modify     │ Export UniversityProgramBadge alongside results comps  │
│ tests/unit/thaiUniversitiesRegistry.test.ts   │ Create     │ Unit tests for static registry schema & coverage       │
│ tests/unit/universityMatcher.test.ts          │ Create     │ Unit tests for matcher determinism, spread, and a11y   │
└───────────────────────────────────────────────┴────────────┴────────────────────────────────────────────────────────┘
```

---

## 5. Detailed Implementation Phases

### Phase 1: University TypeScript Contracts & Data Models (`src/types/university.ts`)
- **Action**: Create `src/types/university.ts`.
- **Target Acceptance Criteria**: `AC-THAI-01`, `AC-THAI-02`.
- **Exact TypeScript Contracts**:
  ```typescript
  import { ApprovedField } from '@/data/careerCatalog';

  export type ThaiRegion = 'Central' | 'Northern' | 'Northeastern' | 'Southern' | 'Eastern';

  export type InstitutionType = 'PUBLIC_AUTONOMOUS' | 'PRIVATE';

  export type VerificationStatus = 'NEEDS_CHECKING' | 'VERIFIED' | 'UNDER_REVIEW';

  export interface ThaiUniversity {
    id: string; // e.g. 'chulalongkorn', 'kmutt'
    nameEn: string; // e.g. 'Chulalongkorn University'
    nameTh: string; // e.g. 'จุฬาลงกรณ์มหาวิทยาลัย'
    abbreviationEn: string; // e.g. 'CU'
    abbreviationTh: string; // e.g. 'จุฬาฯ'
    type: InstitutionType; // 'PUBLIC_AUTONOMOUS' | 'PRIVATE'
    region: ThaiRegion;
    campus: string; // e.g. 'Pathum Wan, Bangkok'
    province: string;
    officialWebsiteUrl: string; // Official HTTPS domain root
  }

  export interface UniversityProgram {
    id: string; // e.g. 'cu-eng-comp'
    universityId: string; // Foreign key matching ThaiUniversity.id
    nameEn: string; // Degree program name in English
    nameTh: string; // Degree program name in Thai
    facultyEn: string; // Faculty / School name in English
    facultyTh: string; // Faculty / School name in Thai
    degreeType: string; // English degree abbreviation (e.g. 'B.Eng.', 'B.Sc.')
    degreeTypeTh: string; // Thai MHESI degree abbreviation (e.g. 'วศ.บ.', 'วท.บ.')
    field: ApprovedField; // One of 8 Feature 14 ApprovedFields
    mappedMajors: string[]; // Whitelisted standard majors from CAREER_CATALOG
    officialWebsiteUrl: string; // Direct link to faculty/curriculum page (HTTPS only)
    verificationStatus: VerificationStatus; // Initial value: 'NEEDS_CHECKING'
    lastChecked: string; // ISO 8601 audit timestamp ('YYYY-MM-DD')
  }

  export interface UniversityProgramCardData {
    programId: string;
    universityId: string;
    universityNameEn: string;
    universityNameTh: string;
    universityAbbreviation: string;
    institutionType: InstitutionType;
    region: ThaiRegion;
    campus: string;
    programNameEn: string;
    programNameTh: string;
    facultyEn: string;
    facultyTh: string;
    degreeType: string;
    degreeTypeTh: string;
    field: ApprovedField;
    mappedMajors: string[];
    officialWebsiteUrl: string;
    verificationStatus: VerificationStatus;
    lastChecked: string;
  }

  export type MatchingStrategy = 'DIRECT_MAJOR' | 'BROAD_FIELD' | 'NONE';

  export interface UniversityMatchResult {
    matchedPrograms: UniversityProgramCardData[]; // Up to 3 programs
    strategy: MatchingStrategy;
    targetMajors: string[];
    targetField?: ApprovedField | string;
    fallbackNoticeRequired: boolean;
  }
  ```

---

### Phase 2: Static Thai University & Program Registry (`src/data/thaiUniversities.ts`)
- **Action**: Create `src/data/thaiUniversities.ts`.
- **Target Acceptance Criteria**: `AC-THAI-01`.
- **Exact Specifications**:
  - Export `THAI_UNIVERSITIES: ThaiUniversity[]` containing all **17 confirmed institutions**:
    1. Chulalongkorn University (`chulalongkorn`) - Central (Bangkok)
    2. Kasetsart University (`kasetsart`) - Central (Bangkok)
    3. Thammasat University (`thammasat`) - Central (Pathum Thani / Bangkok)
    4. King Mongkut's University of Technology Thonburi (`kmutt`) - Central (Bangkok)
    5. Mahidol University (`mahidol`) - Central (Nakhon Pathom / Bangkok)
    6. Srinakharinwirot University (`swu`) - Central (Bangkok / Nakhon Nayok)
    7. Silpakorn University (`silpakorn`) - Central / Western (Bangkok / Nakhon Pathom)
    8. Chiang Mai University (`cmu`) - Northern (Chiang Mai)
    9. Khon Kaen University (`kku`) - Northeastern (Khon Kaen)
    10. Prince of Songkla University (`psu`) - Southern (Songkhla / Pattani / Phuket)
    11. Burapha University (`buu`) - Eastern (Chonburi)
    12. Bangkok University (`bangkok-u`) - Central (Pathum Thani)
    13. Assumption University (`assumption`) - Central (Samut Prakan / Bangkok)
    14. Rangsit University (`rangsit`) - Central (Pathum Thani)
    15. University of the Thai Chamber of Commerce (`utcc`) - Central (Bangkok)
    16. Sripatum University (`sripatum`) - Central (Bangkok)
    17. Stamford International University (`stamford`) - Central (Bangkok / Cha-Am)
  - Export `THAI_UNIVERSITY_PROGRAMS: UniversityProgram[]` containing **83 curated standard bachelor programs** (2-4 per institution, 5-8 for comprehensive flagships) strictly mapped to the 8 approved fields.
  - Strict invariants:
    - Every program has valid `lastChecked: '2026-10-04'`.
    - Every program has `verificationStatus: 'NEEDS_CHECKING'`.
    - Absolute exclusion of tuition fees, admission quotas, and national rankings.

---

### Phase 3: Pure Deterministic Matching Utility with Regional Balancing (`src/lib/universityMatcher.ts`)
- **Action**: Create `src/lib/universityMatcher.ts`.
- **Target Acceptance Criteria**: `AC-THAI-02`.
- **Exact Implementation Details**:
  - Implement lookup functions:
    - `getUniversityById(id: string): ThaiUniversity | undefined`
    - `buildProgramCardData(program: UniversityProgram): UniversityProgramCardData | null`
    - `findProgramsByMajor(majorName: string): UniversityProgram[]`
    - `findProgramsByField(field: ApprovedField): UniversityProgram[]`
    - `getAllUniversities(): ThaiUniversity[]`
    - `getAllPrograms(): UniversityProgram[]`
  - Implement `matchProgramsForCard(card: { majors?: string[]; broadField?: ApprovedField | string }): UniversityMatchResult`:
    - **Step 1 (Direct Major Resolution)**: Search `findProgramsByMajor` across all card majors.
    - **Step 2 (Regional Balancing Heuristic)**: Partition matching candidates by region (`Central` vs `Regional`: Northern, Northeastern, Southern, Eastern). If both Central and non-Central regional programs match, reserve at least 1 slot for a non-Central regional institution and 1 slot for an autonomous/private alternative to prevent Central Bangkok monopolization.
    - **Step 3 (Institutional Deduplication)**: Enforce `seenUniversities` set so that no university appears twice in the top 3 recommendations.
    - **Step 4 (Broad Field Fallback)**: If 0 direct major matches exist, fall back to `findProgramsByField(broadField)` applying the same deduplication and regional balancing rules (`strategy = 'BROAD_FIELD'`).
    - **Step 5 (Calm Fallback Result)**: If 0 matches are found, return `matchedPrograms: []`, `strategy: 'NONE'`, and `fallbackNoticeRequired: true`.
    - **Zero AI Runtime Calls Invariant**: Pure synchronous execution, zero API network calls, zero `Math.random()`.

---

### Phase 4: Centralized Copy Dictionary (`src/content/guideCopy.ts`)
- **Action**: Modify `src/content/guideCopy.ts`.
- **Target Acceptance Criteria**: `AC-THAI-05`.
- **Exact Copy Additions to `RESULTS_COPY.whereToStudy`**:
  ```typescript
  whereToStudy: {
    title: 'Where to Study',
    verifiedRegistryBadge: 'Verified Institution Directory',
    needsCheckingBadge: 'Needs Checking',
    verifiedBadge: 'Verified Entry',
    description:
      'Explore standard undergraduate degree programs at verified universities across Thailand. Pathways are human-curated to help you and your advisor discover genuine academic environments.',
    publicAutonomousLabel: 'Public / Autonomous',
    privateLabel: 'Private University',
    lastCheckedLabel: 'Last checked',
    targetMajorsLabel: 'Target Fields',
    visitOfficialProgramCta: 'Visit official department page',
    openProgramLinkAria: (program: string, university: string) =>
      `Visit official ${program} program page at ${university} (opens in new tab)`,
    admissionsNoticeTitle: 'Official Admissions Advisory',
    admissionsNoticeBody:
      'Admission requirements, portfolio guidelines, and annual seat allocations are determined independently by each university and change each academic cycle. We strongly encourage you to consult the official university admissions office and discuss requirements with your school advisor.',
    fallbackTitle: 'Curating Pathways for This Major',
    fallbackDescription: (major: string) =>
      `Verified institutional degree mappings for ${major} are currently being audited by regional advisors. We recommend exploring general university catalog listings or discussing options with your mentor.`,
    zeroHallucinationNote:
      'Zero unverified admissions claims. All university pathway data is verified by academic advisors.',
    comingSoonNotice:
      'Verified regional university connections and department pathways are being prepared for your area.',
  },
  ```
  *(Note: Preserves key existing strings such as `title: 'Where to Study'` and `zeroHallucinationNote: 'Zero unverified admissions claims...'` to guarantee backwards compatibility with Feature 8 component tests).*

---

### Phase 5: Reusable Program Card Badge Component (`src/components/results/UniversityProgramBadge.tsx`)
- **Action**: Create `src/components/results/UniversityProgramBadge.tsx`.
- **Target Acceptance Criteria**: `AC-THAI-03`, `AC-THAI-05`.
- **Exact Specifications**:
  - Render bilingual university name: `universityNameEn` (bold) + `universityNameTh` (subtle).
  - Institution type pill: `Public / Autonomous` (`bg-slate-100 text-slate-700`) vs `Private University` (`bg-indigo-50 text-indigo-700`).
  - Audit status tag: `Needs Checking` (`bg-amber-50 text-amber-800 border-amber-200`).
  - Program header: `[degreeType]` in brand color + `programNameEn`.
  - Program subline: `programNameTh • facultyEn (facultyTh)`.
  - Location tag: `📍 campus (region)` + `Last checked: YYYY-MM-DD`.
  - Outbound anchor button:
    - `href={program.officialWebsiteUrl}`
    - `target="_blank"`
    - `rel="noopener noreferrer"`
    - `aria-label={openProgramLinkAria(program.programNameEn, program.universityNameEn)}`
    - Touch target: `min-h-[44px] min-w-[44px]`
    - Focus ring: `focus-visible:ring-2 focus-visible:ring-edu-primary focus-visible:ring-offset-2`
  - Print optimization: `break-inside: avoid` to prevent print splitting.

---

### Phase 6: Where to Study Container Overhaul & Card Integration
- **Action**:
  - Modify `src/components/results/WhereToStudySection.tsx`.
  - Modify `src/components/results/CareerMatchCard.tsx`.
  - Modify `src/components/results/index.ts`.
- **Target Acceptance Criteria**: `AC-THAI-03`, `AC-THAI-04`.
- **Exact Specifications**:
  - In `src/components/results/WhereToStudySection.tsx`:
    - Accept props: `roleTitle?: string; majors?: string[]; broadField?: ApprovedField | string;`.
    - Invoke `useMemo(() => matchProgramsForCard({ majors, broadField }), [majors, broadField])`.
    - Preserve `contain: content` and `min-h-[110px]` styling (guaranteeing CLS = 0.00).
    - If `matchedPrograms.length > 0`:
      - Render header with title and `verifiedRegistryBadge`.
      - Render program badges grid.
      - Render official admissions office advisory box (`admissionsNoticeTitle` & `admissionsNoticeBody`).
    - If `fallbackNoticeRequired` (0 matches):
      - Render calm fallback card with `fallbackTitle` and `fallbackDescription`.
    - Render persistent footer with `zeroHallucinationNote`.
  - In `src/components/results/CareerMatchCard.tsx`:
    - Update line 329 call site to pass `broadField={card.broadField || card.broad_field}`:
      ```tsx
      <WhereToStudySection
        roleTitle={roleTitle}
        majors={majors}
        broadField={card.broadField || card.broad_field}
      />
      ```
  - In `src/components/results/index.ts`:
    - Export `UniversityProgramBadge`.

---

### Phase 7: Automated Testing, Linting & Build Verification (Quality Gate)
- **Action**:
  - Create `tests/unit/thaiUniversitiesRegistry.test.ts`.
  - Create `tests/unit/universityMatcher.test.ts`.
  - Run verification commands.
- **Target Acceptance Criteria**: All (`AC-THAI-01` through `AC-THAI-05`).
- **Test Suite 1: `tests/unit/thaiUniversitiesRegistry.test.ts`**:
  - Asserts exactly 17 confirmed institutions are defined (11 public, 6 private).
  - Asserts coverage across all 5 macro-regions (Central, Northern, Northeastern, Southern, Eastern).
  - Asserts all 8 Feature 14 ApprovedFields are covered across the registry.
  - Asserts every program maps to valid standard majors in `CAREER_CATALOG`.
  - Asserts valid HTTPS URLs, non-empty bilingual names, degree abbreviations, and `lastChecked` ISO dates.
  - Asserts all programs have `verificationStatus === 'NEEDS_CHECKING'`.
  - Asserts zero tuition fees, rankings, or quota properties exist in the registry objects.
- **Test Suite 2: `tests/unit/universityMatcher.test.ts`**:
  - Asserts determinism: multiple calls with identical arguments yield identical outputs.
  - Asserts direct major resolution: e.g., "Computer Engineering" matches CU, KMUTT, CMU, PSU.
  - Asserts program ceiling: matched programs never exceed 3 items.
  - Asserts institutional deduplication: top 3 recommendations contain no duplicate universities.
  - Asserts regional balancing: checks that regional institutions are not crowded out by Central flagships.
  - Asserts broad field fallback: unknown major with valid field resolves to programs in that field.
  - Asserts calm fallback: unknown major and missing field trigger `fallbackNoticeRequired === true` and empty array.
  - Asserts rendered markup: `WhereToStudySection` and `UniversityProgramBadge` render with `rel="noopener noreferrer"`, `target="_blank"`, 44x44px touch targets, and zero forbidden jargon.
- **Quality Gate Execution Commands**:
  - `npm test` (`tsx --test tests/**/*.test.ts`)
  - `npm run type-check` (`tsc --noEmit`)
  - `npm run lint` (`next lint`)
  - `npm run build` (`next build`)

---

## 6. Execution Command Reference (Directly from package.json)

The following commands are defined in [`package.json`](file:///d:/Hackathon/Beta_Folder/package.json) and will be executed to validate implementation health:

| Command | Script in `package.json` | Purpose |
| :--- | :--- | :--- |
| `npm run type-check` | `tsc --noEmit` | Validates TypeScript compilation across all new contracts and components. |
| `npm test` | `tsx --test tests/**/*.test.ts` | Runs the full Node 20 built-in test runner across all existing and new unit test suites. |
| `npm run lint` | `next lint` | Executes ESLint Next.js rules to verify zero linting or hook dependency regressions. |
| `npm run build` | `next build` | Produces production build bundle to verify static site generation and zero SSR errors. |

---

## 7. Execution Gate

**STATUS**: PENDING EXPLICIT USER APPROVAL.  
**GATE CONDITION**: In accordance with instructions, **no application code will be touched or executed until you explicitly review and approve this implementation plan**.
