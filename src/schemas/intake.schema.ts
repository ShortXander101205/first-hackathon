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

export const highSchoolTrackSchema = z.enum([
  'SCIENCE_MATH',
  'ARTS_MATH',
  'ARTS_LANGUAGE',
  'VOCATIONAL_APPLIED',
  'TRACK_EXPLORING',
]);

export const practicalWorkContextSchema = z.enum([
  'DIGITAL_TECH_PRODUCTS',
  'HEALTH_WELLNESS_CARE',
  'ENTERPRISE_GROWTH',
  'CREATIVE_MEDIA_STORYTELLING',
  'PUBLIC_GOOD_COMMUNITY',
]);

export const collaborationStyleSchema = z.enum([
  'INDEPENDENT_DEEP_FOCUS',
  'BALANCED_TEAM',
  'HIGH_CONTACT_PEOPLE',
]);

export const intakeAnswersStateSchema = z.object({
  q1TaskIds: z.array(z.string()).max(2).default([]),
  q2SubjectId: z.string().nullable().default(null),
  q2Rationale: z.string().max(200).default(''),
  q3Environment: environmentChoiceSchema.nullable().default(null),
  q4Ambition: ambitionChoiceSchema.nullable().default(null),
  q3HighSchoolTrack: highSchoolTrackSchema.optional(),
  q3AcademicHesitation: z.string().max(200).optional(),
  q4AcademicHesitation: z.string().max(200).optional(),
  q4EnvironmentChoice: z.string().optional(),
  q4Environment: z.string().optional(),
  q5Environment: z.string().optional(),
  q5ProblemSolving: z.string().optional(),
  q6SocialEnergy: z.string().optional(),
  q6CollaborationStyle: z.string().optional(),
  q7ProblemSolving: z.string().optional(),
  q7StructureTolerance: z.string().optional(),
  q8StructureTolerance: z.string().optional(),
  q8AcademicFriction: z.string().optional(),
  q9WorkContext: practicalWorkContextSchema.optional(),
  q9HorizonPriority: z.string().optional(),
  q10AcademicFriction: z.string().optional(),
  q10PostCollegeAmbition: z.string().optional(),
  q11HorizonPriority: z.string().optional(),
  q12PostCollegeAmbition: z.string().optional(),
});

export const intakeStoredStateSchema = z.object({
  version: z.number(),
  currentStep: z.number().min(0).max(12),
  profile: studentProfileSchema.optional(),
  studentNickname: z.string().max(50).default(''),
  answers: intakeAnswersStateSchema.passthrough(),
  timestamp: z.number().optional(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type IntakeStoredStateInput = z.infer<typeof intakeStoredStateSchema>;

export const intakeAnswersSchema = z
  .object({
    q1TaskIds: z
      .array(z.string().trim().min(1))
      .min(1, 'Please select 1 or 2 task interests')
      .max(2, 'Please select up to 2 task interests'),
    q2SubjectId: z.string().trim().min(1, 'Please select a primary subject area'),

    // Q3 in 12-question flow
    q3HighSchoolTrack: highSchoolTrackSchema.optional(),

    // Q3 in 10-question legacy flow
    q3AcademicHesitation: z
      .string()
      .trim()
      .min(1, 'Please share your thoughts on academic hesitations')
      .max(200, 'Please keep thoughts within 200 characters')
      .optional(),

    // Q4 in 12-question flow
    q4AcademicHesitation: z
      .string()
      .trim()
      .min(1, 'Please share your thoughts on academic hesitations')
      .max(200, 'Please keep thoughts within 200 characters')
      .optional(),

    // Q4 in 10-question legacy flow
    q4Environment: z.string().trim().min(1).optional(),
    // Q5 in 12-question flow
    q5Environment: z.string().trim().min(1).optional(),

    // Q5 in 10-question legacy flow
    q5ProblemSolving: z.string().trim().min(1).optional(),
    // Q7 in 12-question flow
    q7ProblemSolving: z.string().trim().min(1).optional(),

    // Q6 in 10-question legacy flow
    q6SocialEnergy: z.string().trim().min(1).optional(),
    // Q6 in 12-question flow
    q6CollaborationStyle: z.string().trim().min(1).optional(),

    // Q7 in 10-question legacy flow
    q7StructureTolerance: z.string().trim().min(1).optional(),
    // Q8 in 12-question flow
    q8StructureTolerance: z.string().trim().min(1).optional(),

    // Q8 in 10-question legacy flow
    q8AcademicFriction: z.string().trim().min(1).optional(),
    // Q10 in 12-question flow
    q10AcademicFriction: z.string().trim().min(1).optional(),

    // Q9 in 12-question flow
    q9WorkContext: practicalWorkContextSchema.optional(),

    // Q9 in 10-question legacy flow
    q9HorizonPriority: z.string().trim().min(1).optional(),
    // Q11 in 12-question flow
    q11HorizonPriority: z.string().trim().min(1).optional(),

    // Q10 in 10-question legacy flow
    q10PostCollegeAmbition: z.string().trim().min(1).optional(),
    // Q12 in 12-question flow
    q12PostCollegeAmbition: z.string().trim().min(1).optional(),
  })
  .strict()
  .refine(
    (data) => Boolean(data.q4AcademicHesitation || data.q3AcademicHesitation),
    {
      message: 'Please share your thoughts on academic hesitations',
      path: ['q4AcademicHesitation'],
    }
  )
  .transform((data) => {
    const rawHesitation = data.q4AcademicHesitation || data.q3AcademicHesitation || 'Exploring all options';
    const sanitizedHesitation = sanitizePromptText(rawHesitation, 200);

    const track = data.q3HighSchoolTrack || 'TRACK_EXPLORING';
    const env = (data.q5Environment || data.q4Environment || 'REMOTE_DIGITAL') as any;
    const collab = (data.q6CollaborationStyle || data.q6SocialEnergy || 'BALANCED_TEAM') as any;
    const problemSolving = (data.q7ProblemSolving || data.q5ProblemSolving || 'SYSTEMATIC_LOGIC') as any;
    const structure = (data.q8StructureTolerance || data.q7StructureTolerance || 'BALANCED_MILESTONES') as any;
    const workContext = (data.q9WorkContext || 'DIGITAL_TECH_PRODUCTS') as any;
    const friction = (data.q10AcademicFriction || data.q8AcademicFriction || 'ADVANCED_MATH') as any;
    const priority = (data.q11HorizonPriority || data.q9HorizonPriority || 'FINANCIAL_STABILITY') as any;
    const ambition = (data.q12PostCollegeAmbition || data.q10PostCollegeAmbition || 'WORKFORCE_DIRECT') as any;

    return {
      q1TaskIds: data.q1TaskIds,
      q2SubjectId: data.q2SubjectId,
      q3HighSchoolTrack: track,
      q4AcademicHesitation: sanitizedHesitation,
      q5Environment: env,
      q6CollaborationStyle: collab,
      q7ProblemSolving: problemSolving,
      q8StructureTolerance: structure,
      q9WorkContext: workContext,
      q10AcademicFriction: friction,
      q11HorizonPriority: priority,
      q12PostCollegeAmbition: ambition,

      // Backwards compatibility mappings for existing 10-question readers:
      q3AcademicHesitation: sanitizedHesitation,
      q4Environment: env,
      q5ProblemSolving: problemSolving,
      q6SocialEnergy: collab,
      q7StructureTolerance: structure,
      q8AcademicFriction: friction,
      q9HorizonPriority: priority,
      q10PostCollegeAmbition: ambition,
    };
  });

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
