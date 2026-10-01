/**
 * PathwayAI: College Major & Career Triage MVP
 * Counselor Review & Triage Dashboard TypeScript Contracts
 */

import { AcademicFriction, GradeLevel } from './intake';

export type CounselorStatus =
  | 'pending_review'
  | 'reviewed'
  | 'follow_up_scheduled';

export interface CounselorReview {
  id: string;
  submission_id: string;
  counselor_name: string;
  status: CounselorStatus;
  notes: string;
  flagged_friction: boolean;
  updated_at: string;
}

export interface CounselorReviewUpdateRequest {
  status: CounselorStatus;
  notes: string;
  flagged_friction: boolean;
  counselor_name?: string;
}

export interface CounselorReviewUpdateResponse {
  success: boolean;
  submission_id: string;
  updated_review: CounselorReview;
}

export interface CounselorDashboardItem {
  id: string;
  student_name: string;
  grade_level: GradeLevel;
  created_at: string;
  top_career: string;
  academic_friction: AcademicFriction;
  status: CounselorStatus;
  flagged_friction: boolean;
  notes_preview: string;
}

export interface CounselorMetrics {
  total_submissions: number;
  pending_reviews: number;
  flagged_anxieties: number;
}

export interface CounselorDashboardResponse {
  metrics: CounselorMetrics;
  submissions: CounselorDashboardItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
