---
doc: contract
feature: 6-dossier-card-ui
project: PathwayAI - College Major and Career Triage MVP
status: approved
gate: PASS
---

# Feature 6: Recommendation Dossier UI — Technical Contract & Specification

## 1. Executive Summary & Objective

This specification establishes the technical, visual, behavioral, and accessibility contract for **Feature 6: Recommendation Dossier UI** of **PathwayAI: College Major and Career Triage MVP** on branch `feature/6-dossier-card-ui`.

Feature 6 bridges the server-side AI synthesis engine finalized in Feature 5 (`POST /api/triage`) with an empathetic, state-of-the-art presentation layer. Designed specifically for anxious 17–19 year old high school juniors/seniors and early college undergraduates experiencing acute major and career indecision, this interface transforms raw AI triage results into an intuitive, inspiring, and grounding **Recommendation Dossier**.

Rather than confronting the student with intimidating psychometric scores, dense job-market jargon, or endless lists of careers, Feature 6 presents **exactly 4 distinct career cards** arranged in a responsive 2x2 grid on desktop (and single-column stack on mobile). Each card balances aspirational ambition with concrete day-to-day task realities, directly mitigates academic dread through empathetic reassurance, and offers zero-cost, low-stakes exploratory trial courses.

### Primary Objectives
1. **DossierContainer Responsive Grid Layout**: Implement a structured layout rendering a 2x2 grid on desktop viewports (`lg:grid-cols-2`) and a single-column stack on mobile viewports (`grid-cols-1`), preceded by a personalized student archetype banner.
2. **CareerCard Component**: Render role title, match tier badge with tier-specific accent styling, fit score indicator, fit rationale, and related college majors and complementary minors.
3. **RealityCheckSection**: Contrast what professionals actually do on a typical day (at least 3 tasks) against common student misconceptions (1–2 debunked myths) in a clear, anxiety-reducing visual treatment.
4. **CourseChallengeAndReassurance Section**: Present authentic academic hurdles (tough college courses) paired with compassionate, actionable reassurance directly addressing the student's stated dread from Question 2.
5. **TrialCoursesBadgeList**: Render exactly 2 foundational exploratory courses as interactive/informative pill badges showing title, provider, estimated hours, description, and a zero-cost indicator.
6. **SynthesisLoadingView**: Provide an animated, reassuring status state while awaiting AI generation, cycling progressive calming messages with full screen-reader live region announcements.
7. **MockNoticeBanner**: Display a clear, reassuring badge/banner when `meta.fallback_used` is true, preserving user trust and 100% demo uptime without alarmist phrasing.
8. **NavigationFooter**: Deliver an accessible footer with a "Start Over" action that triggers the reset confirmation dialog, clears session data, and returns the student to Question 1 with a clean slate.
9. **100% Centralized Calm Copy (`src/constants/dossierCopy.ts`)**: Require all user-facing text, section titles, reassuring helper notes, course badges, and button labels to live strictly in `dossierCopy.ts` in a calm, plain tone tailored for an anxious 17–19 year old.
10. **Numbered Acceptance Criteria**: Establish criteria **AC-DOSSIER-01** through **AC-DOSSIER-08** for downstream implementation and testing.

---

## 2. Scope & Boundary Clarifications

To protect architectural boundaries and ensure clean delivery, Feature 6 is strictly confined to frontend presentation components, responsive layouts, copy centralization, client-side triage loading/display states, and accessibility compliance.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             FEATURE 6 BOUNDARY MAP                               │
├──────────────────────────────────────┬───────────────────────────────────────────┤
│          IN SCOPE (Feature 6)        │       DEFERRED (Downstream Features)      │
├──────────────────────────────────────┼───────────────────────────────────────────┤
│ • DossierContainer responsive grid   │ • Editing server synthesis routes         │
│   (2x2 desktop, 1-col mobile)        │   (POST /api/triage frozen in Feature 5)  │
│ • CareerCard presentation component  │ • Saving records to PostgreSQL / Supabase │
│ • RealityCheckSection (tasks vs myth)│   (Deferred to feature/7-counselor-db)    │
│ • CourseChallengeAndReassurance      │ • Safety keyword banner overrides & 988   │
│ • TrialCoursesBadgeList (2 badges)   │   (Deferred to feature/8-safety-hardening)│
│ • SynthesisLoadingView (animated)    │ • Counselor dashboard UI & annotations    │
│ • MockNoticeBanner (fallback badge)  │   (Deferred to feature/7-counselor-db)    │
│ • NavigationFooter (Start Over)      │ • User accounts, login, or student auth   │
│ • Copy in constants/dossierCopy.ts   │   (Deferred to Post-MVP)                  │
│ • WCAG 2.1 AA touch targets & a11y   │ • Emailing PDF summaries to students      │
└──────────────────────────────────────┴───────────────────────────────────────────┘
```

### Explicitly In Scope for Feature 6
- **Presentation Components**:
  - `DossierContainer`: Grid container, student archetype banner, triage narrative summary.
  - `CareerCard`: Individual card wrapper, tier header with icon, fit score indicator, role title, fit rationale, majors and minors badges.
  - `RealityCheckSection`: Day-in-the-life tasks vs. misconception buster.
  - `CourseChallengeAndReassurance`: Academic hurdle paired with empathetic reassurance.
  - `TrialCoursesBadgeList`: Exactly 2 exploratory course pill badges with provider and duration.
  - `SynthesisLoadingView`: Animated, progressive reassurance status state while awaiting AI response.
  - `MockNoticeBanner`: Non-alarmist notice badge when `meta.fallback_used === true`.
  - `NavigationFooter`: Action bar with "Start Over" button triggering session purge and navigation to Question 1.
- **Copy Centralization**:
  - `src/constants/dossierCopy.ts`: 100% of dossier titles, tier badges, helper copy, reality check headers, trial course tags, loading messages, and button labels.
- **Layout & Responsiveness**:
  - Desktop (`lg:`, $\ge 1024$px): Rigid 2x2 grid layout (`grid-cols-2`).
  - Mobile/Tablet (`< 1024$px): Single-column vertical stack (`grid-cols-1`).
- **Accessibility & WCAG 2.1 AA**:
  - Interactive touch targets $\ge 44 \times 44$ px.
  - Keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:ring-offset-2`).
  - Semantic landmark regions (`<main>`, `<section>`, `<article>`, `<header>`, `<footer>`).
  - ARIA live region (`aria-live="polite"`, `role="status"`) for loading states.

### Explicitly Out of Scope for Feature 6
- **Editing Server Synthesis Routes**: No modifications to `src/app/api/triage/route.ts` or backend AI logic. The route handler delivered in Feature 5 is complete and frozen.
- **Saving Records to PostgreSQL / Supabase**: No database connections, schemas, migrations, or insertion of submission records into PostgreSQL (strictly deferred to `feature/7-counselor-dashboard-db`).
- **Safety Keyword Banner Overrides**: No distress keyword interceptors, crisis helpline modals (988 Lifeline), or safety keyword overrides (strictly deferred to `feature/8-safety-hardening-and-fallbacks`).
- **Counselor Dashboard UI & Student Annotations**: No advisor review tables, note editors, or status dropdowns (strictly deferred to `feature/7-counselor-dashboard-db`).
- **Student Authentication & Persistent Accounts**: No OAuth, passwords, or persistent login states.

---

## 3. Architecture & Component Hierarchy

The following diagram illustrates the relationship between the intake completion state, client-side synthesis trigger, loading transition, and the resulting Dossier presentation hierarchy:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT BROWSER                                       │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │               IntakeContext (Feature 4 State Machine)                          │   │
│   │   - state.isCompleted === true                                                 │   │
│   │   - state.answers, state.studentNickname                                       │   │
│   └───────────────────────────────────────┬────────────────────────────────────────┘   │
│                                           │                                            │
│                        Trigger Synthesis  │ POST /api/triage                           │
│                                           ▼                                            │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                      SynthesisLoadingView (Animated State)                     │   │
│   │   - role="status", aria-live="polite", aria-busy="true"                        │   │
│   │   - Cycling reassurance messages from DOSSIER_COPY.loading.messages            │   │
│   │   - Calming pulsing animation & spinner                                        │   │
│   └───────────────────────────────────────┬────────────────────────────────────────┘   │
│                                           │                                            │
│                         HTTP 200 Response │ TriageApiResponse                          │
│                                           ▼                                            │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                       DossierContainer (Main Landmark)                         │   │
│   │                                                                                │   │
│   │   ┌────────────────────────────────────────────────────────────────────────┐   │   │
│   │   │ MockNoticeBanner (Rendered if meta.fallback_used === true)             │   │   │
│   │   └────────────────────────────────────────────────────────────────────────┘   │   │
│   │                                                                                │   │
│   │   ┌────────────────────────────────────────────────────────────────────────┐   │   │
│   │   │ Student Archetype Header & Triage Narrative Summary                    │   │   │
│   │   │ - "Your Triage Dossier" / "Jordan's Triage Dossier"                    │   │   │
│   │   │ - Archetype Badge (e.g., "The Practical Systems Architect")           │   │   │
│   │   │ - Empathetic narrative synthesizing energy and setting                 │   │   │
│   │   └────────────────────────────────────────────────────────────────────────┘   │   │
│   │                                                                                │   │
│   │   ┌────────────────────────────────────────────────────────────────────────┐   │   │
│   │   │ 2x2 Desktop Grid / 1-Column Mobile Stack (grid-cols-1 lg:grid-cols-2)  │   │   │
│   │   │                                                                        │   │   │
│   │   │  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │   │   │
│   │   │  │ CareerCard 1                 │    │ CareerCard 2                 │  │   │   │
│   │   │  │ Primary Direct Match         │    │ High-Growth Pathway          │  │   │   │
│   │   │  │ - Role Title & Fit Score     │    │ - Role Title & Fit Score     │  │   │   │
│   │   │  │ - Fit Rationale              │    │ - Fit Rationale              │  │   │   │
│   │   │  │ - Majors & Minors Badges     │    │ - Majors & Minors Badges     │  │   │   │
│   │   │  │ - RealityCheckSection        │    │ - RealityCheckSection        │  │   │   │
│   │   │  │ - CourseChallengeAndReassur. │    │ - CourseChallengeAndReassur. │  │   │   │
│   │   │  │ - TrialCoursesBadgeList (2)  │    │ - TrialCoursesBadgeList (2)  │  │   │   │
│   │   │  └──────────────────────────────┘    └──────────────────────────────┘  │   │   │
│   │   │  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │   │   │
│   │   │  │ CareerCard 3                 │    │ CareerCard 4                 │  │   │   │
│   │   │  │ Interdisciplinary Pivot      │    │ Moonshot Trajectory          │  │   │   │
│   │   │  │ - Role Title & Fit Score     │    │ - Role Title & Fit Score     │  │   │   │
│   │   │  │ - Fit Rationale              │    │ - Fit Rationale              │  │   │   │
│   │   │  │ - Majors & Minors Badges     │    │ - Majors & Minors Badges     │  │   │   │
│   │   │  │ - RealityCheckSection        │    │ - RealityCheckSection        │  │   │   │
│   │   │  │ - CourseChallengeAndReassur. │    │ - CourseChallengeAndReassur. │  │   │   │
│   │   │  │ - TrialCoursesBadgeList (2)  │    │ - TrialCoursesBadgeList (2)  │  │   │   │
│   │   │  └──────────────────────────────┘    └──────────────────────────────┘  │   │   │
│   │   └────────────────────────────────────────────────────────────────────────┘   │   │
│   │                                                                                │   │
│   │   ┌────────────────────────────────────────────────────────────────────────┐   │   │
│   │   │ NavigationFooter                                                       │   │   │
│   │   │ - "Start Over" Action (Triggers Reset Dialog -> Purges Session)        │   │   │
│   │   │ - Reassuring Exit Notice                                               │   │   │
│   │   └────────────────────────────────────────────────────────────────────────┘   │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Presentation Components Specifications

### 4.1 `DossierContainer`

- **File Path**: `src/components/dossier/DossierContainer.tsx`
- **Role**: Top-level presentation orchestrator for the generated triage results.
- **Props**:
  ```typescript
  export interface DossierContainerProps {
    summary: TriageSummary;
    careers: [CareerCardType, CareerCardType, CareerCardType, CareerCardType];
    meta: TriageGenerationMeta;
    studentNickname?: string;
    onStartOver: () => void;
  }
  ```
- **Structure & Layout**:
  1. **Top Notice Area**: Renders `<MockNoticeBanner />` if `meta.fallback_used === true`.
  2. **Dossier Header**:
     - Subtitle/badge: `DOSSIER_COPY.header.badge` ("Personalized Triage Results").
     - Heading `<h1>`: Dynamic title formatted via `DOSSIER_COPY.header.title(studentNickname)` (e.g., *"Jordan's Recommendation Dossier"* or *"Your Recommendation Dossier"*).
     - Student Archetype Card: Highlighting `summary.student_archetype` with an icon badge and supportive narrative paragraph (`summary.triage_narrative`).
     - Calming reminder note: `DOSSIER_COPY.header.reassuranceNote` reminding the student that these pathways are springboards, not permanent commitments.
  3. **Responsive Grid**:
     - Outer container uses CSS Grid: `grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch`.
     - Maps over `careers` array, rendering each card as `<CareerCard />`.
     - Desktop view: Exactly 2 rows $\times$ 2 columns.
     - Mobile/Tablet view: 1 column vertical stack with ample vertical spacing (`space-y-6 sm:space-y-8`).
  4. **Footer**:
     - Renders `<NavigationFooter onStartOver={onStartOver} />`.

### 4.2 `CareerCard`

- **File Path**: `src/components/dossier/CareerCard.tsx`
- **Role**: Presentation container for a single career trajectory.
- **Props**:
  ```typescript
  export interface CareerCardProps {
    card: CareerCardType;
    index: number;
  }
  ```
- **Tier Visual Differentiation**:
  Each of the 4 match tiers receives tailored semantic styling tokens to aid rapid visual scanning:
  - **Tier 1 (Primary Direct Match)**: Educational interactive blue accent (`bg-edu-blue-50`, `border-edu-blue-200`, `text-edu-blue-800`, `Icons.directMatch`).
  - **Tier 2 (High-Growth Pathway)**: Growth emerald accent (`bg-growth-50`, `border-growth-200`, `text-growth-700`, `Icons.highGrowth`).
  - **Tier 3 (Interdisciplinary Pivot)**: Purple/indigo accent (`bg-purple-50`, `border-purple-200`, `text-purple-700`, `Icons.interdisciplinary`).
  - **Tier 4 (Moonshot Trajectory)**: Amber/reassurance accent (`bg-amber-50`, `border-amber-200`, `text-amber-800`, `Icons.moonshot`).
- **Card Sub-Elements**:
  1. **Tier Header & Fit Score**:
     - Top row with tier badge (icon + tier label) on the left.
     - Fit score badge on the right: e.g., *"96% Alignment"*, styled with a subtle rounded badge (`bg-edu-slate-100 text-edu-slate-800 border border-edu-slate-200 font-semibold text-xs px-2.5 py-1`).
  2. **Role Title**:
     - Heading `<h2>` or `<h3>` rendering `card.role_title` in bold, high-contrast typography (`text-xl font-bold text-edu-slate-900 tracking-tight`).
  3. **Fit Rationale**:
     - Calm paragraph explaining why this path matches their intake profile (`card.fit_rationale`).
  4. **Majors & Minors Section**:
     - Section label: `DOSSIER_COPY.card.majorsLabel` ("Connected College Majors:").
     - Badges for `card.majors`: Pill badges (`bg-edu-blue-50 text-edu-blue-900 border border-edu-blue-200 px-2.5 py-1 rounded-full text-xs font-medium`).
     - Section label: `DOSSIER_COPY.card.minorsLabel` ("Complementary Minors:").
     - Badges for `card.minors`: Pill badges (`bg-edu-slate-100 text-edu-slate-700 border border-edu-slate-200 px-2 py-0.5 rounded-full text-xs`). If minors array is empty or omitted, safely hides this sub-block.
  5. **Sub-Sections**:
     - `<RealityCheckSection dayInTheLife={card.day_in_the_life} dailyTasks={card.daily_tasks} />`
     - `<CourseChallengeAndReassurance challenge={card.course_challenges} reassurance={card.reassurance} />`
     - `<TrialCoursesBadgeList trialCourses={card.trial_courses} />`

### 4.3 `RealityCheckSection`

- **File Path**: `src/components/dossier/RealityCheckSection.tsx`
- **Role**: Contrasts real, concrete daily tasks against common student misconceptions to demystify intimidating professions.
- **Props**:
  ```typescript
  export interface RealityCheckSectionProps {
    dayInTheLife?: DayInTheLife;
    dailyTasks?: string[];
  }
  ```
- **Visual Design**:
  - Encased in a subtle container (`bg-edu-slate-50 border border-edu-slate-200 rounded-xl p-4 space-y-3.5`).
  - **Header**: Section label `DOSSIER_COPY.realityCheck.title` ("Day-in-the-Life Reality Check") with icon `Icons.laptop` or `Icons.briefcase`.
  - **Daily Tasks List**:
    - Sub-label: `DOSSIER_COPY.realityCheck.tasksSubtitle` ("What you actually do at 10:00 AM on a Tuesday:").
    - Unordered list (`<ul role="list">`) with checkmark icons (`Icons.check`), rendering 3+ concrete tasks.
  - **Misconception Buster Card**:
    - Rendered if `dayInTheLife?.misconceptions` has entries.
    - Card container: `bg-white border border-amber-200/80 rounded-lg p-3 text-xs space-y-1.5 shadow-2xs`.
    - Header: Icon `Icons.frictionAlert` with title `DOSSIER_COPY.realityCheck.mythTitle` ("Common Student Misconception vs. Reality:").
    - Body: Renders each misconception string. If the string contains `"Myth:"` and `"Reality:"`, formats them with bold semantic labels for effortless contrast reading.

### 4.4 `CourseChallengeAndReassurance`

- **File Path**: `src/components/dossier/CourseChallengeAndReassurance.tsx`
- **Role**: Directly demystifies academic fear by naming the tough college course and pairing it with compassionate, pragmatic reassurance.
- **Props**:
  ```typescript
  export interface CourseChallengeAndReassuranceProps {
    challenge: string;
    reassurance: string;
  }
  ```
- **Visual Design**:
  - Two-tone callout container (`bg-reassurance-50 border border-reassurance-100 rounded-xl p-4 space-y-2.5`).
  - **The Academic Hurdle (Challenge)**:
    - Label: `DOSSIER_COPY.academics.challengeLabel` ("The Real Academic Hurdle:") with an alert/book icon (`Icons.academic`).
    - Course text: `challenge` rendered in medium-weight text (`text-xs sm:text-sm font-semibold text-edu-slate-800`).
  - **Empathetic Reassurance**:
    - Label: `DOSSIER_COPY.academics.reassuranceLabel` ("Why You Can Handle It:") with a check/sparkle icon (`Icons.verifiedCourse`).
    - Body text: `reassurance` rendered in calm, supportive prose (`text-xs sm:text-sm text-edu-slate-600 leading-relaxed`).
    - Directly reminds the student why this applied college challenge differs from intimidating high-school tests.

### 4.5 `TrialCoursesBadgeList`

- **File Path**: `src/components/dossier/TrialCoursesBadgeList.tsx`
- **Role**: Renders exactly 2 zero-cost, foundational trial courses as interactive or informative pill badges to enable immediate, risk-free exploration.
- **Props**:
  ```typescript
  export interface TrialCoursesBadgeListProps {
    trialCourses: [TrialCourse, TrialCourse];
  }
  ```
- **Visual Design**:
  - Container label: `DOSSIER_COPY.trialCourses.sectionTitle` ("Zero-Cost Weekend Trial Courses") with a duration icon (`Icons.duration`).
  - Sub-helper: `DOSSIER_COPY.trialCourses.sectionHelper` ("Explore these low-stakes, free modules over a weekend to test the waters:").
  - **Badge Layout**: Flex or grid stack of **exactly 2 badges**:
    - Each course item is rendered in a clean card/pill (`p-3 bg-white border border-edu-slate-200 hover:border-edu-interactive/50 rounded-lg text-xs space-y-1.5 transition-colors`).
    - **Header Row**:
      - Course Title: bold text (`font-semibold text-edu-slate-900 line-clamp-1`).
      - Provider & Duration Badge: e.g., `"Coursera (Free Audit) • ~6 hrs"` in a compact tag (`bg-edu-slate-100 text-edu-slate-600 px-2 py-0.5 rounded text-[11px] font-medium shrink-0`).
    - **Description**: Concise summary (`text-edu-slate-600 leading-normal line-clamp-2`).
    - **Zero-Cost Tag**: Visual micro-badge `DOSSIER_COPY.trialCourses.zeroCostBadge` ("100% Free / Zero Tuition").

### 4.6 `SynthesisLoadingView`

- **File Path**: `src/components/dossier/SynthesisLoadingView.tsx`
- **Role**: Animated, anxiety-reducing loading state displayed while the client awaits generation from `POST /api/triage`.
- **Props**:
  ```typescript
  export interface SynthesisLoadingViewProps {
    studentNickname?: string;
  }
  ```
- **Visual Design & Animation**:
  - Container: Centered scholastic card with smooth fade-in (`max-w-xl mx-auto py-12 px-6 text-center space-y-6`).
  - Central pulsing halo with academic icon (`Icons.logo` or `Icons.academic`) animating with subtle pulse and spin effects.
  - **Progressive Reassurance Cycler**:
    - Automatically cycles through supportive reassuring phrases every 2.5 seconds:
      1. *"Reviewing your natural energy and focus..."*
      2. *"Exploring modern, high-demand career pathways..."*
      3. *"Connecting day-to-day tasks with low-friction college majors..."*
      4. *"Addressing your academic dread with supportive reassurance..."*
      5. *"Curating zero-cost weekend trial courses..."*
  - **Accessibility**:
    - Landmark has `role="status"` and `aria-live="polite"`.
    - Hidden screen reader text informs assistive technologies that career pathways are being generated.
  - **Calming Sub-Note**:
    - Displays `DOSSIER_COPY.loading.calmNote` ("Take a deep breath—your personalized pathways are being thoughtfully tailored to your answers.").

### 4.7 `MockNoticeBanner`

- **File Path**: `src/components/dossier/MockNoticeBanner.tsx`
- **Role**: Renders a reassuring, non-alarmist informational banner when `meta.fallback_used === true`.
- **Props**:
  ```typescript
  export interface MockNoticeBannerProps {
    engine?: string;
  }
  ```
- **Visual Design**:
  - Inline scholastic banner (`bg-edu-blue-50 border border-edu-blue-200 text-edu-blue-900 rounded-xl p-4 flex items-start sm:items-center gap-3 shadow-xs mb-6`).
  - Icon: `Icons.verifiedCourse` or `Icons.frictionAlert` in calming blue.
  - Title: `DOSSIER_COPY.mockNotice.title` ("Curated Demonstration Pathways Active").
  - Description: `DOSSIER_COPY.mockNotice.description` ("These high-fidelity pathways are curated based on your answers to guarantee 100% demo uptime and uninterrupted exploration.").
  - Tone: Explicitly non-punitive and non-alarmist. Does not mention API failures, rate limits, or error codes to avoid distressing the student.

### 4.8 `NavigationFooter`

- **File Path**: `src/components/dossier/NavigationFooter.tsx`
- **Role**: Bottom navigation bar providing a clean exit and session reset.
- **Props**:
  ```typescript
  export interface NavigationFooterProps {
    onStartOver: () => void;
  }
  ```
- **Visual Design**:
  - Border-top separator (`border-t border-edu-slate-200 pt-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4`).
  - Left / Context Note: `DOSSIER_COPY.footer.reassurance` ("Want to explore different tasks or subjects? You can start over at any time.").
  - Right / Action:
    - Button: `DOSSIER_COPY.footer.startOverButton` ("Start Over") with icon `Icons.reset`.
    - Styling: Secondary neutral button with high-contrast outline (`px-5 py-2.5 rounded-lg border border-edu-slate-300 hover:bg-edu-slate-100 text-edu-slate-700 font-semibold text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:ring-offset-2`).
    - Touch Target: Height $\ge 44$px, width $\ge 120$px.
    - Behavior: Invokes `onStartOver`, which triggers the existing accessible `ResetConfirmationModal`. Upon user confirmation, `resetState()` clears `sessionStorage` and returns the student to Question 1.

---

## 5. Centralized Calm Copy Contract (`src/constants/dossierCopy.ts`)

Every string rendered across the recommendation dossier, cards, loading screen, badges, headers, and footer MUST originate from `src/constants/dossierCopy.ts`. No hardcoded strings are permitted inside component JSX.

```typescript
/**
 * PathwayAI: College Major & Career Triage MVP
 * Centralized Copy Contract for Recommendation Dossier UI
 * Tone: Calm, validating, plain language tailored for anxious 17-19 year olds.
 */

export const DOSSIER_COPY = {
  // Top-Level Dossier Header & Archetype Copy
  header: {
    badge: 'Your Personalized Triage Dossier',
    title: (nickname?: string) =>
      nickname?.trim()
        ? `${nickname.trim()}'s Career & Major Pathways`
        : 'Your Career & Major Pathways',
    subtitle:
      'Synthesized by Alex, your collegiate academic advisor, based on your natural focus and comfort zone.',
    reassuranceNote:
      'Remember: these pathways are starting springboards, not permanent life sentences. Every major can lead to multiple meaningful careers.',
    archetypeBadgeLabel: 'Your Triage Archetype:',
  },

  // 4-Card Match Tier Labels & Badges
  tiers: {
    primary: {
      label: 'Primary Direct Match',
      shortLabel: 'Direct Match',
      tagline: 'Highest alignment with your natural energy and preferred work setting.',
    },
    highGrowth: {
      label: 'High-Growth Pathway',
      shortLabel: 'High Growth',
      tagline: 'Strong employer hiring demand, economic stability, and clear entry paths.',
    },
    interdisciplinary: {
      label: 'Interdisciplinary Pivot',
      shortLabel: 'Creative Pivot',
      tagline: 'A creative bridge combining your secondary strengths with low friction.',
    },
    moonshot: {
      label: 'Moonshot Trajectory',
      shortLabel: 'Moonshot',
      tagline: 'An ambitious, high-impact career that broadens your horizon.',
    },
  },

  // Career Card Common Elements
  card: {
    fitScoreLabel: (score: number) => `${score}% Alignment`,
    majorsLabel: 'Connected College Majors:',
    minorsLabel: 'Complementary Minors:',
    whyItFitsLabel: 'Why This Fits You:',
  },

  // Reality Check Section Copy (Day-to-day tasks vs misconceptions)
  realityCheck: {
    title: 'Day-in-the-Life Reality Check',
    tasksSubtitle: 'What you actually do on a typical workday:',
    mythTitle: 'Student Misconception vs. Reality:',
    mythPrefix: 'Myth:',
    realityPrefix: 'Reality:',
  },

  // Academic Challenge & Empathetic Reassurance Copy
  academics: {
    sectionTitle: 'Academic Navigation & Support',
    challengeLabel: 'The Real College Hurdle:',
    reassuranceLabel: 'Why You Can Handle It:',
  },

  // Zero-Cost Trial Courses Copy
  trialCourses: {
    sectionTitle: 'Zero-Cost Weekend Trial Courses',
    sectionHelper: 'Low-stakes, free modules to explore this field with zero financial risk:',
    hoursBadge: (hours: number) => `~${hours} hrs`,
    zeroCostBadge: 'Zero Tuition • Free Audit',
  },

  // Animated Synthesis Loading State Copy
  loading: {
    title: 'Alex is crafting your pathways...',
    calmNote: 'Take a deep breath—your personalized dossier is being thoughtfully synthesized.',
    ariaStatus: 'Synthesizing your 4-career recommendation dossier. Please wait.',
    messages: [
      'Reviewing your natural energy and focus...',
      'Exploring modern, high-demand career pathways...',
      'Connecting day-to-day tasks with low-friction college majors...',
      'Addressing your academic dread with supportive reassurance...',
      'Curating zero-cost weekend trial courses...',
    ],
  },

  // Mock / Fallback Mode Notice Banner
  mockNotice: {
    badge: 'Demo Mode Active',
    title: 'Curated Demonstration Pathways Active',
    description:
      'These high-fidelity recommendations are actively curated based on your answers to guarantee 100% demo uptime and uninterrupted exploration.',
  },

  // Bottom Navigation & Reset Footer
  footer: {
    reassurance: 'Want to explore different tasks, subjects, or settings? You can start fresh at any time.',
    startOverButton: 'Start Over',
    startOverAriaLabel: 'Start over and reset all intake questions',
    backToWizardAriaLabel: 'Return to question intake',
  },

  // Accessibility Announcements
  a11y: {
    dossierLandmark: 'Career recommendation dossier results',
    cardTierAnnouncement: (tier: string, role: string) => `${tier}: ${role}`,
    fitScoreAnnouncement: (score: number) => `Calculated profile alignment score of ${score} percent`,
  },
} as const;

export type DossierCopyType = typeof DOSSIER_COPY;
```

---

## 6. Responsive Layout & Breakpoint Rules

The recommendation dossier must adapt gracefully across screen dimensions from small mobile viewports (360px) to ultra-wide displays (1440px+):

### 6.1 Viewport Breakpoint Mechanics

| Breakpoint Range | CSS Classes | Layout Configuration | Behavior & Visual Adjustments |
|---|---|---|---|
| **Mobile (`< 640px`)** | `grid-cols-1 space-y-6` | Single-column stack | Cards occupy 100% container width. Trial course badges stack vertically. Header font scales to `text-2xl`. Touch targets maintain minimum 44px height. |
| **Tablet (`640px – 1023px`)** | `grid-cols-1 sm:px-6` | Single-column stack with generous padding | Cards occupy max width 640px centered, providing comfortable reading line lengths (60–75 characters per line). |
| **Desktop (`1024px+`)** | `lg:grid-cols-2 lg:gap-8` | **Rigid 2x2 Grid** | Exactly 2 columns across 2 rows. Cards flex to match row height (`h-full flex flex-col justify-between`). Trial courses render side-by-side or stacked cleanly within card footer. |

### 6.2 Equal-Height Card Alignment
In the 2x2 desktop grid, card heights can vary if career descriptions differ in length. To maintain visual harmony:
- Every `<CareerCard />` uses `flex flex-col h-full`.
- The top metadata (tier, fit score, title, rationale, majors) forms the upper flex group.
- The `RealityCheckSection`, `CourseChallengeAndReassurance`, and `TrialCoursesBadgeList` form the lower flex group aligned to the card base.

---

## 7. Accessibility (A11y) & WCAG 2.1 AA Compliance

Students navigating this UI may be experiencing acute anxiety or cognitive overload. Strict WCAG 2.1 Level AA compliance ensures an accessible, stress-free experience.

### 7.1 Touch Target Sizing ($\ge 44 \times 44$ px)
- All interactive controls—including the "Start Over" button in `NavigationFooter`, external trial course links (if interactive), and modal triggers—must have a minimum hit target size of **$44 \times 44$ CSS pixels** (`min-h-[44px] min-w-[44px]` or adequate padding).

### 7.2 Keyboard Navigation & Focus Rings
- All interactive elements must be reachable via standard `Tab` navigation.
- High-visibility keyboard focus indicator:
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:ring-offset-2`.
- Outline must never be suppressed with `outline: none` unless replaced by an equivalent focus ring.

### 7.3 Semantic Landmark Regions & Heading Hierarchy
- The dossier page must use semantic HTML5 elements:
  - `<main aria-label={DOSSIER_COPY.a11y.dossierLandmark}>` for the top container.
  - `<header>` for the archetype summary and narrative.
  - `<section>` or `<article>` for each of the 4 `<CareerCard />` instances.
  - `<footer>` for the `<NavigationFooter />`.
- Strict heading hierarchy:
  - `<h1>`: Dossier title (*"Jordan's Career & Major Pathways"*).
  - `<h2>`: Student archetype summary and individual career role titles (*"Cloud Infrastructure & Systems Reliability Specialist"*).
  - `<h3>`: Card sub-sections (*"Day-in-the-Life Reality Check"*, *"Academic Navigation & Support"*, *"Zero-Cost Weekend Trial Courses"*).

### 7.4 Screen Reader Support & Live Regions
- `SynthesisLoadingView`:
  - Equipped with `role="status"` and `aria-live="polite"`.
  - When messages cycle, screen readers are gently notified without interrupting the user.
- Fit scores and tier badges must provide explicit context via `aria-label` (e.g., `aria-label="Calculated profile alignment score of 96 percent"`).

### 7.5 Color Contrast
- Normal body text (`#0F172A` on `#F8FAFC` or `#FFFFFF`) exhibits a contrast ratio $> 12:1$ (exceeding WCAG 4.5:1 requirement).
- Muted secondary text (`#475569`) exhibits a contrast ratio $> 5.8:1$.
- Badges and borders maintain at least 3:1 contrast against surrounding backgrounds.

---

## 8. Client State Transition & Hook Integration

Feature 6 integrates seamlessly with the existing `IntakeContext` state machine and `POST /api/triage` endpoint:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               CLIENT VIEW STATE MACHINE                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ 1. Intake Wizard Active ]                                                          │
│     │  (Steps 1 through 4)                                                             │
│     ▼                                                                                  │
│   [ Student Completes Step 4 & Taps "Review Pathways" ]                                │
│     │                                                                                  │
│     ▼                                                                                  │
│   [ 2. Transition to Loading: isSynthesizing = true ]                                  │
│     │  - Renders <SynthesisLoadingView />                                              │
│     │  - Dispatches POST /api/triage with { answers, studentNickname }                 │
│     │                                                                                  │
│     ├───────────────────────────────┬────────────────────────────────┐                 │
│     ▼                               ▼                                ▼                 │
│   [ HTTP 200 OK ]              [ HTTP 4xx/5xx Error ]       [ Demo Fallback Mode ]     │
│     │                            │                            │                        │
│     │ TriageSuccessResponse      │ ProblemDetails             │ meta.fallback_used     │
│     ▼                            ▼                            ▼                        │
│   [ 3. Render Dossier ]        [ Render Error Banner ]      [ 3. Render Dossier ]      │
│     - <DossierContainer />       - Calm retry prompt          - <DossierContainer />   │
│     - Exactly 4 cards            - Safe recovery button       - <MockNoticeBanner />   │
│                                                                                        │
│   [ 4. User Clicks "Start Over" ]                                                      │
│     │                                                                                  │
│     ▼                                                                                  │
│   [ Reset Confirmation Modal ] ──► Confirmed: purgeSession() & resetState()            │
│                                    Returns to Question 1 with Clean State              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Hook Contract: `useTriageSynthesis`
To coordinate the fetch lifecycle without cluttering `page.tsx`:
```typescript
export interface UseTriageSynthesisReturn {
  isLoading: boolean;
  dossier: TriageSuccessResponse | null;
  error: ProblemDetails | null;
  fetchDossier: (answers: IntakeAnswersState, studentNickname?: string) => Promise<void>;
  resetDossier: () => void;
}
```

---

## 9. Comprehensive Edge Cases Matrix

| Edge Case ID | Scenario / Trigger | System Defense & UI Handling | Expected Result |
|---|---|---|---|
| **EC-DOS-01** | **`meta.fallback_used === true`** | Upstream API key missing or rate-limited; fallback returns mock data. | `<MockNoticeBanner />` renders at top of dossier with calm, reassuring badge. No error dialogs or red warning states appear. |
| **EC-DOS-02** | **Empty or Missing Minors Array** | Upstream AI or legacy card omits `minors` or returns empty array `[]`. | `<CareerCard />` safely checks `minors && minors.length > 0` before rendering the minors row; avoids empty container artifacts. |
| **EC-DOS-03** | **Long Role Title or Fit Rationale** | Role title exceeds 70 chars or rationale exceeds 300 chars. | Typography uses `break-words` and `leading-tight` with fluid container sizing; no horizontal overflow or clipped text. |
| **EC-DOS-04** | **Network Latency or Slow AI Generation** | Synthesis takes 4–6 seconds due to network latency. | `<SynthesisLoadingView />` smoothly cycles reassuring messages every 2.5s, preventing student anxiety or premature abandonment. |
| **EC-DOS-05** | **Rapid Double-Click on "Start Over"** | Anxious student double-clicks "Start Over" button in footer. | Reset modal state is idempotent; confirmation modal opens cleanly without flashing or duplicate state transitions. |
| **EC-DOS-06** | **Narrow Mobile Viewport (320px–360px)** | Student views dossier on compact smartphone screen. | 2x2 grid collapses to `grid-cols-1`. Trial courses stack vertically. Touch targets maintain $\ge 44$px height. |
| **EC-DOS-07** | **Synthesis Request Fails (HTTP 500 / Network Down)** | Client device loses connection during synthesis call. | Inline calm error card displays `INTAKE_COPY.serverErrors.serviceUnavailable` with a "Try Again" button that re-invokes `fetchDossier`. |
| **EC-DOS-08** | **High Contrast / Screen Reader User** | Student navigates via NVDA, VoiceOver, or keyboard only. | Landmarks, focus rings, `aria-live` announcements, and heading hierarchy allow effortless, non-visual navigation. |
| **EC-DOS-09** | **Misconception String Without "Myth:" Prefix** | AI returns freeform text without standard delimiter. | Section gracefully displays full string without syntax errors or broken spans. |
| **EC-DOS-10** | **Start Over Cancelled by Student** | Student opens reset dialog from dossier footer but clicks "Keep my answers". | Modal closes; dossier remains fully intact with all 4 cards preserved. |

---

## 10. Files to Touch & Architecture Map

Feature 6 introduces the presentation layer components, centralized copy, hooks, and test suites:

```
src/
├── app/
│   └── page.tsx                               # EXTEND: Wire synthesis trigger, loading view & dossier container
├── components/
│   └── dossier/
│       ├── CareerCard.tsx                     # CREATE: Individual 4-tier recommendation card
│       ├── CourseChallengeAndReassurance.tsx  # CREATE: Academic hurdle & empathetic reassurance
│       ├── DossierContainer.tsx               # CREATE: 2x2 grid container, archetype header & narrative
│       ├── MockNoticeBanner.tsx               # CREATE: Calm fallback notice banner
│       ├── NavigationFooter.tsx               # CREATE: Bottom footer with accessible Start Over action
│       ├── RealityCheckSection.tsx            # CREATE: Daily tasks vs student misconceptions
│       ├── SynthesisLoadingView.tsx           # CREATE: Animated progressive reassurance loading state
│       ├── TrialCoursesBadgeList.tsx          # CREATE: 2 zero-cost exploratory course pill badges
│       └── index.ts                           # CREATE: Clean barrel exports for dossier components
├── constants/
│   └── dossierCopy.ts                         # CREATE: 100% centralized calm copy contract for Feature 6
├── hooks/
│   └── useTriageSynthesis.ts                  # CREATE: Client hook managing POST /api/triage lifecycle
└── types/
    └── index.ts                               # EXTEND: Export dossier copy types if needed

tests/
├── unit/
│   ├── dossierComponents.test.tsx             # CREATE: Unit tests for CareerCard, RealityCheck, Badges, etc.
│   └── dossierCopy.test.ts                    # CREATE: Unit tests ensuring complete copy coverage & tone
└── integration/
    └── dossierViewIntegration.test.tsx        # CREATE: Integration test verifying intake-to-dossier transition
```

---

## 11. Verification & Acceptance Criteria Matrix (AC-DOSSIER-01 through AC-DOSSIER-08)

| Criterion ID | Target Requirement | Verification Procedure | Pass Criteria |
|---|---|---|---|
| **AC-DOSSIER-01** | **DossierContainer Responsive Grid Layout** | Render dossier with 4 cards on desktop viewport ($> 1024$px) and mobile viewport ($< 640$px). | Desktop renders an exact 2x2 grid (`lg:grid-cols-2`). Mobile renders a clean single-column stack (`grid-cols-1`). Container displays student archetype badge and narrative summary. |
| **AC-DOSSIER-02** | **CareerCard Presentation & Tier Badging** | Inspect all 4 rendered cards across the 4 triage tiers. | Each card displays role title, designated match tier badge with tier-specific styling, fit score indicator, fit rationale, and connected college majors and complementary minors. |
| **AC-DOSSIER-03** | **RealityCheckSection Tasks vs Misconceptions** | Verify `<RealityCheckSection />` across cards with standard `day_in_the_life` payloads. | Renders at least 3 concrete daily tasks with check icons and at least 1 highlighted misconception contrasting "Myth" vs "Reality" in a calm visual format. |
| **AC-DOSSIER-04** | **CourseChallengeAndReassurance Component** | Inspect the academic navigation section of each career card. | Clearly identifies the authentic academic course challenge paired with compassionate, actionable reassurance directly reframing the student's stated dread from Q2. |
| **AC-DOSSIER-05** | **TrialCoursesBadgeList 2-Pill Badges** | Inspect the exploratory courses section on each card. | Renders **exactly 2 foundational courses** as pill badges with title, provider, estimated hours, concise description, and prominent zero-cost / free audit tag. |
| **AC-DOSSIER-06** | **SynthesisLoadingView Animated Reassurance State** | Trigger synthesis transition and inspect loading state while awaiting API response. | Displays animated scholastic indicator, cycles progressive reassurance messages from `DOSSIER_COPY.loading.messages`, and exposes `role="status"` with `aria-live="polite"`. |
| **AC-DOSSIER-07** | **MockNoticeBanner Resilience Indicator** | Supply API response with `meta.fallback_used: true`. | Displays prominent, non-alarmist informational banner from `DOSSIER_COPY.mockNotice`, reassuring the user of 100% demo uptime without technical error codes. |
| **AC-DOSSIER-08** | **NavigationFooter & Session Start Over Action** | Click "Start Over" button in `<NavigationFooter />` and confirm dialog. | "Start Over" button meets $\ge 44$px touch target, opens `ResetConfirmationModal`, purges session storage upon confirmation, and resets student state back to Question 1. |

---

## 12. Architectural Decisions, Simplifications & Tradeoffs

1. **Rigid 2x2 Grid over Endless Carousel or Tabs**:
   - *Decision*: Present all 4 career cards simultaneously in a 2x2 grid on desktop rather than hiding them behind a carousel or tab switcher.
   - *Rationale*: Anxious students experience high friction when options are hidden. A side-by-side comparison allows students to immediately perceive the breadth of their choices (Direct Match vs. High Growth vs. Pivot vs. Moonshot) without interactive barriers.
2. **Centralized `dossierCopy.ts` Separate from `intakeCopy.ts`**:
   - *Decision*: Create a dedicated `dossierCopy.ts` rather than bloating `intakeCopy.ts`.
   - *Rationale*: Maintains high modularity and separation of concerns. `intakeCopy.ts` governs the 4-question wizard intake; `dossierCopy.ts` governs the results presentation layer. Both enforce the identical calm, supportive voice.
3. **Structured Non-Alarmist Fallback Notice over Error Modals**:
   - *Decision*: When `meta.fallback_used` is true, render a friendly informational badge instead of an intrusive error popup.
   - *Rationale*: During live hackathon demonstrations or offline judging, a fallback should provide seamless continuity. Alerting the student with red error text increases anxiety; an informational blue notice preserves confidence.
4. **Pure Tailwind CSS Utilities with Semantic Tokens**:
   - *Decision*: Implement all layout and visual styling using standard Tailwind CSS classes composed with project theme variables (`edu-blue`, `edu-slate`, `reassurance`, `growth`).
   - *Rationale*: Guarantees zero runtime CSS overhead, maximum responsiveness across breakpoints, and 100% aesthetic alignment with the existing `globals.css` design system.

---

## 13. Specification Gate Assessment

### Gate Status: **SPECIFICATION GATE: PASS**

**Rationale**:
- All presentation components requested for Feature 6 (`DossierContainer`, `CareerCard`, `RealityCheckSection`, `CourseChallengeAndReassurance`, `TrialCoursesBadgeList`, `SynthesisLoadingView`, `MockNoticeBanner`, `NavigationFooter`) are specified with exact props, visual mechanics, and layout behaviors.
- Responsive layout rules (2x2 desktop grid, 1-column mobile stack, fluid spacing) are explicitly defined with Tailwind breakpoints.
- Accessibility standards (WCAG 2.1 AA touch targets $\ge 44$px, focus rings, semantic landmarks, ARIA live regions) are fully documented.
- 100% of user-facing copy is mapped to `src/constants/dossierCopy.ts` in a calm, supportive tone.
- Out-of-scope boundaries (editing server synthesis routes, PostgreSQL persistence, safety overrides) are cleanly preserved.
- Acceptance criteria **AC-DOSSIER-01** through **AC-DOSSIER-08** are comprehensively defined with pass criteria.
- Ready for downstream implementation upon user instruction.
