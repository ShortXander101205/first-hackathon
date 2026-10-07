'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StudentDirectoryItem } from '@/app/api/advisor/students/route';
import { StudentTable } from './StudentTable';
import { StudentDetailModal } from './StudentDetailModal';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { Compass, LogOut, UserCheck } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface AdvisorDashboardProps {
  initialAdvisorName?: string;
  onLogout?: () => void;
}

export const AdvisorDashboard: React.FC<AdvisorDashboardProps> = ({
  initialAdvisorName = ADVISOR_COPY.notes.authorDefault,
  onLogout,
}) => {
  const [students, setStudents] = useState<StudentDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [advisorName, setAdvisorName] = useState(initialAdvisorName);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedGrade !== 'all') params.set('grade', selectedGrade);
      if (selectedDateRange !== 'all') params.set('dateRange', selectedDateRange);

      const res = await fetch(`/api/advisor/students?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.students)) {
        setStudents(data.students);
      } else if (res.status === 401 && onLogout) {
        onLogout();
      }
    } catch {
      // Keep existing list on error
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedGrade, selectedDateRange, onLogout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedStudentId(null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/advisor/logout', { method: 'POST' });
    } finally {
      if (onLogout) onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {ADVISOR_COPY.portal.brandName}
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 ml-2 border-l border-slate-200 dark:border-slate-700 pl-2">
                {ADVISOR_COPY.portal.frameworkBadge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
              <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>{advisorName}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label={ADVISOR_COPY.portal.logoutAriaLabel}
              className="min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>{ADVISOR_COPY.portal.logoutButton}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <ErrorBoundary componentName="AdvisorDashboard" onReset={fetchStudents}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {ADVISOR_COPY.portal.pageTitle}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {ADVISOR_COPY.portal.tagline}
            </p>
          </div>

          {/* Directory Table with search and filters */}
          <StudentTable
            students={students}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGrade={selectedGrade}
            onGradeChange={setSelectedGrade}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
            onSelectStudent={handleSelectStudent}
          />
        </main>
      </ErrorBoundary>

      {/* Student Detail Modal / Drawer */}
      <StudentDetailModal
        submissionId={selectedStudentId}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        advisorName={advisorName}
        onNoteAdded={fetchStudents}
      />
    </div>
  );
};
