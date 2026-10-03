/**
 * PathLess: College Major & Career Guide MVP
 * SQLite Database Entity & Row TypeScript Contracts
 */

import {
  AcademicFriction,
  GradeLevel,
  HorizonPriority,
  IntellectualEnergy,
  WorkContext,
} from './intake';
export type AdvisorStatus = 'PENDING' | 'REVIEWED' | 'DISCUSSED';
export type CounselorStatus = AdvisorStatus;

export interface StudentRow {
  id: string;
  full_name: string;
  email: string | null;
  grade_level: GradeLevel;
  school_name: string | null;
  created_at: string;
}

export interface IntakeSubmissionRow {
  id: string;
  student_id: string;
  q1_intellectual_energy: IntellectualEnergy;
  q2_work_context: WorkContext;
  q3_academic_friction: AcademicFriction;
  q4_horizon_priority: HorizonPriority;
  raw_responses_json: string;
  created_at: string;
}

export interface CareerRecommendationRow {
  id: string;
  submission_id: string;
  student_archetype: string;
  triage_narrative: string;
  recommendations_json: string;
  generation_latency_ms: number;
  gemini_model: string;
  created_at: string;
}

export interface CounselorReviewRow {
  id: string;
  submission_id: string;
  counselor_name: string;
  status: CounselorStatus;
  notes: string;
  flagged_friction: number; // 0 or 1 in SQLite
  updated_at: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: 'sqlite_connected' | 'sqlite_disconnected';
  gemini_mode: 'live' | 'mock-fallback';
  zero_cost_free_tier: boolean;
  rate_limit_rpm_ceiling: number;
  uptime_seconds: number;
}
