---
doc: api-spec
feature: 1-contract-and-specs
project: PathwayAI - College Major and Career Triage MVP
status: draft
gate: PASS
---

# PathwayAI: API & Integration Specification

This document defines the strict HTTP API contracts, Google Gemini 1.5 Flash generation protocols, TypeScript data models, and error-handling semantics for the **PathwayAI: College Major and Career Triage MVP**.

---

## 1. RESTful API Endpoints

### 1.1 `POST /api/intake/submit`
Submits a student's 4-question intake questionnaire, orchestrates the Gemini 1.5 Flash triage analysis, stores records in SQLite, and returns the 4 tailored career recommendation cards.

#### Request Headers
- `Content-Type: application/json`

#### Request Body
```json
{
  "student_info": {
    "full_name": "Jordan Rivera",
    "email": "jordan.rivera@example.edu",
    "grade_level": "high_school_senior",
    "school_name": "Lincoln High School"
  },
  "answers": {
    "q1_intellectual_energy": "BUILD_SYSTEMS",
    "q2_work_context": "HEALTH_BIO",
    "q3_academic_friction": "HARD_MATH",
    "q4_horizon_priority": "PURPOSE_IMPACT"
  }
}
```

#### Request Validation Rules (Zod)
- `student_info.full_name`: `string`, required, `2 <= length <= 100`.
- `student_info.email`: `string`, optional, valid email format if present.
- `student_info.grade_level`: `enum ['high_school_junior', 'high_school_senior', 'college_freshman', 'college_sophomore']`.
- `student_info.school_name`: `string`, optional, `length <= 100`.
- `answers.q1_intellectual_energy`: `enum ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS', 'HELP_HUMANS', 'CREATE_EXPRESS', 'LEAD_ORGANIZING']`.
- `answers.q2_work_context`: `enum ['TECH_INNOVATION', 'HEALTH_BIO', 'BUSINESS_FINANCE', 'SOCIAL_CIVIC', 'MEDIA_CULTURE']`.
- `answers.q3_academic_friction`: `enum ['HARD_MATH', 'PUBLIC_SPEAKING', 'HEAVY_MEMORIZATION', 'ABSTRACT_WRITING', 'ISOLATED_DESKWORK']`.
- `answers.q4_horizon_priority`: `enum ['HIGH_EARNING_SECURITY', 'PURPOSE_IMPACT', 'CREATIVE_AUTONOMY', 'INTELLECTUAL_DEPTH', 'WORK_LIFE_BALANCE']`.

#### Response `201 Created`
```json
{
  "success": true,
  "submission_id": "sub_a98f12c4e3",
  "student": {
    "id": "stu_b12489f0",
    "full_name": "Jordan Rivera",
    "grade_level": "high_school_senior"
  },
  "summary": {
    "student_archetype": "The Purposeful Bio-Systems Builder",
    "triage_narrative": "Jordan thrives when engineering tangible systems that directly improve human vitality, but experiences anxiety around abstract mathematical theory. These pathways emphasize applied clinical problem-solving, structured technology, and purpose-driven impact."
  },
  "careers": [
    {
      "id": "career_1",
      "role_title": "Biomedical Equipment & Systems Technologist",
      "match_tier": "Primary Direct Match",
      "fit_score": 96,
      "fit_rationale": "Directly converges hands-on system building (Q1) with healthcare impact (Q2) while applying practical physics rather than theoretical calculus.",
      "majors": [
        "Biomedical Engineering Technology",
        "Clinical Laboratory Science",
        "Applied Instrumentation Engineering"
      ],
      "daily_tasks": [
        "Calibrate and diagnose telemetry, imaging, and dialysis systems in hospital surgical suites",
        "Design customized hardware modifications for patient accessibility equipment",
        "Perform preventive maintenance protocols to guarantee zero-failure healthcare devices"
      ],
      "course_challenges": "Applied Circuit Theory & Electronics Math",
      "reassurance": "Unlike abstract theoretical calculus that intimidates you, circuit math is grounded directly in hands-on breadboards, physical voltage measurements, and immediate visual feedback.",
      "trial_courses": [
        {
          "title": "Introduction to Biomedical Technology",
          "provider": "edX / DelftX (Free Audit)",
          "description": "Explore how medical hardware saves lives through practical engineering simulations.",
          "estimated_hours": 6
        },
        {
          "title": "Hands-On Arduino for Beginners",
          "provider": "freeCodeCamp (YouTube)",
          "description": "Build simulated physical circuits online with zero hardware cost using Tinkercad.",
          "estimated_hours": 4
        }
      ]
    },
    {
      "id": "career_2",
      "role_title": "Health Informatics Specialist",
      "match_tier": "High-Growth Pathway",
      "fit_score": 92,
      "fit_rationale": "High-demand industry bridging healthcare clinical workflows with structured software systems.",
      "majors": [
        "Health Information Management",
        "Bioinformatics",
        "Information Systems"
      ],
      "daily_tasks": [
        "Optimize hospital digital workflows to eliminate documentation friction for nurses",
        "Implement patient record interoperability standards across multi-clinic hospital networks",
        "Analyze patient safety data logs to flag adverse drug interactions"
      ],
      "course_challenges": "Relational Database Management & SQL Queries",
      "reassurance": "Database querying is pure logic and language syntax rather than higher-order mathematics; you will learn it like building with digital LEGO blocks.",
      "trial_courses": [
        {
          "title": "Health Informatics 101",
          "provider": "Coursera (Johns Hopkins / Audit)",
          "description": "Examine how clinical data drives patient health outcomes.",
          "estimated_hours": 5
        },
        {
          "title": "SQL for Health Data Beginners",
          "provider": "Khan Academy",
          "description": "Interactive browser exercises querying patient and clinic tables.",
          "estimated_hours": 3
        }
      ]
    },
    {
      "id": "career_3",
      "role_title": "Assistive Technology Designer",
      "match_tier": "Interdisciplinary Pivot",
      "fit_score": 88,
      "fit_rationale": "Combines human empathy, ergonomics, and physical fabrication for patients with disabilities.",
      "majors": [
        "Industrial Design",
        "Human-Centered Design & Engineering",
        "Occupational Therapy Pre-Professional"
      ],
      "daily_tasks": [
        "Interview patients with mobility limitations to assess ergonomic pain points",
        "Rapid prototype 3D-printed adaptive grips, utensils, and computer input devices",
        "Test device usability with physical therapists to ensure patient safety and comfort"
      ],
      "course_challenges": "Ergonomics and Applied Biomechanics",
      "reassurance": "Biomechanics focuses on the human body's movement and physical levers, intuitive concepts you observe every day in human posture.",
      "trial_courses": [
        {
          "title": "Human-Centered Design: An Introduction",
          "provider": "Coursera (UC San Diego / Audit)",
          "description": "Learn the core design cycle: field observation, prototyping, and testing.",
          "estimated_hours": 6
        },
        {
          "title": "Assistive Tech in Action Case Studies",
          "provider": "YouTube / Perkins Access",
          "description": "Real-world walkthroughs of adaptive tools engineered for students with physical disabilities.",
          "estimated_hours": 2
        }
      ]
    },
    {
      "id": "career_4",
      "role_title": "Surgical Robotics Operations Coordinator",
      "match_tier": "Moonshot Trajectory",
      "fit_score": 84,
      "fit_rationale": "An ambitious emerging field at the intersection of robotic surgery, clinical operations, and technical leadership.",
      "majors": [
        "Robotics Systems Technology",
        "Healthcare Operations Management",
        "Applied Mechanical Systems"
      ],
      "daily_tasks": [
        "Oversee pre-operative calibration and sterile draping for multi-million dollar robotic surgery consoles",
        "Serve as in-room technical liaison assisting surgeon console settings during complex procedures",
        "Coordinate software telemetry updates and hardware swaps with robotics manufacturer engineers"
      ],
      "course_challenges": "Robotic Kinematics & Applied Physics",
      "reassurance": "Operations roles emphasize practical device diagnostics, communication, and system mastery rather than derivation of matrix physics.",
      "trial_courses": [
        {
          "title": "Introduction to Surgical Robotics",
          "provider": "YouTube / Stanford Medicine Lectures",
          "description": "Watch robotic console dissections and surgeon interface overviews.",
          "estimated_hours": 3
        },
        {
          "title": "Medical Device Regulations & Safety",
          "provider": "edX / MITx (Audit)",
          "description": "Understand FDA compliance and robotic clinical protocol controls.",
          "estimated_hours": 5
        }
      ]
    }
  ],
  "meta": {
    "engine": "gemini-1.5-flash",
    "generation_latency_ms": 1840,
    "fallback_used": false
  }
}
```

#### Error Responses
- `400 Bad Request`: Validation failure on input schema. Returns field-level error messages.
- `429 Too Many Requests`: System exceeded 15 RPM. Transparently handled if fallback is enabled; otherwise returns retry-after header.
- `500 Internal Server Error`: Unhandled execution fault.

---

### 1.2 `GET /api/submissions/:id`
Retrieves a single submission by its ID, including student metadata, answers, generated career cards, and counselor review status.

#### Parameters
- Path: `id` (`string`, e.g., `sub_a98f12c4e3`)

#### Response `200 OK`
```json
{
  "id": "sub_a98f12c4e3",
  "created_at": "2026-10-02T02:40:00Z",
  "student": {
    "id": "stu_b12489f0",
    "full_name": "Jordan Rivera",
    "grade_level": "high_school_senior",
    "school_name": "Lincoln High School"
  },
  "intake_answers": {
    "q1_intellectual_energy": "BUILD_SYSTEMS",
    "q2_work_context": "HEALTH_BIO",
    "q3_academic_friction": "HARD_MATH",
    "q4_horizon_priority": "PURPOSE_IMPACT"
  },
  "recommendations": {
    "student_archetype": "The Purposeful Bio-Systems Builder",
    "triage_narrative": "...",
    "careers": [ /* 4 cards conforming to schema */ ]
  },
  "review": {
    "status": "pending_review",
    "counselor_name": "Counselor",
    "notes": "",
    "flagged_friction": true,
    "updated_at": "2026-10-02T02:40:01Z"
  }
}
```

---

### 1.3 `GET /api/counselor/submissions`
Fetches all student submissions for the Counselor Triage Dashboard, supporting filtering and metric summaries.

#### Query Parameters
- `grade_level` (optional): Filter by grade (e.g., `high_school_senior`)
- `status` (optional): Filter by `pending_review | reviewed | follow_up_scheduled`
- `friction` (optional): Filter by friction code (e.g., `HARD_MATH`)
- `search` (optional): Text search matching student name
- `limit` (default: 50): Number of records
- `offset` (default: 0): Pagination offset

#### Response `200 OK`
```json
{
  "metrics": {
    "total_submissions": 42,
    "pending_reviews": 14,
    "flagged_anxieties": 19
  },
  "submissions": [
    {
      "id": "sub_a98f12c4e3",
      "student_name": "Jordan Rivera",
      "grade_level": "high_school_senior",
      "created_at": "2026-10-02T02:40:00Z",
      "top_career": "Biomedical Equipment & Systems Technologist",
      "academic_friction": "HARD_MATH",
      "status": "pending_review",
      "flagged_friction": true,
      "notes_preview": ""
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 42
  }
}
```

---

### 1.4 `PATCH /api/counselor/submissions/:id/review`
Updates the counselor status, notes, and follow-up flag for a specific student submission.

#### Request Body
```json
{
  "status": "follow_up_scheduled",
  "notes": "Discussed math anxiety; Jordan is excited to start with Tinkercad circuits. Scheduled advising meeting next Tuesday.",
  "flagged_friction": false,
  "counselor_name": "Mrs. Vance, Lead Advisor"
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "submission_id": "sub_a98f12c4e3",
  "updated_review": {
    "status": "follow_up_scheduled",
    "notes": "Discussed math anxiety; Jordan is excited to start with Tinkercad circuits. Scheduled advising meeting next Tuesday.",
    "flagged_friction": false,
    "counselor_name": "Mrs. Vance, Lead Advisor",
    "updated_at": "2026-10-02T02:45:10Z"
  }
}
```

---

### 1.5 `GET /api/health`
System liveness and zero-cost status check.

#### Response `200 OK`
```json
{
  "status": "healthy",
  "database": "sqlite_connected",
  "gemini_mode": "live",
  "zero_cost_free_tier": true,
  "rate_limit_rpm_ceiling": 15,
  "uptime_seconds": 182
}
```

---

## 2. Google Gemini 1.5 Flash Integration Contract

### 2.1 API Endpoint & Auth Configuration
- **Model**: `gemini-1.5-flash`
- **SDK**: `@google/generative-ai`
- **Method**: `generateContent`
- **Auth**: API Key passed via `GEMINI_API_KEY` environment variable.

### 2.2 Strict System Prompt
```
You are PathwayAI, a world-class collegiate academic advisor and vocational psychologist. Your mission is to triage high school and early college students who are stressed or undecided about their major and career path.

You will receive four answers from a student intake questionnaire:
1. Intellectual energy driver (what activities make them lose track of time)
2. Real-world work context (the problem space they care about)
3. Academic friction & anxiety (the subject or requirement that terrifies them)
4. Post-college priority (what matters most after graduation)

Your role is to diagnose their natural profile and return EXACTLY FOUR distinct career recommendation cards according to this taxonomy:
1. Card 1 - Primary Direct Match: Direct alignment between their intellectual energy and domain context.
2. Card 2 - High-Growth Pathway: High employer demand, strong entry-level job security, and clear educational ROI.
3. Card 3 - Interdisciplinary Pivot: A creative bridge connecting multiple disciplines with minimal exposure to their stated anxiety.
4. Card 4 - Moonshot Trajectory: An aspirational, high-impact career that broadens their horizons.

Crucial Guidelines:
- For EVERY card, identify the realistic tough course ('course_challenges') they will face.
- For EVERY card, provide an empathetic, grounded 'reassurance' that DIRECTLY mitigates the specific academic anxiety they disclosed in Question 3. Explain WHY they can succeed despite this fear.
- For EVERY card, provide EXACTLY TWO zero-risk, high-quality 'trial_courses' (e.g., free audit Coursera, edX, Khan Academy, or freeCodeCamp tutorials) they can try immediately.
- Adhere strictly to the requested JSON schema. Never output markdown formatting or conversational filler outside the JSON.
```

### 2.3 User Prompt Template
```
STUDENT INTAKE PROFILE:
- Student Name: {{student_name}}
- Academic Standing: {{grade_level}}
- Q1 Intellectual Energy: {{q1_intellectual_energy}}
- Q2 Work Context: {{q2_work_context}}
- Q3 Academic Friction / Dread: {{q3_academic_friction}}
- Q4 Post-College Priority: {{q4_horizon_priority}}

Generate the 4-career triage synthesis adhering strictly to the JSON schema.
```

### 2.4 Gemini `response_schema` Definition
```json
{
  "type": "OBJECT",
  "properties": {
    "summary": {
      "type": "OBJECT",
      "properties": {
        "student_archetype": { "type": "STRING" },
        "triage_narrative": { "type": "STRING" }
      },
      "required": ["student_archetype", "triage_narrative"]
    },
    "careers": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "id": { "type": "STRING" },
          "role_title": { "type": "STRING" },
          "match_tier": {
            "type": "STRING",
            "enum": [
              "Primary Direct Match",
              "High-Growth Pathway",
              "Interdisciplinary Pivot",
              "Moonshot Trajectory"
            ]
          },
          "fit_score": { "type": "INTEGER" },
          "fit_rationale": { "type": "STRING" },
          "majors": {
            "type": "ARRAY",
            "items": { "type": "STRING" }
          },
          "daily_tasks": {
            "type": "ARRAY",
            "items": { "type": "STRING" }
          },
          "course_challenges": { "type": "STRING" },
          "reassurance": { "type": "STRING" },
          "trial_courses": {
            "type": "ARRAY",
            "items": {
              "type": "OBJECT",
              "properties": {
                "title": { "type": "STRING" },
                "provider": { "type": "STRING" },
                "description": { "type": "STRING" },
                "estimated_hours": { "type": "INTEGER" }
              },
              "required": ["title", "provider", "description", "estimated_hours"]
            }
          }
        },
        "required": [
          "id",
          "role_title",
          "match_tier",
          "fit_score",
          "fit_rationale",
          "majors",
          "daily_tasks",
          "course_challenges",
          "reassurance",
          "trial_courses"
        ]
      }
    }
  },
  "required": ["summary", "careers"]
}
```

---

## 3. TypeScript Interfaces & Data Models

```typescript
// Student Intake Types
export type GradeLevel =
  | 'high_school_junior'
  | 'high_school_senior'
  | 'college_freshman'
  | 'college_sophomore';

export type IntellectualEnergy =
  | 'BUILD_SYSTEMS'
  | 'ANALYZE_PATTERNS'
  | 'HELP_HUMANS'
  | 'CREATE_EXPRESS'
  | 'LEAD_ORGANIZING';

export type WorkContext =
  | 'TECH_INNOVATION'
  | 'HEALTH_BIO'
  | 'BUSINESS_FINANCE'
  | 'SOCIAL_CIVIC'
  | 'MEDIA_CULTURE';

export type AcademicFriction =
  | 'HARD_MATH'
  | 'PUBLIC_SPEAKING'
  | 'HEAVY_MEMORIZATION'
  | 'ABSTRACT_WRITING'
  | 'ISOLATED_DESKWORK';

export type HorizonPriority =
  | 'HIGH_EARNING_SECURITY'
  | 'PURPOSE_IMPACT'
  | 'CREATIVE_AUTONOMY'
  | 'INTELLECTUAL_DEPTH'
  | 'WORK_LIFE_BALANCE';

export interface StudentInfo {
  full_name: string;
  email?: string;
  grade_level: GradeLevel;
  school_name?: string;
}

export interface IntakeAnswers {
  q1_intellectual_energy: IntellectualEnergy;
  q2_work_context: WorkContext;
  q3_academic_friction: AcademicFriction;
  q4_horizon_priority: HorizonPriority;
}

export interface IntakeSubmissionRequest {
  student_info: StudentInfo;
  answers: IntakeAnswers;
}

// Career Recommendation Types
export type MatchTier =
  | 'Primary Direct Match'
  | 'High-Growth Pathway'
  | 'Interdisciplinary Pivot'
  | 'Moonshot Trajectory';

export interface TrialCourse {
  title: string;
  provider: string;
  description: string;
  estimated_hours: number;
}

export interface CareerCard {
  id: string;
  role_title: string;
  match_tier: MatchTier;
  fit_score: number;
  fit_rationale: string;
  majors: string[];
  daily_tasks: string[];
  course_challenges: string;
  reassurance: string;
  trial_courses: [TrialCourse, TrialCourse];
}

export interface TriageSummary {
  student_archetype: string;
  triage_narrative: string;
}

export interface TriageResult {
  summary: TriageSummary;
  careers: [CareerCard, CareerCard, CareerCard, CareerCard];
}

// Counselor Review Types
export type CounselorStatus =
  | 'pending_review'
  | 'reviewed'
  | 'follow_up_scheduled';

export interface CounselorReview {
  id: string;
  submission_id: string;
  counselor_name: string;
  status: CounselorStatus;
  notes: string;
  flagged_friction: boolean;
  updated_at: string;
}

// Full Dashboard Item
export interface CounselorDashboardItem {
  id: string;
  student_name: string;
  grade_level: GradeLevel;
  created_at: string;
  top_career: string;
  academic_friction: AcademicFriction;
  status: CounselorStatus;
  flagged_friction: boolean;
  notes_preview: string;
}
```

---

## 4. Curated Realistic Mock Fallback Payload

To guarantee the zero-cost requirement and 100% demo uptime under the 15 RPM free-tier constraint, this high-fidelity payload is activated whenever Gemini API keys are omitted or rate-limited:

```json
{
  "summary": {
    "student_archetype": "The Strategic Digital Architect",
    "triage_narrative": "A natural analytical problem-solver seeking strong long-term career security and autonomy, but hesitant about public speaking and high-stakes verbal defense. These pathways leverage structured asynchronous problem solving, high market demand, and calm collaborative environments."
  },
  "careers": [
    {
      "id": "career_1",
      "role_title": "Cloud Infrastructure & Systems Engineer",
      "match_tier": "Primary Direct Match",
      "fit_score": 95,
      "fit_rationale": "Aligns directly with systems building and technical problem solving while minimizing stressful public speaking.",
      "majors": [
        "Computer Information Systems",
        "Cloud Computing",
        "Network Engineering"
      ],
      "daily_tasks": [
        "Provision and automate virtual server infrastructure using Infrastructure-as-Code (Terraform)",
        "Monitor system performance dashboards and configure automated failover mechanisms",
        "Troubleshoot database connectivity bottlenecks across containerized microservices"
      ],
      "course_challenges": "Distributed Operating Systems & Network Protocols",
      "reassurance": "Technical coursework is evaluated through functioning code labs and lab reports rather than verbal presentations or speeches.",
      "trial_courses": [
        {
          "title": "AWS Cloud Practitioner Essentials",
          "provider": "AWS Skill Builder (Free)",
          "description": "Learn the fundamental concepts of cloud servers, storage, and networking without fees.",
          "estimated_hours": 6
        },
        {
          "title": "Linux Command Line Basics",
          "provider": "freeCodeCamp (YouTube)",
          "description": "Hands-on terminal commands for beginners in 120 minutes.",
          "estimated_hours": 2
        }
      ]
    },
    {
      "id": "career_2",
      "role_title": "Information Security Analyst",
      "match_tier": "High-Growth Pathway",
      "fit_score": 91,
      "fit_rationale": "High labor demand with an anticipated 32% industry growth rate and high starting salaries.",
      "majors": [
        "Cybersecurity",
        "Information Assurance",
        "Computer Science"
      ],
      "daily_tasks": [
        "Analyze security incident logs to detect unauthorized network penetration attempts",
        "Run automated vulnerability scanning scripts against corporate web applications",
        "Document remediation steps in clear, written technical security tickets"
      ],
      "course_challenges": "Cryptography and Network Security Algorithms",
      "reassurance": "You don't need to invent cryptography formulas; practical analysts focus on applying established encryption libraries and auditing system configurations.",
      "trial_courses": [
        {
          "title": "Google Cybersecurity Professional Certificate - Foundations",
          "provider": "Coursera (Free Audit)",
          "description": "Foundational cybersecurity practices taught by Google analysts.",
          "estimated_hours": 8
        },
        {
          "title": "OverTheWire: Bandit (Wargame)",
          "provider": "OverTheWire.org",
          "description": "Interactive cybersecurity puzzle game played in your terminal.",
          "estimated_hours": 4
        }
      ]
    },
    {
      "id": "career_3",
      "role_title": "Data Pipeline & Analytics Engineer",
      "match_tier": "Interdisciplinary Pivot",
      "fit_score": 87,
      "fit_rationale": "Translates raw operational data into structured business intelligence without requiring sales pitches.",
      "majors": [
        "Data Analytics",
        "Management Information Systems",
        "Applied Statistics"
      ],
      "daily_tasks": [
        "Build automated data extract-transform-load (ETL) pipelines using Python and SQL",
        "Cleanse and validate customer behavior datasets for quarterly operational reporting",
        "Create interactive metric dashboards in tools like Metabase or Tableau"
      ],
      "course_challenges": "Applied Statistical Methods & Regression",
      "reassurance": "Statistics at this level is practical and tool-driven; software handles the computations while you focus on interpreting what the data means.",
      "trial_courses": [
        {
          "title": "SQL for Data Science",
          "provider": "Coursera (UC Davis / Audit)",
          "description": "Learn to query, filter, and summarize real-world datasets.",
          "estimated_hours": 8
        },
        {
          "title": "Python for Data Analysis Crash Course",
          "provider": "Kaggle Learn",
          "description": "Free, hands-on micro-course with interactive Jupyter notebooks in the browser.",
          "estimated_hours": 4
        }
      ]
    },
    {
      "id": "career_4",
      "role_title": "Autonomous Systems Simulation Specialist",
      "match_tier": "Moonshot Trajectory",
      "fit_score": 83,
      "fit_rationale": "High-impact emerging domain in robotics simulation, autonomous driving, and aerospace modeling.",
      "majors": [
        "Robotics Systems Technology",
        "Simulation & Game Programming",
        "Applied Computational Science"
      ],
      "daily_tasks": [
        "Configure synthetic virtual test environments in simulation physics engines (e.g. Gazebo or Unreal)",
        "Stress-test sensor perception algorithms under adverse weather simulations",
        "Generate automated test telemetry reports for vehicle engineering teams"
      ],
      "course_challenges": "3D Kinematics and Simulation Mechanics",
      "reassurance": "Modern simulation software allows you to visually inspect physics problems in 3D rather than wrestling with dry symbolic algebra.",
      "trial_courses": [
        {
          "title": "Introduction to Robotics Simulation with ROS",
          "provider": "ConstructSim / YouTube",
          "description": "Beginner walkthrough of simulated robot movements in web-based Linux containers.",
          "estimated_hours": 5
        },
        {
          "title": "Physics for Game and Simulation Programmers",
          "provider": "Khan Academy",
          "description": "Intuitive visual physics and vector mathematics.",
          "estimated_hours": 6
        }
      ]
    }
  ]
}
```
