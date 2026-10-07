'use client';

import React, { useEffect } from 'react';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { GUIDE_COPY } from '@/content/guideCopy';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[PathLess App Error]:', error.message);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <ErrorFallback
        title={GUIDE_COPY.clientErrors.routeErrorTitle}
        message={GUIDE_COPY.clientErrors.routeErrorMessage}
        resetLabel={GUIDE_COPY.clientErrors.retryButton}
        onReset={() => reset()}
      />
    </main>
  );
}
