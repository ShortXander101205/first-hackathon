/**
 * PathwayAI: API & Problem Details TypeScript Contracts
 * RFC 7807 compliant Problem Details and Triage Route Interfaces
 */

import { IntakeAnswersState } from './intake';
import { CareerCard, TriageSummary, TriageGenerationMeta } from './career';

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

export interface TriageRequestBody {
  answers: IntakeAnswersState;
  studentNickname?: string;
}

export interface TriageSuccessResponse {
  success: true;
  summary: TriageSummary;
  careers: [CareerCard, CareerCard, CareerCard, CareerCard];
  meta: TriageGenerationMeta;
}

export type TriageApiResponse = TriageSuccessResponse | ProblemDetails;
