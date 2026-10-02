'use client';

import React, { useEffect, useRef } from 'react';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';

export interface ResetConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: ResetConfirmationModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const copy = INTAKE_COPY.resetDialog;

  // Accessible focus trap and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement | null;

    // Default focus lands safely on the Cancel button
    const timer = setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = [cancelBtnRef.current, confirmBtnRef.current].filter(
          Boolean
        ) as HTMLButtonElement[];
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-edu-slate-900/40 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={copy.ariaLabel}
        aria-labelledby="reset-modal-title"
        aria-describedby="reset-modal-desc"
        className="w-full max-w-md bg-white rounded-2xl border border-edu-slate-200 shadow-xl p-6 sm:p-7 space-y-5 animate-scaleUp"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-full bg-friction-50 border border-friction-200 flex items-center justify-center shrink-0 text-friction-700"
            aria-hidden="true"
          >
            <Icons.frictionAlert className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="space-y-1.5">
            <h2
              id="reset-modal-title"
              className="text-lg font-bold text-edu-slate-900 leading-snug"
            >
              {copy.title}
            </h2>
            <p
              id="reset-modal-desc"
              className="text-xs sm:text-sm text-edu-slate-600 leading-relaxed"
            >
              {copy.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border border-edu-slate-300 text-edu-slate-700 bg-white hover:bg-edu-slate-100 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
          >
            {copy.cancel}
          </button>

          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-edu-interactive hover:bg-edu-blue-700 text-white transition-colors min-h-[44px] shadow-sm focus:outline-none focus:ring-2 focus:ring-edu-interactive focus:ring-offset-2"
          >
            {copy.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
