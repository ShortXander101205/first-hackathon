'use client';

import React from 'react';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function NicknameInput({ value, onChange, className }: NicknameInputProps) {
  const copy = INTAKE_COPY.nicknamePrompt;

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor="student-nickname-input"
          className="text-xs font-semibold text-edu-slate-700 flex items-center gap-1.5"
        >
          <Icons.users className="w-3.5 h-3.5 text-edu-slate-400" aria-hidden="true" />
          <span>{copy.label}</span>
        </label>
        <span className="text-[11px] text-edu-slate-400">
          {value.length}/50
        </span>
      </div>

      <input
        id="student-nickname-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 50))}
        placeholder={copy.placeholder}
        maxLength={50}
        autoComplete="off"
        spellCheck="false"
        data-lpignore="true"
        className={cn(
          'w-full px-3.5 py-2 rounded-lg border text-xs sm:text-sm leading-normal transition-all',
          'bg-edu-slate-50/60 hover:bg-white focus:bg-white text-edu-slate-900 border-edu-slate-200 placeholder:text-edu-slate-400',
          'focus:outline-none focus:border-edu-interactive focus:ring-2 focus:ring-edu-interactive/20'
        )}
      />

      <p className="text-[11px] text-edu-slate-500 leading-tight">
        {copy.helperText}
      </p>
    </div>
  );
}
