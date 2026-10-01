-- ============================================================================
-- PathwayAI: College Major & Career Triage MVP
-- Canonical SQLite DDL Database Contract (schema.sql)
-- ============================================================================

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT,
    grade_level TEXT NOT NULL CHECK(
        grade_level IN (
            'high_school_junior',
            'high_school_senior',
            'college_freshman',
            'college_sophomore'
        )
    ),
    school_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Intake Submissions Table
CREATE TABLE IF NOT EXISTS intake_submissions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    q1_intellectual_energy TEXT NOT NULL CHECK(
        q1_intellectual_energy IN (
            'BUILD_SYSTEMS',
            'ANALYZE_PATTERNS',
            'HELP_HUMANS',
            'CREATE_EXPRESS',
            'LEAD_ORGANIZING'
        )
    ),
    q2_work_context TEXT NOT NULL CHECK(
        q2_work_context IN (
            'TECH_INNOVATION',
            'HEALTH_BIO',
            'BUSINESS_FINANCE',
            'SOCIAL_CIVIC',
            'MEDIA_CULTURE'
        )
    ),
    q3_academic_friction TEXT NOT NULL CHECK(
        q3_academic_friction IN (
            'HARD_MATH',
            'PUBLIC_SPEAKING',
            'HEAVY_MEMORIZATION',
            'ABSTRACT_WRITING',
            'ISOLATED_DESKWORK'
        )
    ),
    q4_horizon_priority TEXT NOT NULL CHECK(
        q4_horizon_priority IN (
            'HIGH_EARNING_SECURITY',
            'PURPOSE_IMPACT',
            'CREATIVE_AUTONOMY',
            'INTELLECTUAL_DEPTH',
            'WORK_LIFE_BALANCE'
        )
    ),
    raw_responses_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 3. Career Recommendations Table (1:1 with intake_submissions)
CREATE TABLE IF NOT EXISTS career_recommendations (
    id TEXT PRIMARY KEY,
    submission_id TEXT NOT NULL UNIQUE,
    student_archetype TEXT NOT NULL,
    triage_narrative TEXT NOT NULL,
    recommendations_json TEXT NOT NULL,
    generation_latency_ms INTEGER DEFAULT 0,
    gemini_model TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(submission_id) REFERENCES intake_submissions(id) ON DELETE CASCADE
);

-- 4. Counselor Reviews Table (1:1 with intake_submissions)
CREATE TABLE IF NOT EXISTS counselor_reviews (
    id TEXT PRIMARY KEY,
    submission_id TEXT NOT NULL UNIQUE,
    counselor_name TEXT DEFAULT 'Counselor',
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK(
        status IN (
            'pending_review',
            'reviewed',
            'follow_up_scheduled'
        )
    ),
    notes TEXT DEFAULT '',
    flagged_friction INTEGER DEFAULT 0 CHECK(flagged_friction IN (0, 1)),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(submission_id) REFERENCES intake_submissions(id) ON DELETE CASCADE
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_created ON intake_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON counselor_reviews(status);
CREATE INDEX IF NOT EXISTS idx_submissions_friction ON intake_submissions(q3_academic_friction);
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade_level);
