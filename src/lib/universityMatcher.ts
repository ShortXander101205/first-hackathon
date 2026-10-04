/**
 * PathLess: Pure Deterministic University Program Matcher
 * Maps career card majors to verified Thai university programs without runtime AI generation.
 * Includes Regional Balancing Heuristic to ensure equitable geographic distribution.
 * 
 * Feature 9: Thai University Scaffold
 */

import { ApprovedField } from '@/data/careerCatalog';
import { THAI_UNIVERSITIES, THAI_UNIVERSITY_PROGRAMS } from '@/data/thaiUniversities';
import {
  ThaiUniversity,
  UniversityProgram,
  UniversityProgramCardData,
  UniversityMatchResult,
} from '@/types/university';

export function getAllUniversities(): ThaiUniversity[] {
  return THAI_UNIVERSITIES;
}

export function getAllPrograms(): UniversityProgram[] {
  return THAI_UNIVERSITY_PROGRAMS;
}

export function getUniversityById(id: string): ThaiUniversity | undefined {
  return THAI_UNIVERSITIES.find((u) => u.id === id);
}

export function buildProgramCardData(program: UniversityProgram): UniversityProgramCardData | null {
  const university = getUniversityById(program.universityId);
  if (!university) return null;

  return {
    programId: program.id,
    universityId: university.id,
    universityNameEn: university.nameEn,
    universityNameTh: university.nameTh,
    universityAbbreviation: university.abbreviationEn,
    institutionType: university.type,
    region: university.region,
    campus: university.campus,
    programNameEn: program.nameEn,
    programNameTh: program.nameTh,
    facultyEn: program.facultyEn,
    facultyTh: program.facultyTh,
    degreeType: program.degreeType,
    degreeTypeTh: program.degreeTypeTh,
    field: program.field,
    mappedMajors: program.mappedMajors,
    officialWebsiteUrl: program.officialWebsiteUrl,
    verificationStatus: program.verificationStatus,
    lastChecked: program.lastChecked,
  };
}

export function findProgramsByMajor(majorName: string): UniversityProgram[] {
  const normalized = majorName.trim().toLowerCase();
  return THAI_UNIVERSITY_PROGRAMS.filter((p) =>
    p.mappedMajors.some((m) => m.toLowerCase() === normalized)
  );
}

export function findProgramsByField(field: ApprovedField): UniversityProgram[] {
  return THAI_UNIVERSITY_PROGRAMS.filter((p) => p.field === field);
}

/**
 * Applies the Regional Balancing Heuristic across matching candidate programs.
 * Ensures that if non-Central regional programs exist (Northern, Northeastern, Southern, Eastern),
 * at least 1 regional program is included alongside Central options, up to a maximum of 3 distinct institutions.
 */
function balanceRegionalPrograms(programs: UniversityProgram[]): UniversityProgram[] {
  if (programs.length <= 3) {
    const seen = new Set<string>();
    const deduplicated: UniversityProgram[] = [];
    for (const prog of programs) {
      if (!seen.has(prog.universityId)) {
        seen.add(prog.universityId);
        deduplicated.push(prog);
      }
    }
    return deduplicated;
  }

  const centralPrograms: UniversityProgram[] = [];
  const regionalPrograms: UniversityProgram[] = [];

  for (const prog of programs) {
    const uni = getUniversityById(prog.universityId);
    if (!uni) continue;
    if (uni.region === 'Central') {
      centralPrograms.push(prog);
    } else {
      regionalPrograms.push(prog);
    }
  }

  const selected: UniversityProgram[] = [];
  const seenUniversities = new Set<string>();

  // If we have non-Central regional options, prioritize at least one non-Central regional institution
  if (regionalPrograms.length > 0) {
    for (const prog of regionalPrograms) {
      if (!seenUniversities.has(prog.universityId)) {
        seenUniversities.add(prog.universityId);
        selected.push(prog);
        break; // Select first regional flagship
      }
    }
  }

  // Next, add Central options
  for (const prog of centralPrograms) {
    if (!seenUniversities.has(prog.universityId)) {
      seenUniversities.add(prog.universityId);
      selected.push(prog);
    }
    if (selected.length >= 2) break;
  }

  // Fill remaining slot(s) up to 3 from either regional or central programs
  const remainingCandidates = [...regionalPrograms, ...centralPrograms];
  for (const prog of remainingCandidates) {
    if (selected.length >= 3) break;
    if (!seenUniversities.has(prog.universityId)) {
      seenUniversities.add(prog.universityId);
      selected.push(prog);
    }
  }

  return selected.slice(0, 3);
}

/**
 * Match up to 3 verified regional programs for a pathway card.
 * Priority:
 * 1. Direct major matches across all card majors with Regional Balancing.
 * 2. If 0 matches, backfill with programs matching the broad field with Regional Balancing.
 * 3. Enforce regional and institutional diversity (no duplicate universities).
 * 4. Return clean fallback state if 0 matches exist.
 */
export function matchProgramsForCard(card: {
  majors?: string[];
  broadField?: ApprovedField | string;
}): UniversityMatchResult {
  const targetMajors = card.majors || [];
  const broadField = card.broadField as ApprovedField | undefined;

  // Pass 1: Direct major matching
  const majorCandidates: UniversityProgram[] = [];
  const seenCandidateIds = new Set<string>();

  for (const major of targetMajors) {
    const directMatches = findProgramsByMajor(major);
    for (const prog of directMatches) {
      if (!seenCandidateIds.has(prog.id)) {
        seenCandidateIds.add(prog.id);
        majorCandidates.push(prog);
      }
    }
  }

  if (majorCandidates.length > 0) {
    const balancedPrograms = balanceRegionalPrograms(majorCandidates);
    const matchedCards = balancedPrograms
      .map(buildProgramCardData)
      .filter((c): c is UniversityProgramCardData => c !== null);

    if (matchedCards.length > 0) {
      return {
        matchedPrograms: matchedCards,
        strategy: 'DIRECT_MAJOR',
        targetMajors,
        targetField: broadField,
        fallbackNoticeRequired: false,
      };
    }
  }

  // Pass 2: Broad field matching if no direct major matched
  if (broadField) {
    const fieldCandidates = findProgramsByField(broadField);
    if (fieldCandidates.length > 0) {
      const balancedPrograms = balanceRegionalPrograms(fieldCandidates);
      const matchedCards = balancedPrograms
        .map(buildProgramCardData)
        .filter((c): c is UniversityProgramCardData => c !== null);

      if (matchedCards.length > 0) {
        return {
          matchedPrograms: matchedCards,
          strategy: 'BROAD_FIELD',
          targetMajors,
          targetField: broadField,
          fallbackNoticeRequired: false,
        };
      }
    }
  }

  // Pass 3: Clean fallback state
  return {
    matchedPrograms: [],
    strategy: 'NONE',
    targetMajors,
    targetField: broadField,
    fallbackNoticeRequired: true,
  };
}
