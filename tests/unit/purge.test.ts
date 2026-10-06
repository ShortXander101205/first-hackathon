import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getPrecedingJuly1Cutoff } from '@/lib/purge';

describe('Feature 10: Annual Data Purge Unit Tests', () => {
  it('UT-PURGE-01: calculates July 1 of current year when run in autumn (e.g., Oct 6, 2026)', () => {
    const testDate = new Date(Date.UTC(2026, 9, 6, 12, 0, 0)); // Oct 6, 2026
    const cutoff = getPrecedingJuly1Cutoff(testDate);

    assert.equal(cutoff.getUTCFullYear(), 2026);
    assert.equal(cutoff.getUTCMonth(), 6); // July (0-indexed 6)
    assert.equal(cutoff.getUTCDate(), 1);
    assert.equal(cutoff.toISOString(), '2026-07-01T00:00:00.000Z');
  });

  it('UT-PURGE-02: calculates July 1 of previous year when run in spring (e.g., March 15, 2026)', () => {
    const testDate = new Date(Date.UTC(2026, 2, 15, 10, 30, 0)); // March 15, 2026
    const cutoff = getPrecedingJuly1Cutoff(testDate);

    assert.equal(cutoff.getUTCFullYear(), 2025);
    assert.equal(cutoff.getUTCMonth(), 6);
    assert.equal(cutoff.getUTCDate(), 1);
    assert.equal(cutoff.toISOString(), '2025-07-01T00:00:00.000Z');
  });

  it('UT-PURGE-03: handles exact July 1 midnight boundary condition', () => {
    const exactMidnight = new Date(Date.UTC(2026, 6, 1, 0, 0, 0, 0));
    const cutoff = getPrecedingJuly1Cutoff(exactMidnight);

    assert.equal(cutoff.toISOString(), '2026-07-01T00:00:00.000Z');

    // 1 millisecond before July 1
    const justBefore = new Date(Date.UTC(2026, 5, 30, 23, 59, 59, 999));
    const cutoffBefore = getPrecedingJuly1Cutoff(justBefore);
    assert.equal(cutoffBefore.toISOString(), '2025-07-01T00:00:00.000Z');
  });

  it('UT-PURGE-04: handles leap year dates correctly (e.g., Feb 29, 2028)', () => {
    const leapDay = new Date(Date.UTC(2028, 1, 29, 14, 0, 0)); // Feb 29, 2028
    const cutoff = getPrecedingJuly1Cutoff(leapDay);

    assert.equal(cutoff.getUTCFullYear(), 2027);
    assert.equal(cutoff.getUTCMonth(), 6);
    assert.equal(cutoff.getUTCDate(), 1);
    assert.equal(cutoff.toISOString(), '2027-07-01T00:00:00.000Z');
  });

  it('UT-PURGE-05: correctly classifies submissions into retain vs purge buckets', () => {
    const activeCycleDate = new Date(Date.UTC(2026, 9, 6)); // Oct 6, 2026
    const cutoff = getPrecedingJuly1Cutoff(activeCycleDate); // 2026-07-01

    const submissions = [
      { id: 'sub_old_1', createdAt: new Date(Date.UTC(2025, 8, 15)) }, // Sep 15, 2025 -> PURGE
      { id: 'sub_old_2', createdAt: new Date(Date.UTC(2026, 4, 20)) }, // May 20, 2026 -> PURGE
      { id: 'sub_active_1', createdAt: new Date(Date.UTC(2026, 6, 2)) }, // July 2, 2026 -> RETAIN
      { id: 'sub_active_2', createdAt: new Date(Date.UTC(2026, 8, 30)) }, // Sep 30, 2026 -> RETAIN
    ];

    const eligibleForPurge = submissions.filter((s) => s.createdAt.getTime() < cutoff.getTime());
    const retained = submissions.filter((s) => s.createdAt.getTime() >= cutoff.getTime());

    assert.equal(eligibleForPurge.length, 2);
    assert.deepEqual(eligibleForPurge.map((s) => s.id), ['sub_old_1', 'sub_old_2']);
    assert.equal(retained.length, 2);
    assert.deepEqual(retained.map((s) => s.id), ['sub_active_1', 'sub_active_2']);
  });
});
