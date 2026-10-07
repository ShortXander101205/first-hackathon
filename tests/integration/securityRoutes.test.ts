import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST as guidePost } from '@/app/api/guide/route';
import { POST as loginPost } from '@/app/api/advisor/login/route';
import { POST as notesPost } from '@/app/api/advisor/notes/route';
import { POST as purgePost } from '@/app/api/admin/purge/route';
import {
  guideRateLimiter,
  globalGuideRateLimiter,
  advisorLoginRateLimiter,
  advisorNotesRateLimiter,
  adminPurgeRateLimiter,
} from '@/lib/rateLimit';
import { resetRateLimits } from '@/lib/rateLimiter';
import { createAdvisorSessionToken, getAdvisorCookieHeader } from '@/lib/auth';

describe('Security Routes Integration Tests (AC-SAFE-01, AC-SAFE-02, AC-SAFE-05)', () => {
  beforeEach(() => {
    resetRateLimits();
    guideRateLimiter.reset();
    globalGuideRateLimiter.reset();
    advisorLoginRateLimiter.reset();
    advisorNotesRateLimiter.reset();
    adminPurgeRateLimiter.reset();
  });

  const validGuidePayload = {
    studentProfile: {
      fullName: 'Alex Morgan',
      gradeLevel: 'grade_12',
    },
    intakeAnswers: {
      q1TaskIds: ['task_1'],
      q2SubjectId: 'tech',
      q3AcademicHesitation: 'Worried about college workload',
      q4Environment: 'office',
      q5ProblemSolving: 'step_by_step',
      q6SocialEnergy: 'balanced',
      q7StructureTolerance: 'flexible',
      q8AcademicFriction: 'rote_memorization',
      q9HorizonPriority: 'stability',
      q10PostCollegeAmbition: 'workforce',
    },
  };

  describe('/api/guide Security Defenses', () => {
    it('throttles excessive requests returning HTTP 429 with Retry-After', async () => {
      const clientIp = '198.51.100.99';

      let blockedRes: any = null;
      for (let i = 0; i < 6; i++) {
        const req = new Request('http://localhost/api/guide', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': clientIp,
          },
          body: JSON.stringify(validGuidePayload),
        });
        const res = await guidePost(req);
        if (res.status === 429) {
          blockedRes = res;
          break;
        }
        assert.equal(res.status, 200);
      }

      assert.ok(blockedRes, 'Expected client request to be throttled with HTTP 429');
      assert.equal(blockedRes.status, 429);
      assert.ok(blockedRes.headers.get('Retry-After'));

      const json = await blockedRes.json();
      assert.equal(json.code, 'RATE_LIMITED');
      assert.equal(json.status, 429);
      assert.ok(json.detail.includes('high demand'));
      assert.equal(json.stack, undefined);
    });

    it('rejects payloads exceeding 10 KB with HTTP 413 PAYLOAD_TOO_LARGE', async () => {
      const largePayload = {
        ...validGuidePayload,
        largeGarbage: 'X'.repeat(12 * 1024),
      };

      const req = new Request('http://localhost/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': String(JSON.stringify(largePayload).length),
          'x-forwarded-for': '198.51.100.88',
        },
        body: JSON.stringify(largePayload),
      });

      const res = await guidePost(req);
      assert.equal(res.status, 413);
      const json = await res.json();
      assert.equal(json.code, 'PAYLOAD_TOO_LARGE');
    });

    it('rejects unsupported media types with HTTP 415', async () => {
      const req = new Request('http://localhost/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'x-forwarded-for': '198.51.100.77',
        },
        body: 'plain text',
      });

      const res = await guidePost(req);
      assert.equal(res.status, 415);
      const json = await res.json();
      assert.equal(json.code, 'UNSUPPORTED_MEDIA_TYPE');
    });

    it('strictly rejects unexpected properties with HTTP 400', async () => {
      const payloadWithInjectedProperty = {
        ...validGuidePayload,
        maliciousExtraProperty: 'attacker_injected',
      };

      const req = new Request('http://localhost/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '198.51.100.66',
        },
        body: JSON.stringify(payloadWithInjectedProperty),
      });

      const res = await guidePost(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.equal(json.code, 'VALIDATION_FAILED');
      assert.equal(json.stack, undefined);
    });

    it('sanitizes <script> tags from student full name before processing', async () => {
      const xssPayload = {
        studentProfile: {
          fullName: 'Alex <script>alert("xss")</script>Morgan',
          gradeLevel: 'grade_12',
        },
        intakeAnswers: {
          ...validGuidePayload.intakeAnswers,
          q3AcademicHesitation: 'Normal hesitation thoughts',
        },
      };

      const req = new Request('http://localhost/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '198.51.100.55',
        },
        body: JSON.stringify(xssPayload),
      });

      const res = await guidePost(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      // Verifies sanitized response does not contain script tag
      assert.ok(!JSON.stringify(json).includes('<script>'));
    });
  });

  describe('/api/advisor/login Security Defenses', () => {
    it('throttles excessive passcode attempts after 5 tries within 1 minute', async () => {
      const attackerIp = '198.51.100.44';

      for (let i = 0; i < 5; i++) {
        const req = new Request('http://localhost/api/advisor/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': attackerIp,
          },
          body: JSON.stringify({ passcode: 'WRONG_PASSCODE' }),
        });
        const res = await loginPost(req);
        assert.equal(res.status, 401);
      }

      // 6th attempt is throttled with 429
      const throttledReq = new Request('http://localhost/api/advisor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': attackerIp,
        },
        body: JSON.stringify({ passcode: 'WRONG_PASSCODE' }),
      });

      const throttledRes = await loginPost(throttledReq);
      assert.equal(throttledRes.status, 429);
      const json = await throttledRes.json();
      assert.equal(json.code, 'RATE_LIMITED');
      assert.ok(throttledRes.headers.get('Retry-After'));
    });

    it('sanitizes script tags from authorName upon successful login', async () => {
      const req = new Request('http://localhost/api/advisor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '198.51.100.33',
        },
        body: JSON.stringify({
          passcode: 'TEACHER2026',
          authorName: 'Advisor <script>bad()</script>Lee',
        }),
      });

      const res = await loginPost(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.authorName, 'Advisor Lee');
      assert.ok(!json.authorName.includes('<script>'));
    });
  });

  describe('/api/advisor/notes Security Defenses', () => {
    it('returns 401 UNAUTHORIZED when session cookie is absent', async () => {
      const req = new Request('http://localhost/api/advisor/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: 'sub_1', content: 'Test note' }),
      });

      const res = await notesPost(req);
      assert.equal(res.status, 401);
      const json = await res.json();
      assert.equal(json.code, 'UNAUTHORIZED');
      assert.equal(json.stack, undefined);
    });

    it('sanitizes HTML tags from note content before saving', async () => {
      const token = createAdvisorSessionToken('Advisor Smith');
      const cookieHeader = getAdvisorCookieHeader(token);

      const req = new Request('http://localhost/api/advisor/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader.split(';')[0],
          'x-forwarded-for': '198.51.100.22',
        },
        body: JSON.stringify({
          submissionId: 'mock_sub_1',
          content: 'Student is exploring <script>steal()</script><b>Computer Science</b>.',
        }),
      });

      const res = await notesPost(req);
      assert.equal(res.status, 201);
      const json = await res.json();
      assert.equal(json.note.content, 'Student is exploring Computer Science.');
      assert.ok(!json.note.content.includes('<script>'));
    });
  });

  describe('/api/admin/purge Security Defenses', () => {
    it('returns 401 UNAUTHORIZED when admin credentials and advisor session are missing', async () => {
      const req = new Request('http://localhost/api/admin/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await purgePost(req);
      assert.equal(res.status, 401);
      const json = await res.json();
      assert.equal(json.code, 'UNAUTHORIZED');
      assert.equal(json.stack, undefined);
    });
  });
});
