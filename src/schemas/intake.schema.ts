/**
 * PathLess: Student Intake Zod Validation Schemas
 * Hardened with strict schema validation and input sanitization transforms.
 */

import { z } from 'zod';
import { sanitizeString, sanitizePromptText } from '@/lib/sanitize';

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
  fullName: z
    .string()
    .trim()
    .min(1, 'Please enter your full name')
    .max(100, 'Full name must be 100 characters or fewer')
    .transform((val) => sanitizeString(val)),
  gradeLevel: gradeLevelSchema,
  studentId: z
    .string()
    .trim()
    .max(64, 'Student ID must be 64 characters or fewer')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? sanitizeString(val) : '')),
}).strict();

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

export const intakeAnswersSchema = z.object({
  q1TaskIds: z
    .array(z.string().trim().min(1))
    .min(1, 'Please select 1 or 2 task interests')
    .max(2, 'Please select up to 2 task interests'),
  q2SubjectId: z.string().trim().min(1, 'Please select a primary subject area'),
  q3AcademicHesitation: z
    .string()
    .trim()
    .min(1, 'Please share your thoughts on academic hesitations')
    .max(200, 'Please keep thoughts within 200 characters')
    .transform((val) => sanitizePromptText(val, 200)),
  q4Environment: z.string().trim().min(1, 'Please select a work environment'),
  q5ProblemSolving: z.string().trim().min(1, 'Please select a problem-solving approach'),
  q6SocialEnergy: z.string().trim().min(1, 'Please select a social energy preference'),
  q7StructureTolerance: z.string().trim().min(1, 'Please select a structure preference'),
  q8AcademicFriction: z.string().trim().min(1, 'Please select an academic friction area'),
  q9HorizonPriority: z.string().trim().min(1, 'Please select a horizon priority'),
  q10PostCollegeAmbition: z.string().trim().min(1, 'Please select a post-college ambition'),
}).strict();

export const submissionPayloadSchema = z.object({
  studentProfile: studentProfileSchema,
  intakeAnswers: intakeAnswersSchema,
  metadata: z.object({
    clientTimestamp: z.string().optional(),
    schemaVersion: z.number().optional(),
  }).strict().optional(),
}).strict();

export type IntakeAnswersInput = z.infer<typeof intakeAnswersSchema>;
export type SubmissionPayloadInput = z.infer<typeof submissionPayloadSchema>;
