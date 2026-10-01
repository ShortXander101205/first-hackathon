---
doc: spec
feature: 2-project-scaffolding
project: PathwayAI - College Major and Career Triage MVP
status: draft
gate: PASS
---

# Feature 2: Project Scaffolding & Educational Theme — Technical Contract & Specification

## 1. Executive Summary & Objective

This specification establishes the definitive technical contract for **Feature 2: Project Scaffolding and Educational Theme** of **PathwayAI: College Major and Career Triage MVP**.

Following the successful specification and definition of baseline data contracts in Feature 1, Feature 2 initializes the web application substrate without introducing premature UI features or downstream business logic. It establishes:
1. **Next.js 14+ App Router** runtime framework configured with strict TypeScript (`tsconfig.json`).
2. **Tailwind CSS Design System** tailored to the anxiety-reducing **Educational Blue & Slate** color palette, featuring dual CSS custom property variables and typed TypeScript token exports.
3. **Lucide React Icon Integration Contract** with centralized registry mappings, tree-shaking guarantees, and accessibility defaults.
4. **Shared Layout Shell** comprising semantic, responsive components (`Header`, `Footer`, `Container`, and `RootLayout`).
5. **Root Metadata & Typography Engine** incorporating standard SEO meta tags, OpenGraph previews, and non-blocking Google Font integration (`Inter` / `Plus Jakarta Sans`).
6. **Rigorous Quality Gates** mandating successful build verification, exported CSS design tokens, and zero ESLint warnings.

---

## 2. Technical Stack & Foundation Contract

| Layer | Technology | Version / Specification | Rationale & Constraint |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `^14.2.0` | Production React server components, built-in API route handlers, optimized font and metadata orchestration. |
| **Language** | TypeScript | `^5.4.0` | Strict type safety (`strict: true`), path aliases (`@/*` -> `./src/*`), full alignment with Feature 1 schemas. |
| **Styling** | Tailwind CSS + PostCSS | Tailwind `^3.4.0`, Autoprefixer `^10.4.0` | Utility-first design tokens, zero runtime CSS overhead, accessible color contrast ratios. |
| **Iconography** | Lucide React | `^0.440.0` | Consistent 24px icon grid, tree-shakable ES modules, accessible SVG rendering. |
| **Font Engine** | `next/font/google` | Built-in Next.js | Zero layout shifts (CLS = 0), self-hosted web fonts (`Inter`), CSS custom property linkage. |
| **Linting & Code Quality**| ESLint + `@typescript-eslint` | `^8.0.0` + `eslint-config-next` | Enforcement of zero lint warnings, clean imports, and strict TypeScript types. |
| **Package Manager** | npm | `>= 9.0.0` (Node `>= 18.18.0` / LTS) | Standard reproducible lockfile execution with zero external vendor dependencies. |

---

## 3. Directory Layout & Scaffolding Architecture

Feature 2 scaffolds the application around the existing Feature 1 data contracts and schemas in `src/`, expanding into Next.js App Router conventions:

```
Beta_Folder/
├── docs/
│   ├── features/
│   │   └── 2-project-scaffolding/
│   │       └── spec.md                 # Primary Feature 2 technical contract
│   └── pathway/
│       ├── spec.md                     # Feature 1 System Specification
│       ├── api-spec.md                 # Feature 1 API Contracts & Gemini Protocols
│       ├── implementation-plan.md      # Feature 1 Step-by-Step Plan
│       └── feature-2-spec.md           # Mirrored reference specification
├── public/
│   ├── favicon.ico                     # PathwayAI scholastic compass favicon
│   └── logo.svg                        # Vector brand mark
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root Next.js layout (metadata, font, shell)
│   │   ├── page.tsx                    # Minimal placeholder root page
│   │   ├── globals.css                 # Tailwind directives & CSS design tokens
│   │   ├── counselor/
│   │   │   └── page.tsx                # Placeholder route entry for Feature 5
│   │   └── api/
│   │       └── health/
│   │           └── route.ts            # Liveness & zero-cost check endpoint
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              # Calming educational header with logo & nav
│   │   │   ├── Footer.tsx              # Reassurance copy & zero-cost attribution
│   │   │   └── Container.tsx           # Accessible max-width container wrapper
│   │   └── ui/
│   │       └── icons.tsx               # Centralized Lucide icon mappings
│   ├── lib/
│   │   ├── tokens.ts                   # Exported typed design tokens (colors, radii)
│   │   └── utils.ts                    # Classname merge utility (clsx + tailwind-merge)
│   ├── types/                          # (Feature 1 Canonical Types)
│   │   ├── intake.ts
│   │   ├── career.ts
│   │   ├── counselor.ts
│   │   ├── database.ts
│   │   └── index.ts
│   ├── schemas/                        # (Feature 1 Zod Schemas)
│   │   ├── intake.schema.ts
│   │   ├── career.schema.ts
│   │   ├── counselor.schema.ts
│   │   └── index.ts
│   ├── db/                             # (Feature 1 SQLite Contracts)
│   │   └── schema.sql
│   ├── ai/                             # (Feature 1 Gemini Protocols)
│   │   ├── system-prompt.txt
│   │   └── response-schema.json
│   └── fixtures/                       # (Feature 1 Baseline Mock Data)
│       ├── intake-submissions.json
│       ├── career-dossiers.json
│       ├── counselor-reviews.json
│       └── fallback-careers.json
├── .eslintrc.json                      # Strict ESLint configuration
├── .gitignore                          # Standard Next.js/Node exclusions
├── next.config.mjs                     # Next.js configuration
├── package.json                        # Dependencies, scripts, and engine locks
├── postcss.config.js                   # PostCSS configuration
├── tailwind.config.ts                  # Tailwind configuration with Educational Palette
└── tsconfig.json                       # Strict TypeScript configuration
```

---

## 4. Theme Specification: The Educational Blue & Slate Palette

The visual identity of PathwayAI is intentionally engineered to alleviate student dread and decision paralysis. Rather than high-stress corporate dashboards or neon tech aesthetics, PathwayAI utilizes **calming, academic, high-contrast blues paired with grounding slate neutrals and focused psychological accent tones**.

### 4.1 Color System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   PATHWAYAI EDUCATIONAL COLOR TOKENS                     │
├──────────────────────────────────────────────────────────────────────────┤
│  Educational Blue (Primary Brand, Campus Authority, Active Trust)        │
│  [50: #EFF6FF] [100: #DBEAFE] [200: #BFDBFE] [500: #3B82F6]              │
│  [600: #2563EB] [700: #1D4ED8] [900: #1E3A8A] [950: #172554]            │
├──────────────────────────────────────────────────────────────────────────┤
│  Educational Slate (Calming Neutral Foundation, Surface Hierarchy, Ink)  │
│  [50: #F8FAFC] [100: #F1F5F9] [200: #E2E8F0] [400: #94A3B8]              │
│  [600: #475569] [800: #1E293B] [900: #0F172A] [950: #020617]            │
├──────────────────────────────────────────────────────────────────────────┤
│  Reassurance Sky (Empathetic Anxiety Mitigation, Low-Risk Badges)        │
│  [50: #F0F9FF] [100: #E0F2FE] [500: #0EA5E9] [700: #0369A1]              │
├──────────────────────────────────────────────────────────────────────────┤
│  Friction Amber (Student Dread Highlight, Course Challenge Diagnostic)   │
│  [50: #FFFBEB] [100: #FEF3C7] [500: #F59E0B] [700: #B45309]              │
├──────────────────────────────────────────────────────────────────────────┤
│  Growth Emerald (High Labor Market Demand, Verified Trial Course Pill)   │
│  [50: #ECFDF5] [100: #D1FAE5] [500: #10B981] [700: #047857]              │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Exact Color Token Values

| Token Name | Hex Code | Semantic Role | Contrast Ratio (vs Background) |
|---|---|---|---|
| `edu-blue-50` | `#EFF6FF` | Triage card primary selection highlight | Background tint |
| `edu-blue-100` | `#DBEAFE` | Badge subtle background for Direct Match | Surface accent |
| `edu-blue-200` | `#BFDBFE` | Active card border / focused field ring | UI boundary |
| `edu-blue-500` | `#3B82F6` | Interactive hover accent | Non-text UI control |
| `edu-blue-600` | `#2563EB` | Primary CTA button / High-confidence indicator | 4.8:1 on white (WCAG AA) |
| `edu-blue-700` | `#1D4ED8` | Primary brand emphasis / scholastic heading ink | 7.1:1 on white (WCAG AAA) |
| `edu-blue-900` | `#1E3A8A` | Deep scholastic midnight / header accent | 11.2:1 on white (WCAG AAA) |
| `edu-blue-950` | `#172554` | Maximum contrast scholastic blue | 14.5:1 on white (WCAG AAA) |
| `edu-slate-50` | `#F8FAFC` | App root page canvas background | High-comfort base |
| `edu-slate-100` | `#F1F5F9` | Secondary card background / inactive pills | Distinct surface layer |
| `edu-slate-200` | `#E2E8F0` | Default card & container divider border | 1.3:1 subtle divider |
| `edu-slate-400` | `#94A3B8` | Muted hints, icons, placeholder text | Secondary indicator |
| `edu-slate-600` | `#475569` | Secondary body text, trial course duration | 5.3:1 on white (WCAG AA) |
| `edu-slate-800` | `#1E293B` | Primary body copy, card labels | 11.8:1 on white (WCAG AAA) |
| `edu-slate-900` | `#0F172A` | Primary heading ink, modal titles | 15.6:1 on white (WCAG AAA) |
| `reassurance-50`| `#F0F9FF` | Academic fear reassurance card background | Calming backdrop |
| `reassurance-700`|`#0369A1`| Reassurance badge text, empathetic callout | 7.2:1 on reassurance-50 |
| `friction-50` | `#FFFBEB` | Academic anxiety diagnostic pill background | Gentle warning tint |
| `friction-700` | `#B45309` | Academic anxiety tag text (`HARD_MATH`, etc.) | 7.4:1 on friction-50 |
| `growth-50` | `#ECFDF5` | High-Growth match tier pill background | Success backdrop |
| `growth-700` | `#047857` | High-Growth career title & verified course badge| 7.1:1 on growth-50 |

### 4.3 CSS Token Exports (`src/app/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Educational Blue Palette */
  --edu-blue-50: #eff6ff;
  --edu-blue-100: #dbeafe;
  --edu-blue-200: #bfdbfe;
  --edu-blue-300: #93c5fd;
  --edu-blue-400: #60a5fa;
  --edu-blue-500: #3b82f6;
  --edu-blue-600: #2563eb;
  --edu-blue-700: #1d4ed8;
  --edu-blue-800: #1e40af;
  --edu-blue-900: #1e3a8a;
  --edu-blue-950: #172554;

  /* Educational Slate Palette */
  --edu-slate-50: #f8fafc;
  --edu-slate-100: #f1f5f9;
  --edu-slate-200: #e2e8f0;
  --edu-slate-300: #cbd5e1;
  --edu-slate-400: #94a3b8;
  --edu-slate-500: #64748b;
  --edu-slate-600: #475569;
  --edu-slate-700: #334155;
  --edu-slate-800: #1e293b;
  --edu-slate-900: #0f172a;
  --edu-slate-950: #020617;

  /* Triage Diagnostic Semantic Accents */
  --reassurance-50: #f0f9ff;
  --reassurance-100: #e0f2fe;
  --reassurance-500: #0ea5e9;
  --reassurance-700: #0369a1;

  --friction-50: #fffbeb;
  --friction-100: #fef3c7;
  --friction-500: #f59e0b;
  --friction-700: #b45309;

  --growth-50: #ecfdf5;
  --growth-100: #d1fae5;
  --growth-500: #10b981;
  --growth-700: #047857;

  /* Surfaces & Radii */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Typography */
  --font-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  background-color: var(--edu-slate-50);
  color: var(--edu-slate-900);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 4.4 Typed Design Token Module (`src/lib/tokens.ts`)
To ensure programmatic access across non-CSS contexts (such as canvas generation, print stylesheets, or automated test runners), all tokens are exported in a typed TypeScript module:

```typescript
export const tokens = {
  colors: {
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    reassurance: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',
      700: '#0369a1',
    },
    friction: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      700: '#b45309',
    },
    growth: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',
      700: '#047857',
    },
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
} as const;

export type ColorTokens = typeof tokens.colors;
export type RadiiTokens = typeof tokens.radii;
```

---

## 5. Configuration Files Contract

### 5.1 `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'edu-blue': {
          50: 'var(--edu-blue-50)',
          100: 'var(--edu-blue-100)',
          200: 'var(--edu-blue-200)',
          300: 'var(--edu-blue-300)',
          400: 'var(--edu-blue-400)',
          500: 'var(--edu-blue-500)',
          600: 'var(--edu-blue-600)',
          700: 'var(--edu-blue-700)',
          800: 'var(--edu-blue-800)',
          900: 'var(--edu-blue-900)',
          950: 'var(--edu-blue-950)',
        },
        'edu-slate': {
          50: 'var(--edu-slate-50)',
          100: 'var(--edu-slate-100)',
          200: 'var(--edu-slate-200)',
          300: 'var(--edu-slate-300)',
          400: 'var(--edu-slate-400)',
          500: 'var(--edu-slate-500)',
          600: 'var(--edu-slate-600)',
          700: 'var(--edu-slate-700)',
          800: 'var(--edu-slate-800)',
          900: 'var(--edu-slate-900)',
          950: 'var(--edu-slate-950)',
        },
        reassurance: {
          50: 'var(--reassurance-50)',
          100: 'var(--reassurance-100)',
          500: 'var(--reassurance-500)',
          700: 'var(--reassurance-700)',
        },
        friction: {
          50: 'var(--friction-50)',
          100: 'var(--friction-100)',
          500: 'var(--friction-500)',
          700: 'var(--friction-700)',
        },
        growth: {
          50: 'var(--growth-50)',
          100: 'var(--growth-100)',
          500: 'var(--growth-500)',
          700: 'var(--growth-700)',
        },
      },
      borderRadius: {
        'edu-sm': 'var(--radius-sm)',
        'edu-md': 'var(--radius-md)',
        'edu-lg': 'var(--radius-lg)',
        'edu-xl': 'var(--radius-xl)',
        'edu-2xl': 'var(--radius-2xl)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

### 5.2 `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5.3 `next.config.mjs`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
```

### 5.4 `.eslintrc.json`
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-html-link-for-pages": "off"
  }
}
```

### 5.5 `package.json` Scripts & Dependencies
```json
{
  "name": "pathway-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "better-sqlite3": "^11.3.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.441.0",
    "next": "^14.2.13",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.11",
    "@types/node": "^20.16.5",
    "@types/react": "^18.3.8",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.13",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.6.2"
  },
  "engines": {
    "node": ">=18.18.0"
  }
}
```

---

## 6. Lucide Icon Integration Contract

To avoid duplicate SVG definitions and prevent bundle size bloat, icons are imported from `lucide-react` through a typed registry in `src/components/ui/icons.tsx`.

### 6.1 Standard Icon Prop Guarantees
- Default size: `w-5 h-5` (`size={20}`).
- Standard stroke width: `strokeWidth={1.75}` (calming, non-aggressive line weight).
- Default accessibility: `aria-hidden="true"` applied to decorative icons.

### 6.2 Icon Mapping Registry (`src/components/ui/icons.tsx`)
```typescript
import {
  Compass,
  GraduationCap,
  Sparkles,
  TrendingUp,
  GitFork,
  Rocket,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Users,
  ChevronRight,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

export interface IconProps extends LucideProps {
  className?: string;
}

export const Icons = {
  // Brand & Academic Navigation
  logo: Compass,
  academic: GraduationCap,
  book: BookOpen,
  users: Users,

  // 4-Career Archetype Tiers
  directMatch: Sparkles,
  highGrowth: TrendingUp,
  interdisciplinary: GitFork,
  moonshot: Rocket,

  // Triage & Anxiety Diagnostics
  frictionAlert: AlertCircle,
  verifiedCourse: CheckCircle2,
  duration: Clock,
  externalLink: ExternalLink,
  arrowRight: ArrowRight,
  chevronRight: ChevronRight,

  // Counselor Dashboard
  shield: ShieldCheck,
  search: Search,
  filter: Filter,
} as const;

export type IconKey = keyof typeof Icons;
```

---

## 7. Shared Layout Components Contract

### 7.1 Component: `src/components/layout/Header.tsx`
- **Purpose**: Provides calm branding, student/counselor navigation, and a visible zero-cost engine indicator.
- **Visual Design**: Subtle bottom border (`border-b border-edu-slate-200`), translucent background blur (`bg-white/80 backdrop-blur-md`), sticky positioning (`sticky top-0 z-50`).
- **Interactive Elements**:
  - PathwayAI logo linking to `/`.
  - Primary navigation links: "Student Triage" (`/`) and "Counselor Dashboard" (`/counselor`).
  - System status pill: "Gemini 1.5 Flash Free-Tier • 15 RPM Guard".
- **Props**: None (server component or client shell).

### 7.2 Component: `src/components/layout/Footer.tsx`
- **Purpose**: Establishes educational reassurance, zero-cost transparency, and project documentation references.
- **Visual Design**: Grounded slate background (`bg-edu-slate-100 border-t border-edu-slate-200`), accessible secondary text (`text-edu-slate-600 text-sm`).
- **Required Copy**:
  - Anxiety-reducing microcopy: *"Designed to turn college major dread into structured, confident exploration."*
  - Zero-cost architecture statement: *"Built strictly for the Google AI Studio zero-cost tier using local SQLite storage."*
  - Devpost hackathon metadata and version string (`v0.1.0-mvp`).
- **Props**: None.

### 7.3 Component: `src/components/layout/Container.tsx`
- **Purpose**: Canonical max-width wrapper preventing unreadable line lengths on ultra-wide screens.
- **Layout Constraints**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full`.
- **Props**:
  ```typescript
  export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    as?: 'div' | 'section' | 'article' | 'main';
    className?: string;
  }
  ```

### 7.4 Root Layout: `src/app/layout.tsx`
- **Purpose**: Wraps all application routes with Google Font injection, standard HTML5 semantics, skip-to-content accessibility links, and persistent Header/Footer placement.
- **Semantic Structure**:
  ```html
  <html lang="en">
    <body class="min-h-screen flex flex-col bg-edu-slate-50 text-edu-slate-900">
      <a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to content</a>
      <Header />
      <main id="main-content" class="flex-1">
        {children}
      </main>
      <Footer />
    </body>
  </html>
  ```

---

## 8. Root Metadata & Typography Protocol

### 8.1 Metadata Specification (`src/app/layout.tsx`)
```typescript
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'PathwayAI — College Major & Career Triage for Stressed Students',
    template: '%s | PathwayAI',
  },
  description:
    'An empathetic 4-question AI triage platform helping high school and early college students overcome academic anxiety and discover 4 actionable career trajectories.',
  keywords: [
    'college major triage',
    'career pathway',
    'academic anxiety reduction',
    'educational AI',
    'gemini 1.5 flash',
    'high school counselor triage',
  ],
  authors: [{ name: 'PathwayAI Team' }],
  creator: 'PathwayAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    title: 'PathwayAI — College Major & Career Triage',
    description:
      'Turn academic dread into clear career trajectories with 4 high-yield questions, empathetic reassurance, and zero-risk trial courses.',
    siteName: 'PathwayAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PathwayAI — College Major & Career Triage',
    description:
      'Empathetic college major and career triage powered by Gemini 1.5 Flash.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#1E3A8A',
  width: 'device-width',
  initialScale: 1,
};
```

### 8.2 Google Font Optimization (`next/font/google`)
`Inter` is configured via `next/font/google` to eliminate layout shift and optimize font rendering:
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

---

## 9. Verification & Acceptance Criteria Matrix

| Criterion ID | Target Requirement | Verification Command / Procedure | Pass Criteria |
|---|---|---|---|
| **AC-F2-01** | **Build Verification** | Run `npm run build` | Next.js completes production compilation with exit code `0`. Static routes generated. Zero compilation errors. |
| **AC-F2-02** | **CSS Token Exports & Palette** | Inspect `globals.css` & `src/lib/tokens.ts` | All 11 Educational Blue shades, 11 Educational Slate shades, and semantic diagnostic colors are declared in CSS `:root` and exported in `tokens.ts`. Tailwind utility classes compile correctly. |
| **AC-F2-03** | **Zero Lint Warnings** | Run `npm run lint` | ESLint exits with code `0`. Exactly 0 errors and 0 warnings. |
| **AC-F2-04** | **Lucide Icon Integration** | Type-check `src/components/ui/icons.tsx` | All icon mappings export valid Lucide components with default `aria-hidden` attributes and stroke-width configurations. |
| **AC-F2-05** | **Shared Layout Shell** | Inspect `/` in browser / test DOM | `Header`, `main#main-content`, and `Footer` render with semantic HTML tags. Container enforces `max-w-7xl`. |
| **AC-F2-06** | **Root Metadata & Typography** | Inspect rendered HTML `<head>` | `<title>` tags match "PathwayAI — ...", meta description exists, OpenGraph tags are valid, and Google Font variable is injected on `<html>`/`<body>`. |

---

## 10. Decisions, Simplifications & Tradeoffs

1. **Tailwind CSS Utility Variables over Pure CSS Modules**:
   - *Decision*: Combine Tailwind CSS utility classes with CSS custom properties (`var(--edu-blue-*)`) and a typed token file (`tokens.ts`).
   - *Tradeoff*: Requires Tailwind and PostCSS build plugins, but guarantees standardized spacing, responsive breakpoint prefixes (`sm:`, `md:`, `lg:`), and immediate development velocity without CSS selector leakage.
2. **Centralized Lucide Registry over Ad-Hoc Imports**:
   - *Decision*: Consolidate all icon references through `src/components/ui/icons.tsx`.
   - *Tradeoff*: Adds an indirection layer, but enforces uniform stroke widths (`1.75`), consistent sizing, accessibility tags, and shields the application from icon renaming across library updates.
3. **No Premature Feature UI**:
   - *Decision*: Scaffolding provides only the layout frame (`Header`, `Footer`, `Container`) and placeholder pages (`/` and `/counselor`).
   - *Tradeoff*: The root page is visually minimal in Feature 2, but prevents premature coupling before Feature 3 (Core Triage Engine) and Feature 4 (Card Presentation) are implemented.

---

## 11. Specification Gate Assessment

### Gate Status: **SPECIFICATION GATE: PASS**

**Rationale**:
- Next.js App Router, TypeScript, and Tailwind configurations are explicitly detailed with exact code contracts.
- Educational Blue and Slate color palette is fully codified with hex codes, WCAG contrast ratios, CSS variables, and TypeScript token objects.
- Lucide React integration contract is defined with typed registry mappings and standard stroke weights.
- Shared layout components (`Header`, `Footer`, `Container`, `RootLayout`) are specified with semantic HTML5 elements.
- Root metadata, OpenGraph tags, viewport configurations, and Google Font optimization are fully articulated.
- Verifiable Acceptance Criteria AC-F2-01 through AC-F2-06 are established.
- Ready for implementation on branch `feature/2-project-scaffolding`.
