import { NextResponse } from 'next/server';

const startTime = Date.now();

export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    status: 'healthy',
    database: 'sqlite_ready',
    gemini_mode: 'live_or_mock',
    zero_cost_free_tier: true,
    rate_limit_rpm_ceiling: 15,
    uptime_seconds: uptimeSeconds,
  });
}
