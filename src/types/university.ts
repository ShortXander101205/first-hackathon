/**
 * PathLess: College Major and Career Discovery Guide v2
 * Regional Higher Education & Thai University Registry Contracts
 * Feature 9: Thai University Scaffold
 */

import { ApprovedField } from '@/data/careerCatalog';

export type ThaiRegion = 'Central' | 'Northern' | 'Northeastern' | 'Southern' | 'Eastern';

export type InstitutionType = 'PUBLIC_AUTONOMOUS' | 'PRIVATE';

export type VerificationStatus = 'NEEDS_CHECKING' | 'VERIFIED' | 'UNDER_REVIEW';

export interface ThaiUniversity {
  id: string; // Unique slug identifier (e.g., 'chulalongkorn', 'kmutt')
  nameEn: string; // English official university name
  nameTh: string; // Thai official university name
  abbreviationEn: string; // English abbreviation (e.g., 'CU', 'KMUTT', 'ABAC')
  abbreviationTh: string; // Thai abbreviation (e.g., 'จุฬาฯ', 'มจธ.', 'เอแบค')
  type: InstitutionType; // Public/Autonomous or Private
  region: ThaiRegion; // Geographical macro-region
  campus: string; // Primary campus location (e.g., 'Pathum Wan, Bangkok', 'Salaya, Nakhon Pathom')
  province: string; // Province location
  officialWebsiteUrl: string; // Official HTTPS university root portal
}

export interface UniversityProgram {
  id: string; // Unique program slug (e.g., 'cu-eng-comp')
  universityId: string; // Foreign key matching ThaiUniversity.id
  nameEn: string; // English degree program name
  nameTh: string; // Thai degree program name
  facultyEn: string; // English faculty or school name
  facultyTh: string; // Thai faculty or school name
  degreeType: string; // English degree abbreviation (e.g., 'B.Eng.', 'B.Sc.', 'B.B.A.', 'LL.B.')
  degreeTypeTh: string; // Thai MHESI degree abbreviation (e.g., 'วศ.บ.', 'วท.บ.', 'บธ.บ.', 'น.บ.')
  field: ApprovedField; // One of the 8 Feature 14 Approved Fields
  mappedMajors: string[]; // Whitelisted standard majors from CAREER_CATALOG
  officialWebsiteUrl: string; // Direct link to faculty/curriculum page (HTTPS only)
  verificationStatus: VerificationStatus; // Audit status ('NEEDS_CHECKING' by default)
  lastChecked: string; // ISO 8601 audit timestamp ('YYYY-MM-DD')
}

export interface UniversityProgramCardData {
  programId: string;
  universityId: string;
  universityNameEn: string;
  universityNameTh: string;
  universityAbbreviation: string;
  institutionType: InstitutionType;
  region: ThaiRegion;
  campus: string;
  programNameEn: string;
  programNameTh: string;
  facultyEn: string;
  facultyTh: string;
  degreeType: string;
  degreeTypeTh: string;
  field: ApprovedField;
  mappedMajors: string[];
  officialWebsiteUrl: string;
  verificationStatus: VerificationStatus;
  lastChecked: string;
}

export type MatchingStrategy = 'DIRECT_MAJOR' | 'BROAD_FIELD' | 'NONE';

export interface UniversityMatchResult {
  matchedPrograms: UniversityProgramCardData[]; // Up to 3 verified regional programs
  strategy: MatchingStrategy; // Strategy utilized for the match
  targetMajors: string[]; // Majors evaluated
  targetField?: ApprovedField | string; // Broad field evaluated
  fallbackNoticeRequired: boolean; // True when matchedPrograms is empty
}
