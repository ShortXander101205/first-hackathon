import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyAdvisorPasscode,
  createAdvisorSessionToken,
  verifyAdvisorSessionToken,
  getAdvisorSessionFromRequest,
  getAdvisorCookieHeader,
  getAdvisorLogoutCookieHeader,
  ADVISOR_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth';

describe('Feature 10: Advisor Auth & Session Unit Tests', () => {
  const originalPasscode = process.env.ADVISOR_PASSCODE;
  const originalSecret = process.env.SESSION_SECRET;

  beforeEach(() => {
    delete process.env.ADVISOR_PASSCODE;
    delete process.env.SESSION_SECRET;
  });

  afterEach(() => {
    if (originalPasscode !== undefined) {
      process.env.ADVISOR_PASSCODE = originalPasscode;
    } else {
      delete process.env.ADVISOR_PASSCODE;
    }

    if (originalSecret !== undefined) {
      process.env.SESSION_SECRET = originalSecret;
    } else {
      delete process.env.SESSION_SECRET;
    }
  });

  it('UT-AUTH-01: validates default TEACHER2026 and custom ADVISOR_PASSCODE', () => {
    // Default passcode
    assert.equal(verifyAdvisorPasscode('TEACHER2026'), true);
    assert.equal(verifyAdvisorPasscode('  TEACHER2026  '), true);
    assert.equal(verifyAdvisorPasscode('WRONG_CODE'), false);

    // Custom passcode
    process.env.ADVISOR_PASSCODE = 'SCHOOL_ADVISOR_99';
    assert.equal(verifyAdvisorPasscode('SCHOOL_ADVISOR_99'), true);
    assert.equal(verifyAdvisorPasscode('TEACHER2026'), false);
  });

  it('UT-AUTH-02: rejects empty, whitespace, and nullish passcodes safely', () => {
    assert.equal(verifyAdvisorPasscode(''), false);
    assert.equal(verifyAdvisorPasscode('    '), false);
    assert.equal(verifyAdvisorPasscode(null as any), false);
    assert.equal(verifyAdvisorPasscode(undefined as any), false);
  });

  it('UT-AUTH-03: creates and verifies HMAC-SHA256 signed session token', () => {
    const token = createAdvisorSessionToken('Kru Somchai');
    assert.ok(token);
    assert.ok(token.includes('.'));

    const payload = verifyAdvisorSessionToken(token);
    assert.ok(payload);
    assert.equal(payload.role, 'advisor');
    assert.equal(payload.authorName, 'Kru Somchai');
    assert.ok(payload.exp > Math.floor(Date.now() / 1000));
    assert.equal(payload.exp - payload.iat, SESSION_MAX_AGE_SECONDS);
  });

  it('UT-AUTH-04: defaults authorName to "Advisor" when omitted', () => {
    const token = createAdvisorSessionToken();
    const payload = verifyAdvisorSessionToken(token);
    assert.ok(payload);
    assert.equal(payload.authorName, 'Advisor');
  });

  it('UT-AUTH-05: rejects tampered tokens (modified payload or modified signature)', () => {
    const token = createAdvisorSessionToken('Ms. Davis');
    const [payloadB64, sig] = token.split('.');

    // Tamper with payload
    const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    decoded.authorName = 'Hacker';
    const tamperedPayloadB64 = Buffer.from(JSON.stringify(decoded)).toString('base64url');
    const tamperedToken1 = `${tamperedPayloadB64}.${sig}`;
    assert.equal(verifyAdvisorSessionToken(tamperedToken1), null);

    // Tamper with signature
    const tamperedSig = sig.slice(0, -4) + 'AAAA';
    const tamperedToken2 = `${payloadB64}.${tamperedSig}`;
    assert.equal(verifyAdvisorSessionToken(tamperedToken2), null);

    // Malformed token
    assert.equal(verifyAdvisorSessionToken('single-string-without-dot'), null);
    assert.equal(verifyAdvisorSessionToken(''), null);
  });

  it('UT-AUTH-06: rejects expired tokens', () => {
    const pastTime = Math.floor(Date.now() / 1000) - 100;
    const expiredPayload = {
      role: 'advisor',
      authorName: 'Expired Advisor',
      iat: pastTime - 1000,
      exp: pastTime,
    };
    const b64 = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
    // Generate valid signature with current secret for expired payload
    const crypto = require('node:crypto');
    // Call createAdvisorSessionToken to initialize secret
    createAdvisorSessionToken();
    const secret = (globalThis as any).__ephemeralSecret;
    const sig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
    const expiredToken = `${b64}.${sig}`;

    assert.equal(verifyAdvisorSessionToken(expiredToken), null);
  });

  it('UT-AUTH-07: extracts session from HTTP Request cookie header', () => {
    const token = createAdvisorSessionToken('Counselor Lee');
    const req = new Request('http://localhost:3000/api/advisor/students', {
      headers: {
        cookie: `other=foo; ${ADVISOR_COOKIE_NAME}=${token}; theme=dark`,
      },
    });

    const session = getAdvisorSessionFromRequest(req);
    assert.ok(session);
    assert.equal(session.authorName, 'Counselor Lee');

    // Missing cookie
    const emptyReq = new Request('http://localhost:3000/api/advisor/students');
    assert.equal(getAdvisorSessionFromRequest(emptyReq), null);
  });

  it('UT-AUTH-08: generates compliant Set-Cookie headers for login and logout', () => {
    const token = 'sample_token_xyz';
    const cookieHeader = getAdvisorCookieHeader(token);

    assert.ok(cookieHeader.includes(`${ADVISOR_COOKIE_NAME}=sample_token_xyz`));
    assert.ok(cookieHeader.includes('HttpOnly'));
    assert.ok(cookieHeader.includes('Path=/'));
    assert.ok(cookieHeader.includes('SameSite=Lax'));
    assert.ok(cookieHeader.includes(`Max-Age=${SESSION_MAX_AGE_SECONDS}`));

    const logoutHeader = getAdvisorLogoutCookieHeader();
    assert.ok(logoutHeader.includes(`${ADVISOR_COOKIE_NAME}=`));
    assert.ok(logoutHeader.includes('Max-Age=0'));
    assert.ok(logoutHeader.includes('HttpOnly'));
  });
});
