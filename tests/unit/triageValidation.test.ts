import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  triageRequestSchema,
  triageResultSchema,
  careerCardSchema,
  trialCourseSchema,
} from '@/schemas/triage.schema';
import fallbackCareers from '@/fixtures/fallback-careers.json';

describe('Triage Zod Schemas Unit Tests', () => {
  const validAnswers = {
    q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS'] as const,
    q2SubjectId: 'STEM_TECH' as const,
    q2Rationale: 'I love coding small apps, but theoretical calculus stresses me out.',
    q3Environment: 'REMOTE_DESK' as const,
    q4Ambition: 'WORKFORCE_DIRECT' as const,
  };

  // 1. Request Body Validation
  describe('triageRequestSchema', () => {
    it('accepts a fully valid request body with optional nickname', () => {
      const payload = {
        answers: validAnswers,
        studentNickname: 'Alex Chen',
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, true);
    });

    it('accepts a valid request body when studentNickname is omitted', () => {
      const payload = {
        answers: validAnswers,
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, true);
      if (parsed.success) {
        assert.equal(parsed.data.studentNickname, '');
      }
    });

    it('rejects when answers object is missing', () => {
      const payload = { studentNickname: 'Alex' };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, false);
    });

    it('rejects when q1TaskIds has 0 selected tasks', () => {
      const payload = {
        answers: { ...validAnswers, q1TaskIds: [] },
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, false);
    });

    it('accepts when q1TaskIds has exactly 1 task', () => {
      const payload = {
        answers: { ...validAnswers, q1TaskIds: ['BUILD_SYSTEMS'] },
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, true);
    });

    it('rejects when q1TaskIds has 3 tasks (max is 2)', () => {
      const payload = {
        answers: {
          ...validAnswers,
          q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS', 'HELP_HUMANS'],
        },
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, false);
    });

    it('rejects when q2SubjectId is not a valid enum value', () => {
      const payload = {
        answers: { ...validAnswers, q2SubjectId: 'ASTROLOGY_MAGIC' },
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, false);
    });

    it('rejects when q2Rationale is empty or whitespace-only', () => {
      const payloadEmpty = {
        answers: { ...validAnswers, q2Rationale: '' },
      };
      assert.equal(triageRequestSchema.safeParse(payloadEmpty).success, false);

      const payloadWhitespace = {
        answers: { ...validAnswers, q2Rationale: '   \n\t  ' },
      };
      assert.equal(triageRequestSchema.safeParse(payloadWhitespace).success, false);
    });

    it('rejects when q2Rationale exceeds 150 characters', () => {
      const longRationale = 'a'.repeat(151);
      const payload = {
        answers: { ...validAnswers, q2Rationale: longRationale },
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, false);
    });

    it('rejects when q3Environment is invalid', () => {
      const payload = {
        answers: { ...validAnswers, q3Environment: 'ON_A_BOAT' },
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, false);
    });

    it('rejects when q4Ambition is invalid', () => {
      const payload = {
        answers: { ...validAnswers, q4Ambition: 'RETIRE_TOMORROW' },
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, false);
    });

    it('rejects when studentNickname exceeds 50 characters', () => {
      const payload = {
        answers: validAnswers,
        studentNickname: 'x'.repeat(51),
      };
      const parsed = triageRequestSchema.safeParse(payload);
      assert.equal(parsed.success, false);
    });

    it('accepts and normalizes friendly alias payload (manual testing structure)', () => {
      const manualPayload = {
        answers: {
          taskPreferences: ['building', 'analyzing'],
          subject: 'Science',
          subjectRationale: 'I like understanding how things work.',
          workEnvironment: 'active',
          educationAmbition: 'degree',
        },
      };

      const parsed = triageRequestSchema.safeParse(manualPayload);
      assert.equal(parsed.success, true);
      if (parsed.success) {
        assert.deepEqual(parsed.data.answers.q1TaskIds, ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS']);
        assert.equal(parsed.data.answers.q2SubjectId, 'HEALTH_BIO');
        assert.equal(parsed.data.answers.q2Rationale, 'I like understanding how things work.');
        assert.equal(parsed.data.answers.q3Environment, 'ACTIVE_FIELD_LAB');
        assert.equal(parsed.data.answers.q4Ambition, 'GRADUATE_STUDY');
        assert.equal(parsed.data.studentNickname, '');
      }
    });

    it('normalizes alternative tech and workforce aliases correctly', () => {
      const aliasPayload = {
        answers: {
          taskPreferences: ['helping', 'leading'],
          subject: 'Technology',
          subjectRationale: 'Interested in coding and tech teams.',
          workEnvironment: 'remote',
          educationAmbition: 'workforce',
        },
        studentNickname: 'Sam',
      };

      const parsed = triageRequestSchema.safeParse(aliasPayload);
      assert.equal(parsed.success, true);
      if (parsed.success) {
        assert.deepEqual(parsed.data.answers.q1TaskIds, ['HELP_HUMANS', 'LEAD_ORGANIZING']);
        assert.equal(parsed.data.answers.q2SubjectId, 'STEM_TECH');
        assert.equal(parsed.data.answers.q3Environment, 'REMOTE_DESK');
        assert.equal(parsed.data.answers.q4Ambition, 'WORKFORCE_DIRECT');
        assert.equal(parsed.data.studentNickname, 'Sam');
      }
    });
  });

  // 2. Result Schema & 4-Career Validation
  describe('triageResultSchema', () => {
    it('accepts curated fallback payload with 4 distinct tiers', () => {
      const result = triageResultSchema.safeParse(fallbackCareers);
      assert.equal(result.success, true);
    });

    it('rejects result payload when careers array has only 3 cards', () => {
      const threeCards = {
        summary: fallbackCareers.summary,
        careers: fallbackCareers.careers.slice(0, 3),
      };
      const parsed = triageResultSchema.safeParse(threeCards);
      assert.equal(parsed.success, false);
    });

    it('rejects result payload when careers array has 5 cards', () => {
      const fiveCards = {
        summary: fallbackCareers.summary,
        careers: [...fallbackCareers.careers, fallbackCareers.careers[0]],
      };
      const parsed = triageResultSchema.safeParse(fiveCards);
      assert.equal(parsed.success, false);
    });

    it('rejects result payload when match tiers contain duplicates', () => {
      const duplicateTierCards = {
        summary: fallbackCareers.summary,
        careers: [
          fallbackCareers.careers[0],
          { ...fallbackCareers.careers[1], match_tier: 'Primary Direct Match' },
          fallbackCareers.careers[2],
          fallbackCareers.careers[3],
        ],
      };
      const parsed = triageResultSchema.safeParse(duplicateTierCards);
      assert.equal(parsed.success, false);
    });

    it('rejects career card when trial courses has only 1 course', () => {
      const invalidCard = {
        ...fallbackCareers.careers[0],
        trial_courses: [fallbackCareers.careers[0].trial_courses[0]],
      };
      const parsed = careerCardSchema.safeParse(invalidCard);
      assert.equal(parsed.success, false);
    });

    it('accepts valid trial course schema', () => {
      const course = {
        title: 'Introduction to Cloud Computing',
        provider: 'AWS Skill Builder',
        description: 'Hands-on beginner tutorial covering core infrastructure.',
        estimated_hours: 6,
      };
      assert.equal(trialCourseSchema.safeParse(course).success, true);
    });
  });
});
