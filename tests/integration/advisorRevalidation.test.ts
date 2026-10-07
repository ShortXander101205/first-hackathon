import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST as guidePost } from '@/app/api/guide/route';
import { setRevalidateAdvisorHook, safeRevalidateAdvisorCache } from '@/lib/advisorCache';
import { GET as studentsGet } from '@/app/api/advisor/students/route';
import { createAdvisorSessionToken, ADVISOR_COOKIE_NAME } from '@/lib/auth';

describe('AC-FIX-01: Advisor Cache Revalidation & Fresh Data Integration Tests', () => {
  let revalidatedPaths: string[] = [];

  beforeEach(() => {
    revalidatedPaths = [];
    setRevalidateAdvisorHook((path: string) => {
      revalidatedPaths.push(path);
    });
  });

  afterEach(() => {
    setRevalidateAdvisorHook(null);
  });

  it('safeRevalidateAdvisorCache invokes custom hook with /advisor', () => {
    safeRevalidateAdvisorCache();
    assert.deepEqual(revalidatedPaths, ['/advisor']);
  });

  it('safeRevalidateAdvisorCache is completely safe when hook is null in test environment', () => {
    setRevalidateAdvisorHook(null);
    assert.doesNotThrow(() => {
      safeRevalidateAdvisorCache();
    });
  });

  it('POST /api/guide triggers revalidation of /advisor on successful submission', async () => {
    const payload = {
      studentProfile: {
        fullName: 'Maya Lin',
        gradeLevel: 'grade_11',
        studentId: 'STU-REVAL-101',
      },
      intakeAnswers: {
        q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS'],
        q2SubjectId: 'TECH_COMPUTING',
        q3AcademicHesitation: 'I worry about tough exam schedules',
        q4Environment: 'REMOTE_DIGITAL',
        q5ProblemSolving: 'SYSTEMATIC_LOGIC',
        q6SocialEnergy: 'BALANCED_TEAM',
        q7StructureTolerance: 'BALANCED_MILESTONES',
        q8AcademicFriction: 'ADVANCED_MATH',
        q9HorizonPriority: 'FINANCIAL_STABILITY',
        q10PostCollegeAmbition: 'WORKFORCE_DIRECT',
      },
    };

    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const res = await guidePost(req);
    assert.equal(res.status, 200);

    // Verify cache revalidation hook was triggered
    assert.ok(revalidatedPaths.includes('/advisor'));
  });

  it('GET /api/advisor/students serves Cache-Control: no-store and immediately returns new submissions', async () => {
    // 1. Submit a student via /api/guide
    const uniqueStudentId = `STU-SYNC-${Date.now()}`;
    const payload = {
      studentProfile: {
        fullName: 'Kritika Somchai',
        gradeLevel: 'grade_12',
        studentId: uniqueStudentId,
      },
      intakeAnswers: {
        q1TaskIds: ['HELP_HUMANS'],
        q2SubjectId: 'HEALTH_MEDICINE',
        q3AcademicHesitation: 'Worried about clinical training hours',
        q4Environment: 'HEALTHCARE_COMMUNITY',
        q5ProblemSolving: 'PEOPLE_RELATIONAL',
        q6SocialEnergy: 'HIGH_CONTACT_PEOPLE',
        q7StructureTolerance: 'HIGH_STRUCTURE_CLEAR_RULES',
        q8AcademicFriction: 'HEAVY_MEMORIZATION',
        q9HorizonPriority: 'PURPOSE_IMPACT',
        q10PostCollegeAmbition: 'WORKFORCE_DIRECT',
      },
    };

    const guideReq = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const guideRes = await guidePost(guideReq);
    assert.equal(guideRes.status, 200);

    // 2. Fetch students directory as authenticated advisor
    const sessionToken = createAdvisorSessionToken('Teacher Kru Somchai');
    const studentsReq = new Request('http://localhost:3000/api/advisor/students', {
      method: 'GET',
      headers: {
        Cookie: `${ADVISOR_COOKIE_NAME}=${sessionToken}`,
      },
    });

    const studentsRes = await studentsGet(studentsReq);
    assert.equal(studentsRes.status, 200);

    // 3. Verify no-store cache headers
    const cacheControl = studentsRes.headers.get('cache-control');
    assert.ok(cacheControl?.includes('no-store'), 'Expected cache-control to include no-store');
    assert.ok(cacheControl?.includes('must-revalidate'), 'Expected cache-control to include must-revalidate');

    const pragma = studentsRes.headers.get('pragma');
    assert.equal(pragma, 'no-cache');

    // 4. Verify fresh student is immediately present
    const data = await studentsRes.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.students));
    const found = data.students.some((s: any) => s.studentId === uniqueStudentId);
    assert.ok(found, `Expected to find newly submitted student with id ${uniqueStudentId}`);
  });
});
