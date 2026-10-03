/**
 * PathwayAI: AI Triage Request & Response Zod Schemas
 * Governs POST /api/triage request validation and Gemini 4-career dossier parsing.
 */

import { z } from 'zod';

// ==========================================
// 1. Triage Request Validation Schema
// ==========================================

export const taskChoiceEnum = z.enum([
  'BUILD_SYSTEMS',
  'ANALYZE_PATTERNS',
  'HELP_HUMANS',
  'LEAD_ORGANIZING',
]);

export const subjectChoiceEnum = z.enum([
  'STEM_TECH',
  'HEALTH_BIO',
  'BUSINESS_SOCIETY',
  'ARTS_HUMANITIES',
  'PUBLIC_POLICY',
]);

export const environmentChoiceEnum = z.enum(['REMOTE_DESK', 'ACTIVE_FIELD_LAB']);
export const ambitionChoiceEnum = z.enum(['WORKFORCE_DIRECT', 'GRADUATE_STUDY']);

// Normalization mappings for friendly/colloquial aliases used in testing & client submissions
export function normalizeTask(val: unknown): string {
  if (typeof val !== 'string') return String(val ?? '');
  const normalized = val.trim().toLowerCase();
  switch (normalized) {
    case 'building':
    case 'build':
    case 'build_systems':
    case 'build systems':
    case 'systems':
      return 'BUILD_SYSTEMS';
    case 'analyzing':
    case 'analyze':
    case 'analyze_patterns':
    case 'analyze patterns':
    case 'patterns':
    case 'puzzles':
    case 'investigating':
      return 'ANALYZE_PATTERNS';
    case 'helping':
    case 'help':
    case 'help_humans':
    case 'help humans':
    case 'humans':
    case 'guiding':
    case 'supporting':
    case 'people':
      return 'HELP_HUMANS';
    case 'leading':
    case 'lead':
    case 'lead_organizing':
    case 'lead organizing':
    case 'organizing':
    case 'coordinating':
    case 'initiatives':
      return 'LEAD_ORGANIZING';
    default:
      return val.trim().toUpperCase();
  }
}

export function normalizeSubject(val: unknown): string {
  if (typeof val !== 'string') return String(val ?? '');
  const normalized = val.trim().toLowerCase();
  switch (normalized) {
    case 'science':
    case 'sciences':
    case 'health':
    case 'bio':
    case 'biology':
    case 'medicine':
    case 'life sciences':
    case 'life_sciences':
    case 'health_bio':
      return 'HEALTH_BIO';
    case 'tech':
    case 'technology':
    case 'computing':
    case 'coding':
    case 'math':
    case 'stem':
    case 'stem_tech':
      return 'STEM_TECH';
    case 'business':
    case 'society':
    case 'finance':
    case 'economics':
    case 'business_society':
      return 'BUSINESS_SOCIETY';
    case 'arts':
    case 'humanities':
    case 'writing':
    case 'media':
    case 'creative':
    case 'arts_humanities':
      return 'ARTS_HUMANITIES';
    case 'policy':
    case 'public policy':
    case 'law':
    case 'civics':
    case 'community':
    case 'public_policy':
      return 'PUBLIC_POLICY';
    default:
      return val.trim().toUpperCase();
  }
}

export function normalizeEnvironment(val: unknown): string {
  if (typeof val !== 'string') return String(val ?? '');
  const normalized = val.trim().toLowerCase();
  switch (normalized) {
    case 'active':
    case 'field':
    case 'lab':
    case 'hands-on':
    case 'dynamic':
    case 'active_field_lab':
      return 'ACTIVE_FIELD_LAB';
    case 'remote':
    case 'desk':
    case 'digital':
    case 'flexible':
    case 'remote_desk':
      return 'REMOTE_DESK';
    default:
      return val.trim().toUpperCase();
  }
}

export function normalizeAmbition(val: unknown): string {
  if (typeof val !== 'string') return String(val ?? '');
  const normalized = val.trim().toLowerCase();
  switch (normalized) {
    case 'degree':
    case 'grad':
    case 'graduate':
    case 'graduate study':
    case 'graduate_study':
    case 'masters':
    case 'phd':
    case 'advanced':
      return 'GRADUATE_STUDY';
    case 'workforce':
    case 'direct':
    case 'career':
    case 'work':
    case 'job':
    case 'independence':
    case 'workforce_direct':
      return 'WORKFORCE_DIRECT';
    default:
      return val.trim().toUpperCase();
  }
}

export function preprocessAnswers(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return raw;
  }
  const obj = raw as Record<string, any>;

  const rawTasks = obj.q1TaskIds ?? obj.taskPreferences ?? obj.tasks ?? obj.task_preferences;
  const rawSubject = obj.q2SubjectId ?? obj.subject ?? obj.primarySubject ?? obj.q2_subject_id;
  const rawRationale = obj.q2Rationale ?? obj.subjectRationale ?? obj.rationale ?? obj.q2_rationale;
  const rawEnvironment =
    obj.q3Environment ?? obj.workEnvironment ?? obj.environment ?? obj.setting ?? obj.q3_environment;
  const rawAmbition =
    obj.q4Ambition ?? obj.educationAmbition ?? obj.ambition ?? obj.timeline ?? obj.q4_ambition;

  return {
    ...obj,
    q1TaskIds: Array.isArray(rawTasks) ? rawTasks.map(normalizeTask) : rawTasks,
    q2SubjectId: typeof rawSubject === 'string' ? normalizeSubject(rawSubject) : rawSubject,
    q2Rationale: typeof rawRationale === 'string' ? rawRationale.trim() : rawRationale,
    q3Environment: typeof rawEnvironment === 'string' ? normalizeEnvironment(rawEnvironment) : rawEnvironment,
    q4Ambition: typeof rawAmbition === 'string' ? normalizeAmbition(rawAmbition) : rawAmbition,
  };
}

export function preprocessTriageRequestBody(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return raw;
  }
  const obj = raw as Record<string, any>;
  if (!obj.answers && (obj.q1TaskIds || obj.taskPreferences || obj.tasks)) {
    return {
      answers: obj,
      studentNickname: obj.studentNickname ?? obj.nickname ?? '',
    };
  }
  return obj;
}

export const triageRequestSchema = z.preprocess(
  preprocessTriageRequestBody,
  z.object({
    answers: z.preprocess(
      preprocessAnswers,
      z.object(
        {
          q1TaskIds: z
            .array(taskChoiceEnum, {
              required_error: 'q1TaskIds (or taskPreferences) is required',
              invalid_type_error: 'q1TaskIds must be an array of task IDs',
            })
            .min(1, 'Please select at least 1 task')
            .max(2, 'Please select at most 2 tasks'),
          q2SubjectId: subjectChoiceEnum,
          q2Rationale: z
            .string({
              required_error: 'q2Rationale (or subjectRationale) is required',
              invalid_type_error: 'q2Rationale must be a string',
            })
            .trim()
            .min(1, 'Please share a brief thought about what excites or worries you')
            .max(150, 'Please keep your thought within 150 characters'),
          q3Environment: environmentChoiceEnum,
          q4Ambition: ambitionChoiceEnum,
        },
        {
          required_error: 'answers object is required',
          invalid_type_error: 'answers must be an object',
        }
      )
    ),
    studentNickname: z.string().trim().max(50).optional().default(''),
  })
);

export type TriageRequestInput = z.infer<typeof triageRequestSchema>;

// ==========================================
// 2. 4-Career Recommendation Response Schema
// (Consolidated from career.schema.ts)
// ==========================================

export {
  matchTierSchema,
  trialCourseSchema,
  dayInTheLifeSchema,
  careerCardSchema,
  triageSummarySchema,
  triageResultSchema,
  type TrialCourseInput,
  type CareerCardInput,
  type TriageSummaryInput,
  type TriageResultInput,
} from './career.schema';

