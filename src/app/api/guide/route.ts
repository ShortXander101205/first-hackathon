import { NextResponse } from 'next/server';
import { submissionPayloadSchema } from '@/schemas/intake.schema';
import { generateGuideRecommendations, sanitizeError } from '@/lib/gemini';
import {
  guideRateLimiter,
  globalGuideRateLimiter,
  getClientIp,
  getClientRateLimitKey,
} from '@/lib/rateLimit';
import { checkRateLimit, recordRequest } from '@/lib/rateLimiter';
import { getMockCareerResults } from '@/data/mockCareerResults';
import { validateGuideSynthesisResult } from '@/lib/guideValidator';
import { SubmissionPayload } from '@/types/api';
import { GuideResult } from '@/types/career';
import { prisma } from '@/lib/prisma';
import { createProblemResponse, generateRequestId } from '@/lib/apiErrors';
import { addMockAdvisorSubmission, MockAdvisorSubmission } from '@/data/mockAdvisorSubmissions';

export const runtime = 'nodejs';

const MAX_PAYLOAD_BYTES = 10 * 1024; // 10 KB request size limit

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = generateRequestId();

  // 1. Guard: Content-Type verification
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return createProblemResponse(
      415,
      'UNSUPPORTED_MEDIA_TYPE',
      'The request format is unsupported. Please submit your responses as application/json.',
      { instance: '/api/guide', requestId }
    );
  }

  // 2. Guard: Content-Length payload size verification
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return createProblemResponse(
      413,
      'PAYLOAD_TOO_LARGE',
      'The submission payload was too large. Please shorten your response and try again.',
      { instance: '/api/guide', requestId }
    );
  }

  // 3. Rate Limiting Check (dual-tier sliding-window)
  const clientIp = getClientIp(request);
  const clientKey = getClientRateLimitKey(request, 'guide_synthesis');

  // Check per-IP burst limit (3 RPM)
  const burstStatus = checkRateLimit(clientIp);
  if (!burstStatus.allowed) {
    return createProblemResponse(
      429,
      'RATE_LIMITED',
      'PathLess is experiencing high demand right now. Please take a deep breath and try again in a few moments.',
      {
        instance: '/api/guide',
        requestId,
        retryAfter: burstStatus.retryAfterSeconds,
      }
    );
  }

  // Check global Gemini ceiling (14 RPM)
  const globalStatus = globalGuideRateLimiter.check('global');
  if (!globalStatus.allowed) {
    return createProblemResponse(
      429,
      'RATE_LIMITED',
      'PathLess is experiencing high demand right now. Please take a deep breath and try again in a few moments.',
      {
        instance: '/api/guide',
        requestId,
        retryAfter: globalStatus.retryAfterSeconds,
      }
    );
  }

  // Atomically check and consume client rate limit (5 req / 10-min window)
  const clientStatus = guideRateLimiter.consume(clientKey);
  if (!clientStatus.allowed) {
    return createProblemResponse(
      429,
      'RATE_LIMITED',
      'PathLess is experiencing high demand right now. Please take a deep breath and try again in a few moments.',
      {
        instance: '/api/guide',
        requestId,
        retryAfter: clientStatus.retryAfterSeconds,
      }
    );
  }

  // 4. Guard: Parse JSON body safely
  let rawBody: unknown;
  try {
    const rawText = await request.text();
    if (rawText.length > MAX_PAYLOAD_BYTES) {
      return createProblemResponse(
        413,
        'PAYLOAD_TOO_LARGE',
        'The submission payload was too large. Please shorten your response and try again.',
        { instance: '/api/guide', requestId }
      );
    }
    rawBody = JSON.parse(rawText);
  } catch {
    return createProblemResponse(
      400,
      'VALIDATION_FAILED',
      'We could not process your responses. Please verify that each question has been answered and try again. Specific errors: body: Invalid JSON syntax',
      {
        instance: '/api/guide',
        requestId,
        invalidParams: [{ name: 'body', reason: 'Invalid JSON syntax' }],
      }
    );
  }

  // 5. Guard: Zod request validation and sanitization
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
      'VALIDATION_FAILED',
      detailMessage,
      {
        instance: '/api/guide',
        requestId,
        invalidParams,
      }
    );
  }

  const payload: SubmissionPayload = validationResult.data as SubmissionPayload;

  // Helper to persist student submissions to PostgreSQL or in-memory fallback safely
  async function persistSubmissionSafely(
    submissionPayload: SubmissionPayload,
    guideResult: GuideResult
  ): Promise<string | null> {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const cutoffThisYear = new Date(Date.UTC(currentYear, 6, 1)); // July 1 UTC
    const academicYear = now.getTime() >= cutoffThisYear.getTime() ? currentYear : currentYear - 1;

    const cards = (guideResult.pathways || guideResult.careers || []) as any;

    const fallbackSubmissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const inMemoryRecord: MockAdvisorSubmission = {
      id: fallbackSubmissionId,
      fullName: submissionPayload.studentProfile.fullName.trim(),
      gradeLevel: submissionPayload.studentProfile.gradeLevel,
      studentId: submissionPayload.studentProfile.studentId?.trim() || null,
      academicYear,
      createdAt: now.toISOString(),
      intakeAnswers: submissionPayload.intakeAnswers as any,
      synthesisResult: {
        cards,
        summary: (guideResult.summary || {}) as any,
        meta: (guideResult.meta || {}) as any,
      },
      notes: [],
    };

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
      addMockAdvisorSubmission(inMemoryRecord);
      return inMemoryRecord.id;
    }

    try {
      const record = await prisma.studentSubmission.create({
        data: {
          fullName: submissionPayload.studentProfile.fullName.trim(),
          gradeLevel: submissionPayload.studentProfile.gradeLevel,
          studentId: submissionPayload.studentProfile.studentId?.trim() || null,
          academicYear,
          intakeResponse: {
            create: {
              answers: submissionPayload.intakeAnswers as any,
            },
          },
          synthesisResult: {
            create: {
              cards,
              summary: (guideResult.summary || {}) as any,
              meta: (guideResult.meta || {}) as any,
            },
          },
        },
      });

      inMemoryRecord.id = record.id;
      addMockAdvisorSubmission(inMemoryRecord);
      return record.id;
    } catch (error) {
      console.warn('[PathLess Persistence] Safe persistence fallback triggered:', error);
      addMockAdvisorSubmission(inMemoryRecord);
      return inMemoryRecord.id;
    }
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
    const fallbackResult = getMockCareerResults(payload);
    const submissionId = await persistSubmissionSafely(payload, fallbackResult);
    if (submissionId) {
      fallbackResult.submissionId = submissionId;
      fallbackResult.submission_id = submissionId;
    }
    recordRequest(clientIp);
    return NextResponse.json(fallbackResult, { status: 200 });
  }

  try {
    const synthesis = await generateGuideRecommendations(payload);
    globalGuideRateLimiter.record('global');

    // Validate synthesized result against the 48-entry catalog whitelist & 2 primary + 2 adjacent field spread
    const isValid = validateGuideSynthesisResult(synthesis.result);
    if (!isValid) {
      console.warn(
        '[PathLess Route] AI synthesis violated career catalog whitelist or 2+2 field spread. Falling back to curated mock data.'
      );
      const fallbackResult = getMockCareerResults(payload);
      const submissionId = await persistSubmissionSafely(payload, fallbackResult);
      if (submissionId) {
        fallbackResult.submissionId = submissionId;
        fallbackResult.submission_id = submissionId;
      }
      recordRequest(clientIp);
      return NextResponse.json(fallbackResult, { status: 200 });
    }

    const submissionId = await persistSubmissionSafely(payload, synthesis.result);
    if (submissionId) {
      synthesis.result.submissionId = submissionId;
      synthesis.result.submission_id = submissionId;
    }

    recordRequest(clientIp);
    return NextResponse.json(synthesis.result, { status: 200 });
  } catch (error: any) {
    const errMsg = String(error?.message || '');

    // Handle Upstream Timeout
    if (error?.name === 'TimeoutError' || errMsg.includes('timed out')) {
      return createProblemResponse(
        504,
        'GATEWAY_TIMEOUT',
        'Generating your pathways took a little longer than expected. Please try submitting again.',
        { instance: '/api/guide', requestId }
      );
    }

    const sanitizedError = sanitizeError(error);
    console.warn(
      '[PathLess Route] Upstream AI synthesis failed or unavailable. Falling back to curated sample data:',
      sanitizedError
    );

    const fallbackResult = getMockCareerResults(payload);
    const submissionId = await persistSubmissionSafely(payload, fallbackResult);
    if (submissionId) {
      fallbackResult.submissionId = submissionId;
      fallbackResult.submission_id = submissionId;
    }

    recordRequest(clientIp);
    return NextResponse.json(fallbackResult, { status: 200 });
  }
}
