import { NextResponse } from 'next/server';
import {
  verifyAdvisorPasscode,
  createAdvisorSessionToken,
  getAdvisorCookieHeader,
} from '@/lib/auth';
import { ADVISOR_COPY } from '@/content/advisorCopy';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/validation-failed',
        title: 'Bad Request',
        status: 400,
        detail: 'Invalid request format. Expected JSON.',
      },
      { status: 400 }
    );
  }

  const { passcode, authorName } = (body as { passcode?: string; authorName?: string }) || {};

  if (!passcode || typeof passcode !== 'string' || !verifyAdvisorPasscode(passcode)) {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/unauthorized',
        title: 'Advisor Authentication Required',
        status: 401,
        detail: ADVISOR_COPY.login.errorMessage,
      },
      { status: 401 }
    );
  }

  const token = createAdvisorSessionToken(authorName);
  const cookieHeader = getAdvisorCookieHeader(token);

  const response = NextResponse.json(
    {
      success: true,
      authorName: (authorName && authorName.trim() !== '') ? authorName.trim() : 'Advisor',
    },
    { status: 200 }
  );

  response.headers.set('Set-Cookie', cookieHeader);
  return response;
}
