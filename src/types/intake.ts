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
