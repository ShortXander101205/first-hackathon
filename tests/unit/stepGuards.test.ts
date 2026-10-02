import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canAccessStep, INITIAL_INTAKE_ANSWERS } from '@/context/IntakeContext';
import type { IntakeAnswersState } from '@/types/intake';

describe('Step Navigation Guards Tests (canAccessStep)', () => {
  const completeStep1: IntakeAnswersState = {
    ...INITIAL_INTAKE_ANSWERS,
    q1TaskIds: ['BUILD_SYSTEMS'],
  };

  const completeStep1And2: IntakeAnswersState = {
    ...completeStep1,
    q2SubjectId: 'HEALTH_BIO',
    q2Rationale: 'I am excited about biology labs.',
  };

  const completeStep1Through3: IntakeAnswersState = {
    ...completeStep1And2,
    q3Environment: 'REMOTE_DESK',
  };

  // UT-GRD-01: Step 1 is always accessible
  it('allows access to Step 1 unconditionally from any step', () => {
    assert.equal(canAccessStep(1, 1, INITIAL_INTAKE_ANSWERS), true);
    assert.equal(canAccessStep(1, 2, completeStep1), true);
    assert.equal(canAccessStep(1, 3, completeStep1And2), true);
    assert.equal(canAccessStep(1, 4, completeStep1Through3), true);
  });

  // UT-GRD-02: Step 2 access requires Step 1 to be valid
  it('blocks forward access to Step 2 when Step 1 is incomplete', () => {
    assert.equal(canAccessStep(2, 1, INITIAL_INTAKE_ANSWERS), false);
  });

  it('permits forward access to Step 2 when Step 1 has 1-2 chips', () => {
    assert.equal(canAccessStep(2, 1, completeStep1), true);
  });

  // UT-GRD-03: Blocking skipping ahead to Step 3 or 4
  it('blocks forward access to Step 3 when Step 2 is incomplete', () => {
    assert.equal(canAccessStep(3, 1, completeStep1), false);
    assert.equal(canAccessStep(3, 2, completeStep1), false);
  });

  it('permits forward access to Step 3 when both Step 1 and Step 2 are valid', () => {
    assert.equal(canAccessStep(3, 2, completeStep1And2), true);
  });

  it('blocks forward access to Step 4 when Step 3 is incomplete', () => {
    assert.equal(canAccessStep(4, 1, completeStep1And2), false);
    assert.equal(canAccessStep(4, 3, completeStep1And2), false);
  });

  it('permits forward access to Step 4 when Steps 1, 2, and 3 are all valid', () => {
    assert.equal(canAccessStep(4, 3, completeStep1Through3), true);
  });

  // UT-GRD-04: Unconstrained Regressive Navigation
  it('always permits regressive navigation (targetStep <= currentStep)', () => {
    assert.equal(canAccessStep(2, 3, completeStep1And2), true);
    assert.equal(canAccessStep(1, 4, completeStep1Through3), true);
    assert.equal(canAccessStep(3, 4, completeStep1Through3), true);
  });

  // UT-GRD-05: Retroactive Invalidation Guard
  it('blocks jumping back to Step 3 if user navigated back to Step 1 and cleared tasks', () => {
    // Student reached Step 3 with valid answers, then went back to Step 1 and removed chips
    const retroactivelyInvalidated: IntakeAnswersState = {
      ...completeStep1And2,
      q1TaskIds: [], // Cleared tasks on Step 1!
    };

    assert.equal(canAccessStep(3, 1, retroactivelyInvalidated), false);
    assert.equal(canAccessStep(2, 1, retroactivelyInvalidated), false);
    assert.equal(canAccessStep(1, 1, retroactivelyInvalidated), true);
  });
});
