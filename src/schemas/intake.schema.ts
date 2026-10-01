/**
 * PathwayAI: Student Intake Zod Validation Schemas
 */

import { z } from 'zod';

export const gradeLevelSchema = z.enum([
  'high_school_junior',
  'high_school_senior',
  'college_freshman',
  'college_sophomore',
]);

export const intellectualEnergySchema = z.enum([
  'BUILD_SYSTEMS',
  'ANALYZE_PATTERNS',
  'HELP_HUMANS',
  'CREATE_EXPRESS',
  'LEAD_ORGANIZING',
]);

export const workContextSchema = z.enum([
  'TECH_INNOVATION',
  'HEALTH_BIO',
  'BUSINESS_FINANCE',
  'SOCIAL_CIVIC',
  'MEDIA_CULTURE',
]);

export const academicFrictionSchema = z.enum([
  'HARD_MATH',
  'PUBLIC_SPEAKING',
  'HEAVY_MEMORIZATION',
  'ABSTRACT_WRITING',
  'ISOLATED_DESKWORK',
]);

export const horizonPrioritySchema = z.enum([
  'HIGH_EARNING_SECURITY',
  'PURPOSE_IMPACT',
  'CREATIVE_AUTONOMY',
  'INTELLECTUAL_DEPTH',
  'WORK_LIFE_BALANCE',
]);

export const studentInfoSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[^<>]*$/, 'Name contains invalid characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  grade_level: gradeLevelSchema,
  school_name: z
    .string()
    .trim()
    .max(100, 'School name cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
});

export const intakeAnswersSchema = z.object({
  q1_intellectual_energy: intellectualEnergySchema,
  q2_work_context: workContextSchema,
  q3_academic_friction: academicFrictionSchema,
  q4_horizon_priority: horizonPrioritySchema,
});

export const intakeSubmissionRequestSchema = z.object({
  student_info: studentInfoSchema,
  answers: intakeAnswersSchema,
});

export type StudentInfoInput = z.infer<typeof studentInfoSchema>;
export type IntakeAnswersInput = z.infer<typeof intakeAnswersSchema>;
export type IntakeSubmissionRequestInput = z.infer<typeof intakeSubmissionRequestSchema>;
