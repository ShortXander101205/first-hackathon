import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getMockCareerResults } from '@/data/mockCareerResults';
import { validateGuideSynthesisResult } from '@/lib/guideValidator';

describe('Subject-Aware High-Traffic Fallbacks', () => {
  const subjects = [
    { id: 'HEALTH_MEDICINE', archetype: 'The Compassionate Caregiver' },
    { id: 'BUSINESS_INNOVATION', archetype: 'The Strategic Innovator' },
    { id: 'ARTS_MEDIA', archetype: 'The Creative Storyteller' },
    { id: 'CIVICS_SOCIETY', archetype: 'The Community Advocate' },
    { id: 'ENGINEERING_PHYSICAL', archetype: 'The Applied Systems Engineer' },
    { id: 'TECH_COMPUTING', archetype: 'The Methodical Builder' },
    { id: 'EXPLORATORY_OPEN', archetype: 'The Interdisciplinary Explorer' },
  ];

  for (const subject of subjects) {
    it(`produces compliant 4-card pathway for subject ${subject.id}`, () => {
      const result = getMockCareerResults({
        studentProfile: { fullName: 'Alex Morgan', gradeLevel: 'grade_12' },
        intakeAnswers: { q2SubjectId: subject.id } as any,
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.pathways.length, 4);
      assert.strictEqual(result.summary.studentArchetype, subject.archetype);

      // Validate catalog whitelist and 2 Top Match + 2 Explore Also
      const isValid = validateGuideSynthesisResult(result);
      assert.strictEqual(isValid, true, `Result for ${subject.id} must pass catalog validation`);

      // Verify each card has required milestone and whereToStudy flags
      for (const card of result.pathways) {
        assert.ok(card.milestones?.education, 'Must have education milestone');
        assert.ok(card.milestones?.entryRole, 'Must have entryRole milestone');
        assert.ok(card.milestones?.growthRole, 'Must have growthRole milestone');
        assert.strictEqual(card.whereToStudyReady, true);
        assert.ok(card.trialCourses && card.trialCourses.length >= 2);
      }
    });
  }

  it('preserves default baseline when no payload or subject is provided', () => {
    const result = getMockCareerResults();
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.pathways.length, 4);
    assert.strictEqual(result.summary.studentArchetype, 'The Methodical Builder');
    assert.strictEqual(validateGuideSynthesisResult(result), true);
  });
});
