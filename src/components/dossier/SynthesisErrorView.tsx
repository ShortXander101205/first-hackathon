import React from 'react';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';

export interface SynthesisErrorViewProps {
  onRetry: () => void;
  onEditAnswers: () => void;
  errorMessage?: string;
}

export function SynthesisErrorView({
  onRetry,
  onEditAnswers,
  errorMessage,
}: SynthesisErrorViewProps) {
  const copy = DOSSIER_COPY.error;

  return (
    <div
      role="alert"
      className="max-w-xl mx-auto py-10 sm:py-14 px-6 text-center space-y-6 animate-fadeIn"
    >
      {/* Alert Icon */}
      <div className="w-14 h-14 rounded-full bg-friction-50 border border-friction-200 text-friction-700 flex items-center justify-center mx-auto shadow-sm">
        <Icons.frictionAlert className="w-7 h-7 stroke-[2.2]" aria-hidden="true" />
      </div>

      {/* Title & Message */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-friction-50 text-friction-700 text-xs font-semibold border border-friction-200">
          <span>{copy.badge}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-edu-slate-900 tracking-tight">
          {copy.title}
        </h2>
        <p className="text-xs sm:text-sm text-edu-slate-600 max-w-md mx-auto leading-relaxed">
          {errorMessage || copy.message}
        </p>
      </div>

      {/* Action Controls */}
      <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onEditAnswers}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border border-edu-slate-300 text-edu-slate-700 bg-white hover:bg-edu-slate-100 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
        >
          {copy.editAnswersButton}
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-edu-interactive hover:bg-edu-blue-700 text-white transition-colors min-h-[44px] shadow-sm focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
        >
          <Icons.reset className="w-4 h-4 mr-2" aria-hidden="true" />
          <span>{copy.retryButton}</span>
        </button>
      </div>
    </div>
  );
}
