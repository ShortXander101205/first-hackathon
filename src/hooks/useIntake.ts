'use client';

import { useContext } from 'react';
import { IntakeContext } from '@/context/IntakeContext';
import type { IntakeContextValue } from '@/types/intake';

/**
 * useIntake: Custom hook to access Intake state, selectors, and semantic dispatchers.
 */
export function useIntake(): IntakeContextValue {
  const context = useContext(IntakeContext);
  if (!context) {
    throw new Error('useIntake must be used within an IntakeProvider');
  }
  return context;
}

export const useWizard = useIntake;
