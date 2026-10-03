import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '@/app/api/triage/route';
import { setMockGenAiClient } from '@/lib/gemini';
import { resetRateLimits } from '@/lib/rateLimiter';
import fallbackCareers from '@/fixtures/fallback-careers.json';

describe('Feature 5: POST /api/triage Route Handler Integration Tests', () => {
  const originalApiKey = process.env.GEMINI_API_KEY;
  const originalTimeout = process.env.GEMINI_TIMEOUT_MS;

  const validAnswers = {
    q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS'],
    q2SubjectId: 'STEM_TECH',
    q2Rationale: 'I love software projects but theoretical calculus stresses me out.',
    q3Environment: 'REMOTE_DESK',
    q4Ambition: 'WORKFORCE_DIRECT',
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

  // IT-API-01: Happy path with mocked Gemini 2.5 Flash
  it('IT-API-01: returns 200 OK with 4 career cards and summary on valid payload', async () => {
    const mockClient = {
      models: {
        generateContent: async () => ({
          text: JSON.stringify(fallbackCareers),
        }),
      },
    };
    setMockGenAiClient(mockClient);

    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.1',
      },
      body: JSON.stringify({
        answers: validAnswers,
        studentNickname: 'Jordan',
      }),
    });

    const res = await POST(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.summary);
    assert.equal(data.careers.length, 4);
    assert.equal(data.meta.fallback_used, false);
    assert.equal(data.meta.engine, 'gemini-2.5-flash');
  });

  // IT-API-02: Missing or non-JSON Content-Type returns 415
  it('IT-API-02: returns 415 Unsupported Media Type if Content-Type is not application/json', async () => {
    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'plain text payload',
    });

    const res = await POST(req);
    assert.equal(res.status, 415);

    const problem = await res.json();
    assert.equal(problem.code, 'UNSUPPORTED_MEDIA_TYPE');
    assert.ok(problem.requestId);
  });

  // IT-API-03: Payload size > 10KB returns 413
  it('IT-API-03: returns 413 Payload Too Large when request body exceeds 10KB', async () => {
    const massiveText = 'x'.repeat(10241);
    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '10250',
      },
      body: JSON.stringify({
        answers: validAnswers,
        studentNickname: massiveText,
      }),
    });

    const res = await POST(req);
    assert.equal(res.status, 413);

    const problem = await res.json();
    assert.equal(problem.code, 'PAYLOAD_TOO_LARGE');
  });

  // IT-API-04: Malformed input returns 400 Bad Request with invalidParams
  it('IT-API-04: returns 400 Bad Request with field pointers on invalid intake responses', async () => {
    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: {
          ...validAnswers,
          q2Rationale: '   ', // whitespace only fails validation
        },
      }),
    });

    const res = await POST(req);
    assert.equal(res.status, 400);

    const problem = await res.json();
    assert.equal(problem.code, 'VALIDATION_FAILED');
    assert.ok(Array.isArray(problem.invalidParams));
    assert.ok(problem.invalidParams.some((p: any) => p.name === 'answers.q2Rationale'));
  });

  // IT-API-05: Rate limiting returns 429 Too Many Requests
  it('IT-API-05: returns 429 Too Many Requests with Retry-After when rate limit trips', async () => {
    const mockClient = {
      models: {
        generateContent: async () => ({
          text: JSON.stringify(fallbackCareers),
        }),
      },
    };
    setMockGenAiClient(mockClient);

    const clientIp = '172.16.0.42';

    // Send 3 requests (client burst limit is 3)
    for (let i = 0; i < 3; i++) {
      const req = new Request('http://localhost:3000/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': clientIp,
        },
        body: JSON.stringify({ answers: validAnswers }),
      });
      const res = await POST(req);
      assert.equal(res.status, 200);
    }

    // 4th request from same IP trips the burst rate limit
    const blockedReq = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': clientIp,
      },
      body: JSON.stringify({ answers: validAnswers }),
    });

    const blockedRes = await POST(blockedReq);
    assert.equal(blockedRes.status, 429);
    assert.ok(blockedRes.headers.get('Retry-After'));

    const problem = await blockedRes.json();
    assert.equal(problem.code, 'RATE_LIMITED');
    assert.ok(problem.retryAfter);
  });

  // IT-API-06: Upstream timeout returns 504 Gateway Timeout
  it('IT-API-06: returns 504 Gateway Timeout when Gemini API call exceeds deadline', async () => {
    process.env.GEMINI_TIMEOUT_MS = '50'; // short timeout for test

    const slowMockClient = {
      models: {
        generateContent: async () => {
          // Delay for 150ms to exceed 50ms timeout
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { text: JSON.stringify(fallbackCareers) };
        },
      },
    };
    setMockGenAiClient(slowMockClient);

    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.1.1',
      },
      body: JSON.stringify({ answers: validAnswers }),
    });

    const res = await POST(req);
    assert.equal(res.status, 504);

    const problem = await res.json();
    assert.equal(problem.code, 'GATEWAY_TIMEOUT');
  });

  // IT-API-07: Upstream AI failure returns 500 without leaking secrets
  it('IT-API-07: returns 500 Internal Server Error without leaking secrets on upstream error', async () => {
    const failingMockClient = {
      models: {
        generateContent: async () => {
          throw new Error('GoogleGenAI upstream error: key=SECRET123 failed');
        },
      },
    };
    setMockGenAiClient(failingMockClient);

    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.2.1',
      },
      body: JSON.stringify({ answers: validAnswers }),
    });

    const res = await POST(req);
    assert.equal(res.status, 500);

    const problem = await res.json();
    assert.equal(problem.code, 'AI_SYNTHESIS_FAILED');
    // Ensure no secrets or vendor error messages are reflected in problem details
    assert.equal(JSON.stringify(problem).includes('SECRET123'), false);
    assert.equal(JSON.stringify(problem).includes('GoogleGenAI'), false);
  });

  // IT-API-08: Curated mock fallback when API key is omitted in demo mode
  it('IT-API-08: activates curated mock fallback and returns 200 OK when GEMINI_API_KEY is omitted', async () => {
    process.env.GEMINI_API_KEY = ''; // unset API key
    setMockGenAiClient(null);

    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.3.1',
      },
      body: JSON.stringify({
        answers: validAnswers,
        studentNickname: 'DemoUser',
      }),
    });

    const res = await POST(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.careers.length, 4);
    assert.equal(data.meta.fallback_used, true);
    assert.equal(data.meta.engine, 'curated-mock-fallback');
  });

  // IT-API-09: Accepts friendly alias payload from manual testing
  it('IT-API-09: successfully processes friendly alias payload from manual testing and returns 200 OK', async () => {
    const mockClient = {
      models: {
        generateContent: async () => ({
          text: JSON.stringify(fallbackCareers),
        }),
      },
    };
    setMockGenAiClient(mockClient);

    const manualPayload = {
      answers: {
        taskPreferences: ['building', 'analyzing'],
        subject: 'Science',
        subjectRationale: 'I like understanding how things work.',
        workEnvironment: 'active',
        educationAmbition: 'degree',
      },
    };

    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.4.1',
      },
      body: JSON.stringify(manualPayload),
    });

    const res = await POST(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.careers.length, 4);
  });

  // IT-API-10: Detailed field-level error messages in detail, invalidParams, and errors
  it('IT-API-10: includes specific field-level errors in detail, invalidParams, and errors on validation failure', async () => {
    const invalidPayload = {
      answers: {
        taskPreferences: [], // empty tasks
        subject: 'UnknownSubject', // invalid subject
        subjectRationale: '', // empty rationale
        workEnvironment: 'invalid_setting',
        educationAmbition: 'invalid_goal',
      },
    };

    const req = new Request('http://localhost:3000/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.5.1',
      },
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    assert.equal(res.status, 400);

    const problem = await res.json();
    assert.equal(problem.code, 'VALIDATION_FAILED');
    assert.ok(problem.detail.includes('Specific errors:'));
    assert.ok(problem.detail.includes('answers.q1TaskIds'));
    assert.ok(Array.isArray(problem.invalidParams));
    assert.ok(Array.isArray(problem.errors));
    assert.ok(problem.invalidParams.length >= 3);
  });
});
