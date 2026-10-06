/**
 * PathLess Framework v2 - In-Memory Sliding-Window Rate Limiter
 * Provides zero-cost request throttling to protect Gemini free-tier quotas
 * and serverless database connection pools.
 * 
 * Features:
 * - Millisecond timestamp logs per client key (avoids fixed-window burst attacks)
 * - Atomic check-and-record consumption (prevents TOCTOU race conditions)
 * - LRU bounded memory storage (max 5,000 keys) with active stale key sweeping
 * - School NAT / shared IP accommodation via optional session header
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  name?: string;
}

export interface RateLimiterOptions extends RateLimitConfig {
  maxTrackedKeys?: number;
  cleanupIntervalMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
}

export interface EndpointRateLimiter {
  check(identifier: string): RateLimitResult;
  record(identifier: string): void;
  consume(identifier: string): RateLimitResult;
  reset(): void;
  cleanup(): void;
  getTrackedKeyCount(): number;
}

export const GUIDE_RATE_LIMIT_CONFIG: RateLimiterOptions = {
  windowMs: 10 * 60 * 1000, // 10 minutes (600,000 ms)
  maxRequests: 5,
  name: 'guide_synthesis',
  maxTrackedKeys: 5000,
};

export const GLOBAL_GUIDE_RATE_LIMIT_CONFIG: RateLimiterOptions = {
  windowMs: 60 * 1000, // 1 minute (60,000 ms)
  maxRequests: 14,     // 1 RPM buffer below Gemini's 15 RPM free ceiling
  name: 'global_gemini_ceiling',
  maxTrackedKeys: 1000,
};

export const ADVISOR_LOGIN_RATE_LIMIT_CONFIG: RateLimiterOptions = {
  windowMs: 60 * 1000, // 1 minute (60,000 ms)
  maxRequests: 5,      // Brute-force defense against shared passcode guessing
  name: 'advisor_login',
  maxTrackedKeys: 5000,
};

export const ADVISOR_NOTES_RATE_LIMIT_CONFIG: RateLimiterOptions = {
  windowMs: 60 * 1000, // 1 minute (60,000 ms)
  maxRequests: 30,
  name: 'advisor_notes',
  maxTrackedKeys: 5000,
};

export const ADMIN_PURGE_RATE_LIMIT_CONFIG: RateLimiterOptions = {
  windowMs: 60 * 1000, // 1 minute (60,000 ms)
  maxRequests: 5,
  name: 'admin_purge',
  maxTrackedKeys: 1000,
};

export function createSlidingWindowLimiter(options: RateLimiterOptions): EndpointRateLimiter {
  const {
    windowMs,
    maxRequests,
    maxTrackedKeys = 5000,
  } = options;

  const storage = new Map<string, number[]>();

  function pruneEntry(key: string, now: number): number[] {
    const timestamps = storage.get(key);
    if (!timestamps || timestamps.length === 0) {
      storage.delete(key);
      return [];
    }

    const windowStart = now - windowMs;
    const active = timestamps.filter((ts) => ts > windowStart);

    if (active.length === 0) {
      storage.delete(key);
      return [];
    }

    storage.set(key, active);
    return active;
  }

  function evictLruIfNeeded(): void {
    if (storage.size >= maxTrackedKeys) {
      // Evict oldest inserted key
      const oldestKey = storage.keys().next().value;
      if (oldestKey !== undefined) {
        storage.delete(oldestKey);
      }
    }
  }

  return {
    check(identifier: string): RateLimitResult {
      const key = identifier || 'unknown';
      const now = Date.now();
      const active = pruneEntry(key, now);

      if (active.length >= maxRequests) {
        const oldest = active[0] || now;
        const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
        return {
          allowed: false,
          limit: maxRequests,
          remaining: 0,
          retryAfterSeconds,
          resetAt: oldest + windowMs,
        };
      }

      return {
        allowed: true,
        limit: maxRequests,
        remaining: Math.max(0, maxRequests - active.length),
        retryAfterSeconds: 0,
        resetAt: now + windowMs,
      };
    },

    record(identifier: string): void {
      const key = identifier || 'unknown';
      const now = Date.now();
      const active = pruneEntry(key, now);

      if (!storage.has(key)) {
        evictLruIfNeeded();
      }

      active.push(now);
      storage.set(key, active);
    },

    consume(identifier: string): RateLimitResult {
      const key = identifier || 'unknown';
      const now = Date.now();
      const active = pruneEntry(key, now);

      if (active.length >= maxRequests) {
        const oldest = active[0] || now;
        const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
        return {
          allowed: false,
          limit: maxRequests,
          remaining: 0,
          retryAfterSeconds,
          resetAt: oldest + windowMs,
        };
      }

      if (!storage.has(key)) {
        evictLruIfNeeded();
      }

      active.push(now);
      storage.set(key, active);

      return {
        allowed: true,
        limit: maxRequests,
        remaining: Math.max(0, maxRequests - active.length),
        retryAfterSeconds: 0,
        resetAt: now + windowMs,
      };
    },

    reset(): void {
      storage.clear();
    },

    cleanup(): void {
      const now = Date.now();
      for (const key of Array.from(storage.keys())) {
        pruneEntry(key, now);
      }
    },

    getTrackedKeyCount(): number {
      return storage.size;
    },
  };
}

// Pre-configured rate limiters
export const guideRateLimiter = createSlidingWindowLimiter(GUIDE_RATE_LIMIT_CONFIG);
export const globalGuideRateLimiter = createSlidingWindowLimiter(GLOBAL_GUIDE_RATE_LIMIT_CONFIG);
export const advisorLoginRateLimiter = createSlidingWindowLimiter(ADVISOR_LOGIN_RATE_LIMIT_CONFIG);
export const advisorNotesRateLimiter = createSlidingWindowLimiter(ADVISOR_NOTES_RATE_LIMIT_CONFIG);
export const adminPurgeRateLimiter = createSlidingWindowLimiter(ADMIN_PURGE_RATE_LIMIT_CONFIG);

/**
 * Extracts client IP from standard request headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp && firstIp !== '') return firstIp;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.trim() !== '') {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Constructs a rate limit key accommodating shared NAT / computer lab setups.
 * If client provides an 'x-pathless-session' header, it is incorporated into the key
 * to prevent locking out entire school computer labs sharing a single public IP.
 */
export function getClientRateLimitKey(request: Request, endpoint: string): string {
  const ip = getClientIp(request);
  const sessionHeader = request.headers.get('x-pathless-session');
  if (endpoint === 'guide_synthesis' && sessionHeader && sessionHeader.trim() !== '') {
    return `${ip}:${sessionHeader.trim()}`;
  }
  return ip;
}
