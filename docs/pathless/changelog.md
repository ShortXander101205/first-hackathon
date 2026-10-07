# Changelog

### Feature 1: Contracts and Specifications (Completed: October 2, 2026)

- Established canonical TypeScript domain models, Zod validation schemas, SQLite DDL schema, and Gemini AI contracts.
- Defined 4-tuple career output schema and baseline mock fixtures.
- Features affected: Feature 2 (Project scaffolding).

### Feature 2: Project Scaffolding and Educational Theme (Completed: October 2, 2026)

- Scaffolding of Next.js 14 App Router with strict TypeScript configuration and native externalization for `better-sqlite3`.
- Established Educational Blue and Slate design tokens, custom Tailwind configuration, and Lucide icon registry.
- Implemented shared responsive layout shell (Header, Footer, Container).
- Features affected: Feature 3 (Intake wizard UI).

### Feature 3: Intake Wizard UI (Completed: October 2, 2026)

- Implemented 4-question Intake Wizard UI presentation components and centralized copy.
- Built accessible chip selection, subject choice, reflection textarea, and binary options.
- Features affected: Feature 4 (Intake state machine).

### Feature 4: Intake State Machine (Completed: October 2, 2026)

- Implemented IntakeContext reducer managing wizard step transitions, validation guards, and nickname state.
- Implemented SSR-safe transient storage sync using tab-scoped sessionStorage with MemoryStorage fallback (no student PII collected).
- Added accessible reset confirmation modal with focus trapping.
- Features affected: Feature 5 (AI synthesis service).

### Feature 5: AI Synthesis Service (Completed: October 4, 2026)

- Built AI synthesis service integrating Gemini 1.5 Flash client with server-side structured JSON schema validation.
- Implemented resilient fallback fixtures and error handling for zero-cost quota safety.
- Features affected: Feature 6 (Dossier card UI).

### Feature 6: Recommendation Cards UI (Completed: October 4, 2026)

- Implemented recommendation dossier UI, 4-career card layout, reality check section, and synthesis loading/error states.
- Features affected: Feature 7 (Rework intake and contracts).

### Feature 7: Rework Intake and Contracts (Completed: October 4, 2026)

- Implemented Step 0 student profile entry (Name, Grade Level, optional Student ID) and expanded 10-question sequence.
- Migrated types and schemas to PathLess v2 contracts and centralized guide copy dictionary.
- Added comprehensive unit and integration test coverage for intake reducer and state machine.
- Features affected: Feature 1 (schemas and types), Feature 3 (intake wizard components), Feature 4 (intake state machine and context), and downstream Feature 8 (synthesis and results). Commit `d78896f` did not touch the API route or the result cards.

### Feature 8: Rework Synthesis and Results (Completed: October 4, 2026)

- Reworked backend AI synthesis route (`POST /api/guide`), migrating from legacy `/api/triage`.
- Replaced legacy PathwayAI prototype with PathLess Guide v2 4-card progressive disclosure layout.
- Added grounded prompt generation with RFC 7807 problem details error handling and resilient mock fallback (`src/lib/ai/mockFallback.ts`).
- Added initial print-friendly stylesheet rules and results presentation shell.
- Features affected: Feature 9 (Thai university scaffold), Feature 10 (Advisor review portal), and Feature 14 (Simpler suggestions follow-up).

### Feature 9: Thai University Scaffold (Completed: October 4, 2026)

- Added static Thai university program registry and deterministic matcher mapped to catalog majors.
- Integrated verified bilingual university cards with official source links into the results view and print stylesheet.
- Features affected: Feature 10 (Advisor review portal).

### Feature 10: Advisor Dashboard and Database Persistence (Completed: October 6, 2026)

- Added Prisma schema and PostgreSQL models for student submissions, intake answers, synthesis cards, and advisor notes.
- Built passcode-gated advisor portal at `/advisor` with search, filtering, detailed student review, and private notes.
- Added automated/administrative annual July 1 data retention purge routine.
- Features affected: Feature 11 (UX copy and simplification).

### Feature 11: UX Copy and Simplification (Completed: October 6, 2026)

- Centralized all user-facing strings across student intake, results cards, print views, and advisor dashboard into single-source copy dictionaries.
- Fully purged legacy naming (`dossier`, `PathwayAI`, `Triage`, `Counselor`) and developer jargon.
- Standardized form guidance and error messaging to a supportive 8th-to-12th grade reading level.
- Features affected: Feature 12 (Safety hardening and input guardrails).

### Feature 12: Safety and Guardrails (Completed: October 7, 2026)

- Added in-memory sliding-window rate limiting to protect Gemini quotas and PostgreSQL connections.
- Implemented Zod schema validation and input sanitization across all API endpoints.
- Hardened synthesis prompt boundaries against prompt injection.
- Added client React Error Boundaries and sanitized plain-language API error responses.
- Features affected: Feature 13 (Deployment and E2E testing).

### Feature 13: Deployment and E2E Testing (In progress / Active: October 7, 2026)

- Containerized application via multi-stage production `Dockerfile` with standalone Next.js server output.
- Configured GitHub Actions CI pipeline (`.github/workflows/ci.yml`) for linting, type-checking, unit tests, and Playwright suites.
- Added comprehensive Playwright end-to-end test suites covering student intake journey, advisor directory, and security guardrails.
- Added deployment runbook documentation (`docs/pathless/runbooks/deployment.md`).
- Implemented cross-request in-memory mock synchronization in `src/data/mockAdvisorSubmissions.ts` to support zero-cost / CI runs without live PostgreSQL.

### Feature 14: Simpler Suggestions and Clean PDF (Follow-up: October 4, 2026)

_Note: Follow-up to Feature 8; not part of the original running order._

- Refined results cards by removing percentage fit scores and startup jargon labels, replacing them with qualitative badges ("Top Match" for the 2 primary matches and "Explore Also" for the 2 adjacent matches) across exactly 4 cards (2 primary, 2 adjacent) with simple 3-stage career path milestones (what to study in college, common first job after graduation, later career role).
- Restricted job titles and standard university majors strictly to a curated catalog across 8 familiar fields, with expanded summaries explaining the job and its relation to the student's answers.
- Overhauled the browser print layout so all 4 cards print fully expanded with student name, grade level, date, persistent advisor note, and sample notice, while strictly omitting student ID for privacy.
- Later features affected: Feature 9, Feature 10, and Feature 11.

### Feature 15: Fixes, Questions Refinement, and Admissions Guidance (Completed: October 7, 2026)

- Resolved immediate advisor dashboard update lag via Next.js cache revalidation.
- Hardened results error boundary fallback UI card with actionable recovery buttons.
- Expanded intake questions from 10 to 12 items tailored for upper-secondary students (Grades 10–12).
- Added "Explore More Paths" catalog suggestions below the 4 primary recommendation cards.
- Added static high school track admission guidelines and official verification checklists for flagship Thai universities.
- Features affected: Feature 7, Feature 8, Feature 9, Feature 10, Feature 14.

### Hackathon Submission & Feature Freeze (October 7, 2026)

- Formalized feature freeze for the Devpost Build With AI: Basics Hackathon.
- Remediated audit findings: aligned Playwright E2E student flow to 12 questions, hardened advisor session secrets, corrected default Gemini model string.
- Added root MIT LICENSE and finalized English documentation.

## Bug Fixes

- **Advisor view not showing new submissions** (Status: Resolved / Fixed in Feature 13, commit `0b64cdd`)
  - When `DATABASE_URL` was unset or database tables were unmigrated, student submissions were discarded silently by the guide endpoint, preventing the advisor portal from displaying new student records. Resolved by adding in-memory cross-request sync via `globalThis.inMemoryAdvisorSubmissions` in `src/data/mockAdvisorSubmissions.ts`, wired into `persistSubmissionSafely` in `src/app/api/guide/route.ts` and `src/app/api/advisor/students/route.ts`.
- **Results error card and calm recovery** (Status: Resolved / Fixed in Feature 12, commit `8489fe0` and Feature 13)
  - When AI synthesis or network requests failed, students lacked a calm recovery interface or faced unhandled runtime errors. Resolved by adding an accessible inline error card in `src/components/intake/IntakeWizardContainer.tsx` displaying `RESULTS_COPY.error` ("We hit a temporary bump") with "Try Again" and "Review My Answers" buttons, wrapped within React `ErrorBoundary` protection.
- **Theme decoration and background classes** (Status: Resolved / Fixed in Feature 2, commit `3e09950`)
  - Utility classes for link text decoration and footer backgrounds were misaligned with design tokens. Resolved by switching to direct theme token utility classes (`border-edu-slate-200`, `bg-edu-slate-100`).
- **4-Tuple schema and response contracts alignment** (Status: Resolved / Fixed in Feature 1, commit `ef03ec0`)
  - Discrepancy between exact 4-card tuple constraints and API response types. Resolved by aligning strict 4-element tuple schema and response contracts for student submissions and health check.

## Future Changes

- Reserved for upcoming features, planned enhancements, and subsequent version iterations.
