# Decisions

## Feature 1: Contracts and Specifications (Completed: October 2, 2026)

- Source: `docs/pathless/archive/spec-v1.md`, `docs/pathless/archive/api-spec-v1.md`, `docs/pathless/plans/feature-1.md` (contract in `docs/pathless/contracts/`: not recorded).
- Branch: `feature/1-contract-and-specs`
- Data Architecture: Defined domain models, SQLite table schemas (`src/db/schema.sql`), and exact 4-tuple career recommendations (`src/types/career.ts`).
- Schema Validation: Created Zod validation schemas (`src/schemas/`) for runtime contract enforcement.
- AI Protocols: Specified Gemini 1.5 Flash structured response schema (`src/ai/response-schema.json`) and system prompt.
- Intake Scope & Counselor Reviews: Defined 4-question intake schema and student nickname (superseded by Feature 7), along with counselor review data structures (superseded by Feature 10 and Feature 11).

## Feature 2: Project Scaffolding and Educational Theme (Completed: October 2, 2026)

- Source: `docs/features/2-project-scaffolding/spec.md`, `docs/pathless/archive/feature-2-spec-v1.md`, `docs/pathless/plans/feature-2.md` (contract in `docs/pathless/contracts/`: not recorded).
- Branch: `feature/2-project-scaffolding`
- Framework & Runtime: Initialized Next.js 14 App Router with strict TypeScript; configured `serverComponentsExternalPackages: ['better-sqlite3']` in `next.config.mjs` to resolve native binding issues.
- Design System: Implemented anxiety-reducing Educational Blue and Slate palette (#1E3A8A primary, #2563EB interactive, #F8FAFC background, #0F172A slate text) via CSS custom properties and typed tokens (`src/lib/tokens.ts`).
- Iconography & Layout: Centralized Lucide icon mappings (`src/components/ui/icons.tsx`); created shared layout shell (`Header`, `Footer`, `Container`).
- Boilerplate Purge: Eliminated default Next.js starter assets and conflicting styles.

## Feature 3: Intake Wizard UI (Completed: October 2, 2026)

- Source: `docs/pathless/contracts/feature-3.md`, `docs/pathless/plans/feature-3.md`
- Branch: `feature/3-intake-wizard-ui`
- UI Presentation: Built 4-question Intake Wizard with empathetic student guidance and progressive step disclosure (superseded by Feature 7).
- Input Controls: Implemented accessible chip selection for tasks, subject dropdown, reflection textarea (150-char limit), and binary environment/ambition toggles.

## Feature 4: Intake State Machine (Completed: October 2, 2026)

- Source: `docs/pathless/contracts/feature-4.md`, `docs/pathless/plans/feature-4.md`
- Branch: `feature/4-intake-state-machine`
- State Management: Implemented pure reducer state machine (`IntakeContext`) managing 4-step wizard transitions, answer state, and forward navigation guards (superseded by Feature 7).
- Data Privacy & Persistence: Enforced SSR-safe transient storage sync using tab-scoped `sessionStorage` with automatic `MemoryStorage` fallback; no student PII is collected (superseded by Feature 7).
- Reset Flow: Integrated accessible confirmation dialog with focus trapping for starting over.

## Feature 5: AI Synthesis Service (Completed: October 4, 2026)

- Source: `docs/pathless/contracts/feature-5.md` (plan in `docs/pathless/plans/`: not recorded).
- Branch: `feature/5-ai-synthesis-service`
- Service Integration: Implemented Gemini 1.5 Flash client service (`src/lib/gemini.ts`) with schema-driven structured JSON outputs; legacy `/api/triage` route (superseded by Feature 8).
- Match Fit & Tiering: Calculated percentage fit scores (`% Natural Fit`) and assigned 4-tier archetype labels (`Direct Match`, `High Growth`, `Interdisciplinary`, `Moonshot`) (superseded by Feature 14).
- Resilience & Cost: Added static career fixtures fallback for network errors or API quota exhaustion to preserve zero-cost operation.
- Validation: Validated AI responses against Zod career schemas before returning to client.

## Feature 6: Recommendation Cards UI (Completed: October 4, 2026)

- Source: `docs/pathless/contracts/feature-6.md`, `docs/pathless/plans/feature-6.md`
- Branch: `feature/6-dossier-card-ui` (naming note: contains legacy term `dossier` to avoid rewriting git history).
- Card Presentation: Implemented 4-card recommendation dossier UI with percentage fit scores and archetype tier labels (`Direct Match`, `High Growth`, `Interdisciplinary`, `Moonshot`) (superseded by Feature 14).
- Friction Mitigation: Created expandable "Reality Check" drawer highlighting academic dread factors and trial courses (superseded by Feature 14).
- Error Handling: Inline calm error card on synthesis failure with "Try Again" retry action.

## Feature 7: Rework Intake and Contracts (Completed: October 4, 2026)

- Source: `docs/pathless/contracts/feature-7.md`, `docs/pathless/plans/feature-7.md`
- Branch: `feature/7-rework-intake-and-contracts`
- Student Profile Identification: Introduced Step 0 capturing student Full Name and Grade Level (required), and optional Student ID for advisor review (superseding Feature 4's no student PII policy).
- Intake Scope: Expanded question sequence from 4 to 10 high-yield questions for deeper reflection; no academic grades or scores required.
- Contracts V2: Upgraded intake schema, domain types, and guide copy to PathLess v2 standards.

## Feature 8: Rework Synthesis and Results (Completed: October 4, 2026)

- Source: `docs/pathless/contracts/feature-8.md`, `docs/pathless/plans/feature-8.md`
- Branch: `feature/8-rework-synthesis-and-results`
- API Route Migration: Migrated legacy `/api/triage` to `/api/guide` using Next.js App Router; enforced RFC 7807 problem details error format without leaking internal technical traces.
- Prompt Calibration: Implemented grounded prompt generation (`PATHLESS_SYSTEM_PROMPT` & `buildGuideUserPrompt`) calling Gemini with strict JSON schema constraints.
- Presentation Layer: Implemented 4-card progressive disclosure layout (`ResultsContainer.tsx`, `CareerMatchCard.tsx`) with all cards collapsed on initial load (initial card structure, fit scores, and print styles superseded by Feature 14).
- Mock Fallback: Implemented deterministic fallback recommendations (`getMockGuideRecommendations` in `src/lib/ai/mockFallback.ts`) for zero-cost and offline safety.

## Feature 9: Thai University Scaffold (Completed: October 4, 2026)

- Source: `docs/pathless/contracts/feature-9.md`, `docs/pathless/plans/feature-9.md`, `src/data/thaiUniversities.ts`, `src/lib/universityMatcher.ts`
- Branch: `feature/9-thai-university-scaffold`
- Data architecture: Implemented static human-curated registry (`src/data/thaiUniversities.ts`) with deterministic lookup utility (`src/lib/universityMatcher.ts`); zero AI runtime generation or external web scraping.
- Coverage: Seeded 17 confirmed institutions across Bangkok, Central, and regional flagships, mapped strictly to the 8 career catalog fields.
- UI Integration: Updated `WhereToStudySection` inside expanded career cards with bilingual labels, verified source links (`rel="noopener noreferrer"`), and last-checked timestamps.
- Fallback: Non-breaking calm curation placeholder rendered when a recommended major has no active regional entries.

## Feature 10: Advisor Dashboard and Database Persistence (Completed: October 6, 2026)

- Source: `docs/pathless/contracts/feature-10.md`, `docs/pathless/plans/feature-10.md`, `prisma/schema.prisma`, `src/app/api/guide/route.ts`, `src/app/api/advisor/students/route.ts`
- Branch: `feature/10-advisor-dashboard-db`
- How Submissions Are Saved: When a student completes the 10-step intake wizard, `POST /api/guide` invokes the `persistSubmissionSafely` helper (`src/app/api/guide/route.ts`). It creates a `StudentSubmission` record in PostgreSQL via `prisma.studentSubmission.create` containing student profile fields (`fullName`, `gradeLevel`, optional `studentId`), a relational 1-to-1 `IntakeResponse` (all 10 answers and integer `academicYear: 2026`), and `SynthesisResult` (the 4 generated career cards serialized as JSON). If `DATABASE_URL` is unset or database write fails, the error is caught, a server warning without PII is logged, the submission is saved to the in-memory fallback store (`addMockAdvisorSubmission`), and HTTP 200 with synthesis cards is returned to the student.
- How Advisor View Decides Which Students An Advisor Can See: Advisors authenticate via a single shared school passcode (configured via the `ADVISOR_PASSCODE` environment variable) that grants an httpOnly session cookie (`src/lib/auth.ts`). There are no individual advisor user accounts or per-advisor student assignments; all authenticated advisors have access to all student submissions across the school (single-tenancy school-wide directory). The endpoint `GET /api/advisor/students` (`src/app/api/advisor/students/route.ts`) queries `prisma.studentSubmission.findMany` ordered by `createdAt: 'desc'`, allowing filtering by `gradeLevel` and search text matching `fullName` or `studentId` (case-insensitive contains). If the database is unreachable, it serves submissions from `src/data/mockAdvisorSubmissions.ts`.
- Data Privacy & Retention: Enforced required Name and Grade, optional opaque Student ID; created annual purge routine (`POST /api/admin/purge`) purging records prior to July 1 cut-off.
- Language: Completely avoided raw SQL, database column names, and system terms in advisor UI.

## Feature 11: UX Copy and Simplification (Completed: October 6, 2026)

- Source: `docs/pathless/contracts/feature-11.md`, `docs/pathless/plans/feature-11.md`, `src/content/guideCopy.ts`, `src/content/advisorCopy.ts`, `src/content/intakeQuestions.ts`
- Branch: `feature/11-ux-copy-and-simplification`
- Centralized Strings: Extracted 100% of student- and advisor-facing copy into centralized dictionaries (`src/content/guideCopy.ts`, `src/content/advisorCopy.ts`, `src/content/intakeQuestions.ts`).
- Terminology Purge: Eradicated prohibited legacy and technical terms (`dossier`, `PathwayAI`, `Triage`, `Counselor`, `algorithm`, `AI engine`, `synthesis`, `database`) across all components, contracts, and rendered views.
- Reading Level & Tone: Standardized intake questions, helper hints, error notices, and results milestones to a calm, supportive 8th-to-12th grade reading comprehension level.
- Educator Interface: Refactored `/advisor` dashboard labels, empty states, and action buttons to intuitive educational terminology.
- Accessibility & Styling: Verified WCAG 2.1 AA text contrast and smooth responsive text reflow across mobile, desktop, print views, and 200% zoom.

## Feature 12: Safety and Guardrails (Completed: October 7, 2026)

- Source: `docs/pathless/contracts/feature-12.md`, `docs/pathless/plans/feature-12.md`, `src/lib/rateLimit.ts`, `src/lib/sanitize.ts`
- Branch: `feature/12-safety-and-guardrails`
- Rate Limiting: Implemented in-memory sliding-window throttling for `/api/guide` (5 req/10 min per IP) and `/api/advisor/login` (5 req/min per IP) without paid third-party infrastructure.
- Input Validation & Sanitization: Integrated Zod schemas across all API route payloads; stripped HTML/script injection patterns from student names, IDs, and free-text responses.
- Prompt Injection Defenses: Enclosed user free-text in strict delimiter boundaries within the synthesis prompt to neutralize instruction overrides.
- Error Resilience: Deployed React Error Boundaries across intake and advisor routes to intercept runtime exceptions and display calm, accessible fallbacks with zero exposed stack traces or system internals.

## Feature 13: Deployment and E2E Testing (In progress / Active: October 7, 2026)

- Source: `docs/pathless/contracts/feature-13.md`, `docs/pathless/plans/feature-13.md`, `Dockerfile`, `.github/workflows/ci.yml`, `playwright.config.ts`, `docs/pathless/runbooks/deployment.md`
- Branch: `feature/13-deployment-and-e2e`
- Containerization: Created multi-stage production `Dockerfile` with standalone Next.js server output and unprivileged runtime user.
- CI Workflow: Implemented `.github/workflows/ci.yml` running lint, TypeScript type-check, unit/integration tests, Docker build verification, and Playwright E2E suites.
- End-to-End Test Matrix: Added Playwright test suites covering full student intake journey (`tests/e2e/student-flow.spec.ts`), advisor portal authentication and note-taking (`tests/e2e/advisor-flow.spec.ts`), and security guardrails (`tests/e2e/guardrails.spec.ts`).
- Mock Sync Resilience: Implemented in-memory cross-request sync (`src/data/mockAdvisorSubmissions.ts`) so new student submissions appear in the advisor portal during zero-cost and CI runs without a configured PostgreSQL database.

## Feature 14: Simpler Suggestions and Clean PDF (Follow-up: October 4, 2026)

_Notes: Follow-up to Feature 8; not part of the original running order._

- Source: `docs/pathless/contracts/feature-14.md`, `docs/pathless/plans/feature-14.md`
- Branch: `feature/14-simpler-suggestions-and-clean-pdf` (no separate branch in git; not recorded).
- Job titles and majors: Titles and majors are selected strictly from a curated list of common, recognizable job titles and standard university majors across 8 fields (`src/data/careerCatalog.ts`). The AI is strictly prohibited from inventing job titles or majors.
- Card contents: Percentage fit scores (such as % Natural Fit) and jargon labels (such as Moonshot Trajectory and Interdisciplinary Pivot) are removed. They are replaced by simple qualitative badges: `Top Match` (for primary matches) and `Explore Also` (for adjacent matches) (superseding Features 5, 6, and 8). Each card displays the job title, the major to study, and an expanded summary explaining the job and its relation to the student's answers. The persistent "suggestions, not decisions" advisory note and reminder to speak with an Advisor remain on screen. Zero technical terms appear on screen.
- Number and spread of results: Exactly 4 career match cards. 2 cards directly match the primary interest area (badged `Top Match`), and 2 cards branch into adjacent fields (badged `Explore Also`).
- Career path steps: Each card includes a simple 3-stage progression line: (1) what to study in college, (2) common first job after graduation, and (3) a later career role (superseding Feature 6). Nothing too complex. Titles used in the career path steps must be familiar in Thailand, simple and clear.
- The PDF: Generated via a clean print-dedicated browser stylesheet (@media print), not a separate file generator (superseding Feature 8). All 4 cards automatically expand their full details in the print layout. Includes Student Name, Grade Level, Date, the persistent Advisor note, and the sample data notice if mock data is used. Student ID is omitted from the print layout for privacy. Zero technical terms appear in the PDF.

## Feature 15: Fixes, Questions Refinement, and Admissions Guidance (Completed: October 7, 2026)

- Source: `docs/pathless/contracts/feature-15.md`, `docs/pathless/plans/feature-15.md`
- Branch: `feature/15-fixes-questions-and-admissions` (Commit `843d797`)
- Bug Fixes: Implemented server-side cache revalidation (`revalidatePath('/advisor')`) for immediate advisor dashboard updates; hardened client-side synthesis error fallback card; mapped "Not sure" selections to exploratory interdisciplinary recommendations.
- Intake Expansion: Expanded intake sequence to 12 targeted questions for Grades 10–12, capturing high school study tracks (Science-Math, Arts-Language, etc.), collaborative work preferences, and concrete tasks at an 8th-grade reading level.
- Suggestions & Catalog: Preserved 4 locked primary cards for print fidelity while adding an "Explore More Paths" section listing 2–4 related roles from the curated catalog.
- Admissions Guidance: Seeded static high school track eligibility and official faculty admissions verification checklists for 5–7 flagship Thai universities (`src/data/admissionRequirements.ts`); all entries marked "needs checking"; strictly excluded student GPA/test score collection and prohibited AI-hallucinated cutoffs.

## Project Freeze & Submission Packaging (Completed: October 7, 2026)

- Feature Freeze: Declared formal feature freeze following Feature 15 completion to focus exclusively on audit remediation (E2E test alignment, credential security hardening, model string corrections) and submission deliverables.
- Licensing: Adopted standard MIT License (`LICENSE`) for open-source compliance on GitHub.
- Pilot Testing: Field-tested intake experience with high school upperclassmen; collected anonymous feedback with zero student personal data.

## Bug Fixes

- **Advisor view not showing new submissions** (Status: Resolved / Fixed in Feature 13, commit `0b64cdd`)
  - Source: `src/data/mockAdvisorSubmissions.ts`, `src/app/api/guide/route.ts`, `src/app/api/advisor/students/route.ts`
  - Cause: When `DATABASE_URL` was missing or unmigrated, `persistSubmissionSafely` caught the error silently, but `/api/advisor/students` served static mocks, causing new student submissions to disappear from the advisor view.
  - Resolution: Added cross-request in-memory submission synchronization via `globalThis.inMemoryAdvisorSubmissions` and `addMockAdvisorSubmission`.
- **Results error card and calm recovery** (Status: Resolved / Fixed in Feature 12, commit `8489fe0` and Feature 13)
  - Source: `src/components/intake/IntakeWizardContainer.tsx`, `src/content/guideCopy.ts`, `src/components/common/ErrorBoundary.tsx`
  - Cause: Synthesis failures or network loss left students on a blank screen or surfaced unhandled exceptions.
  - Resolution: Implemented an accessible inline error card rendering `RESULTS_COPY.error` ("We hit a temporary bump") with "Try Again" and "Review My Answers" buttons, shielded by React `ErrorBoundary` wrappers.
- **Theme decoration and background classes** (Status: Resolved / Fixed in Feature 2, commit `3e09950`)
  - Source: `src/components/layout/Footer.tsx`, `src/app/globals.css`
  - Cause: Incorrect Tailwind class names for link decoration and footer container backgrounds.
  - Resolution: Replaced with direct theme token classes (`border-edu-slate-200`, `bg-edu-slate-100`).
- **4-Tuple schema and response contracts alignment** (Status: Resolved / Fixed in Feature 1, commit `ef03ec0`)
  - Source: `src/schemas/career.schema.ts`, `src/types/career.ts`, `src/types/api.ts`
  - Cause: Discrepancy between exact 4-card tuple constraints and API response schemas.
  - Resolution: Aligned strict 4-element tuple schema and response contracts for student submissions and health check.
