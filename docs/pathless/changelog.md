# Changelog

## Feature 14: Simpler Suggestions and Clean PDF

Feature 14: Simpler Suggestions and Clean PDF. Refines results cards by removing percentage fit scores and startup jargon labels, replacing them with qualitative badges and simple 3-stage career path milestones (study, first job, later role). Restricts job titles and majors to a curated list of familiar professions, with expanded summaries explaining the job and its relation to the student's answers. Overhauls the browser print layout so all 4 cards print fully expanded with name, grade, date, advisor note, and sample notice, while omitting student ID. Later features affected: Feature 9, Feature 10, and Feature 11.

### Feature 9: Thai University Scaffold

- Added static Thai university program registry and deterministic matcher mapped to catalog majors.
- Integrated verified bilingual university cards with official source links into the results view and print stylesheet.
- Features affected: Feature 10 (Advisor review portal).

### Feature 10: Advisor Dashboard and Database Persistence

- Added Prisma schema and PostgreSQL models for student submissions, intake answers, synthesis cards, and advisor notes.
- Built passcode-gated advisor portal at `/advisor` with search, filtering, detailed student review, and private notes.
- Added automated/administrative annual July 1 data retention purge routine.
- Features affected: Feature 11 (UX copy and simplification).

### Feature 11: UX Copy and Simplification

- Centralized all user-facing strings across student intake, results cards, print views, and advisor dashboard into single-source copy dictionaries.
- Fully purged legacy naming (`dossier`, `PathwayAI`, `Triage`, `Counselor`) and developer jargon.
- Standardized form guidance and error messaging to a supportive 8th-to-12th grade reading level.
- Features affected: Feature 12 (Safety hardening and input guardrails).

### Feature 12: Safety and Guardrails

- Added in-memory sliding-window rate limiting to protect Gemini quotas and PostgreSQL connections.
- Implemented Zod schema validation and input sanitization across all API endpoints.
- Hardened synthesis prompt boundaries against prompt injection.
- Added client React Error Boundaries and sanitized plain-language API error responses.
- Features affected: Feature 13 (Deployment and E2E testing).
