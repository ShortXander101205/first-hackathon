import { getMockCareerResults } from './mockCareerResults';

export interface MockAdvisorSubmission {
  id: string;
  fullName: string;
  gradeLevel: string;
  studentId: string | null;
  academicYear: number;
  createdAt: string;
  intakeAnswers: Record<string, any>;
  synthesisResult: Record<string, any>;
  notes: Array<{
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
}

export const MOCK_ADVISOR_SUBMISSIONS: MockAdvisorSubmission[] = [
  {
    id: 'sub_alex_morgan',
    fullName: 'Alex Morgan',
    gradeLevel: 'grade_12',
    studentId: 'STU-99214',
    academicYear: 2026,
    createdAt: '2026-09-18T09:30:00.000Z',
    intakeAnswers: {
      q1TaskIds: ['BUILD_SYSTEMS', 'ANALYZE_PATTERNS'],
      q2SubjectId: 'TECH_COMPUTING',
      q3AcademicHesitation:
        'I love coding and building digital systems, but abstract theoretical math proofs stress me out.',
      q4Environment: 'REMOTE_DIGITAL',
      q5ProblemSolving: 'SYSTEMATIC_LOGIC',
      q6SocialEnergy: 'INDEPENDENT_DEEP_FOCUS',
      q7StructureTolerance: 'BALANCED_MILESTONES',
      q8AcademicFriction: 'ADVANCED_MATH',
      q9HorizonPriority: 'FINANCIAL_STABILITY',
      q10PostCollegeAmbition: 'WORKFORCE_DIRECT',
    },
    synthesisResult: getMockCareerResults({
      studentProfile: { fullName: 'Alex Morgan', gradeLevel: 'grade_12', studentId: 'STU-99214' },
      intakeAnswers: {} as any,
    }),
    notes: [
      {
        id: 'note_alex_1',
        authorName: 'Kru Nan',
        content:
          'Discussed Computer Science and Software Engineering at Chulalongkorn and KMUTT. Student prefers hands-on software development over abstract mathematics.',
        createdAt: '2026-09-22T14:15:00.000Z',
      },
    ],
  },
  {
    id: 'sub_maya_lin',
    fullName: 'Maya Lin',
    gradeLevel: 'grade_11',
    studentId: 'STU-48201',
    academicYear: 2026,
    createdAt: '2026-09-25T11:45:00.000Z',
    intakeAnswers: {
      q1TaskIds: ['HELP_HUMANS', 'ANALYZE_PATTERNS'],
      q2SubjectId: 'HEALTH_MEDICINE',
      q3AcademicHesitation:
        'I want to support health and community wellness, but heavy clinical memorization and 24-hour hospital rotations worry me.',
      q4Environment: 'HEALTHCARE_COMMUNITY',
      q5ProblemSolving: 'PEOPLE_RELATIONAL',
      q6SocialEnergy: 'HIGH_CONTACT_PEOPLE',
      q7StructureTolerance: 'HIGH_STRUCTURE_CLEAR_RULES',
      q8AcademicFriction: 'HEAVY_MEMORIZATION',
      q9HorizonPriority: 'PURPOSE_IMPACT',
      q10PostCollegeAmbition: 'GRADUATE_STUDY',
    },
    synthesisResult: {
      success: true,
      summary: {
        studentArchetype: 'The Compassionate Health Navigator',
        narrativeSummary:
          'Maya brings a warm dedication to community wellness with thoughtful analytical empathy. Rather than intensive hospital ward fatigue, her pathways focus on public health coordination, epidemiology, and healthcare administration.',
      },
      pathways: [
        {
          id: 'card_maya_1',
          roleTitle: 'Public Health Coordinator',
          broadField: 'Health & Life Sciences',
          badge: 'Top Match',
          overview:
            'Designs and coordinates preventive health outreach programs, community screenings, and health education campaigns.',
          milestones: {
            education: 'Bachelor of Science in Public Health or Health Administration',
            entryRole: 'Junior Community Health Educator',
            growthRole: 'Regional Public Health Director',
          },
          majors: ['Public Health', 'Health Administration', 'Community Nursing'],
        },
        {
          id: 'card_maya_2',
          roleTitle: 'Biomedical Laboratory Specialist',
          broadField: 'Health & Life Sciences',
          badge: 'Top Match',
          overview:
            'Conducts diagnostic laboratory tests, analyzes biological samples, and validates scientific data for medical clinics.',
          milestones: {
            education: 'Bachelor of Medical Technology or Clinical Laboratory Science',
            entryRole: 'Medical Technologist',
            growthRole: 'Clinical Laboratory Manager',
          },
          majors: ['Medical Technology', 'Biomedical Science'],
        },
        {
          id: 'card_maya_3',
          roleTitle: 'Healthcare Informatics Analyst',
          broadField: 'Engineering & Technology',
          badge: 'Explore Also',
          overview:
            'Organizes hospital health records, optimizes clinic database workflows, and analyzes patient care metrics.',
          milestones: {
            education: 'Bachelor of Science in Health Informatics or Information Systems',
            entryRole: 'Clinical Data Analyst',
            growthRole: 'Healthcare Systems Director',
          },
          majors: ['Health Informatics', 'Information Technology'],
        },
        {
          id: 'card_maya_4',
          roleTitle: 'Environmental Health Officer',
          broadField: 'Agriculture & Environment',
          badge: 'Explore Also',
          overview:
            'Monitors community drinking water, investigates workplace safety standards, and prevents environmental disease outbreaks.',
          milestones: {
            education: 'Bachelor of Science in Occupational Health and Safety',
            entryRole: 'Safety Inspector',
            growthRole: 'Lead Environmental Health Officer',
          },
          majors: ['Occupational Health and Safety', 'Environmental Science'],
        },
      ],
      meta: {
        engine: 'Gemini 3.5 Flash',
      },
    },
    notes: [
      {
        id: 'note_maya_1',
        authorName: 'Advisor Davis',
        content:
          'Explored Faculty of Public Health at Mahidol University. Maya was relieved to learn about non-clinical, research-focused pathways with regular daytime hours.',
        createdAt: '2026-09-28T10:00:00.000Z',
      },
    ],
  },
  {
    id: 'sub_jordan_taylor',
    fullName: 'Jordan Taylor',
    gradeLevel: 'college_freshman',
    studentId: 'STU-10293',
    academicYear: 2026,
    createdAt: '2026-10-02T13:20:00.000Z',
    intakeAnswers: {
      q1TaskIds: ['CREATE_EXPRESS', 'BUILD_SYSTEMS'],
      q2SubjectId: 'ARTS_MEDIA',
      q3AcademicHesitation:
        'I love creative storytelling and digital visual media, but I worry about financial instability and unpredictable freelancing.',
      q4Environment: 'COLLABORATIVE_STUDIO',
      q5ProblemSolving: 'CREATIVE_EXPLORATION',
      q6SocialEnergy: 'BALANCED_TEAM',
      q7StructureTolerance: 'HIGH_AUTONOMY_AMBIGUITY',
      q8AcademicFriction: 'ISOLATED_THEORY',
      q9HorizonPriority: 'CREATIVE_AUTONOMY',
      q10PostCollegeAmbition: 'WORKFORCE_DIRECT',
    },
    synthesisResult: {
      success: true,
      summary: {
        studentArchetype: 'The Creative Interface Storyteller',
        narrativeSummary:
          'Jordan combines visual creative flair with structured digital tools. His pathways balance creative freedom with high organizational workforce demand in product design and interactive media.',
      },
      pathways: [
        {
          id: 'card_jordan_1',
          roleTitle: 'User Experience (UX) Designer',
          broadField: 'Arts, Design & Architecture',
          badge: 'Top Match',
          overview:
            'Designs intuitive digital layouts, app wireframes, and user research flows that make mobile and web software easy to use.',
          milestones: {
            education: 'Bachelor of Fine Arts in Communication Design or Interactive Media',
            entryRole: 'Junior UI/UX Designer',
            growthRole: 'Head of Product Design',
          },
          majors: ['Communication Design', 'Digital Media Arts', 'Human-Computer Interaction'],
        },
        {
          id: 'card_jordan_2',
          roleTitle: 'Digital Content Producer',
          broadField: 'Humanities & Social Sciences',
          badge: 'Top Match',
          overview:
            'Creates video storytelling, writes interactive multimedia scripts, and manages digital campaign releases.',
          milestones: {
            education: 'Bachelor of Communication Arts in Digital Journalism or Media Production',
            entryRole: 'Media Content Specialist',
            growthRole: 'Creative Media Director',
          },
          majors: ['Communication Arts', 'Digital Journalism'],
        },
        {
          id: 'card_jordan_3',
          roleTitle: 'Web Front-End Developer',
          broadField: 'Engineering & Technology',
          badge: 'Explore Also',
          overview:
            'Translates graphic mockups and interactive prototypes into functional web code using modern design systems.',
          milestones: {
            education: 'Bachelor of Science in Multimedia Technology or Computer Science',
            entryRole: 'Front-End Developer',
            growthRole: 'Lead Design Engineer',
          },
          majors: ['Multimedia Technology', 'Software Engineering'],
        },
        {
          id: 'card_jordan_4',
          roleTitle: 'Brand Communications Strategist',
          broadField: 'Business & Management',
          badge: 'Explore Also',
          overview:
            'Develops brand narratives, visual identity guidelines, and strategic market positioning for mission-driven organizations.',
          milestones: {
            education: 'Bachelor of Business Administration in Marketing or Communications',
            entryRole: 'Marketing Communications Coordinator',
            growthRole: 'Brand Strategy Director',
          },
          majors: ['Marketing', 'Public Relations'],
        },
      ],
      meta: {
        engine: 'Gemini 3.5 Flash',
      },
    },
    notes: [],
  },
];

const globalForSubmissions = globalThis as unknown as {
  inMemoryAdvisorSubmissions?: MockAdvisorSubmission[];
};

if (!globalForSubmissions.inMemoryAdvisorSubmissions) {
  globalForSubmissions.inMemoryAdvisorSubmissions = [...MOCK_ADVISOR_SUBMISSIONS];
}

export function getMockAdvisorSubmissions(): MockAdvisorSubmission[] {
  if (!globalForSubmissions.inMemoryAdvisorSubmissions) {
    globalForSubmissions.inMemoryAdvisorSubmissions = [...MOCK_ADVISOR_SUBMISSIONS];
  }
  return globalForSubmissions.inMemoryAdvisorSubmissions;
}

export function addMockAdvisorSubmission(submission: MockAdvisorSubmission): void {
  const current = getMockAdvisorSubmissions();
  // Prepend so newest is at the top; filter out any duplicate by ID; cap at 50 records
  globalForSubmissions.inMemoryAdvisorSubmissions = [
    submission,
    ...current.filter((s) => s.id !== submission.id),
  ].slice(0, 50);
}

export function findMockAdvisorSubmission(id: string): MockAdvisorSubmission | undefined {
  return getMockAdvisorSubmissions().find((s) => s.id === id);
}
