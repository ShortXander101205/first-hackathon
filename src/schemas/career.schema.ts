/**
 * PathwayAI: 4-Career Recommendation Dossier Zod Validation Schemas
 */

import { z } from 'zod';

export const matchTierSchema = z.enum([
  'Primary Direct Match',
  'High-Growth Pathway',
  'Interdisciplinary Pivot',
  'Moonshot Trajectory',
]);

export const trialCourseSchema = z.object({
  title: z.string().trim().min(2).max(150),
  provider: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(300),
  estimated_hours: z.number().int().min(1).max(40),
});

export const careerCardSchema = z.object({
  id: z.string().trim().min(1),
  role_title: z.string().trim().min(2).max(100),
  match_tier: matchTierSchema,
  fit_score: z.number().int().min(50).max(100),
  fit_rationale: z.string().trim().min(10).max(350),
  majors: z.array(z.string().trim().min(2)).min(2, 'Must include at least 2 relevant college majors'),
  daily_tasks: z.array(z.string().trim().min(5)).min(3, 'Must include at least 3 daily tasks'),
  course_challenges: z.string().trim().min(5).max(250),
  reassurance: z.string().trim().min(10).max(450),
  trial_courses: z
    .tuple([trialCourseSchema, trialCourseSchema])
    .describe('Must include exactly 2 introductory trial courses'),
});

export const triageSummarySchema = z.object({
  student_archetype: z.string().trim().min(3).max(100),
  triage_narrative: z.string().trim().min(20).max(500),
});

export const triageResultSchema = z.object({
  summary: triageSummarySchema,
  careers: z
    .tuple([
      careerCardSchema,
      careerCardSchema,
      careerCardSchema,
      careerCardSchema,
    ])
    .describe('Must return exactly 4 career cards')
    .refine((cards) => {
      const tiers = new Set(cards.map((c) => c.match_tier));
      return tiers.size === 4;
    }, 'Careers must cover all 4 distinct match tiers without duplicates'),
});

export type TrialCourseInput = z.infer<typeof trialCourseSchema>;
export type CareerCardInput = z.infer<typeof careerCardSchema>;
export type TriageSummaryInput = z.infer<typeof triageSummarySchema>;
export type TriageResultInput = z.infer<typeof triageResultSchema>;
