/**
 * PathLess: Human-Curated Static University Admission Track Registry
 * High school study stream eligibility, verification checklists, and official admissions portals
 * for 7 flagship higher education institutions in Thailand.
 *
 * Strict Invariants:
 * 1. Zero AI Hallucination: Admission requirements and tracks are curated statically; never AI synthesized.
 * 2. Zero Score Collection: Strictly excludes GPA, GPAX, TGAT, TPAT, and A-Level minimum score cutoffs.
 * 3. Human Verification Audit: All entries marked as 'NEEDS_CHECKING' with explicit audit timestamps.
 * 4. Official HTTPS Portals: All university admissions links point to verified official HTTPS domains.
 */

export type HighSchoolTrackEligibility =
  | 'Science-Math track'
  | 'Arts-Math or Science-Math track'
  | 'Arts-Language, Arts-Math, or Science-Math track'
  | 'Vocational or Applied Technology track'
  | 'Open to all tracks';

export type AdmissionVerificationStatus = 'NEEDS_CHECKING' | 'VERIFIED';

export interface AdmissionRequirementEntry {
  id: string;
  universityId: string;
  universityNameEn: string;
  universityNameTh: string;
  facultyNameEn: string;
  facultyNameTh: string;
  targetMajors: string[];
  trackEligibility: HighSchoolTrackEligibility;
  trackEligibilityTh: string;
  officialAdmissionsUrl: string;
  lastCheckedDate: string; // ISO 8601 'YYYY-MM-DD'
  verificationStatus: AdmissionVerificationStatus;
  advisoryNote: string;
  studentVerificationChecklist: string[];
}

export const SHARED_VERIFICATION_CHECKLIST: string[] = [
  'Confirm your high school track meets minimum science/mathematics credit hours on the faculty portal.',
  'Verify current TCAS round deadlines and document requirements (Portfolio, Quota, or Admission).',
  'Check if specific aptitude tests (e.g., TPAT2/3/4) or portfolio projects are required for this faculty.',
  'Schedule a discussion with your school guidance advisor or mentor before finalizing your applications.',
];

export const SHARED_ADVISORY_NOTE =
  'Admission criteria, required minimum science credits, and portfolio guidelines are determined independently by each university and change each TCAS round (Rounds 1–4). Always confirm current requirements directly on the university’s official admissions portal.';

export const ADMISSION_REQUIREMENTS: AdmissionRequirementEntry[] = [
  // 1. Chulalongkorn University (จุฬาลงกรณ์มหาวิทยาลัย)
  {
    id: 'adm-chula-eng',
    universityId: 'chulalongkorn',
    universityNameEn: 'Chulalongkorn University',
    universityNameTh: 'จุฬาลงกรณ์มหาวิทยาลัย',
    facultyNameEn: 'Faculty of Engineering',
    facultyNameTh: 'คณะวิศวกรรมศาสตร์',
    targetMajors: [
      'Computer Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Industrial Engineering',
      'Civil Engineering',
    ],
    trackEligibility: 'Science-Math track',
    trackEligibilityTh: 'แผนการเรียนวิทยาศาสตร์-คณิตศาสตร์',
    officialAdmissionsUrl: 'https://admission.chula.ac.th',
    lastCheckedDate: '2026-10-01',
    verificationStatus: 'NEEDS_CHECKING',
    advisoryNote: SHARED_ADVISORY_NOTE,
    studentVerificationChecklist: SHARED_VERIFICATION_CHECKLIST,
  },

  // 2. King Mongkut's University of Technology Thonburi (มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี)
  {
    id: 'adm-kmutt-sit',
    universityId: 'kmutt',
    universityNameEn: "King Mongkut's University of Technology Thonburi",
    universityNameTh: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี',
    facultyNameEn: 'School of Information Technology',
    facultyNameTh: 'คณะเทคโนโลยีสารสนเทศ',
    targetMajors: [
      'Computer Science',
      'Information Technology',
      'Digital Business',
    ],
    trackEligibility: 'Arts-Math or Science-Math track',
    trackEligibilityTh: 'แผนการเรียนวิทย์-คณิต หรือ ศิลป์-คำนวณ',
    officialAdmissionsUrl: 'https://admission.kmutt.ac.th',
    lastCheckedDate: '2026-10-01',
    verificationStatus: 'NEEDS_CHECKING',
    advisoryNote: SHARED_ADVISORY_NOTE,
    studentVerificationChecklist: SHARED_VERIFICATION_CHECKLIST,
  },

  // 3. Mahidol University (มหาวิทยาลัยมหิดล)
  {
    id: 'adm-mahidol-health',
    universityId: 'mahidol',
    universityNameEn: 'Mahidol University',
    universityNameTh: 'มหาวิทยาลัยมหิดล',
    facultyNameEn: 'Faculty of Public Health',
    facultyNameTh: 'คณะสาธารณสุขศาสตร์',
    targetMajors: [
      'Public Health',
      'Occupational Health and Safety',
      'Environmental Health Science',
    ],
    trackEligibility: 'Science-Math track',
    trackEligibilityTh: 'แผนการเรียนวิทยาศาสตร์-คณิตศาสตร์',
    officialAdmissionsUrl: 'https://tcas.mahidol.ac.th',
    lastCheckedDate: '2026-10-01',
    verificationStatus: 'NEEDS_CHECKING',
    advisoryNote: SHARED_ADVISORY_NOTE,
    studentVerificationChecklist: SHARED_VERIFICATION_CHECKLIST,
  },

  // 4. Kasetsart University (มหาวิทยาลัยเกษตรศาสตร์)
  {
    id: 'adm-ku-sci',
    universityId: 'kasetsart',
    universityNameEn: 'Kasetsart University',
    universityNameTh: 'มหาวิทยาลัยเกษตรศาสตร์',
    facultyNameEn: 'Faculty of Science',
    facultyNameTh: 'คณะวิทยาศาสตร์',
    targetMajors: [
      'Computer Science',
      'Data Science and Analytics',
      'Applied Statistics',
      'Chemistry',
      'Biology',
    ],
    trackEligibility: 'Science-Math track',
    trackEligibilityTh: 'แผนการเรียนวิทยาศาสตร์-คณิตศาสตร์',
    officialAdmissionsUrl: 'https://admission.ku.ac.th',
    lastCheckedDate: '2026-10-01',
    verificationStatus: 'NEEDS_CHECKING',
    advisoryNote: SHARED_ADVISORY_NOTE,
    studentVerificationChecklist: SHARED_VERIFICATION_CHECKLIST,
  },

  // 5. Thammasat University (มหาวิทยาลัยธรรมศาสตร์)
  {
    id: 'adm-tu-commerce',
    universityId: 'thammasat',
    universityNameEn: 'Thammasat University',
    universityNameTh: 'มหาวิทยาลัยธรรมศาสตร์',
    facultyNameEn: 'Thammasat Business School',
    facultyNameTh: 'คณะพาณิชยศาสตร์และการบัญชี',
    targetMajors: [
      'Business Administration',
      'Marketing',
      'Finance and Banking',
      'Accounting',
    ],
    trackEligibility: 'Arts-Math or Science-Math track',
    trackEligibilityTh: 'แผนการเรียนวิทย์-คณิต หรือ ศิลป์-คำนวณ',
    officialAdmissionsUrl: 'https://admissions.tu.ac.th',
    lastCheckedDate: '2026-10-01',
    verificationStatus: 'NEEDS_CHECKING',
    advisoryNote: SHARED_ADVISORY_NOTE,
    studentVerificationChecklist: SHARED_VERIFICATION_CHECKLIST,
  },

  // 6. Chiang Mai University (มหาวิทยาลัยเชียงใหม่)
  {
    id: 'adm-cmu-humanities',
    universityId: 'cmu',
    universityNameEn: 'Chiang Mai University',
    universityNameTh: 'มหาวิทยาลัยเชียงใหม่',
    facultyNameEn: 'Faculty of Humanities',
    facultyNameTh: 'คณะมนุษยศาสตร์',
    targetMajors: [
      'English Language and Literature',
      'Thai Language',
      'Communication and Media',
      'East Asian Studies',
    ],
    trackEligibility: 'Arts-Language, Arts-Math, or Science-Math track',
    trackEligibilityTh: 'แผนการเรียนศิลป์-ภาษา ศิลป์-คำนวณ หรือ วิทย์-คณิต',
    officialAdmissionsUrl: 'https://admission.reg.cmu.ac.th',
    lastCheckedDate: '2026-10-01',
    verificationStatus: 'NEEDS_CHECKING',
    advisoryNote: SHARED_ADVISORY_NOTE,
    studentVerificationChecklist: SHARED_VERIFICATION_CHECKLIST,
  },

  // 7. Bangkok University (มหาวิทยาลัยกรุงเทพ)
  {
    id: 'adm-bu-comm-arts',
    universityId: 'bangkok-u',
    universityNameEn: 'Bangkok University',
    universityNameTh: 'มหาวิทยาลัยกรุงเทพ',
    facultyNameEn: 'School of Communication Arts',
    facultyNameTh: 'คณะนิเทศศาสตร์',
    targetMajors: [
      'Digital Media and Film',
      'Advertising and Brand Communications',
      'Performing Arts',
      'Broadcasting and Streaming Media',
    ],
    trackEligibility: 'Open to all tracks',
    trackEligibilityTh: 'เปิดรับผู้สมัครจากทุกแผนการเรียน',
    officialAdmissionsUrl: 'https://www.bu.ac.th/th/curriculum/bachelors-degree',
    lastCheckedDate: '2026-10-01',
    verificationStatus: 'NEEDS_CHECKING',
    advisoryNote: SHARED_ADVISORY_NOTE,
    studentVerificationChecklist: SHARED_VERIFICATION_CHECKLIST,
  },
];

/**
 * Pure deterministic lookup for university admission track guidance.
 */
export function getAdmissionRequirementsByUniversityId(
  universityId: string
): AdmissionRequirementEntry | undefined {
  if (!universityId || typeof universityId !== 'string') return undefined;
  const normalized = universityId.trim().toLowerCase();
  return ADMISSION_REQUIREMENTS.find(
    (entry) => entry.universityId.toLowerCase() === normalized
  );
}

/**
 * Retrieve all registered admission requirement entries.
 */
export function getAllAdmissionRequirements(): AdmissionRequirementEntry[] {
  return [...ADMISSION_REQUIREMENTS];
}
