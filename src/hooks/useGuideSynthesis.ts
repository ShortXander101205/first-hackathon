'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { SubmissionPayload, ProblemDetails } from '@/types/api';
import type { GuideResult } from '@/types/career';

export interface UseGuideSynthesisReturn {
  isLoading: boolean;
  guideResult: GuideResult | null;
  error: ProblemDetails | Error | null;
  fetchGuide: (payload: SubmissionPayload) => Promise<void>;
  resetGuide: () => void;
}

export function useGuideSynthesis(): UseGuideSynthesisReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [guideResult, setGuideResult] = useState<GuideResult | null>(null);
  const [error, setError] = useState<ProblemDetails | Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up any ongoing fetch on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchGuide = useCallback(async (payload: SubmissionPayload) => {
    // Abort any existing in-flight request
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data as ProblemDetails);
        setIsLoading(false);
        return;
      }

      setGuideResult(data as GuideResult);
      setError(null);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err : new Error('Failed to assemble discovery guide'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetGuide = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setGuideResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    guideResult,
    error,
    fetchGuide,
    resetGuide,
  };
}
