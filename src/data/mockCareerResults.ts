/**
 * PathLess: Curated High-Fidelity Mock Results (Feature 14)
 * Grounded in the 48-entry catalog whitelist across 8 approved fields.
 * Strictly enforces:
 * - Locked qualitative badges: 2 "Top Match" + 2 "Explore Also"
 * - 3-stage milestone progression (education, entryRole, growthRole) familiar in Thailand
 * - Grounded rationales connecting daily reality to student's intake choices
 * - Zero percentage fit scores
 * - Complete absence of technical and clinical jargon
 */

import { GuideResult, PathwayCard } from '@/types/career';
import { SubmissionPayload } from '@/types/api';

export function getMockCareerResults(payload?: SubmissionPayload): GuideResult {
  const fullName = payload?.studentProfile?.fullName?.trim() || 'Alex Morgan';
  const gradeLevel = payload?.studentProfile?.gradeLevel || 'grade_12';

  const pathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard] = [
    // Card 1: Top Match (Primary Focus - Engineering & Technology)
    {
      id: 'mock-pathway-1',
      roleTitle: 'Software Developer',
      broadField: 'Engineering & Technology',
      badge: 'Top Match',
      groundedRationale:
        'Because you naturally enjoy building systems and tinkering with logic, software development gives you tangible daily problems to solve in a focused digital environment.',
      overview:
        'Designs, codes, and maintains web applications and digital tools that help organizations solve operational challenges.',
      milestones: {
        education: 'Bachelor of Science in Computer Science or Software Engineering',
        entryRole: 'Junior Software Engineer or Front-End Developer',
        growthRole: 'Lead Software Architect or Engineering Team Lead',
      },
      dailyTasks: [
        'Write clean, modular code to implement web and mobile features',
        'Test and debug software components in development environments',
        'Review peer code pull requests and participate in sprint standups',
      ],
      studyPath:
        'Coursework covers object-oriented programming, data structures, database foundations, and web architecture through hands-on coding projects.',
      reassurance:
        'Instead of abstract mathematical proofs on paper, modern programming is learned through immediate visual trial and error in code editors.',
      majors: ['Computer Science', 'Software Engineering', 'Computer Engineering'],
      minors: ['Interactive Media', 'Applied Mathematics'],
      trialCourses: [
        {
          title: 'CS50x: Introduction to Computer Science',
          provider: 'edX / Harvard (Free Audit)',
          description: 'A beginner-friendly dive into algorithmic thinking and programming basics.',
          estimatedHours: 8,
          searchQuery: 'edX CS50x introduction to computer science free',
        },
        {
          title: 'Responsive Web Design Certification',
          provider: 'freeCodeCamp',
          description: 'Learn HTML, CSS, and basic interactive layout fundamentals over a weekend.',
          estimatedHours: 5,
          searchQuery: 'freeCodeCamp responsive web design free',
        },
      ],
      whereToStudyReady: true,
    },

    // Card 2: Top Match (Primary Focus - Engineering & Technology)
    {
      id: 'mock-pathway-2',
      roleTitle: 'Data Analyst',
      broadField: 'Engineering & Technology',
      badge: 'Top Match',
      groundedRationale:
        'Because you enjoy investigating patterns and breaking down complex questions methodically, data analytics lets you uncover actionable answers using spreadsheets and query tools.',
      overview:
        'Transforms messy database records into clear visual charts and actionable recommendations for decision-makers.',
      milestones: {
        education: 'Bachelor of Science in Data Science, Applied Statistics, or Information Systems',
        entryRole: 'Junior Data Analyst or Reporting Specialist',
        growthRole: 'Senior Business Intelligence Analyst or Analytics Manager',
      },
      dailyTasks: [
        'Extract and clean datasets from operational databases using SQL',
        'Build automated dashboards and charts to track key team metrics',
        'Present data insights and trend summaries to department leads',
      ],
      studyPath:
        'Studies focus on applied statistics, database management, exploratory data analysis, and dashboard visualization tools.',
      reassurance:
        'Practical analytics relies on visual tools and simple queries rather than high-stakes theoretical calculus.',
      majors: ['Data Science and Analytics', 'Applied Statistics', 'Information Systems'],
      minors: ['Business Administration', 'Marketing Analytics'],
      trialCourses: [
        {
          title: 'Google Data Analytics Certificate Foundations',
          provider: 'Coursera (Free Audit)',
          description: 'Learn how data analysts clean, organize, and visualize information.',
          estimatedHours: 6,
          searchQuery: 'Coursera Google data analytics certificate free audit',
        },
        {
          title: 'Intro to SQL: Querying and Managing Data',
          provider: 'Khan Academy',
          description: 'Learn basic database queries and tables at your own pace.',
          estimatedHours: 4,
          searchQuery: 'Khan Academy intro to SQL free',
        },
      ],
      whereToStudyReady: true,
    },

    // Card 3: Explore Also (Adjacent Focus 1 - Design & Creative Arts)
    {
      id: 'mock-pathway-3',
      roleTitle: 'UI/UX & Product Designer',
      broadField: 'Design & Creative Arts',
      badge: 'Explore Also',
      groundedRationale:
        'An adjacent creative pathway that bridges your systematic logic with visual empathy, focusing on how everyday people interact with digital products.',
      overview:
        'Designs intuitive digital interfaces and mobile apps that feel effortless, accessible, and delightful to navigate.',
      milestones: {
        education: 'Bachelor of Fine Arts in Visual Communication Design or Interactive Media',
        entryRole: 'Junior UI/UX Designer or Graphic Design Associate',
        growthRole: 'Lead Product Designer or Design Systems Director',
      },
      dailyTasks: [
        'Sketch user wireframes and interactive prototypes in design software',
        'Conduct usability interviews to see where users get stuck in app flows',
        'Partner with engineers to ensure design mockups are built accurately',
      ],
      studyPath:
        'Foundational coursework covers color theory, typography, design thinking, user research methods, and interactive prototyping.',
      reassurance:
        'You do not need to be a fine-art painter. Product design focuses on layout clarity, empathy for users, and clean organization.',
      majors: ['Visual Communication Design', 'Industrial Design', 'Digital Media and Interactive Arts'],
      minors: ['Computer Science', 'Psychology'],
      trialCourses: [
        {
          title: 'Introduction to User Experience Design',
          provider: 'Coursera (Free Audit)',
          description: 'Understand core UX principles, user personas, and interface wireframing.',
          estimatedHours: 5,
          searchQuery: 'Coursera introduction to UX design free audit',
        },
        {
          title: 'Figma for Beginners UI Course',
          provider: 'YouTube / Figma Official',
          description: 'Hands-on tutorial building your first interactive mobile app prototype.',
          estimatedHours: 3,
          searchQuery: 'Figma for beginners UI design free tutorial',
        },
      ],
      whereToStudyReady: true,
    },

    // Card 4: Explore Also (Adjacent Focus 2 - Healthcare & Life Sciences)
    {
      id: 'mock-pathway-4',
      roleTitle: 'Public Health Coordinator',
      broadField: 'Healthcare & Life Sciences',
      badge: 'Explore Also',
      groundedRationale:
        'An adjacent community-centered pathway that channels your organizational instincts into improving community health programs and education without clinical hospital pressures.',
      overview:
        'Designs community programs that educate families, prevent illness, and expand access to healthy living practices.',
      milestones: {
        education: 'Bachelor of Science in Public Health or Community Health Science',
        entryRole: 'Community Health Assistant or Health Outreach Associate',
        growthRole: 'Public Health Program Manager or Health Policy Director',
      },
      dailyTasks: [
        'Organize community health screening events and preventive workshops',
        'Create accessible educational pamphlets on nutrition and hygiene',
        'Track local health trend surveys and coordinate with clinics',
      ],
      studyPath:
        'Studies cover community epidemiology, environmental health basics, health communication, and program evaluation.',
      reassurance:
        'You can make a profound difference in healthcare without having to perform surgery or memorize thousands of clinical anatomical terms.',
      majors: ['Public Health', 'Community Health', 'Health Education'],
      minors: ['Public Administration', 'Sociology and Anthropology'],
      trialCourses: [
        {
          title: 'Foundations of Global Health',
          provider: 'Coursera (Free Audit)',
          description: 'Explore epidemiology and public health systems around the world.',
          estimatedHours: 6,
          searchQuery: 'Coursera foundations of global health free audit',
        },
        {
          title: 'Community Health Workers Training Essentials',
          provider: 'edX',
          description: 'Learn how community health programs coordinate care and preventive education.',
          estimatedHours: 4,
          searchQuery: 'edX community health workers essentials free',
        },
      ],
      whereToStudyReady: true,
    },
  ];

  return {
    success: true,
    submissionId: `sub_mock_${Date.now()}`,
    studentProfile: {
      fullName,
      gradeLevel,
      studentId: payload?.studentProfile?.studentId,
    },
    summary: {
      studentArchetype: 'The Methodical Builder',
      narrativeSummary: `${fullName} enjoys building systems and solving structured puzzles in calm environments. These pathways connect your logical strengths with accessible university programs and realistic career growth.`,
    },
    pathways,
    careers: pathways,
    meta: {
      engine: 'curated-catalog-mock-engine',
      generationLatencyMs: 38,
      fallbackUsed: true,
    },
  };
}
