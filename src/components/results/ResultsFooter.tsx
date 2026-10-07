'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RESULTS_COPY } from '@/content/guideCopy';

export interface ResultsFooterProps {
  onClear: () => void;
  onPrint?: () => void;
}

/**
 * ResultsFooter: Bottom actions for PathLess Guide v2.
 * Offers native print / PDF export and calm self-clearing with confirmation dialog.
 * Hidden in native print view with no-print utility.
 */
export function ResultsFooter({ onClear, onPrint }: ResultsFooterProps) {
  const copy = RESULTS_COPY.actions;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleConfirmClear = () => {
    setIsDialogOpen(false);
    onClear();
  };

  // Focus management when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      cancelBtnRef.current?.focus();
    }
  }, [isDialogOpen]);

  // Escape key listener for modal accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDialogOpen) {
        setIsDialogOpen(false);
      }
    };
    if (isDialogOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDialogOpen]);

  return (
    <footer className="mt-12 pt-6 border-t border-slate-200 no-print">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Print / Save as PDF Action */}
        <button
          type="button"
          onClick={handlePrint}
          aria-label={copy.printButtonAriaLabel}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:scale-[0.99] transition-all min-h-[44px] min-w-[44px]"
        >
          <svg
            className="w-4 h-4 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span>{copy.printButton}</span>
        </button>

        {/* Start Over Action Trigger */}
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          aria-label={copy.clearButtonAriaLabel}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:scale-[0.99] transition-all min-h-[44px] min-w-[44px]"
        >
          <svg
            className="w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{copy.clearButton}</span>
        </button>
      </div>

      {/* Calm Confirmation Dialog */}
      {isDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-dialog-title"
          aria-describedby="clear-dialog-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <h3
                id="clear-dialog-title"
                className="text-lg font-bold text-slate-900"
              >
                {copy.clearDialogTitle}
              </h3>
              <p
                id="clear-dialog-desc"
                className="text-sm text-slate-600 leading-relaxed"
              >
                {copy.clearDialogDescription}
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                ref={cancelBtnRef}
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500 min-h-[44px]"
              >
                {copy.cancelClear}
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 min-h-[44px]"
              >
                {copy.confirmClear}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
