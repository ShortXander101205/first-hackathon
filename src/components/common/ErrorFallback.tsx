'use client';

import React from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { GUIDE_COPY } from '@/content/guideCopy';

export interface ErrorFallbackProps {
  title?: string;
  message?: string;
  resetLabel?: string;
  onReset?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = GUIDE_COPY.clientErrors.defaultTitle,
  message = GUIDE_COPY.clientErrors.defaultMessage,
  resetLabel = GUIDE_COPY.clientErrors.retryButton,
  onReset,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-5"
    >
      <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
        <RefreshCw className="w-6 h-6 animate-pulse" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
          {message}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto min-h-[44px] min-w-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>{resetLabel}</span>
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="w-full sm:w-auto min-h-[44px] min-w-[44px] px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{secondaryActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
