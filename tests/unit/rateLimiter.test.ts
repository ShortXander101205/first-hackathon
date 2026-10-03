import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkRateLimit,
  recordRequest,
  resetRateLimits,
} from '@/lib/rateLimiter';

describe('Dual-Tier Rate Limiter Unit Tests', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  describe('Client IP Burst Guard (3 RPM)', () => {
    it('allows up to 3 requests from the same client IP in 1 minute', () => {
      const ip = '192.168.1.100';

      for (let i = 0; i < 3; i++) {
        const status = checkRateLimit(ip);
        assert.equal(status.allowed, true);
        recordRequest(ip);
      }
    });

    it('rejects the 4th request from the same client IP with CLIENT_BURST_LIMIT', () => {
      const ip = '192.168.1.101';

      for (let i = 0; i < 3; i++) {
        assert.equal(checkRateLimit(ip).allowed, true);
        recordRequest(ip);
      }

      const blockedStatus = checkRateLimit(ip);
      assert.equal(blockedStatus.allowed, false);
      assert.equal(blockedStatus.reason, 'CLIENT_BURST_LIMIT');
      assert.ok(blockedStatus.retryAfterSeconds > 0);
    });

    it('allows distinct client IPs to make requests independently up to their limits', () => {
      const ip1 = '192.168.1.1';
      const ip2 = '192.168.1.2';

      for (let i = 0; i < 3; i++) {
        recordRequest(ip1);
      }
      assert.equal(checkRateLimit(ip1).allowed, false);

      // IP 2 is still fresh and allowed
      assert.equal(checkRateLimit(ip2).allowed, true);
    });
  });

  describe('Global Upstream Guard (14 RPM ceiling below Gemini 15 RPM)', () => {
    it('allows 14 requests across multiple IPs, then rejects the 15th with GLOBAL_RATE_LIMIT', () => {
      // 14 requests spread across 5 different IPs so client burst limits are not tripped
      for (let i = 0; i < 14; i++) {
        const ip = `10.0.0.${i}`;
        const status = checkRateLimit(ip);
        assert.equal(status.allowed, true);
        recordRequest(ip);
      }

      // 15th request from a brand new IP trips the global ceiling
      const freshIp = '10.0.0.99';
      const blockedStatus = checkRateLimit(freshIp);
      assert.equal(blockedStatus.allowed, false);
      assert.equal(blockedStatus.reason, 'GLOBAL_RATE_LIMIT');
      assert.ok(blockedStatus.retryAfterSeconds > 0);
    });
  });

  describe('resetRateLimits()', () => {
    it('clears all recorded timestamps and allows subsequent calls', () => {
      const ip = '192.168.1.200';
      for (let i = 0; i < 3; i++) {
        recordRequest(ip);
      }
      assert.equal(checkRateLimit(ip).allowed, false);

      resetRateLimits();
      assert.equal(checkRateLimit(ip).allowed, true);
    });
  });
});
