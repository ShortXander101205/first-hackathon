import { NextResponse } from 'next/server';
import { getAdvisorLogoutCookieHeader } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(): Promise<NextResponse> {
  const cookieHeader = getAdvisorLogoutCookieHeader();

  const response = NextResponse.json(
    {
      success: true,
      message: 'Signed out successfully.',
    },
    { status: 200 }
  );

  response.headers.set('Set-Cookie', cookieHeader);
  return response;
}
