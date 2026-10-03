import { NextResponse } from 'next/server';
import { triageRequestSchema } from '@/schemas/triage.schema';
import { generateTriageRecommendations } from '@/lib/gemini';
import { checkRateLimit, recordRequest } from '@/lib/rateLimiter';
import { getMockTriageRecommendations } from '@/lib/ai/mockFallback';
import { INTAKE_COPY } from '@/constants/intakeCopy';
import { ProblemDetails, ProblemErrorCode } from '@/types/api';

export const runtime = 'nodejs';

const MAX_PAYLOAD_BYTES = 10 * 1024; // 10 KB request size limit

function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${randomStr}`;
}

function createProblemResponse(
  status: number,
  title: string,
  code: ProblemErrorCode,
  detail: string,
  requestId: string,
  options?: {
    invalidParams?: Array<{ name: string; reason: string }>;
    retryAfter?: number;
  }
): NextResponse<ProblemDetails> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/problem+json',
  };

  if (options?.retryAfter) {
    headers['Retry-After'] = String(options.retryAfter);
  }

  const problem: ProblemDetails = {
    type: `https://pathwayai.app/errors/${code.toLowerCase().replace(/_/g, '-')}`,
    title,
    status,
    detail,
    instance: '/api/triage',
    code,
    requestId,
    ...(options?.invalidParams
      ? {
          invalidParams: options.invalidParams,
          errors: options.invalidParams,
        }
      : {}),
    ...(options?.retryAfter ? { retryAfter: options.retryAfter } : {}),
  };

  return NextResponse.json(problem, { status, headers });
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = generateRequestId();

  // 1. Guard: Content-Type verification
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return createProblemResponse(
      415,
      'Unsupported Media Type',
      'UNSUPPORTED_MEDIA_TYPE',
      INTAKE_COPY.serverErrors.unsupportedMediaType,
      requestId
    );
  }

  // 2. Guard: Content-Length payload size verification
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return createProblemResponse(
      413,
      'Payload Too Large',
      'PAYLOAD_TOO_LARGE',
      INTAKE_COPY.serverErrors.payloadTooLarge,
      requestId
    );
  }

  // 3. Guard: Parse JSON body safely
  let rawBody: unknown;
  try {
    const rawText = await request.text();
    if (rawText.length > MAX_PAYLOAD_BYTES) {
      return createProblemResponse(
        413,
        'Payload Too Large',
        'PAYLOAD_TOO_LARGE',
        INTAKE_COPY.serverErrors.payloadTooLarge,
        requestId
      );
    }
    rawBody = JSON.parse(rawText);
  } catch {
    return createProblemResponse(
      400,
      'Bad Request',
      'VALIDATION_FAILED',
      `${INTAKE_COPY.serverErrors.validationFailed} Specific errors: body: Invalid JSON syntax`,
      requestId,
      {
        invalidParams: [{ name: 'body', reason: 'Invalid JSON syntax' }],
      }
    );
  }

  // 4. Guard: Zod request validation
  const validationResult = triageRequestSchema.safeParse(rawBody);
  if (!validationResult.success) {
    const invalidParams = validationResult.error.issues.map((issue) => ({
      name: issue.path.join('.'),
      reason: issue.message,
    }));

    const fieldErrorsSummary = invalidParams
      .map((p) => `${p.name}: ${p.reason}`)
      .join('; ');

    const detailMessage = fieldErrorsSummary
      ? `${INTAKE_COPY.serverErrors.validationFailed} Specific errors: ${fieldErrorsSummary}`
      : INTAKE_COPY.serverErrors.validationFailed;

    return createProblemResponse(
      400,
      'Bad Request',
      'VALIDATION_FAILED',
      detailMessage,
      requestId,
      { invalidParams }
    );
  }

  const { answers, studentNickname } = validationResult.data;

  // 5. Rate Limiting Check
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateStatus = checkRateLimit(clientIp);
  if (!rateStatus.allowed) {
    return createProblemResponse(
      429,
      'Too Many Requests',
      'RATE_LIMITED',
      INTAKE_COPY.serverErrors.rateLimited,
      requestId,
      { retryAfter: rateStatus.retryAfterSeconds }
    );
  }

  // 6. AI Synthesis Execution
  const apiKey = process.env.GEMINI_API_KEY;

  // If API key is omitted or placeholder in local or demo environments, activate curated mock fallback
  if (
    !apiKey ||
    apiKey.trim() === '' ||
    apiKey === 'dummy' ||
    apiKey === 'test' ||
    apiKey === 'your_gemini_api_key_here'
  ) {
    const fallbackResult = getMockTriageRecommendations(answers, studentNickname);
    return NextResponse.json({
      success: true,
      summary: fallbackResult.summary,
      careers: fallbackResult.careers,
      meta: {
        engine: 'curated-mock-fallback',
        generation_latency_ms: 120,
        fallback_used: true,
      },
    });
  }

  try {
    const synthesis = await generateTriageRecommendations(answers, studentNickname);
    recordRequest(clientIp);

    return NextResponse.json({
      success: true,
      summary: synthesis.result.summary,
      careers: synthesis.result.careers,
      meta: {
        engine: synthesis.engine,
        generation_latency_ms: synthesis.latencyMs,
        fallback_used: false,
      },
    });
  } catch (error: any) {
    const errMsg = String(error?.message || '');

    // Handle Upstream Timeout
    if (error?.name === 'TimeoutError' || errMsg.includes('timed out')) {
      return createProblemResponse(
        504,
        'Gateway Timeout',
        'GATEWAY_TIMEOUT',
        INTAKE_COPY.serverErrors.timeout,
        requestId
      );
    }

    // Handle Upstream Rate Limiting (429)
    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      return createProblemResponse(
        429,
        'Too Many Requests',
        'RATE_LIMITED',
        INTAKE_COPY.serverErrors.rateLimited,
        requestId,
        { retryAfter: 60 }
      );
    }

    // Unexpected internal AI failure (mask all vendor stack traces and secrets)
    return createProblemResponse(
      500,
      'Internal Server Error',
      'AI_SYNTHESIS_FAILED',
      INTAKE_COPY.serverErrors.serviceUnavailable,
      requestId
    );
  }
}
