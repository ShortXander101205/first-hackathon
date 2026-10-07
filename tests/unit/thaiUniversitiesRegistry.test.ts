import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { THAI_UNIVERSITIES, THAI_UNIVERSITY_PROGRAMS } from '@/data/thaiUniversities';
import { APPROVED_FIELDS, CAREER_CATALOG } from '@/data/careerCatalog';

describe('Feature 9: Thai Universities Static Registry & Whitelist Tests', () => {
  it('covers exactly 17 confirmed institutions (11 public/autonomous, 6 private)', () => {
    assert.strictEqual(THAI_UNIVERSITIES.length, 17, 'Must have exactly 17 confirmed universities');

    const publicAutonomous = THAI_UNIVERSITIES.filter((u) => u.type === 'PUBLIC_AUTONOMOUS');
    const privateUnis = THAI_UNIVERSITIES.filter((u) => u.type === 'PRIVATE');

    assert.strictEqual(publicAutonomous.length, 11, 'Must have exactly 11 public/autonomous universities');
    assert.strictEqual(privateUnis.length, 6, 'Must have exactly 6 private universities');

    const expectedPublicIds = [
      'chulalongkorn',
      'kasetsart',
      'thammasat',
      'kmutt',
      'mahidol',
      'swu',
      'silpakorn',
      'cmu',
      'kku',
      'psu',
      'buu',
    ];

    const expectedPrivateIds = [
      'bangkok-u',
      'assumption',
      'rangsit',
      'utcc',
      'sripatum',
      'stamford',
    ];

    for (const id of expectedPublicIds) {
      assert.ok(
        THAI_UNIVERSITIES.some((u) => u.id === id),
        `Missing expected public institution: ${id}`
      );
    }

    for (const id of expectedPrivateIds) {
      assert.ok(
        THAI_UNIVERSITIES.some((u) => u.id === id),
        `Missing expected private institution: ${id}`
      );
    }
  });

  it('covers all 5 macro-regions across Thailand (Central, Northern, Northeastern, Southern, Eastern)', () => {
    const regions = new Set(THAI_UNIVERSITIES.map((u) => u.region));
    assert.ok(regions.has('Central'), 'Must cover Central region');
    assert.ok(regions.has('Northern'), 'Must cover Northern region (CMU)');
    assert.ok(regions.has('Northeastern'), 'Must cover Northeastern region (KKU)');
    assert.ok(regions.has('Southern'), 'Must cover Southern region (PSU)');
    assert.ok(regions.has('Eastern'), 'Must cover Eastern region (BUU)');
  });

  it('verifies that every university has complete bilingual metadata and HTTPS portal', () => {
    for (const uni of THAI_UNIVERSITIES) {
      assert.ok(uni.id, `University must have an id: ${JSON.stringify(uni)}`);
      assert.ok(uni.nameEn && uni.nameEn.length > 3, `Invalid nameEn: ${uni.id}`);
      assert.ok(uni.nameTh && uni.nameTh.length > 3, `Invalid nameTh: ${uni.id}`);
      assert.ok(uni.abbreviationEn, `Invalid abbreviationEn: ${uni.id}`);
      assert.ok(uni.abbreviationTh, `Invalid abbreviationTh: ${uni.id}`);
      assert.ok(uni.campus, `Invalid campus: ${uni.id}`);
      assert.ok(uni.province, `Invalid province: ${uni.id}`);
      assert.ok(
        uni.officialWebsiteUrl.startsWith('https://'),
        `Official website must be HTTPS: ${uni.id} (${uni.officialWebsiteUrl})`
      );
    }
  });

  it('verifies that the registry provides between 2 and 8 standard programs per institution', () => {
    for (const uni of THAI_UNIVERSITIES) {
      const programs = THAI_UNIVERSITY_PROGRAMS.filter((p) => p.universityId === uni.id);
      assert.ok(
        programs.length >= 2,
        `University ${uni.id} must have at least 2 programs, found ${programs.length}`
      );
      assert.ok(
        programs.length <= 8,
        `University ${uni.id} must not exceed 8 programs, found ${programs.length}`
      );
    }
  });

  it('verifies that all programs map strictly to one of the 8 Feature 14 ApprovedFields', () => {
    for (const prog of THAI_UNIVERSITY_PROGRAMS) {
      assert.ok(
        APPROVED_FIELDS.includes(prog.field),
        `Program ${prog.id} has invalid field: ${prog.field}`
      );
    }

    // Verify all 8 approved fields are represented in the university registry
    const representedFields = new Set(THAI_UNIVERSITY_PROGRAMS.map((p) => p.field));
    for (const field of APPROVED_FIELDS) {
      assert.ok(
        representedFields.has(field),
        `Field "${field}" must be represented in the university program registry`
      );
    }
  });

  it('verifies that all mappedMajors correspond to confirmed standard majors in CAREER_CATALOG', () => {
    const catalogMajorsSet = new Set<string>();
    CAREER_CATALOG.forEach((entry) => {
      entry.standardMajors.forEach((m) => catalogMajorsSet.add(m));
    });

    for (const prog of THAI_UNIVERSITY_PROGRAMS) {
      assert.ok(
        prog.mappedMajors.length >= 1,
        `Program ${prog.id} must have at least 1 mapped major`
      );

      for (const major of prog.mappedMajors) {
        assert.ok(
          catalogMajorsSet.has(major),
          `Program ${prog.id} maps to unwhitelisted major: "${major}"`
        );
      }
    }
  });

  it('verifies program properties: bilingual names, degree abbreviations, HTTPS links, and audit tags', () => {
    for (const prog of THAI_UNIVERSITY_PROGRAMS) {
      assert.ok(prog.id, 'Program must have an id');
      assert.ok(prog.nameEn, `Program ${prog.id} missing nameEn`);
      assert.ok(prog.nameTh, `Program ${prog.id} missing nameTh`);
      assert.ok(prog.facultyEn, `Program ${prog.id} missing facultyEn`);
      assert.ok(prog.facultyTh, `Program ${prog.id} missing facultyTh`);
      assert.ok(prog.degreeType, `Program ${prog.id} missing degreeType`);
      assert.ok(prog.degreeTypeTh, `Program ${prog.id} missing degreeTypeTh`);
      assert.ok(
        prog.officialWebsiteUrl.startsWith('https://'),
        `Program ${prog.id} URL must be secure HTTPS: ${prog.officialWebsiteUrl}`
      );
      assert.strictEqual(
        prog.verificationStatus,
        'NEEDS_CHECKING',
        `Program ${prog.id} must be initially marked as NEEDS_CHECKING`
      );
      assert.match(
        prog.lastChecked,
        /^\d{4}-\d{2}-\d{2}$/,
        `Program ${prog.id} lastChecked must be ISO YYYY-MM-DD`
      );
    }
  });

  it('strictly excludes tuition fees, admission quotas, national rankings, and commercial claims', () => {
    for (const prog of THAI_UNIVERSITY_PROGRAMS) {
      const anyProg = prog as any;
      assert.strictEqual(anyProg.tuition, undefined, 'Tuition fees must not exist');
      assert.strictEqual(anyProg.tuitionFee, undefined, 'Tuition fees must not exist');
      assert.strictEqual(anyProg.cost, undefined, 'Costs must not exist');
      assert.strictEqual(anyProg.quota, undefined, 'Admission quotas must not exist');
      assert.strictEqual(anyProg.ranking, undefined, 'Rankings must not exist');
      assert.strictEqual(anyProg.rank, undefined, 'Rankings must not exist');
    }
  });
});
