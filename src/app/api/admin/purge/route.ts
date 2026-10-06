import { NextResponse } from 'next/server';
import { getAdvisorSessionFromRequest } from '@/lib/auth';
import { executeAnnualPurge, getPrecedingJuly1Cutoff } from '@/lib/purge';
import { ADVISOR_COPY } from '@/content/advisorCopy';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Authorization check
  const adminKey = request.headers.get('x-admin-key');
  const expectedAdminSecret = process.env.ADMIN_SECRET;

  const isKeyAuthorized =
    Boolean(expectedAdminSecret) &&
    expectedAdminSecret?.trim() !== '' &&
    adminKey === expectedAdminSecret;

  const session = getAdvisorSessionFromRequest(request);
  const isSessionAuthorized = Boolean(session);

  if (!isKeyAuthorized && !isSessionAuthorized) {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail: 'Administrative authorization or valid advisor session required.',
      },
      { status: 401 }
    );
  }

  // 2. Parse payload and query parameters
  const url = new URL(request.url);
  const dryRunParam = url.searchParams.get('dryRun');

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional
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
    console.error('[PathLess Admin Purge] Execution failure:', error);
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/internal-error',
        title: 'Error Archiving Records',
        status: 500,
        detail: 'Unable to complete the annual archive at this time.',
      },
      { status: 500 }
    );
  }
}
