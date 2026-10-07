import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GUIDE_COPY, RESULTS_COPY } from '@/content/guideCopy';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { INTAKE_QUESTIONS } from '@/content/intakeQuestions';

/**
 * Extracts all string values recursively from an object or array.
 */
function extractStrings(obj: any): string[] {
  const strings: string[] = [];
  if (typeof obj === 'string') {
    strings.push(obj);
  } else if (typeof obj === 'function') {
    // Test function with representative arguments
    try {
      const sample1 = obj(1, 10, 'Sample Title');
      if (typeof sample1 === 'string') strings.push(sample1);
    } catch {
      // Ignore if function requires different signature
    }
    try {
      const sample2 = obj('Alex');
      if (typeof sample2 === 'string') strings.push(sample2);
    } catch {
      // Ignore
    }
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      strings.push(...extractStrings(item));
    }
  } else if (obj !== null && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      strings.push(...extractStrings(obj[key]));
    }
  }
  return strings;
}

// Prohibited terms per AC-COPY-02
const PROHIBITED_TERMS = [
  { term: 'dossier', pattern: /\bdossier(s)?\b/i },
  { term: 'PathwayAI', pattern: /\bpathwayai\b/i },
  { term: 'Triage', pattern: /\btriage(d)?\b/i },
  { term: 'Counselor', pattern: /\bcounsel(or|ors|ing)?\b/i },
  { term: 'algorithm', pattern: /\balgorith(m|ms|mic)?\b/i },
  { term: 'AI model', pattern: /\bai model(s)?\b/i },
  { term: 'synthesis engine', pattern: /\bsynthesis engine(s)?\b/i },
  { term: 'engine', pattern: /\b(ai )?engine(s)?\b/i },
  { term: 'database', pattern: /\bdatabase\b/i },
];

describe('Feature 11 Prohibited Terminology Automated Scanner', () => {
  const guideStrings = extractStrings(GUIDE_COPY);
  const resultsStrings = extractStrings(RESULTS_COPY);
  const advisorStrings = extractStrings(ADVISOR_COPY);
  const questionStrings = extractStrings(INTAKE_QUESTIONS);

  const allStrings = [
    ...guideStrings.map((str) => ({ source: 'GUIDE_COPY', str })),
    ...resultsStrings.map((str) => ({ source: 'RESULTS_COPY', str })),
    ...advisorStrings.map((str) => ({ source: 'ADVISOR_COPY', str })),
    ...questionStrings.map((str) => ({ source: 'INTAKE_QUESTIONS', str })),
  ];

  for (const { term, pattern } of PROHIBITED_TERMS) {
    it(`strictly contains 0 occurrences of prohibited term: "${term}"`, () => {
      const violations: string[] = [];

      for (const { source, str } of allStrings) {
        if (pattern.test(str)) {
          violations.push(`[${source}] Found "${term}" in: "${str}"`);
        }
      }

      assert.equal(
        violations.length,
        0,
        `Prohibited term violations detected:\n${violations.join('\n')}`
      );
    });
  }

  it('guarantees that advisorCopy contains zero SQL or database references', () => {
    const rawText = JSON.stringify(ADVISOR_COPY);
    assert.match(
      rawText,
      /Student/i,
      'Advisor copy should use supportive student terminology'
    );
    assert.doesNotMatch(rawText, /\b(sql|foreign key|query|table row|drop table)\b/i);
  });

  it('guarantees that whereToStudy copy contains zero AI hallucination references', () => {
    const whereToStudyText = JSON.stringify(RESULTS_COPY.whereToStudy);
    assert.doesNotMatch(whereToStudyText, /\b(hallucinat(ion|ed)?|ai model)\b/i);
    assert.ok(
      RESULTS_COPY.whereToStudy.advisorVerificationNote.includes('All university pathway data is verified by academic advisors')
    );
  });
});
