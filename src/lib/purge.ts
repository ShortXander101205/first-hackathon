import { prisma } from './prisma';

export interface PurgePreviewResult {
  cutoffDate: Date;
  candidatesCount: number;
}

export interface PurgeExecutionResult {
  cutoffDate: Date;
  purgedCount: number;
  dryRun: boolean;
}

/**
 * Calculates the preceding July 1 cut-off timestamp in UTC.
 * Academic year cycles in secondary/higher education turn over on July 1.
 * - If current date is >= July 1 of Year Y, preceding July 1 is Year Y-07-01 UTC.
 * - If current date is < July 1 of Year Y, preceding July 1 is Year (Y-1)-07-01 UTC.
 */
export function getPrecedingJuly1Cutoff(referenceDate: Date = new Date()): Date {
  const year = referenceDate.getUTCFullYear();
  const julyCutoff = new Date(Date.UTC(year, 6, 1, 0, 0, 0, 0)); // Month index 6 = July

  if (referenceDate.getTime() >= julyCutoff.getTime()) {
    return julyCutoff;
  }
  return new Date(Date.UTC(year - 1, 6, 1, 0, 0, 0, 0));
}

/**
 * Previews submissions eligible for annual data retention purge without deleting records.
 */
export async function previewAnnualPurge(targetCutoffDate?: Date): Promise<PurgePreviewResult> {
  const cutoffDate = targetCutoffDate ?? getPrecedingJuly1Cutoff();

  try {
    const count = await prisma.studentSubmission.count({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return {
      cutoffDate,
      candidatesCount: count,
    };
  } catch (error) {
    console.warn('[PathLess Purge] Database preview query error:', error);
    return {
      cutoffDate,
      candidatesCount: 0,
    };
  }
}

/**
 * Executes the annual data retention purge.
 * Deletes student submissions created prior to the cut-off date.
 * Connected IntakeResponse, SynthesisResult, and AdvisorNote rows are automatically
 * deleted via database foreign key cascading delete constraints.
 */
export async function executeAnnualPurge(options?: {
  cutoffDate?: Date;
  dryRun?: boolean;
}): Promise<PurgeExecutionResult> {
  const cutoffDate = options?.cutoffDate ?? getPrecedingJuly1Cutoff();
  const dryRun = options?.dryRun ?? false;

  if (dryRun) {
    const preview = await previewAnnualPurge(cutoffDate);
    return {
      cutoffDate,
      purgedCount: preview.candidatesCount,
      dryRun: true,
    };
  }

  try {
    const result = await prisma.studentSubmission.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return {
      cutoffDate,
      purgedCount: result.count,
      dryRun: false,
    };
  } catch (error) {
    console.error('[PathLess Purge] Error executing annual purge deletion:', error);
    throw new Error('Unable to complete annual data archive at this time.');
  }
}
