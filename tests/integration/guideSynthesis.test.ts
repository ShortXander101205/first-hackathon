import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '@/app/api/guide/route';
import { setMockGenAiClient } from '@/lib/gemini';
import { resetRateLimits } from '@/lib/rateLimiter';
import { wordCount } from '@/schemas/career.schema';

describe('Feature 8: POST /api/guide Route Handler Integration Tests', () => {
  const originalApiKey = process.env.GEMINI_API_KEY;
  const originalTimeout = process.env.GEMINI_TIMEOUT_MS;

  const validPayload = {
    studentProfile: {
      fullName: 'Jordan Taylor',
      gradeLevel: 'grade_12',
      studentId: 'STU-10293',
    },
    intakeAnswers: {
      q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS'],
      q2SubjectId: 'TECH_COMPUTING',
      q3AcademicHesitation: 'I love technology and building systems, but theoretical calculus stresses me out.',
      q4Environment: 'REMOTE_DIGITAL',
      q5ProblemSolving: 'SYSTEMATIC_LOGIC',
      q6SocialEnergy: 'INDEPENDENT_DEEP_FOCUS',
      q7StructureTolerance: 'BALANCED_MILESTONES',
      q8AcademicFriction: 'ADVANCED_MATH',
      q9HorizonPriority: 'FINANCIAL_STABILITY',
      q10PostCollegeAmbition: 'WORKFORCE_DIRECT',
    },
    metadata: {
      clientTimestamp: new Date().toISOString(),
      schemaVersion: 2,
    },
  };

  const sampleGeminiResponse = {
    summary: {
      studentArchetype: 'The Strategic Systems Architect',
      narrativeSummary: 'Jordan demonstrates structured technical problem solving. Rather than confronting abstract math in isolation, these pathways ground computing in practical software tools and stable workforce demand.',
    },
    pathways: [
      {
        id: 'match_1',
        roleTitle: 'Cloud Reliability & Operations Specialist',
        broadField: 'Information Technology & Cloud Systems',
        matchTier: 'Primary Direct Match',
        fitScore: 96,
        overview: 'Automates and maintains resilient digital cloud systems so services run smoothly without interruptions.',
        dailyTasks: [
          'Deploy infrastructure automation scripts across virtual servers',
          'Monitor application performance metrics for system bottlenecks',
          'Collaborate on incident prevention and security audits',
        ],
        studyPath: 'Studies encompass operating systems, virtual networking, scripting, and cloud architecture fundamentals in hands-on labs.',
        reassurance: 'Instead of abstract calculus tests, coursework focuses on real virtual server configurations with immediate feedback.',
        majors: ['Cloud Computing Architecture', 'Information Technology'],
        minors: ['Technical Communication'],
        trialCourses: [
          {
            title: 'Cloud Foundations & Infrastructure',
            provider: 'Coursera (Free Audit)',
            description: 'Learn fundamental cloud concepts without fees.',
            estimatedHours: 6,
            searchQuery: 'Cloud foundations free audit course',
          },
          {
            title: 'Linux Command Line Fundamentals',
            provider: 'freeCodeCamp',
            description: 'Essential terminal commands and shell navigation.',
            estimatedHours: 3,
            searchQuery: 'freeCodeCamp Linux command line basics',
          },
        ],
      },
      {
        id: 'match_2',
        roleTitle: 'Cyber Defense Incident Analyst',
        broadField: 'Information Assurance & Security',
        matchTier: 'High-Growth Pathway',
        fitScore: 92,
        overview: 'Analyzes digital network activity to detect security vulnerabilities and safeguard sensitive institutional data.',
        dailyTasks: [
          'Examine automated security alerts for unauthorized access attempts',
          'Perform vulnerability scans across internal web applications',
          'Document remediation recommendations in clear technical tickets',
        ],
        studyPath: 'Coursework covers defense principles, network architecture, compliance auditing, and hands-on digital forensics.',
        reassurance: 'You do not need to be a math genius; modern security analysts focus on pattern detection and policy auditing.',
        majors: ['Cybersecurity', 'Information Assurance'],
        minors: ['Criminal Justice'],
        trialCourses: [
          {
            title: 'Cybersecurity Basics',
            provider: 'edX (Free Audit)',
            description: 'Foundations of network defense and digital hygiene.',
            estimatedHours: 4,
            searchQuery: 'edX cybersecurity basics audit',
          },
          {
            title: 'Security Operations Fundamentals',
            provider: 'Coursera (Free Audit)',
            description: 'Introductory security analyst tools and practices.',
            estimatedHours: 6,
            searchQuery: 'Coursera security operations fundamentals',
          },
        ],
      },
      {
        id: 'match_3',
        roleTitle: 'Health Systems Data Coordinator',
        broadField: 'Healthcare Informatics & Technology',
        matchTier: 'Interdisciplinary Pivot',
        fitScore: 88,
        overview: 'Coordinates clinical database systems and medical workflows so healthcare providers have rapid, secure patient access.',
        dailyTasks: [
          'Streamline electronic medical record forms for clinical staff',
          'Analyze data intake accuracy across department records',
          'Guide medical teams on new digital record privacy tools',
        ],
        studyPath: 'Combines health system operations, healthcare privacy laws, medical databases, and applied information management.',
        reassurance: 'You make an impact in medicine without taking high-stakes biology labs or clinical medical exams.',
        majors: ['Health Informatics', 'Information Management'],
        minors: ['Public Health'],
        trialCourses: [
          {
            title: 'Health Informatics Foundations',
            provider: 'Coursera (Free Audit)',
            description: 'Overview of digital systems in medical care.',
            estimatedHours: 5,
            searchQuery: 'Coursera health informatics free audit',
          },
          {
            title: 'Database Queries for Beginners',
            provider: 'Khan Academy',
            description: 'Interactive introduction to SQL queries.',
            estimatedHours: 4,
            searchQuery: 'Khan Academy SQL query basics',
          },
        ],
      },
      {
        id: 'match_4',
        roleTitle: 'Autonomous Simulation Graphics Specialist',
        broadField: 'Applied Robotics & Computational Media',
        matchTier: 'Moonshot Trajectory',
        fitScore: 84,
        overview: 'Creates virtual physics simulations to test autonomous robotics and vehicles before real-world physical deployment.',
        dailyTasks: [
          'Design 3D virtual testing environments in simulation software',
          'Test vehicle perception algorithms under virtual weather conditions',
          'Export telemetry data to evaluate automated reaction times',
        ],
        studyPath: 'Focuses on 3D computer graphics, physics simulation engines, computational mechanics, and robotic telemetry.',
        reassurance: 'Interactive 3D simulation tools allow you to visualize physics problems directly rather than solving abstract equations on paper.',
        majors: ['Robotics Technology', 'Computational Media'],
        minors: ['Applied Physics'],
        trialCourses: [
          {
            title: 'Intro to Robot Simulation',
            provider: 'freeCodeCamp',
            description: 'Simulate robot motion in virtual web environments.',
            estimatedHours: 5,
            searchQuery: 'freeCodeCamp robot simulation tutorial',
          },
          {
            title: 'Interactive Physics for Simulation',
            provider: 'Khan Academy',
            description: 'Visual physics concepts and mechanics.',
            estimatedHours: 4,
            searchQuery: 'Khan Academy visual physics simulation',
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    resetRateLimits();
    process.env.GEMINI_API_KEY = 'test_ai_key_mock_123';
    process.env.GEMINI_TIMEOUT_MS = '15000';
  });

  afterEach(() => {
    setMockGenAiClient(null);
    process.env.GEMINI_API_KEY = originalApiKey;
    process.env.GEMINI_TIMEOUT_MS = originalTimeout;
  });

  // IT-GUIDE-01: Happy path with mocked Gemini client returning 4 distinct concentrations
  it('IT-GUIDE-01: returns 200 OK with 4 distinct career concentrations and summary on valid payload', async () => {
    const mockClient = {
      models: {
        generateContent: async () => ({
          text: JSON.stringify(sampleGeminiResponse),
        }),
      },
    };
    setMockGenAiClient(mockClient);

    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.1',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const data: any = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.summary);
    assert.strictEqual(data.summary.studentArchetype, 'The Strategic Systems Architect');
    assert.strictEqual(data.pathways.length, 4);

    const tiers = data.pathways.map((p: any) => p.matchTier);
    assert.deepStrictEqual(tiers, [
      'Primary Direct Match',
      'High-Growth Pathway',
      'Interdisciplinary Pivot',
      'Moonshot Trajectory',
    ]);
  });

  // IT-GUIDE-02: 415 Unsupported Media Type on non-JSON request
  it('IT-GUIDE-02: returns 415 Unsupported Media Type if Content-Type is not application/json', async () => {
    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'invalid body',
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 415);
    assert.strictEqual(res.headers.get('Content-Type'), 'application/problem+json');

    const problem: any = await res.json();
    assert.strictEqual(problem.status, 415);
    assert.strictEqual(problem.code, 'UNSUPPORTED_MEDIA_TYPE');
    assert.strictEqual(problem.instance, '/api/guide');
    assert.ok(problem.type.includes('pathless.app'));
  });

  // IT-GUIDE-03: 413 Payload Too Large on > 10 KB payload
  it('IT-GUIDE-03: returns 413 Payload Too Large if request exceeds 10 KB limit', async () => {
    const hugePayload = {
      ...validPayload,
      intakeAnswers: {
        ...validPayload.intakeAnswers,
        q3AcademicHesitation: 'x'.repeat(12 * 1024),
      },
    };

    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': String(15 * 1024),
      },
      body: JSON.stringify(hugePayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 413);
    const problem: any = await res.json();
    assert.strictEqual(problem.code, 'PAYLOAD_TOO_LARGE');
  });

  // IT-GUIDE-04: 400 Bad Request on invalid fields with calm client error guidance
  it('IT-GUIDE-04: returns 400 Bad Request on missing or invalid intake fields', async () => {
    const invalidPayload = {
      studentProfile: { fullName: '', gradeLevel: 'invalid_grade' },
      intakeAnswers: {},
    };

    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400);

    const problem: any = await res.json();
    assert.strictEqual(problem.code, 'VALIDATION_FAILED');
    assert.ok(Array.isArray(problem.invalidParams));
    assert.ok(problem.invalidParams.length > 0);
  });

  // IT-GUIDE-05: 429 Too Many Requests on burst limit with Retry-After
  it('IT-GUIDE-05: returns 429 Too Many Requests when client IP exceeds 3 requests per minute', async () => {
    const mockClient = {
      models: {
        generateContent: async () => ({
          text: JSON.stringify(sampleGeminiResponse),
        }),
      },
    };
    setMockGenAiClient(mockClient);

    const clientIp = '203.0.113.88';

    for (let i = 0; i < 3; i++) {
      const req = new Request('http://localhost:3000/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': clientIp,
        },
        body: JSON.stringify(validPayload),
      });
      const res = await POST(req);
      assert.strictEqual(res.status, 200);
    }

    const blockedReq = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': clientIp,
      },
      body: JSON.stringify(validPayload),
    });
    const blockedRes = await POST(blockedReq);
    assert.strictEqual(blockedRes.status, 429);
    assert.ok(blockedRes.headers.get('Retry-After'));

    const problem: any = await blockedRes.json();
    assert.strictEqual(problem.code, 'RATE_LIMITED');
  });

  // IT-GUIDE-06: 504 Gateway Timeout on upstream delay
  it('IT-GUIDE-06: returns 504 Gateway Timeout when Gemini call exceeds timeout threshold', async () => {
    process.env.GEMINI_TIMEOUT_MS = '50';

    const mockClient = {
      models: {
        generateContent: async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return { text: JSON.stringify(sampleGeminiResponse) };
        },
      },
    };
    setMockGenAiClient(mockClient);

    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.99',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 504);

    const problem: any = await res.json();
    assert.strictEqual(problem.code, 'GATEWAY_TIMEOUT');
  });

  // IT-GUIDE-07: 500 Sanitization on upstream failure without secret leakage
  it('IT-GUIDE-07: sanitizes upstream errors and masks sensitive credentials', async () => {
    const secretKey = 'super_secret_ai_key_999';
    process.env.GEMINI_API_KEY = secretKey;

    const mockClient = {
      models: {
        generateContent: async () => {
          throw new Error(`Upstream failed with authorization key=${secretKey}`);
        },
      },
    };
    setMockGenAiClient(mockClient);

    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.101',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 500);

    const problem: any = await res.json();
    assert.strictEqual(problem.code, 'AI_SYNTHESIS_FAILED');
    assert.ok(!JSON.stringify(problem).includes(secretKey));
  });

  // IT-GUIDE-08: Curated mock fallback returns 200 OK when GEMINI_API_KEY is omitted
  it('IT-GUIDE-08: returns 200 OK using mock fallback when GEMINI_API_KEY is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.105',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const data: any = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.meta.fallbackUsed, true);
    assert.strictEqual(data.pathways.length, 4);
  });

  // IT-GUIDE-09: Output satisfies word limits (<= 30 overview, <= 65 study path, <= 65 reassurance)
  it('IT-GUIDE-09: enforces word count limits on all pathway cards', async () => {
    delete process.env.GEMINI_API_KEY;

    const req = new Request('http://localhost:3000/api/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.110',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const data: any = await res.json();

    for (const card of data.pathways) {
      assert.ok(wordCount(card.overview) <= 30, `Overview exceeds 30 words: ${card.overview}`);
      assert.ok(wordCount(card.studyPath) <= 65, `Study path exceeds 65 words: ${card.studyPath}`);
      assert.ok(wordCount(card.reassurance) <= 65, `Reassurance exceeds 65 words: ${card.reassurance}`);
      assert.strictEqual(card.trialCourses.length, 2, 'Must have exactly 2 trial courses');
    }
  });
});
