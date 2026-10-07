'use client';

import React, { useState, useEffect } from 'react';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';

export interface SynthesisLoadingViewProps {
  studentNickname?: string;
}

export function SynthesisLoadingView({ studentNickname }: SynthesisLoadingViewProps) {
  const copy = DOSSIER_COPY.loading;
  const messages = copy.messages;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!messages || messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [messages]);

  const activeMessage = messages[currentMessageIndex] || copy.title;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="max-w-xl mx-auto py-12 sm:py-16 px-6 text-center space-y-6 sm:space-y-8 animate-fadeIn"
    >
      {/* Animated Scholastic Icon & Pulsing Halo */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-edu-blue-100/70 border border-edu-blue-200 motion-safe:animate-ping opacity-60"
          aria-hidden="true"
        />
        <div
          className="relative w-16 h-16 rounded-full bg-edu-blue-50 border-2 border-edu-interactive flex items-center justify-center text-edu-interactive shadow-md"
          aria-hidden="true"
        >
          <Icons.logo className="w-8 h-8 motion-safe:animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Title & Nickname Greeting */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-edu-slate-900 tracking-tight">
          {studentNickname?.trim()
            ? copy.personalizedTitle(studentNickname)
            : copy.title}
        </h2>
        <p className="text-xs sm:text-sm text-edu-slate-600 max-w-md mx-auto leading-relaxed">
          {copy.calmNote}
        </p>
      </div>

      {/* Progressive Reassurance Message Cycler */}
      <div className="p-4 rounded-xl bg-edu-slate-50 border border-edu-slate-200/80 shadow-2xs max-w-md mx-auto min-h-[64px] flex items-center justify-center">
        <p className="text-xs sm:text-sm font-semibold text-edu-interactive animate-fadeIn key={currentMessageIndex}">
          {activeMessage}
        </p>
      </div>

      {/* Assistive Screen Reader Notice */}
      <span className="sr-only">
        {DOSSIER_COPY.a11y.loadingAnnounce}
      </span>
    </div>
  );
}
