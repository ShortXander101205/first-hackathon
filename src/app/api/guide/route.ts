import { NextResponse } from 'next/server';
import { submissionPayloadSchema } from '@/schemas/intake.schema';
import { generateGuideRecommendations } from '@/lib/gemini';
import { checkRateLimit, recordRequest } from '@/lib/rateLimiter';
import { getMockGuideRecommendations } from '@/lib/ai/mockFallback';
import { ProblemDetails, ProblemErrorCode, SubmissionPayload } from '@/types/api';

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
    type: `https://pathless.app/errors/${code.toLowerCase().replace(/_/g, '-')}`,
    title,
    status,
    detail,
    instance: '/api/guide',
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
      'The request format is unsupported. Please submit your responses as application/json.',
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
      'The submission payload was too large. Please shorten your response and try again.',
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
        'The submission payload was too large. Please shorten your response and try again.',
        requestId
      );
    }
    rawBody = JSON.parse(rawText);
  } catch {
    return createProblemResponse(
      400,
      'Bad Request',
      'VALIDATION_FAILED',
      'We could not process your responses. Please verify that each question has been answered and try again. Specific errors: body: Invalid JSON syntax',
      requestId,
      {
        invalidParams: [{ name: 'body', reason: 'Invalid JSON syntax' }],
      }
    );
  }

  // 4. Guard: Zod request validation
  const validationResult = submissionPayloadSchema.safeParse(rawBody);
  if (!validationResult.success) {
    const invalidParams = validationResult.error.issues.map((issue) => ({
      name: issue.path.join('.'),
      reason: issue.message,
    }));

    const fieldErrorsSummary = invalidParams
      .map((p) => `${p.name}: ${p.reason}`)
      .join('; ');

    const detailMessage = fieldErrorsSummary
      ? `We could not process your responses. Please verify that each question has been answered and try again. Specific errors: ${fieldErrorsSummary}`
      : 'We could not process your responses. Please verify that each question has been answered and try again.';

    return createProblemResponse(
      400,
      'Bad Request',
      'VALIDATION_FAILED',
      detailMessage,
      requestId,
      { invalidParams }
    );
  }

  const payload: SubmissionPayload = validationResult.data as SubmissionPayload;

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
      'PathLess is experiencing high demand right now. Please take a deep breath and try again in a few moments.',
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
    const fallbackResult = getMockGuideRecommendations(payload);
    return NextResponse.json(fallbackResult, { status: 200 });
  }

  try {
    const synthesis = await generateGuideRecommendations(payload);
    recordRequest(clientIp);

    return NextResponse.json(synthesis.result, { status: 200 });
  } catch (error: any) {
    const errMsg = String(error?.message || '');

    // Handle Upstream Timeout
    if (error?.name === 'TimeoutError' || errMsg.includes('timed out')) {
      return createProblemResponse(
        504,
        'Gateway Timeout',
        'GATEWAY_TIMEOUT',
        'Generating your pathways took a little longer than expected. Please try submitting again.',
        requestId
      );
    }

    // Handle Upstream Rate Limiting (429)
    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      return createProblemResponse(
        429,
        'Too Many Requests',
        'RATE_LIMITED',
        'PathLess is experiencing high demand right now. Please take a deep breath and try again in a few moments.',
        requestId,
        { retryAfter: 60 }
      );
    }

    // Unexpected internal AI failure (mask all vendor stack traces and secrets)
    return createProblemResponse(
      500,
      'Internal Server Error',
      'AI_SYNTHESIS_FAILED',
      'Our pathway discovery service is taking a brief moment to recharge. Your answers are safe—please try submitting again shortly.',
      requestId
    );
  }
}
