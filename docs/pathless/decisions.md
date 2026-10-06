# Decisions

## Feature 14: Simpler Suggestions and Clean PDF (date: October 4, 2026)

Job titles and majors: Titles and majors are selected strictly from a curated list of common, recognizable job titles and standard university majors. The AI is strictly prohibited from inventing job titles or majors.

Card contents: Percentage fit scores (such as % Natural Fit) are removed. Jargon labels (such as Moonshot Trajectory and Interdisciplinary Pivot) are removed. They are replaced by simple qualitative badges. Each card displays the job title, the major to study, and an expanded summary explaining the job and its relation to the student's answers. The persistent "suggestions, not decisions" advisory note and reminder to speak with an Advisor remain on screen. Zero technical terms appear on screen.

Number and spread of results: Exactly 4 career match cards. 2 cards directly match the primary interest area, and 2 cards branch into adjacent fields.

Career path steps: Each card includes a simple 3-stage progression line: (1) what to study in college, (2) common first job after graduation, and (3) a later career role. Nothing too complex. Titles used in the career path steps must be familiar in Thailand, simple and clear.

The PDF: Generated via a clean print-dedicated browser stylesheet (@media print), not a separate file generator. All 4 cards automatically expand their full details in the print layout. Includes Student Name, Grade Level, Date, the persistent Advisor note, and the sample data notice if mock data is used. Student ID is omitted from the print layout for privacy. Zero technical terms appear in the PDF.

### Open Questions

Open questions: The exact list of titles and majors in the curated catalog has not been provided. The wording for the qualitative badges that replace percentage scores has not been chosen.

## Feature 9: Thai University Scaffold (Completed: October 4, 2026)

- Data architecture: Implemented static human-curated registry (`src/data/thaiUniversities.ts`) with deterministic lookup utility (`src/lib/universityMatcher.ts`); zero AI runtime generation or external web scraping.
- Coverage: Seeded 17 confirmed institutions across Bangkok, Central, and regional flagships, mapped strictly to the 8 career catalog fields.
- UI Integration: Updated `WhereToStudySection` inside expanded career cards with bilingual labels, verified source links (`rel="noopener noreferrer"`), and last-checked timestamps.
- Fallback: Non-breaking calm curation placeholder rendered when a recommended major has no active regional entries.

## Feature 10: Advisor Dashboard and Database Persistence (Completed: October 6, 2026)

- Database Layer: Configured Prisma with serverless PostgreSQL; asynchronously persists StudentSubmission, IntakeResponse, SynthesisResult (4 match cards JSON), and AdvisorNote.
- Gatekeeping: Advisor authentication implemented using shared passcode (`TEACHER2026` via `ADVISOR_PASSCODE` env) and signed httpOnly session cookies; zero individual user credentials or account tables.
- Advisor Tools: Implemented `/advisor` directory with student search by name/grade, chronological sorting, full card/study inspection, and private timestamped session notes.
- Data Privacy & Retention: Enforced required Name and Grade, optional opaque Student ID; created annual purge utility (`POST /api/admin/purge`) purging records prior to July 1 cut-off.
- Language: Completely avoided raw SQL, database column names, and system terms in advisor UI.

## Feature 11: UX Copy and Simplification (Completed: October 6, 2026)

- Centralized Strings: Extracted 100% of student- and advisor-facing copy into centralized dictionaries (`src/content/guideCopy.ts`, `src/content/advisorCopy.ts`, `src/content/intakeQuestions.ts`).
- Terminology Purge: Eradicated prohibited legacy and technical terms (`dossier`, `PathwayAI`, `Triage`, `Counselor`, `algorithm`, `AI engine`, `synthesis`, `database`) across all components, contracts, and rendered views.
- Reading Level & Tone: Standardized intake questions, helper hints, error notices, and results milestones to a calm, supportive 8th-to-12th grade reading comprehension level.
- Educator Interface: Refactored `/advisor` dashboard labels, empty states, and action buttons to intuitive educational terminology.
- Accessibility & Styling: Verified WCAG 2.1 AA text contrast and smooth responsive text reflow across mobile, desktop, print views, and 200% zoom.
