/**
 * PathwayAI: Counselor Dashboard & Review Zod Validation Schemas
 */

import { z } from 'zod';

export const counselorStatusSchema = z.enum([
  'pending_review',
  'reviewed',
  'follow_up_scheduled',
]);

export const counselorReviewUpdateSchema = z.object({
  status: counselorStatusSchema,
  notes: z
    .string()
    .trim()
    .max(2000, 'Counselor notes cannot exceed 2,000 characters'),
  flagged_friction: z.boolean(),
  counselor_name: z
    .string()
    .trim()
    .max(100, 'Counselor name cannot exceed 100 characters')
    .optional(),
});

export type CounselorStatusInput = z.infer<typeof counselorStatusSchema>;
export type CounselorReviewUpdateInput = z.infer<typeof counselorReviewUpdateSchema>;
