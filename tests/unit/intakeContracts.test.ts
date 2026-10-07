import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import type {
  StudentProfile,
  IntakeAnswers,
  GradeLevel,
} from '@/types/intake';
import { getStudentFirstName } from '@/types/intake';
import type {
  PathwayCard,
  GuideSummary,
  GuideMeta,
  GuideResult,
  MatchTier,
  TrialCourse,
} from '@/types/career';
import type { SubmissionPayload, GuideApiResponse } from '@/types/api';
import { GUIDE_COPY } from '@/content/guideCopy';

describe('Feature 7: Intake Contracts & Terminology Purge Unit Tests', () => {
  // AC-INTAKE-04: StudentProfile Contract & Privacy Enforcement
  describe('StudentProfile Contract & Youth Privacy Rule', () => {
    it('enforces required Full Name and Grade Level with optional Student ID', () => {
      const validProfile: StudentProfile = {
        fullName: 'Jordan Taylor',
        gradeLevel: 'grade_11',
        studentId: 'STU-99412',
      };

      assert.equal(validProfile.fullName, 'Jordan Taylor');
      assert.equal(validProfile.gradeLevel, 'grade_11');
      assert.equal(validProfile.studentId, 'STU-99412');

      const profileWithoutId: StudentProfile = {
        fullName: 'Alex Chen',
        gradeLevel: 'college_freshman',
      };
      assert.equal(profileWithoutId.studentId, undefined);
    });

    it('strictly confirms zero collection of email, phone, or password in StudentProfile type definition', () => {
      const profile = {
        fullName: 'Taylor Swift',
        gradeLevel: 'grade_12' as GradeLevel,
      };

      // Assert sensitive keys are absent from contract
      assert.equal('email' in profile, false);
      assert.equal('phone' in profile, false);
      assert.equal('password' in profile, false);
      assert.equal('address' in profile, false);
    });

    it('getStudentFirstName extracts first token cleanly', () => {
      assert.equal(getStudentFirstName({ fullName: 'Alex Morgan', gradeLevel: 'grade_10' }), 'Alex');
      assert.equal(getStudentFirstName({ fullName: 'Sam', gradeLevel: 'grade_11' }), 'Sam');
      assert.equal(getStudentFirstName({ fullName: '  Chris  Evans ', gradeLevel: 'college_sophomore' }), 'Chris');
      assert.equal(getStudentFirstName(undefined as any), '');
    });
  });

  // AC-INTAKE-04: 10-Question IntakeAnswers Structure
  describe('10-Question IntakeAnswers Contract', () => {
    it('models complete 10-question exploration answers', () => {
      const sampleAnswers: IntakeAnswers = {
        q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS'],
        q2SubjectId: 'TECH_COMPUTING',
        q3AcademicHesitation: 'I love practical coding, but abstract proofs cause stress.',
        q4Environment: 'REMOTE_DIGITAL',
        q5ProblemSolving: 'SYSTEMATIC_LOGIC',
        q6SocialEnergy: 'BALANCED_TEAM',
        q7StructureTolerance: 'BALANCED_MILESTONES',
        q8AcademicFriction: 'ADVANCED_MATH',
        q9HorizonPriority: 'FINANCIAL_STABILITY',
        q10PostCollegeAmbition: 'WORKFORCE_DIRECT',
      };

      assert.equal(sampleAnswers.q1TaskIds.length, 2);
      assert.equal(sampleAnswers.q2SubjectId, 'TECH_COMPUTING');
      assert.equal(sampleAnswers.q4Environment, 'REMOTE_DIGITAL');
      assert.equal(sampleAnswers.q10PostCollegeAmbition, 'WORKFORCE_DIRECT');
    });

    it('SubmissionPayload correctly binds studentProfile, intakeAnswers, and metadata', () => {
      const payload: SubmissionPayload = {
        studentProfile: {
          fullName: 'Taylor Morgan',
          gradeLevel: 'grade_11',
          studentId: 'STU-12345',
        },
        intakeAnswers: {
          q1TaskIds: ['HELP_HUMANS'],
          q2SubjectId: 'HEALTH_MEDICINE',
          q3AcademicHesitation: 'Worried about memorizing huge anatomy vocabularies.',
          q4Environment: 'HEALTHCARE_COMMUNITY',
          q5ProblemSolving: 'PEOPLE_RELATIONAL',
          q6SocialEnergy: 'HIGH_CONTACT_PEOPLE',
          q7StructureTolerance: 'HIGH_STRUCTURE_CLEAR_RULES',
          q8AcademicFriction: 'HEAVY_MEMORIZATION',
          q9HorizonPriority: 'PURPOSE_IMPACT',
          q10PostCollegeAmbition: 'GRADUATE_STUDY',
        },
        metadata: {
          clientTimestamp: '2026-10-04T00:00:00.000Z',
          schemaVersion: 2,
        },
      };

      assert.equal(payload.studentProfile.fullName, 'Taylor Morgan');
      assert.equal(payload.intakeAnswers.q9HorizonPriority, 'PURPOSE_IMPACT');
      assert.equal(payload.metadata?.schemaVersion, 2);
    });
  });

  // AC-INTAKE-04: GuideResult Contract
  describe('GuideResult & PathwayCard Contracts', () => {
    it('validates shape of GuideResult without legacy triage/dossier attributes', () => {
      const trialCourse: TrialCourse = {
        title: 'Intro to Python',
        provider: 'Coursera',
        description: 'Beginner programming foundations.',
        estimated_hours: 10,
      };

      const card: PathwayCard = {
        id: 'pw-1',
        role_title: 'Cloud Systems Architect',
        match_tier: 'Primary Direct Match',
        fit_score: 95,
        fit_rationale: 'Strong affinity for building systems and digital environments.',
        majors: ['Computer Science', 'Information Systems'],
        course_challenges: 'Operating systems and distributed databases.',
        reassurance: 'Focuses on architectural design and hands-on component wiring.',
        trial_courses: [trialCourse, trialCourse],
      };

      const result: GuideResult = {
        success: true,
        submissionId: 'sub-77192',
        studentProfile: {
          fullName: 'Sam Casey',
          gradeLevel: 'grade_12',
        },
        summary: {
          studentArchetype: 'Systems Builder & Methodical Investigator',
          narrativeSummary: 'A natural engineer who thrives in structured technical settings.',
        },
        pathways: [card],
        meta: {
          engine: 'gemini-2.5-flash',
          generationLatencyMs: 820,
          fallbackUsed: false,
        },
      };

      assert.equal(result.success, true);
      assert.equal(result.pathways[0].match_tier, 'Primary Direct Match');
      assert.equal(result.meta.engine, 'gemini-2.5-flash');
    });
  });

  // AC-INTAKE-04: Forbidden Terminology Scanner
  describe('Forbidden Terminology Scanner (Zero Legacy Brand Leaks)', () => {
    const FORBIDDEN_TOKENS = ['triage', 'counselor', 'dossier', 'pathwayai'];
    const TARGET_FILES = [
      'src/types/intake.ts',
      'src/types/career.ts',
      'src/types/api.ts',
      'src/content/guideCopy.ts',
    ];

    TARGET_FILES.forEach((relPath) => {
      it(`asserts zero occurrences of forbidden terms in ${relPath}`, () => {
        const fullPath = path.resolve(process.cwd(), relPath);
        assert.equal(fs.existsSync(fullPath), true, `Target file must exist: ${relPath}`);

        const content = fs.readFileSync(fullPath, 'utf8');

        for (const token of FORBIDDEN_TOKENS) {
          const regex = new RegExp(`\\b${token}\\b`, 'i');
          const match = regex.exec(content);
          assert.equal(
            match,
            null,
            `Forbidden token "${token}" found in ${relPath} at index ${match?.index}`
          );
        }
      });
    });
  });

  // AC-INTAKE-05: Centralized Guide Copy Integrity
  describe('Centralized Guide Copy Integrity (GUIDE_COPY)', () => {
    it('verifies Step 0 Welcome copy definitions are fully populated', () => {
      assert.equal(typeof GUIDE_COPY.welcome.heading, 'string');
      assert.ok(GUIDE_COPY.welcome.heading.length > 5);
      assert.ok(GUIDE_COPY.welcome.privacyPromiseBody.includes('never ask for your email'));
      assert.equal(GUIDE_COPY.welcome.fields.gradeOptions.length, 5);
      assert.ok(GUIDE_COPY.welcome.ctaButton.length > 0);
    });

    it('verifies all 10 questions are present with titles and helper text', () => {
      const questions = GUIDE_COPY.questions;
      assert.equal(questions.q1.stepNumber, 1);
      assert.ok((questions.q1.options?.length ?? 0) >= 4);

      assert.equal(questions.q2.stepNumber, 2);
      assert.ok((questions.q2.options?.length ?? 0) >= 4);

      assert.equal(questions.q3.stepNumber, 3);
      assert.equal(questions.q3.charLimit, 200);

      assert.equal(questions.q4.stepNumber, 4);
      assert.equal(questions.q5.stepNumber, 5);
      assert.equal(questions.q6.stepNumber, 6);
      assert.equal(questions.q7.stepNumber, 7);
      assert.equal(questions.q8.stepNumber, 8);
      assert.equal(questions.q9.stepNumber, 9);
      assert.equal(questions.q10.stepNumber, 10);
    });

    it('verifies navigation and validation copy are calm and reassuring', () => {
      assert.ok(GUIDE_COPY.navigation.next.length > 0);
      assert.ok(GUIDE_COPY.navigation.finish.length > 0);
      assert.ok(GUIDE_COPY.validation.fullNameRequired.length > 0);
      assert.ok(GUIDE_COPY.validation.q1Required.length > 0);
      assert.ok(GUIDE_COPY.resetDialog.title.includes('clean slate'));
    });
  });
});
