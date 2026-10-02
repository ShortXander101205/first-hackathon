import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isStep1Valid,
  isStep2Valid,
  isStep3Valid,
  isStep4Valid,
  validateStep,
  INITIAL_INTAKE_ANSWERS,
} from '@/context/IntakeContext';
import type { IntakeAnswersState } from '@/types/intake';

describe('Pure Step Validation Engine Tests', () => {
  // UT-VAL-01: Step 1 (1-2 Task chips)
  describe('Step 1 Validation: Intellectual Energy Tasks', () => {
    it('returns false when 0 task chips are selected', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q1TaskIds: [],
      };
      assert.equal(isStep1Valid(answers), false);
      assert.equal(validateStep(1, answers), false);
    });

    it('returns true when exactly 1 task chip is selected', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q1TaskIds: ['BUILD_SYSTEMS'],
      };
      assert.equal(isStep1Valid(answers), true);
      assert.equal(validateStep(1, answers), true);
    });

    it('returns true when exactly 2 task chips are selected', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS'],
      };
      assert.equal(isStep1Valid(answers), true);
      assert.equal(validateStep(1, answers), true);
    });

    it('returns false if more than 2 task chips are provided', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS', 'HELP_HUMANS'],
      };
      assert.equal(isStep1Valid(answers), false);
      assert.equal(validateStep(1, answers), false);
    });
  });

  // UT-VAL-02 through UT-VAL-07: Step 2 (Subject & 1-150 char Rationale)
  describe('Step 2 Validation: Academic Subject & Rationale', () => {
    it('returns false when subject is null, even with a valid rationale', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q2SubjectId: null,
        q2Rationale: 'I love science but math stresses me out.',
      };
      assert.equal(isStep2Valid(answers), false);
    });

    it('returns false when subject is empty string', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q2SubjectId: '',
        q2Rationale: 'I love science but math stresses me out.',
      };
      assert.equal(isStep2Valid(answers), false);
    });

    it('returns false when subject is chosen but rationale is completely empty', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q2SubjectId: 'HEALTH_BIO',
        q2Rationale: '',
      };
      assert.equal(isStep2Valid(answers), false);
    });

    it('returns false when rationale contains only whitespace', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q2SubjectId: 'HEALTH_BIO',
        q2Rationale: '   \n\t  ',
      };
      assert.equal(isStep2Valid(answers), false);
    });

    it('returns true when subject is chosen and rationale has at least 1 non-whitespace character', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q2SubjectId: 'HEALTH_BIO',
        q2Rationale: 'A',
      };
      assert.equal(isStep2Valid(answers), true);
      assert.equal(validateStep(2, answers), true);
    });

    it('returns true when rationale is at the maximum limit of 150 characters', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q2SubjectId: 'STEM_TECH',
        q2Rationale: 'x'.repeat(150),
      };
      assert.equal(answers.q2Rationale.length, 150);
      assert.equal(isStep2Valid(answers), true);
    });

    it('returns false when rationale exceeds 150 characters', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q2SubjectId: 'STEM_TECH',
        q2Rationale: 'x'.repeat(151),
      };
      assert.equal(isStep2Valid(answers), false);
    });

    it('verifies exact boundary: invalid when empty/whitespace, valid from 1 to 150 chars', () => {
      const base: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q2SubjectId: 'STEM_TECH',
        q2Rationale: '',
      };
      // Blank
      assert.equal(isStep2Valid(base), false);
      // Whitespace-only
      assert.equal(isStep2Valid({ ...base, q2Rationale: '   ' }), false);
      // Exactly 1 character
      assert.equal(isStep2Valid({ ...base, q2Rationale: 'a' }), true);
      // 2 characters
      assert.equal(isStep2Valid({ ...base, q2Rationale: 'ab' }), true);
      // Exactly 150 characters
      assert.equal(isStep2Valid({ ...base, q2Rationale: 'a'.repeat(150) }), true);
      // 151 characters
      assert.equal(isStep2Valid({ ...base, q2Rationale: 'a'.repeat(151) }), false);
    });
  });

  // UT-VAL-08: Step 3 (Binary Work Setting)
  describe('Step 3 Validation: Work Setting', () => {
    it('returns false when setting is null', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q3Environment: null,
      };
      assert.equal(isStep3Valid(answers), false);
    });

    it('returns true when REMOTE_DESK is selected', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q3Environment: 'REMOTE_DESK',
      };
      assert.equal(isStep3Valid(answers), true);
      assert.equal(validateStep(3, answers), true);
    });

    it('returns true when ACTIVE_FIELD_LAB is selected', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q3Environment: 'ACTIVE_FIELD_LAB',
      };
      assert.equal(isStep3Valid(answers), true);
      assert.equal(validateStep(3, answers), true);
    });
  });

  // UT-VAL-09: Step 4 (Binary Post-College Ambition)
  describe('Step 4 Validation: Future Ambition', () => {
    it('returns false when ambition is null', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q4Ambition: null,
      };
      assert.equal(isStep4Valid(answers), false);
    });

    it('returns true when WORKFORCE_DIRECT is selected', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q4Ambition: 'WORKFORCE_DIRECT',
      };
      assert.equal(isStep4Valid(answers), true);
      assert.equal(validateStep(4, answers), true);
    });

    it('returns true when GRADUATE_STUDY is selected', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q4Ambition: 'GRADUATE_STUDY',
      };
      assert.equal(isStep4Valid(answers), true);
      assert.equal(validateStep(4, answers), true);
    });
  });

  // Edge cases: Malformed inputs, duplicates, and non-string types
  describe('Defensive Validation Edge Cases', () => {
    it('returns false for Step 1 when task IDs contain duplicates', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q1TaskIds: ['BUILD_SYSTEMS', 'BUILD_SYSTEMS'],
      };
      assert.equal(isStep1Valid(answers), false);
    });

    it('returns false for Step 1 when task IDs contain only empty whitespace strings', () => {
      const answers: IntakeAnswersState = {
        ...INITIAL_INTAKE_ANSWERS,
        q1TaskIds: ['   '],
      };
      assert.equal(isStep1Valid(answers), false);
    });

    it('returns false when answers object is null or undefined', () => {
      assert.equal(isStep1Valid(null as unknown as IntakeAnswersState), false);
      assert.equal(isStep2Valid(null as unknown as IntakeAnswersState), false);
      assert.equal(isStep3Valid(null as unknown as IntakeAnswersState), false);
      assert.equal(isStep4Valid(null as unknown as IntakeAnswersState), false);
    });
  });
});

