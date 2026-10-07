import { NextResponse } from 'next/server';
import { getAdvisorSessionFromRequest } from '@/lib/auth';
import { executeAnnualPurge } from '@/lib/purge';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { adminPurgeRateLimiter, getClientIp } from '@/lib/rateLimit';
import { createProblemResponse, handleServerError, generateRequestId } from '@/lib/apiErrors';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = generateRequestId();
  const clientIp = getClientIp(request);

  // 1. Rate Limiting Check (5 req / 1 min)
  const rateStatus = adminPurgeRateLimiter.consume(clientIp);
  if (!rateStatus.allowed) {
    return createProblemResponse(
      429,
      'RATE_LIMITED',
      'Annual archive requests are throttled. Please wait a moment before trying again.',
      {
        instance: '/api/admin/purge',
        requestId,
        retryAfter: rateStatus.retryAfterSeconds,
      }
    );
  }

  // 2. Authorization check
  const adminKey = request.headers.get('x-admin-key');
  const expectedAdminSecret = process.env.ADMIN_SECRET;

  const isKeyAuthorized =
    Boolean(expectedAdminSecret) &&
    expectedAdminSecret?.trim() !== '' &&
    adminKey === expectedAdminSecret;

  const session = getAdvisorSessionFromRequest(request);
  const isSessionAuthorized = Boolean(session);

  if (!isKeyAuthorized && !isSessionAuthorized) {
    return createProblemResponse(
      401,
      'UNAUTHORIZED',
      'Administrative authorization or valid advisor session required.',
      { instance: '/api/admin/purge', requestId }
    );
  }

  // 3. Parse payload and query parameters safely
  const url = new URL(request.url);
  const dryRunParam = url.searchParams.get('dryRun');

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional for purge endpoint
  }

  const dryRun =
    dryRunParam === 'true' ||
    body.dryRun === true ||
    (dryRunParam !== 'false' && body.confirmPurge !== true);

  try {
    const result = await executeAnnualPurge({ dryRun });
    const formattedDate = result.cutoffDate.toISOString().split('T')[0];

    return NextResponse.json(
      {
        success: true,
        dryRun: result.dryRun,
        purgedCount: result.purgedCount,
        cutoffDate: result.cutoffDate.toISOString(),
        message: ADVISOR_COPY.purgeNotice.statusMessage(result.purgedCount, formattedDate),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return handleServerError(error, '/api/admin/purge', requestId);
  }
}
