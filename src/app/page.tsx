'use client';

import React from 'react';
import { Container } from '@/components/layout/Container';
import { IntakeProvider } from '@/context/IntakeContext';
import { IntakeWizardContainer } from '@/components/intake';

export default function HomePage() {
  return (
    <IntakeProvider>
      <div className="py-5 sm:py-10 lg:py-14 min-w-0">
        <Container>
          <IntakeWizardContainer />
        </Container>
      </div>
    </IntakeProvider>
  );
}
