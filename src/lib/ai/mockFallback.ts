/**
 * PathwayAI: Curated High-Fidelity Mock Triage Fallback
 * Guarantees 100% demo uptime and resilience when API keys are unconfigured or rate-limited.
 */

import { IntakeAnswersState } from '@/types/intake';
import { TriageResultInput } from '@/schemas/triage.schema';
import fallbackCareers from '@/fixtures/fallback-careers.json';

export function getMockTriageRecommendations(
  answers: IntakeAnswersState,
  studentNickname?: string
): TriageResultInput {
  const name = studentNickname?.trim() || 'Alex';
  const rationaleSnippet = answers.q2Rationale?.trim() || 'academic coursework';

  return {
    summary: {
      student_archetype: fallbackCareers.summary.student_archetype,
      triage_narrative: `${name} demonstrates natural analytical problem-solving instincts. Rather than confronting ${rationaleSnippet} in dry isolation, these pathways ground technical challenges in applied tools and direct workforce utility.`,
    },
    careers: [
      {
        id: 'career_1',
        role_title: fallbackCareers.careers[0].role_title,
        match_tier: 'Primary Direct Match',
        fit_score: fallbackCareers.careers[0].fit_score,
        fit_rationale: fallbackCareers.careers[0].fit_rationale,
        majors: fallbackCareers.careers[0].majors,
        minors: ['Applied Data Analysis', 'Technical Writing'],
        daily_tasks: fallbackCareers.careers[0].daily_tasks,
        day_in_the_life: {
          tasks: fallbackCareers.careers[0].daily_tasks,
          misconceptions: [
            'Myth: Requires calculating complex mathematical proofs all day. Reality: Focuses on architectural logic, systems automation, and practical configuration tools.',
          ],
        },
        course_challenges: fallbackCareers.careers[0].course_challenges,
        reassurance: `Unlike high school testing that creates anxiety around ${rationaleSnippet}, systems coursework is grounded in hands-on terminal commands, virtual machines, and visible server behaviors where every action yields immediate visual feedback.`,
        trial_courses: fallbackCareers.careers[0].trial_courses as any,
      },
      {
        id: 'career_2',
        role_title: fallbackCareers.careers[1].role_title,
        match_tier: 'High-Growth Pathway',
        fit_score: fallbackCareers.careers[1].fit_score,
        fit_rationale: fallbackCareers.careers[1].fit_rationale,
        majors: fallbackCareers.careers[1].majors,
        minors: ['Cyberlaw & Compliance', 'Network Security'],
        daily_tasks: fallbackCareers.careers[1].daily_tasks,
        day_in_the_life: {
          tasks: fallbackCareers.careers[1].daily_tasks,
          misconceptions: [
            'Myth: You need to be a math genius or master hacker. Reality: Most analysts focus on pattern detection, policy auditing, and tool configuration.',
          ],
        },
        course_challenges: fallbackCareers.careers[1].course_challenges,
        reassurance: fallbackCareers.careers[1].reassurance,
        trial_courses: fallbackCareers.careers[1].trial_courses as any,
      },
      {
        id: 'career_3',
        role_title: fallbackCareers.careers[2].role_title,
        match_tier: 'Interdisciplinary Pivot',
        fit_score: fallbackCareers.careers[2].fit_score,
        fit_rationale: fallbackCareers.careers[2].fit_rationale,
        majors: fallbackCareers.careers[2].majors,
        minors: ['Health Information Systems', 'Business Intelligence'],
        daily_tasks: fallbackCareers.careers[2].daily_tasks,
        day_in_the_life: {
          tasks: fallbackCareers.careers[2].daily_tasks,
          misconceptions: [
            'Myth: You code in total social isolation. Reality: You collaborate closely with healthcare teams to improve patient workflows.',
          ],
        },
        course_challenges: fallbackCareers.careers[2].course_challenges,
        reassurance: fallbackCareers.careers[2].reassurance,
        trial_courses: fallbackCareers.careers[2].trial_courses as any,
      },
      {
        id: 'career_4',
        role_title: fallbackCareers.careers[3].role_title,
        match_tier: 'Moonshot Trajectory',
        fit_score: fallbackCareers.careers[3].fit_score,
        fit_rationale: fallbackCareers.careers[3].fit_rationale,
        majors: fallbackCareers.careers[3].majors,
        minors: ['3D Modeling & Robotics', 'Applied Physics'],
        daily_tasks: fallbackCareers.careers[3].daily_tasks,
        day_in_the_life: {
          tasks: fallbackCareers.careers[3].daily_tasks,
          misconceptions: [
            'Myth: Requires advanced theoretical calculus derivations. Reality: Visual simulation software lets you adjust real-world physics parameters interactively.',
          ],
        },
        course_challenges: fallbackCareers.careers[3].course_challenges,
        reassurance: fallbackCareers.careers[3].reassurance,
        trial_courses: fallbackCareers.careers[3].trial_courses as any,
      },
    ],
  };
}
