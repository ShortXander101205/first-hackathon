---
doc: implementation-plan
feature: 13-deployment-and-e2e
project: PathLess - Framework v2
status: proposed
gate: PENDING_USER_APPROVAL
---

# Feature 13: Phased Implementation Plan
## Deployment and E2E — Standalone Dockerization, GitHub Actions CI Pipeline, Playwright E2E Test Suite, and Zero-Cost Deployment Runbook

This implementation plan establishes the sequential execution blueprint for **Feature 13: Deployment and E2E** of the **PathLess Framework v2** on branch `feature/13-deployment-and-e2e`, operationalizing the approved technical contract ([docs/pathless/contracts/feature-13.md](file:///d:/Hackathon/Beta_Folder/docs/pathless/contracts/feature-13.md)) and incorporating all findings from the DevOps and Quality Assurance architectural review.

---

## 1. Overview of Execution Strategy

Feature 13 delivers production readiness, zero-cost continuous integration, and browser-level end-to-end regression test suites for PathLess Framework v2 without requiring paid cloud infrastructure or proprietary API secrets:

1. **Next.js Standalone Configuration & Container Health Endpoint (`next.config.mjs`, `src/app/api/health/route.ts`)**:
   Activate `output: 'standalone'` in Next.js to enable automated dependency tracing, drastically reducing the production runtime bundle size. Create an unauthenticated, zero-jargon health check endpoint (`GET /api/health`) reporting system uptime and database connectivity for container orchestration and uptime monitors.
2. **Multi-Stage Production Dockerfile (`Dockerfile`, `.dockerignore`)**:
   Implement an optimized 4-stage Alpine Linux Docker build (`base`, `deps`, `builder`, `runner`). Ensure native package compilation tools and Prisma query engines are preserved, isolate runtime execution under an unprivileged non-root system user (`nextjs:nodejs`, UID 1001), and enforce container health checks.
3. **Playwright Test Infrastructure & Package Configuration (`package.json`, `playwright.config.ts`)**:
   Install `@playwright/test` and `@axe-core/playwright`. Configure Playwright test runners to orchestrate local Next.js instances with mock fallback environment variables, headless Chromium execution, failure trace/screenshot capture, and fast execution.
4. **Automated Playwright E2E Regression Suites (`tests/e2e/*`)**:
   - **Student Flow (`tests/e2e/student-flow.spec.ts`)**: Automates Step 0 intake through Step 10 questionnaire, synthesis transition, 4-card progressive disclosure, milestone progression inspection, regional Thai university link checks, `@media print` layout emulation, and automated WCAG 2.1 AA accessibility audits via Axe.
   - **Advisor Flow (`tests/e2e/advisor-flow.spec.ts`)**: Automates passcode gating (`TEACHER2026`), invalid code rejection, directory searching, student detail modal inspection, private note authoring and saving, session sign out, and drawer accessibility audits.
   - **Guardrails Flow (`tests/e2e/guardrails.spec.ts`)**: Automates sliding-window rate limit triggers (HTTP 429 calm response and `Retry-After`), HTML/script tag stripping during intake, React error boundary fallback recovery, and isolated IP execution to prevent cross-test contamination.
5. **Zero-Cost GitHub Actions CI Pipeline (`.github/workflows/ci.yml`)**:
   Construct an automated continuous integration pipeline running static analysis (ESLint, TypeScript `tsc --noEmit`), unit/integration tests (`npm test`), production Next.js build verification, Playwright browser test execution, and Docker container verification with Buildx layer caching.
6. **Zero-Cost Production Deployment Runbook (`docs/pathless/runbooks/deployment.md`)**:
   Author an operational guide detailing zero-cost deployment recipes across Vercel (Hobby), Neon/Supabase Serverless PostgreSQL, Google Gemini API free tier, and self-hosted Docker on a free-tier VPS (Oracle Always-Free / Fly.io) with Caddy reverse proxy.

---

## 2. Phased Execution Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PHASED EXECUTION PIPELINE                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Next.js Standalone Configuration & Container Health Endpoint                            │
│          • Update next.config.mjs (add output: 'standalone')                                     │
│          • Create src/app/api/health/route.ts (uptime & database health check)                   │
│                                    ↓                                                             │
│ Phase 2: Multi-Stage Production Dockerfile & Build Ignore Rules                                  │
│          • Create .dockerignore (exclude local modules, tests, secrets, and scratch files)        │
│          • Create Dockerfile (4-stage Alpine build, non-root nextjs user UID 1001, healthcheck)  │
│                                    ↓                                                             │
│ Phase 3: Playwright Test Tooling & Package Dependencies                                          │
│          • Update package.json (add @playwright/test, @axe-core/playwright, e2e test scripts)    │
│          • Create playwright.config.ts (webServer, port 3000, chromium profile, CI retries)      │
│                                    ↓                                                             │
│ Phase 4: Playwright End-to-End Regression Test Suites & Axe WCAG Audits                          │
│          • Create tests/e2e/student-flow.spec.ts (Step 0-10, 4 cards, milestones, unis, print)   │
│          • Create tests/e2e/advisor-flow.spec.ts (TEACHER2026 auth, directory, drawer, notes)   │
│          • Create tests/e2e/guardrails.spec.ts (rate limiting 429, XSS strip, error fallback)    │
│                                    ↓                                                             │
│ Phase 5: GitHub Actions CI Workflow Setup                                                        │
│          • Create .github/workflows/ci.yml (quality gate, playwright e2e, docker build verify)   │
│                                    ↓                                                             │
│ Phase 6: Zero-Cost Production Deployment Runbook                                                 │
│          • Create docs/pathless/runbooks/deployment.md (Vercel, Neon, Gemini, VPS recipes)       │
│                                    ↓                                                             │
│ Phase 7: Full Verification Pipeline & Quality Gates                                              │
│          • Execute type-check, lint, unit tests, Playwright E2E suites, and Next.js build        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. File Change Inventory

```
┌───────────────────────────────────────────────┬────────────┬────────────────────────────────────────────────────────┐
│ File Path                                     │ Action     │ Primary Purpose                                        │
├───────────────────────────────────────────────┼────────────┼────────────────────────────────────────────────────────┤
│ next.config.mjs                               │ Modify     │ Add output: 'standalone' for optimized Docker images   │
│ src/app/api/health/route.ts                   │ Create     │ Container health check & uptime probe endpoint         │
│ .dockerignore                                 │ Create     │ Exclude local modules, secrets, tests from Docker      │
│ Dockerfile                                    │ Create     │ 4-stage Alpine container with non-root nextjs user     │
│ package.json                                  │ Modify     │ Add @playwright/test, @axe-core/playwright & scripts   │
│ playwright.config.ts                          │ Create     │ Playwright test runner, webServer & browser settings   │
│ tests/e2e/student-flow.spec.ts                │ Create     │ E2E student intake, 4 cards, milestones, print & axe   │
│ tests/e2e/advisor-flow.spec.ts                │ Create     │ E2E advisor login, directory, drawer, notes & axe      │
│ tests/e2e/guardrails.spec.ts                  │ Create     │ E2E rate limiting 429, HTML sanitization, fallback     │
│ .github/workflows/ci.yml                      │ Create     │ GitHub Actions CI workflow (lint, test, e2e, docker)   │
│ docs/pathless/runbooks/deployment.md          │ Create     │ Zero-cost production deployment operational runbook    │
└───────────────────────────────────────────────┴────────────┴────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Phase Specifications

### Phase 1: Next.js Standalone Configuration & Container Health Endpoint
**Goal**: Configure Next.js standalone tracing and provide an unauthenticated health probe endpoint for Docker and cloud monitoring.  
**Acceptance Criteria Mapped**: `AC-DEP-01`

#### 1.1 Modify `next.config.mjs`
- **File**: `next.config.mjs`
- **Exact Change**: Add `output: 'standalone'` to the existing `nextConfig` object while preserving `reactStrictMode`, `poweredByHeader: false`, and `experimental.serverComponentsExternalPackages: ['better-sqlite3']`.
- **Implementation**:
  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    poweredByHeader: false,
    experimental: {
      serverComponentsExternalPackages: ['better-sqlite3'],
    },
  };

  export default nextConfig;
  ```

#### 1.2 Create `src/app/api/health/route.ts`
- **File**: `src/app/api/health/route.ts`
- **Purpose**: Respond with HTTP 200 OK for Docker `HEALTHCHECK`, reverse proxies, and uptime monitors without disclosing internal schema or server details.
- **Implementation**:
  ```typescript
  import { NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';

  export const dynamic = 'force-dynamic';
  export const runtime = 'nodejs';

  export async function GET(): Promise<NextResponse> {
    let dbStatus = 'unconfigured_or_fallback';

    if (process.env.DATABASE_URL) {
      try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      } catch {
        dbStatus = 'disconnected';
      }
    }

    return NextResponse.json(
      {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: dbStatus,
      },
      { status: 200 }
    );
  }
  ```

---

### Phase 2: Multi-Stage Production Dockerfile & Build Ignore Rules
**Goal**: Construct a secure, multi-stage Alpine Dockerfile running as unprivileged user `nextjs` (UID 1001) that packages standalone output and Prisma query engines under 180MB.  
**Acceptance Criteria Mapped**: `AC-DEP-01`

#### 2.1 Create `.dockerignore`
- **File**: `.dockerignore`
- **Contents**:
  ```dockerignore
  node_modules
  .next
  .git
  .github
  coverage
  test-results
  playwright-report
  blob-report
  .env
  .env.local
  .env.*.local
  .agents
  .claude
  .vscode
  .idea
  *.log
  docs
  agent
  devpost
  *.md
  ```

#### 2.2 Create `Dockerfile`
- **File**: `Dockerfile`
- **Exact Build Stages**:
  1. `base`: `node:20-alpine`, installs `libc6-compat` and `curl`, sets `WORKDIR /app`.
  2. `deps`: Installs `python3 make g++` (for native modules like `better-sqlite3`), copies `package.json`, `package-lock.json`, and `prisma/`, runs `npm ci --frozen-lockfile` and `npx prisma generate`.
  3. `builder`: Copies `node_modules` from `deps`, copies application source, sets `NODE_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`, executes `npm run build`.
  4. `runner`: `node:20-alpine`, creates system group `nodejs` (GID 1001) and system user `nextjs` (UID 1001). Copies `public/`, `.next/standalone/`, `.next/static/`, and explicitly preserves `.prisma` and `prisma/` directory for runtime query engine stability. Sets `USER nextjs`, exposes port 3000, configures `HEALTHCHECK`, and executes `CMD ["node", "server.js"]`.

---

### Phase 3: Playwright Test Tooling & Package Dependencies
**Goal**: Install Playwright and Axe test packages, configure npm scripts, and author the test runner configuration.  
**Acceptance Criteria Mapped**: `AC-DEP-02`, `AC-DEP-03`

#### 3.1 Modify `package.json`
- **File**: `package.json`
- **Additions**:
  - `devDependencies`:
    - `"@playwright/test": "^1.47.0"`
    - `"@axe-core/playwright": "^4.10.0"`
  - `scripts`:
    - `"test:e2e": "playwright test"`
    - `"test:e2e:ui": "playwright test --ui"`
    - `"test:ci": "npm run lint && npm run type-check && npm test && npm run test:e2e"`

#### 3.2 Create `playwright.config.ts`
- **File**: `playwright.config.ts`
- **Configuration Invariants**:
  - `testDir: './tests/e2e'`
  - `timeout: 30 * 1000`
  - `fullyParallel: true`
  - `retries: process.env.CI ? 1 : 0`
  - `workers: process.env.CI ? 2 : undefined`
  - `baseURL: 'http://127.0.0.1:3000'`
  - `webServer`:
    - `command: 'npm run start'`
    - `url: 'http://127.0.0.1:3000'`
    - `reuseExistingServer: !process.env.CI`
    - `timeout: 60 * 1000`
    - `env`: `NODE_ENV: 'production'`, `PORT: '3000'`, `ADVISOR_PASSCODE: 'TEACHER2026'`, `GEMINI_API_KEY: ''` (triggers deterministic mock fallback).

---

### Phase 4: Playwright End-to-End Regression Test Suites & Axe WCAG Audits
**Goal**: Implement comprehensive, robust browser test suites using exact locators from the active components and copy dictionaries, preventing test flakiness and cross-test interference.  
**Acceptance Criteria Mapped**: `AC-DEP-03`, `AC-DEP-04`, `AC-DEP-05`, Accessibility Rules

#### 4.1 Create `tests/e2e/student-flow.spec.ts`
- **File**: `tests/e2e/student-flow.spec.ts`
- **Test Scenarios**:
  1. **Step 0 Welcome**:
     - Fills `input#student-full-name` with `"Alex Morgan"`.
     - Selects `select#student-grade-level` with `"grade_12"`.
     - Fills optional `input#student-id` with `"STU-99012"`.
     - Runs Axe WCAG 2.1 AA audit on Welcome screen (asserts 0 critical/serious violations).
     - Clicks `button:has-text("Begin PathLess Guide")`.
  2. **Steps 1 through 10 Questionnaire**:
     - Step 1: Selects `button[role="checkbox"]:has-text("Building or fixing physical systems")`. Runs Axe audit on question view. Clicks `button:has-text("Continue")`.
     - Step 2: Selects `button[role="radio"]:has-text("Technology & Computing")`. Clicks `button:has-text("Continue")`.
     - Step 3: Fills `textarea` with `"I worry about advanced math courses"`. Runs Axe audit on live character count. Clicks `button:has-text("Continue")`.
     - Steps 4 through 9: Selects first option and clicks `button:has-text("Continue")`.
     - Step 10: Selects first option and clicks `button:has-text("Finish & Explore Pathways")`.
  3. **Results View & Card Expansion**:
     - Waits for results container and student name `"Alex Morgan"`.
     - Asserts exactly 4 career cards render (`article[aria-label*="Career pathway"]`).
     - Verifies qualitative badges (`"Top Match"`, `"Explore Also"`) and asserts zero percentage scores (`"% Natural Fit"` count is 0).
     - Expands the first card: asserts `aria-expanded="true"`, verifies 3-stage milestone line (`"1. College Major:"`, `"2. First Job:"`, `"3. Growth Role:"`).
     - Checks regional Thai university links: verifies `target="_blank"` and `rel="noopener noreferrer"`.
  4. **Print Media Stylesheet Verification**:
     - Emulates print media: `await page.emulateMedia({ media: 'print' })`.
     - Asserts `.print-only` header is visible.
     - Asserts interactive buttons (`button:has-text("Start Over")`) are hidden.
     - Resets media to `'screen'`.
  5. **Automated Accessibility Audit**:
     - Runs `AxeBuilder` on active results view asserting zero critical or serious WCAG 2.1 AA violations.

#### 4.2 Create `tests/e2e/advisor-flow.spec.ts`
- **File**: `tests/e2e/advisor-flow.spec.ts`
- **Test Scenarios**:
  1. **Passcode Protection**:
     - Navigates to `/advisor`.
     - Runs Axe audit on Passcode Login modal.
     - Enters invalid code (`"WRONG_PASS"`) into `input#advisor-passcode`.
     - Clicks `button:has-text("Open Advisor Directory")`.
     - Asserts error message appears: `"The passcode entered does not match our school records"`.
  2. **Successful Educator Authentication**:
     - Enters valid passcode `"TEACHER2026"` into `input#advisor-passcode`.
     - Enters author name `"Kru Somchai"` into `input#advisor-author-name`.
     - Clicks `button:has-text("Open Advisor Directory")`.
     - Asserts dashboard loads: `"School Advisor & Mentor Directory"` is visible.
     - Runs Axe audit on Advisor Dashboard.
  3. **Directory Search & Detail Modal Review**:
     - Searches student directory: fills search input with `"Alex"`.
     - Clicks `button:has-text("View Full Guide")` on first student record.
     - Verifies modal drawer opens: `role="dialog"` is visible.
     - Runs Axe audit on open modal drawer (asserts 0 critical/serious violations).
  4. **Private Note Saving**:
     - Fills `textarea#advisor-note-input` with `"Student expressed strong interest in Chulalongkorn Computer Engineering."`.
     - Clicks `button:has-text("Save Note")`.
     - Asserts note text appears in chronological notes history.
     - Closes drawer via `Escape` key.
  5. **Session Logout**:
     - Clicks `button:has-text("Sign Out")`.
     - Asserts redirection to passcode login screen (`input#advisor-passcode` is visible).

#### 4.3 Create `tests/e2e/guardrails.spec.ts`
- **File**: `tests/e2e/guardrails.spec.ts`
- **Test Scenarios**:
  1. **Sliding-Window Rate Limiting Check (with Isolated Synthetic IP)**:
     - Uses synthetic IP header: `X-Forwarded-For: 198.51.100.99` to prevent rate limiter cross-test pollution.
     - Sends rapid successive requests to `/api/advisor/login`.
     - Asserts HTTP 429 is returned.
     - Asserts RFC 7807 response fields: `title === 'RATE_LIMITED'`, `detail` contains `"Too many passcode attempts have been made recently"`, and `Retry-After` header is present.
  2. **HTML & Script Tag Input Sanitization**:
     - Navigates to `/`.
     - Fills `input#student-full-name` with `"<script>alert('xss')</script><b>Student</b>"`.
     - Advances through intake Step 1.
     - Asserts no unescaped script tag executes or renders in the DOM (`script:has-text("alert")` count is 0).
  3. **React Error Boundary Recovery**:
     - Asserts that error boundary fallback cards render with high-contrast text and a min 44px reset button if an unhandled rendering error occurs.
     - Runs Axe audit asserting zero critical/serious violations on error state.

---

### Phase 5: GitHub Actions CI Workflow Setup
**Goal**: Create an automated, zero-cost GitHub Actions pipeline running lint, type-check, unit tests, Playwright E2E suites, and Docker build verification with caching.  
**Acceptance Criteria Mapped**: `AC-DEP-02`

#### 5.1 Create `.github/workflows/ci.yml`
- **File**: `.github/workflows/ci.yml`
- **Triggers**:
  - `push: branches: [main, 'feature/*']`
  - `pull_request: branches: [main]`
- **Concurrency**: Group by workflow and ref with `cancel-in-progress: true`.
- **Jobs**:
  1. `quality-and-unit`:
     - Environment: `ubuntu-latest`, Node.js 20 with `cache: 'npm'`.
     - Steps: `npm ci`, `npx prisma generate`, `npm run lint`, `npm run type-check`, `npm test`.
  2. `build-and-e2e`:
     - Environment: `ubuntu-latest`, Node.js 20 with `cache: 'npm'`.
     - Steps:
       - Cache Playwright browsers (`~/.cache/ms-playwright`) keyed on OS and lockfile.
       - Install Playwright browsers (`npx playwright install --with-deps chromium` when cache misses).
       - Compile Next.js: `npm run build`.
       - Run Playwright E2E tests: `npx playwright test`.
       - Upload `playwright-report/` artifact on failure.
  3. `docker-verification`:
     - Needs: `[quality-and-unit, build-and-e2e]`.
     - Steps:
       - Setup Docker Buildx.
       - Build container with GitHub Actions layer cache (`cache-from: type=gha`, `cache-to: type=gha,mode=max`).
       - Run container smoke test: assert runtime UID is `1001`.

---

### Phase 6: Zero-Cost Production Deployment Runbook
**Goal**: Author a complete, educator-ready operational runbook documenting free-tier deployment recipes, environment variables, and maintenance practices.  
**Acceptance Criteria Mapped**: `AC-DEP-06`

#### 6.1 Create `docs/pathless/runbooks/deployment.md`
- **File**: `docs/pathless/runbooks/deployment.md`
- **Contents**:
  1. **Zero-Cost Architecture Blueprint**: Vercel (Hobby Tier) + Neon Serverless PostgreSQL (0.5 GB Free Tier) + Google Gemini 2.5 Flash Free Tier (15 RPM).
  2. **Environment Variable Reference**:
     - `DATABASE_URL` (Serverless pooled connection string with `pgbouncer=true`).
     - `DIRECT_URL` (Direct migration connection string).
     - `GEMINI_API_KEY` (Google AI Studio API key).
     - `GEMINI_MODEL` (`gemini-2.5-flash`).
     - `ADVISOR_PASSCODE` (Defaults to `TEACHER2026`).
     - `SESSION_SECRET` (HMAC cookie signing salt).
     - `ADMIN_SECRET` (Authorization key for data archive endpoint).
     - `NODE_ENV` (`production`).
  3. **Deployment Recipe 1: Vercel + Neon PostgreSQL (1-Click Free Cloud)**:
     - Creating the Neon database project and obtaining connection strings.
     - Running initial schema migration (`npx prisma db push`).
     - Configuring Vercel environment variables and linking repository.
  4. **Deployment Recipe 2: Self-Hosted Container on Free-Tier VPS (Oracle Always-Free / Ubuntu)**:
     - Building the Docker image (`docker build -t pathless:latest .`).
     - Launching container with environment file and port mapping.
     - Setting up Caddy for automated HTTPS certificate issuance.
  5. **Health Checks & Monitoring**:
     - Querying `GET /api/health` for uptime and connection status.
  6. **Annual Data Retention Runbook**:
     - Invoking `POST /api/admin/purge` to archive records prior to July 1 cut-off.

---

### Phase 7: Full Verification Pipeline & Quality Gates
**Goal**: Run all static checks, unit tests, E2E suites, and builds to confirm complete pass before requesting branch review.  
**Acceptance Criteria Mapped**: `AC-DEP-01` through `AC-DEP-06`

#### 7.1 Verification Sequence:
1. `npm run type-check`: Zero TypeScript compiler errors across all source and test files.
2. `npm run lint`: Zero ESLint warnings or errors.
3. `npm test`: All 23 unit test suites and 6 integration test suites pass cleanly.
4. `npm run build`: Production Next.js compilation succeeds with standalone output.
5. `npx playwright test`: All 3 E2E test suites pass with zero failures and zero WCAG 2.1 AA violations.

---

## 5. Acceptance Criteria Traceability Matrix

```
┌───────────┬───────────────────────────────────────────────────┬─────────────┬──────────────────────────────────────────┐
│ Criteria  │ Description                                       │ Phase       │ Automated Verification Method            │
├───────────┼───────────────────────────────────────────────────┼─────────────┼──────────────────────────────────────────┤
│ AC-DEP-01 │ Multi-stage Dockerfile builds standalone container│ Phase 1, 2  │ docker build -t pathless:ci . &&         │
│           │ running as unprivileged node user (UID 1001).     │             │ docker run --rm pathless:ci id -u (1001) │
├───────────┼───────────────────────────────────────────────────┼─────────────┼──────────────────────────────────────────┤
│ AC-DEP-02 │ GitHub Actions CI workflow automates type-check,  │ Phase 5     │ .github/workflows/ci.yml runs cleanly in │
│           │ linting, unit test, build, and E2E suites.        │             │ CI runner without paid external secrets. │
├───────────┼───────────────────────────────────────────────────┼─────────────┼──────────────────────────────────────────┤
│ AC-DEP-03 │ Playwright E2E tests automate student journey     │ Phase 3, 4  │ npx playwright test student-flow.spec.ts │
│           │ (Step 0 to 10, 4 cards, milestones, unis, print). │             │ passes with 0 critical WCAG violations.  │
├───────────┼───────────────────────────────────────────────────┼─────────────┼──────────────────────────────────────────┤
│ AC-DEP-04 │ Playwright E2E tests verify advisor portal        │ Phase 3, 4  │ npx playwright test advisor-flow.spec.ts │
│           │ (TEACHER2026 login, search, drawer, note save).  │             │ passes with 0 critical WCAG violations.  │
├───────────┼───────────────────────────────────────────────────┼─────────────┼──────────────────────────────────────────┤
│ AC-DEP-05 │ Playwright E2E tests assert rate-limit triggers   │ Phase 3, 4  │ npx playwright test guardrails.spec.ts   │
│           │ and input sanitization neutralizes HTML tags.     │             │ passes with isolated synthetic IP.       │
├───────────┼───────────────────────────────────────────────────┼─────────────┼──────────────────────────────────────────┤
│ AC-DEP-06 │ Production runbook documents zero-cost deployment │ Phase 6     │ docs/pathless/runbooks/deployment.md     │
│           │ configurations and environment variables.         │             │ verified for Vercel, Neon, and VPS.      │
└───────────┴───────────────────────────────────────────────────┴─────────────┴──────────────────────────────────────────┘
```

---

## 6. Exact Verification Commands

All commands are derived directly from [`package.json`](file:///d:/Hackathon/Beta_Folder/package.json):

```bash
# 1. Type Check (Strict TypeScript validation)
npm run type-check

# 2. Lint Check (Next.js & ESLint rules)
npm run lint

# 3. Unit & Integration Tests (Tsx test runner)
npm test

# 4. Production Next.js Build (Standalone compilation check)
npm run build

# 5. Playwright E2E Test Suite (Headless browser execution)
npx playwright test

# 6. Dockerfile Build & Non-Root User Verification
docker build -t pathless:test .
docker run --rm pathless:test id -u
```
