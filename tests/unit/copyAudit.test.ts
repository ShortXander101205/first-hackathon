import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GUIDE_COPY, RESULTS_COPY } from '@/content/guideCopy';
import { ADVISOR_COPY } from '@/content/advisorCopy';
import { INTAKE_QUESTIONS } from '@/content/intakeQuestions';

/**
 * Approximate syllable counter for English words.
 */
function countSyllables(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return 0;
  if (cleanWord.length <= 3) return 1;

  // Replace common endings
  let normalized = cleanWord.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  normalized = normalized.replace(/^y/, '');
  const matches = normalized.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Calculates Flesch Reading Ease and Flesch-Kincaid Grade Level.
 */
function calculateReadability(text: string): { fleschReadingEase: number; fleschKincaidGrade: number } {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const words = text.match(/\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g) || [];
  const wordCount = Math.max(1, words.length);

  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += countSyllables(word);
  }

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = totalSyllables / wordCount;

  const fleschReadingEase =
    206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const fleschKincaidGrade =
    0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;

  return {
    fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
    fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
  };
}

describe('Feature 11 Centralized Copy Audit & Readability Tests', () => {
  describe('Dictionary Completeness & Schema Integrity', () => {
    it('verifies that GUIDE_COPY contains all required top-level sections', () => {
      assert.ok(GUIDE_COPY.brand, 'brand section required');
      assert.ok(GUIDE_COPY.nav, 'nav section required');
      assert.ok(GUIDE_COPY.shell, 'shell section required');
      assert.ok(GUIDE_COPY.stepTitles, 'stepTitles section required');
      assert.ok(GUIDE_COPY.welcome, 'welcome section required');
      assert.ok(GUIDE_COPY.questions, 'questions section required');
      assert.ok(GUIDE_COPY.navigation, 'navigation section required');
      assert.ok(GUIDE_COPY.validation, 'validation section required');
      assert.ok(GUIDE_COPY.resetDialog, 'resetDialog section required');
      assert.ok(GUIDE_COPY.a11y, 'a11y section required');
    });

    it('verifies that RESULTS_COPY contains all required sections', () => {
      assert.ok(RESULTS_COPY.header, 'header section required');
      assert.ok(RESULTS_COPY.badges, 'badges section required');
      assert.ok(RESULTS_COPY.milestones, 'milestones section required');
      assert.ok(RESULTS_COPY.printHeader, 'printHeader section required');
      assert.ok(RESULTS_COPY.card, 'card section required');
      assert.ok(RESULTS_COPY.whereToStudy, 'whereToStudy section required');
      assert.ok(RESULTS_COPY.actions, 'actions section required');
      assert.ok(RESULTS_COPY.loading, 'loading section required');
      assert.ok(RESULTS_COPY.error, 'error section required');
      assert.ok(RESULTS_COPY.a11y, 'a11y section required');
    });

    it('verifies that ADVISOR_COPY contains all required sections', () => {
      assert.ok(ADVISOR_COPY.portal, 'portal section required');
      assert.ok(ADVISOR_COPY.login, 'login section required');
      assert.ok(ADVISOR_COPY.directory, 'directory section required');
      assert.ok(ADVISOR_COPY.drawer, 'drawer section required');
      assert.ok(ADVISOR_COPY.notes, 'notes section required');
      assert.ok(ADVISOR_COPY.purgeNotice, 'purgeNotice section required');
      assert.ok(ADVISOR_COPY.errors, 'errors section required');
    });

    it('verifies that INTAKE_QUESTIONS defines exactly 10 questions (q1 to q10)', () => {
      for (let i = 1; i <= 10; i++) {
        const qKey = `q${i}`;
        assert.ok(INTAKE_QUESTIONS[qKey], `Question ${qKey} must be defined`);
        assert.equal(INTAKE_QUESTIONS[qKey].stepNumber, i);
        assert.ok(INTAKE_QUESTIONS[qKey].title.length > 5);
        assert.ok(INTAKE_QUESTIONS[qKey].helperText.length > 5);
      }
    });
  });

  describe('Readability Benchmarks (Flesch-Kincaid & Flesch Reading Ease)', () => {
    it('verifies that all 10 intake question titles are plain language with FRE >= 60 and FKGL <= 10.0', () => {
      for (let i = 1; i <= 10; i++) {
        const qKey = `q${i}`;
        const title = INTAKE_QUESTIONS[qKey].title;
        const score = calculateReadability(title);

        assert.ok(
          score.fleschReadingEase >= 60.0,
          `Question ${qKey} title "${title}" has FRE of ${score.fleschReadingEase} (must be >= 60.0)`
        );
        assert.ok(
          score.fleschKincaidGrade <= 10.0,
          `Question ${qKey} title "${title}" has FKGL of ${score.fleschKincaidGrade} (must be <= 10.0)`
        );
      }
    });

    it('verifies that welcome subheading and privacy promise read at conversational levels (FRE >= 50)', () => {
      const welcomeScore = calculateReadability(GUIDE_COPY.welcome.subheading);
      assert.ok(welcomeScore.fleschReadingEase >= 50.0);

      const privacyScore = calculateReadability(GUIDE_COPY.welcome.privacyPromiseBody);
      assert.ok(privacyScore.fleschReadingEase >= 50.0);
    });

    it('verifies that 3-stage milestone progression labels use plain language', () => {
      assert.equal(RESULTS_COPY.milestones.stage1Label, '1. College Major');
      assert.equal(RESULTS_COPY.milestones.stage2Label, '2. First Job');
      assert.equal(RESULTS_COPY.milestones.stage3Label, '3. Growth Role');
    });
  });

  describe('Microcopy Bounds & String Lengths', () => {
    it('verifies that all button labels do not exceed 35 characters', () => {
      const buttonLabels = [
        GUIDE_COPY.welcome.ctaButton,
        GUIDE_COPY.navigation.previous,
        GUIDE_COPY.navigation.next,
        GUIDE_COPY.navigation.finish,
        GUIDE_COPY.resetDialog.triggerButton,
        GUIDE_COPY.resetDialog.confirm,
        GUIDE_COPY.resetDialog.cancel,
        RESULTS_COPY.actions.printButton,
        RESULTS_COPY.actions.clearButton,
        RESULTS_COPY.actions.confirmClear,
        RESULTS_COPY.actions.cancelClear,
        ADVISOR_COPY.login.submitButton,
        ADVISOR_COPY.notes.saveButton,
      ];

      for (const label of buttonLabels) {
        assert.ok(
          label.length <= 35,
          `Button label "${label}" exceeds 35 character ceiling (${label.length})`
        );
      }
    });

    it('verifies that all question helper texts do not exceed 150 characters', () => {
      for (let i = 1; i <= 10; i++) {
        const qKey = `q${i}`;
        const helper = INTAKE_QUESTIONS[qKey].helperText;
        assert.ok(
          helper.length <= 150,
          `Question ${qKey} helper text exceeds 150 characters (${helper.length})`
        );
      }
    });
  });

  describe('Dynamic Template Generators', () => {
    it('generates step progress labels accurately', () => {
      assert.equal(GUIDE_COPY.shell.stepProgressLabel(1, 10), 'Question 1 of 10');
      assert.equal(GUIDE_COPY.shell.stepProgressLabel(10, 10), 'Question 10 of 10');
      assert.equal(GUIDE_COPY.shell.stepPercentLabel(50), '50% Complete');
    });

    it('generates selection count statuses for single and multiple selections', () => {
      const q1 = INTAKE_QUESTIONS.q1;
      assert.ok(q1.selectionStatus);
      assert.equal(q1.selectionStatus(0, 2), 'Select 1 or 2 options');
      assert.equal(q1.selectionStatus(1, 2), '1 of 2 selected (you can pick 1 more)');
      assert.equal(q1.selectionStatus(2, 2), '2 of 2 selected (maximum reached)');
    });

    it('generates personalized results titles with fallback', () => {
      assert.equal(RESULTS_COPY.header.personalizedTitle('Alex'), "Alex's Recommended Pathways");
      assert.equal(RESULTS_COPY.header.defaultTitle, 'Your Recommended Pathways');
    });

    it('generates advisor directory records count string with singular/plural support', () => {
      assert.equal(ADVISOR_COPY.directory.recordsCount(1), '1 student submission found');
      assert.equal(ADVISOR_COPY.directory.recordsCount(0), '0 student submissions found');
      assert.equal(ADVISOR_COPY.directory.recordsCount(8), '8 student submissions found');
    });
  });
});
