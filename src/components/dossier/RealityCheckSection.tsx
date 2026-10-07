import React from 'react';
import type { DayInTheLife } from '@/types/career';
import { DOSSIER_COPY } from '@/constants/dossierCopy';
import { Icons } from '@/components/ui/icons';

export interface RealityCheckSectionProps {
  dayInTheLife?: DayInTheLife;
  dailyTasks?: string[];
}

export function RealityCheckSection({ dayInTheLife, dailyTasks }: RealityCheckSectionProps) {
  const copy = DOSSIER_COPY.realityCheck;
  const tasks = dayInTheLife?.tasks ?? dailyTasks ?? [];
  const misconceptions = dayInTheLife?.misconceptions ?? [];

  if (tasks.length === 0 && misconceptions.length === 0) {
    return null;
  }

  return (
    <div className="bg-edu-slate-50 border border-edu-slate-200 rounded-xl p-4 space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Icons.briefcase className="w-4 h-4 text-edu-slate-600 shrink-0" aria-hidden="true" />
        <h3 className="text-xs sm:text-sm font-bold text-edu-slate-800 tracking-tight">
          {copy.title}
        </h3>
      </div>

      {/* Daily Tasks List */}
      {tasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] sm:text-xs font-medium text-edu-slate-600">
            {copy.tasksSubtitle}
          </p>
          <ul role="list" className="space-y-1.5" aria-label={copy.tasksSubtitle}>
            {tasks.map((task, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-edu-slate-700 leading-relaxed min-w-0 break-words"
              >
                <Icons.check
                  className="w-3.5 h-3.5 text-growth-700 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="min-w-0 break-words">{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Misconception Buster Card */}
      {misconceptions.length > 0 && (
        <div className="bg-white border border-amber-200/80 rounded-lg p-3 text-xs space-y-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-[11px] sm:text-xs">
            <Icons.frictionAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
            <span>{copy.mythTitle}</span>
          </div>

          <div className="space-y-2">
            {misconceptions.map((item, index) => {
              const mythIndex = item.indexOf(copy.mythPrefix);
              const realityIndex = item.indexOf(copy.realityPrefix);

              if (mythIndex !== -1 && realityIndex !== -1 && realityIndex > mythIndex) {
                const mythText = item
                  .slice(mythIndex + copy.mythPrefix.length, realityIndex)
                  .trim();
                const realityText = item.slice(realityIndex + copy.realityPrefix.length).trim();

                return (
                  <div key={index} className="space-y-1 min-w-0 break-words leading-relaxed text-edu-slate-700">
                    <p className="text-[11px] text-edu-slate-600">
                      <span className="font-bold text-amber-800">{copy.mythPrefix} </span>
                      <span className="italic">{mythText}</span>
                    </p>
                    <p className="text-[11px] text-edu-slate-800">
                      <span className="font-bold text-growth-700">{copy.realityPrefix} </span>
                      <span>{realityText}</span>
                    </p>
                  </div>
                );
              }

              return (
                <p key={index} className="min-w-0 break-words text-[11px] text-edu-slate-700 leading-relaxed">
                  {item}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
