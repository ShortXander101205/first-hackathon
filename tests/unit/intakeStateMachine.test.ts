import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isStep0Valid,
  isStep1Valid,
  isStep2Valid,
  isStep3Valid,
  isStep4Valid,
  isStep5Valid,
  isStep6Valid,
  isStep7Valid,
  isStep8Valid,
  isStep9Valid,
  isStep10Valid,
  validateStep,
  canAccessStep,
  intakeReducer,
  INITIAL_INTAKE_STATE,
} from '@/context/IntakeContext';
import type { StudentProfile, IntakeState } from '@/types/intake';

describe('Feature 7: Intake State Machine & Navigation Unit Tests', () => {
  // AC-INTAKE-01: Step 0 Profile Validation
  describe('Step 0 Profile Validation (AC-INTAKE-01)', () => {
    it('returns false when profile is undefined or null', () => {
      assert.equal(isStep0Valid(undefined), false);
      assert.equal(isStep0Valid(null as any), false);
    });

    it('returns false when full name is empty or only whitespace', () => {
      assert.equal(isStep0Valid({ fullName: '', gradeLevel: 'grade_10' }), false);
      assert.equal(isStep0Valid({ fullName: '   ', gradeLevel: 'grade_10' }), false);
    });

    it('returns false when grade level is missing or invalid', () => {
      assert.equal(isStep0Valid({ fullName: 'Alex Morgan', gradeLevel: '' as any }), false);
      assert.equal(isStep0Valid({ fullName: 'Alex Morgan', gradeLevel: 'kindergarten' as any }), false);
    });

    it('returns true for required name and grade with omitted studentId', () => {
      assert.equal(isStep0Valid({ fullName: 'Alex Morgan', gradeLevel: 'grade_11' }), true);
      assert.equal(isStep0Valid({ fullName: 'Sam Taylor', gradeLevel: 'college_freshman' }), true);
    });

    it('accepts optional opaque student ID within 64 character boundary', () => {
      assert.equal(
        isStep0Valid({
          fullName: 'Taylor Morgan',
          gradeLevel: 'grade_12',
          studentId: 'SCH-8841-A',
        }),
        true
      );
    });

    it('rejects student ID exceeding 64 characters', () => {
      assert.equal(
        isStep0Valid({
          fullName: 'Taylor Morgan',
          gradeLevel: 'grade_12',
          studentId: 'A'.repeat(65),
        }),
        false
      );
    });
  });

  // AC-INTAKE-02: 10-Question Validation Engine
  describe('10-Question Validation Engine (AC-INTAKE-02)', () => {
    it('isStep1Valid requires 1 or 2 task IDs', () => {
      assert.equal(isStep1Valid({ q1TaskIds: [] }), false);
      assert.equal(isStep1Valid({ q1TaskIds: ['BUILD_SYSTEMS'] }), true);
      assert.equal(isStep1Valid({ q1TaskIds: ['BUILD_SYSTEMS', 'HELP_HUMANS'] }), true);
      assert.equal(isStep1Valid({ q1TaskIds: ['A', 'B', 'C'] }), false);
      assert.equal(isStep1Valid({ q1TaskIds: ['BUILD_SYSTEMS', 'BUILD_SYSTEMS'] }), false); // Duplicate
    });

    it('isStep2Valid requires valid academic subject', () => {
      assert.equal(isStep2Valid({ q2SubjectId: null }), false);
      assert.equal(isStep2Valid({ q2SubjectId: '' }), false);
      assert.equal(isStep2Valid({ q2SubjectId: 'TECH_COMPUTING' }), true);
    });

    it('isStep3Valid validates hesitation text (1 to 200 characters)', () => {
      assert.equal(isStep3Valid({ q3AcademicHesitation: '' }), false);
      assert.equal(isStep3Valid({ q3AcademicHesitation: '   ' }), false);
      assert.equal(isStep3Valid({ q3AcademicHesitation: 'Math stresses me out.' }), true);
      assert.equal(isStep3Valid({ q3AcademicHesitation: 'A'.repeat(201) }), false);
    });

    it('isStep4Valid requires valid physical environment enum', () => {
      assert.equal(isStep4Valid({ q4Environment: null }), false);
      assert.equal(isStep4Valid({ q4Environment: 'REMOTE_DIGITAL' }), true);
      assert.equal(isStep4Valid({ q4Environment: 'ACTIVE_FIELD_LAB' }), true);
    });

    it('isStep5Valid through isStep10Valid validate enum fields correctly', () => {
      assert.equal(isStep5Valid({ q5ProblemSolving: 'SYSTEMATIC_LOGIC' }), true);
      assert.equal(isStep5Valid({ q5ProblemSolving: 'INVALID' }), false);

      assert.equal(isStep6Valid({ q6SocialEnergy: 'BALANCED_TEAM' }), true);
      assert.equal(isStep6Valid({ q6SocialEnergy: undefined }), false);

      assert.equal(isStep7Valid({ q7StructureTolerance: 'BALANCED_MILESTONES' }), true);
      assert.equal(isStep8Valid({ q8AcademicFriction: 'ADVANCED_MATH' }), true);
      assert.equal(isStep9Valid({ q9HorizonPriority: 'FINANCIAL_STABILITY' }), true);
      assert.equal(isStep10Valid({ q10PostCollegeAmbition: 'WORKFORCE_DIRECT' }), true);
    });
  });

  // AC-INTAKE-03: Navigation Guards & Sequential Flow
  describe('Navigation Guards (canAccessStep & validateStep)', () => {
    const validProfile: StudentProfile = { fullName: 'Alex Morgan', gradeLevel: 'grade_10' };
    const emptyAnswers = { q1TaskIds: [] };

    it('allows access to Step 0 and Step 1 unconditionally', () => {
      assert.equal(canAccessStep(0, 0, validProfile, emptyAnswers), true);
      assert.equal(canAccessStep(1, 0, validProfile, emptyAnswers), true);
    });

    it('always permits regressive navigation (backward to Step 0 without clearing answers)', () => {
      assert.equal(canAccessStep(0, 5, validProfile, emptyAnswers), true);
      assert.equal(canAccessStep(2, 5, validProfile, emptyAnswers), true);
    });

    it('blocks forward navigation to Step 2 if Step 1 is invalid', () => {
      assert.equal(canAccessStep(2, 1, validProfile, { q1TaskIds: [] }), false);
    });

    it('permits forward navigation to Step 2 when Step 1 is completed', () => {
      assert.equal(canAccessStep(2, 1, validProfile, { q1TaskIds: ['BUILD_SYSTEMS'] }), true);
    });
  });

  // AC-INTAKE-03: Reducer State Transitions
  describe('Intake Reducer Actions (intakeReducer)', () => {
    it('SET_FULL_NAME updates profile name and studentNickname', () => {
      const state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'SET_FULL_NAME',
        payload: '  Jordan Taylor  ',
      });
      assert.equal(state.profile?.fullName, 'Jordan Taylor');
      assert.equal(state.studentNickname, 'Jordan Taylor');
    });

    it('TOGGLE_Q1_TASK toggles selection up to 2 items', () => {
      let state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'TOGGLE_Q1_TASK',
        payload: 'BUILD_SYSTEMS',
      });
      assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS']);

      state = intakeReducer(state, {
        type: 'TOGGLE_Q1_TASK',
        payload: 'HELP_HUMANS',
      });
      assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS', 'HELP_HUMANS']);

      // Attempting 3rd chip is ignored
      state = intakeReducer(state, {
        type: 'TOGGLE_Q1_TASK',
        payload: 'ANALYZE_PATTERNS',
      });
      assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS', 'HELP_HUMANS']);

      // Clicking existing chip removes it
      state = intakeReducer(state, {
        type: 'TOGGLE_Q1_TASK',
        payload: 'BUILD_SYSTEMS',
      });
      assert.deepEqual(state.answers.q1TaskIds, ['HELP_HUMANS']);
    });

    it('NEXT_STEP validates step and advances or attaches calm errors', () => {
      // Step 0 invalid state
      let state = intakeReducer(INITIAL_INTAKE_STATE, { type: 'NEXT_STEP' });
      assert.equal(state.currentStep, 0);
      assert.ok(state.validationErrors.fullName);

      // Populate Step 0
      state = intakeReducer(state, { type: 'SET_FULL_NAME', payload: 'Alex Morgan' });
      state = intakeReducer(state, { type: 'SET_GRADE_LEVEL', payload: 'grade_11' });

      // Advance to Step 1
      state = intakeReducer(state, { type: 'NEXT_STEP' });
      assert.equal(state.currentStep, 1);
    });

    it('PREVIOUS_STEP navigates backward to Step 0 preserving existing answers', () => {
      let state: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 3,
        profile: { fullName: 'Alex Morgan', gradeLevel: 'grade_11' },
        answers: {
          ...INITIAL_INTAKE_STATE.answers,
          q1TaskIds: ['BUILD_SYSTEMS'],
          q2SubjectId: 'TECH_COMPUTING',
        },
      };

      state = intakeReducer(state, { type: 'PREVIOUS_STEP' });
      assert.equal(state.currentStep, 2);
      assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS']);

      state = intakeReducer(state, { type: 'PREVIOUS_STEP' });
      assert.equal(state.currentStep, 1);

      state = intakeReducer(state, { type: 'PREVIOUS_STEP' });
      assert.equal(state.currentStep, 0);
      // All answers remain intact after returning to Step 0
      assert.equal(state.answers.q2SubjectId, 'TECH_COMPUTING');
    });

    it('RESET_STATE restores clean initial state with hydration enabled', () => {
      const dirtyState: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 4,
        profile: { fullName: 'Alex', gradeLevel: 'grade_11' },
        answers: {
          ...INITIAL_INTAKE_STATE.answers,
          q1TaskIds: ['BUILD_SYSTEMS'],
        },
      };

      const resetState = intakeReducer(dirtyState, { type: 'RESET_STATE' });
      assert.equal(resetState.currentStep, 0);
      assert.equal(resetState.profile?.fullName, '');
      assert.deepEqual(resetState.answers.q1TaskIds, []);
      assert.equal(resetState.isHydrated, true);
    });
  });
});
