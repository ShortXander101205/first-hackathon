'use client';

import React, { createContext, useReducer, useCallback, useMemo } from 'react';
import type {
  IntakeState,
  IntakeAction,
  IntakeAnswersState,
  IntakeAnswers,
  IntakeContextValue,
  StudentProfile,
  GradeLevel,
  WorkEnvironment,
  ProblemSolvingStyle,
  SocialEnergyStyle,
  StructureTolerance,
  FrictionTolerance,
  HorizonPriority,
  AmbitionTimeline,
  EnvironmentChoice,
  AmbitionChoice,
  WizardStep,
  HighSchoolTrack,
  PracticalWorkContext,
  CollaborationStyle,
} from '@/types/intake';
import { GUIDE_COPY } from '@/content/guideCopy';
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

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  fullName: '',
  gradeLevel: 'grade_10',
  studentId: '',
};

export const INITIAL_INTAKE_STATE: IntakeState = {
  currentStep: 0,
  profile: INITIAL_STUDENT_PROFILE,
  studentNickname: '',
  answers: {
    ...INITIAL_INTAKE_ANSWERS,
    q3AcademicHesitation: '',
  },
  validationErrors: {},
  isResetDialogOpen: false,
  isCompleted: false,
  isHydrated: false,
};

// ==========================================
// Pure Validation Engine
// ==========================================

export function isStep0Valid(profile?: Partial<StudentProfile> | null): boolean {
  if (!profile) return false;
  const hasName =
    typeof profile.fullName === 'string' &&
    profile.fullName.trim().length >= 1 &&
    profile.fullName.length <= 100;
  const validGrades: GradeLevel[] = [
    'grade_10',
    'grade_11',
    'grade_12',
    'college_freshman',
    'college_sophomore',
    'high_school_junior',
    'high_school_senior',
  ];
  const hasGrade = Boolean(profile.gradeLevel && validGrades.includes(profile.gradeLevel));
  const hasValidId =
    !profile.studentId ||
    (typeof profile.studentId === 'string' && profile.studentId.trim().length <= 64);
  return hasName && hasGrade && hasValidId;
}

export function isStep1Valid(answers: any): boolean {
  if (!answers?.q1TaskIds || !Array.isArray(answers.q1TaskIds)) return false;
  const validTasks = answers.q1TaskIds.filter(
    (id: any) => typeof id === 'string' && id.trim().length > 0
  );
  const uniqueTasks = new Set(validTasks);
  return (
    uniqueTasks.size >= 1 &&
    uniqueTasks.size <= 2 &&
    validTasks.length === uniqueTasks.size
  );
}

export function isStep2Valid(answers: any): boolean {
  if (!answers) return false;
  const hasSubject = Boolean(
    answers.q2SubjectId &&
      typeof answers.q2SubjectId === 'string' &&
      answers.q2SubjectId.trim() !== ''
  );
  if (!hasSubject) return false;

  // If a legacy rationale is provided, it cannot exceed 150 chars
  if (answers.q2Rationale && answers.q2Rationale.length > 150) {
    return false;
  }

  // In legacy v1 (no v2 hesitation field), Step 2 required both subject and 1-150 char rationale
  if (answers.q3AcademicHesitation === undefined && answers.q2Rationale !== undefined) {
    const rawRationale = typeof answers.q2Rationale === 'string' ? answers.q2Rationale : '';
    const trimmed = rawRationale.trim();
    return trimmed.length >= 1 && rawRationale.length <= 150;
  }

  // In v2, Step 2 solely evaluates primary academic subject curiosity
  return true;
}

export function isStep3Valid(answers: any): boolean {
  if (!answers) return false;
  // v2.1: High School Track
  const validTracks = ['SCIENCE_MATH', 'ARTS_MATH', 'ARTS_LANGUAGE', 'VOCATIONAL_APPLIED', 'TRACK_EXPLORING'];
  if (answers.q3HighSchoolTrack && validTracks.includes(answers.q3HighSchoolTrack)) {
    return true;
  }
  // If v2 hesitation text is present
  if (typeof answers.q3AcademicHesitation === 'string') {
    const trimmed = answers.q3AcademicHesitation.trim();
    if (trimmed.length >= 1 && answers.q3AcademicHesitation.length <= 200) {
      return true;
    }
  }
  // If v1 environment is present
  if (answers.q3Environment === 'REMOTE_DESK' || answers.q3Environment === 'ACTIVE_FIELD_LAB') {
    return true;
  }
  return false;
}

export function isStep4Valid(answers: any): boolean {
  if (!answers) return false;
  // v2.1: Academic Hesitation (Q4)
  if (typeof answers.q4AcademicHesitation === 'string') {
    const trimmed = answers.q4AcademicHesitation.trim();
    if (trimmed.length >= 1 && answers.q4AcademicHesitation.length <= 200) {
      return true;
    }
  }
  // If v2 hesitation was stored in q3AcademicHesitation
  if (typeof answers.q3AcademicHesitation === 'string') {
    const trimmed = answers.q3AcademicHesitation.trim();
    if (trimmed.length >= 1 && answers.q3AcademicHesitation.length <= 200) {
      return true;
    }
  }
  // v2 environment
  const validEnvs: WorkEnvironment[] = [
    'REMOTE_DIGITAL',
    'COLLABORATIVE_STUDIO',
    'ACTIVE_FIELD_LAB',
    'HEALTHCARE_COMMUNITY',
  ];
  if (answers.q4Environment && validEnvs.includes(answers.q4Environment)) {
    return true;
  }
  // v1 ambition
  if (answers.q4Ambition === 'WORKFORCE_DIRECT' || answers.q4Ambition === 'GRADUATE_STUDY') {
    return true;
  }
  return false;
}

export function isStep5Valid(answers: any): boolean {
  if (!answers) return false;
  const validEnvs: WorkEnvironment[] = [
    'REMOTE_DIGITAL',
    'COLLABORATIVE_STUDIO',
    'ACTIVE_FIELD_LAB',
    'HEALTHCARE_COMMUNITY',
  ];
  if (answers.q5Environment && validEnvs.includes(answers.q5Environment)) {
    return true;
  }
  if (answers.q4Environment && validEnvs.includes(answers.q4Environment)) {
    return true;
  }
  const valid: ProblemSolvingStyle[] = [
    'SYSTEMATIC_LOGIC',
    'CREATIVE_EXPLORATION',
    'PEOPLE_RELATIONAL',
    'PRACTICAL_HANDS_ON',
  ];
  return Boolean(answers?.q5ProblemSolving && valid.includes(answers.q5ProblemSolving));
}

export function isStep6Valid(answers: any): boolean {
  const valid: SocialEnergyStyle[] = [
    'INDEPENDENT_DEEP_FOCUS',
    'BALANCED_TEAM',
    'HIGH_CONTACT_PEOPLE',
  ];
  return Boolean(
    (answers?.q6CollaborationStyle && valid.includes(answers.q6CollaborationStyle)) ||
    (answers?.q6SocialEnergy && valid.includes(answers.q6SocialEnergy))
  );
}

export function isStep7Valid(answers: any): boolean {
  const validProb: ProblemSolvingStyle[] = [
    'SYSTEMATIC_LOGIC',
    'CREATIVE_EXPLORATION',
    'PEOPLE_RELATIONAL',
    'PRACTICAL_HANDS_ON',
  ];
  if (answers?.q7ProblemSolving && validProb.includes(answers.q7ProblemSolving)) {
    return true;
  }
  if (answers?.q5ProblemSolving && validProb.includes(answers.q5ProblemSolving)) {
    return true;
  }
  const valid: StructureTolerance[] = [
    'HIGH_STRUCTURE_CLEAR_RULES',
    'BALANCED_MILESTONES',
    'HIGH_AUTONOMY_AMBIGUITY',
  ];
  return Boolean(answers?.q7StructureTolerance && valid.includes(answers.q7StructureTolerance));
}

export function isStep8Valid(answers: any): boolean {
  const valid: StructureTolerance[] = [
    'HIGH_STRUCTURE_CLEAR_RULES',
    'BALANCED_MILESTONES',
    'HIGH_AUTONOMY_AMBIGUITY',
  ];
  if (answers?.q8StructureTolerance && valid.includes(answers.q8StructureTolerance)) {
    return true;
  }
  if (answers?.q7StructureTolerance && valid.includes(answers.q7StructureTolerance)) {
    return true;
  }
  const validFriction: FrictionTolerance[] = [
    'ADVANCED_MATH',
    'PUBLIC_SPEAKING',
    'HEAVY_MEMORIZATION',
    'INTENSIVE_WRITING',
    'ISOLATED_THEORY',
  ];
  return Boolean(answers?.q8AcademicFriction && validFriction.includes(answers.q8AcademicFriction));
}

export function isStep9Valid(answers: any): boolean {
  const validContext = [
    'DIGITAL_TECH_PRODUCTS',
    'HEALTH_WELLNESS_CARE',
    'ENTERPRISE_GROWTH',
    'CREATIVE_MEDIA_STORYTELLING',
    'PUBLIC_GOOD_COMMUNITY',
  ];
  if (answers?.q9WorkContext && validContext.includes(answers.q9WorkContext)) {
    return true;
  }
  const valid: HorizonPriority[] = [
    'FINANCIAL_STABILITY',
    'PURPOSE_IMPACT',
    'CREATIVE_AUTONOMY',
    'INTELLECTUAL_DEPTH',
    'WORK_LIFE_BALANCE',
    'HIGH_EARNING_SECURITY',
  ];
  return Boolean(answers?.q9HorizonPriority && valid.includes(answers.q9HorizonPriority));
}

export function isStep10Valid(answers: any): boolean {
  const validFriction: FrictionTolerance[] = [
    'ADVANCED_MATH',
    'PUBLIC_SPEAKING',
    'HEAVY_MEMORIZATION',
    'INTENSIVE_WRITING',
    'ISOLATED_THEORY',
  ];
  if (answers?.q10AcademicFriction && validFriction.includes(answers.q10AcademicFriction)) {
    return true;
  }
  if (answers?.q8AcademicFriction && validFriction.includes(answers.q8AcademicFriction)) {
    return true;
  }
  const valid: AmbitionTimeline[] = [
    'WORKFORCE_DIRECT',
    'GRADUATE_STUDY',
    'FLEXIBLE_ENTREPRENEURSHIP',
  ];
  return Boolean(answers?.q10PostCollegeAmbition && valid.includes(answers.q10PostCollegeAmbition));
}

export function isStep11Valid(answers: any): boolean {
  const valid: HorizonPriority[] = [
    'FINANCIAL_STABILITY',
    'PURPOSE_IMPACT',
    'CREATIVE_AUTONOMY',
    'INTELLECTUAL_DEPTH',
    'WORK_LIFE_BALANCE',
    'HIGH_EARNING_SECURITY',
  ];
  return Boolean(
    (answers?.q11HorizonPriority && valid.includes(answers.q11HorizonPriority)) ||
    (answers?.q9HorizonPriority && valid.includes(answers.q9HorizonPriority))
  );
}

export function isStep12Valid(answers: any): boolean {
  const valid: AmbitionTimeline[] = [
    'WORKFORCE_DIRECT',
    'GRADUATE_STUDY',
    'FLEXIBLE_ENTREPRENEURSHIP',
  ];
  return Boolean(
    (answers?.q12PostCollegeAmbition && valid.includes(answers.q12PostCollegeAmbition)) ||
    (answers?.q10PostCollegeAmbition && valid.includes(answers.q10PostCollegeAmbition))
  );
}

export function validateStep(
  step: WizardStep,
  profileOrAnswers: any,
  answersMaybe?: any
): boolean {
  const profile = answersMaybe !== undefined ? profileOrAnswers : profileOrAnswers?.profile || profileOrAnswers;
  const answers = answersMaybe !== undefined ? answersMaybe : profileOrAnswers?.answers || profileOrAnswers;

  switch (step) {
    case 0:
      return isStep0Valid(profile);
    case 1:
      return isStep1Valid(answers);
    case 2:
      return isStep2Valid(answers);
    case 3:
      return isStep3Valid(answers);
    case 4:
      return isStep4Valid(answers);
    case 5:
      return isStep5Valid(answers);
    case 6:
      return isStep6Valid(answers);
    case 7:
      return isStep7Valid(answers);
    case 8:
      return isStep8Valid(answers);
    case 9:
      return isStep9Valid(answers);
    case 10:
      return isStep10Valid(answers);
    case 11:
      return isStep11Valid(answers);
    case 12:
      return isStep12Valid(answers);
    default:
      return false;
  }
}

export function canAccessStep(
  targetStep: WizardStep,
  currentStep: WizardStep,
  profileOrAnswers: any,
  answersMaybe?: any
): boolean {
  // Step 0 and Step 1 are always accessible
  if (targetStep === 0 || targetStep === 1) return true;

  // Backward navigation to any previous step is always allowed
  if (targetStep <= currentStep) return true;

  // Forward jump more than 1 step past current is blocked in strict mode
  // But if prior steps are valid, check them in sequence
  for (let s = (currentStep === 0 ? 0 : 1); s < targetStep; s++) {
    if (!validateStep(s as WizardStep, profileOrAnswers, answersMaybe)) {
      return false;
    }
  }

  return true;
}

// ==========================================
// Pure Reducer Function
// ==========================================

export function intakeReducer(state: IntakeState, action: IntakeAction): IntakeState {
  const currentProfile = state.profile || INITIAL_STUDENT_PROFILE;

  switch (action.type) {
    case 'SET_PROFILE': {
      const updatedProfile = { ...currentProfile, ...action.payload };
      return {
        ...state,
        profile: updatedProfile,
        studentNickname: updatedProfile.fullName ? updatedProfile.fullName.trim().slice(0, 50) : state.studentNickname,
        validationErrors: {
          ...state.validationErrors,
          fullName: isStep0Valid(updatedProfile) ? undefined : state.validationErrors.fullName,
          gradeLevel: isStep0Valid(updatedProfile) ? undefined : state.validationErrors.gradeLevel,
        },
      };
    }

    case 'SET_FULL_NAME': {
      const trimmed = action.payload.trim().slice(0, 100);
      const updatedProfile = { ...currentProfile, fullName: trimmed };
      return {
        ...state,
        profile: updatedProfile,
        studentNickname: trimmed.slice(0, 50),
        validationErrors: {
          ...state.validationErrors,
          fullName: trimmed.length >= 1 ? undefined : state.validationErrors.fullName,
        },
      };
    }

    case 'SET_GRADE_LEVEL': {
      const updatedProfile = { ...currentProfile, gradeLevel: action.payload };
      return {
        ...state,
        profile: updatedProfile,
        validationErrors: {
          ...state.validationErrors,
          gradeLevel: undefined,
        },
      };
    }

    case 'SET_STUDENT_ID': {
      const updatedProfile = { ...currentProfile, studentId: action.payload.trim().slice(0, 64) };
      return {
        ...state,
        profile: updatedProfile,
        validationErrors: {
          ...state.validationErrors,
          studentId: undefined,
        },
      };
    }

    case 'SET_NICKNAME': {
      const trimmed = action.payload.trim().slice(0, 50);
      const updatedProfile = {
        ...currentProfile,
        fullName: currentProfile.fullName || trimmed,
      };
      return {
        ...state,
        studentNickname: trimmed,
        profile: updatedProfile,
      };
    }

    case 'TOGGLE_TASK':
    case 'TOGGLE_Q1_TASK': {
      const taskId = action.payload;
      const exists = state.answers.q1TaskIds.includes(taskId);
      let updatedTaskIds: string[];

      if (exists) {
        updatedTaskIds = state.answers.q1TaskIds.filter((id) => id !== taskId);
      } else {
        if (state.answers.q1TaskIds.length >= 2) {
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

    case 'SET_SUBJECT':
    case 'SET_Q2_SUBJECT': {
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
          q3AcademicHesitation: sliced,
        },
        validationErrors: {
          ...state.validationErrors,
          q2Rationale: isNowValid ? undefined : state.validationErrors.q2Rationale,
          q3Hesitation: isNowValid ? undefined : state.validationErrors.q3Hesitation,
        },
      };
    }

    case 'SET_Q3_HESITATION': {
      const sliced = action.payload.slice(0, 200);
      const isNowValid = sliced.trim().length >= 1;
      return {
        ...state,
        answers: {
          ...state.answers,
          q3AcademicHesitation: sliced,
          q2Rationale: sliced,
        },
        validationErrors: {
          ...state.validationErrors,
          q3Hesitation: isNowValid ? undefined : state.validationErrors.q3Hesitation,
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
          q4Environment: undefined,
        },
      };
    }

    case 'SET_Q4_ENVIRONMENT': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q4Environment: action.payload,
          q3Environment: (action.payload === 'ACTIVE_FIELD_LAB' ? 'ACTIVE_FIELD_LAB' : 'REMOTE_DESK') as EnvironmentChoice,
        },
        validationErrors: {
          ...state.validationErrors,
          q4Environment: undefined,
        },
      };
    }

    case 'SET_Q5_PROBLEM_SOLVING': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q5ProblemSolving: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q5ProblemSolving: undefined,
        },
      };
    }

    case 'SET_Q6_SOCIAL_ENERGY': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q6SocialEnergy: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q6SocialEnergy: undefined,
        },
      };
    }

    case 'SET_Q7_STRUCTURE': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q7StructureTolerance: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q7Structure: undefined,
        },
      };
    }

    case 'SET_Q8_ACADEMIC_FRICTION': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q8AcademicFriction: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q8Friction: undefined,
        },
      };
    }

    case 'SET_Q9_HORIZON_PRIORITY': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q9HorizonPriority: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q9Priority: undefined,
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
          q10Ambition: undefined,
        },
      };
    }

    case 'SET_Q10_AMBITION': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q10PostCollegeAmbition: action.payload,
          q4Ambition: (action.payload === 'GRADUATE_STUDY' ? 'GRADUATE_STUDY' : 'WORKFORCE_DIRECT') as AmbitionChoice,
        },
        validationErrors: {
          ...state.validationErrors,
          q10Ambition: undefined,
        },
      };
    }

    case 'SET_Q3_TRACK': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q3HighSchoolTrack: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q3Track: undefined,
          q3: undefined,
        },
      };
    }

    case 'SET_Q4_HESITATION': {
      const sliced = action.payload.slice(0, 200);
      const isNowValid = sliced.trim().length >= 1;
      return {
        ...state,
        answers: {
          ...state.answers,
          q4AcademicHesitation: sliced,
          q3AcademicHesitation: sliced,
          q2Rationale: sliced,
        },
        validationErrors: {
          ...state.validationErrors,
          q4Hesitation: isNowValid ? undefined : state.validationErrors.q4Hesitation,
          q3Hesitation: isNowValid ? undefined : state.validationErrors.q3Hesitation,
        },
      };
    }

    case 'SET_Q5_ENVIRONMENT': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q5Environment: action.payload,
          q4Environment: action.payload,
          q3Environment: (action.payload === 'ACTIVE_FIELD_LAB' ? 'ACTIVE_FIELD_LAB' : 'REMOTE_DESK') as EnvironmentChoice,
        },
        validationErrors: {
          ...state.validationErrors,
          q5Environment: undefined,
          q4Environment: undefined,
        },
      };
    }

    case 'SET_Q6_COLLABORATION': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q6CollaborationStyle: action.payload,
          q6SocialEnergy: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q6Collaboration: undefined,
          q6SocialEnergy: undefined,
        },
      };
    }

    case 'SET_Q7_PROBLEM_SOLVING': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q7ProblemSolving: action.payload,
          q5ProblemSolving: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q7ProblemSolving: undefined,
          q5ProblemSolving: undefined,
        },
      };
    }

    case 'SET_Q8_STRUCTURE': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q8StructureTolerance: action.payload,
          q7StructureTolerance: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q8Structure: undefined,
          q7Structure: undefined,
        },
      };
    }

    case 'SET_Q9_WORK_CONTEXT': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q9WorkContext: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q9WorkContext: undefined,
        },
      };
    }

    case 'SET_Q10_ACADEMIC_FRICTION': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q10AcademicFriction: action.payload,
          q8AcademicFriction: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q10Friction: undefined,
          q10AcademicFriction: undefined,
          q8Friction: undefined,
        },
      };
    }

    case 'SET_Q11_HORIZON_PRIORITY': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q11HorizonPriority: action.payload,
          q9HorizonPriority: action.payload,
        },
        validationErrors: {
          ...state.validationErrors,
          q11Priority: undefined,
          q9Priority: undefined,
        },
      };
    }

    case 'SET_Q12_AMBITION': {
      return {
        ...state,
        answers: {
          ...state.answers,
          q12PostCollegeAmbition: action.payload,
          q10PostCollegeAmbition: action.payload,
          q4Ambition: (action.payload === 'GRADUATE_STUDY' ? 'GRADUATE_STUDY' : 'WORKFORCE_DIRECT') as AmbitionChoice,
        },
        validationErrors: {
          ...state.validationErrors,
          q12Ambition: undefined,
          q10Ambition: undefined,
        },
      };
    }

    case 'GO_TO_STEP': {
      const targetStep = action.payload;
      if (canAccessStep(targetStep, state.currentStep, currentProfile, state.answers)) {
        return {
          ...state,
          currentStep: targetStep,
          isCompleted: false,
          validationErrors: {},
        };
      }
      return {
        ...state,
        currentStep: (state.currentStep === 0 && !state.profile?.fullName ? 1 : state.currentStep) as WizardStep,
        validationErrors: {
          ...state.validationErrors,
          general: INTAKE_COPY.validation.navigationBlocked,
        },
      };
    }

    case 'NEXT_STEP': {
      const isValid = validateStep(state.currentStep, currentProfile, state.answers);

      if (isValid) {
        if (
          state.currentStep === 12 ||
          (state.currentStep === 10 && !state.answers.q3HighSchoolTrack) ||
          (state.currentStep === 4 && state.answers.q4Ambition && !state.answers.q4Environment)
        ) {
          return {
            ...state,
            isCompleted: true,
            validationErrors: {},
          };
        }
        return {
          ...state,
          currentStep: (state.currentStep + 1) as WizardStep,
          validationErrors: {},
        };
      }

      // Step is invalid: attach error copy
      const newErrors = { ...state.validationErrors };
      if (state.currentStep === 0) {
        if (!currentProfile.fullName || currentProfile.fullName.trim().length === 0) {
          newErrors.fullName = GUIDE_COPY.validation.fullNameRequired;
        }
        if (!currentProfile.gradeLevel) {
          newErrors.gradeLevel = GUIDE_COPY.validation.gradeLevelRequired;
        }
      } else if (state.currentStep === 1) {
        newErrors.q1 = GUIDE_COPY.validation.q1Required;
      } else if (state.currentStep === 2) {
        if (!state.answers.q2SubjectId) {
          newErrors.q2Subject = GUIDE_COPY.validation.q2SubjectRequired;
        }
        if (state.answers.q2Rationale && state.answers.q2Rationale.trim().length === 0) {
          newErrors.q2Rationale = GUIDE_COPY.validation.q3HesitationRequired;
        } else if (state.answers.q2Rationale && state.answers.q2Rationale.length > 150) {
          newErrors.q2Rationale = 'Please keep your thought within 150 characters.';
        }
      } else if (state.currentStep === 3) {
        newErrors.q3Track = GUIDE_COPY.validation.q3TrackRequired;
        newErrors.q3Hesitation = GUIDE_COPY.validation.q3HesitationRequired;
        newErrors.q3 = GUIDE_COPY.validation.q4EnvironmentRequired;
      } else if (state.currentStep === 4) {
        newErrors.q4Hesitation = GUIDE_COPY.validation.q4HesitationRequired;
        newErrors.q4Environment = GUIDE_COPY.validation.q4EnvironmentRequired;
        newErrors.q4 = GUIDE_COPY.validation.q10AmbitionRequired;
      } else if (state.currentStep === 5) {
        newErrors.q5Environment = GUIDE_COPY.validation.q5EnvironmentRequired;
        newErrors.q5ProblemSolving = GUIDE_COPY.validation.q5ProblemSolvingRequired;
      } else if (state.currentStep === 6) {
        newErrors.q6Collaboration = GUIDE_COPY.validation.q6CollaborationRequired;
        newErrors.q6SocialEnergy = GUIDE_COPY.validation.q6SocialEnergyRequired;
      } else if (state.currentStep === 7) {
        newErrors.q7ProblemSolving = GUIDE_COPY.validation.q7ProblemSolvingRequired;
        newErrors.q7Structure = GUIDE_COPY.validation.q7StructureRequired;
      } else if (state.currentStep === 8) {
        newErrors.q8Structure = GUIDE_COPY.validation.q8StructureRequired;
        newErrors.q8Friction = GUIDE_COPY.validation.q8FrictionRequired;
      } else if (state.currentStep === 9) {
        newErrors.q9WorkContext = GUIDE_COPY.validation.q9WorkContextRequired;
        newErrors.q9Priority = GUIDE_COPY.validation.q9PriorityRequired;
      } else if (state.currentStep === 10) {
        newErrors.q10Friction = GUIDE_COPY.validation.q10FrictionRequired;
        newErrors.q10AcademicFriction = GUIDE_COPY.validation.q10AcademicFrictionRequired;
        newErrors.q10Ambition = GUIDE_COPY.validation.q10AmbitionRequired;
      } else if (state.currentStep === 11) {
        newErrors.q11Priority = GUIDE_COPY.validation.q11PriorityRequired;
      } else if (state.currentStep === 12) {
        newErrors.q12Ambition = GUIDE_COPY.validation.q12AmbitionRequired;
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
          currentStep: (state.answers.q12PostCollegeAmbition ? 12 : state.answers.q10PostCollegeAmbition ? 10 : 4) as WizardStep,
          validationErrors: {},
        };
      }
      const minStep = state.profile?.fullName ? 0 : 1;
      if (state.currentStep > minStep) {
        return {
          ...state,
          currentStep: (state.currentStep - 1) as WizardStep,
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
        currentStep: (state.studentNickname && !state.answers.q10PostCollegeAmbition ? 1 : 0) as WizardStep,
        isHydrated: true,
      };
    }

    case 'HYDRATE_STATE': {
      const payload = action.payload;
      const hydratedAnswers = (payload.answers || {}) as Partial<IntakeAnswersState>;
      const hydratedProfile = payload.profile || (payload.studentNickname ? { ...INITIAL_STUDENT_PROFILE, fullName: payload.studentNickname } : INITIAL_STUDENT_PROFILE);
      return {
        ...state,
        currentStep: payload.currentStep ?? state.currentStep,
        profile: hydratedProfile,
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
          q3AcademicHesitation:
            typeof (hydratedAnswers as any).q3AcademicHesitation === 'string'
              ? (hydratedAnswers as any).q3AcademicHesitation
              : state.answers.q3AcademicHesitation ?? '',
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

  const currentProfile = state.profile || INITIAL_STUDENT_PROFILE;
  const isCurrentStepValid = validateStep(state.currentStep, currentProfile, state.answers);

  const isStepValidSelector = useCallback(
    (step: WizardStep): boolean => {
      return validateStep(step, currentProfile, state.answers);
    },
    [currentProfile, state.answers]
  );

  const canAccessStepSelector = useCallback(
    (targetStep: WizardStep): boolean => {
      if (state.isCompleted) return true;
      return canAccessStep(targetStep, state.currentStep, currentProfile, state.answers);
    },
    [state.currentStep, currentProfile, state.answers, state.isCompleted]
  );

  // Semantic Dispatch Actions
  const setProfile = useCallback((profile: Partial<StudentProfile>) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
  }, []);

  const setFullName = useCallback((name: string) => {
    dispatch({ type: 'SET_FULL_NAME', payload: name });
  }, []);

  const setGradeLevel = useCallback((grade: GradeLevel) => {
    dispatch({ type: 'SET_GRADE_LEVEL', payload: grade });
  }, []);

  const setStudentId = useCallback((id: string) => {
    dispatch({ type: 'SET_STUDENT_ID', payload: id });
  }, []);

  const setNickname = useCallback((nickname: string) => {
    dispatch({ type: 'SET_NICKNAME', payload: nickname });
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  }, []);

  const toggleQ1Task = useCallback((taskId: string) => {
    dispatch({ type: 'TOGGLE_Q1_TASK', payload: taskId });
  }, []);

  const setSubject = useCallback((subjectId: string) => {
    dispatch({ type: 'SET_SUBJECT', payload: subjectId });
  }, []);

  const setQ2Subject = useCallback((subjectId: string) => {
    dispatch({ type: 'SET_Q2_SUBJECT', payload: subjectId });
  }, []);

  const setRationale = useCallback((rationale: string) => {
    dispatch({ type: 'SET_RATIONALE', payload: rationale });
  }, []);

  const setQ3Hesitation = useCallback((hesitation: string) => {
    dispatch({ type: 'SET_Q3_HESITATION', payload: hesitation });
  }, []);

  const setQ3Track = useCallback((track: HighSchoolTrack) => {
    dispatch({ type: 'SET_Q3_TRACK', payload: track });
  }, []);

  const setQ4Hesitation = useCallback((hesitation: string) => {
    dispatch({ type: 'SET_Q4_HESITATION', payload: hesitation });
  }, []);

  const setEnvironment = useCallback((env: EnvironmentChoice) => {
    dispatch({ type: 'SET_ENVIRONMENT', payload: env });
  }, []);

  const setQ4Environment = useCallback((env: WorkEnvironment) => {
    dispatch({ type: 'SET_Q4_ENVIRONMENT', payload: env });
  }, []);

  const setQ5Environment = useCallback((env: WorkEnvironment) => {
    dispatch({ type: 'SET_Q5_ENVIRONMENT', payload: env });
  }, []);

  const setQ5ProblemSolving = useCallback((style: ProblemSolvingStyle) => {
    dispatch({ type: 'SET_Q5_PROBLEM_SOLVING', payload: style });
  }, []);

  const setQ6Collaboration = useCallback((collab: CollaborationStyle) => {
    dispatch({ type: 'SET_Q6_COLLABORATION', payload: collab });
  }, []);

  const setQ6SocialEnergy = useCallback((social: SocialEnergyStyle) => {
    dispatch({ type: 'SET_Q6_SOCIAL_ENERGY', payload: social });
  }, []);

  const setQ7ProblemSolving = useCallback((style: ProblemSolvingStyle) => {
    dispatch({ type: 'SET_Q7_PROBLEM_SOLVING', payload: style });
  }, []);

  const setQ7Structure = useCallback((structure: StructureTolerance) => {
    dispatch({ type: 'SET_Q7_STRUCTURE', payload: structure });
  }, []);

  const setQ8Structure = useCallback((structure: StructureTolerance) => {
    dispatch({ type: 'SET_Q8_STRUCTURE', payload: structure });
  }, []);

  const setQ8AcademicFriction = useCallback((friction: FrictionTolerance) => {
    dispatch({ type: 'SET_Q8_ACADEMIC_FRICTION', payload: friction });
  }, []);

  const setQ9WorkContext = useCallback((context: PracticalWorkContext) => {
    dispatch({ type: 'SET_Q9_WORK_CONTEXT', payload: context });
  }, []);

  const setQ9HorizonPriority = useCallback((priority: HorizonPriority) => {
    dispatch({ type: 'SET_Q9_HORIZON_PRIORITY', payload: priority });
  }, []);

  const setQ10AcademicFriction = useCallback((friction: FrictionTolerance) => {
    dispatch({ type: 'SET_Q10_ACADEMIC_FRICTION', payload: friction });
  }, []);

  const setAmbition = useCallback((ambition: AmbitionChoice) => {
    dispatch({ type: 'SET_AMBITION', payload: ambition });
  }, []);

  const setQ10Ambition = useCallback((ambition: AmbitionTimeline) => {
    dispatch({ type: 'SET_Q10_AMBITION', payload: ambition });
  }, []);

  const setQ11HorizonPriority = useCallback((priority: HorizonPriority) => {
    dispatch({ type: 'SET_Q11_HORIZON_PRIORITY', payload: priority });
  }, []);

  const setQ12Ambition = useCallback((ambition: AmbitionTimeline) => {
    dispatch({ type: 'SET_Q12_AMBITION', payload: ambition });
  }, []);

  const goToStep = useCallback((step: WizardStep) => {
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
      setProfile,
      setFullName,
      setGradeLevel,
      setStudentId,
      setNickname,
      toggleTask,
      toggleQ1Task,
      setSubject,
      setQ2Subject,
      setRationale,
      setQ3Track,
      setQ3Hesitation,
      setQ4Hesitation,
      setEnvironment,
      setQ4Environment,
      setQ5Environment,
      setQ5ProblemSolving,
      setQ6Collaboration,
      setQ6SocialEnergy,
      setQ7ProblemSolving,
      setQ7Structure,
      setQ8Structure,
      setQ8AcademicFriction,
      setQ9WorkContext,
      setQ9HorizonPriority,
      setQ10AcademicFriction,
      setAmbition,
      setQ10Ambition,
      setQ11HorizonPriority,
      setQ12Ambition,
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
      setProfile,
      setFullName,
      setGradeLevel,
      setStudentId,
      setNickname,
      toggleTask,
      toggleQ1Task,
      setSubject,
      setQ2Subject,
      setRationale,
      setQ3Track,
      setQ3Hesitation,
      setQ4Hesitation,
      setEnvironment,
      setQ4Environment,
      setQ5Environment,
      setQ5ProblemSolving,
      setQ6Collaboration,
      setQ6SocialEnergy,
      setQ7ProblemSolving,
      setQ7Structure,
      setQ8Structure,
      setQ8AcademicFriction,
      setQ9WorkContext,
      setQ9HorizonPriority,
      setQ10AcademicFriction,
      setAmbition,
      setQ10Ambition,
      setQ11HorizonPriority,
      setQ12Ambition,
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

export const WizardContext = IntakeContext;
export const WizardProvider = IntakeProvider;
