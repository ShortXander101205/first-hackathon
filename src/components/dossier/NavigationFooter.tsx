import React from 'react';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';

export interface NavigationFooterProps {
  onStartOver: () => void;
}

export function NavigationFooter({ onStartOver }: NavigationFooterProps) {
  const copy = DOSSIER_COPY.footer;

  return (
    <footer
      role="contentinfo"
      className="border-t border-edu-slate-200 pt-8 mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
    >
      {/* Empathetic Reminder Note */}
      <p className="text-xs sm:text-sm text-edu-slate-600 max-w-md leading-relaxed min-w-0 break-words">
        {copy.reassurance}
      </p>

      {/* Start Over Action Button */}
      <button
        type="button"
        onClick={onStartOver}
        aria-label={copy.startOverAriaLabel}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-edu-slate-300 hover:bg-edu-slate-100 text-edu-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-colors min-h-[44px] min-w-[130px] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-edu-interactive focus-visible:ring-offset-2"
      >
        <Icons.reset className="w-4 h-4 text-edu-slate-500" aria-hidden="true" />
        <span>{copy.startOverButton}</span>
      </button>
    </footer>
  );
}
