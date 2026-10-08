# PathLess

PathLess is a calm, zero-pressure college major and career discovery guide that turns decision anxiety into confident exploration. It helps high school upperclassmen and early college students discover realistic academic pathways and future careers without stressful test scores or competition.

---

## What It Does
- **Problem:** High school students (especially Grades 10–12) face overwhelming anxiety when choosing a college major or career, often held back by long psychometric exams, high-stakes score cutoffs, and unrealistic advice.
- **Solution:** A supportive 12-question intake guide that captures student interests, strengths, and study tracks; connects to Google Gemini to suggest realistic pathways grounded in a curated catalog of Thai careers and university programs; and gives guidance counselors an advisor dashboard to support 1-on-1 advising sessions.
- **Audience:** High school students (Grades 10–12), early college undergraduates, and school guidance counselors or mentors.

---

## Quick Start Guide

### Prerequisites
- Node.js (version 18.18.0 or newer)
- npm (installed automatically with Node.js)
- Git

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/ShortXander101205/first-hackathon.git
   cd first-hackathon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Add your Google Gemini API key to `.env.local` if you wish to run live AI synthesis:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: An API key is completely optional for local testing. If omitted, PathLess automatically runs in zero-cost mode using curated mock recommendations.)*

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Open your browser:
   - **Student Discovery Guide:** http://localhost:3000
   - **Advisor Portal:** http://localhost:3000/advisor (Default Passcode: `TEACHER2026`)

---

## Key Features
- **Zero-Pressure Exploration:** 12 quick, thoughtful questions completed in 3–4 minutes with no grades or GPA required.
- **Grounded 4-Pathway Results:** Delivers 2 direct "Top Match" pathways and 2 adjacent "Explore Also" options with no stressful percentage fit scores.
- **Clear Career Milestones:** Every card breaks down a 3-stage journey: College Major, Common First Job, and Later Growth Role.
- **Curated Thai University Directory:** Pre-verified list of 17 Thai universities and faculties matching recommended majors, complete with high school track eligibility (e.g., Science-Math or Arts-Language).
- **Advising-Ready Printout:** Clean print layout (@media print) for student-counselor discussions, with sensitive student IDs omitted for privacy.
- **School Advisor Directory:** Passcode-protected portal where counselors can search student submissions, review reflections, and write private session notes.
- **Zero-Cost & Offline Resilience:** Includes automatic in-memory fallback storage, enabling full local and CI operation without a paid database or active cloud connection.

---

## Tech Stack
- **Framework:** Next.js 14 (App Router) & React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Educational Blue and Slate theme)
- **AI Model:** Google Gemini (`@google/genai`)
- **Database & ORM:** Prisma ORM with PostgreSQL (with automatic in-memory mock fallback)
- **Validation:** Zod
- **Testing:** Playwright (E2E & Accessibility) and native Node.js test runner

---

## Available Scripts
- `npm run dev` — Starts the local Next.js development server.
- `npm run build` — Builds the production application bundle.
- `npm run start` — Runs the compiled production server.
- `npm test` — Executes all unit and integration tests.
- `npm run test:e2e` — Runs end-to-end user journey tests with Playwright.
- `npm run type-check` — Validates TypeScript types across the codebase.
- `npm run lint` — Checks code style and formatting with ESLint.

---

## License
This project is open-source and available under the [MIT License](LICENSE).
