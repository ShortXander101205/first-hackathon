/**
 * PathLess: College Major and Career Discovery Guide v2
 * API & Problem Details TypeScript Contracts
 * RFC 7807 compliant Problem Details and Guide Route Interfaces
 */

import { IntakeAnswers, StudentProfile } from './intake';
import { GuideResult } from './career';

export type ProblemErrorCode =
  | 'VALIDATION_FAILED'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'RATE_LIMITED'
  | 'AI_SYNTHESIS_FAILED'
  | 'GATEWAY_TIMEOUT';

/**
 * Standard RFC 7807 Problem Details representation.
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: ProblemErrorCode;
  requestId: string;
  invalidParams?: Array<{
    name: string;
    reason: string;
  }>;
  errors?: Array<{
    name: string;
    reason: string;
  }>;
  retryAfter?: number;
}

export interface SubmissionPayload {
  studentProfile: StudentProfile;
  intakeAnswers: IntakeAnswers;
  metadata?: {
    clientTimestamp: string;
    schemaVersion: number;
  };
}

export type GuideApiResponse = GuideResult | ProblemDetails;
