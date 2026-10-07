---
doc: implementation-plan
feature: 10-advisor-dashboard-db
project: PathLess - Framework v2
status: proposed
gate: PENDING_USER_APPROVAL
---

# Feature 10: Step-by-Step Implementation Plan
## Advisor Dashboard and Database Persistence — Phased Architecture & Execution Blueprint

This implementation plan defines the phased, sequential execution blueprint for **Feature 10: Advisor Dashboard and Database Persistence** on branch `feature/10-advisor-dashboard-db`, implementing the technical contract ([docs/pathless/contracts/feature-10.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-10.md)).

---

## 1. Overview of Execution Strategy

Feature 10 transitions PathLess from transient in-memory discovery into a persistent, educator-empowered platform using zero-cost serverless PostgreSQL and lightweight passcode gatekeeping:

1. **Prisma PostgreSQL Persistence**: Models student submissions, intake answers, complete 4-card synthesis results (with 3-stage milestones and verified Thai university programs), and private advisor notes with cascading referential integrity.
2. **Asynchronous Non-Blocking Hook**: Extends `POST /api/guide` to record completed submissions without blocking or delaying student synthesis responses during network dips.
3. **Friction-Free Educator Gatekeeping**: Authenticates educators using a shared passcode (`<ADVISOR_PASSCODE>`) and signed, `httpOnly`, 7-day session cookies (`pathless_advisor_session`), completely eliminating user account registration hurdles.
4. **Accessible Advisor Dashboard**: Renders a searchable, filterable directory of student submissions at `/advisor`, detailed inspection drawers, and a private notes editor with zero technical database jargon.
5. **Annual Academic Data Purge**: Calculates the preceding July 1 academic turnover date and purges stale records from prior school years to safeguard student privacy.
6. **Strict Scope Discipline**:
   - Defer global plain-language UI copy rewrites across the student intake wizard to `feature/11-ux-copy-and-simplification`.
   - Defer advanced rate limiting and security guardrails to `feature/12-safety-and-guardrails`.

---

## 2. Phased Execution Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PHASED EXECUTION PIPELINE                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Dependencies, Prisma Schema, Migration & Database Client Singleton                      │
│          • Add @prisma/client & prisma to package.json                                           │
│          • Create prisma/schema.prisma (StudentSubmission, IntakeResponse, SynthesisResult, Note)│
│          • Generate Prisma client and implement src/lib/prisma.ts singleton with pool guards     │
│                                    ↓                                                             │
│ Phase 2: Asynchronous Synthesis Route Persistence Hook                                           │
│          • Update src/app/api/guide/route.ts with persistSubmissionSafely helper                  │
│          • Compute academicYear dynamically using UTC July 1 cut-off                             │
│          • Attach generated submissionId to returned GuideResult JSON payload                    │
│                                    ↓                                                             │
│ Phase 3: Advisor Auth Service, Session Middleware & Auth Routes                                  │
│          • Create src/lib/auth.ts: timingSafeEqual passcode verify & HMAC session tokens         │
│          • Implement POST /api/advisor/login (validates <ADVISOR_PASSCODE>, sets signed httpOnly cookie)│
│          • Implement POST /api/advisor/logout (clears session cookie)                            │
│                                    ↓                                                             │
│ Phase 4: Centralized Copy Dictionary & Advisor Data API Routes                                   │
│          • Create src/content/advisorCopy.ts with 100% educator-friendly, non-technical copy     │
│          • Implement GET /api/advisor/students (search by name/studentId, grade & date filters)  │
│          • Implement GET /api/advisor/students/[id] (full intake answers, 4 cards, notes)        │
│          • Implement POST /api/advisor/notes (create private note with author & content)         │
│                                    ↓                                                             │
│ Phase 5: Advisor Dashboard UI Components & Page Shell                                            │
│          • Create src/components/advisor/PasscodeLogin.tsx (accessible passcode form/modal)      │
│          • Create src/components/advisor/StudentTable.tsx (accessible directory table)           │
│          • Create src/components/advisor/AdvisorNotesEditor.tsx (notes history & composer)       │
│          • Create src/components/advisor/StudentDetailModal.tsx (detailed student drawer)        │
│          • Create src/components/advisor/AdvisorDashboard.tsx (workspace state coordinator)      │
│          • Create src/app/advisor/page.tsx (Next.js App Router entrypoint)                       │
│                                    ↓                                                             │
│ Phase 6: Annual Data Retention Purge Utility & Administrative Endpoint                           │
│          • Create src/lib/purge.ts: UTC preceding July 1 cutoff & cascading deletion logic       │
│          • Implement POST /api/admin/purge (protected via ADMIN_SECRET or advisor session)       │
│                                    ↓                                                             │
│ Phase 7: Verification, Automated Testing & Quality Gates                                         │
│          • Create tests/unit/auth.test.ts (passcode, HMAC token, tampering, expiration)          │
│          • Create tests/unit/purge.test.ts (July 1 cutoff across seasons, boundary, leap years)  │
│          • Create tests/integration/advisorRoutes.test.ts (auth, directory, notes, purge, guide) │
│          • Run full verification: npm test, npm run type-check, npm run lint, npm run build      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. File Change Inventory

```
┌───────────────────────────────────────────────┬────────────┬────────────────────────────────────────────────────────┐
│ File Path                                     │ Action     │ Primary Purpose                                        │
├───────────────────────────────────────────────┼────────────┼────────────────────────────────────────────────────────┤
│ package.json                                  │ Modify     │ Add @prisma/client and prisma dependencies             │
│ prisma/schema.prisma                          │ Create     │ Relational schema for PostgreSQL (4 models + indexes)  │
│ src/lib/prisma.ts                             │ Create     │ Serverless-safe Prisma client singleton                │
│ src/lib/auth.ts                               │ Create     │ Shared passcode validation & HMAC session token utils  │
│ src/lib/purge.ts                              │ Create     │ Annual July 1 cutoff calculation & purge query logic   │
│ src/content/advisorCopy.ts                    │ Create     │ Centralized copy dictionary for advisor portal & auth  │
│ src/app/api/guide/route.ts                    │ Modify     │ Hook non-blocking submission persistence into database │
│ src/app/api/advisor/login/route.ts            │ Create     │ Endpoint verifying passcode & setting session cookie   │
│ src/app/api/advisor/logout/route.ts           │ Create     │ Endpoint clearing session cookie                       │
│ src/app/api/advisor/students/route.ts         │ Create     │ Protected endpoint returning filtered student list     │
│ src/app/api/advisor/students/[id]/route.ts    │ Create     │ Protected endpoint returning full student submission   │
│ src/app/api/advisor/notes/route.ts            │ Create     │ Protected endpoint appending advisor notes             │
│ src/app/api/admin/purge/route.ts              │ Create     │ Protected endpoint executing annual data archive       │
│ src/components/advisor/PasscodeLogin.tsx      │ Create     │ Accessible passcode authentication form/modal          │
│ src/components/advisor/StudentTable.tsx       │ Create     │ Accessible student directory table with filters        │
│ src/components/advisor/StudentDetailModal.tsx │ Create     │ Detailed drawer for student answers, cards & notes     │
│ src/components/advisor/AdvisorNotesEditor.tsx │ Create     │ Private advisor notes composer & chronological history │
│ src/components/advisor/AdvisorDashboard.tsx   │ Create     │ Top-level state coordinator for the advisor workspace  │
│ src/app/advisor/page.tsx                      │ Create     │ App Router page shell for /advisor                     │
│ tests/unit/auth.test.ts                       │ Create     │ Unit tests for passcode & HMAC signing logic           │
│ tests/unit/purge.test.ts                      │ Create     │ Unit tests for July 1 cutoff date calculation          │
│ tests/integration/advisorRoutes.test.ts       │ Create     │ Integration tests for advisor APIs & persistence       │
└───────────────────────────────────────────────┴────────────┴────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Phase Specifications

### Phase 1: Dependencies, Prisma Schema & Database Client Singleton
**Goal**: Configure Prisma ORM with PostgreSQL support and instantiate a serverless-safe client singleton.  
**Acceptance Criteria Mapped**: `AC-DB-01`

#### 1.1 Package Dependencies ([package.json](file:///d:/Hackathon/Beta_Folder/package.json))
- Add `"@prisma/client": "^5.20.0"` under `dependencies`.
- Add `"prisma": "^5.20.0"` under `devDependencies`.
- Add `"postinstall": "prisma generate"` to scripts for automated deployment generation.

#### 1.2 Database Schema ([prisma/schema.prisma](file:///d:/Hackathon/Beta_Folder/prisma/schema.prisma))
- **`StudentSubmission`**:
  - `id`: `String @id @default(cuid())`
  - `fullName`: `String`
  - `gradeLevel`: `String`
  - `studentId`: `String?` (strictly optional, opaque alphanumeric code)
  - `academicYear`: `Int` (e.g. `2026`)
  - `createdAt`: `DateTime @default(now())`
  - `updatedAt`: `DateTime @updatedAt`
  - Relations: `intakeResponse IntakeResponse?`, `synthesisResult SynthesisResult?`, `advisorNotes AdvisorNote[]`
  - Indexes: `@@index([createdAt])`, `@@index([gradeLevel])`, `@@index([academicYear])`, `@@index([studentId])`
- **`IntakeResponse`**:
  - `id`: `String @id @default(cuid())`
  - `submissionId`: `String @unique`
  - `submission`: `StudentSubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)`
  - `answers`: `Json` (stores validated [`IntakeAnswers`](file:///d:/Hackathon/Beta_Folder/src/types/intake.ts#L90-L101))
  - `createdAt`: `DateTime @default(now())`
- **`SynthesisResult`**:
  - `id`: `String @id @default(cuid())`
  - `submissionId`: `String @unique`
  - `submission`: `StudentSubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)`
  - `cards`: `Json` (stores array of 4 [`PathwayCard`](file:///d:/Hackathon/Beta_Folder/src/types/career.ts#L35-L66) objects with milestones & Thai universities)
  - `summary`: `Json?` ([`GuideSummary`](file:///d:/Hackathon/Beta_Folder/src/types/career.ts#L70-L76))
  - `meta`: `Json?` ([`GuideMeta`](file:///d:/Hackathon/Beta_Folder/src/types/career.ts#L78-L84))
  - `createdAt`: `DateTime @default(now())`
- **`AdvisorNote`**:
  - `id`: `String @id @default(cuid())`
  - `submissionId`: `String`
  - `submission`: `StudentSubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)`
  - `authorName`: `String @default("Advisor")`
  - `content`: `String` (trimmed, 1 to 2,000 characters)
  - `createdAt`: `DateTime @default(now())`
  - `updatedAt`: `DateTime @updatedAt`
  - Indexes: `@@index([submissionId])`, `@@index([createdAt])`

#### 1.3 Prisma Client Singleton ([src/lib/prisma.ts](file:///d:/Hackathon/Beta_Folder/src/lib/prisma.ts))
- Instantiate `PrismaClient` with `globalThis` caching to prevent connection exhaustion in Next.js development.
- Mask database connection warnings so connection errors never leak raw PostgreSQL URIs or SQL error traces.

---

### Phase 2: Asynchronous Synthesis Route Persistence Hook
**Goal**: Record student intake answers and generated pathway recommendations in PostgreSQL asynchronously upon guide completion.  
**Acceptance Criteria Mapped**: `AC-DB-02`

#### 2.1 Route Modification ([src/app/api/guide/route.ts](file:///d:/Hackathon/Beta_Folder/src/app/api/guide/route.ts))
- Implement helper `persistSubmissionSafely(payload: SubmissionPayload, result: GuideResult): Promise<string | null>`.
- Calculate `academicYear` using UTC dates:
  ```typescript
  const now = new Date();
  const year = now.getUTCFullYear();
  const julyCutoff = new Date(Date.UTC(year, 6, 1));
  const academicYear = now >= julyCutoff ? year : year - 1;
  ```
- Wrap database write in a guarded `try/catch`:
  - If `DATABASE_URL` is omitted (e.g., local mock or offline testing), log an advisory and skip persistence.
  - If database write fails, log server-side warning without PII and return synthesis cards with HTTP 200.
  - If persistence succeeds, attach `submission.id` to `result.submissionId`.

---

### Phase 3: Advisor Auth Service, Session Middleware & Auth Routes
**Goal**: Implement friction-free shared passcode authentication (`<ADVISOR_PASSCODE>`) via signed `httpOnly` cookies.  
**Acceptance Criteria Mapped**: `AC-DB-03`

#### 3.1 Authentication Utilities ([src/lib/auth.ts](file:///d:/Hackathon/Beta_Folder/src/lib/auth.ts))
- **Passcode Verification**:
  - Compare submitted passcode to `process.env.ADVISOR_PASSCODE ?? '<ADVISOR_PASSCODE>'`.
  - Use `crypto.timingSafeEqual` with SHA-256 digests.
- **Session Token Mechanics**:
  - Structure: `<base64UrlPayload>.<base64UrlSignature>`
  - Payload: `{ role: 'advisor', authorName: string, iat: number, exp: number }` (7-day validity).
  - Secret Key: `process.env.SESSION_SECRET ?? process.env.ADVISOR_PASSCODE ?? getEphemeralSecret()`.
  - Signature: `crypto.createHmac('sha256', secret).update(base64Payload).digest('base64url')`.
- **Cookie Mechanics**:
  - Name: `pathless_advisor_session`.
  - Options: `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/'`, `maxAge: 604800`.
- **Request Inspection**:
  - `getAdvisorSessionFromRequest(request: Request): AdvisorSessionPayload | null`.

#### 3.2 Authentication Route Handlers
- **`POST /api/advisor/login`** ([src/app/api/advisor/login/route.ts](file:///d:/Hackathon/Beta_Folder/src/app/api/advisor/login/route.ts)):
  - Input: `{ passcode: string, authorName?: string }`.
  - On failure: return 401 with educator-friendly problem details: *"The passcode entered does not match our school records."*
  - On success: set `pathless_advisor_session` cookie; return 200 `{ success: true, authorName: string }`.
- **`POST /api/advisor/logout`** ([src/app/api/advisor/logout/route.ts](file:///d:/Hackathon/Beta_Folder/src/app/api/advisor/logout/route.ts)):
  - Expire `pathless_advisor_session` cookie (`maxAge: 0`); return 200 `{ success: true }`.

---

### Phase 4: Centralized Copy Dictionary & Advisor Data API Routes
**Goal**: Create educator-focused copy dictionary and secure data retrieval endpoints.  
**Acceptance Criteria Mapped**: `AC-DB-04`, `AC-DB-06`

#### 4.1 Copy Dictionary ([src/content/advisorCopy.ts](file:///d:/Hackathon/Beta_Folder/src/content/advisorCopy.ts))
- Export `ADVISOR_COPY` with zero database or technical terminology:
  - `portal`: titles, subtitles, logout labels.
  - `login`: passcode labels, placeholders, errors, privacy notices.
  - `directory`: search placeholders, grade filter labels, date range options, table column titles, empty states.
  - `drawer`: student context headers, hesitation summaries, university match badges, close labels.
  - `notes`: composer labels, character counter formatters, save button states.
  - `purgeNotice`: calm academic turnover descriptions.

#### 4.2 Advisor Directory Route ([src/app/api/advisor/students/route.ts](file:///d:/Hackathon/Beta_Folder/src/app/api/advisor/students/route.ts))
- **Security**: Requires valid `pathless_advisor_session` cookie.
- **Parameters**: `search` (name or student ID), `grade` (e.g. `grade_12`), `dateRange` (`7d`, `30d`, `current_year`, `all`).
- **Response**: Array of `StudentDirectoryItem`:
  ```typescript
  export interface StudentDirectoryItem {
    id: string;
    fullName: string;
    gradeLevel: string;
    studentId: string | null;
    academicYear: number;
    createdAt: string;
    topMatchRole: string;
    topMatchField: string;
    notesCount: number;
  }
  ```

#### 4.3 Student Detail Route ([src/app/api/advisor/students/[id]/route.ts](file:///d:/Hackathon/Beta_Folder/src/app/api/advisor/students/[id]/route.ts))
- **Security**: Requires valid advisor session cookie.
- **Response**: Full `SubmissionDetailResponse` matching `src/types/career.ts`.

#### 4.4 Advisor Notes Route ([src/app/api/advisor/notes/route.ts](file:///d:/Hackathon/Beta_Folder/src/app/api/advisor/notes/route.ts))
- **Security**: Requires valid advisor session cookie.
- **Input**: `{ submissionId: string, content: string, authorName?: string }`.
- **Validation**: `content` trimmed length between 1 and 2,000 characters.
- **Response**: HTTP 201 with created note.

---

### Phase 5: Advisor Dashboard UI Components & Page Shell
**Goal**: Build a responsive, accessible educator workspace conforming to WCAG 2.1 AA.  
**Acceptance Criteria Mapped**: `AC-DB-03`, `AC-DB-04`, `AC-DB-06`

#### 5.1 Component Hierarchy
```
src/app/advisor/page.tsx (Page Shell & Auth Gate)
 └── src/components/advisor/AdvisorDashboard.tsx (Workspace Coordinator)
      ├── src/components/advisor/PasscodeLogin.tsx (Auth Modal / Form)
      ├── Header: Title, Student Search, Grade Filter, Date Range, Logout Button
      ├── src/components/advisor/StudentTable.tsx (Accessible Directory Table)
      └── src/components/advisor/StudentDetailModal.tsx (Detailed Inspection Drawer)
           ├── Student Profile & Academic Hesitation Summary
           ├── 4 Pathway Cards (Milestones & Thai University Matches)
           └── src/components/advisor/AdvisorNotesEditor.tsx (Private Notes History & Composer)
```

#### 5.2 Accessibility & Responsive Invariants
- **`PasscodeLogin`**: `<label htmlFor="advisor-passcode">`, visible focus rings (`focus:ring-2`), error banner with `role="alert"`, min 44px button height.
- **`StudentTable`**: Standard `<table>` with `<caption>`, `<th scope="col">`, `tabIndex={0}` rows activating on `Enter`/`Space`.
- **`StudentDetailModal`**: `role="dialog"`, `aria-modal="true"`, focus trap, closes on `Escape`, close button with min $44 \times 44$px touch target.
- **`AdvisorNotesEditor`**: `<label htmlFor="advisor-note-input">`, character counter with `aria-live="polite"`, min 44px save button.

---

### Phase 6: Annual Data Retention Purge Utility & Endpoint
**Goal**: Provide deterministic academic year turnover and data minimization.  
**Acceptance Criteria Mapped**: `AC-DB-05`

#### 6.1 Purge Utility Functions ([src/lib/purge.ts](file:///d:/Hackathon/Beta_Folder/src/lib/purge.ts))
- **`getPrecedingJuly1Cutoff(referenceDate: Date = new Date()): Date`**:
  ```typescript
  export function getPrecedingJuly1Cutoff(referenceDate: Date = new Date()): Date {
    const year = referenceDate.getUTCFullYear();
    const julyCutoff = new Date(Date.UTC(year, 6, 1, 0, 0, 0, 0));
    return referenceDate.getTime() >= julyCutoff.getTime()
      ? julyCutoff
      : new Date(Date.UTC(year - 1, 6, 1, 0, 0, 0, 0));
  }
  ```
- **`executeAnnualPurge(options?: { cutoffDate?: Date; dryRun?: boolean })`**:
  - Deletes `StudentSubmission` records created prior to cutoff.
  - Cascading deletes automatically clear `IntakeResponse`, `SynthesisResult`, and `AdvisorNote`.

#### 6.2 Administrative Endpoint ([src/app/api/admin/purge/route.ts](file:///d:/Hackathon/Beta_Folder/src/app/api/admin/purge/route.ts))
- **Security**: Verifies `x-admin-key: <ADMIN_SECRET>` header or valid advisor session cookie with `{ confirmPurge: true }`.
- **Modes**: Supports dry-run inspection via `?dryRun=true` or execution via `confirmPurge: true`.
- **Response**: `{ success: true, dryRun: boolean, purgedCount: number, cutoffDate: string }`.

---

### Phase 7: Verification, Automated Testing & Quality Gates
**Goal**: Validate unit logic, API route integrations, and production builds.  
**Acceptance Criteria Mapped**: `AC-DB-01` through `AC-DB-06`

#### 7.1 Test Suites to Create
1. **`tests/unit/auth.test.ts`**:
   - `UT-AUTH-01`: Validates `<ADVISOR_PASSCODE>` default and `ADVISOR_PASSCODE` override.
   - `UT-AUTH-02`: Rejects invalid, empty, or whitespace passcodes.
   - `UT-AUTH-03`: Verifies timing-safe evaluation using SHA-256 digests.
   - `UT-AUTH-04`: Validates HMAC-SHA256 signature and 7-day expiration.
   - `UT-AUTH-05`: Rejects tampered tokens and expired sessions.
   - `UT-AUTH-06`: Verifies `HttpOnly`, `SameSite=Lax`, and `Max-Age` cookie headers.
2. **`tests/unit/purge.test.ts`**:
   - `UT-PURGE-01`: Calculates July 1 of current year in autumn (e.g. Oct 6, 2026 $\rightarrow$ July 1, 2026).
   - `UT-PURGE-02`: Calculates July 1 of previous year in spring (e.g. Mar 15, 2026 $\rightarrow$ July 1, 2025).
   - `UT-PURGE-03`: Handles exact July 1 midnight boundary condition.
   - `UT-PURGE-04`: Handles leap year dates correctly (e.g. Feb 29, 2028).
   - `UT-PURGE-05`: Correctly partitions records into retained vs. purged buckets.
3. **`tests/integration/advisorRoutes.test.ts`**:
   - `IT-ADV-01`: `POST /api/advisor/login` with `<ADVISOR_PASSCODE>` returns 200 and sets cookie.
   - `IT-ADV-02`: `POST /api/advisor/login` with invalid passcode returns 401.
   - `IT-ADV-03`: `POST /api/advisor/logout` expires cookie.
   - `IT-ADV-04`: `GET /api/advisor/students` rejects unauthenticated calls with 401.
   - `IT-ADV-05`: `GET /api/advisor/students` with session returns directory items.
   - `IT-ADV-06`: `GET /api/advisor/students?search=Alex` filters results.
   - `IT-ADV-07`: `POST /api/advisor/notes` appends note to student.
   - `IT-ADV-08`: `POST /api/guide` completes intake and persists record to database.
   - `IT-ADV-09`: `POST /api/admin/purge` verifies auth and returns purged count.

---

## 5. Acceptance Criteria Traceability Matrix

```
┌──────────┬────────────────────────────────────────────────────────┬───────────────┬──────────────────────────────┐
│ Criteria │ Contract Description                                   │ Target Phases │ Verification Mechanism       │
├──────────┼────────────────────────────────────────────────────────┼───────────────┼──────────────────────────────┤
│ AC-DB-01 │ Prisma schema models submissions, responses, results,  │ Phase 1       │ prisma validate & type check │
│          │ and notes with PostgreSQL support and clean types.     │               │                              │
├──────────┼────────────────────────────────────────────────────────┼───────────────┼──────────────────────────────┤
│ AC-DB-02 │ Completing intake automatically persists student       │ Phase 2       │ tests/integration/advisor    │
│          │ record and full synthesis cards to the database.       │               │ Routes.test.ts (IT-ADV-08)   │
├──────────┼────────────────────────────────────────────────────────┼───────────────┼──────────────────────────────┤
│ AC-DB-03 │ Accessing /advisor requires <ADVISOR_PASSCODE> authentication │ Phase 3, 5    │ tests/unit/auth.test.ts,     │
│          │ granting access via signed httpOnly cookie.            │               │ IT-ADV-01, IT-ADV-04         │
├──────────┼────────────────────────────────────────────────────────┼───────────────┼──────────────────────────────┤
│ AC-DB-04 │ Advisor dashboard renders responsive student directory │ Phase 4, 5    │ IT-ADV-05, IT-ADV-06,        │
│          │ with search, date filter, cards, and session notes.    │               │ IT-ADV-07, UI component tests│
├──────────┼────────────────────────────────────────────────────────┼───────────────┼──────────────────────────────┤
│ AC-DB-05 │ Annual data purge utility correctly identifies and     │ Phase 6       │ tests/unit/purge.test.ts,    │
│          │ deletes records prior to preceding July 1 cut-off.     │               │ IT-ADV-09                    │
├──────────┼────────────────────────────────────────────────────────┼───────────────┼──────────────────────────────┤
│ AC-DB-06 │ 100% of user-facing dashboard text uses clear educator │ Phase 4, 5    │ Automated copy audit of      │
│          │ language with zero raw database terms or traces.       │               │ advisorCopy.ts               │
└──────────┴────────────────────────────────────────────────────────┴───────────────┴──────────────────────────────┘
```

---

## 6. Verification Commands ([package.json](file:///d:/Hackathon/Beta_Folder/package.json))

The following exact commands must be executed and pass cleanly with zero errors before Feature 10 is marked ready:

```bash
# 1. Run unit and integration test suites
npm test

# 2. Run TypeScript compilation and contract type checking
npm run type-check

# 3. Run ESLint across Next.js App Router and components
npm run lint

# 4. Validate complete Next.js production build and page bundling
npm run build
```

---

## 7. Execution Safeguards & Boundary Rules

1. **Feature 11 Boundary Guard**: Do not perform global Flesch-Kincaid readability scoring or rewrites on the student intake wizard. Keep all new copy strictly localized to [src/content/advisorCopy.ts](file:///d:/Hackathon/Beta_Folder/src/content/advisorCopy.ts).
2. **Feature 12 Boundary Guard**: Do not introduce distributed Redis token buckets, IP reputation blacklists, or complex anti-scraping engines. Standard passcode validation and basic rate limiting are sufficient.
3. **Privacy Invariant**: Ensure Student ID remains strictly optional and opaque (`STU-XXXXX`). Never log private student intake answers or advisor notes to stdout/console.
4. **Resilience Invariant**: Database persistence in `POST /api/guide` must remain asynchronous and non-blocking. Database outages must never fail the student's career discovery experience.
