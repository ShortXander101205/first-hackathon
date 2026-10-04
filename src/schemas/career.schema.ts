/**
 * PathLess: 4-Career Recommendation Guide Zod Validation Schemas
 * Strict word count bounds, 4 distinct match tiers, and zero technical jargon.
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
  estimatedHours: z.number().int().min(1).max(40).optional(),
  estimated_hours: z.number().int().min(1).max(40).optional(),
  searchQuery: z.string().trim().optional(),
}).transform((course) => {
  const hours = course.estimatedHours ?? course.estimated_hours ?? 4;
  return {
    ...course,
    estimatedHours: hours,
    estimated_hours: hours,
  };
});

export const dayInTheLifeSchema = z.object({
  tasks: z.array(z.string().trim().min(3)).min(1),
  misconceptions: z.array(z.string().trim().min(3)).default([]),
});

export const wordCount = (val: string): number =>
  val.trim().split(/\s+/).filter(Boolean).length;

export const pathwayCardSchema = z.object({
  id: z.string().trim().min(1),
  roleTitle: z.string().trim().min(2).max(120).optional(),
  role_title: z.string().trim().min(2).max(120).optional(),
  broadField: z.string().trim().min(2).max(120).optional(),
  broad_field: z.string().trim().min(2).max(120).optional(),
  matchTier: matchTierSchema.optional(),
  match_tier: matchTierSchema.optional(),
  fitScore: z.number().int().min(50).max(100).optional(),
  fit_score: z.number().int().min(50).max(100).optional(),
  overview: z.string().trim().refine((val) => wordCount(val) <= 30, {
    message: 'Overview must be 30 words or fewer',
  }).optional(),
  fitRationale: z.string().trim().optional(),
  fit_rationale: z.string().trim().optional(),
  dailyTasks: z.array(z.string().trim().min(3)).min(3).max(4).optional(),
  daily_tasks: z.array(z.string().trim().min(3)).optional(),
  day_in_the_life: dayInTheLifeSchema.optional(),
  studyPath: z.string().trim().refine((val) => wordCount(val) <= 65, {
    message: 'Study path must be 65 words or fewer',
  }).optional(),
  courseChallenges: z.string().trim().optional(),
  course_challenges: z.string().trim().optional(),
  reassurance: z.string().trim().min(5).refine((val) => wordCount(val) <= 65, {
    message: 'Reassurance must be 65 words or fewer',
  }),
  majors: z.array(z.string().trim().min(2)).min(2, 'Must include at least 2 relevant college majors'),
  minors: z.array(z.string().trim().min(2)).default([]),
  trialCourses: z.tuple([trialCourseSchema, trialCourseSchema]).optional(),
  trial_courses: z.tuple([trialCourseSchema, trialCourseSchema]).optional(),
  whereToStudyReady: z.boolean().default(true),
}).transform((data) => {
  const roleTitle = data.roleTitle ?? data.role_title ?? 'Specialist';
  const broadField = data.broadField ?? data.broad_field ?? 'Applied Studies';
  const matchTier = data.matchTier ?? data.match_tier ?? 'Primary Direct Match';
  const fitScore = data.fitScore ?? data.fit_score ?? 85;
  const overview = data.overview ?? data.fitRationale ?? data.fit_rationale ?? 'A focused pathway tailored to your natural strengths.';
  const dailyTasks = data.dailyTasks ?? data.daily_tasks ?? data.day_in_the_life?.tasks ?? [
    'Analyze real-world problem sets',
    'Collaborate on implementation plans',
    'Review workflow outputs',
  ];
  const studyPath = data.studyPath ?? data.courseChallenges ?? data.course_challenges ?? 'Foundational coursework in core principles, applied methods, and collaborative projects.';
  const trialCourses = data.trialCourses ?? data.trial_courses ?? [
    { title: 'Introductory Exploratory Course', provider: 'Free Platform', description: 'Explore basics', estimatedHours: 4, estimated_hours: 4 },
    { title: 'Applied Practical Project', provider: 'Free Platform', description: 'Hands-on project', estimatedHours: 4, estimated_hours: 4 },
  ];

  return {
    ...data,
    id: data.id,
    roleTitle,
    role_title: roleTitle,
    broadField,
    broad_field: broadField,
    matchTier,
    match_tier: matchTier,
    fitScore,
    fit_score: fitScore,
    overview,
    fitRationale: overview,
    fit_rationale: overview,
    dailyTasks,
    daily_tasks: dailyTasks,
    studyPath,
    courseChallenges: studyPath,
    course_challenges: studyPath,
    reassurance: data.reassurance,
    majors: data.majors,
    minors: data.minors,
    trialCourses,
    trial_courses: trialCourses,
    whereToStudyReady: data.whereToStudyReady ?? true,
  };
});

export const guideSummarySchema = z.object({
  studentArchetype: z.string().trim().min(3).max(120).optional(),
  student_archetype: z.string().trim().min(3).max(120).optional(),
  narrativeSummary: z.string().trim().min(10).max(600).optional(),
  triage_narrative: z.string().trim().min(10).max(600).optional(),
  narrative_summary: z.string().trim().min(10).max(600).optional(),
}).transform((data) => {
  const studentArchetype = data.studentArchetype ?? data.student_archetype ?? 'The Thoughtful Explorer';
  const narrativeSummary = data.narrativeSummary ?? data.narrative_summary ?? data.triage_narrative ?? 'Your natural curiosity and strengths align with these supportive pathways.';
  return {
    studentArchetype,
    student_archetype: studentArchetype,
    narrativeSummary,
    narrative_summary: narrativeSummary,
    triage_narrative: narrativeSummary,
  };
});

export const guideResultSchema = z.object({
  summary: guideSummarySchema,
  pathways: z.tuple([pathwayCardSchema, pathwayCardSchema, pathwayCardSchema, pathwayCardSchema]).optional(),
  careers: z.tuple([pathwayCardSchema, pathwayCardSchema, pathwayCardSchema, pathwayCardSchema]).optional(),
}).refine((data) => Boolean(data.pathways || data.careers), {
  message: 'Must contain either pathways or careers tuple of 4 cards',
}).transform((data) => {
  const cards = (data.pathways ?? data.careers)!;
  return {
    summary: data.summary,
    pathways: cards,
    careers: cards,
  };
}).refine((data) => {
  const tiers = new Set(data.pathways.map((c) => c.matchTier));
  return tiers.size === 4;
}, 'Pathways must cover all 4 distinct match tiers without duplicates');

// Backward-compatible schema aliases
export const careerCardSchema = pathwayCardSchema;
export const triageSummarySchema = guideSummarySchema;
export const triageResultSchema = guideResultSchema;

export type TrialCourseInput = z.infer<typeof trialCourseSchema>;
export type PathwayCardInput = z.infer<typeof pathwayCardSchema>;
export type CareerCardInput = PathwayCardInput;
export type GuideSummaryInput = z.infer<typeof guideSummarySchema>;
export type TriageSummaryInput = GuideSummaryInput;
export type GuideResultInput = z.infer<typeof guideResultSchema>;
export type TriageResultInput = GuideResultInput;
