'use client';

import React, { useEffect } from 'react';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { ADVISOR_COPY } from '@/content/advisorCopy';

export default function AdvisorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[PathLess Advisor Portal Error]:', error.message);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <ErrorFallback
        title={ADVISOR_COPY.errors.portalErrorTitle}
        message={ADVISOR_COPY.errors.portalErrorMessage}
        resetLabel={ADVISOR_COPY.errors.retryButton}
        onReset={() => reset()}
      />
    </main>
  );
}
