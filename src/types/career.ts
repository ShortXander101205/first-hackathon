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
  estimated_hours?: number;
  searchQuery?: string;
}

export interface DayInTheLife {
  tasks: string[];
  misconceptions: string[];
}

export interface PathwayCard {
  id: string;
  roleTitle?: string;
  role_title?: string;
  broadField?: string;
  broad_field?: string;
  matchTier?: MatchTier;
  match_tier?: MatchTier;
  fitScore?: number;
  fit_score?: number;
  overview?: string; // 1 sentence <= 30 words
  fitRationale?: string;
  fit_rationale?: string;
  dailyTasks?: string[]; // 3-4 concrete tasks
  daily_tasks?: string[];
  day_in_the_life?: DayInTheLife;
  studyPath?: string; // Foundational study topics <= 65 words
  courseChallenges?: string;
  course_challenges?: string;
  reassurance: string; // Academic friction mitigation <= 65 words
  majors: string[];
  minors?: string[];
  trialCourses?: [TrialCourse, TrialCourse];
  trial_courses?: [TrialCourse, TrialCourse];
  whereToStudyReady?: boolean;
}

export type CareerCard = PathwayCard;

export interface GuideSummary {
  studentArchetype?: string;
  student_archetype?: string;
  narrativeSummary?: string;
  narrative_summary?: string;
  triage_narrative?: string;
}

export interface GuideMeta {
  engine: string;
  generationLatencyMs?: number;
  generation_latency_ms?: number;
  fallbackUsed?: boolean;
  fallback_used?: boolean;
}

export interface GuideResult {
  success: boolean;
  submissionId?: string;
  submission_id?: string;
  studentProfile?: StudentProfile;
  summary: GuideSummary;
  pathways: PathwayCard[];
  careers?: PathwayCard[];
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
