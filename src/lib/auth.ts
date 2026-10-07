import crypto from 'node:crypto';

export interface AdvisorSessionPayload {
  role: 'advisor';
  authorName: string;
  iat: number;
  exp: number;
}

export const ADVISOR_COOKIE_NAME = 'pathless_advisor_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Process-lifetime ephemeral secret to prevent token forgery when no env vars are defined
const globalForSecret = globalThis as unknown as {
  __ephemeralSecret?: string;
};

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim() !== '') {
    return process.env.SESSION_SECRET.trim();
  }
  if (process.env.ADVISOR_PASSCODE && process.env.ADVISOR_PASSCODE.trim() !== '') {
    return process.env.ADVISOR_PASSCODE.trim();
  }
  if (!globalForSecret.__ephemeralSecret) {
    globalForSecret.__ephemeralSecret = crypto.randomBytes(32).toString('hex');
  }
  return globalForSecret.__ephemeralSecret;
}

/**
 * Validates a candidate passcode against the configured advisor passcode.
 * Uses timingSafeEqual over SHA-256 digests to prevent timing attacks.
 */
export function verifyAdvisorPasscode(candidate: string): boolean {
  if (typeof candidate !== 'string' || candidate.trim() === '') {
    return false;
  }

  const expected = (process.env.ADVISOR_PASSCODE && process.env.ADVISOR_PASSCODE.trim() !== '')
    ? process.env.ADVISOR_PASSCODE.trim()
    : 'TEACHER2026';

  const candidateHash = crypto.createHash('sha256').update(candidate.trim()).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();

  return crypto.timingSafeEqual(candidateHash, expectedHash);
}

/**
 * Generates an HMAC-SHA256 signed session token for an authenticated advisor.
 * Token format: base64Url(payload).base64Url(signature)
 */
export function createAdvisorSessionToken(authorName?: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdvisorSessionPayload = {
    role: 'advisor',
    authorName: (authorName && authorName.trim() !== '') ? authorName.trim() : 'Advisor',
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };

  const payloadStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadStr, 'utf8').toString('base64url');

  const secret = getSessionSecret();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(base64Payload)
    .digest('base64url');

  return `${base64Payload}.${signature}`;
}

/**
 * Validates and decodes a signed session token.
 * Returns the session payload if signature and expiration are valid, null otherwise.
 */
export function verifyAdvisorSessionToken(token: string): AdvisorSessionPayload | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [base64Payload, signature] = parts;
  if (!base64Payload || !signature) {
    return null;
  }

  const secret = getSessionSecret();
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(base64Payload)
    .digest('base64url');

  try {
    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return null;
    }

    const payloadJson = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const payload: AdvisorSessionPayload = JSON.parse(payloadJson);

    if (payload.role !== 'advisor') {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the advisor session from an incoming HTTP Request.
 */
export function getAdvisorSessionFromRequest(request: Request): AdvisorSessionPayload | null {
  const cookieHeader = request.headers.get('cookie') || '';
  if (!cookieHeader) {
    return null;
  }

  // Parse cookies
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const prefix = `${ADVISOR_COOKIE_NAME}=`;
  const sessionCookie = cookies.find((c) => c.startsWith(prefix));

  if (!sessionCookie) {
    return null;
  }

  const token = sessionCookie.substring(prefix.length);
  return verifyAdvisorSessionToken(token);
}

/**
 * Builds the Set-Cookie string for a logged-in advisor session.
 */
export function getAdvisorCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${ADVISOR_COOKIE_NAME}=${token}`,
    'Path=/',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (isProd) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

/**
 * Builds the Set-Cookie string to invalidate and log out an advisor session.
 */
export function getAdvisorLogoutCookieHeader(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${ADVISOR_COOKIE_NAME}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (isProd) {
    parts.push('Secure');
  }
  return parts.join('; ');
}
