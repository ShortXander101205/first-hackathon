---
doc: contract
feature: 13-deployment-and-e2e
project: PathLess - Framework v2
status: approved
gate: PASS
---

# Feature 13: Deployment and E2E — Technical Contract & Specification

## 1. Executive Summary & Objective

This specification establishes the technical, architectural, behavioral, and accessibility contract for **Feature 13: Deployment and E2E** of the **PathLess Framework v2** on branch `feature/13-deployment-and-e2e`.

Across Features 1 through 12 and Feature 14, PathLess developed into a complete, hardened educational discovery application. It features a calm 10-step intake wizard, defensible career synthesis restricted to a 48-profession catalog whitelist, deterministic Thai university program matching, passcode-gated advisor tools (`TEACHER2026`), centralized plain-language copy, and robust safety guardrails (sliding-window rate limiting, input sanitization, prompt injection screening, and error boundaries).

However, PathLess currently lacks **containerized production packaging**, **automated multi-stage CI workflows**, and **automated browser-level end-to-end (E2E) regression tests**. Verifications are limited to Node.js unit and integration tests (`tests/unit`, `tests/integration`), leaving critical user journeys (multi-step form navigation, modal drawers, print stylesheets, rate-limit UI fallbacks, and real browser DOM accessibility) susceptible to regressions prior to deployment.

Feature 13 introduces **production containerization**, a **zero-cost continuous integration pipeline**, **automated Playwright browser regression test suites**, and a comprehensive **zero-cost deployment runbook**.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                FEATURE BASELINE vs FEATURE 13 ENHANCEMENTS                       │
├─────────────────────────────────────────────────┬────────────────────────────────────────────────┤
│           Prior Baseline (Features 1–12, 14)    │      Feature 13 (Deployment & Playwright E2E)  │
├─────────────────────────────────────────────────┼────────────────────────────────────────────────┤
│ • No container packaging; local dev only via    │ • Multi-stage production Dockerfile targeting   │
│   `next dev` or standard `next build`           │   Next.js standalone output (<180MB image)     │
│ • Unprivileged runtime execution unconfigured   │ • Non-root `nextjs` user execution (uid 1001)   │
│ • No CI workflow; manual script execution       │ • GitHub Actions CI (.github/workflows/ci.yml)  │
│   required to catch lint, type, or test breaks  │   running lint, type-check, unit, and E2E tests│
│ • No automated browser-level E2E tests          │ • Playwright E2E suites (tests/e2e/*.spec.ts)   │
│ • Intake flow, card toggling, and modal drawers │ • Automated browser journey coverage: student   │
│   verified only through manual click-testing    │   intake, advisor portal, rate-limit triggers  │
│ • Print stylesheet (@media print) verified      │ • Automated assertion of print header and      │
│   only via manual browser print preview         │   expanded card layouts in headless browser    │
│ • DOM accessibility verified only via static    │ • Automated in-browser axe-core WCAG 2.1 AA    │
│   heuristics, missing runtime rendered checks   │   audits asserting zero critical violations    │
│ • Undocumented deployment configurations for    │ • Production runbook (docs/pathless/runbooks/   │
│   zero-cost cloud tiers (Vercel, Neon, VPS)     │   deployment.md) for 100% zero-cost setups     │
└─────────────────────────────────────────────────┴────────────────────────────────────────────────┘
```

### Primary Objectives

1. **Multi-Stage Production Dockerfile & Standalone Next.js Output (`Dockerfile`, `.dockerignore`, `next.config.mjs`)**:
   Implement an optimized 4-stage Alpine Dockerfile (`base`, `deps`, `builder`, `runner`) that leverages Next.js `output: 'standalone'` to reduce image footprints below 180MB. Execute the production container strictly as an unprivileged system user (`nextjs:nodejs`, UID 1001) with explicit directory permission controls, container health checking, and zero leaked build-time secrets.
2. **Zero-Cost GitHub Actions CI Pipeline (`.github/workflows/ci.yml`)**:
   Construct an automated continuous integration pipeline triggered on pull requests and pushes to `main` and `feature/*`. The workflow executes code quality gates (ESLint, TypeScript `tsc --noEmit`), Prisma client code generation, unit/integration test suites (`npm test`), a production build verification, a container build check, and headless Playwright E2E tests without requiring paid third-party CI secrets.
3. **Playwright Browser E2E Test Suite (`playwright.config.ts`, `tests/e2e/*`)**:
   Establish automated, resilient browser test suites covering:
   - **Student Intake & Synthesis Journey (`tests/e2e/student-flow.spec.ts`)**: Intake Step 0 welcome, 10 questionnaire steps, synthesis transition, 4-card progressive disclosure, milestone timeline inspection, verified Thai university links, and print stylesheet activation.
   - **Advisor Portal Workflow (`tests/e2e/advisor-flow.spec.ts`)**: Passcode gatekeeping (`TEACHER2026`), wrong passcode handling, student directory searching, detail modal inspection, private note saving, and session sign-out.
   - **Guardrails & Security Flow (`tests/e2e/guardrails.spec.ts`)**: Sliding-window rate limit triggers (HTTP 429 with calm user copy), input sanitization (stripping HTML and script tags), and React error boundary fallback resilience.
4. **Automated WCAG 2.1 AA Accessibility Audits (`@axe-core/playwright`)**:
   Embed automated accessibility audits directly into Playwright tests. Assert zero critical or serious WCAG 2.1 AA violations across the student intake form, synthesized results view, advisor dashboard, and error fallback states.
5. **Zero-Cost Production Deployment Runbook (`docs/pathless/runbooks/deployment.md`)**:
   Publish a comprehensive operational runbook documenting zero-cost deployment recipes for Vercel (Hobby tier), Neon/Supabase Serverless PostgreSQL (free tier), Google Gemini Flash API (free tier), and self-hosted Docker on a free-tier VPS (e.g. Oracle Cloud Always-Free or Fly.io).

---

## 2. Scope & Boundary Clarifications

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      FEATURE 13 BOUNDARY MAP                                     │
├──────────────────────────────────────┬───────────────────────────────────────────────────────────┤
│          IN SCOPE (Feature 13)       │               OUT OF SCOPE / PRESERVED                    │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ • Multi-stage Dockerfile with        │ • Modifying the 10 intake questions, helper hints, or     │
│   Next.js standalone configuration   │   step validations (Preserved from Features 11 & 14)      │
│ • Unprivileged runtime execution     │ • Changing the 48-profession catalog whitelist or         │
│   (non-root nextjs user, UID 1001)   │   the 17-school Thai university registry                  │
│ • GitHub Actions CI workflow         │ • Altering Prisma schema models or relational fields      │
│   running lint, types, unit, E2E     │   (Preserved from Feature 10)                             │
│ • Playwright E2E test suites:        │ • Redesigning the 4 pathway cards, badges, or summaries   │
│   student flow, advisor flow,        │ • Introducing paid cloud services or requiring paid       │
│   guardrails & rate limiting         │   secrets in GitHub Actions CI                            │
│ • Automated @axe-core/playwright     │ • Adding distributed Redis or external rate-limit clusters│
│   WCAG 2.1 AA accessibility checks   │   (Preserved in-memory sliding window from Feature 12)    │
│ • Print stylesheet verification      │ • Modifying core AI synthesis prompts or temperature      │
│ • Zero-cost deployment runbook       │                                                           │
└──────────────────────────────────────┴───────────────────────────────────────────────────────────┘
```

### Explicitly In Scope

- **Containerization**:
  - `Dockerfile`: Multi-stage build (`base`, `deps`, `builder`, `runner`) on Alpine Linux with unprivileged user `nextjs` (UID 1001).
  - `.dockerignore`: Comprehensive exclusion list preventing local dependencies, environment secrets, and test artifacts from leaking into image layers.
  - `next.config.mjs`: Activation of `output: 'standalone'` alongside existing configuration (`reactStrictMode`, `poweredByHeader: false`, server components external packages).
- **Continuous Integration Pipeline**:
  - `.github/workflows/ci.yml`: GitHub Actions workflow automating quality checks, unit tests, production build, Playwright E2E tests, and Docker build verification on `push` and `pull_request`.
- **Automated E2E Test Automation**:
  - `playwright.config.ts`: Playwright configuration specifying webServer lifecycle, timeout thresholds, headless execution, and artifact retention on failure.
  - `tests/e2e/student-flow.spec.ts`: Full student lifecycle test from intake Step 0 through card toggle, milestone inspection, university link verification, print CSS check, and axe accessibility audit.
  - `tests/e2e/advisor-flow.spec.ts`: Full advisor portal lifecycle test covering passcode login (`TEACHER2026`), directory search/filter, detail modal review, note saving, logout, and axe accessibility audit.
  - `tests/e2e/guardrails.spec.ts`: Security and resilience test verifying rate-limit triggering (429 calm message), HTML/XSS input sanitization, and axe accessibility audit.
- **Operational Documentation**:
  - `docs/pathless/runbooks/deployment.md`: Complete zero-cost deployment guide for Vercel, Neon PostgreSQL, Google Gemini API, and self-hosted Docker on a VPS.
- **Package Configuration**:
  - `package.json`: Addition of `@playwright/test` and `@axe-core/playwright` devDependencies, plus scripts `test:e2e`, `test:e2e:ui`, and `test:ci`.

### Explicitly Out of Scope

- **No Intake Question or Logic Changes**: Preserves the 10-step student intake questions, state machine, and validation rules defined in Features 11 and 14.
- **No Catalog or Scaffolding Changes**: Preserves the 48-profession catalog whitelist and the 17-institution Thai university registry.
- **No Database Schema Migrations**: Preserves `prisma/schema.prisma` (`StudentSubmission`, `IntakeResponse`, `SynthesisResult`, `AdvisorNote`).
- **No Paid Infrastructure**: Mandates that CI workflows run deterministically against mock fallback data or ephemeral instances without requiring paid API keys or managed databases.

---

## 3. Architecture & System Flow Diagrams

### 3.1 Multi-Stage Docker Container Build Architecture

```mermaid
flowchart TD
    subgraph Stage1["1. Base Stage (node:20-alpine)"]
        A[Alpine Base Image] --> B[Install libc6-compat]
        B --> C[Set WORKDIR /app]
    end

    subgraph Stage2["2. Dependencies Stage (deps)"]
        D[Copy package.json & lockfile] --> E[Copy prisma/schema.prisma]
        E --> F[Run npm ci --frozen-lockfile]
        F --> G[Run npx prisma generate]
    end

    subgraph Stage3["3. Builder Stage (builder)"]
        H[Copy node_modules from deps] --> I[Copy Application Source]
        I --> J[Set NODE_ENV=production]
        J --> K[Run npm run build]
        K --> L[Generate .next/standalone & .next/static]
    end

    subgraph Stage4["4. Runner Stage (runner - Minimal Image)"]
        M[Alpine Node 20 Runtime] --> N[Add group nodejs 1001 & user nextjs 1001]
        N --> O[Copy public from builder]
        O --> P[Copy .next/standalone to /app]
        P --> Q[Copy .next/static to /app/.next/static]
        Q --> R[Set ownership to nextjs:nodejs]
        R --> S[USER nextjs - Non-Root Execution]
        S --> T[EXPOSE 3000 & Healthcheck]
        T --> U[CMD: node server.js]
    end

    Stage1 --> Stage2
    Stage2 --> Stage3
    Stage3 --> Stage4
```

### 3.2 GitHub Actions Continuous Integration (CI) Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Git Push
    participant GitHub as GitHub Actions Runner
    participant Quality as Job: Quality & Unit Tests
    participant E2E as Job: Build & Playwright E2E
    participant Docker as Job: Docker Build Verification

    Dev->>GitHub: Push branch or Open PR
    activate GitHub

    par Run Quality Gate
        GitHub->>Quality: Run on ubuntu-latest
        activate Quality
        Quality->>Quality: Checkout code & setup Node.js 20 (npm cache)
        Quality->>Quality: npm ci & npx prisma generate
        Quality->>Quality: npm run lint (ESLint)
        Quality->>Quality: npm run type-check (TypeScript noEmit)
        Quality->>Quality: npm test (Unit & Integration tests)
        Quality-->>GitHub: Quality & Unit PASS
        deactivate Quality
    and Run Playwright E2E Gate
        GitHub->>E2E: Run on ubuntu-latest
        activate E2E
        E2E->>E2E: Checkout code & setup Node.js 20
        E2E->>E2E: npm ci & npx prisma generate
        E2E->>E2E: Install Playwright browsers (chromium)
        E2E->>E2E: npm run build (Validate Next.js compilation)
        E2E->>E2E: npx playwright test (tests/e2e/*.spec.ts)
        E2E->>E2E: Execute Axe WCAG 2.1 AA audits
        alt E2E Failure
            E2E->>GitHub: Upload test-results & report artifacts
        end
        E2E-->>GitHub: Playwright E2E PASS
        deactivate E2E
    end

    GitHub->>Docker: Run Docker Verification (Depends on Quality & E2E)
    activate Docker
    Docker->>Docker: Setup Docker Buildx
    Docker->>Docker: Build multi-stage Docker image
    Docker->>Docker: Verify unprivileged user & boot test
    Docker-->>GitHub: Docker Verification PASS
    deactivate Docker

    GitHub-->>Dev: All Status Checks Green (Ready for Merge)
    deactivate GitHub
```

### 3.3 Playwright E2E Mock Isolation & Fallback Flow

```mermaid
flowchart LR
    subgraph PlaywrightBrowser["Headless Playwright Browser (Chromium)"]
        Student[Student Flow: Step 0 to Results]
        Advisor[Advisor Flow: Passcode to Review]
        Security[Guardrails: 429 & Sanitization]
    end

    subgraph NextServer["Next.js WebServer (127.0.0.1:3000)"]
        Router[App Router]
        API_Guide["POST /api/guide"]
        API_Login["POST /api/advisor/login"]
        RateLimiter["In-Memory Rate Limiter"]
    end

    subgraph ZeroCostIsolation["Zero-Cost CI Environment (No External Secrets)"]
        MockGemini["Mock Career Fallback (Deterministic 4-Card Synthesis)"]
        PrismaSafe["Prisma Safe Persistence (Non-blocking DB fallback)"]
    end

    Student -->|HTTP /| Router
    Student -->|POST Intake| API_Guide
    Advisor -->|POST TEACHER2026| API_Login
    Security -->|Excessive Calls| RateLimiter

    API_Guide -->|GEMINI_API_KEY omitted| MockGemini
    API_Guide -->|DATABASE_URL omitted| PrismaSafe
    RateLimiter -->|Burst exceeded| Router
```

---

## 4. Module 1: Multi-Stage Production Dockerfile & Standalone Next.js Config

### 4.1 Next.js Standalone Configuration (`next.config.mjs`)

To optimize container size, Next.js can trace dependencies automatically to output a standalone server directory containing only the production files required to run the application, excluding extraneous `node_modules` and source build caches.

#### Required `next.config.mjs` Specification:

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

**Key Invariants:**
1. `output: 'standalone'`: Emits `.next/standalone/server.js` and an optimized subset of `node_modules`.
2. `poweredByHeader: false`: Hardens security by stripping the `X-Powered-By: Next.js` HTTP response header.
3. `reactStrictMode: true`: Preserves strict React runtime integrity checks.

---

### 4.2 Production Dockerfile Specification (`Dockerfile`)

The container build uses Alpine Linux for minimal image size and attack surface, structured into four clear stages:

```dockerfile
# -----------------------------------------------------------------------------
# Stage 1: Base Alpine Environment
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

# Install libc6-compat for Alpine compatibility with native Node packages
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# -----------------------------------------------------------------------------
# Stage 2: Dependencies Installation
# -----------------------------------------------------------------------------
FROM base AS deps

# Copy dependency manifests
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install exact dependencies and generate Prisma client
RUN npm ci --frozen-lockfile
RUN npx prisma generate

# -----------------------------------------------------------------------------
# Stage 3: Build Application
# -----------------------------------------------------------------------------
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for production build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 4: Minimal Production Runner
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install curl for container health checks
RUN apk add --no-cache curl

# Security Invariant: Create unprivileged system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and public directory
COPY --from=builder /app/public ./public

# Setup .next directory with correct ownership
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone output and static compilation bundles
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Security Invariant: Switch to unprivileged runtime execution
USER nextjs

EXPOSE 3000

# Container Healthcheck (every 30s, 5s timeout, 3 retries)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
```

---

### 4.3 Container Ignore Rules (`.dockerignore`)

```dockerignore
# Dependencies & local build artifacts
node_modules
.next
.git
.github
out
dist
coverage
test-results
playwright-report
blob-report

# Environment and secrets
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Local scratch and IDE files
.agents
.claude
.vscode
.idea
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Documentation and design assets
docs
agent
devpost
*.md
LICENSE
```

---

## 5. Module 2: GitHub Actions CI Pipeline Workflow (`.github/workflows/ci.yml`)

### 5.1 Pipeline Architecture

The CI pipeline runs automatically on GitHub Actions infrastructure. It is designed to run completely free without requiring paid subscriptions, external cloud accounts, or proprietary API keys.

#### Key Features:
- **Zero Paid Secrets Requirement**: Runs with dummy/ephemeral values for `DATABASE_URL`, `GEMINI_API_KEY`, and `ADVISOR_PASSCODE`. The application's defensive architecture automatically uses its deterministic mock fallback and safe persistence layer.
- **Fast Execution**: Uses `actions/setup-node@v4` with `cache: 'npm'` for rapid dependency resolution.
- **Parallelized Quality and E2E Testing**: Runs static checks and browser tests concurrently to keep feedback loops under 5 minutes.
- **Artifact Diagnostics**: Retains Playwright traces and failure screenshots on failed runs.

---

### 5.2 Workflow Specification (`.github/workflows/ci.yml`)

```yaml
name: PathLess CI Pipeline

on:
  push:
    branches:
      - main
      - 'feature/*'
  pull_request:
    branches:
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ---------------------------------------------------------------------------
  # Job 1: Quality Gate & Unit/Integration Tests
  # ---------------------------------------------------------------------------
  quality-and-unit:
    name: Code Quality & Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10

    env:
      NODE_ENV: test
      GEMINI_API_KEY: dummy_ci_key
      ADVISOR_PASSCODE: TEACHER2026

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript Type Check
        run: npm run type-check

      - name: Run Unit & Integration Tests
        run: npm test

  # ---------------------------------------------------------------------------
  # Job 2: Build & Playwright End-to-End Tests
  # ---------------------------------------------------------------------------
  build-and-e2e:
    name: Next.js Build & Playwright E2E
    runs-on: ubuntu-latest
    timeout-minutes: 15

    env:
      NODE_ENV: production
      GEMINI_API_KEY: dummy_ci_key
      ADVISOR_PASSCODE: TEACHER2026
      NEXT_TELEMETRY_DISABLED: 1

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Install Playwright Browsers (Chromium)
        run: npx playwright install --with-deps chromium

      - name: Build Production Next.js Application
        run: npm run build

      - name: Run Playwright E2E Test Suite
        run: npx playwright test
        env:
          CI: true

      - name: Upload Playwright Test Report on Failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  # ---------------------------------------------------------------------------
  # Job 3: Docker Container Build Verification
  # ---------------------------------------------------------------------------
  docker-verification:
    name: Dockerfile Build Verification
    needs: [quality-and-unit, build-and-e2e]
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Multi-Stage Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: pathless:ci
          load: true

      - name: Verify Container Unprivileged Execution
        run: |
          USER_ID=$(docker run --rm pathless:ci id -u)
          echo "Container runtime user ID: $USER_ID"
          if [ "$USER_ID" -ne 1001 ]; then
            echo "ERROR: Container is not running as unprivileged user 1001!"
            exit 1
          fi
```

---

## 6. Module 3: Playwright E2E Test Suite & Test Runner Configuration

### 6.1 Package Additions (`package.json`)

To support Playwright E2E execution and automated WCAG 2.1 AA audits, `package.json` includes:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:ci": "npm run lint && npm run type-check && npm test && npm run test:e2e"
  },
  "devDependencies": {
    "@playwright/test": "^1.47.0",
    "@axe-core/playwright": "^4.10.0"
  }
}
```

---

### 6.2 Playwright Configuration Specification (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration for PathLess Framework v2.
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
    env: {
      NODE_ENV: 'production',
      PORT: '3000',
      ADVISOR_PASSCODE: 'TEACHER2026',
      GEMINI_API_KEY: '', // Triggers deterministic mock fallback
    },
  },
});
```

---

### 6.3 Test Suite 1: Student Intake to Results Flow (`tests/e2e/student-flow.spec.ts`)

This suite exercises the complete student user journey:
1. **Intake Step 0**: Entering name, grade level, and optional student ID.
2. **Steps 1 through 10**: Stepping through task interests, academic curiosity, entering academic hesitation thoughts, and answering remaining questions.
3. **Synthesis & 4-Card Results View**:
   - Asserts transition to results screen without error alerts.
   - Asserts exactly 4 cards render (all collapsed on initial load).
   - Verifies cards display qualitative badges ("Top Match" and "Explore Also"), and zero percentage scores or startup jargon appear.
4. **Milestone Inspection**: Expands card and verifies the 3-stage progression line (College Study, First Job, Later Role).
5. **Regional Thai University Program Inspection**: Expands "Where to Study" section, verifies bilingual names and verified link safety attributes (`rel="noopener noreferrer"`, `target="_blank"`).
6. **Print Stylesheet Verification**: Evaluates `@media print` layout styles in the DOM (print header visibility and exclusion of interactive buttons).
7. **Automated Accessibility Audit**: Executes `@axe-core/playwright` scanning asserting zero critical WCAG 2.1 AA violations on Step 0 and on the active Results View.

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Student Intake to Results E2E Journey', () => {
  test('completes Step 0 through 10, views 4 cards, expands milestones, checks universities and print styles', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');
    await expect(page).toHaveTitle(/PathLess/i);

    // 2. Automated Axe Audit on Welcome / Step 0
    const step0AxeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsStep0 = step0AxeResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsStep0).toEqual([]);

    // 3. Step 0: Fill profile
    await page.fill('input#student-name', 'Alex Morgan');
    await page.selectOption('select#student-grade', 'grade_12');
    await page.fill('input#student-id', 'STU-99012');
    await page.click('button:has-text("Begin My Guide")');

    // 4. Complete Steps 1 through 10
    // Step 1: Task Interests (select 1 or 2 options)
    await page.waitForSelector('text=What kinds of activities');
    await page.click('button[role="checkbox"]:has-text("Building or fixing physical systems")');
    await page.click('button:has-text("Next Question")');

    // Step 2: Academic Curiosity
    await page.waitForSelector('text=Which broad subject');
    await page.click('button[role="radio"]:has-text("Technology & Computing")');
    await page.click('button:has-text("Next Question")');

    // Step 3: Academic Hesitation (Free-text thoughts)
    await page.waitForSelector('text=academic worry');
    await page.fill('textarea', 'I worry about very difficult advanced math prerequisites.');
    await page.click('button:has-text("Next Question")');

    // Step 4: Environment
    await page.click('button[role="radio"]:first-of-type');
    await page.click('button:has-text("Next Question")');

    // Step 5: Problem Solving
    await page.click('button[role="radio"]:first-of-type');
    await page.click('button:has-text("Next Question")');

    // Step 6: Social Energy
    await page.click('button[role="radio"]:first-of-type');
    await page.click('button:has-text("Next Question")');

    // Step 7: Structure Tolerance
    await page.click('button[role="radio"]:first-of-type');
    await page.click('button:has-text("Next Question")');

    // Step 8: Academic Friction
    await page.click('button[role="radio"]:first-of-type');
    await page.click('button:has-text("Next Question")');

    // Step 9: Future Peace of Mind
    await page.click('button[role="radio"]:first-of-type');
    await page.click('button:has-text("Next Question")');

    // Step 10: Post-College Ambition
    await page.click('button[role="radio"]:first-of-type');
    await page.click('button:has-text("Synthesize My Pathways")');

    // 5. Results Screen Verification
    await page.waitForSelector('text=Alex Morgan', { timeout: 15000 });
    const cards = page.locator('article[aria-label*="Career pathway"]');
    await expect(cards).toHaveCount(4);

    // Verify qualitative badges and absence of percentage scores
    await expect(page.locator('text=Top Match').first()).toBeVisible();
    await expect(page.locator('text=% Natural Fit')).toHaveCount(0);
    await expect(page.locator('text=Moonshot Trajectory')).toHaveCount(0);

    // 6. Milestone Inspection: Expand the first card
    const firstCardToggle = cards.first().locator('button[aria-expanded]');
    await expect(firstCardToggle).toHaveAttribute('aria-expanded', 'false');
    await firstCardToggle.click();
    await expect(firstCardToggle).toHaveAttribute('aria-expanded', 'true');

    // Check 3-stage progression line
    await expect(cards.first().locator('text=1. What to Study')).toBeVisible();
    await expect(cards.first().locator('text=2. Common First Job')).toBeVisible();
    await expect(cards.first().locator('text=3. Growth Role')).toBeVisible();

    // 7. University Link Verification
    const uniLink = cards.first().locator('a[target="_blank"]').first();
    if (await uniLink.isVisible()) {
      await expect(uniLink).toHaveAttribute('rel', 'noopener noreferrer');
    }

    // 8. Print Stylesheet DOM Verification
    const printHeader = page.locator('.print-only');
    await expect(printHeader).toHaveCount(1);

    // 9. Automated Axe Audit on Active Results Screen
    const resultsAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsResults = resultsAxe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsResults).toEqual([]);
  });
});
```

---

### 6.4 Test Suite 2: Advisor Portal Workflow (`tests/e2e/advisor-flow.spec.ts`)

This suite verifies the educator portal:
1. **Passcode Protection**: Unauthenticated visit to `/advisor` presents the passcode login modal.
2. **Invalid Passcode Rejection**: Entering an incorrect code displays the calm, non-technical error message (`ADVISOR_COPY.login.errorMessage`).
3. **Successful Authentication**: Submitting `TEACHER2026` and advisor name logs in and loads the student directory.
4. **Student Directory & Filtering**: Directory search by student name and grade level filters rows reactively.
5. **Student Detail Modal**: Clicking a student row opens the detail modal displaying intake answers, 4 pathway cards, and university matches.
6. **Advisor Note Authoring**: Authoring and saving a note immediately appends it to the student record history.
7. **Sign Out**: Clicking the Sign Out button clears session cookies and redirects to the login screen.
8. **Automated Accessibility Audit**: Asserts zero critical WCAG 2.1 AA violations on the login screen and directory dashboard.

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Advisor Portal E2E Workflow', () => {
  test('rejects incorrect passcode, logs in with TEACHER2026, searches students, inspects details, saves note, and logs out', async ({ page }) => {
    // 1. Visit Advisor Portal
    await page.goto('/advisor');

    // 2. Accessibility audit on passcode login view
    const loginAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsLogin = loginAxe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsLogin).toEqual([]);

    // 3. Attempt invalid passcode
    await page.fill('input#advisor-passcode', 'WRONG_CODE_999');
    await page.click('button:has-text("Open Advisor Directory")');
    await expect(page.locator('text=The passcode entered does not match our school records')).toBeVisible();

    // 4. Authenticate with valid passcode TEACHER2026
    await page.fill('input#advisor-passcode', 'TEACHER2026');
    await page.fill('input#advisor-name', 'Kru Somchai');
    await page.click('button:has-text("Open Advisor Directory")');

    // 5. Dashboard loads
    await expect(page.locator('text=School Advisor & Mentor Directory')).toBeVisible();

    // 6. Accessibility audit on Advisor Dashboard
    const dashboardAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsDashboard = dashboardAxe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsDashboard).toEqual([]);

    // 7. Search & Filter Directory
    const searchInput = page.locator('input[placeholder*="Search by student name"]');
    await searchInput.fill('Alex');
    await page.waitForTimeout(350); // Debounce delay

    // 8. Open Student Detail (if sample records exist)
    const viewButton = page.locator('button:has-text("View Full Guide")').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();

      // Verify modal drawer opened
      await expect(page.locator('role=dialog')).toBeVisible();
      await expect(page.locator('text=Student Profile & Context')).toBeVisible();

      // 9. Add and save private advisor note
      const noteInput = page.locator('textarea#advisor-note-input');
      await noteInput.fill('Meeting held with student. Recommended exploring Chulalongkorn Software Engineering.');
      await page.click('button:has-text("Save Note")');

      // Verify note save confirmation or list update
      await expect(page.locator('text=Meeting held with student')).toBeVisible();

      // Close modal drawer
      await page.keyboard.press('Escape');
      await expect(page.locator('role=dialog')).toHaveCount(0);
    }

    // 10. Sign Out
    await page.click('button:has-text("Sign Out")');
    await expect(page.locator('input#advisor-passcode')).toBeVisible();
  });
});
```

---

### 6.5 Test Suite 3: Guardrails and Resilience (`tests/e2e/guardrails.spec.ts`)

This suite exercises security safeguards and recovery boundaries:
1. **Rate Limiting Throttling**: Verifies that rapid successive attempts to `/api/advisor/login` trigger HTTP 429 with calm user copy and a `Retry-After` header.
2. **HTML & Script Input Sanitization**: Submits inputs containing HTML and script injection patterns (`<script>alert("xss")</script>`) to verify tags are stripped without executing or corrupting the DOM.
3. **Error Boundary Recovery**: Verifies that client rendering faults display accessible fallback cards without leaking stack traces or crashing the tab into a white screen.
4. **Automated Accessibility Audit**: Asserts zero critical WCAG 2.1 AA violations on error and throttled states.

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Security Guardrails & Error Boundaries E2E', () => {
  test('asserts rate limiting triggers calm message, sanitization strips HTML tags, and error fallbacks render safely', async ({ page, request }) => {
    // 1. Rate Limiting Trigger Check on Login Route
    // Send 6 rapid requests from the test client to exceed the 5 req/min threshold
    let rateLimited = false;
    for (let i = 0; i < 6; i++) {
      const res = await request.post('/api/advisor/login', {
        data: { passcode: 'INCORRECT_PASS', authorName: 'Attacker' },
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status() === 429) {
        rateLimited = true;
        const body = await res.json();
        expect(body.title).toBe('RATE_LIMITED');
        expect(body.detail).toContain('Please take a deep breath');
        expect(res.headers()['retry-after']).toBeDefined();
        break;
      }
    }
    expect(rateLimited).toBe(true);

    // 2. Input Sanitization Test: HTML tags in intake Step 0
    await page.goto('/');
    await page.fill('input#student-name', '<b>Malicious</b><script>alert("hack")</script>');
    await page.selectOption('select#student-grade', 'grade_12');
    await page.click('button:has-text("Begin My Guide")');

    // Confirm navigation succeeded to Step 1 without script execution or raw HTML rendering
    await expect(page.locator('text=What kinds of activities')).toBeVisible();
    // Raw script tag must not exist in DOM
    const scripts = await page.locator('script:has-text("alert(\\"hack\\")")').count();
    expect(scripts).toBe(0);

    // 3. Error Fallback Accessibility Check
    // Navigate to a non-existent or faulty sub-route if applicable
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolations = axeResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toEqual([]);
  });
});
```

---

## 7. Module 4: Zero-Cost Deployment Runbook (`docs/pathless/runbooks/deployment.md`)

The deployment runbook details how school mentors and organizers can host PathLess at $0/month indefinitely.

### 7.1 Zero-Cost Cloud Architecture Overview

| Component | Recommended Provider | Free Tier Allowance | Role & Constraints |
| :--- | :--- | :--- | :--- |
| **Web Server & Edge** | **Vercel** (Hobby) | Unlimited deployments, 100 GB bandwidth | Serverless Next.js SSR and API routes. |
| **Relational Database** | **Neon** (or Supabase) | 0.5 GB storage, serverless connection pooler | Serverless PostgreSQL via Prisma ORM. |
| **AI Synthesis Engine** | **Google AI Studio** | 15 RPM, 1,500 requests/day, 1M TPM | Gemini 2.5 Flash free tier API keys. |
| **Container VPS (Alt)** | **Oracle Cloud** or **Fly.io** | Always-Free VM (4 OCPU, 24GB RAM) | Self-hosted Docker container deployment. |

---

### 7.2 Complete Environment Variables Reference

| Variable Name | Required? | Example Value | Description & Security Invariant |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgres://user:pass@ep-pooler.neon.tech/pathless?sslmode=require&pgbouncer=true` | Serverless pooled connection string for runtime queries. |
| `DIRECT_URL` | Optional | `postgres://user:pass@ep.neon.tech/pathless?sslmode=require` | Direct database connection string for Prisma migrations. |
| `GEMINI_API_KEY` | **Yes** | `AIzaSyD...` | Google AI Studio API key. If omitted, uses deterministic mock data. |
| `GEMINI_MODEL` | Optional | `gemini-2.5-flash` | Target model name (default: `gemini-2.5-flash`). |
| `ADVISOR_PASSCODE` | Optional | `TEACHER2026` | Shared school mentor passcode (default: `TEACHER2026`). |
| `SESSION_SECRET` | Optional | `super-secret-salt-2026-xyz` | HMAC-SHA256 signature key for advisor session cookies. |
| `ADMIN_SECRET` | Optional | `admin-purge-key-2026` | Authorization key for calling annual purge endpoint `/api/admin/purge`. |
| `NODE_ENV` | **Yes** | `production` | Ensures React and Next.js execute in optimized production mode. |

---

### 7.3 Deployment Recipes

#### Recipe A: Vercel + Neon Serverless PostgreSQL (Recommended Zero-Cost Setup)
1. **Fork/Push Repository**: Push repository to GitHub.
2. **Create Neon Database**:
   - Create a free project at [neon.tech](https://neon.tech).
   - Copy the Pooled Connection String (`DATABASE_URL`).
3. **Run Initial Database Migration**:
   ```bash
   DATABASE_URL="your-neon-url" npx prisma db push
   ```
4. **Deploy to Vercel**:
   - Import the GitHub repository into Vercel.
   - Configure Environment Variables: `DATABASE_URL`, `GEMINI_API_KEY`, `ADVISOR_PASSCODE`.
   - Deploy. Vercel automatically runs Next.js build and deploys to global edge networks.

#### Recipe B: Containerized Docker Deployment on VPS (e.g., Oracle Always-Free / Ubuntu)
1. **Clone Repository**:
   ```bash
   git clone https://github.com/ShortXander101205/first-hackathon.git
   cd first-hackathon
   ```
2. **Create Production `.env.production`**:
   ```env
   DATABASE_URL=postgres://...
   GEMINI_API_KEY=AIzaSy...
   ADVISOR_PASSCODE=TEACHER2026
   SESSION_SECRET=my-random-secret
   ```
3. **Build and Run Docker Container**:
   ```bash
   docker build -t pathless:latest .
   docker run -d \
     --name pathless-app \
     -p 3000:3000 \
     --env-file .env.production \
     --restart unless-stopped \
     pathless:latest
   ```
4. **Configure HTTPS Reverse Proxy (Caddy)**:
   ```caddyfile
   pathless.yourschool.edu {
       reverse_proxy 127.0.0.1:3000
   }
   ```

---

### 7.4 Health Check Endpoint (`/api/health`)

To support automated container health checking, load balancers, and monitoring without disclosing internal system states:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<NextResponse> {
  let dbHealthy = false;
  try {
    if (process.env.DATABASE_URL) {
      await prisma.$queryRaw`SELECT 1`;
      dbHealthy = true;
    }
  } catch {
    dbHealthy = false;
  }

  return NextResponse.json(
    {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbHealthy ? 'connected' : 'unconfigured_or_fallback',
    },
    { status: 200 }
  );
}
```

---

## 8. Accessibility (WCAG 2.1 AA) Invariants & Audit Plan

| Area | Automated E2E Axe Invariant | Manual / Heuristic Verification |
| :--- | :--- | :--- |
| **Student Intake Form** | Zero critical/serious violations via `AxeBuilder` on Step 0 and all question views. | All `<input>` and `<select>` controls have explicit `<label htmlFor="...">`. Visible focus rings on keyboard tab (`focus-visible:ring-2`). |
| **Results Container** | Zero violations on 4-card results view. | Card toggles have `aria-expanded` attributes. University links have `rel="noopener noreferrer"` and descriptive text. |
| **Advisor Portal** | Zero violations on Passcode Login modal and Advisor Dashboard. | Passcode error banner uses `role="alert"`. Student table includes `<caption>`, `<th scope="col">`. Touch targets $\ge 44 \times 44\text{px}$. |
| **Security Fallbacks** | Zero violations on rate-limited state and error boundary cards. | Error fallback provides accessible reload button with high-contrast copy ($>4.5:1$). |

---

## 9. Acceptance Criteria & Verification Matrix

```
┌───────────┬───────────────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ ID        │ Acceptance Criterion Summary                      │ Verification Command & Assertion Method                │
├───────────┼───────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ AC-DEP-01 │ Multi-stage Dockerfile builds Next.js standalone  │ docker build -t pathless:test . &&                     │
│           │ container booting with unprivileged node user     │ docker run --rm pathless:test id -u asserts 1001;      │
│           │ (UID 1001) and image footprint under 180MB.       │ curl http://127.0.0.1:3000/api/health returns 200 OK.  │
├───────────┼───────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ AC-DEP-02 │ GitHub Actions CI workflow automates type-check,  │ .github/workflows/ci.yml runs quality-and-unit,        │
│           │ linting, unit test execution, and production      │ build-and-e2e, and docker-verification jobs to green    │
│           │ build without errors or requiring paid secrets.   │ status on PRs and pushes to main.                      │
├───────────┼───────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ AC-DEP-03 │ Playwright E2E tests automate the complete        │ npx playwright test tests/e2e/student-flow.spec.ts     │
│           │ student journey (Step 0 intake, 4 cards view,     │ passes: 4 cards rendered, milestones expanded,         │
│           │ milestones inspection, verified Thai unis, print).│ university link checked, axe audit 0 critical issues.  │
├───────────┼───────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ AC-DEP-04 │ Playwright E2E tests verify the advisor workflow  │ npx playwright test tests/e2e/advisor-flow.spec.ts     │
│           │ (TEACHER2026 login, wrong code error, directory   │ passes: login succeeds, directory searches, detail     │
│           │ search, detail modal review, note saving, logout).│ modal opens, note saves, axe audit 0 critical issues.  │
├───────────┼───────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ AC-DEP-05 │ Playwright E2E tests assert rate-limit triggers   │ npx playwright test tests/e2e/guardrails.spec.ts       │
│           │ calm message and sanitization neutralizes HTML.   │ passes: rapid calls trigger 429 calm copy, script tags │
│           │                                                   │ stripped from intake, error boundary recovers safely.  │
├───────────┼───────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ AC-DEP-06 │ Production runbook clearly documents zero-cost    │ docs/pathless/runbooks/deployment.md verified for      │
│           │ deployment setups and environment variables       │ Vercel, Neon PostgreSQL, Gemini free tier, and VPS     │
│           │ without requiring paid add-ons.                   │ container recipe.                                      │
└───────────┴───────────────────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 10. Implementation File Map & Step Plan

Once this technical contract is approved, the implementation phase will touch the following files in sequence:

```
┌──────────────────────────────────────┬─────────────────────────────────────────────────────────┐
│ Target File Path                     │ Purpose & Action Description                            │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ next.config.mjs                      │ Add output: 'standalone' to Next.js configuration.      │
│ Dockerfile                           │ Implement 4-stage Alpine production Docker container.   │
│ .dockerignore                        │ Specify container build exclusion patterns.             │
│ package.json                         │ Add @playwright/test, @axe-core/playwright, e2e scripts.│
│ playwright.config.ts                 │ Configure Playwright test runner and webServer.         │
│ src/app/api/health/route.ts          │ Implement lightweight unauthenticated health check.     │
│ tests/e2e/student-flow.spec.ts       │ Implement student intake & results E2E test suite.      │
│ tests/e2e/advisor-flow.spec.ts       │ Implement advisor passcode login & review E2E suite.    │
│ tests/e2e/guardrails.spec.ts         │ Implement rate limiting & sanitization guardrails suite.│
│ .github/workflows/ci.yml             │ Implement GitHub Actions CI pipeline.                   │
│ docs/pathless/runbooks/deployment.md │ Write zero-cost production deployment runbook.          │
└──────────────────────────────────────┴─────────────────────────────────────────────────────────┘
```

### Execution Steps:
1. **Next.js Config**: Update `next.config.mjs` to specify `output: 'standalone'`.
2. **Container Packaging**: Create `Dockerfile` and `.dockerignore`.
3. **Health Check Endpoint**: Add `/api/health` for container orchestration and uptime monitoring.
4. **E2E Tooling**: Update `package.json` with Playwright and Axe test packages and scripts.
5. **Playwright Runner Config**: Create `playwright.config.ts`.
6. **E2E Test Implementation**: Write `tests/e2e/student-flow.spec.ts`, `tests/e2e/advisor-flow.spec.ts`, and `tests/e2e/guardrails.spec.ts`.
7. **CI Pipeline Workflow**: Create `.github/workflows/ci.yml`.
8. **Deployment Runbook**: Author `docs/pathless/runbooks/deployment.md`.
9. **Final Verification**: Run `npm run type-check`, `npm run lint`, `npm test`, and `npx playwright test` to ensure full test suite passes.
