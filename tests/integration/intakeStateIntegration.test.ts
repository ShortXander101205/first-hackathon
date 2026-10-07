import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  intakeReducer,
  INITIAL_INTAKE_STATE,
  canAccessStep,
  validateStep,
} from '@/context/IntakeContext';
import { intakeStoredStateSchema } from '@/schemas/intake.schema';
import type { IntakeState, IntakeStoredState, WizardStep } from '@/types/intake';
import { INTAKE_STORAGE_VERSION } from '@/hooks/useWizardSession';

describe('Feature 4 End-to-End State Machine Integration Tests', () => {
  // IT-WIZ-01: Full 4-Step Alex Persona Walkthrough
  it('executes full 4-step Alex persona walkthrough, validation blocks, completion, and reset', () => {
    let state: IntakeState = { ...INITIAL_INTAKE_STATE, currentStep: 1 };

    // 1. Alex inputs nickname
    state = intakeReducer(state, { type: 'SET_NICKNAME', payload: 'Alex Chen' });
    assert.equal(state.studentNickname, 'Alex Chen');

    // 2. Step 1: Alex selects BUILD_SYSTEMS and ANALYZE_PATTERNS
    state = intakeReducer(state, { type: 'TOGGLE_TASK', payload: 'BUILD_SYSTEMS' });
    state = intakeReducer(state, { type: 'TOGGLE_TASK', payload: 'ANALYZE_PATTERNS' });
    assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS']);

    // Attempting 3rd chip is prevented by reducer
    state = intakeReducer(state, { type: 'TOGGLE_TASK', payload: 'HELP_HUMANS' });
    assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS']);

    // Verify Step 1 is valid and can advance
    assert.equal(validateStep(1, state.answers), true);
    state = intakeReducer(state, { type: 'NEXT_STEP' });
    assert.equal(state.currentStep, 2);

    // 3. Step 2: Alex enters rationale first without selecting a subject
    state = intakeReducer(state, {
      type: 'SET_RATIONALE',
      payload: 'I love laboratory experiments, but advanced theoretical calculus stresses me out.',
    });
    assert.equal(state.answers.q2SubjectId, null);

    // Attempting to advance without subject fails validation
    state = intakeReducer(state, { type: 'NEXT_STEP' });
    assert.equal(state.currentStep, 2);
    assert.ok(state.validationErrors.q2Subject);

    // Alex selects subject HEALTH_BIO
    state = intakeReducer(state, { type: 'SET_SUBJECT', payload: 'HEALTH_BIO' });
    assert.equal(state.validationErrors.q2Subject, undefined);
    assert.equal(validateStep(2, state.answers), true);

    // Advance to Step 3
    state = intakeReducer(state, { type: 'NEXT_STEP' });
    assert.equal(state.currentStep, 3);

    // 4. Step 3: Alex chooses REMOTE_DESK
    state = intakeReducer(state, { type: 'SET_ENVIRONMENT', payload: 'REMOTE_DESK' });
    assert.equal(validateStep(3, state.answers), true);

    // Advance to Step 4
    state = intakeReducer(state, { type: 'NEXT_STEP' });
    assert.equal(state.currentStep, 4);

    // 5. Step 4: Alex chooses WORKFORCE_DIRECT
    state = intakeReducer(state, { type: 'SET_AMBITION', payload: 'WORKFORCE_DIRECT' });
    assert.equal(validateStep(4, state.answers), true);

    // Complete the wizard
    state = intakeReducer(state, { type: 'NEXT_STEP' });
    assert.equal(state.isCompleted, true);

    // Verify final state matches Alex persona contract
    assert.equal(state.studentNickname, 'Alex Chen');
    assert.deepEqual(state.answers.q1TaskIds, ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS']);
    assert.equal(state.answers.q2SubjectId, 'HEALTH_BIO');
    assert.equal(
      state.answers.q2Rationale,
      'I love laboratory experiments, but advanced theoretical calculus stresses me out.'
    );
    assert.equal(state.answers.q3Environment, 'REMOTE_DESK');
    assert.equal(state.answers.q4Ambition, 'WORKFORCE_DIRECT');

    // 6. Reset Action: Teacher / Student resets data
    state = intakeReducer(state, { type: 'OPEN_RESET_DIALOG' });
    assert.equal(state.isResetDialogOpen, true);

    state = intakeReducer(state, { type: 'RESET_STATE' });
    assert.equal(state.currentStep, 1);
    assert.equal(state.studentNickname, '');
    assert.deepEqual(state.answers.q1TaskIds, []);
    assert.equal(state.answers.q2SubjectId, null);
    assert.equal(state.answers.q2Rationale, '');
    assert.equal(state.answers.q3Environment, null);
    assert.equal(state.answers.q4Ambition, null);
    assert.equal(state.isCompleted, false);
    assert.equal(state.isResetDialogOpen, false);
  });

  // IT-SES-01..03: Storage Schema Serialization & Hydration Validation
  it('validates storage payload schema and handles corrupted storage data safely', () => {
    const validStoredPayload: IntakeStoredState = {
      version: INTAKE_STORAGE_VERSION,
      currentStep: 2,
      studentNickname: 'Alex',
      answers: {
        q1TaskIds: ['BUILD_SYSTEMS'],
        q2SubjectId: 'HEALTH_BIO',
        q2Rationale: 'Excited about health informatics.',
        q3Environment: null,
        q4Ambition: null,
      },
      timestamp: Date.now(),
    };

    // Valid stored payload parses cleanly
    const parseResult = intakeStoredStateSchema.safeParse(validStoredPayload);
    assert.equal(parseResult.success, true);

    // Corrupted payload with invalid step number is rejected
    const corruptedStepPayload = {
      ...validStoredPayload,
      currentStep: 99, // Invalid step number!
    };
    const badStepResult = intakeStoredStateSchema.safeParse(corruptedStepPayload);
    assert.equal(badStepResult.success, false);

    // Corrupted payload with > 2 task IDs is rejected
    const corruptedTasksPayload = {
      ...validStoredPayload,
      answers: {
        ...validStoredPayload.answers,
        q1TaskIds: ['1', '2', '3'], // Exceeds 2!
      },
    };
    const badTasksResult = intakeStoredStateSchema.safeParse(corruptedTasksPayload);
    assert.equal(badTasksResult.success, false);
  });

  // IT-GRD-05: Retroactive Invalidation Guard Flow
  it('prevents forward skipping when an earlier step is retroactively cleared', () => {
    let state: IntakeState = { ...INITIAL_INTAKE_STATE, currentStep: 1 as WizardStep };

    // Complete Step 1
    state = intakeReducer(state, { type: 'TOGGLE_TASK', payload: 'BUILD_SYSTEMS' });
    state = intakeReducer(state, { type: 'NEXT_STEP' });
    assert.equal(state.currentStep, 2);

    // Complete Step 2
    state = intakeReducer(state, { type: 'SET_SUBJECT', payload: 'STEM_TECH' });
    state = intakeReducer(state, { type: 'SET_RATIONALE', payload: 'Valid note.' });
    state = intakeReducer(state, { type: 'NEXT_STEP' });
    assert.equal(state.currentStep, 3);

    // User navigates back to Step 1
    state = intakeReducer(state, { type: 'PREVIOUS_STEP' }); // to Step 2
    state = intakeReducer(state, { type: 'PREVIOUS_STEP' }); // to Step 1
    assert.equal(state.currentStep, 1);

    // Deselect all task chips on Step 1
    state = intakeReducer(state, { type: 'TOGGLE_TASK', payload: 'BUILD_SYSTEMS' });
    assert.deepEqual(state.answers.q1TaskIds, []);

    // Now verify that jumping back to Step 2 or 3 is blocked by navigation guards
    assert.equal(canAccessStep(3 as WizardStep, state.currentStep, state.answers), false);
    assert.equal(canAccessStep(2 as WizardStep, state.currentStep, state.answers), false);

    // Attempting GO_TO_STEP(3) is rejected by reducer
    state = intakeReducer(state, { type: 'GO_TO_STEP', payload: 3 as WizardStep });
    assert.equal(state.currentStep, 1);
  });
});
