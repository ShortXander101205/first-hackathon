'use client';

import React, { useState } from 'react';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

interface PasscodeLoginProps {
  onLoginSuccess: (authorName: string) => void;
}

export const PasscodeLogin: React.FC<PasscodeLoginProps> = ({ onLoginSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMessage(ADVISOR_COPY.login.errorMessage);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/advisor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passcode: passcode.trim(),
          authorName: authorName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.authorName || authorName.trim() || 'Advisor');
      } else {
        setErrorMessage(data.detail || ADVISOR_COPY.login.errorMessage);
      }
    } catch {
      setErrorMessage(ADVISOR_COPY.errors.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3">
          <Lock className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {ADVISOR_COPY.login.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {ADVISOR_COPY.login.subtitle}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-sm text-red-800 dark:text-red-300"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="advisor-passcode"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
          >
            {ADVISOR_COPY.login.passcodeLabel}{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="advisor-passcode"
            type="password"
            autoComplete="current-password"
            required
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder={ADVISOR_COPY.login.passcodePlaceholder}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            aria-describedby="advisor-passcode-helper"
          />
          <p id="advisor-passcode-helper" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {ADVISOR_COPY.login.passcodeHelper}
          </p>
        </div>

        <div>
          <label
            htmlFor="advisor-author-name"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
          >
            {ADVISOR_COPY.login.authorNameLabel}
          </label>
          <div className="relative">
            <input
              id="advisor-author-name"
              type="text"
              autoComplete="name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={ADVISOR_COPY.login.authorNamePlaceholder}
              className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
              aria-describedby="advisor-author-helper"
            />
            <User
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
          </div>
          <p id="advisor-author-helper" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {ADVISOR_COPY.login.authorNameHelper}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-[44px] mt-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? (
            <span>{ADVISOR_COPY.login.authenticatingButton}</span>
          ) : (
            <>
              <span>{ADVISOR_COPY.login.submitButton}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
          {ADVISOR_COPY.login.privacyNote}
        </p>
      </form>
    </div>
  );
};
