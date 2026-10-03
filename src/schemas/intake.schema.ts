/**
 * PathLess: Student Intake Zod Validation Schemas
 */

import { z } from 'zod';

export const gradeLevelSchema = z.enum([
  'grade_10',
  'grade_11',
  'grade_12',
  'college_freshman',
  'college_sophomore',
  'high_school_junior',
  'high_school_senior',
]);

export const studentProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  gradeLevel: gradeLevelSchema,
  studentId: z.string().trim().max(64).optional().or(z.literal('')),
});

export const environmentChoiceSchema = z.enum([
  'REMOTE_DESK',
  'ACTIVE_FIELD_LAB',
  'REMOTE_DIGITAL',
  'COLLABORATIVE_STUDIO',
  'HEALTHCARE_COMMUNITY',
]);

export const ambitionChoiceSchema = z.enum([
  'WORKFORCE_DIRECT',
  'GRADUATE_STUDY',
  'FLEXIBLE_ENTREPRENEURSHIP',
]);

export const intakeAnswersStateSchema = z.object({
  q1TaskIds: z.array(z.string()).max(2).default([]),
  q2SubjectId: z.string().nullable().default(null),
  q2Rationale: z.string().max(200).default(''),
  q3Environment: environmentChoiceSchema.nullable().default(null),
  q4Ambition: ambitionChoiceSchema.nullable().default(null),
  q3AcademicHesitation: z.string().max(200).optional(),
  q4EnvironmentChoice: z.string().optional(),
  q5ProblemSolving: z.string().optional(),
  q6SocialEnergy: z.string().optional(),
  q7StructureTolerance: z.string().optional(),
  q8AcademicFriction: z.string().optional(),
  q9HorizonPriority: z.string().optional(),
  q10PostCollegeAmbition: z.string().optional(),
});

export const intakeStoredStateSchema = z.object({
  version: z.number(),
  currentStep: z.number().min(0).max(10),
  profile: studentProfileSchema.optional(),
  studentNickname: z.string().max(50).default(''),
  answers: intakeAnswersStateSchema.passthrough(),
  timestamp: z.number().optional(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type IntakeStoredStateInput = z.infer<typeof intakeStoredStateSchema>;
