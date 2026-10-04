import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RESULTS_COPY } from '@/content/guideCopy';
import { getMockGuideRecommendations } from '@/lib/ai/mockFallback';
import { wordCount } from '@/schemas/career.schema';

describe('Feature 8: Results Copy & Terminology Validation Tests', () => {
  // Helper to extract all strings recursively from an object
  function getAllStrings(obj: any): string[] {
    const strings: string[] = [];
    function traverse(val: any) {
      if (typeof val === 'string') {
        strings.push(val);
      } else if (typeof val === 'function') {
        // Evaluate helper functions with sample values
        try {
          const res = val('Jordan', 4);
          if (typeof res === 'string') strings.push(res);
        } catch {
          // ignore
        }
      } else if (Array.isArray(val)) {
        val.forEach(traverse);
      } else if (val && typeof val === 'object') {
        Object.values(val).forEach(traverse);
      }
    }
    traverse(obj);
    return strings;
  }

  const allStrings = getAllStrings(RESULTS_COPY);

  it('contains comprehensive results copy sections', () => {
    assert.ok(RESULTS_COPY.header);
    assert.ok(RESULTS_COPY.card);
    assert.ok(RESULTS_COPY.tiers);
    assert.ok(RESULTS_COPY.whereToStudy);
    assert.ok(RESULTS_COPY.actions);
    assert.ok(RESULTS_COPY.loading);
    assert.ok(RESULTS_COPY.error);
    assert.ok(RESULTS_COPY.a11y);
  });

  it('scans all copy strings and confirms 0 occurrences of forbidden legacy terms', () => {
    const forbiddenPatterns = [
      /\bdossier\b/i,
      /\bpathwayai\b/i,
      /\btriage\b/i,
      /\bcounselor\b/i,
    ];

    for (const str of allStrings) {
      for (const pattern of forbiddenPatterns) {
        assert.ok(
          !pattern.test(str),
          `Found forbidden legacy term matching ${pattern} in string: "${str}"`
        );
      }
    }
  });

  it('scans all copy strings and confirms 0 occurrences of internal technical/AI system jargon', () => {
    const technicalJargonPatterns = [
      /\bllm\b/i,
      /\bprompt\b/i,
      /\btokens?\b/i,
      /\bschema\b/i,
      /\bjson\b/i,
      /\brfc\b/i,
      /\bendpoint\b/i,
      /\bai synthesis\b/i,
    ];

    for (const str of allStrings) {
      for (const pattern of technicalJargonPatterns) {
        assert.ok(
          !pattern.test(str),
          `Found internal technical jargon matching ${pattern} in string: "${str}"`
        );
      }
    }
  });

  it('verifies that disclaimer strictly refers to school advisor or mentor, not counselor', () => {
    const disclaimer = RESULTS_COPY.header.disclaimerBody;
    assert.ok(disclaimer.includes('school advisor, mentor, or trusted guide'));
    assert.ok(!/counselor/i.test(disclaimer));
  });

  it('verifies word count limits on all mock fallback pathway cards', () => {
    const mock = getMockGuideRecommendations({
      studentProfile: { fullName: 'Alex Rivera', gradeLevel: 'grade_12' },
      intakeAnswers: { q3AcademicHesitation: 'advanced calculus and physics' },
    });

    assert.strictEqual(mock.pathways.length, 4);

    for (const card of mock.pathways) {
      const overviewWords = wordCount(card.overview);
      const studyPathWords = wordCount(card.studyPath);
      const reassuranceWords = wordCount(card.reassurance);

      assert.ok(
        overviewWords <= 30,
        `Card ${card.roleTitle} overview exceeds 30 words (${overviewWords}): "${card.overview}"`
      );
      assert.ok(
        studyPathWords <= 65,
        `Card ${card.roleTitle} studyPath exceeds 65 words (${studyPathWords}): "${card.studyPath}"`
      );
      assert.ok(
        reassuranceWords <= 65,
        `Card ${card.roleTitle} reassurance exceeds 65 words (${reassuranceWords}): "${card.reassurance}"`
      );

      assert.strictEqual(card.trialCourses.length, 2, 'Must have exactly 2 trial courses');
      for (const course of card.trialCourses) {
        assert.ok(course.title);
        assert.ok(course.provider);
        assert.ok(course.description);
        assert.ok(course.estimatedHours > 0);
      }
    }
  });

  it('verifies that mock recommendations cover all 4 distinct tiers in exact order', () => {
    const mock = getMockGuideRecommendations();
    const tiers = mock.pathways.map((p) => p.matchTier);
    assert.deepStrictEqual(tiers, [
      'Primary Direct Match',
      'High-Growth Pathway',
      'Interdisciplinary Pivot',
      'Moonshot Trajectory',
    ]);
  });
});
