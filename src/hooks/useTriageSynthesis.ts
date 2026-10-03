'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { TriageSuccessResponse, ProblemDetails } from '@/types/api';
import type { IntakeAnswersState } from '@/types/intake';

export interface UseTriageSynthesisReturn {
  isLoading: boolean;
  dossier: TriageSuccessResponse | null;
  error: ProblemDetails | Error | null;
  fetchDossier: (answers: IntakeAnswersState, studentNickname?: string) => Promise<void>;
  resetDossier: () => void;
}

export function useTriageSynthesis(): UseTriageSynthesisReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [dossier, setDossier] = useState<TriageSuccessResponse | null>(null);
  const [error, setError] = useState<ProblemDetails | Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up any ongoing fetch on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchDossier = useCallback(
    async (answers: IntakeAnswersState, studentNickname?: string) => {
      // Abort any existing in-flight request
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/triage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
            studentNickname: studentNickname?.trim() || '',
          }),
          signal: abortController.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data as ProblemDetails);
          setIsLoading(false);
          return;
        }

        setDossier(data as TriageSuccessResponse);
        setError(null);
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err : new Error('Failed to synthesize pathways'));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetDossier = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setDossier(null);
    setError(null);
  }, []);

  return {
    isLoading,
    dossier,
    error,
    fetchDossier,
    resetDossier,
  };
}
