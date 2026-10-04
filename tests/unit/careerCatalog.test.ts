import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  CAREER_CATALOG,
  APPROVED_FIELDS,
  isWhitelistedTitle,
  isWhitelistedMajor,
  getCatalogEntryByTitle,
  getCareersByField,
  getAllWhitelistedTitles,
  getAllWhitelistedMajors,
} from '@/data/careerCatalog';

describe('Feature 14: Curated Career Catalog & Whitelist Validation', () => {
  it('contains exactly 8 approved broad fields', () => {
    assert.strictEqual(APPROVED_FIELDS.length, 8);
    const expectedFields = [
      'Engineering & Technology',
      'Healthcare & Life Sciences',
      'Business & Economics',
      'Design & Creative Arts',
      'Communication & Humanities',
      'Social Sciences & Law',
      'Hospitality & Tourism',
      'Environmental & Agricultural Sciences',
    ];
    assert.deepStrictEqual([...APPROVED_FIELDS], expectedFields);
  });

  it('contains exactly 48 curated entries with exactly 6 entries per field', () => {
    assert.strictEqual(CAREER_CATALOG.length, 48, 'Catalog must contain exactly 48 roles');

    for (const field of APPROVED_FIELDS) {
      const careersInField = getCareersByField(field);
      assert.strictEqual(
        careersInField.length,
        6,
        `Field "${field}" must contain exactly 6 roles, but found ${careersInField.length}`
      );
    }
  });

  it('verifies that every catalog entry has valid, complete schema properties', () => {
    for (const entry of CAREER_CATALOG) {
      assert.ok(entry.id, `Entry must have an id: ${JSON.stringify(entry)}`);
      assert.ok(entry.roleTitle, `Entry must have a roleTitle: ${entry.id}`);
      assert.ok(entry.field, `Entry must have a field: ${entry.id}`);
      assert.ok(APPROVED_FIELDS.includes(entry.field), `Field must be one of the 8 approved fields: ${entry.field}`);

      assert.ok(
        Array.isArray(entry.standardMajors) && entry.standardMajors.length >= 2,
        `Role "${entry.roleTitle}" must have at least 2 standard majors`
      );

      assert.ok(entry.milestones, `Role "${entry.roleTitle}" must have milestones`);
      assert.ok(entry.milestones.education, `Role "${entry.roleTitle}" missing education milestone`);
      assert.ok(entry.milestones.entryRole, `Role "${entry.roleTitle}" missing entryRole milestone`);
      assert.ok(entry.milestones.growthRole, `Role "${entry.roleTitle}" missing growthRole milestone`);

      assert.ok(
        Array.isArray(entry.defaultTasks) && entry.defaultTasks.length === 3,
        `Role "${entry.roleTitle}" must have exactly 3 default tasks`
      );

      assert.ok(
        entry.dayInTheLifeSummary && entry.dayInTheLifeSummary.length > 10,
        `Role "${entry.roleTitle}" must have a descriptive dayInTheLifeSummary`
      );
    }
  });

  it('verifies role title lookup helpers and whitelist confirmation', () => {
    // Valid role titles
    assert.strictEqual(isWhitelistedTitle('Software Developer'), true);
    assert.strictEqual(isWhitelistedTitle('Data Analyst'), true);
    assert.strictEqual(isWhitelistedTitle('Medical Laboratory Technologist'), true);
    assert.strictEqual(isWhitelistedTitle('Hotel & Resort Operations Supervisor'), true);
    assert.strictEqual(isWhitelistedTitle('Environmental Quality & Sustainability Officer'), true);

    // Case-insensitive lookup
    assert.strictEqual(isWhitelistedTitle('software developer'), true);
    assert.strictEqual(isWhitelistedTitle('DATA ANALYST'), true);

    // Rejection of invented / non-whitelisted terminology
    assert.strictEqual(isWhitelistedTitle('Hyper-Growth Cloud Disruptor'), false);
    assert.strictEqual(isWhitelistedTitle('Fullstack AI Ninja'), false);
    assert.strictEqual(isWhitelistedTitle('Moonshot Trajectory Lead'), false);
    assert.strictEqual(isWhitelistedTitle('Generic Specialist'), false);
    assert.strictEqual(isWhitelistedTitle(''), false);
  });

  it('verifies college major lookup helpers and whitelist confirmation', () => {
    // Valid standard majors in Thailand
    assert.strictEqual(isWhitelistedMajor('Computer Science'), true);
    assert.strictEqual(isWhitelistedMajor('Software Engineering'), true);
    assert.strictEqual(isWhitelistedMajor('Medical Technology'), true);
    assert.strictEqual(isWhitelistedMajor('Accounting'), true);
    assert.strictEqual(isWhitelistedMajor('Hospitality and Hotel Management'), true);

    // Rejection of invented majors
    assert.strictEqual(isWhitelistedMajor('Theoretical Prompt Engineering'), false);
    assert.strictEqual(isWhitelistedMajor('Hyper-Scale Growth Hacking'), false);
    assert.strictEqual(isWhitelistedMajor(''), false);
  });

  it('retrieves full lists of whitelisted titles and unique majors', () => {
    const titles = getAllWhitelistedTitles();
    assert.strictEqual(titles.length, 48);

    const majors = getAllWhitelistedMajors();
    assert.ok(majors.length >= 25, 'Should have a broad set of unique university majors');
    assert.ok(majors.includes('Computer Science'));
    assert.ok(majors.includes('Public Health'));
  });

  it('retrieves catalog entry by role title with deep object fidelity', () => {
    const entry = getCatalogEntryByTitle('Software Developer');
    assert.ok(entry);
    assert.strictEqual(entry.field, 'Engineering & Technology');
    assert.ok(entry.standardMajors.includes('Computer Science'));
    assert.ok(entry.milestones.education.includes('Computer Science'));
    assert.ok(entry.milestones.entryRole.includes('Software'));
  });
});
