/**
 * PathLess Framework v2 - Centralized RFC 7807 Problem Details Responder
 * Guarantees zero information disclosure (no stack traces, database schema
 * names, or AI vendor details) and sources all copy from centralized dictionaries.
 */

import { NextResponse } from 'next/server';
import { ProblemDetails, ProblemErrorCode } from '@/types/api';
import { GUIDE_COPY } from '@/content/guideCopy';

export interface CreateProblemOptions {
  instance?: string;
  requestId?: string;
  invalidParams?: Array<{ name: string; reason: string }>;
  retryAfter?: number;
}

export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${randomStr}`;
}

export function createProblemResponse(
  status: number,
  code: ProblemErrorCode,
  customDetail?: string,
  options?: CreateProblemOptions
): NextResponse<ProblemDetails> {
  const requestId = options?.requestId || generateRequestId();
  const instance = options?.instance || '/api';

  const defaultCopy = (GUIDE_COPY.apiErrors as Record<string, { title: string; detail: string }>)[code] || {
    title: 'Notice',
    detail: 'An unexpected condition occurred. Please try again.',
  };

  const title = defaultCopy.title;
  const detail = customDetail || defaultCopy.detail;

  const headers: Record<string, string> = {
    'Content-Type': 'application/problem+json',
  };

  if (options?.retryAfter !== undefined && options.retryAfter > 0) {
    headers['Retry-After'] = String(options.retryAfter);
  }

  const problem: ProblemDetails = {
    type: `https://pathless.app/errors/${code.toLowerCase().replace(/_/g, '-')}`,
    title,
    status,
    detail,
    instance,
    code,
    requestId,
    ...(options?.invalidParams
      ? {
          invalidParams: options.invalidParams,
          errors: options.invalidParams,
        }
      : {}),
    ...(options?.retryAfter !== undefined && options.retryAfter > 0 ? { retryAfter: options.retryAfter } : {}),
  };

  return NextResponse.json(problem, { status, headers });
}

/**
 * Universal error boundary handler for server route catch blocks.
 * Redacts database schema names, stack traces, and vendor details.
 */
export function handleServerError(
  error: unknown,
  instance: string,
  requestId?: string
): NextResponse<ProblemDetails> {
  const reqId = requestId || generateRequestId();
  const errMsg = error instanceof Error ? error.message : String(error || '');

  // Log on server for diagnostics with zero customer-facing leakage
  console.error(`[PathLess Server Error] [${instance}] [${reqId}]:`, errMsg);

  if (errMsg.includes('timed out') || (error as any)?.name === 'TimeoutError') {
    return createProblemResponse(504, 'GATEWAY_TIMEOUT', undefined, {
      instance,
      requestId: reqId,
    });
  }

  return createProblemResponse(500, 'INTERNAL_ERROR', undefined, {
    instance,
    requestId: reqId,
  });
}
