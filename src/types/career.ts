/**
 * PathwayAI: College Major & Career Triage MVP
 * 4-Career Recommendation Dossier & Trial Course Contracts
 */

export type MatchTier =
  | 'Primary Direct Match'
  | 'High-Growth Pathway'
  | 'Interdisciplinary Pivot'
  | 'Moonshot Trajectory';

export interface TrialCourse {
  title: string;
  provider: string;
  description: string;
  estimated_hours: number;
}

export interface CareerCard {
  id: string;
  role_title: string;
  match_tier: MatchTier;
  fit_score: number;
  fit_rationale: string;
  majors: string[];
  daily_tasks: string[];
  course_challenges: string;
  reassurance: string;
  trial_courses: [TrialCourse, TrialCourse];
}

export interface TriageSummary {
  student_archetype: string;
  triage_narrative: string;
}

export interface TriageResult {
  summary: TriageSummary;
  careers: [CareerCard, CareerCard, CareerCard, CareerCard];
}

export interface TriageGenerationMeta {
  engine: string;
  generation_latency_ms: number;
  fallback_used: boolean;
}

export interface IntakeSubmissionResponse {
  success: boolean;
  submission_id: string;
  student: {
    id: string;
    full_name: string;
    grade_level: string;
  };
  summary: TriageSummary;
  careers: [CareerCard, CareerCard, CareerCard, CareerCard];
  meta: TriageGenerationMeta;
}
