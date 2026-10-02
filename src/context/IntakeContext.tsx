'use client';

import React, { createContext, useReducer, useCallback, useMemo } from 'react';
import type {
  IntakeState,
  IntakeAction,
  IntakeAnswersState,
  IntakeContextValue,
  EnvironmentChoice,
  AmbitionChoice,
} from '@/types/intake';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { useWizardSession } from '@/hooks/useWizardSession';

// ==========================================
// Initial State Constants
// ==========================================

export const INITIAL_INTAKE_ANSWERS: IntakeAnswersState = {
  q1TaskIds: [],
  q2SubjectId: null,
  q2Rationale: '',
  q3Environment: null,
  q4Ambition: null,
};

export const INITIAL_INTAKE_STATE: IntakeState = {
  currentStep: 1,
  studentNickname: '',
  answers: INITIAL_INTAKE_ANSWERS,
  validationErrors: {},
  isResetDialogOpen: false,
  isCompleted: false,
  isHydrated: false,
};

// ==========================================
// Pure Validation Engine
// ==========================================

export function isStep1Valid(answers: IntakeAnswersState): boolean {
  if (!answers?.q1TaskIds || !Array.isArray(answers.q1TaskIds)) return false;
  const validTasks = answers.q1TaskIds.filter(
    (id) => typeof id === 'string' && id.trim().length > 0
  );
  const uniqueTasks = new Set(validTasks);
  return (
    uniqueTasks.size >= 1 &&
    uniqueTasks.size <= 2 &&
    validTasks.length === uniqueTasks.size
  );
}

export function isStep2Valid(answers: IntakeAnswersState): boolean {
  if (!answers) return false;
  const hasSubject = Boolean(
    answers.q2SubjectId &&
      typeof answers.q2SubjectId === 'string' &&
      answers.q2SubjectId.trim() !== ''
  );
  const rawRationale = typeof answers.q2Rationale === 'string' ? answers.q2Rationale : '';
  const trimmedRationale = rawRationale.trim();
  const hasValidRationale = trimmedRationale.length >= 1 && rawRationale.length <= 150;
  return hasSubject && hasValidRationale;
}

export function isStep3Valid(answers: IntakeAnswersState): boolean {
  if (!answers) return false;
  return answers.q3Environment === 'REMOTE_DESK' || answers.q3Environment === 'ACTIVE_FIELD_LAB';
}

export function isStep4Valid(answers: IntakeAnswersState): boolean {
  if (!answers) return false;
  return answers.q4Ambition === 'WORKFORCE_DIRECT' || answers.q4Ambition === 'GRADUATE_STUDY';
}

export function validateStep(step: 1 | 2 | 3 | 4, answers: IntakeAnswersState): boolean {
  switch (step) {
    case 1:
      return isStep1Valid(answers);
    case 2:
      return isStep2Valid(answers);
    case 3:
      return isStep3Valid(answers);
    case 4:
      return isStep4Valid(answers);
    default:
      return false;
  }
}

export function canAccessStep(
  targetStep: 1 | 2 | 3 | 4,
  currentStep: 1 | 2 | 3 | 4,
  answers: IntakeAnswersState
): boolean {
  if (targetStep === 1) return true;
  if (targetStep <= currentStep) return true;

  for (let s = 1; s < targetStep; s++) {
    if (!validateStep(s as 1 | 2 | 3 | 4, answers)) {
      return false;
    }
  }

  return true;
}

// ==========================================
// Pure Reducer Function
// ==========================================

export function intakeReducer(state: IntakeState, action: IntakeAction): IntakeState {
  switch (action.type) {
    case 'SET_NICKNAME': {
      return {
        ...state,
        studentNickname: action.payload.trim().slice(0, 50),
      };
    }

    case 'TOGGLE_TASK': {
      const taskId = action.payload;
      const exists = state.answers.q1TaskIds.includes(taskId);
      let updatedTaskIds: string[];

      if (exists) {
        updatedTaskIds = state.answers.q1TaskIds.filter((id) => id !== taskId);
      } else {
        if (state.answers.q1TaskIds.length >= 2) {
          // Cannot exceed 2 selected tasks
          return state;
        }
        updatedTaskIds = [...state.answers.q1TaskIds, taskId];
      }

      const isNowValid = updatedTaskIds.length >= 1 && updatedTaskIds.length <= 2;
      return {
        ...state,
        answers: {
          ...state.answers,
          q1TaskIds: updatedTaskIds,
        },
        validationErrors: {
          ...state.validationErrors,
          q1: isNowValid ? undefined : state.validationErrors.q1,
        },
      };
    }

    case 'SET_SUBJECT': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q2SubjectId: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q2Subject: undefined,
        },
      };
    }

    case 'SET_RATIONALE': {
      const sliced = action.payload.slice(0, 150);
      const isNowValid = sliced.trim().length >= 1;
      return {
        ...state,
        answers: {
          ...state.answers,
          q2Rationale: sliced,
        },
        validationErrors: {
          ...state.validationErrors,
          q2Rationale: isNowValid ? undefined : state.validationErrors.q2Rationale,
        },
      };
    }

    case 'SET_ENVIRONMENT': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q3Environment: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q3: undefined,
        },
      };
    }

    case 'SET_AMBITION': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q4Ambition: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q4: undefined,
        },
      };
    }

    case 'GO_TO_STEP': {
      const targetStep = action.payload;
      if (canAccessStep(targetStep, state.currentStep, state.answers)) {
        return {
          ...state,
          currentStep: targetStep,
          isCompleted: false,
          validationErrors: {},
        };
      }
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          general: INTAKE_COPY.validation.navigationBlocked,
        },
      };
    }

    case 'NEXT_STEP': {
      const isValid = validateStep(state.currentStep, state.answers);

      if (isValid) {
        if (state.currentStep < 4) {
          return {
            ...state,
            currentStep: (state.currentStep + 1) as 1 | 2 | 3 | 4,
            validationErrors: {},
          };
        }
        return {
          ...state,
          isCompleted: true,
          validationErrors: {},
        };
      }

      // Step is invalid: attach empathetic guidance
      const newErrors = { ...state.validationErrors };
      if (state.currentStep === 1) {
        newErrors.q1 = INTAKE_COPY.validation.step1Required;
      } else if (state.currentStep === 2) {
        if (!state.answers.q2SubjectId) {
          newErrors.q2Subject = INTAKE_COPY.validation.step2SubjectRequired;
        }
        if (state.answers.q2Rationale.trim().length === 0) {
          newErrors.q2Rationale = INTAKE_COPY.validation.step2RationaleRequired;
        } else if (state.answers.q2Rationale.length > 150) {
          newErrors.q2Rationale = INTAKE_COPY.validation.step2RationaleMaxLength;
        }
      } else if (state.currentStep === 3) {
        newErrors.q3 = INTAKE_COPY.validation.step3EnvironmentRequired;
      } else if (state.currentStep === 4) {
        newErrors.q4 = INTAKE_COPY.validation.step4AmbitionRequired;
      }

      return {
        ...state,
        validationErrors: newErrors,
      };
    }

    case 'PREVIOUS_STEP': {
      if (state.isCompleted) {
        return {
          ...state,
          isCompleted: false,
          currentStep: 4,
          validationErrors: {},
        };
      }
      if (state.currentStep > 1) {
        return {
          ...state,
          currentStep: (state.currentStep - 1) as 1 | 2 | 3 | 4,
          validationErrors: {},
        };
      }
      return state;
    }

    case 'OPEN_RESET_DIALOG': {
      return {
        ...state,
        isResetDialogOpen: true,
      };
    }

    case 'CLOSE_RESET_DIALOG': {
      return {
        ...state,
        isResetDialogOpen: false,
      };
    }

    case 'RESET_STATE': {
      return {
        ...INITIAL_INTAKE_STATE,
        isHydrated: true,
      };
    }

    case 'HYDRATE_STATE': {
      const payload = action.payload;
      const hydratedAnswers: Partial<IntakeAnswersState> = payload.answers ?? {};
      return {
        ...state,
        currentStep: payload.currentStep ?? state.currentStep,
        studentNickname:
          typeof payload.studentNickname === 'string'
            ? payload.studentNickname
            : state.studentNickname,
        answers: {
          ...state.answers,
          ...hydratedAnswers,
          q1TaskIds: Array.isArray(hydratedAnswers.q1TaskIds)
            ? hydratedAnswers.q1TaskIds
            : state.answers.q1TaskIds,
          q2Rationale:
            typeof hydratedAnswers.q2Rationale === 'string'
              ? hydratedAnswers.q2Rationale
              : state.answers.q2Rationale ?? '',
        },
      };
    }

    case 'SET_HYDRATED': {
      return {
        ...state,
        isHydrated: true,
      };
    }

    default:
      return state;
  }
}

// ==========================================
// React Context & Provider
// ==========================================

export const IntakeContext = createContext<IntakeContextValue | null>(null);

export interface IntakeProviderProps {
  children: React.ReactNode;
}

export function IntakeProvider({ children }: IntakeProviderProps) {
  const [state, dispatch] = useReducer(intakeReducer, INITIAL_INTAKE_STATE);
  const { purgeSession } = useWizardSession(state, dispatch);

  const isCurrentStepValid = validateStep(state.currentStep, state.answers);

  const isStepValidSelector = useCallback(
    (step: 1 | 2 | 3 | 4): boolean => {
      return validateStep(step, state.answers);
    },
    [state.answers]
  );

  const canAccessStepSelector = useCallback(
    (targetStep: 1 | 2 | 3 | 4): boolean => {
      if (state.isCompleted) return true;
      return canAccessStep(targetStep, state.currentStep, state.answers);
    },
    [state.currentStep, state.answers, state.isCompleted]
  );

  // Semantic Dispatch Actions
  const setNickname = useCallback((nickname: string) => {
    dispatch({ type: 'SET_NICKNAME', payload: nickname });
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  }, []);

  const setSubject = useCallback((subjectId: string) => {
    dispatch({ type: 'SET_SUBJECT', payload: subjectId });
  }, []);

  const setRationale = useCallback((rationale: string) => {
    dispatch({ type: 'SET_RATIONALE', payload: rationale });
  }, []);

  const setEnvironment = useCallback((env: EnvironmentChoice) => {
    dispatch({ type: 'SET_ENVIRONMENT', payload: env });
  }, []);

  const setAmbition = useCallback((ambition: AmbitionChoice) => {
    dispatch({ type: 'SET_AMBITION', payload: ambition });
  }, []);

  const goToStep = useCallback((step: 1 | 2 | 3 | 4) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const openResetDialog = useCallback(() => {
    dispatch({ type: 'OPEN_RESET_DIALOG' });
  }, []);

  const closeResetDialog = useCallback(() => {
    dispatch({ type: 'CLOSE_RESET_DIALOG' });
  }, []);

  const resetState = useCallback(() => {
    purgeSession();
    dispatch({ type: 'RESET_STATE' });
  }, [purgeSession]);

  const contextValue: IntakeContextValue = useMemo(
    () => ({
      state,
      dispatch,
      isStepValid: isStepValidSelector,
      canAccessStep: canAccessStepSelector,
      isCurrentStepValid,
      setNickname,
      toggleTask,
      setSubject,
      setRationale,
      setEnvironment,
      setAmbition,
      goToStep,
      nextStep,
      previousStep,
      openResetDialog,
      closeResetDialog,
      resetState,
    }),
    [
      state,
      isStepValidSelector,
      canAccessStepSelector,
      isCurrentStepValid,
      setNickname,
      toggleTask,
      setSubject,
      setRationale,
      setEnvironment,
      setAmbition,
      goToStep,
      nextStep,
      previousStep,
      openResetDialog,
      closeResetDialog,
      resetState,
    ]
  );

  return <IntakeContext.Provider value={contextValue}>{children}</IntakeContext.Provider>;
}

// Aliases for consumer flexibility
export const WizardContext = IntakeContext;
export const WizardProvider = IntakeProvider;
