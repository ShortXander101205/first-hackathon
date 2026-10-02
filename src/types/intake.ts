/**
 * PathwayAI: College Major & Career Triage MVP
 * Student Intake & Questionnaire TypeScript Contracts
 */

export type GradeLevel =
  | 'high_school_junior'
  | 'high_school_senior'
  | 'college_freshman'
  | 'college_sophomore';

export type IntellectualEnergy =
  | 'BUILD_SYSTEMS'
  | 'ANALYZE_PATTERNS'
  | 'HELP_HUMANS'
  | 'CREATE_EXPRESS'
  | 'LEAD_ORGANIZING';

export type WorkContext =
  | 'TECH_INNOVATION'
  | 'HEALTH_BIO'
  | 'BUSINESS_FINANCE'
  | 'SOCIAL_CIVIC'
  | 'MEDIA_CULTURE';

export type AcademicFriction =
  | 'HARD_MATH'
  | 'PUBLIC_SPEAKING'
  | 'HEAVY_MEMORIZATION'
  | 'ABSTRACT_WRITING'
  | 'ISOLATED_DESKWORK';

export type HorizonPriority =
  | 'HIGH_EARNING_SECURITY'
  | 'PURPOSE_IMPACT'
  | 'CREATIVE_AUTONOMY'
  | 'INTELLECTUAL_DEPTH'
  | 'WORK_LIFE_BALANCE';

export interface StudentInfo {
  full_name: string;
  email?: string;
  grade_level: GradeLevel;
  school_name?: string;
}

export interface IntakeAnswers {
  q1_intellectual_energy: IntellectualEnergy;
  q2_work_context: WorkContext;
  q3_academic_friction: AcademicFriction;
  q4_horizon_priority: HorizonPriority;
}

export interface IntakeSubmissionRequest {
  student_info: StudentInfo;
  answers: IntakeAnswers;
}

// ==========================================
// Feature 4: Intake State Machine Contracts
// ==========================================

export type EnvironmentChoice = 'REMOTE_DESK' | 'ACTIVE_FIELD_LAB';
export type AmbitionChoice = 'WORKFORCE_DIRECT' | 'GRADUATE_STUDY';

export interface IntakeAnswersState {
  q1TaskIds: string[];
  q2SubjectId: string | null;
  q2Rationale: string;
  q3Environment: EnvironmentChoice | null;
  q4Ambition: AmbitionChoice | null;
}

export interface IntakeValidationErrors {
  q1?: string;
  q2Subject?: string;
  q2Rationale?: string;
  q3?: string;
  q4?: string;
  general?: string;
}

export interface IntakeState {
  currentStep: 1 | 2 | 3 | 4;
  studentNickname: string;
  answers: IntakeAnswersState;
  validationErrors: IntakeValidationErrors;
  isResetDialogOpen: boolean;
  isCompleted: boolean;
  isHydrated: boolean;
}

export interface IntakeStoredState {
  version: number;
  currentStep: 1 | 2 | 3 | 4;
  studentNickname: string;
  answers: IntakeAnswersState;
  timestamp: number;
}

export type IntakeAction =
  | { type: 'SET_NICKNAME'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_SUBJECT'; payload: string }
  | { type: 'SET_RATIONALE'; payload: string }
  | { type: 'SET_ENVIRONMENT'; payload: EnvironmentChoice }
  | { type: 'SET_AMBITION'; payload: AmbitionChoice }
  | { type: 'GO_TO_STEP'; payload: 1 | 2 | 3 | 4 }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'OPEN_RESET_DIALOG' }
  | { type: 'CLOSE_RESET_DIALOG' }
  | { type: 'RESET_STATE' }
  | { type: 'HYDRATE_STATE'; payload: Partial<IntakeState> }
  | { type: 'SET_HYDRATED' };

export interface IntakeContextValue {
  state: IntakeState;
  dispatch: React.Dispatch<IntakeAction>;
  isStepValid: (step: 1 | 2 | 3 | 4) => boolean;
  canAccessStep: (targetStep: 1 | 2 | 3 | 4) => boolean;
  isCurrentStepValid: boolean;
  setNickname: (nickname: string) => void;
  toggleTask: (taskId: string) => void;
  setSubject: (subjectId: string) => void;
  setRationale: (rationale: string) => void;
  setEnvironment: (env: EnvironmentChoice) => void;
  setAmbition: (ambition: AmbitionChoice) => void;
  goToStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  previousStep: () => void;
  openResetDialog: () => void;
  closeResetDialog: () => void;
  resetState: () => void;
}

