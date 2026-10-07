/**
 * PathLess: College Major and Career Discovery Guide v2
 * Student Intake & Questionnaire TypeScript Contracts
 */

export type GradeLevel =
  | 'grade_10'
  | 'grade_11'
  | 'grade_12'
  | 'college_freshman'
  | 'college_sophomore'
  | 'high_school_junior'
  | 'high_school_senior';

export interface StudentProfile {
  fullName: string;        // 1 to 100 characters, trimmed (Required)
  gradeLevel: GradeLevel;  // Required educational level
  studentId?: string;      // Optional opaque alphanumeric ID (e.g. "STU-99214")
}

export function getStudentFirstName(profile?: StudentProfile | { fullName?: string }): string {
  if (!profile || typeof profile.fullName !== 'string') return '';
  const trimmed = profile.fullName.trim();
  return trimmed.split(/\s+/)[0] || trimmed;
}

export type WorkEnvironment =
  | 'REMOTE_DIGITAL'
  | 'COLLABORATIVE_STUDIO'
  | 'ACTIVE_FIELD_LAB'
  | 'HEALTHCARE_COMMUNITY';

export type ProblemSolvingStyle =
  | 'SYSTEMATIC_LOGIC'
  | 'CREATIVE_EXPLORATION'
  | 'PEOPLE_RELATIONAL'
  | 'PRACTICAL_HANDS_ON';

export type SocialEnergyStyle =
  | 'INDEPENDENT_DEEP_FOCUS'
  | 'BALANCED_TEAM'
  | 'HIGH_CONTACT_PEOPLE';

export type StructureTolerance =
  | 'HIGH_STRUCTURE_CLEAR_RULES'
  | 'BALANCED_MILESTONES'
  | 'HIGH_AUTONOMY_AMBIGUITY';

export type FrictionTolerance =
  | 'ADVANCED_MATH'
  | 'PUBLIC_SPEAKING'
  | 'HEAVY_MEMORIZATION'
  | 'INTENSIVE_WRITING'
  | 'ISOLATED_THEORY';

export type HorizonPriority =
  | 'FINANCIAL_STABILITY'
  | 'PURPOSE_IMPACT'
  | 'CREATIVE_AUTONOMY'
  | 'INTELLECTUAL_DEPTH'
  | 'WORK_LIFE_BALANCE'
  | 'HIGH_EARNING_SECURITY';

export type AmbitionTimeline =
  | 'WORKFORCE_DIRECT'
  | 'GRADUATE_STUDY'
  | 'FLEXIBLE_ENTREPRENEURSHIP';

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

export type HighSchoolTrack =
  | 'SCIENCE_MATH'
  | 'ARTS_MATH'
  | 'ARTS_LANGUAGE'
  | 'VOCATIONAL_APPLIED'
  | 'TRACK_EXPLORING';

export type PracticalWorkContext =
  | 'DIGITAL_TECH_PRODUCTS'
  | 'HEALTH_WELLNESS_CARE'
  | 'ENTERPRISE_GROWTH'
  | 'CREATIVE_MEDIA_STORYTELLING'
  | 'PUBLIC_GOOD_COMMUNITY';

export type CollaborationStyle =
  | 'INDEPENDENT_DEEP_FOCUS'
  | 'BALANCED_TEAM'
  | 'HIGH_CONTACT_PEOPLE';

export type AcademicFriction =
  | 'HARD_MATH'
  | 'PUBLIC_SPEAKING'
  | 'HEAVY_MEMORIZATION'
  | 'ABSTRACT_WRITING'
  | 'ISOLATED_DESKWORK';

export interface IntakeAnswers {
  q1TaskIds: string[];                          // 1 to 2 task identifiers
  q2SubjectId: string;                          // Primary academic subject curiosity
  q3HighSchoolTrack?: HighSchoolTrack;          // High school study stream [NEW Q3]
  q4AcademicHesitation?: string;                // Brief thought on academic dread/worry (1-200 chars) [NEW Q4]
  q5Environment?: WorkEnvironment;              // Day-to-day physical setting preference [NEW Q5]
  q6CollaborationStyle?: CollaborationStyle;    // Daily social battery & collaboration style [NEW Q6]
  q7ProblemSolving?: ProblemSolvingStyle;       // Instinctive thinking modality [NEW Q7]
  q8StructureTolerance?: StructureTolerance;     // Comfort level with routine vs. ambiguity [NEW Q8]
  q9WorkContext?: PracticalWorkContext;         // Practical work context [NEW Q9]
  q10AcademicFriction?: FrictionTolerance;       // Specific academic pressure to minimize/manage [NEW Q10]
  q11HorizonPriority?: HorizonPriority;         // Core personal/career driver [NEW Q11]
  q12PostCollegeAmbition?: AmbitionTimeline;     // Immediate horizon after graduation [NEW Q12]

  // Legacy mappings for backwards compatibility:
  q3AcademicHesitation?: string;
  q4Environment?: WorkEnvironment;
  q5ProblemSolving?: ProblemSolvingStyle;
  q6SocialEnergy?: SocialEnergyStyle;
  q7StructureTolerance?: StructureTolerance;
  q8AcademicFriction?: FrictionTolerance;
  q9HorizonPriority?: HorizonPriority;
  q10PostCollegeAmbition?: AmbitionTimeline;
}

export type EnvironmentChoice = 'REMOTE_DESK' | 'ACTIVE_FIELD_LAB';
export type AmbitionChoice = 'WORKFORCE_DIRECT' | 'GRADUATE_STUDY';

export interface IntakeAnswersState {
  q1TaskIds: string[];
  q2SubjectId: string | null;
  q2Rationale: string;
  q3Environment: EnvironmentChoice | null;
  q4Ambition: AmbitionChoice | null;
  q3HighSchoolTrack?: HighSchoolTrack;
  q3AcademicHesitation?: string;
  q4AcademicHesitation?: string;
  q4Environment?: WorkEnvironment;
  q4EnvironmentChoice?: WorkEnvironment;
  q5Environment?: WorkEnvironment;
  q5ProblemSolving?: ProblemSolvingStyle;
  q6SocialEnergy?: SocialEnergyStyle;
  q6CollaborationStyle?: CollaborationStyle;
  q7ProblemSolving?: ProblemSolvingStyle;
  q7StructureTolerance?: StructureTolerance;
  q8StructureTolerance?: StructureTolerance;
  q8AcademicFriction?: FrictionTolerance;
  q9WorkContext?: PracticalWorkContext;
  q9HorizonPriority?: HorizonPriority;
  q10AcademicFriction?: FrictionTolerance;
  q10PostCollegeAmbition?: AmbitionTimeline;
  q11HorizonPriority?: HorizonPriority;
  q12PostCollegeAmbition?: AmbitionTimeline;
}

export interface IntakeValidationErrors {
  fullName?: string;
  gradeLevel?: string;
  studentId?: string;
  q1?: string;
  q2Subject?: string;
  q2Rationale?: string;
  q3?: string;
  q4?: string;
  q3Hesitation?: string;
  q3Track?: string;
  q4Environment?: string;
  q4Hesitation?: string;
  q5Environment?: string;
  q5ProblemSolving?: string;
  q6SocialEnergy?: string;
  q6Collaboration?: string;
  q7Structure?: string;
  q7ProblemSolving?: string;
  q8Friction?: string;
  q8Structure?: string;
  q9Priority?: string;
  q9WorkContext?: string;
  q10Ambition?: string;
  q10Friction?: string;
  q10AcademicFriction?: string;
  q11Priority?: string;
  q12Ambition?: string;
  general?: string;
}

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface IntakeState {
  currentStep: WizardStep;
  profile?: StudentProfile;
  answers: IntakeAnswersState;
  validationErrors: IntakeValidationErrors;
  isResetDialogOpen: boolean;
  isCompleted: boolean;
  isHydrated: boolean;
  studentNickname: string;
}

export interface IntakeStoredState {
  version: number;
  currentStep: WizardStep;
  profile?: StudentProfile;
  studentNickname: string;
  answers: IntakeAnswersState;
  timestamp: number;
}

export type IntakeAction =
  | { type: 'SET_PROFILE'; payload: Partial<StudentProfile> }
  | { type: 'SET_FULL_NAME'; payload: string }
  | { type: 'SET_GRADE_LEVEL'; payload: GradeLevel }
  | { type: 'SET_STUDENT_ID'; payload: string }
  | { type: 'SET_NICKNAME'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'TOGGLE_Q1_TASK'; payload: string }
  | { type: 'SET_SUBJECT'; payload: string }
  | { type: 'SET_Q2_SUBJECT'; payload: string }
  | { type: 'SET_RATIONALE'; payload: string }
  | { type: 'SET_Q3_TRACK'; payload: HighSchoolTrack }
  | { type: 'SET_Q3_HESITATION'; payload: string }
  | { type: 'SET_Q4_HESITATION'; payload: string }
  | { type: 'SET_ENVIRONMENT'; payload: EnvironmentChoice }
  | { type: 'SET_Q4_ENVIRONMENT'; payload: WorkEnvironment }
  | { type: 'SET_Q5_ENVIRONMENT'; payload: WorkEnvironment }
  | { type: 'SET_Q5_PROBLEM_SOLVING'; payload: ProblemSolvingStyle }
  | { type: 'SET_Q6_COLLABORATION'; payload: CollaborationStyle }
  | { type: 'SET_Q6_SOCIAL_ENERGY'; payload: SocialEnergyStyle }
  | { type: 'SET_Q7_PROBLEM_SOLVING'; payload: ProblemSolvingStyle }
  | { type: 'SET_Q7_STRUCTURE'; payload: StructureTolerance }
  | { type: 'SET_Q8_STRUCTURE'; payload: StructureTolerance }
  | { type: 'SET_Q8_ACADEMIC_FRICTION'; payload: FrictionTolerance }
  | { type: 'SET_Q9_WORK_CONTEXT'; payload: PracticalWorkContext }
  | { type: 'SET_Q9_HORIZON_PRIORITY'; payload: HorizonPriority }
  | { type: 'SET_Q10_ACADEMIC_FRICTION'; payload: FrictionTolerance }
  | { type: 'SET_AMBITION'; payload: AmbitionChoice }
  | { type: 'SET_Q10_AMBITION'; payload: AmbitionTimeline }
  | { type: 'SET_Q11_HORIZON_PRIORITY'; payload: HorizonPriority }
  | { type: 'SET_Q12_AMBITION'; payload: AmbitionTimeline }
  | { type: 'GO_TO_STEP'; payload: WizardStep }
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
  isStepValid: (step: WizardStep) => boolean;
  canAccessStep: (targetStep: WizardStep) => boolean;
  isCurrentStepValid: boolean;
  setProfile?: (profile: Partial<StudentProfile>) => void;
  setFullName?: (name: string) => void;
  setGradeLevel?: (grade: GradeLevel) => void;
  setStudentId?: (id: string) => void;
  setNickname: (nickname: string) => void;
  toggleTask: (taskId: string) => void;
  toggleQ1Task?: (taskId: string) => void;
  setSubject: (subjectId: string) => void;
  setQ2Subject?: (subjectId: string) => void;
  setRationale: (rationale: string) => void;
  setQ3Track?: (track: HighSchoolTrack) => void;
  setQ3Hesitation?: (hesitation: string) => void;
  setQ4Hesitation?: (hesitation: string) => void;
  setEnvironment: (env: EnvironmentChoice) => void;
  setQ4Environment?: (env: WorkEnvironment) => void;
  setQ5Environment?: (env: WorkEnvironment) => void;
  setQ5ProblemSolving?: (style: ProblemSolvingStyle) => void;
  setQ6Collaboration?: (collab: CollaborationStyle) => void;
  setQ6SocialEnergy?: (social: SocialEnergyStyle) => void;
  setQ7ProblemSolving?: (style: ProblemSolvingStyle) => void;
  setQ7Structure?: (structure: StructureTolerance) => void;
  setQ8Structure?: (structure: StructureTolerance) => void;
  setQ8AcademicFriction?: (friction: FrictionTolerance) => void;
  setQ9WorkContext?: (context: PracticalWorkContext) => void;
  setQ9HorizonPriority?: (priority: HorizonPriority) => void;
  setQ10AcademicFriction?: (friction: FrictionTolerance) => void;
  setAmbition: (ambition: AmbitionChoice) => void;
  setQ10Ambition?: (ambition: AmbitionTimeline) => void;
  setQ11HorizonPriority?: (priority: HorizonPriority) => void;
  setQ12Ambition?: (ambition: AmbitionTimeline) => void;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  openResetDialog: () => void;
  closeResetDialog: () => void;
  resetState: () => void;
}
