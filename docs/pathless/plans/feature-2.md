---
doc: implementation-plan
feature: 2-project-scaffolding
project: PathwayAI - College Major and Career Triage MVP
status: ready-for-execution
gate: PASS
---

# Feature 2: Step-by-Step Implementation Plan
## Project Scaffolding, Educational Theme, Accessible Landmarks & Boilerplate Cleanup

This implementation plan defines the sequential phases required to execute **Feature 2: Project Scaffolding and Educational Theme** on branch `feature/2-project-scaffolding` in accordance with the approved technical contract ([docs/features/2-project-scaffolding/spec.md](file:///d:/Hackathon/Beta_Folder/docs/features/2-project-scaffolding/spec.md)).

---

## 1. Overview of Deliverables & Scaffolding Scope

Feature 2 establishes the web application runtime and design system substrate without implementing downstream UI features (such as the 4-question intake wizard or 4-career card generator).

```
Phase 1: Project Initialization & Dependency Wiring
   ↓
Phase 2: Tailwind CSS Configuration & Educational Token Exports
   ↓
Phase 3: Default Boilerplate Purge & Reset
   ↓
Phase 4: Lucide Icon Registry Integration
   ↓
Phase 5: Accessible Layout Components & Semantic Landmarks
   ↓
Phase 6: Root Layout, Typography & Metadata Integration
   ↓
Phase 7: End-to-End Verification (Build, Tokens, Lint, DOM Hierarchy)
```

---

## 2. Step-by-Step Implementation Roadmap

### Step 1: Initialize Project Configuration & Dependencies
**Target Files**:
- `package.json`
- `tsconfig.json`
- `next.config.mjs`
- `.eslintrc.json`
- `.gitignore`

**Implementation Details**:
1. Create `package.json` with production dependencies (`next@^14.2.13`, `react@^18.3.1`, `react-dom@^18.3.1`, `lucide-react@^0.441.0`, `better-sqlite3@^11.3.0`, `@google/generative-ai@^0.21.0`, `zod@^3.23.8`, `clsx@^2.1.1`, `tailwind-merge@^2.5.2`) and development dependencies (`tailwindcss@^3.4.11`, `postcss@^8.4.47`, `autoprefixer@^10.4.20`, `typescript@^5.6.2`, `eslint@^8.57.0`, `eslint-config-next@^14.2.13`, type definition packages).
2. Configure standard scripts:
   - `"dev": "next dev"`
   - `"build": "next build"`
   - `"start": "next start"`
   - `"lint": "next lint"`
   - `"type-check": "tsc --noEmit"`
3. Configure `tsconfig.json` with strict TypeScript settings (`"strict": true`, `"moduleResolution": "bundler"`, `"jsx": "preserve"`) and the path alias `"@/*": ["./src/*"]`.
4. Configure `next.config.mjs` setting `serverComponentsExternalPackages: ['better-sqlite3']` to prevent Webpack native addon bundling errors, and disable `poweredByHeader`.
5. Configure `.eslintrc.json` extending `next/core-web-vitals`.
6. Run `npm install` to populate `node_modules` and generate `package-lock.json`.

**Mapped Acceptance Criteria**:
- **AC-F2-01** (Build Verification foundation)
- **AC-F2-03** (Zero Lint Warnings configuration)

---

### Step 2: Configure Tailwind CSS & Educational Design Tokens
**Target Files**:
- `postcss.config.js`
- `tailwind.config.ts`
- `src/lib/tokens.ts`
- `src/lib/utils.ts`
- `src/app/globals.css`

**Implementation Details**:
1. Create `postcss.config.js` with `tailwindcss` and `autoprefixer`.
2. Create `src/lib/tokens.ts` exporting typed token constants:
   - `tokens.semantic`:
     - `primary`: `#1E3A8A`
     - `interactive`: `#2563EB`
     - `background`: `#F8FAFC`
     - `text`: `#0F172A`
   - `tokens.colors.blue`: full 50–950 scale
   - `tokens.colors.slate`: full 50–950 scale
   - `tokens.colors.reassurance`, `friction`, `growth`
   - `tokens.radii`
3. Create `src/lib/utils.ts` with `cn()` utility function combining `clsx` and `tailwind-merge`.
4. Configure `tailwind.config.ts` mapping:
   - Direct semantic aliases (`edu-primary`, `edu-interactive`, `edu-bg`, `edu-text`)
   - Full scales (`edu-blue`, `edu-slate`)
   - Diagnostic tints (`reassurance`, `friction`, `growth`)
   - Border radius extensions (`edu-sm`, `edu-md`, `edu-lg`, `edu-xl`, `edu-2xl`)
   - Font family pointing to `var(--font-inter)`
5. Create `src/app/globals.css` declaring `@tailwind base; @tailwind components; @tailwind utilities;` and defining all `:root` CSS custom properties.

**Mapped Acceptance Criteria**:
- **AC-F2-02** (CSS Token Exports & Palette)

---

### Step 3: Default Boilerplate Purge & Reset
**Target Actions**:
- Inspect `public/` and delete `vercel.svg` and `next.svg` if present.
- Ensure `src/app/page.module.css` does not exist.
- Ensure `src/app/globals.css` does not contain Next.js starter dark-mode media queries (`@media (prefers-color-scheme: dark)`) or radial gradient styling.
- Create a minimal, clean placeholder `src/app/page.tsx` replacing Next.js starter documentation cards.

**Mapped Acceptance Criteria**:
- **AC-F2-06** (Purged Starter Boilerplate)

---

### Step 4: Lucide Icon Registry Integration
**Target Files**:
- `src/components/ui/icons.tsx`

**Implementation Details**:
1. Create `src/components/ui/icons.tsx` importing required icons from `lucide-react`:
   - Brand & Academic: `Compass`, `GraduationCap`, `BookOpen`, `Users`
   - 4-Career Archetypes: `Sparkles` (Direct Match), `TrendingUp` (High-Growth), `GitFork` (Interdisciplinary), `Rocket` (Moonshot)
   - Triage Diagnostics: `AlertCircle` (Friction Alert), `CheckCircle2` (Verified Course), `Clock` (Duration), `ExternalLink`, `ArrowRight`, `ChevronRight`
   - Counselor Dashboard: `ShieldCheck`, `Search`, `Filter`
2. Export the typed `Icons` registry object and `IconProps` interface.
3. Enforce default accessibility standards (`aria-hidden="true"`, `size={20}`, `strokeWidth={1.75}`).

**Mapped Acceptance Criteria**:
- **AC-F2-04** (Lucide Icon Integration)

---

### Step 5: Shared Layout Components with Accessible Landmark Elements
**Target Files**:
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Container.tsx`

**Implementation Details**:
1. `src/components/layout/Header.tsx`:
   - Landmark: `<header role="banner" className="sticky top-0 z-50 border-b border-edu-slate-200 bg-white/80 backdrop-blur-md">`
   - PathwayAI logo linking to `/` using `Icons.academic` and bold scholastic typography.
   - Semantic navigation (`<nav aria-label="Main Navigation">`) with links to "Student Triage" (`/`) and "Counselor Dashboard" (`/counselor`).
   - Free-tier rate guard status indicator (`Gemini 1.5 Flash • 15 RPM Guard`) with a subtle green pulse dot.
2. `src/components/layout/Footer.tsx`:
   - Landmark: `<footer role="contentinfo" className="border-t border-edu-slate-200 bg-edu-slate-100 py-8">`
   - Calming reassurance microcopy: *"Designed to turn college major dread into structured, confident exploration."*
   - Zero-cost architecture statement: *"Built strictly for the Google AI Studio zero-cost tier using local SQLite storage."*
   - Version & hackathon attribution tags.
3. `src/components/layout/Container.tsx`:
   - Reusable layout wrapper enforcing `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full`.
   - Supports polymorphic semantic elements (`as?: 'div' | 'section' | 'article' | 'main'`).

**Mapped Acceptance Criteria**:
- **AC-F2-05** (Shared Layout Shell & Accessible Landmarks)

---

### Step 6: Root Layout, Typography & Metadata Integration
**Target Files**:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/counselor/page.tsx`
- `src/app/api/health/route.ts`

**Implementation Details**:
1. `src/app/layout.tsx`:
   - Load `Inter` font via `next/font/google` (`subsets: ['latin']`, `display: 'swap'`, `variable: '--font-inter'`).
   - Export root `Metadata` object with dynamic title template (`%s | PathwayAI`), description, OpenGraph tags, and Twitter cards.
   - Export `Viewport` with theme color `#1E3A8A`.
   - Include skip-to-content accessibility link: `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to content</a>`.
   - Render `<Header />`, `<main id="main-content" className="flex-1">`, and `<Footer />`.
2. `src/app/page.tsx`:
   - Minimal student triage entry placeholder with calm welcoming copy and CTA to launch intake.
3. `src/app/counselor/page.tsx`:
   - Minimal counselor triage dashboard placeholder shell with navigation back to student triage.
4. `src/app/api/health/route.ts`:
   - Implement liveness endpoint returning system status and zero-cost free-tier confirmation conforming to `api-spec.md`.

**Mapped Acceptance Criteria**:
- **AC-F2-01** (Build Verification)
- **AC-F2-05** (Shared Layout Shell)
- **AC-F2-06** (Root Metadata & Typography)

---

### Step 7: Verification & Acceptance Testing
**Target Execution**:
1. Run `npm run type-check`: Confirm TypeScript compilation without errors across all files.
2. Run `npm run lint`: Confirm ESLint passes with 0 errors and 0 warnings.
3. Run `npm run build`: Confirm Next.js production build succeeds, generating static route artifacts (`/`, `/counselor`, `/api/health`).
4. Inspect CSS tokens in browser / unit script to verify `#1E3A8A`, `#2563EB`, `#F8FAFC`, and `#0F172A` values.
5. Verify HTML DOM output contains `<header>`, `<main id="main-content">`, `<footer>`, skip-to-content link, and correct meta tags.

**Mapped Acceptance Criteria**:
- **AC-F2-01** through **AC-F2-06**

---

## 3. Acceptance Criteria Traceability Matrix

| Step ID | Implementation Step | Primary Artifacts Created / Modified | Mapped Acceptance Criteria |
|---|---|---|---|
| **Step 1** | Project Initialization & Dependencies | `package.json`, `tsconfig.json`, `next.config.mjs`, `.eslintrc.json` | **AC-F2-01**, **AC-F2-03** |
| **Step 2** | Tailwind CSS Configuration & Tokens | `tailwind.config.ts`, `postcss.config.js`, `src/app/globals.css`, `src/lib/tokens.ts`, `src/lib/utils.ts` | **AC-F2-02** |
| **Step 3** | Boilerplate Cleanup & Reset | `public/`, `src/app/page.tsx`, `src/app/globals.css` | **AC-F2-06** |
| **Step 4** | Lucide Icon Registry | `src/components/ui/icons.tsx` | **AC-F2-04** |
| **Step 5** | Shared Layout & Accessible Landmarks | `src/components/layout/Header.tsx`, `Footer.tsx`, `Container.tsx` | **AC-F2-05** |
| **Step 6** | Root Layout, Typography & Metadata | `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/counselor/page.tsx`, `src/app/api/health/route.ts` | **AC-F2-01**, **AC-F2-05**, **AC-F2-06** |
| **Step 7** | Quality Gate & Build Verification | Build artifacts, linter execution, type-checker execution | **AC-F2-01**, **AC-F2-02**, **AC-F2-03**, **AC-F2-04**, **AC-F2-05**, **AC-F2-06** |

---

## 4. Next Actions
Upon approval of this implementation plan, proceed sequentially through Steps 1 through 7, committing each phase with descriptive conventional commits and verifying quality gates.
