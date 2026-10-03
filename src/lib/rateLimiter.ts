/**
 * PathwayAI: Dual-Tier In-Memory Rate Limiter
 * Guards the 15 RPM Gemini free-tier ceiling (14 RPM global buffer) and prevents per-IP spam (3 RPM).
 */

export interface RateLimitStatus {
  allowed: boolean;
  retryAfterSeconds: number;
  reason?: 'GLOBAL_RATE_LIMIT' | 'CLIENT_BURST_LIMIT';
}

const GLOBAL_RPM_CEILING = 14; // Leaves 1 RPM safety buffer below Gemini's 15 RPM free-tier limit
const CLIENT_RPM_CEILING = 3;  // Per-IP burst limit
const WINDOW_MS = 60 * 1000;    // 1-minute sliding window

// In-memory sliding window timestamp stores
let globalTimestamps: number[] = [];
const clientTimestamps = new Map<string, number[]>();

/**
 * Checks whether an incoming request passes the dual-tier rate limit.
 * Does NOT record the request; call recordRequest() after passing.
 */
export function checkRateLimit(clientIp: string = 'unknown'): RateLimitStatus {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // 1. Clean up and evaluate global sliding window
  globalTimestamps = globalTimestamps.filter((ts) => ts > windowStart);
  if (globalTimestamps.length >= GLOBAL_RPM_CEILING) {
    const oldest = globalTimestamps[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
      reason: 'GLOBAL_RATE_LIMIT',
    };
  }

  // 2. Clean up and evaluate per-IP sliding window
  const clientHistory = (clientTimestamps.get(clientIp) || []).filter((ts) => ts > windowStart);
  clientTimestamps.set(clientIp, clientHistory);

  if (clientHistory.length >= CLIENT_RPM_CEILING) {
    const oldest = clientHistory[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
      reason: 'CLIENT_BURST_LIMIT',
    };
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

/**
 * Records a permitted request in both the global and client sliding windows.
 */
export function recordRequest(clientIp: string = 'unknown'): void {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  globalTimestamps.push(now);

  const clientHistory = (clientTimestamps.get(clientIp) || []).filter((ts) => ts > windowStart);
  clientHistory.push(now);
  clientTimestamps.set(clientIp, clientHistory);
}

/**
 * Resets the in-memory rate limiter (used primarily for test isolation).
 */
export function resetRateLimits(): void {
  globalTimestamps = [];
  clientTimestamps.clear();
}
