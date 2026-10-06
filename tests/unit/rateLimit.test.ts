import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSlidingWindowLimiter,
  guideRateLimiter,
  advisorLoginRateLimiter,
  getClientIp,
  getClientRateLimitKey,
} from '@/lib/rateLimit';

describe('Sliding-Window Rate Limiter Unit Tests (AC-SAFE-01)', () => {
  beforeEach(() => {
    guideRateLimiter.reset();
    advisorLoginRateLimiter.reset();
  });

  describe('Guide Synthesis Rate Limiter (5 req / 10-minute window)', () => {
    it('allows up to 5 requests from the same client identifier', () => {
      const clientId = 'student_test_ip_1';

      for (let i = 1; i <= 5; i++) {
        const result = guideRateLimiter.consume(clientId);
        assert.equal(result.allowed, true);
        assert.equal(result.limit, 5);
        assert.equal(result.remaining, 5 - i);
      }
    });

    it('blocks the 6th request from the same client identifier with retryAfterSeconds', () => {
      const clientId = 'student_test_ip_2';

      for (let i = 0; i < 5; i++) {
        const result = guideRateLimiter.consume(clientId);
        assert.equal(result.allowed, true);
      }

      const blockedResult = guideRateLimiter.consume(clientId);
      assert.equal(blockedResult.allowed, false);
      assert.equal(blockedResult.remaining, 0);
      assert.ok(blockedResult.retryAfterSeconds > 0);
      assert.ok(blockedResult.retryAfterSeconds <= 600);
      assert.ok(blockedResult.resetAt > Date.now());
    });

    it('isolates different client identifiers independently', () => {
      const client1 = '192.168.1.10';
      const client2 = '192.168.1.20';

      for (let i = 0; i < 5; i++) {
        guideRateLimiter.consume(client1);
      }
      assert.equal(guideRateLimiter.check(client1).allowed, false);

      // client2 should still be completely unthrottled
      const result2 = guideRateLimiter.consume(client2);
      assert.equal(result2.allowed, true);
      assert.equal(result2.remaining, 4);
    });

    it('check() does not consume quota whereas consume() does', () => {
      const client = '192.168.1.30';

      const check1 = guideRateLimiter.check(client);
      assert.equal(check1.allowed, true);
      assert.equal(check1.remaining, 5);

      const check2 = guideRateLimiter.check(client);
      assert.equal(check2.allowed, true);
      assert.equal(check2.remaining, 5);

      const consumed = guideRateLimiter.consume(client);
      assert.equal(consumed.allowed, true);
      assert.equal(consumed.remaining, 4);
    });
  });

  describe('Advisor Login Rate Limiter (5 attempts / 1-minute window)', () => {
    it('throttles excessive passcode guesses after 5 attempts in 1 minute', () => {
      const ip = '10.0.0.5';

      for (let i = 0; i < 5; i++) {
        assert.equal(advisorLoginRateLimiter.consume(ip).allowed, true);
      }

      const blocked = advisorLoginRateLimiter.consume(ip);
      assert.equal(blocked.allowed, false);
      assert.ok(blocked.retryAfterSeconds > 0);
      assert.ok(blocked.retryAfterSeconds <= 60);
    });
  });

  describe('Memory Management & LRU Key Eviction', () => {
    it('caps maximum stored keys and evicts oldest entries to prevent memory leaks', () => {
      const smallLimiter = createSlidingWindowLimiter({
        windowMs: 1000,
        maxRequests: 2,
        maxTrackedKeys: 3,
        name: 'test_lru',
      });

      smallLimiter.consume('key_1');
      smallLimiter.consume('key_2');
      smallLimiter.consume('key_3');
      assert.equal(smallLimiter.getTrackedKeyCount(), 3);

      // Inserting 4th key should trigger LRU eviction of the oldest (key_1)
      smallLimiter.consume('key_4');
      assert.equal(smallLimiter.getTrackedKeyCount(), 3);

      // key_1 was evicted so if it calls again it is treated as a new key with full quota
      const checkKey1 = smallLimiter.check('key_1');
      assert.equal(checkKey1.remaining, 2);
    });

    it('cleanup() purges expired keys from memory storage', async () => {
      const fastLimiter = createSlidingWindowLimiter({
        windowMs: 50,
        maxRequests: 2,
        maxTrackedKeys: 10,
        name: 'test_cleanup',
      });

      fastLimiter.consume('expiring_key_1');
      fastLimiter.consume('expiring_key_2');
      assert.equal(fastLimiter.getTrackedKeyCount(), 2);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 60));

      fastLimiter.cleanup();
      assert.equal(fastLimiter.getTrackedKeyCount(), 0);
    });
  });

  describe('NAT and Client IP Extraction', () => {
    it('extracts client IP from x-forwarded-for header', () => {
      const req = new Request('http://localhost/api/guide', {
        headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18' },
      });
      assert.equal(getClientIp(req), '203.0.113.195');
    });

    it('falls back to x-real-ip if x-forwarded-for is missing', () => {
      const req = new Request('http://localhost/api/guide', {
        headers: { 'x-real-ip': '198.51.100.17' },
      });
      assert.equal(getClientIp(req), '198.51.100.17');
    });

    it('accommodates school NAT / shared computer labs with session header', () => {
      const req1 = new Request('http://localhost/api/guide', {
        headers: {
          'x-forwarded-for': '198.51.100.50',
          'x-pathless-session': 'student_session_desk_a',
        },
      });
      const req2 = new Request('http://localhost/api/guide', {
        headers: {
          'x-forwarded-for': '198.51.100.50',
          'x-pathless-session': 'student_session_desk_b',
        },
      });

      const key1 = getClientRateLimitKey(req1, 'guide_synthesis');
      const key2 = getClientRateLimitKey(req2, 'guide_synthesis');

      assert.equal(key1, '198.51.100.50:student_session_desk_a');
      assert.equal(key2, '198.51.100.50:student_session_desk_b');
      assert.notEqual(key1, key2);
    });
  });
});
