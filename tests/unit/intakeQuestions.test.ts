import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { INTAKE_QUESTIONS } from '@/content/intakeQuestions';
import { GUIDE_COPY } from '@/content/guideCopy';
import { intakeAnswersSchema } from '@/schemas/intake.schema';
import { getMockCareerResults } from '@/data/mockCareerResults';

describe('Feature 15: 12-Question Intake Sequence & Heuristics Unit Tests', () => {
  it('AC-FIX-03: contains exactly 12 ordered questions with complete plain-language metadata', () => {
    const questionKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12'];
    
    questionKeys.forEach((key, index) => {
      const q = INTAKE_QUESTIONS[key];
      assert.ok(q, `Expected question ${key} to exist in INTAKE_QUESTIONS`);
      assert.equal(q.stepNumber, index + 1, `Expected ${key} stepNumber to be ${index + 1}`);
      assert.ok(q.title && q.title.length > 5, `Expected ${key} to have a meaningful title`);
      assert.ok(q.helperText && q.helperText.length > 5, `Expected ${key} to have supportive helperText`);
    });
  });

  it('AC-FIX-03: Q2 includes EXPLORATORY_OPEN option for open exploration', () => {
    const q2 = INTAKE_QUESTIONS.q2;
    assert.ok(q2.options, 'Expected Q2 to have options');
    const exploratoryOpt = q2.options?.find((opt) => opt.id === 'EXPLORATORY_OPEN');
    assert.ok(exploratoryOpt, 'Expected Q2 to include EXPLORATORY_OPEN option');
    assert.equal(exploratoryOpt?.badge, 'Exploratory');
  });

  it('AC-FIX-03: Q3 defines upper-high-school study streams (Grades 10–12)', () => {
    const q3 = INTAKE_QUESTIONS.q3;
    assert.ok(q3.options, 'Expected Q3 to have options');
    const optionIds = q3.options?.map((o) => o.id);
    assert.ok(optionIds?.includes('SCIENCE_MATH'));
    assert.ok(optionIds?.includes('ARTS_MATH'));
    assert.ok(optionIds?.includes('ARTS_LANGUAGE'));
    assert.ok(optionIds?.includes('VOCATIONAL_APPLIED'));
    assert.ok(optionIds?.includes('TRACK_EXPLORING'));
  });

  it('AC-FIX-03: Q9 defines concrete real-world work contexts', () => {
    const q9 = INTAKE_QUESTIONS.q9;
    assert.ok(q9.options, 'Expected Q9 to have options');
    const optionIds = q9.options?.map((o) => o.id);
    assert.ok(optionIds?.includes('DIGITAL_TECH_PRODUCTS'));
    assert.ok(optionIds?.includes('HEALTH_WELLNESS_CARE'));
    assert.ok(optionIds?.includes('ENTERPRISE_GROWTH'));
    assert.ok(optionIds?.includes('CREATIVE_MEDIA_STORYTELLING'));
    assert.ok(optionIds?.includes('PUBLIC_GOOD_COMMUNITY'));
  });

  it('AC-FIX-03: progress labels and titles are calibrated for 12 questions', () => {
    assert.equal(GUIDE_COPY.shell.stepProgressLabel(1, 12), 'Question 1 of 12');
    assert.equal(GUIDE_COPY.shell.stepProgressLabel(12, 12), 'Question 12 of 12');
    assert.equal(GUIDE_COPY.shell.stepPercentLabel(50), '50% Complete');

    // Verify all 12 step titles are defined
    for (let i = 0; i <= 12; i++) {
      assert.ok(GUIDE_COPY.stepTitles[i as keyof typeof GUIDE_COPY.stepTitles], `Expected title for step ${i}`);
    }
  });

  it('AC-FIX-03: intakeAnswersSchema parses 12-question payload with full fidelity', () => {
    const payload12 = {
      q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS'],
      q2SubjectId: 'TECH_COMPUTING',
      q3HighSchoolTrack: 'SCIENCE_MATH',
      q4AcademicHesitation: 'I worry about tough exam schedules',
      q5Environment: 'REMOTE_DIGITAL',
      q6CollaborationStyle: 'BALANCED_TEAM',
      q7ProblemSolving: 'SYSTEMATIC_LOGIC',
      q8StructureTolerance: 'BALANCED_MILESTONES',
      q9WorkContext: 'DIGITAL_TECH_PRODUCTS',
      q10AcademicFriction: 'ADVANCED_MATH',
      q11HorizonPriority: 'FINANCIAL_STABILITY',
      q12PostCollegeAmbition: 'WORKFORCE_DIRECT',
    };

    const parsed = intakeAnswersSchema.safeParse(payload12);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.q3HighSchoolTrack, 'SCIENCE_MATH');
      assert.equal(parsed.data.q9WorkContext, 'DIGITAL_TECH_PRODUCTS');
      assert.equal(parsed.data.q4AcademicHesitation, 'I worry about tough exam schedules');
      // Backward compatibility fields populated
      assert.equal(parsed.data.q3AcademicHesitation, 'I worry about tough exam schedules');
    }
  });

  it('AC-FIX-03: intakeAnswersSchema gracefully parses legacy 10-question payload without regressions', () => {
    const legacyPayload = {
      q1TaskIds: ['HELP_HUMANS'],
      q2SubjectId: 'HEALTH_MEDICINE',
      q3AcademicHesitation: 'Worried about memorizing formulas',
      q4Environment: 'HEALTHCARE_COMMUNITY',
      q5ProblemSolving: 'PEOPLE_RELATIONAL',
      q6SocialEnergy: 'HIGH_CONTACT_PEOPLE',
      q7StructureTolerance: 'HIGH_STRUCTURE_CLEAR_RULES',
      q8AcademicFriction: 'HEAVY_MEMORIZATION',
      q9HorizonPriority: 'PURPOSE_IMPACT',
      q10PostCollegeAmbition: 'WORKFORCE_DIRECT',
    };

    const parsed = intakeAnswersSchema.safeParse(legacyPayload);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.q3HighSchoolTrack, 'TRACK_EXPLORING');
      assert.equal(parsed.data.q9WorkContext, 'DIGITAL_TECH_PRODUCTS');
      assert.equal(parsed.data.q4AcademicHesitation, 'Worried about memorizing formulas');
      assert.equal(parsed.data.q3AcademicHesitation, 'Worried about memorizing formulas');
    }
  });

  it('AC-FIX-04: EXPLORATORY_OPEN produces a balanced multi-domain spread across >= 3 catalog fields', () => {
    const exploratoryPayload = {
      studentProfile: { fullName: 'Alex Rivera', gradeLevel: 'grade_11' },
      intakeAnswers: {
        q1TaskIds: ['BUILD_SYSTEMS', 'HELP_HUMANS'],
        q2SubjectId: 'EXPLORATORY_OPEN',
        q3HighSchoolTrack: 'TRACK_EXPLORING' as const,
        q4AcademicHesitation: 'Not sure what I want to do yet',
        q5Environment: 'REMOTE_DIGITAL' as const,
        q6CollaborationStyle: 'BALANCED_TEAM' as const,
        q7ProblemSolving: 'CREATIVE_EXPLORATION' as const,
        q8StructureTolerance: 'BALANCED_MILESTONES' as const,
        q9WorkContext: 'CREATIVE_MEDIA_STORYTELLING' as const,
        q10AcademicFriction: 'ISOLATED_THEORY' as const,
        q11HorizonPriority: 'CREATIVE_AUTONOMY' as const,
        q12PostCollegeAmbition: 'FLEXIBLE_ENTREPRENEURSHIP' as const,
      },
    };

    const result = getMockCareerResults(exploratoryPayload as any);
    assert.equal(result.success, true);
    assert.equal(result.pathways.length, 4);

    // Verify breadth: distinct broad fields
    const uniqueFields = new Set(result.pathways.map((card) => card.broadField));
    assert.ok(
      uniqueFields.size >= 3,
      `Expected at least 3 distinct broad fields for exploratory pathway, got ${uniqueFields.size}: ${[...uniqueFields].join(', ')}`
    );

    // Verify archetype
    assert.equal(result.summary.studentArchetype, 'The Interdisciplinary Explorer');
    assert.ok(result.summary?.narrativeSummary?.toLowerCase().includes('open to exploring'));
  });
});
