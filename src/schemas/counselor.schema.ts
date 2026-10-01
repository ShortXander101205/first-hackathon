/**
 * PathwayAI: Counselor Dashboard & Review Zod Validation Schemas
 */

import { z } from 'zod';

export const counselorStatusSchema = z.enum([
  'pending_review',
  'reviewed',
  'follow_up_scheduled',
]);

export const counselorReviewSchema = z.object({
  id: z.string().trim().min(1),
  submission_id: z.string().trim().min(1),
  counselor_name: z.string().trim().min(1),
  status: counselorStatusSchema,
  notes: z.string().trim().max(2000),
  flagged_friction: z.boolean(),
  updated_at: z.string().trim().min(1),
});

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

export const counselorReviewUpdateResponseSchema = z.object({
  success: z.boolean(),
  submission_id: z.string().trim().min(1),
  updated_review: counselorReviewSchema,
});

export type CounselorStatusInput = z.infer<typeof counselorStatusSchema>;
export type CounselorReviewInput = z.infer<typeof counselorReviewSchema>;
export type CounselorReviewUpdateInput = z.infer<typeof counselorReviewUpdateSchema>;
export type CounselorReviewUpdateResponseInput = z.infer<typeof counselorReviewUpdateResponseSchema>;
