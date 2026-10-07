'use client';

import React, { useEffect, useState } from 'react';
import { PasscodeLogin } from '@/components/advisor/PasscodeLogin';
import { AdvisorDashboard } from '@/components/advisor/AdvisorDashboard';
import { Compass } from 'lucide-react';
import { ADVISOR_COPY } from '@/content/advisorCopy';

export default function AdvisorPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [advisorName, setAdvisorName] = useState<string>('Advisor');

  // Verify session on initial mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/advisor/students?dateRange=7d');
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (name: string) => {
    setAdvisorName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500">{ADVISOR_COPY.directory.loadingText}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Compass className="w-6 h-6" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {ADVISOR_COPY.portal.brandName}
          </span>
        </div>

        <PasscodeLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return <AdvisorDashboard initialAdvisorName={advisorName} onLogout={handleLogout} />;
}
