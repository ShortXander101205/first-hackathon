---
doc: implementation-plan
feature: 1-contract-and-specs
project: PathwayAI - College Major and Career Triage MVP
status: draft
---

# PathwayAI: Step-by-Step Implementation Plan
## Contracts, Baseline Mock Data Fixtures & TypeScript Interfaces

This plan outlines the sequential phases to establish the foundational data contracts, type interfaces, schema validators, database DDL, and baseline mock fixtures for PathwayAI without implementing application logic.

---

## 1. Overview of Deliverables & Directory Structure

To maintain clean separation of concerns and ensure zero-friction onboarding during Feature 2 (Project Scaffolding) and Feature 3 (Core Triage Engine), the contracts and fixtures will be structured under a unified `contracts/` and `src/` hierarchy:

```
Beta_Folder/
├── docs/
│   └── pathway/
│       ├── spec.md                     # Approved Technical Specification
│       ├── api-spec.md                 # Approved API Contract & Gemini Protocols
│       └── implementation-plan.md       # This step-by-step plan
├── src/
│   ├── types/                          # Canonical TypeScript interfaces
│   │   ├── intake.ts                   # 4-question intake & student info models
│   │   ├── career.ts                   # 4-career recommendation card & trial course schema
│   │   ├── counselor.ts                # Counselor review & dashboard models
│   │   ├── database.ts                 # SQLite table row and entity types
│   │   └── index.ts                    # Barrel export
│   ├── schemas/                        # Runtime Zod validation schemas
│   │   ├── intake.schema.ts            # Client & API intake request validators
│   │   ├── career.schema.ts            # Gemini output & career card validators
│   │   └── counselor.schema.ts         # Counselor review & update validators
│   ├── db/
│   │   └── schema.sql                  # Canonical SQLite DDL with relational constraints
│   ├── ai/
│   │   ├── system-prompt.txt           # Exact Gemini system instructions
│   │   └── response-schema.json        # Google Gemini response_schema definition
│   └── fixtures/                       # Deterministic baseline mock data
│       ├── intake-submissions.json     # Sample student submissions (including Alex)
│       ├── career-dossiers.json        # Verified 4-card career dossiers
│       ├── counselor-reviews.json      # Sample counselor notes & status transitions
│       └── fallback-careers.json       # Zero-cost offline fallback cache (15 RPM guard)
```

---

## 2. Step-by-Step Implementation Roadmap

### Step 1: Establish Canonical TypeScript Type Interfaces
**Target Files**:
- `src/types/intake.ts`
- `src/types/career.ts`
- `src/types/counselor.ts`
- `src/types/database.ts`
- `src/types/index.ts`

**Implementation Details**:
1. `src/types/intake.ts`:
   - Define strict union types for `GradeLevel`, `IntellectualEnergy` (Q1), `WorkContext` (Q2), `AcademicFriction` (Q3), and `HorizonPriority` (Q4).
   - Define `StudentInfo` interface (`full_name`, `email?`, `grade_level`, `school_name?`).
   - Define `IntakeAnswers` interface containing `q1_intellectual_energy`, `q2_work_context`, `q3_academic_friction`, and `q4_horizon_priority`.
   - Define `IntakeSubmissionRequest` payload contract.
2. `src/types/career.ts`:
   - Define `MatchTier` union (`'Primary Direct Match' | 'High-Growth Pathway' | 'Interdisciplinary Pivot' | 'Moonshot Trajectory'`).
   - Define `TrialCourse` interface (`title`, `provider`, `description`, `estimated_hours`).
   - Define `CareerCard` interface (`id`, `role_title`, `match_tier`, `fit_score`, `fit_rationale`, `majors`, `daily_tasks`, `course_challenges`, `reassurance`, `trial_courses: [TrialCourse, TrialCourse]`).
   - Define `TriageSummary` and `TriageResult` interfaces.
3. `src/types/counselor.ts`:
   - Define `CounselorStatus` union (`'pending_review' | 'reviewed' | 'follow_up_scheduled'`).
   - Define `CounselorReview` and `CounselorDashboardItem` interfaces.
   - Define `CounselorDashboardResponse` and review update request payload.
4. `src/types/database.ts`:
   - Define raw SQL row interfaces for `StudentRow`, `IntakeSubmissionRow`, `CareerRecommendationRow`, and `CounselorReviewRow`.
5. `src/types/index.ts`:
   - Re-export all types cleanly for consumption across client and server.

**Mapped Acceptance Criteria**:
- **AC-01** (Intake Schema typing)
- **AC-03** (Strict 4-Career Recommendation Card Structure typing)
- **AC-05** (Counselor Dashboard data structure typing)

---

### Step 2: Implement Runtime Zod Validation Schemas
**Target Files**:
- `src/schemas/intake.schema.ts`
- `src/schemas/career.schema.ts`
- `src/schemas/counselor.schema.ts`

**Implementation Details**:
1. `src/schemas/intake.schema.ts`:
   - Construct `studentInfoSchema` enforcing non-empty trimmed strings, minimum 2 characters, maximum 100 characters, optional email regex validation, and valid enum values for `grade_level`.
   - Construct `intakeAnswersSchema` strictly validating enum members for Q1, Q2, Q3, and Q4.
   - Combine into `intakeSubmissionRequestSchema`.
2. `src/schemas/career.schema.ts`:
   - Construct `trialCourseSchema` validating string lengths and positive integers for `estimated_hours`.
   - Construct `careerCardSchema` validating:
     - `role_title` length >= 2
     - `fit_score` between 50 and 100
     - `majors` array with minimum 2 items
     - `daily_tasks` array with minimum 3 items
     - Non-empty `course_challenges` and `reassurance`
     - `trial_courses` tuple of **exactly 2 items**
   - Construct `triageResultSchema` enforcing `careers` array length of **exactly 4 items** with unique match tiers.
3. `src/schemas/counselor.schema.ts`:
   - Construct `counselorReviewUpdateSchema` validating `status`, string `notes`, and boolean `flagged_friction`.

**Mapped Acceptance Criteria**:
- **AC-01** (Input Validation & Error Guarding)
- **AC-02** (Structured Gemini Payload Validation)
- **AC-03** (4-Card Contract Invariant Enforcement)
- **AC-06** (Counselor Review Input Validation)

---

### Step 3: Define Canonical SQLite DDL Database Contract
**Target Files**:
- `src/db/schema.sql`

**Implementation Details**:
1. Draft the production-ready SQLite DDL with relational integrity:
   - Table `students`: primary key UUID, non-empty check constraints, grade level check constraint, creation timestamp.
   - Table `intake_submissions`: foreign key referencing `students(id)` with `ON DELETE CASCADE`, explicit columns for each intake question, and a raw JSON snapshot column.
   - Table `career_recommendations`: foreign key referencing `intake_submissions(id)` with unique constraint (1:1), text columns for archetype and narrative, JSON column for the 4 career cards, latency tracker, model identifier.
   - Table `counselor_reviews`: foreign key referencing `intake_submissions(id)` with unique constraint (1:1), status check constraint, notes, flagged friction integer flag (0 or 1), updated timestamp.
2. Define performance indexes:
   - `idx_submissions_created` on `intake_submissions(created_at DESC)`
   - `idx_reviews_status` on `counselor_reviews(status)`
   - `idx_submissions_friction` on `intake_submissions(q3_academic_friction)`

**Mapped Acceptance Criteria**:
- **AC-04** (Student Submission Database Persistence)
- **AC-05** (Counselor Dashboard Retrieval & Filtering)
- **AC-08** (Zero-Cost Local SQLite Architecture)

---

### Step 4: Codify Google Gemini 1.5 Flash Prompt & Schema Contracts
**Target Files**:
- `src/ai/system-prompt.txt`
- `src/ai/response-schema.json`

**Implementation Details**:
1. `src/ai/system-prompt.txt`:
   - Store the plain-text system prompt defining the persona of PathwayAI (expert educational advisor, vocational psychologist).
   - Mandate empathetic cognitive reframing addressing the student's stated Q3 anxiety.
   - Enforce the 4-card taxonomy (Primary Direct Match, High-Growth, Interdisciplinary Pivot, Moonshot).
   - Mandate zero-cost trial courses (free audits, Khan Academy, freeCodeCamp, Open Courseware).
2. `src/ai/response-schema.json`:
   - Define the strict OpenAPI/JSON-Schema object passed into Google GenAI SDK's `generationConfig.response_schema`.
   - Mark all required properties (`student_archetype`, `triage_narrative`, `careers` array with 4 items, each with role title, majors, daily tasks, challenges, reassurance, and 2 trial courses).

**Mapped Acceptance Criteria**:
- **AC-02** (Zero-Cost Gemini 1.5 Flash Prompt & Structured Output)
- **AC-03** (Strict 4-Career Recommendation Card Structure)
- **AC-07** (Zero Cost / Deterministic Gemini Generation)

---

### Step 5: Construct Baseline Mock Data Fixtures
**Target Files**:
- `src/fixtures/intake-submissions.json`
- `src/fixtures/career-dossiers.json`
- `src/fixtures/counselor-reviews.json`
- `src/fixtures/fallback-careers.json`

**Implementation Details**:
1. `src/fixtures/intake-submissions.json`:
   - Create realistic student test cases, prominently featuring the **Alex persona**:
     - *Case 1 (Alex)*: High school senior who loves building systems (`BUILD_SYSTEMS`), cares about healthcare (`HEALTH_BIO`), suffers from math anxiety (`HARD_MATH`), and seeks purposeful impact (`PURPOSE_IMPACT`).
     - *Case 2 (Taylor)*: High school junior passionate about pattern analysis (`ANALYZE_PATTERNS`) and tech (`TECH_INNOVATION`), dreads public speaking (`PUBLIC_SPEAKING`), seeking high earning security (`HIGH_EARNING_SECURITY`).
     - *Case 3 (Morgan)*: College sophomore interested in creative expression (`CREATE_EXPRESS`) and social policy (`SOCIAL_CIVIC`), dreads rote memorization (`HEAVY_MEMORIZATION`), seeking creative autonomy (`CREATIVE_AUTONOMY`).
2. `src/fixtures/career-dossiers.json`:
   - Create fully fleshed-out 4-card career dossiers corresponding to each intake profile.
   - For Alex:
     - Card 1: Biomedical Equipment & Systems Technologist (Applied circuitry, no theoretical calculus)
     - Card 2: Health Informatics Specialist (Applied database logic, high demand)
     - Card 3: Assistive Technology Designer (Human empathy, 3D prototyping)
     - Card 4: Surgical Robotics Operations Coordinator (Practical device systems, clinical leadership)
   - Ensure every card has exactly 2 verified free trial courses with estimated completion hours.
3. `src/fixtures/counselor-reviews.json`:
   - Create initial review states for the mock submissions, showing `pending_review`, `reviewed`, and `follow_up_scheduled` with sample counselor notes.
4. `src/fixtures/fallback-careers.json`:
   - Pre-bundle deterministic, high-quality career responses indexed by triage archetype to power the offline mock fallback engine when the Gemini API key is missing or rate-limited.

**Mapped Acceptance Criteria**:
- **AC-01** (Intake Test Fixtures)
- **AC-03** (Complete 4-Card Career Recommendation Fixtures)
- **AC-05** (Counselor Dashboard Initial Feed)
- **AC-07** (Offline Mock Fallback Engine)
- **AC-08** (Zero-Cost Local Demo Readiness)

---

### Step 6: Verify Type Coherence & Schema Validation Against Fixtures
**Target Action**:
- Write a lightweight Node/TypeScript verification script (e.g., `tests/verify-contracts.ts` or run via `ts-node` / `tsx` in subsequent tasks) to validate all JSON fixtures against their respective Zod schemas and TypeScript types.
- Ensure that `career-dossiers.json` and `fallback-careers.json` pass `triageResultSchema.parse()` with zero validation errors.

**Mapped Acceptance Criteria**:
- **AC-01** through **AC-08** comprehensive contract validation.

---

## 3. Acceptance Criteria Traceability Matrix

| Acceptance Criterion | Description | Primary Implementing Artifacts |
|---|---|---|
| **AC-01** | 4-Question Intake Schema & Validation | `src/types/intake.ts`<br>`src/schemas/intake.schema.ts`<br>`src/fixtures/intake-submissions.json` |
| **AC-02** | Zero-Cost Gemini 1.5 Flash Prompt & Structured Output | `src/ai/system-prompt.txt`<br>`src/ai/response-schema.json`<br>`docs/pathless/archive/api-spec-v1.md` |
| **AC-03** | Strict 4-Career Recommendation Card Structure | `src/types/career.ts`<br>`src/schemas/career.schema.ts`<br>`src/fixtures/career-dossiers.json` |
| **AC-04** | Student Submission Database Persistence | `src/db/schema.sql`<br>`src/types/database.ts` |
| **AC-05** | Counselor Dashboard Triage Table & Metrics | `src/types/counselor.ts`<br>`src/fixtures/counselor-reviews.json`<br>`docs/pathless/archive/spec-v1.md` |
| **AC-06** | Counselor Deep Inspection & Review Workflow | `src/types/counselor.ts`<br>`src/schemas/counselor.schema.ts`<br>`src/fixtures/counselor-reviews.json` |
| **AC-07** | 15 RPM Rate Limiting & Offline Mock Fallback Engine | `src/fixtures/fallback-careers.json`<br>`docs/pathless/archive/api-spec-v1.md` |
| **AC-08** | Zero-Cost Environment Architecture & Local Demo Readiness | `src/db/schema.sql`<br>`src/fixtures/*`<br>`docs/pathless/archive/spec-v1.md` |

---

## 4. Next Actions

Upon approval of this step-by-step implementation plan:
1. Initialize the directory structure (`src/types`, `src/schemas`, `src/db`, `src/ai`, `src/fixtures`).
2. Populate the TypeScript interfaces, Zod schemas, SQL DDL, and baseline mock fixtures.
3. Validate all mock fixtures against the schemas to guarantee contract integrity before scaffolding the application.
