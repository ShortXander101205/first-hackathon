'use client';

import React, { useEffect } from 'react';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { GUIDE_COPY } from '@/content/guideCopy';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[PathLess Global Error]:', error.message);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <ErrorFallback
          title={GUIDE_COPY.clientErrors.globalErrorTitle}
          message={GUIDE_COPY.clientErrors.globalErrorMessage}
          resetLabel={GUIDE_COPY.clientErrors.reloadAppButton}
          onReset={() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            } else {
              reset();
            }
          }}
        />
      </body>
    </html>
  );
}
