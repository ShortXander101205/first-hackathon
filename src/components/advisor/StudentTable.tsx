'use client';

import React from 'react';
import { StudentDirectoryItem } from '@/app/api/advisor/students/route';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { Search, Filter, Calendar, ChevronRight, FileText, User } from 'lucide-react';

interface StudentTableProps {
  students: StudentDirectoryItem[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedGrade,
  onGradeChange,
  selectedDateRange,
  onDateRangeChange,
  onSelectStudent,
}) => {
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const formatGrade = (grade: string) => {
    const map: Record<string, string> = {
      grade_10: ADVISOR_COPY.directory.gradeOptions.grade_10,
      grade_11: ADVISOR_COPY.directory.gradeOptions.grade_11,
      grade_12: ADVISOR_COPY.directory.gradeOptions.grade_12,
      college_freshman: ADVISOR_COPY.directory.gradeOptions.college_freshman,
      college_sophomore: ADVISOR_COPY.directory.gradeOptions.college_sophomore,
    };
    return map[grade] || grade;
  };

  return (
    <div className="space-y-4">
      {/* Controls: Search, Grade Filter, Date Range Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div>
          <label
            htmlFor="student-search-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
          >
            {ADVISOR_COPY.directory.searchLabel}
          </label>
          <div className="relative">
            <input
              id="student-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={ADVISOR_COPY.directory.searchPlaceholder}
              className="w-full min-h-[44px] pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          </div>
        </div>

        {/* Grade Filter */}
        <div>
          <label
            htmlFor="grade-filter-select"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
          >
            {ADVISOR_COPY.directory.gradeFilterLabel}
          </label>
          <div className="relative">
            <select
              id="grade-filter-select"
              value={selectedGrade}
              onChange={(e) => onGradeChange(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">{ADVISOR_COPY.directory.allGradesOption}</option>
              <option value="grade_10">{ADVISOR_COPY.directory.gradeOptions.grade_10}</option>
              <option value="grade_11">{ADVISOR_COPY.directory.gradeOptions.grade_11}</option>
              <option value="grade_12">{ADVISOR_COPY.directory.gradeOptions.grade_12}</option>
              <option value="college_freshman">{ADVISOR_COPY.directory.gradeOptions.college_freshman}</option>
              <option value="college_sophomore">{ADVISOR_COPY.directory.gradeOptions.college_sophomore}</option>
            </select>
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label
            htmlFor="date-filter-select"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
          >
            {ADVISOR_COPY.directory.dateFilterLabel}
          </label>
          <div className="relative">
            <select
              id="date-filter-select"
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">{ADVISOR_COPY.directory.dateOptions.all}</option>
              <option value="7d">{ADVISOR_COPY.directory.dateOptions.past7Days}</option>
              <option value="30d">{ADVISOR_COPY.directory.dateOptions.past30Days}</option>
              <option value="current_year">{ADVISOR_COPY.directory.dateOptions.currentYear}</option>
            </select>
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Directory Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {ADVISOR_COPY.directory.recordsCount(students.length)}
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <caption className="sr-only">{ADVISOR_COPY.directory.tableCaption}</caption>
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th scope="col" className="py-3 px-4">
                {ADVISOR_COPY.directory.tableHeaders.student}
              </th>
              <th scope="col" className="py-3 px-4">
                {ADVISOR_COPY.directory.tableHeaders.grade}
              </th>
              <th scope="col" className="py-3 px-4 hidden md:table-cell">
                {ADVISOR_COPY.directory.tableHeaders.topDirection}
              </th>
              <th scope="col" className="py-3 px-4 hidden sm:table-cell">
                {ADVISOR_COPY.directory.tableHeaders.submittedDate}
              </th>
              <th scope="col" className="py-3 px-4 text-center hidden sm:table-cell">
                {ADVISOR_COPY.directory.tableHeaders.notesCount}
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                {ADVISOR_COPY.directory.tableHeaders.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>{ADVISOR_COPY.directory.loadingText}</span>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="max-w-md mx-auto space-y-2">
                    <User className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                      {ADVISOR_COPY.directory.emptyStateTitle}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {ADVISOR_COPY.directory.emptyStateDescription}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  tabIndex={0}
                  onClick={() => onSelectStudent(student.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStudent(student.id);
                    }
                  }}
                  className="hover:bg-blue-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition focus:outline-none focus:bg-blue-50/70 dark:focus:bg-slate-800/60"
                >
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                    <div>{student.fullName}</div>
                    {student.studentId && (
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        {student.studentId}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {formatGrade(student.gradeLevel)}
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {student.topMatchRole}
                    </div>
                    <div className="text-xs text-slate-500">{student.topMatchField}</div>
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(student.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                    {student.notesCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        <FileText className="w-3 h-3" aria-hidden="true" />
                        {student.notesCount}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(student.id);
                      }}
                      aria-label={ADVISOR_COPY.directory.viewDetailAria(student.fullName)}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium text-xs gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                    >
                      <span className="hidden sm:inline">{ADVISOR_COPY.directory.viewDetailCta}</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
