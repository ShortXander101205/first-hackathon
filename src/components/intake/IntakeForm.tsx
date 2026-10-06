'use client';

import React from 'react';
import { IntakeWizardContainer } from './IntakeWizardContainer';

/**
 * IntakeForm: High-level entrypoint for the student intake discovery wizard.
 * Encapsulates step navigation, validation, and synthesis handoff.
 */
export function IntakeForm() {
  return <IntakeWizardContainer />;
}

export default IntakeForm;
