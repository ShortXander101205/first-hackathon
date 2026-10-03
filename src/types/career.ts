/**
 * PathLess: College Major and Career Discovery Guide v2
 * Recommendation Results & Career Pathway Contracts
 */

import { IntakeAnswers, StudentProfile } from './intake';

export type MatchTier =
  | 'Primary Direct Match'
  | 'High-Growth Pathway'
  | 'Interdisciplinary Pivot'
  | 'Moonshot Trajectory';

export interface TrialCourse {
  title: string;
  provider: string;
  description: string;
  estimatedHours?: number;
  estimated_hours: number;
}

export interface DayInTheLife {
  tasks: string[];
  misconceptions: string[];
}

export interface PathwayCard {
  id: string;
  role_title: string;
  roleTitle?: string;
  match_tier: MatchTier;
  matchTier?: MatchTier;
  fit_score: number;
  fitScore?: number;
  fit_rationale: string;
  fitRationale?: string;
  majors: string[];
  minors?: string[];
  daily_tasks?: string[];
  dailyTasks?: string[];
  day_in_the_life?: DayInTheLife;
  misconceptions?: string[];
  course_challenges: string;
  courseChallenges?: string;
  reassurance: string;
  trial_courses: [TrialCourse, TrialCourse];
  trialCourses?: [TrialCourse, TrialCourse];
}

export type CareerCard = PathwayCard;

export interface GuideSummary {
  student_archetype?: string;
  studentArchetype?: string;
  narrativeSummary?: string;
  narrative_summary?: string;
}

export interface GuideMeta {
  engine: string;
  generation_latency_ms?: number;
  generationLatencyMs?: number;
  fallback_used?: boolean;
  fallbackUsed?: boolean;
}

export interface GuideResult {
  success: boolean;
  submission_id?: string;
  submissionId?: string;
  studentProfile?: StudentProfile;
  summary: GuideSummary;
  pathways: PathwayCard[];
  meta: GuideMeta;
}

export interface AdvisorReview {
  id: string;
  submissionId: string;
  advisorName: string;
  status: 'PENDING' | 'REVIEWED' | 'DISCUSSED';
  notes: string;
  updatedAt: string;
}

export interface SubmissionDetailResponse {
  id: string;
  created_at: string;
  student: StudentProfile & { id: string };
  intake_answers: IntakeAnswers;
  recommendations: GuideResult;
  review?: AdvisorReview;
}
