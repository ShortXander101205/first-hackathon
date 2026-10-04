---
doc: contract
feature: 14-simpler-suggestions-and-clean-pdf
project: PathLess - Framework v2
status: approved
gate: PASS
---

# Feature 14: Simpler Suggestions and Clean PDF — Technical Contract & Specification

## 1. Executive Summary & Objective

This specification establishes the technical, architectural, behavioral, and accessibility contract for **Feature 14: Simpler Suggestions and Clean PDF** of the **PathLess Framework v2** on branch `feature/14-simpler-suggestions-and-clean-pdf`.

Feature 14 refines the career synthesis engine and results presentation layer delivered in Feature 8. While Feature 8 introduced progressive disclosure, dual rate-limiting, and intake-grounded synthesis, high school learners, parents, and educational advisors identified key friction points during usability testing:
1. **Misleading Statistical Precision & Jargon**: Displaying exact numerical alignment scores (e.g., `95% Natural Fit`) heightened anxiety by implying a rigid test-like certainty. Furthermore, Silicon Valley startup tier badges (e.g., `Moonshot Trajectory`, `Interdisciplinary Pivot`) alienated non-technical students and parents.
2. **Niche & Hallucinated Career Titles**: Without an immutable domain whitelist, generative synthesis occasionally produced overly narrow or invented roles (e.g., `Autonomous Simulation Systems Specialist`) and non-standard majors that did not map cleanly to standard undergraduate degree programs in Thailand.
3. **Broken Print & Advisor Workflows**: Students and guidance counselors who activated browser print encountered clipped cards, missing accordion details, omission of student advising metadata (student name, grade, date, advisor note), and accidental exposure of sensitive internal identifiers.

### The PathLess Feature 14 Evolution

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FEATURE 8 vs FEATURE 14 COMPARISON                             │
├─────────────────────────────────────────────────┬────────────────────────────────────────────────┤
│           Feature 8 (Baseline)                  │               Feature 14 (Refined)             │
├─────────────────────────────────────────────────┼────────────────────────────────────────────────┤
│ • Arbitrary, open-ended LLM role suggestions    │ • Curated static catalog whitelist in          │
│ • Invented niche titles & obscure majors        │   src/data/careerCatalog.ts (8 approved fields)│
│ • Pseudo-scientific scores (e.g., "95% Fit")    │ • 100% eliminated percentages; locked badges   │
│ • Jargon tiers ("Moonshot Trajectory",          │   ("Top Match" [2] & "Explore Also" [2])       │
│   "Interdisciplinary Pivot")                    │ • Breadth guarantee: 2 primary + 2 adjacent    │
│ • Abstract, brief overview sentence             │ • Grounded rationale linking daily tasks to    │
│ • No educational/career trajectory stages       │   student's specific intake answers            │
│ • Browser print clipped collapsed cards         │ • Clean 3-stage progression familiar in TH:    │
│ • Print lacked student context & advisor notes  │   College Study -> First Job -> Later Role     │
│ • Exposed Student ID in printed output          │ • Overhauled @media print: all 4 cards auto-   │
│ • Generative AI output accepted without         │   expand, PrintHeader with Name, Grade, Date,  │
│   catalog whitelist verification                │   Advisor Note; Student ID omitted for privacy │
│ • Advisory disclaimer could be scrolled past    │ • Defensive route catalog guardrail: verifies   │
│   or lacked persistent advisor reminder         │   every title/major & spread; falls back to    │
│                                                 │   sample data notice if unverified             │
│                                                 │ • Permanent "suggestions, not decisions" note  │
│                                                 │   and Advisor reminder; 0% technical jargon    │
└─────────────────────────────────────────────────┴────────────────────────────────────────────────┘
```

### Primary Objectives
1. **Curated Career Catalog Whitelist (`src/data/careerCatalog.ts`)**: Establish a confirmed, immutable static whitelist of common, everyday job titles and standard university majors across the **8 approved educational fields** familiar in Thailand. Both the Gemini prompt and mock fallback data select strictly from this catalog with zero invented terminology.
2. **Defensive Route Validation & Sample Fallback Guardrail (`src/app/api/guide/route.ts`)**: The backend guide API route strictly validates every returned job title and major against the catalog whitelist, and confirms the 2 primary + 2 adjacent field distribution. If any title or major is outside the catalog or the field spread is incorrect, the route automatically discards the AI output and serves curated sample data bearing the explicit **Sample Data Notice**.
3. **Locked Qualitative Badges & Fit Score Elimination**: Remove all numerical percentages and jargon tier names. Enforce exactly two qualitative badges: **Top Match** for the 2 primary matches and **Explore Also** for the 2 adjacent matches.
4. **Field Diversity & Breadth Guarantee**: Enforce that the 4 generated recommendations span multiple fields—presenting 2 primary matches directly aligned with the student's core curiosity and 2 adjacent field pathways that encourage healthy, low-pressure exploration.
5. **Grounded Rationale Summaries**: Expand each card summary into a grounded rationale explaining real day-to-day responsibilities and directly referencing the student's intake choices (natural task preferences, work environment, and thinking style).
6. **3-Stage Milestone Progression**: Add a clear, 3-stage career progression to every card familiar in Thailand:
   - **Stage 1 (Education)**: What to study in college (standard bachelor's degree / major).
   - **Stage 2 (Entry Job)**: Common first job after graduation (entry-level role, 0–2 years).
   - **Stage 3 (Growth Role)**: Later career role (mid-to-senior specialization, 3–5+ years).
7. **Permanent Advisory Reassurance & Zero Jargon**: The "suggestions, not decisions" exploratory notice and the school Advisor reminder remain permanently visible on the results screen. Absolute prohibition of all clinical and technical jargon (triage, dossier, counselor, fit score, algorithm, LLM, model, prompts, schema, API, tokens) on screen and in print.
8. **Print Layout Overhaul & Printable Header (`PrintHeader.tsx`, `@media print`)**: Implement a dedicated print stylesheet and header component that automatically expands all 4 cards with complete details, displaying Student Name, Grade Level, Date, persistent Advisor Note, and Sample Data Notice (when mock data is used), while strictly omitting Student ID for privacy.

---

## 2. Scope & Boundary Clarifications

Feature 14 focuses on suggestions simplification, catalog whitelisting, defensive route validation, milestone progression, and print layout optimization.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     FEATURE 14 BOUNDARY MAP                                      │
├──────────────────────────────────────┬───────────────────────────────────────────────────────────┤
│          IN SCOPE (Feature 14)       │               DEFERRED (Downstream Features)              │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ • Curated static career catalog      │ • Populating Thai university admission registries         │
│   (src/data/careerCatalog.ts)        │   (TCAS rounds 1-4, quotas, verified minimum GPAs)        │
│ • 8 approved broad career fields     │   --> Deferred to feature/9-thai-university-scaffold      │
│ • Full whitelist of common Thai jobs │ • Database persistence of student submissions, reviews,   │
│   and standard university majors     │   and generated pathways into PostgreSQL via Prisma       │
│ • Defensive route catalog check &    │   --> Deferred to feature/10-advisor-dashboard-db         │
│   automatic sample fallback in route │ • Advisor dashboard multi-student filtering, search,      │
│ • Removal of percentage fit scores   │   and cohort analytics views                              │
│ • Locked qualitative badges:         │   --> Deferred to feature/10-advisor-dashboard-db         │
│   "Top Match" & "Explore Also"       │ • Global copy tone audits and Flesch-Kincaid              │
│ • 2 primary + 2 adjacent breadth rule│   readability optimization across landing pages           │
│ • 3-stage milestone progression      │   --> Deferred to feature/11-ux-copy-and-simplification   │
│ • Grounded intake rationale summaries│                                                           │
│ • Permanent "suggestions, not        │                                                           │
│   decisions" & Advisor notice        │                                                           │
│ • PrintHeader component              │                                                           │
│ • Privacy guard (omit Student ID)    │                                                           │
│ • Overhauled @media print stylesheet │                                                           │
│ • Zero technical terms on screen/print│                                                          │
│ • Unit tests for catalog & cards     │                                                           │
└──────────────────────────────────────┴───────────────────────────────────────────────────────────┘
```

### Explicitly In Scope
- **Catalog Whitelist**: `src/data/careerCatalog.ts` defining the 8 approved fields, standard roles, standard university majors, and 3-stage progression models.
- **Full Catalog Listing**: Complete, readable list of all approved roles and majors across the 8 fields in the contract for user approval.
- **Route Catalog Validation Guardrail**: `src/app/api/guide/route.ts` checking every role title, major, and the 2 primary + 2 adjacent distribution, falling back to sample data with the sample notice if any check fails.
- **Mock Results Update**: `src/data/mockCareerResults.ts` providing compliant mock recommendations with catalog roles, 2 Top Match + 2 Explore Also, and 3-stage milestones.
- **Career TypeScript Contracts**: `src/types/career.ts` updated with `QualitativeBadge`, `CareerMilestones`, `ApprovedField`, and purged `fitScore`.
- **Career Match Card Refinements**: `src/components/results/CareerMatchCard.tsx` updated with qualitative badges, 3-stage milestone visual component, grounded rationale, and no percentages.
- **Results Coordinator**: `src/components/results/ResultsContainer.tsx` integrating `PrintHeader` and permanent advisory notices.
- **Printable Header Component**: `src/components/results/PrintHeader.tsx` displaying student name, grade, date, advisor note, sample data notice, and strictly omitting Student ID.
- **Print Stylesheet Overhaul**: `src/styles/globals.css` and `src/app/globals.css` updated with `@media print` rules for auto-expansion, clean page breaks, and high-contrast typography.
- **Unit Test Suites**: `tests/unit/careerCatalog.test.ts` and `tests/unit/resultsCardRefinements.test.ts`.

### Explicitly Out of Scope
- **Thai University Admission Registries**: Scraping or maintaining TCAS 1-4 admission criteria, minimum scores, tuition schedules, or verified university faculties is deferred to `feature/9-thai-university-scaffold`.
- **Database Persistence**: Saving student intake submissions, advisor session notes, or generated pathways to PostgreSQL via Prisma is deferred to `feature/10-advisor-dashboard-db`.
- **Advisor Authentication & Portal**: Multi-user login, student search, role-based access, and advisor dashboards are deferred to `feature/10-advisor-dashboard-db`.
- **Global Copy Harmonization**: End-to-end readability scoring of landing pages and legal disclaimers is deferred to `feature/11-ux-copy-and-simplification`.

---

## 3. Forbidden Terminology & Legacy Jargon Purge Matrix

Feature 14 establishes a comprehensive zero-jargon rule across all user-facing views, code symbols, API responses, and printed documents:

```
┌─────────────────────────────────┬─────────────────────────────┬────────────────────────────────────────────────────────┐
│ Prohibited Token / Pattern      │ Feature 14 Replacement      │ Educational & Psychological Justification              │
├─────────────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Percentage Fit Scores           │ Locked Qualitative Badges   │ Eradicates false statistical certainty that triggers   │
│ (e.g., "95% Natural Fit")       │ ("Top Match", "Explore Also")│ test anxiety and invalid "pass/fail" student mindsets. │
├─────────────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Moonshot Trajectory             │ Explore Also                │ Removes Silicon Valley startup jargon; re-centers on   │
│                                 │ (Adjacent Field Pathway)    │ low-pressure curiosity and interdisciplinary options.  │
├─────────────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Interdisciplinary Pivot         │ Explore Also                │ Eliminates corporate buzzwords; reframes as broadening │
│                                 │ (Adjacent Field Pathway)    │ horizons and connecting complementary disciplines.     │
├─────────────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Primary Direct Match            │ Top Match                   │ Simplifies terminology for students and parents;       │
│                                 │ (Primary Focus Pathway)     │ highlights direct alignment without clinical formality.│
├─────────────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ High-Growth Pathway             │ Top Match / Explore Also    │ Removes speculative economic jargon from primary match │
│                                 │ (Catalog Field Focus)       │ badges while retaining practical career stability info.│
├─────────────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Clinical & Medical Tokens       │ Educational Guidance /      │ Removes medical trauma and emergency room sorting      │
│ (triage, counselor, dossier)    │ Advisor / Pathways          │ imagery that causes acute distress to students.        │
├─────────────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ AI & Software Architecture Jargon│ Plain Language Guidance     │ High school students and parents should never see      │
│ (LLM, model, prompts, schema,   │ (e.g., "discovery guide",   │ engineering terms in error messages, card summaries,   │
│ API, tokens, JSON, RFC)         │  "pathway recommendations") │ or printed advisory reports.                           │
├─────────────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Student ID on Printed Output    │ Strictly Omitted            │ Protects student data privacy on physical paper and    │
│ (e.g., "STU-88412")             │ from Print View             │ shared PDF documents brought to family discussions.    │
└─────────────────────────────────┴─────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 4. Architecture & Defensive Data Flow

The following sequence illustrates how intake data is synthesized, validated against the catalog whitelist by the API route guardrail, and rendered on screen and in print:

```mermaid
sequenceDiagram
  autonumber
  actor Student as Student / Advisor
  participant UI as ResultsContainer
  participant Card as CareerMatchCard
  participant Print as PrintHeader
  participant Route as POST /api/guide
  participant Catalog as CareerCatalog (Whitelist)
  participant LLM as Gemini 2.5 Flash
  participant Mock as MockCareerResults (Sample Data)

  Student->>Route: Submit Intake Answers & StudentProfile
  Route->>Catalog: Retrieve Catalog Whitelist & Approved Fields
  
  alt GEMINI_API_KEY valid & configured
    Route->>LLM: Generate Content (Constrained Prompt with Whitelist)
    LLM-->>Route: Raw JSON Output
    Note over Route: DEFENSIVE CATALOG GUARDRAIL:<br/>1. Check all 4 roleTitles against Catalog<br/>2. Check all majors against Catalog<br/>3. Verify spread: 2 Top Match + 2 Explore Also<br/>4. Verify breadth: at least 2 distinct broad fields
    alt All Catalog Checks PASS
      Route-->>UI: 200 OK (Validated AI Result, fallbackUsed: false)
    else Any Title/Major Invalid OR Spread Incorrect
      Note over Route: Guardrail Triggered! Discard AI output<br/>Log warning and activate sample fallback
      Route->>Mock: getMockCareerResults(payload)
      Mock-->>Route: Sample Data (fallbackUsed: true)
      Route-->>UI: 200 OK (Sample Data Result, fallbackUsed: true)
    end
  else GEMINI_API_KEY absent or mock mode
    Route->>Mock: getMockCareerResults(payload)
    Mock-->>Route: Sample Data (fallbackUsed: true)
    Route-->>UI: 200 OK (Sample Data Result, fallbackUsed: true)
  end

  UI->>Print: Mount PrintHeader (Name, Grade, Date, Advisor Note; NO Student ID; Sample Notice if fallbackUsed)
  UI->>Card: Render 4 Cards (Collapsed by default, Badged Top Match / Explore Also)
  
  alt Student interacts on screen
    Note over UI: "Suggestions, not decisions" banner &<br/>Advisor reminder permanently visible
    Student->>Card: Click "View pathway details"
    Card-->>Student: Expand card details (Milestones, Daily Tasks, Study Path, Trial Courses)
  else Student activates Print / Save as PDF
    Student->>UI: Click "Print or Save as PDF" (window.print())
    Note over UI,Card: @media print stylesheet takes effect:<br/>1. PrintHeader becomes visible at page top<br/>2. All 4 cards automatically expand fully<br/>3. Buttons, toggles, chevrons hidden (.no-print)<br/>4. High-contrast typography & page-break isolation applied<br/>5. Zero technical jargon on paper
    UI-->>Student: Browser Print Preview Dialog (Clean PDF / Paper Output)
  end
```

---

## 5. Module 1: Curated Static Career Catalog Whitelist (`src/data/careerCatalog.ts`)

### 5.1 The 8 Approved Broad Fields

The curated catalog partitions all career exploration across exactly 8 approved fields:
1. **Engineering & Technology** (วิศวกรรมและเทคโนโลยี)
2. **Healthcare & Life Sciences** (การแพทย์และวิทยาศาสตร์สุขภาพ)
3. **Business & Economics** (บริหารธุรกิจและเศรษฐศาสตร์)
4. **Design & Creative Arts** (การออกแบบและศิลปะสร้างสรรค์)
5. **Communication & Humanities** (นิเทศศาสตร์และมนุษยศาสตร์)
6. **Social Sciences & Law** (สังคมศาสตร์และนิติศาสตร์)
7. **Hospitality & Tourism** (การโรงแรมและการท่องเที่ยว)
8. **Environmental & Agricultural Sciences** (สิ่งแวดล้อมและเกษตรศาสตร์)

### 5.2 Catalog Data Structure & Whitelist Schema

```typescript
// src/data/careerCatalog.ts

export type ApprovedField =
  | 'Engineering & Technology'
  | 'Healthcare & Life Sciences'
  | 'Business & Economics'
  | 'Design & Creative Arts'
  | 'Communication & Humanities'
  | 'Social Sciences & Law'
  | 'Hospitality & Tourism'
  | 'Environmental & Agricultural Sciences';

export interface CareerMilestones {
  education: string;  // Stage 1: What to study in college (Bachelor's major & core coursework)
  entryRole: string;  // Stage 2: Common first job after graduation (0-2 years)
  growthRole: string; // Stage 3: Later career role (3-5+ years specialization/leadership)
}

export interface CatalogCareerEntry {
  id: string;
  roleTitle: string;
  field: ApprovedField;
  standardMajors: string[];
  milestones: CareerMilestones;
  defaultTasks: string[];
  dayInTheLifeSummary: string;
}
```

### 5.3 Complete Whitelisted Job Titles and Standard Majors (Familiar in Thailand)

The full list below represents the confirmed, immutable static whitelist for all 8 fields. Every role and university major has been selected for common, everyday familiarity in Thailand and standard bachelor's degree curricula:

```
====================================================================================================
1. FIELD: Engineering & Technology (วิศวกรรมและเทคโนโลยี)
====================================================================================================
Standard University Majors:
  • Computer Engineering (วิศวกรรมคอมพิวเตอร์)
  • Computer Science (วิทยาการคอมพิวเตอร์)
  • Information Technology (เทคโนโลยีสารสนเทศ)
  • Software Engineering (วิศวกรรมซอฟต์แวร์)
  • Data Science and Analytics (วิทยาการข้อมูลและการวิเคราะห์)
  • Electrical Engineering (วิศวกรรมไฟฟ้า)

Curated Everyday Job Titles:
  1. Software Developer (นักพัฒนาซอฟต์แวร์)
     - Stage 1: Bachelor of Science in Computer Science or Software Engineering
     - Stage 2: Junior Software Engineer or Front-End Developer (0–2 years)
     - Stage 3: Lead Software Architect or Engineering Team Lead (3–5+ years)
     - Daily Work: Writes and tests clean code for web and mobile apps; fixes bugs in development setups.
  2. Network & Cloud Systems Administrator (ผู้ดูแลระบบเครือข่ายและคลาวด์)
     - Stage 1: Bachelor of Science in Information Technology or Network Systems
     - Stage 2: Systems Support Specialist or Junior Cloud Operations Associate (0–2 years)
     - Stage 3: Cloud Infrastructure Architect or Senior Systems Administrator (3–5+ years)
     - Daily Work: Configures servers and cloud connections; monitors system health and schedules backups.
  3. Data Analyst (นักวิเคราะห์ข้อมูล)
     - Stage 1: Bachelor of Science in Data Science, Applied Statistics, or Information Systems
     - Stage 2: Junior Data Analyst or Reporting Specialist (0–2 years)
     - Stage 3: Senior Business Intelligence Analyst or Analytics Manager (3–5+ years)
     - Daily Work: Cleans data with SQL and spreadsheets; builds clear visual dashboards for decision-makers.
  4. Web Developer (นักพัฒนาเว็บไซต์)
     - Stage 1: Bachelor of Science in Information Technology or Computer Science
     - Stage 2: Junior Web Developer or UI Implementation Specialist (0–2 years)
     - Stage 3: Senior Full-Stack Developer or Web Solutions Lead (3–5+ years)
     - Daily Work: Builds responsive website layouts; optimizes page loading speed and mobile navigation.
  5. IT Support Specialist (เจ้าหน้าที่สนับสนุนไอที / ผู้เชี่ยวชาญด้านบริการสารสนเทศ)
     - Stage 1: Bachelor of Science in Information Technology or Computer Systems
     - Stage 2: Helpdesk Support Technician or On-Site IT Coordinator (0–2 years)
     - Stage 3: IT Operations Supervisor or Technical Support Manager (3–5+ years)
     - Daily Work: Troubleshoots workplace hardware, software, and network issues for employees.
  6. Cybersecurity Specialist (เจ้าหน้าที่ความปลอดภัยทางไซเบอร์)
     - Stage 1: Bachelor of Science in Computer Engineering or Cybersecurity
     - Stage 2: Junior Security Operations Center (SOC) Analyst (0–2 years)
     - Stage 3: Information Security Manager or Cybersecurity Consultant (3–5+ years)
     - Daily Work: Reviews security access logs; runs automated vulnerability scans to protect digital data.

====================================================================================================
2. FIELD: Healthcare & Life Sciences (การแพทย์และวิทยาศาสตร์สุขภาพ)
====================================================================================================
Standard University Majors:
  • Public Health (สาธารณสุขศาสตร์)
  • Medical Technology (เทคนิคการแพทย์)
  • Health Informatics (สารสนเทศสุขภาพ)
  • Food Science and Nutrition (วิทยาศาสตร์และเทคโนโลยีการอาหาร / โภชนาการ)
  • Occupational Health and Safety (อาชีวอนามัยและความปลอดภัย)
  • Physical Therapy (กายภาพบำบัด)

Curated Everyday Job Titles:
  1. Public Health Coordinator (เจ้าหน้าที่สาธารณสุข / ผู้ประสานงานด้านสุขภาพชุมชน)
     - Stage 1: Bachelor of Science in Public Health or Community Health Science
     - Stage 2: Community Health Assistant or Health Outreach Associate (0–2 years)
     - Stage 3: Public Health Program Manager or Health Policy Director (3–5+ years)
     - Daily Work: Coordinates preventive health workshops, vaccine drives, and local health surveys.
  2. Medical Laboratory Technologist (นักเทคนิคการแพทย์)
     - Stage 1: Bachelor of Science in Medical Technology or Biomedical Science
     - Stage 2: Junior Laboratory Technologist (0–2 years)
     - Stage 3: Senior Clinical Lab Supervisor or Laboratory Quality Specialist (3–5+ years)
     - Daily Work: Runs diagnostic blood and tissue tests using lab analyzers; calibrates diagnostic instruments.
  3. Health Data & Informatics Specialist (เจ้าหน้าที่ข้อมูลสารสนเทศสุขภาพ / นักเวชระเบียน)
     - Stage 1: Bachelor of Science in Health Informatics or Health Information Management
     - Stage 2: Health Records Coordinator or Junior EHR Systems Specialist (0–2 years)
     - Stage 3: Director of Clinical Informatics or Healthcare Systems Administrator (3–5+ years)
     - Daily Work: Manages digital patient records in hospitals; audits electronic health record workflows.
  4. Nutritionist & Dietitian Assistant (ผู้ช่วยนักโภชนาการและกำหนดอาหาร)
     - Stage 1: Bachelor of Science in Food Science and Nutrition or Clinical Dietetics
     - Stage 2: Assistant Nutritionist or Dietary Program Associate (0–2 years)
     - Stage 3: Senior Clinical Dietitian or Wellness Nutrition Consultant (3–5+ years)
     - Daily Work: Designs balanced meal plans; educates patients on nutrition for managing wellness.
  5. Occupational Health & Safety Officer (เจ้าหน้าที่ความปลอดภัยในการทำงาน - จป.วิชาชีพ)
     - Stage 1: Bachelor of Science in Occupational Health and Safety
     - Stage 2: Workplace Safety Officer (จป. วิชาชีพ ระดับปฏิบัติการ) (0–2 years)
     - Stage 3: Health, Safety, and Environment (HSE) Manager (3–5+ years)
     - Daily Work: Inspects workplace environments; enforces safety regulations and conducts emergency drills.
  6. Physical Therapy Associate (ผู้ช่วยนักกายภาพบำบัด)
     - Stage 1: Bachelor of Science in Physical Therapy or Rehabilitation Science
     - Stage 2: Staff Physical Therapist or Clinic Rehabilitation Assistant (0–2 years)
     - Stage 3: Senior Rehabilitation Specialist or Clinical PT Director (3–5+ years)
     - Daily Work: Guides patients through rehabilitation exercises; assists individuals recovering mobility.

====================================================================================================
3. FIELD: Business & Economics (บริหารธุรกิจและเศรษฐศาสตร์)
====================================================================================================
Standard University Majors:
  • Business Administration (บริหารธุรกิจ)
  • Marketing (การตลาด)
  • Finance and Banking (การเงินและการธนาคาร)
  • Accounting (การบัญชี)
  • Logistics and Supply Chain Management (การจัดการโลจิสติกส์และโซ่อุปทาน)
  • Economics (เศรษฐศาสตร์)

Curated Everyday Job Titles:
  1. Digital Marketing & Growth Specialist (นักการตลาดดิจิทัล)
     - Stage 1: Bachelor of Business Administration in Marketing or Digital Media
     - Stage 2: Marketing Assistant or Social Media Coordinator (0–2 years)
     - Stage 3: Digital Marketing Strategy Lead or Brand Manager (3–5+ years)
     - Daily Work: Creates social media campaigns; tracks online visitor engagement and advertising results.
  2. Financial Analyst (นักวิเคราะห์การเงิน)
     - Stage 1: Bachelor of Business Administration in Finance or Economics
     - Stage 2: Junior Financial Analyst or Budget Associate (0–2 years)
     - Stage 3: Senior Investment Analyst or Corporate Finance Manager (3–5+ years)
     - Daily Work: Evaluates budgets, revenues, and quarterly expenses in spreadsheets; drafts forecasts.
  3. Human Resources & Talent Specialist (เจ้าหน้าที่บริหารงานบุคคล / HR)
     - Stage 1: Bachelor of Business Administration in Human Resource Management or Psychology
     - Stage 2: HR Assistant or Recruiting Coordinator (0–2 years)
     - Stage 3: Senior HR Business Partner or People Operations Director (3–5+ years)
     - Daily Work: Schedules job interviews; welcomes new hires and organizes staff development training.
  4. Supply Chain & Logistics Coordinator (เจ้าหน้าที่บริหารห่วงโซ่อุปทานและโลจิสติกส์)
     - Stage 1: Bachelor of Business Administration in Logistics and Supply Chain Management
     - Stage 2: Logistics Operations Assistant or Warehouse Coordinator (0–2 years)
     - Stage 3: Supply Chain Manager or Regional Logistics Director (3–5+ years)
     - Daily Work: Coordinates product shipments and delivery schedules; tracks warehouse inventory levels.
  5. Accountant & Financial Auditor (นักบัญชี / ผู้ตรวจสอบบัญชี)
     - Stage 1: Bachelor of Accountancy (B.Acc.)
     - Stage 2: Junior Accountant or Audit Associate (0–2 years)
     - Stage 3: Senior Certified Public Accountant (CPA) or Accounting Controller (3–5+ years)
     - Daily Work: Reconciles company bank accounts; prepares balance sheets and verifies tax compliance.
  6. Business Development Associate (เจ้าหน้าที่พัฒนาธุรกิจ / ธุรการฝ่ายขาย)
     - Stage 1: Bachelor of Business Administration in International Business or Management
     - Stage 2: Business Development Assistant or Client Relations Associate (0–2 years)
     - Stage 3: Business Development Director or Commercial Partnership Lead (3–5+ years)
     - Daily Work: Researches new market opportunities; prepares partnership proposals and client pitch decks.

====================================================================================================
4. FIELD: Design & Creative Arts (การออกแบบและศิลปะสร้างสรรค์)
====================================================================================================
Standard University Majors:
  • Visual Communication Design (การออกแบบการสื่อสาร / ออกแบบนิเทศศิลป์)
  • Industrial Design (การออกแบบอุตสาหกรรม)
  • Digital Media and Interactive Arts (ดิจิทัลมีเดียและศิลปะสื่อประสม)
  • Interior Design (การออกแบบภายใน)
  • Animation and Multimedia (แอนิเมชันและมัลติมีเดีย)
  • Fine and Applied Arts (ศิลปกรรมศาสตร์และประยุกต์ศิลป์)

Curated Everyday Job Titles:
  1. UI/UX & Product Designer (นักออกแบบ UI/UX และผลิตภัณฑ์ดิจิทัล)
     - Stage 1: Bachelor of Fine Arts in Visual Communication Design or Interactive Media
     - Stage 2: Junior UI/UX Designer or Graphic Design Associate (0–2 years)
     - Stage 3: Lead Product Designer or Design Systems Director (3–5+ years)
     - Daily Work: Sketches wireframes and prototypes for apps; conducts user usability feedback sessions.
  2. Graphic & Brand Designer (นักออกแบบกราฟิกและแบรนด์)
     - Stage 1: Bachelor of Fine Arts in Graphic Design or Visual Communication
     - Stage 2: Junior Graphic Designer or Visual Production Artist (0–2 years)
     - Stage 3: Creative Director or Senior Brand Strategist (3–5+ years)
     - Daily Work: Creates logos, brand identity guidelines, marketing banners, and packaging layouts.
  3. Multimedia Content Producer (ผู้ผลิตเนื้อหามัลติมีเดีย / นักตัดต่อวิดีโอ)
     - Stage 1: Bachelor of Arts in Digital Media, Animation, or Multimedia Arts
     - Stage 2: Video Editor or Motion Graphics Animator (0–2 years)
     - Stage 3: Senior Multimedia Producer or Studio Production Manager (3–5+ years)
     - Daily Work: Edits video footage and audio; adds subtitles, visual effects, and animated graphics.
  4. Interior & Exhibition Designer (นักออกแบบภายในและนิทรรศการ)
     - Stage 1: Bachelor of Fine Arts in Interior Design or Architecture
     - Stage 2: Junior Interior Designer or CAD Draftsperson (0–2 years)
     - Stage 3: Senior Interior Architect or Exhibition Design Director (3–5+ years)
     - Daily Work: Draws 3D room floorplans and lighting layouts; selects furniture, tiles, and materials.
  5. Motion Graphics Animator (นักสร้างภาพเคลื่อนไหวและแอนิเมชัน)
     - Stage 1: Bachelor of Arts in Animation, Multimedia, or Computer Graphic Art
     - Stage 2: Junior 2D/3D Animator or Motion Artist (0–2 years)
     - Stage 3: Senior Animation Director or Lead Motion Designer (3–5+ years)
     - Daily Work: Creates animated title intros, character movements, and explainer video animations.
  6. Industrial Product Designer (นักออกแบบผลิตภัณฑ์อุตสาหกรรม)
     - Stage 1: Bachelor of Industrial Design (B.I.D.) or Applied Art
     - Stage 2: Assistant Product Designer or 3D Modeler (0–2 years)
     - Stage 3: Lead Industrial Design Specialist or Product Development Lead (3–5+ years)
     - Daily Work: Sketches concepts for physical consumer goods, home appliances, and ergonomic tools.

====================================================================================================
5. FIELD: Communication & Humanities (นิเทศศาสตร์และมนุษยศาสตร์)
====================================================================================================
Standard University Majors:
  • Communication Arts / Mass Communication (นิเทศศาสตร์ / วารสารศาสตร์และสื่อสารมวลชน)
  • Public Relations (การประชาสัมพันธ์)
  • English for Communication (ภาษาอังกฤษเพื่อการสื่อสาร)
  • Language and Linguistics (ภาษาและภาษาศาสตร์)
  • Translation and Interpretation (การแปลและการล่าม)
  • Japanese / Chinese for Business Communication (ภาษาญี่ปุ่น / ภาษาจีนเพื่อการสื่อสารธุรกิจ)

Curated Everyday Job Titles:
  1. Public Relations & Communications Specialist (เจ้าหน้าที่สื่อสารองค์กรและประชาสัมพันธ์)
     - Stage 1: Bachelor of Arts in Mass Communication, Public Relations, or Strategic Communication
     - Stage 2: Communications Assistant or PR Coordinator (0–2 years)
     - Stage 3: Communications Director or Corporate Spokesperson (3–5+ years)
     - Daily Work: Drafts official press releases; coordinates news announcements and community outreach.
  2. Technical Writer & Content Strategist (นักเขียนเนื้อหาและผู้เชี่ยวชาญด้านคู่มือเชิงเทคนิค)
     - Stage 1: Bachelor of Arts in English for Communication, Linguistics, or Journalism
     - Stage 2: Junior Technical Writer or Documentation Specialist (0–2 years)
     - Stage 3: Senior Content Strategist or Documentation Team Lead (3–5+ years)
     - Daily Work: Writes step-by-step user manuals and how-to guides in simple, accessible language.
  3. Translator & Localization Specialist (นักแปลและผู้ประสานงานด้านภาษา)
     - Stage 1: Bachelor of Arts in Translation Studies, Applied Linguistics, or Foreign Languages
     - Stage 2: Assistant Translator or Localization Coordinator (0–2 years)
     - Stage 3: Lead Localization Manager or Senior Conference Interpreter (3–5+ years)
     - Daily Work: Translates documents, websites, and subtitles between languages; ensures cultural nuance.
  4. Digital Journalist & Media Reporter (นักข่าวสารสนเทศดิจิทัล / คอนเทนต์ครีเอเตอร์)
     - Stage 1: Bachelor of Arts in Journalism, Mass Media, or Digital Broadcasting
     - Stage 2: Junior Reporter or Digital Content Writer (0–2 years)
     - Stage 3: Senior Editor or Editorial Department Producer (3–5+ years)
     - Daily Work: Interviews people for stories; writes articles and checks facts for online news channels.
  5. Corporate Event Producer (โปรดิวเซอร์สื่อและกิจกรรมองค์กร)
     - Stage 1: Bachelor of Arts in Communication Arts or Strategic Event Management
     - Stage 2: Event Assistant or Media Production Coordinator (0–2 years)
     - Stage 3: Senior Corporate Event Director or Production Manager (3–5+ years)
     - Daily Work: Coordinates technical equipment, stage schedules, and speaker briefings for live events.
  6. Foreign Language Coordinator (เจ้าหน้าที่ประสานงานภาษาต่างประเทศ)
     - Stage 1: Bachelor of Arts in East Asian Languages (Japanese/Chinese) or English
     - Stage 2: Bilingual Customer Coordinator or International Liaison Assistant (0–2 years)
     - Stage 3: International Relations Lead or Foreign Operations Supervisor (3–5+ years)
     - Daily Work: Handles international emails and phone calls; assists foreign visitors and translates contracts.

====================================================================================================
6. FIELD: Social Sciences & Law (สังคมศาสตร์และนิติศาสตร์)
====================================================================================================
Standard University Majors:
  • Law (LL.B.) (นิติศาสตร์)
  • Political Science and International Relations (รัฐศาสตร์และความสัมพันธ์ระหว่างประเทศ)
  • Public Administration (รัฐประศาสนศาสตร์)
  • Social Work (สังคมสงเคราะห์ศาสตร์)
  • Sociology and Anthropology (สังคมวิทยาและมานุษยวิทยา)
  • Urban Planning and Community Development (การผังเมืองและการพัฒนาชุมชน)

Curated Everyday Job Titles:
  1. Legal Compliance Officer (เจ้าหน้าที่ฝ่ายกำกับดูแลและปฏิบัติตามกฎหมาย)
     - Stage 1: Bachelor of Laws (LL.B.) or Public Administration
     - Stage 2: Junior Compliance Assistant or Legal Research Associate (0–2 years)
     - Stage 3: Chief Compliance Officer or Senior Regulatory Affairs Counsel (3–5+ years)
     - Daily Work: Reviews company contracts against government regulations; verifies privacy practices.
  2. Community Development & Policy Officer (เจ้าหน้าที่พัฒนาชุมชนและนโยบายสังคม)
     - Stage 1: Bachelor of Arts in Political Science, Sociology, or Social Work
     - Stage 2: Community Project Officer or Field Research Assistant (0–2 years)
     - Stage 3: Regional Development Director or Social Policy Analyst (3–5+ years)
     - Daily Work: Runs neighborhood surveys; organizes community workshops to improve public local services.
  3. Social Worker & Youth Counselor (นักสังคมสงเคราะห์และที่ปรึกษาเยาวชน)
     - Stage 1: Bachelor of Social Work (BSW) or Developmental Psychology
     - Stage 2: Casework Assistant or Youth Program Coordinator (0–2 years)
     - Stage 3: Licensed Senior Social Worker or Family Services Supervisor (3–5+ years)
     - Daily Work: Connects students and families with community resources, scholarships, and family support.
  4. Human Rights & Advocacy Assistant (ผู้ช่วยประสานงานด้านสิทธิมนุษยชนและองค์กรพัฒนาเอกชน)
     - Stage 1: Bachelor of Laws (LL.B.) or Political Science
     - Stage 2: Advocacy Assistant or Non-Profit Project Coordinator (0–2 years)
     - Stage 3: Human Rights Program Director or Senior Legal Advocate (3–5+ years)
     - Daily Work: Coordinates non-profit education campaigns; documents civil rights complaints.
  5. Urban & Regional Planning Assistant (ผู้ช่วยนักผังเมืองและพัฒนาพื้นที่)
     - Stage 1: Bachelor of Science in Urban Planning or Regional Geography
     - Stage 2: Assistant Urban Planner or GIS Mapping Associate (0–2 years)
     - Stage 3: Senior Urban Planning Consultant or City Planning Director (3–5+ years)
     - Daily Work: Analyzes city traffic and green space maps; drafts proposals for walkable public spaces.
  6. Public Affairs Associate (เจ้าหน้าที่วิเทศสัมพันธ์และกิจการสาธารณะ)
     - Stage 1: Bachelor of Arts in Political Science or Public Administration
     - Stage 2: Public Affairs Assistant or Community Liaison (0–2 years)
     - Stage 3: Public Affairs Director or Government Relations Manager (3–5+ years)
     - Daily Work: Prepares informational briefings for public agencies; coordinates community feedback meetings.

====================================================================================================
7. FIELD: Hospitality & Tourism (การโรงแรมและการท่องเที่ยว)
====================================================================================================
Standard University Majors:
  • Hospitality and Hotel Management (การจัดการการโรงแรมและบริการ)
  • Tourism Management (การจัดการการท่องเที่ยว)
  • Convention and Event Management (การจัดการการประชุมและนิทรรศการ / MICE)
  • Aviation Business and Services (ธุรกิจการบิน)
  • Culinary Arts and Kitchen Administration (ศิลปะการประกอบอาหารและการจัดการ)
  • Cultural Heritage Tourism (การท่องเที่ยวเชิงวัฒนธรรมและมรดกชุมชน)

Curated Everyday Job Titles:
  1. Hotel & Resort Operations Supervisor (หัวหน้างานฝ่ายปฏิบัติการโรงแรมและรีสอร์ต)
     - Stage 1: Bachelor of Arts in Hospitality and Hotel Management
     - Stage 2: Front Desk Associate or Guest Services Supervisor (0–2 years)
     - Stage 3: Hotel General Manager or Regional Operations Director (3–5+ years)
     - Daily Work: Welcomes guests at check-in; coordinates housekeeping and guest amenities.
  2. Event & Conference Coordinator (ผู้ประสานงานจัดงานประชุมและอีเวนต์)
     - Stage 1: Bachelor of Arts in Event Management or Hospitality Administration
     - Stage 2: Assistant Event Planner or Venue Logistics Coordinator (0–2 years)
     - Stage 3: Senior Event Producer or Convention Services Director (3–5+ years)
     - Daily Work: Plans conference schedules, catering menus, and audiovisual stage equipment.
  3. Sustainable Tourism & Ecotourism Specialist (ผู้เชี่ยวชาญการท่องเที่ยวเชิงอนุรักษ์และชุมชน)
     - Stage 1: Bachelor of Science in Sustainable Tourism or Environmental Heritage
     - Stage 2: Ecotour Guide Coordinator or Travel Itinerary Planner (0–2 years)
     - Stage 3: Sustainable Destination Manager or Regional Tourism Board Director (3–5+ years)
     - Daily Work: Designs travel itineraries supporting local village artisans; promotes park conservation.
  4. Airline Ground Operations Associate (เจ้าหน้าที่บริการภาคพื้นการบิน)
     - Stage 1: Bachelor of Arts in Aviation Business Management or Hospitality
     - Stage 2: Airport Customer Service Agent or Gate Boarding Associate (0–2 years)
     - Stage 3: Airport Ground Operations Supervisor or Terminal Duty Manager (3–5+ years)
     - Daily Work: Assists travelers at boarding gates; assists with flight connections and baggage routing.
  5. Food & Beverage Operations Coordinator (ผู้ประสานงานฝ่ายบริการอาหารและเครื่องดื่ม)
     - Stage 1: Bachelor of Arts in Hospitality Management or Culinary Arts Administration
     - Stage 2: Restaurant Supervisor or Banquet Operations Assistant (0–2 years)
     - Stage 3: Food and Beverage Director or Multi-Unit Restaurant Manager (3–5+ years)
     - Daily Work: Oversees dining room service standards; monitors food safety and ingredient inventory.
  6. Travel Experience & Itinerary Planner (นักออกแบบโปรแกรมการเดินทางและนำเที่ยว)
     - Stage 1: Bachelor of Arts in Tourism Management or Cultural Geography
     - Stage 2: Travel Consultant or Tour Operations Assistant (0–2 years)
     - Stage 3: Senior Travel Product Manager or Inbound Tourism Agency Director (3–5+ years)
     - Daily Work: Researches cultural landmarks, boutique hotels, and transport routes to craft tour packages.

====================================================================================================
8. FIELD: Environmental & Agricultural Sciences (สิ่งแวดล้อมและเกษตรศาสตร์)
====================================================================================================
Standard University Majors:
  • Environmental Science (วิทยาศาสตร์สิ่งแวดล้อม)
  • Agricultural Science and Technology (วิทยาศาสตร์และเทคโนโลยีการเกษตร)
  • Smart Agriculture and Precision Farming (เกษตรอัจฉริยะ)
  • Renewable Energy and Clean Technology (พลังงานทดแทนและเทคโนโลยีสะอาด)
  • Forestry and Natural Resources (วนศาสตร์และทรัพยากรธรรมชาติ)
  • Agribusiness and Agricultural Economics (ธุรกิจการเกษตรและเศรษฐศาสตร์เกษตร)

Curated Everyday Job Titles:
  1. Environmental Quality & Sustainability Officer (เจ้าหน้าที่ควบคุมคุณภาพสิ่งแวดล้อมและความยั่งยืน)
     - Stage 1: Bachelor of Science in Environmental Science or Environmental Engineering
     - Stage 2: Junior Environmental Inspector or Sustainability Associate (0–2 years)
     - Stage 3: Director of Environmental Health and Safety or Chief Sustainability Officer (3–5+ years)
     - Daily Work: Samples water, soil, and air quality; inspects facilities for recycling and waste compliance.
  2. Smart Agricultural Technology Specialist (ผู้เชี่ยวชาญเทคโนโลยีเกษตรอัจฉริยะ)
     - Stage 1: Bachelor of Science in Agricultural Science, Smart Agriculture, or Agronomy
     - Stage 2: Agricultural Field Technician or Crop Monitoring Associate (0–2 years)
     - Stage 3: Precision Agriculture Consultant or Agribusiness Operations Manager (3–5+ years)
     - Daily Work: Sets up automated soil moisture sensors and drone crop scans; advises farmers on irrigation.
  3. Renewable Energy Project Associate (เจ้าหน้าที่ประสานงานโครงการพลังงานหมุนเวียน)
     - Stage 1: Bachelor of Science in Renewable Energy Systems or Clean Technology
     - Stage 2: Solar/Wind Installation Associate or Clean Energy Field Auditor (0–2 years)
     - Stage 3: Renewable Energy Project Development Director (3–5+ years)
     - Daily Work: Evaluates rooftop solar exposure; calculates clean power production estimates and savings.
  4. Forestry & Conservation Park Officer (เจ้าหน้าที่อนุรักษ์ทรัพยากรป่าไม้และอุทยาน)
     - Stage 1: Bachelor of Science in Forestry (วนศาสตร์) or Natural Resource Conservation
     - Stage 2: Forest Conservation Assistant or National Park Ranger Associate (0–2 years)
     - Stage 3: Chief Park Superintendent or Regional Conservation Director (3–5+ years)
     - Daily Work: Monitors wildlife habitats; oversees tree planting projects and trail conservation.
  5. Soil & Water Quality Field Specialist (นักสำรวจและควบคุมคุณภาพดินและน้ำ)
     - Stage 1: Bachelor of Science in Soil Science, Water Resources, or Agriculture
     - Stage 2: Field Laboratory Technician or Soil Quality Analyst (0–2 years)
     - Stage 3: Agricultural Resource Specialist or Senior Hydrologist (3–5+ years)
     - Daily Work: Conducts field tests on soil nutrients; helps farms prevent fertilizer runoff into canals.
  6. Agribusiness Operations Associate (เจ้าหน้าที่บริหารจัดการธุรกิจการเกษตร)
     - Stage 1: Bachelor of Science in Agribusiness or Agricultural Economics
     - Stage 2: Agricultural Supply Coordinator or Farm Product Sales Associate (0–2 years)
     - Stage 3: Agribusiness Supply Chain Manager or Agricultural Trade Director (3–5+ years)
     - Daily Work: Coordinates crop purchasing between farm cooperatives and food distribution companies.
====================================================================================================
```

### 5.4 Whitelist Helper & Lookup Functions

```typescript
// Helper functions in src/data/careerCatalog.ts

export const APPROVED_FIELDS: ApprovedField[] = [
  'Engineering & Technology',
  'Healthcare & Life Sciences',
  'Business & Economics',
  'Design & Creative Arts',
  'Communication & Humanities',
  'Social Sciences & Law',
  'Hospitality & Tourism',
  'Environmental & Agricultural Sciences',
];

export function getCatalogEntryByTitle(title: string): CatalogCareerEntry | undefined {
  const normalized = title.trim().toLowerCase();
  return CAREER_CATALOG.find((entry) => entry.roleTitle.toLowerCase() === normalized);
}

export function isWhitelistedTitle(title: string): boolean {
  return Boolean(getCatalogEntryByTitle(title));
}

export function isWhitelistedMajor(major: string): boolean {
  const normalized = major.trim().toLowerCase();
  return CAREER_CATALOG.some((entry) =>
    entry.standardMajors.some((m) => m.toLowerCase() === normalized)
  );
}

export function getCareersByField(field: ApprovedField): CatalogCareerEntry[] {
  return CAREER_CATALOG.filter((entry) => entry.field === field);
}

export function getAllWhitelistedTitles(): string[] {
  return CAREER_CATALOG.map((entry) => entry.roleTitle);
}

export function getAllWhitelistedMajors(): string[] {
  const majorsSet = new Set<string>();
  CAREER_CATALOG.forEach((entry) => entry.standardMajors.forEach((m) => majorsSet.add(m)));
  return Array.from(majorsSet).sort();
}
```

---

## 6. Module 2: Results Schema, Defensive Route Guardrail & Fallback

### 6.1 TypeScript Contracts (`src/types/career.ts`)

Percentage fit scores (`fitScore`) and jargon match tiers are completely purged and replaced with locked qualitative badges and 3-stage milestones:

```typescript
// src/types/career.ts
import { StudentProfile, IntakeAnswers } from './intake';
import { ApprovedField, CareerMilestones } from '@/data/careerCatalog';

export type QualitativeBadge = 'Top Match' | 'Explore Also';

export interface TrialCourse {
  title: string;
  provider: string;
  description: string;
  estimatedHours?: number;
  estimated_hours?: number;
  searchQuery?: string;
}

export interface PathwayCard {
  id: string;
  roleTitle: string;                    // Strictly from CAREER_CATALOG whitelist
  broadField: ApprovedField;            // 1 of 8 Approved Fields
  badge: QualitativeBadge;              // "Top Match" or "Explore Also"
  groundedRationale: string;            // Plain-language synthesis linking daily tasks to student's intake answers
  overview: string;                     // 1 calm sentence <= 30 words explaining role core
  milestones: CareerMilestones;         // 3-stage progression (education, entryRole, growthRole)
  dailyTasks: string[];                 // 3-4 concrete daily tasks
  studyPath: string;                    // Foundational coursework <= 65 words
  reassurance: string;                  // Academic friction reassurance <= 65 words
  majors: string[];                     // Standard college majors from catalog
  minors?: string[];                    // Complementary minors
  trialCourses: [TrialCourse, TrialCourse]; // 2 free trial courses
  whereToStudyReady?: boolean;
}

export interface GuideSummary {
  studentArchetype: string;
  narrativeSummary: string;
}

export interface GuideMeta {
  engine: string;
  generationLatencyMs: number;
  fallbackUsed: boolean;
}

export interface GuideResult {
  success: boolean;
  submissionId: string;
  studentProfile: StudentProfile;
  summary: GuideSummary;
  pathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard]; // Exactly 4 cards (2 Top Match, 2 Explore Also)
  meta: GuideMeta;
}
```

### 6.2 Defensive Route Validation & Sample Fallback Guardrail (`src/app/api/guide/route.ts`)

To guarantee 100% adherence to the catalog whitelist and prevent hallucinations or improper distributions from reaching the user, `src/app/api/guide/route.ts` implements a mandatory validation pass:

```typescript
// Validation logic inside src/app/api/guide/route.ts

import { isWhitelistedTitle, isWhitelistedMajor } from '@/data/careerCatalog';
import { getMockCareerResults } from '@/data/mockCareerResults';

export function validateGuideSynthesisResult(synthesisResult: any): boolean {
  const cards = synthesisResult?.pathways;
  if (!Array.isArray(cards) || cards.length !== 4) {
    return false;
  }

  // 1. Check Badges: Must have exactly 2 'Top Match' and 2 'Explore Also'
  const topMatches = cards.filter((c) => c.badge === 'Top Match');
  const exploreAlso = cards.filter((c) => c.badge === 'Explore Also');
  if (topMatches.length !== 2 || exploreAlso.length !== 2) {
    return false;
  }

  // 2. Check Field Diversity: Must span at least 2 distinct broad fields
  const fields = new Set(cards.map((c) => c.broadField));
  if (fields.size < 2) {
    return false;
  }

  // 3. Strict Whitelist Check for every card's title and majors
  for (const card of cards) {
    if (!card.roleTitle || !isWhitelistedTitle(card.roleTitle)) {
      return false; // Title not in catalog whitelist
    }
    if (!Array.isArray(card.majors) || card.majors.length === 0) {
      return false;
    }
    for (const major of card.majors) {
      if (!isWhitelistedMajor(major)) {
        return false; // Major not in catalog whitelist
      }
    }
    // Verify 3-stage milestones presence
    if (
      !card.milestones ||
      !card.milestones.education ||
      !card.milestones.entryRole ||
      !card.milestones.growthRole
    ) {
      return false;
    }
  }

  return true;
}
```

#### Route Execution Rule
When `validateGuideSynthesisResult(aiResult)` returns `false`:
1. The route handler logs a warning (`[GuideRoute] Upstream AI output violated catalog whitelist or field distribution. Activating sample fallback.`).
2. The route immediately calls `getMockCareerResults(payload)`.
3. The response payload has `meta.fallbackUsed = true`.
4. The client receives the compliant mock dataset and displays the explicit **Sample Demonstration Notice** on both the screen and in the printable header.

---

## 7. Module 3: Career Match Card with 3-Stage Progression and Qualitative Badges (`CareerMatchCard.tsx`)

### 7.1 Visual Layout & Badge Hierarchy

The updated `CareerMatchCard` completely eliminates percentage scores and renders locked qualitative badges:
- **`Top Match` Badge**:
  - Screen CSS: `bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold px-3 py-1 text-xs rounded-full`
  - Contrast Ratio: $> 4.8:1$ against background (meets WCAG AA).
- **`Explore Also` Badge**:
  - Screen CSS: `bg-sky-50 text-sky-800 border border-sky-300 font-semibold px-3 py-1 text-xs rounded-full`
  - Contrast Ratio: $> 4.7:1$ against background (meets WCAG AA).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          CareerMatchCard (Collapsed View)                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Top Match] • Engineering & Technology                                                 │
│                                                                                        │
│ Software Developer                                                                     │
│                                                                                        │
│ Overview: Designs, codes, and maintains web applications and digital tools that help   │
│ organizations solve operational challenges.                                            │
│                                                                                        │
│ [v View pathway details]                                              (no-print)       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 3-Stage Milestone Progression Component

The 3-stage progression visually illustrates the journey from university enrollment to a later senior role, providing reassuring clarity for Thai students and parents:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        3-STAGE MILESTONE PROGRESSION                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🎓 1. What to Study in College                                                        │
│     Bachelor of Science in Computer Science or Software Engineering                    │
│                                                                                        │
│  💼 2. Common First Job After Graduation                                               │
│     Junior Software Engineer or Front-End Developer (0–2 years)                        │
│                                                                                        │
│  🚀 3. Later Career Role                                                               │
│     Lead Software Architect or Engineering Team Lead (3–5+ years)                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

```tsx
<section aria-labelledby={`milestones-heading-${card.id}`} className="space-y-3">
  <h3
    id={`milestones-heading-${card.id}`}
    className="text-xs font-bold uppercase tracking-wider text-slate-700"
  >
    Career Journey & Milestones
  </h3>
  <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 list-none p-0 m-0">
    <li className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5 shadow-2xs">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-[11px]" aria-hidden="true">1</span>
        <span>What to Study</span>
      </div>
      <p className="text-xs text-slate-700 leading-relaxed font-medium">
        {card.milestones.education}
      </p>
    </li>

    <li className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5 shadow-2xs">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-[11px]" aria-hidden="true">2</span>
        <span>First Job (0–2 yrs)</span>
      </div>
      <p className="text-xs text-slate-700 leading-relaxed font-medium">
        {card.milestones.entryRole}
      </p>
    </li>

    <li className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5 shadow-2xs">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-[11px]" aria-hidden="true">3</span>
        <span>Later Career Role</span>
      </div>
      <p className="text-xs text-slate-700 leading-relaxed font-medium">
        {card.milestones.growthRole}
      </p>
    </li>
  </ol>
</section>
```

### 7.3 Grounded Rationale Section

Each card renders a dedicated rationale section explaining why the recommendation fits the student:

```tsx
<div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
  <span className="font-bold text-slate-900 block">Why this pathway fits your profile:</span>
  <p>{card.groundedRationale}</p>
</div>
```

---

## 8. Module 4: Permanent Advisory Notices, Print Stylesheet & Printable Header

### 8.1 Permanent On-Screen Advisory & Advisor Reminders

In `src/components/results/ResultsContainer.tsx` and `ResultsHeader.tsx`:
1. The **"Suggestions, Not Decisions"** exploratory banner is permanently rendered in the header region:
   > *"College major choice is a flexible springboard, not a permanent trap. These recommendations are exploratory suggestions to inspire your curiosity, not permanent life decisions."*
2. The **Advisor Reminder Notice** is permanently displayed directly above the pathways:
   > *"We strongly encourage you to discuss these 4 pathways with your school advisor, mentor, or trusted teacher. They can help you explore university requirements and answer any questions."*
3. Both notices stay permanently visible on screen and are styled in calm, reassuring tones (`bg-sky-50`, `border-sky-200`, `text-sky-950`).

### 8.2 Printable Header Component (`src/components/results/PrintHeader.tsx`)

The `PrintHeader` renders at the top of the print layout:

```typescript
// src/components/results/PrintHeader.tsx
import React from 'react';
import { StudentProfile } from '@/types/intake';

export interface PrintHeaderProps {
  studentProfile?: StudentProfile;
  fallbackUsed?: boolean;
  formattedDate?: string;
  advisorNote?: string;
}

export function PrintHeader({
  studentProfile,
  fallbackUsed = false,
  formattedDate,
  advisorNote,
}: PrintHeaderProps) {
  const currentDate =
    formattedDate ||
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
    }).format(new Date());

  const defaultAdvisorNote =
    advisorNote ||
    'Advisor Note: This document is an exploratory discovery guide for advising conversations. College majors are flexible springboards, not permanent life decisions. Students and families are encouraged to discuss these pathways with school advisors.';

  return (
    <aside
      aria-label="Printable Student Summary Header"
      className="hidden print:block border-b-2 border-slate-900 pb-6 mb-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            PathLess Educational Guide • Student Exploration Report
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            {studentProfile?.fullName || 'Student Discovery Profile'}
          </h1>
        </div>
        <div className="text-right text-xs text-slate-600">
          <div><strong className="text-slate-900">Date:</strong> {currentDate}</div>
          <div><strong className="text-slate-900">Level:</strong> {studentProfile?.gradeLevel || 'Secondary Education'}</div>
          {/* CRITICAL PRIVACY GUARD: Student ID is strictly OMITTED */}
        </div>
      </div>

      {fallbackUsed && (
        <div className="rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900 font-medium">
          Notice: Sample demonstration pathways shown.
        </div>
      )}

      <div className="rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed">
        {defaultAdvisorNote}
      </div>
    </aside>
  );
}
```

### 8.3 Privacy Invariant: Strict Omission of Student ID

Under no circumstances may `studentProfile.studentId` be rendered in `PrintHeader` or any element visible under `@media print`. This protects student privacy when printed copies are taken home or shared in advisor group settings.

### 8.4 Overhauled Print Stylesheet (`@media print`)

```css
/* Print Stylesheet Overhaul in src/styles/globals.css & src/app/globals.css */

@media print {
  @page {
    margin: 1.5cm;
    size: portrait;
  }

  body {
    background-color: #ffffff !important;
    color: #0f172a !important;
    font-size: 10pt;
    line-height: 1.4;
  }

  /* Hide interactive controls and screen-only elements */
  .no-print,
  button,
  [role="button"],
  nav,
  footer {
    display: none !important;
  }

  /* Ensure PrintHeader is visible */
  .hidden.print\:block {
    display: block !important;
  }

  /* Force all pathway cards and details containers to fully expand */
  [id^="pathway-details-"] {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
    border-top: 1px solid #e2e8f0 !important;
    background: transparent !important;
  }

  /* Avoid splitting cards awkwardly across pages */
  article {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    margin-bottom: 1.25rem !important;
    padding: 0 !important;
  }

  /* Crisp borders for milestones in print */
  li, .rounded-xl {
    box-shadow: none !important;
    border-color: #cbd5e1 !important;
  }
}
```

---

## 9. Accessibility (WCAG 2.1 AA) Rules

| Criterion | Implementation Rule | Verification Method |
| :--- | :--- | :--- |
| **Badge Contrast** | `Top Match` (emerald text on emerald-50) and `Explore Also` (sky text on sky-50) must achieve $\ge 4.5:1$ contrast against their backgrounds. | Chrome DevTools Contrast Checker & axe audit |
| **Milestone Semantic Ordering** | 3-stage progression must use an ordered list (`<ol>`) with numbered stages for screen reader sequence understanding. | Static markup inspection & VoiceOver / NVDA test |
| **Print Header A11y** | `PrintHeader` container has `aria-label="Printable Student Summary Header"` and uses `aria-hidden="true"` when hidden on screen. | Screen reader DOM tree inspection |
| **Print Button Touch Targets** | "Print or Save as PDF" button maintains minimum $44 \times 44$ px touch target dimensions. | Element bounding box assertion |
| **Print Button Focus Ring** | Print trigger button retains high-contrast focus ring (`focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none`). | Keyboard tab order navigation inspection |

---

## 10. Verification & Test Suite Specifications

### 10.1 Unit Test Suite: Career Catalog (`tests/unit/careerCatalog.test.ts`)

```typescript
// Test assertions for tests/unit/careerCatalog.test.ts
// 1. Whitelist coverage: Verifies exactly 8 approved fields are defined.
// 2. Completeness: Verifies every approved field has at least 3 curated career entries.
// 3. Milestone integrity: Verifies every career entry defines education, entryRole, and growthRole.
// 4. Major consistency: Verifies every standardMajor is a non-empty string and conforms to standard titles.
// 5. Lookup functions: Verifies isWhitelistedTitle, isWhitelistedMajor, and getCareersByField operate accurately.
// 6. Zero forbidden jargon: Asserts zero occurrences of "Moonshot", "Interdisciplinary Pivot", "Fit Score", "Triage", or "Dossier".
```

### 10.2 Unit Test Suite: Results Card Refinements (`tests/unit/resultsCardRefinements.test.ts`)

```typescript
// Test assertions for tests/unit/resultsCardRefinements.test.ts
// 1. Qualitative Badges: Asserts "Top Match" and "Explore Also" badges render without percentage numbers.
// 2. Fit Score Elimination: Asserts "% Natural Fit" and any percentage numbers are absent from the DOM.
// 3. 3-Stage Progression: Asserts that all 3 milestone stages (education, entryRole, growthRole) render on the card.
// 4. Grounded Rationale: Asserts grounded rationale section is visible and contains personalized text.
// 5. Permanent Advisory Notices: Asserts "suggestions, not decisions" and Advisor reminder are rendered and visible.
// 6. Zero Technical Jargon: Asserts zero forbidden terms (triage, dossier, counselor, fit score, LLM, model, prompts, etc.) anywhere in DOM.
// 7. PrintHeader Privacy: Asserts PrintHeader renders Student Name, Grade, Date, and Advisor Note, and strictly omits Student ID.
// 8. Print Expansion Invariant: Asserts [id^="pathway-details-"] element is present in DOM even when isExpanded is false, supporting @media print.
// 9. Field Diversity: Asserts sample GuideResult payload contains at least 2 distinct broad fields across the 4 cards.
// 10. Defensive Route Guardrail: Verifies validateGuideSynthesisResult rejects non-whitelisted roles/majors or improper spreads, triggering fallback.
```

---

## 11. Acceptance Criteria & Traceability Matrix

| ID | Criterion Statement | Implementing Components & Files | Verification Test |
| :--- | :--- | :--- | :--- |
| **AC-SUGGEST-01** | Synthesis prompt and mock fallback payloads restrict role titles and majors strictly to the curated catalog across the 8 approved fields without invented niche terminology. | `src/data/careerCatalog.ts`, `src/data/mockCareerResults.ts`, `src/app/api/guide/route.ts` | `tests/unit/careerCatalog.test.ts` (`describe('Catalog Whitelist Enforcement')`) |
| **AC-SUGGEST-02** | All percentage fit scores and jargon tier labels are eliminated, replaced by locked qualitative badges (Top Match and Explore Also) and grounded rationale summaries. | `src/types/career.ts`, `src/components/results/CareerMatchCard.tsx` | `tests/unit/resultsCardRefinements.test.ts` (`describe('Qualitative Badges & Score Purge')`) |
| **AC-SUGGEST-03** | The 4 generated recommendations guarantee field diversity, presenting 2 primary matches and 2 adjacent field pathways. The API route verifies this spread and falls back to sample data if incorrect. | `src/app/api/guide/route.ts`, `src/data/mockCareerResults.ts` | `tests/unit/resultsCardRefinements.test.ts` (`describe('Field Diversity & Route Guardrail')`) |
| **AC-SUGGEST-04** | Each card includes a simple 3-stage milestone progression detailing college major, entry-level job, and later career role familiar in Thailand. | `src/components/results/CareerMatchCard.tsx`, `src/types/career.ts` | `tests/unit/resultsCardRefinements.test.ts` (`describe('3-Stage Milestones')`) |
| **AC-SUGGEST-05** | Activating browser print renders a clean print layout with all 4 cards fully expanded, including Student Name, Grade, Date, Advisor Note, and Sample Data notice when applicable, while omitting Student ID. | `src/components/results/PrintHeader.tsx`, `src/components/results/ResultsContainer.tsx`, `src/styles/globals.css` | `tests/unit/resultsCardRefinements.test.ts` (`describe('PrintHeader & Privacy')`) |
| **AC-SUGGEST-06** | Advisory Reassurance and Zero-Jargon Guarantee: The "suggestions, not decisions" note and the Advisor reminder stay permanently visible on the results screen; zero clinical, technical, or internal AI engineering terms appear in user-facing screen views or the printed layout. | `src/components/results/ResultsContainer.tsx`, `src/components/results/ResultsHeader.tsx`, `src/content/guideCopy.ts` | `tests/unit/resultsCardRefinements.test.ts` (`describe('Advisory Reassurance & Jargon Purge')`) |

---

## 12. File Modification Plan

The following files will be created or modified during implementation:

1. **`src/data/careerCatalog.ts`** *(NEW)*: Curated static catalog containing confirmed whitelist of common job titles, standard university majors across 8 approved fields, and milestone progression data.
2. **`src/data/mockCareerResults.ts`** *(NEW)*: High-fidelity mock results strictly selected from the catalog, with 2 Top Match and 2 Explore Also, 3-stage milestone progression, grounded rationale, and zero percentages.
3. **`src/types/career.ts`** *(MODIFIED)*: Updated TypeScript types: `QualitativeBadge` (`'Top Match' | 'Explore Also'`), `CareerMilestones` (`education`, `entryRole`, `growthRole`), updated `PathwayCard` (adding `milestones`, `badge`, `groundedRationale`, deprecating/removing `fitScore`), `ApprovedField`, etc.
4. **`src/app/api/guide/route.ts`** *(MODIFIED)*: Synthesis route updated to enforce catalog whitelist validation, 2 primary + 2 adjacent field diversity, and mock fallback response from `mockCareerResults.ts` when any check fails.
5. **`src/components/results/CareerMatchCard.tsx`** *(MODIFIED)*: Updated to display locked qualitative badges (no percentages), 3-stage milestone progression, grounded intake rationale, and accessible styling.
6. **`src/components/results/ResultsContainer.tsx`** *(MODIFIED)*: Coordinates print header, 4 diverse cards, permanent "suggestions, not decisions" notice, Advisor reminder, and handles print expansion.
7. **`src/components/results/PrintHeader.tsx`** *(NEW)*: Dedicated printable header with Student Name, Grade Level, Date, Advisor Note, Sample Data notice (if applicable), and Student ID strictly omitted.
8. **`src/styles/globals.css` & `src/app/globals.css`** *(MODIFIED)*: Dedicated print stylesheet (`@media print`) ensuring all 4 cards auto-expand, page breaks are avoided, and print elements format cleanly.
9. **`tests/unit/careerCatalog.test.ts`** *(NEW)*: Unit tests for the catalog whitelist across 8 fields, title validation, major validation, and milestone completeness.
10. **`tests/unit/resultsCardRefinements.test.ts`** *(NEW)*: Unit tests for qualitative badges, 3-stage milestone progression rendering, elimination of fit scores, field diversity, permanent advisory notices, zero jargon on screen and print, and print header privacy/data assertions.
