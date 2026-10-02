import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  intakeReducer,
  INITIAL_INTAKE_STATE,
} from '@/context/IntakeContext';
import type { IntakeState } from '@/types/intake';
import { INTAKE_COPY } from '@/constants/intakeCopy';

describe('Intake Reducer Unit Tests (intakeReducer)', () => {
  // UT-RED-01 & UT-RED-02: TOGGLE_TASK
  describe('TOGGLE_TASK Action', () => {
    it('adds a task ID when 0 selected', () => {
      const state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'TOGGLE_TASK',
        payload: 'BUILD_SYSTEMS',
      });
      assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS']);
    });

    it('adds a 2nd task ID when 1 selected', () => {
      let state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'TOGGLE_TASK',
        payload: 'BUILD_SYSTEMS',
      });
      state = intakeReducer(state, {
        type: 'TOGGLE_TASK',
        payload: 'ANALYZE_PATTERNS',
      });
      assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS']);
    });

    it('enforces a strict maximum of 2 task chips: ignores 3rd chip', () => {
      let state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'TOGGLE_TASK',
        payload: 'BUILD_SYSTEMS',
      });
      state = intakeReducer(state, {
        type: 'TOGGLE_TASK',
        payload: 'ANALYZE_PATTERNS',
      });
      // Attempt 3rd selection
      state = intakeReducer(state, {
        type: 'TOGGLE_TASK',
        payload: 'HELP_HUMANS',
      });
      assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS']);
    });

    it('removes an already selected task ID when clicked again', () => {
      let state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'TOGGLE_TASK',
        payload: 'BUILD_SYSTEMS',
      });
      state = intakeReducer(state, {
        type: 'TOGGLE_TASK',
        payload: 'BUILD_SYSTEMS',
      });
      assert.deepEqual(state.answers.q1TaskIds, []);
    });
  });

  // UT-RED-03: SET_SUBJECT
  describe('SET_SUBJECT Action', () => {
    it('updates subject ID and clears any previous subject validation error', () => {
      const stateWithErr: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        validationErrors: { q2Subject: 'Please choose a subject' },
      };
      const state = intakeReducer(stateWithErr, {
        type: 'SET_SUBJECT',
        payload: 'STEM_TECH',
      });
      assert.equal(state.answers.q2SubjectId, 'STEM_TECH');
      assert.equal(state.validationErrors.q2Subject, undefined);
    });
  });

  // UT-RED-04: SET_RATIONALE
  describe('SET_RATIONALE Action', () => {
    it('updates rationale text and clears error when trimmed length is >= 1', () => {
      const stateWithErr: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        validationErrors: { q2Rationale: 'Please enter a note' },
      };
      const state = intakeReducer(stateWithErr, {
        type: 'SET_RATIONALE',
        payload: 'Interested in software architecture.',
      });
      assert.equal(state.answers.q2Rationale, 'Interested in software architecture.');
      assert.equal(state.validationErrors.q2Rationale, undefined);
    });

    it('clamps rationale text strictly to 150 characters when pasted', () => {
      const longText = 'a'.repeat(300);
      const state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'SET_RATIONALE',
        payload: longText,
      });
      assert.equal(state.answers.q2Rationale.length, 150);
      assert.equal(state.answers.q2Rationale, 'a'.repeat(150));
    });
  });

  // UT-RED-05: SET_ENVIRONMENT
  describe('SET_ENVIRONMENT Action', () => {
    it('updates environment choice and clears q3 validation error', () => {
      const stateWithErr: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        validationErrors: { q3: 'Required' },
      };
      const state = intakeReducer(stateWithErr, {
        type: 'SET_ENVIRONMENT',
        payload: 'REMOTE_DESK',
      });
      assert.equal(state.answers.q3Environment, 'REMOTE_DESK');
      assert.equal(state.validationErrors.q3, undefined);
    });
  });

  // UT-RED-06: SET_AMBITION
  describe('SET_AMBITION Action', () => {
    it('updates ambition choice and clears q4 validation error', () => {
      const stateWithErr: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        validationErrors: { q4: 'Required' },
      };
      const state = intakeReducer(stateWithErr, {
        type: 'SET_AMBITION',
        payload: 'WORKFORCE_DIRECT',
      });
      assert.equal(state.answers.q4Ambition, 'WORKFORCE_DIRECT');
      assert.equal(state.validationErrors.q4, undefined);
    });
  });

  // UT-RED-07 & UT-RED-08: NEXT_STEP
  describe('NEXT_STEP Action', () => {
    it('advances currentStep when the active step is valid', () => {
      const validStep1State: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 1,
        answers: {
          ...INITIAL_INTAKE_STATE.answers,
          q1TaskIds: ['BUILD_SYSTEMS'],
        },
      };
      const nextState = intakeReducer(validStep1State, { type: 'NEXT_STEP' });
      assert.equal(nextState.currentStep, 2);
      assert.deepEqual(nextState.validationErrors, {});
    });

    it('blocks advancing and attaches validation error when currentStep is invalid', () => {
      const invalidStep1State: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 1,
        answers: {
          ...INITIAL_INTAKE_STATE.answers,
          q1TaskIds: [],
        },
      };
      const nextState = intakeReducer(invalidStep1State, { type: 'NEXT_STEP' });
      assert.equal(nextState.currentStep, 1);
      assert.equal(nextState.validationErrors.q1, INTAKE_COPY.validation.step1Required);
    });

    it('sets isCompleted = true when completing Step 4', () => {
      const validStep4State: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 4,
        answers: {
          ...INITIAL_INTAKE_STATE.answers,
          q1TaskIds: ['BUILD_SYSTEMS'],
          q2SubjectId: 'STEM_TECH',
          q2Rationale: 'Curious about web tech.',
          q3Environment: 'REMOTE_DESK',
          q4Ambition: 'GRADUATE_STUDY',
        },
      };
      const nextState = intakeReducer(validStep4State, { type: 'NEXT_STEP' });
      assert.equal(nextState.isCompleted, true);
    });

    it('attaches step2RationaleMaxLength error when Step 2 rationale exceeds 150 chars', () => {
      const longRationaleState: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 2,
        answers: {
          ...INITIAL_INTAKE_STATE.answers,
          q1TaskIds: ['BUILD_SYSTEMS'],
          q2SubjectId: 'STEM_TECH',
          q2Rationale: 'a'.repeat(151),
        },
      };
      const nextState = intakeReducer(longRationaleState, { type: 'NEXT_STEP' });
      assert.equal(nextState.currentStep, 2);
      assert.equal(nextState.validationErrors.q2Rationale, INTAKE_COPY.validation.step2RationaleMaxLength);
    });
  });

  // UT-RED-09 & UT-RED-10: PREVIOUS_STEP
  describe('PREVIOUS_STEP Action', () => {
    it('decrements currentStep from Step 2 to Step 1 and preserves answers', () => {
      const step2State: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 2,
        answers: {
          ...INITIAL_INTAKE_STATE.answers,
          q1TaskIds: ['BUILD_SYSTEMS'],
          q2SubjectId: 'HEALTH_BIO',
        },
      };
      const prevState = intakeReducer(step2State, { type: 'PREVIOUS_STEP' });
      assert.equal(prevState.currentStep, 1);
      assert.deepEqual(prevState.answers.q1TaskIds, ['BUILD_SYSTEMS']);
      assert.equal(prevState.answers.q2SubjectId, 'HEALTH_BIO');
    });

    it('is a safe no-op on Step 1', () => {
      const state = intakeReducer(INITIAL_INTAKE_STATE, { type: 'PREVIOUS_STEP' });
      assert.equal(state.currentStep, 1);
    });

    it('exits completion review screen back to Step 4', () => {
      const completedState: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 4,
        isCompleted: true,
      };
      const prevState = intakeReducer(completedState, { type: 'PREVIOUS_STEP' });
      assert.equal(prevState.isCompleted, false);
      assert.equal(prevState.currentStep, 4);
    });
  });

  // UT-RED-11: RESET_STATE
  describe('RESET_STATE Action', () => {
    it('restores initial defaults, clearing answers, errors, and nickname', () => {
      const dirtyState: IntakeState = {
        currentStep: 3,
        studentNickname: 'Alex',
        answers: {
          q1TaskIds: ['BUILD_SYSTEMS'],
          q2SubjectId: 'STEM_TECH',
          q2Rationale: 'Note',
          q3Environment: 'REMOTE_DESK',
          q4Ambition: 'WORKFORCE_DIRECT',
        },
        validationErrors: { general: 'err' },
        isResetDialogOpen: true,
        isCompleted: false,
        isHydrated: true,
      };

      const reset = intakeReducer(dirtyState, { type: 'RESET_STATE' });
      assert.equal(reset.currentStep, 1);
      assert.equal(reset.studentNickname, '');
      assert.deepEqual(reset.answers.q1TaskIds, []);
      assert.equal(reset.answers.q2SubjectId, null);
      assert.equal(reset.answers.q2Rationale, '');
      assert.equal(reset.answers.q3Environment, null);
      assert.equal(reset.answers.q4Ambition, null);
      assert.equal(reset.isResetDialogOpen, false);
      assert.equal(reset.isHydrated, true);
    });
  });

  // UT-RED-12: SET_NICKNAME
  describe('SET_NICKNAME Action', () => {
    it('trims leading/trailing whitespace and limits length to 50 characters', () => {
      const raw = '   Alex Chen   ';
      const state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'SET_NICKNAME',
        payload: raw,
      });
      assert.equal(state.studentNickname, 'Alex Chen');

      const overlyLong = 'x'.repeat(80);
      const cappedState = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'SET_NICKNAME',
        payload: overlyLong,
      });
      assert.equal(cappedState.studentNickname.length, 50);
    });
  });

  // UT-RED-13: GO_TO_STEP
  describe('GO_TO_STEP Action', () => {
    it('allows jumping to Step 2 when Step 1 is valid', () => {
      const validStep1State: IntakeState = {
        ...INITIAL_INTAKE_STATE,
        currentStep: 1,
        answers: {
          ...INITIAL_INTAKE_STATE.answers,
          q1TaskIds: ['BUILD_SYSTEMS'],
        },
      };
      const state = intakeReducer(validStep1State, {
        type: 'GO_TO_STEP',
        payload: 2,
      });
      assert.equal(state.currentStep, 2);
    });

    it('blocks jumping to Step 3 when Step 1 is incomplete', () => {
      const state = intakeReducer(INITIAL_INTAKE_STATE, {
        type: 'GO_TO_STEP',
        payload: 3,
      });
      assert.equal(state.currentStep, 1);
      assert.equal(state.validationErrors.general, INTAKE_COPY.validation.navigationBlocked);
    });
  });
});
