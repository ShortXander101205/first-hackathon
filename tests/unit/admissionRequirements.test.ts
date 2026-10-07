import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  ADMISSION_REQUIREMENTS,
  getAdmissionRequirementsByUniversityId,
  getAllAdmissionRequirements,
  AdmissionRequirementEntry,
} from '@/data/admissionRequirements';
import { getRelatedCatalogRoles, RelatedRoleItem } from '@/data/careerCatalog';
import { AdmissionTrackChecklist } from '@/components/results/AdmissionTrackChecklist';
import { ExploreMorePaths } from '@/components/results/ExploreMorePaths';

describe('Feature 15: Curated Flagship University Admission Track Registry (AC-FIX-06)', () => {
  const EXPECTED_FLAGSHIPS = [
    'chulalongkorn',
    'kmutt',
    'mahidol',
    'kasetsart',
    'thammasat',
    'cmu',
    'bangkok-u',
  ];

  it('scaffolds exactly 7 flagship institutions with verified metadata', () => {
    assert.strictEqual(
      ADMISSION_REQUIREMENTS.length,
      7,
      'Must contain exactly 7 curated flagship university entries'
    );

    const universityIds = ADMISSION_REQUIREMENTS.map((entry) => entry.universityId);
    EXPECTED_FLAGSHIPS.forEach((expectedId) => {
      assert.ok(
        universityIds.includes(expectedId),
        `Must include flagship university: ${expectedId}`
      );
    });
  });

  it('enforces mandatory "NEEDS_CHECKING" status and official HTTPS portal links', () => {
    ADMISSION_REQUIREMENTS.forEach((entry) => {
      assert.strictEqual(
        entry.verificationStatus,
        'NEEDS_CHECKING',
        `Entry ${entry.id} must be marked as NEEDS_CHECKING`
      );

      assert.ok(
        entry.officialAdmissionsUrl.startsWith('https://'),
        `Entry ${entry.id} must provide official HTTPS URL, got: ${entry.officialAdmissionsUrl}`
      );

      assert.match(
        entry.lastCheckedDate,
        /^\d{4}-\d{2}-\d{2}$/,
        `Entry ${entry.id} must have valid ISO lastCheckedDate`
      );

      assert.ok(
        entry.studentVerificationChecklist.length >= 4,
        `Entry ${entry.id} must include at least 4 student checklist items`
      );
    });
  });

  it('strictly prohibits GPA, GPAX, and test score cutoff fields (Zero-Score Invariant)', () => {
    ADMISSION_REQUIREMENTS.forEach((entry) => {
      const keys = Object.keys(entry);
      const prohibitedKeys = [
        'gpa',
        'gpax',
        'minGpa',
        'minGpax',
        'tgat',
        'tpat',
        'alevel',
        'cutoff',
        'score',
      ];

      prohibitedKeys.forEach((prohibited) => {
        assert.ok(
          !keys.includes(prohibited),
          `Entry ${entry.id} contains prohibited property: ${prohibited}`
        );
      });

      // Verify serialized entry doesn't mention numeric GPA cutoffs
      const serialized = JSON.stringify(entry).toLowerCase();
      assert.ok(
        !serialized.includes('gpax') && !serialized.includes('minimum gpa'),
        `Entry ${entry.id} must not reference GPA/GPAX cutoffs in text`
      );
    });
  });

  it('provides deterministic lookup via getAdmissionRequirementsByUniversityId', () => {
    const chula = getAdmissionRequirementsByUniversityId('chulalongkorn');
    assert.ok(chula, 'Must find Chulalongkorn by ID');
    assert.strictEqual(chula?.universityNameEn, 'Chulalongkorn University');
    assert.strictEqual(chula?.trackEligibility, 'Science-Math track');

    const kmutt = getAdmissionRequirementsByUniversityId('KMUTT');
    assert.ok(kmutt, 'Lookup must be case-insensitive');
    assert.strictEqual(kmutt?.universityId, 'kmutt');

    const nonExistent = getAdmissionRequirementsByUniversityId('unknown-uni');
    assert.strictEqual(nonExistent, undefined, 'Must return undefined for unknown university');

    const all = getAllAdmissionRequirements();
    assert.strictEqual(all.length, 7, 'getAllAdmissionRequirements must return all 7 entries');
  });

  it('renders AdmissionTrackChecklist with interactive elements and WCAG affordances', () => {
    const entry = getAdmissionRequirementsByUniversityId('chulalongkorn')!;
    assert.ok(entry, 'Chulalongkorn entry must exist');

    const html = renderToStaticMarkup(
      React.createElement(AdmissionTrackChecklist, { admissionEntry: entry })
    );

    // Verify track eligibility badge
    assert.ok(html.includes('Science-Math track'), 'Must render track eligibility badge');
    assert.ok(html.includes('แผนการเรียนวิทยาศาสตร์-คณิตศาสตร์'), 'Must render Thai track eligibility');

    // Verify audit status badge
    assert.ok(html.includes('Needs Checking • Annual Audit'), 'Must render audit badge');

    // Verify student verification checklist items
    assert.ok(html.includes('Confirm your high school track meets minimum science'), 'Must render checklist item 1');
    assert.ok(html.includes('Verify current TCAS round deadlines'), 'Must render checklist item 2');

    // Verify touch targets and external link affordances
    assert.ok(html.includes('min-h-[44px]'), 'Must enforce 44px touch targets');
    assert.ok(html.includes('target="_blank"'), 'Must open external portal in new tab');
    assert.ok(html.includes('rel="noopener noreferrer"'), 'Must have secure rel attribute');
    assert.ok(html.includes('https://admission.chula.ac.th'), 'Must point to verified portal');

    // Verify annual TCAS disclaimer
    assert.ok(html.includes('Annual TCAS Admissions Advisory'), 'Must render annual disclaimer title');
  });
});

describe('Feature 15: Explore More Paths Compact Component (AC-FIX-05)', () => {
  it('selects 2-4 complementary catalog roles excluding primary recommendations', () => {
    const primaryRoles = ['Software Developer', 'Data Analyst', 'UI/UX & Product Designer', 'Web Developer'];
    const related = getRelatedCatalogRoles(primaryRoles, ['Engineering & Technology'], 3);

    assert.ok(related.length >= 2 && related.length <= 4, 'Must return between 2 and 4 roles');

    // Assert zero overlap with primary roles
    related.forEach((role) => {
      assert.ok(
        !primaryRoles.map((r) => r.toLowerCase()).includes(role.roleTitle.toLowerCase()),
        `Related role ${role.roleTitle} must not be in primary recommendations`
      );
      assert.ok(role.id, 'Role must have id');
      assert.ok(role.roleTitle, 'Role must have roleTitle');
      assert.ok(role.field, 'Role must have field');
      assert.ok(role.summary, 'Role must have summary');
      assert.ok(Array.isArray(role.standardMajors), 'Role must have standardMajors');
    });
  });

  it('renders ExploreMorePaths with accessible landmarks and print protection', () => {
    const sampleRoles: RelatedRoleItem[] = [
      {
        id: 'sample-1',
        roleTitle: 'Technical Writer & Content Strategist',
        field: 'Communication & Humanities',
        summary: 'Writes clear manuals and digital guides for modern products.',
        standardMajors: ['English Literature', 'Communication Arts'],
      },
      {
        id: 'sample-2',
        roleTitle: 'Environmental Field Scientist',
        field: 'Environmental & Agricultural Sciences',
        summary: 'Monitors ecosystems and analyzes water and soil samples.',
        standardMajors: ['Environmental Science', 'Biology'],
      },
    ];

    const html = renderToStaticMarkup(
      React.createElement(ExploreMorePaths, { relatedRoles: sampleRoles })
    );

    // Section landmark
    assert.ok(html.includes('aria-labelledby="explore-more-heading"'), 'Must have aria-labelledby');
    assert.ok(html.includes('explore-more-heading'), 'Must include heading ID');
    assert.ok(html.includes('Curious About Other Directions?'), 'Must render section heading');
    assert.ok(html.includes('Complementary Directions'), 'Must render reassurance badge');

    // Role contents
    assert.ok(html.includes('Technical Writer &amp; Content Strategist') || html.includes('Technical Writer & Content Strategist'), 'Must render role 1');
    assert.ok(html.includes('Environmental Field Scientist'), 'Must render role 2');
    assert.ok(html.includes('English Literature'), 'Must render major');

    // Print & layout fidelity
    assert.ok(html.includes('break-inside-avoid'), 'Must include print break-inside-avoid');
  });

  it('returns null gracefully when relatedRoles is empty', () => {
    const html = renderToStaticMarkup(
      React.createElement(ExploreMorePaths, { relatedRoles: [] })
    );

    assert.strictEqual(html, '', 'Must render nothing when relatedRoles is empty');
  });
});
