import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DOSSIER_COPY } from '@/constants/dossierCopy';

describe('Feature 6 Centralized Dossier Copy Unit Tests', () => {
  it('contains all required top-level copy blocks', () => {
    assert.ok(DOSSIER_COPY.header, 'header section must be defined');
    assert.ok(DOSSIER_COPY.tiers, 'tiers section must be defined');
    assert.ok(DOSSIER_COPY.card, 'card section must be defined');
    assert.ok(DOSSIER_COPY.realityCheck, 'realityCheck section must be defined');
    assert.ok(DOSSIER_COPY.academics, 'academics section must be defined');
    assert.ok(DOSSIER_COPY.trialCourses, 'trialCourses section must be defined');
    assert.ok(DOSSIER_COPY.loading, 'loading section must be defined');
    assert.ok(DOSSIER_COPY.mockNotice, 'mockNotice section must be defined');
    assert.ok(DOSSIER_COPY.footer, 'footer section must be defined');
    assert.ok(DOSSIER_COPY.error, 'error section must be defined');
    assert.ok(DOSSIER_COPY.a11y, 'a11y section must be defined');
  });

  describe('Header & Title Personalization', () => {
    it('formats title with student nickname when provided', () => {
      const title = DOSSIER_COPY.header.title('Jordan');
      assert.equal(title, "Jordan's Career & Major Pathways");
    });

    it('trims whitespace from nickname', () => {
      const title = DOSSIER_COPY.header.title('  Alex  ');
      assert.equal(title, "Alex's Career & Major Pathways");
    });

    it('falls back to default title when nickname is omitted or empty', () => {
      assert.equal(DOSSIER_COPY.header.title(''), 'Your Career & Major Pathways');
      assert.equal(DOSSIER_COPY.header.title(undefined), 'Your Career & Major Pathways');
      assert.equal(DOSSIER_COPY.header.title('   '), 'Your Career & Major Pathways');
    });

    it('contains calm reassurance note emphasizing springboards not life sentences', () => {
      assert.ok(
        DOSSIER_COPY.header.reassuranceNote.includes('springboards'),
        'Must contain reassurance about pathways being starting springboards'
      );
    });

    it('formats preparedFor label with trimmed student nickname', () => {
      assert.equal(DOSSIER_COPY.header.preparedFor('Jordan'), 'Prepared for Jordan');
      assert.equal(DOSSIER_COPY.header.preparedFor('  Taylor  '), 'Prepared for Taylor');
    });

    it('defines careerSectionLabel for landmark accessibility', () => {
      assert.equal(DOSSIER_COPY.header.careerSectionLabel, 'Recommended Career Pathways');
    });
  });

  describe('4-Tier Taxonomy Alignment', () => {
    it('defines labels matching the 4 designated match tiers exactly', () => {
      assert.equal(DOSSIER_COPY.tiers.primary.label, 'Primary Direct Match');
      assert.equal(DOSSIER_COPY.tiers.highGrowth.label, 'High-Growth Pathway');
      assert.equal(DOSSIER_COPY.tiers.interdisciplinary.label, 'Interdisciplinary Pivot');
      assert.equal(DOSSIER_COPY.tiers.moonshot.label, 'Moonshot Trajectory');
    });

    it('defines empathetic taglines for all 4 tiers', () => {
      assert.ok(DOSSIER_COPY.tiers.primary.tagline.length > 10);
      assert.ok(DOSSIER_COPY.tiers.highGrowth.tagline.length > 10);
      assert.ok(DOSSIER_COPY.tiers.interdisciplinary.tagline.length > 10);
      assert.ok(DOSSIER_COPY.tiers.moonshot.tagline.length > 10);
    });
  });

  describe('Card & Fit Score Reframing', () => {
    it('formats fit scores into alignment percentage', () => {
      assert.equal(DOSSIER_COPY.card.fitScoreLabel(96), '96% Alignment');
      assert.equal(DOSSIER_COPY.card.fitScoreLabel(84), '84% Alignment');
    });

    it('provides clear clarification that fit scores are not academic grades', () => {
      assert.ok(
        DOSSIER_COPY.card.fitScoreClarification.includes('not an academic grade'),
        'Must clarify that scores are not academic grades'
      );
    });
  });

  describe('Reality Check & Misconceptions', () => {
    it('defines Myth and Reality delimiters', () => {
      assert.equal(DOSSIER_COPY.realityCheck.mythPrefix, 'Myth:');
      assert.equal(DOSSIER_COPY.realityCheck.realityPrefix, 'Reality:');
      assert.ok(DOSSIER_COPY.realityCheck.tasksSubtitle.length > 5);
    });
  });

  describe('Trial Courses Copy', () => {
    it('formats estimated hours into badge string', () => {
      assert.equal(DOSSIER_COPY.trialCourses.hoursBadge(6), '~6 hrs');
      assert.equal(DOSSIER_COPY.trialCourses.hoursBadge(3), '~3 hrs');
    });

    it('contains zero tuition reassurance badge', () => {
      assert.ok(
        DOSSIER_COPY.trialCourses.zeroCostBadge.includes('Zero Tuition'),
        'Must emphasize zero tuition'
      );
    });
  });

  describe('Loading State Reassurance Cycler', () => {
    it('contains exactly 5 cycling progressive reassurance phrases', () => {
      assert.equal(DOSSIER_COPY.loading.messages.length, 5);
      DOSSIER_COPY.loading.messages.forEach((msg) => {
        assert.ok(typeof msg === 'string' && msg.length > 10);
      });
    });

    it('includes calming note for anxious students', () => {
      assert.ok(
        DOSSIER_COPY.loading.calmNote.includes('deep breath'),
        'Loading state should invite a deep breath'
      );
    });

    it('formats personalized loading title with trimmed student nickname', () => {
      assert.equal(
        DOSSIER_COPY.loading.personalizedTitle('Jordan'),
        'Alex is crafting pathways for Jordan...'
      );
      assert.equal(
        DOSSIER_COPY.loading.personalizedTitle('  Morgan  '),
        'Alex is crafting pathways for Morgan...'
      );
    });
  });

  describe('Mock Notice Banner & Error Recovery', () => {
    it('defines non-stigmatizing mock notice copy', () => {
      assert.ok(DOSSIER_COPY.mockNotice.title.includes('Curated Demonstration'));
      assert.ok(!DOSSIER_COPY.mockNotice.description.includes('429'));
      assert.ok(!DOSSIER_COPY.mockNotice.description.includes('failure'));
    });

    it('defines actionable error recovery copy with retry and edit answers options', () => {
      assert.ok(DOSSIER_COPY.error.retryButton.length > 0);
      assert.ok(DOSSIER_COPY.error.editAnswersButton.length > 0);
      assert.ok(DOSSIER_COPY.error.message.includes('safe'));
    });
  });

  describe('Accessibility Announcements', () => {
    it('defines descriptive screen reader announcements', () => {
      assert.equal(
        DOSSIER_COPY.a11y.cardTierAnnouncement('Primary Direct Match', 'Cloud Architect'),
        'Primary Direct Match: Cloud Architect'
      );
      assert.equal(
        DOSSIER_COPY.a11y.fitScoreAnnouncement(92),
        'Calculated profile alignment score of 92 percent'
      );
      assert.ok(DOSSIER_COPY.a11y.loadingAnnounce.length > 10);
    });
  });
});
