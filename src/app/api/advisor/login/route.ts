import { NextResponse } from 'next/server';
import {
  verifyAdvisorPasscode,
  createAdvisorSessionToken,
  getAdvisorCookieHeader,
} from '@/lib/auth';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { advisorLoginRateLimiter, getClientIp } from '@/lib/rateLimit';
import { sanitizeString } from '@/lib/sanitize';
import { createProblemResponse, generateRequestId } from '@/lib/apiErrors';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = generateRequestId();
  const clientIp = getClientIp(request);

  // 1. Rate Limiting: Max 5 attempts per 1-minute window
  const rateStatus = advisorLoginRateLimiter.consume(clientIp);
  if (!rateStatus.allowed) {
    return createProblemResponse(
      429,
      'RATE_LIMITED',
      ADVISOR_COPY.security.rateLimitedMessage,
      {
        instance: '/api/advisor/login',
        requestId,
        retryAfter: rateStatus.retryAfterSeconds,
      }
    );
  }

  // 2. Parse request body safely
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createProblemResponse(
      400,
      'VALIDATION_FAILED',
      'Invalid request format. Expected JSON.',
      { instance: '/api/advisor/login', requestId }
    );
  }

  const { passcode, authorName } = (body as { passcode?: string; authorName?: string }) || {};

  // 3. Verify Passcode with Constant-Time Authentication
  if (!passcode || typeof passcode !== 'string' || !verifyAdvisorPasscode(passcode)) {
    return createProblemResponse(
      401,
      'UNAUTHORIZED',
      ADVISOR_COPY.login.errorMessage,
      { instance: '/api/advisor/login', requestId }
    );
  }

  // 4. Sanitize author name
  const sanitizedAuthor = sanitizeString(authorName);
  const finalAuthor = sanitizedAuthor && sanitizedAuthor.trim() !== '' ? sanitizedAuthor.trim() : 'Advisor';

  const token = createAdvisorSessionToken(finalAuthor);
  const cookieHeader = getAdvisorCookieHeader(token);

  const response = NextResponse.json(
    {
      success: true,
      authorName: finalAuthor,
    },
    { status: 200 }
  );

  response.headers.set('Set-Cookie', cookieHeader);
  return response;
}
