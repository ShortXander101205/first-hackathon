'use client';

import { useEffect, useCallback } from 'react';
import type { IntakeState, IntakeAction, IntakeStoredState } from '@/types/intake';
import { intakeStoredStateSchema } from '@/schemas/intake.schema';
import { getSafeSessionStorage } from '@/lib/storage/safeStorage';

export const INTAKE_STORAGE_KEY = 'pathless_intake_v2';
export const INTAKE_STORAGE_VERSION = 2;

// Legacy keys to purge on startup to prevent cross-version data corruption
const LEGACY_STORAGE_KEYS = ['pathway_intake_state_v1', 'pathway_ai_wizard_state'];

/**
 * useWizardSession: Manages SSR-safe hydration and transient sessionStorage synchronization.
 * Protects against Next.js 14 hydration mismatches and guarantees zero data leakage across browser sessions.
 */
export function useWizardSession(
  state: IntakeState,
  dispatch: React.Dispatch<IntakeAction>
) {
  // 1. Initial Mount: Clean legacy keys & read from transient session storage safely (SSR-safe)
  useEffect(() => {
    const storage = getSafeSessionStorage();

    // Purge legacy storage keys
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      try {
        storage.removeItem(legacyKey);
      } catch {
        // ignore
      }
    }

    try {
      const raw = storage.getItem(INTAKE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const validated = intakeStoredStateSchema.safeParse(parsed);
        if (validated.success) {
          dispatch({
            type: 'HYDRATE_STATE',
            payload: {
              currentStep: validated.data.currentStep as any,
              profile: validated.data.profile,
              studentNickname: validated.data.studentNickname,
              answers: validated.data.answers as any,
            },
          });
        } else {
          // If storage contains outdated or tampered schema, purge cleanly
          storage.removeItem(INTAKE_STORAGE_KEY);
        }
      }
    } catch {
      // JSON parse error or security exception
      storage.removeItem(INTAKE_STORAGE_KEY);
    } finally {
      // Mark as hydrated so future state changes can synchronize to storage
      dispatch({ type: 'SET_HYDRATED' });
    }
  }, [dispatch]);

  // 2. Synchronize state changes to sessionStorage (only after initial hydration to avoid overwriting)
  useEffect(() => {
    if (!state.isHydrated) return;

    const storage = getSafeSessionStorage();
    const payload: IntakeStoredState = {
      version: INTAKE_STORAGE_VERSION,
      currentStep: state.currentStep,
      profile: state.profile,
      studentNickname: state.studentNickname,
      answers: state.answers,
      timestamp: Date.now(),
    };

    try {
      storage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Quietly ignore storage quota exhaustion; state remains active in memory
    }
  }, [state.answers, state.currentStep, state.profile, state.studentNickname, state.isHydrated]);

  // 3. Purge session helper for Reset action
  const purgeSession = useCallback(() => {
    const storage = getSafeSessionStorage();
    try {
      storage.removeItem(INTAKE_STORAGE_KEY);
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        storage.removeItem(legacyKey);
      }
    } catch {
      // Quietly catch errors
    }
  }, []);

  return { purgeSession };
}
