import React from 'react';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';

export interface MockNoticeBannerProps {
  engine?: string;
}

export function MockNoticeBanner({ engine }: MockNoticeBannerProps) {
  const copy = DOSSIER_COPY.mockNotice;

  return (
    <aside
      aria-label={copy.title}
      className="bg-edu-blue-50 border border-edu-blue-200 text-edu-blue-900 rounded-xl p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-4 shadow-2xs mb-6 sm:mb-8 min-w-0"
    >
      <div
        className="w-9 h-9 rounded-full bg-edu-blue-100 border border-edu-blue-300 flex items-center justify-center shrink-0 text-edu-interactive"
        aria-hidden="true"
      >
        <Icons.verifiedCourse className="w-5 h-5 stroke-[2.2]" />
      </div>

      <div className="space-y-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-edu-blue-950">
            {copy.title}
          </span>
          <span className="text-[10px] font-semibold bg-edu-blue-200/70 text-edu-blue-900 px-2 py-0.5 rounded-full shrink-0">
            {copy.badge}
          </span>
          {engine && (
            <span className="text-[10px] text-edu-blue-700 italic">
              ({engine})
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-edu-blue-800 leading-relaxed min-w-0 break-words">
          {copy.description}
        </p>
      </div>
    </aside>
  );
}
