/**
 * PathLess: Curated High-Fidelity Mock Results (Feature 14 & High-Traffic Dynamic Fallbacks)
 * Grounded in the 48-entry catalog whitelist across 8 approved fields in Thailand.
 * Strictly enforces:
 * - Locked qualitative badges: 2 "Top Match" + 2 "Explore Also"
 * - 3-stage milestone progression (education, entryRole, growthRole) familiar in Thailand
 * - Grounded rationales connecting daily reality to student's intake choices
 * - Dynamic subject-aware fallback matching based on Q2 (Health, Business, Arts, Civics, Engineering, Exploratory)
 * - Zero percentage fit scores
 * - Complete absence of technical and clinical jargon
 */

import { GuideResult, PathwayCard } from '@/types/career';
import { SubmissionPayload } from '@/types/api';

export function getMockCareerResults(payload?: SubmissionPayload): GuideResult {
  const fullName = payload?.studentProfile?.fullName?.trim() || 'Alex Morgan';
  const gradeLevel = payload?.studentProfile?.gradeLevel || 'grade_12';
  const subjectId = payload?.intakeAnswers?.q2SubjectId;

  // 1. Exploratory Open
  if (subjectId === 'EXPLORATORY_OPEN') {
    const exploratoryPathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard] = [
      // Card 1: Top Match (Design & Creative Arts)
      {
        id: 'mock-exploratory-1',
        roleTitle: 'UI/UX & Product Designer',
        broadField: 'Design & Creative Arts',
        badge: 'Top Match',
        groundedRationale:
          'Because you are open to exploring multiple directions, design bridges visual empathy and practical technology to build digital apps people love using.',
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

      // Card 2: Top Match (Design & Creative Arts)
      {
        id: 'mock-exploratory-2',
        roleTitle: 'Graphic & Brand Designer',
        broadField: 'Design & Creative Arts',
        badge: 'Top Match',
        groundedRationale:
          'An exploratory visual pathway channeling your open creative energy into brand identity, typography, and interactive media.',
        overview:
          'Develops visual identities, marketing artwork, and published layouts that communicate clear brand messages across print and digital media.',
        milestones: {
          education: 'Bachelor of Fine Arts in Visual Communication Design or Applied Arts',
          entryRole: 'Junior Graphic Designer or Visual Production Associate',
          growthRole: 'Art Director, Creative Lead, or Brand Identity Designer',
        },
        dailyTasks: [
          'Design visual assets, logos, and typography guidelines for organizations',
          'Prepare high-resolution print files and web-ready digital illustrations',
          'Collaborate with marketing teams to translate project briefs into visual concepts',
        ],
        studyPath:
          'Studies focus on visual aesthetics, composition, digital illustration software, and brand design theory.',
        reassurance:
          'Graphic design is learned through active portfolio practice and visual critique rather than stressful examinations.',
        majors: ['Visual Communication Design', 'Fine and Applied Arts', 'Communication Arts'],
        minors: ['Advertising', 'Marketing'],
        trialCourses: [
          {
            title: 'Graphic Design Specialization: Fundamentals',
            provider: 'Coursera / CalArts (Free Audit)',
            description: 'Learn the foundational rules of typography, image making, and composition.',
            estimatedHours: 5,
            searchQuery: 'Coursera CalArts graphic design fundamentals free audit',
          },
          {
            title: 'Canva Design School: Graphic Design Basics',
            provider: 'Canva Design School',
            description: 'Free beginner tutorials exploring layout balance, color harmony, and fonts.',
            estimatedHours: 3,
            searchQuery: 'Canva design school graphic design basics free',
          },
        ],
        whereToStudyReady: true,
      },

      // Card 3: Explore Also (Engineering & Technology)
      {
        id: 'mock-exploratory-3',
        roleTitle: 'Data Analyst',
        broadField: 'Engineering & Technology',
        badge: 'Explore Also',
        groundedRationale:
          'Because you enjoy investigating patterns, data analytics lets you uncover actionable answers using spreadsheets and query tools without getting locked into one industry.',
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

      // Card 4: Explore Also (Healthcare & Life Sciences)
      {
        id: 'mock-exploratory-4',
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
        studentArchetype: 'The Interdisciplinary Explorer',
        narrativeSummary:
          'Because you are open to exploring multiple fields, your pathways bridge creative design, practical data analysis, and human-centered healthcare to keep your future flexible.',
      },
      pathways: exploratoryPathways,
      careers: exploratoryPathways,
      meta: {
        engine: 'curated-catalog-mock-engine',
        generationLatencyMs: 38,
        fallbackUsed: true,
      },
    };
  }

  // 2. Health, Medicine & Life Sciences
  if (subjectId === 'HEALTH_MEDICINE') {
    const healthPathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard] = [
      {
        id: 'mock-health-1',
        roleTitle: 'Public Health Coordinator',
        broadField: 'Healthcare & Life Sciences',
        badge: 'Top Match',
        groundedRationale:
          'Because you care about health on a community scale, public health focuses on preventive wellness and expanding access to healthcare programs.',
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
      {
        id: 'mock-health-2',
        roleTitle: 'Medical Laboratory Technologist',
        broadField: 'Healthcare & Life Sciences',
        badge: 'Top Match',
        groundedRationale:
          'Because you are drawn to scientific investigation and human health, laboratory diagnostics provides essential data that doctors rely on to treat patients.',
        overview:
          'Analyzes clinical blood, tissue, and biological samples using diagnostic laboratory equipment to detect illness.',
        milestones: {
          education: 'Bachelor of Science in Medical Technology or Biomedical Science',
          entryRole: 'Junior Medical Technologist or Laboratory Analyst',
          growthRole: 'Senior Clinical Specialist or Laboratory Operations Lead',
        },
        dailyTasks: [
          'Perform diagnostic tests on biological specimens using automated analyzers',
          'Verify laboratory test accuracy and maintain strict quality standards',
          'Record diagnostic findings in hospital digital laboratory systems',
        ],
        studyPath:
          'Coursework covers clinical chemistry, hematology, microbiology, immunology, and diagnostic instrumentation.',
        reassurance:
          'Laboratory technology emphasizes calm, focused scientific procedure in structured environments rather than emergency ward stress.',
        majors: ['Medical Technology', 'Biomedical Science', 'Clinical Chemistry'],
        minors: ['Public Health', 'Health Informatics'],
        trialCourses: [
          {
            title: 'Clinical Laboratory Science Overview',
            provider: 'Coursera (Free Audit)',
            description: 'Understand how medical laboratories analyze clinical samples and assist physicians.',
            estimatedHours: 5,
            searchQuery: 'Coursera clinical laboratory science free audit',
          },
          {
            title: 'Introduction to Biomedical Technology',
            provider: 'edX',
            description: 'Learn the principles behind diagnostic equipment and biomedical investigations.',
            estimatedHours: 4,
            searchQuery: 'edX introduction to biomedical technology free',
          },
        ],
        whereToStudyReady: true,
      },
      {
        id: 'mock-health-3',
        roleTitle: 'Data Analyst',
        broadField: 'Engineering & Technology',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent data-driven pathway connecting health systems with analytics to identify medical trends, track recovery metrics, and improve patient outcomes.',
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
        minors: ['Public Health', 'Biostatistics'],
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
      {
        id: 'mock-health-4',
        roleTitle: 'Technical Writer & Content Strategist',
        broadField: 'Communication & Humanities',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent communication pathway translating complex medical guides and healthcare instructions into accessible, reassuring language for everyday patients.',
        overview:
          'Translates complicated technical systems and product workflows into simple, user-friendly language everyone can follow.',
        milestones: {
          education: 'Bachelor of Arts in English for Communication, Linguistics, or Journalism',
          entryRole: 'Junior Technical Writer or Documentation Specialist',
          growthRole: 'Senior Content Strategist or Documentation Team Lead',
        },
        dailyTasks: [
          'Write clear, step-by-step user manuals and technical guide articles',
          'Interview specialists to translate complex concepts into patient guides',
          'Review existing health tutorials to ensure plain language and clarity',
        ],
        studyPath:
          'Studies focus on professional writing, information architecture, user empathy, and digital content strategy.',
        reassurance:
          'Your greatest strength is clarity, active listening, and patient communication.',
        majors: ['English for Communication', 'Language and Linguistics', 'Communication Arts / Mass Communication'],
        minors: ['Health Communication', 'Public Health'],
        trialCourses: [
          {
            title: 'Technical Writing: How to Write Using Plain Language',
            provider: 'Coursera / edX (Free Audit)',
            description: 'Learn the fundamentals of clear, accessible communication for complex ideas.',
            estimatedHours: 4,
            searchQuery: 'Coursera technical writing plain language free',
          },
          {
            title: 'Google Technical Writing One',
            provider: 'Google Developers',
            description: 'Quick free self-study course on grammar, structure, and technical explanations.',
            estimatedHours: 3,
            searchQuery: 'Google developers technical writing one free course',
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
        studentArchetype: 'The Compassionate Caregiver',
        narrativeSummary: `${fullName} brings natural empathy and observant attention to human wellness. These pathways connect your interest in life sciences with clinical diagnostics, community health, and supportive healthcare communication.`,
      },
      pathways: healthPathways,
      careers: healthPathways,
      meta: {
        engine: 'curated-catalog-mock-engine',
        generationLatencyMs: 38,
        fallbackUsed: true,
      },
    };
  }

  // 3. Business & Social Enterprise
  if (subjectId === 'BUSINESS_INNOVATION') {
    const businessPathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard] = [
      {
        id: 'mock-biz-1',
        roleTitle: 'Digital Marketing & Growth Specialist',
        broadField: 'Business & Economics',
        badge: 'Top Match',
        groundedRationale:
          'Because you enjoy coordinating ideas and engaging audiences, digital marketing channels your creativity into campaigns, audience research, and brand growth.',
        overview:
          'Creates digital campaigns, manages social brand channels, and measures customer engagement to grow organizations.',
        milestones: {
          education: 'Bachelor of Business Administration in Marketing or Digital Business',
          entryRole: 'Marketing Coordinator or Social Media Associate',
          growthRole: 'Digital Marketing Manager or Brand Growth Strategist',
        },
        dailyTasks: [
          'Design and schedule social media marketing campaigns and visual assets',
          'Analyze web traffic data and audience click-through trends using analytics tools',
          'Collaborate with creative teams to draft engaging newsletters and advertisements',
        ],
        studyPath:
          'Studies cover consumer behavior, digital marketing analytics, market research methods, and brand communication strategy.',
        reassurance:
          'Modern digital marketing rewards creative intuition and empathetic storytelling rather than heavy financial calculus.',
        majors: ['Marketing', 'Business Administration', 'Communication Arts'],
        minors: ['Communication Arts', 'Data Analytics'],
        trialCourses: [
          {
            title: 'Google Digital Marketing & E-commerce Foundations',
            provider: 'Coursera (Free Audit)',
            description: 'Explore the basics of customer journeys, digital advertising, and social marketing.',
            estimatedHours: 6,
            searchQuery: 'Coursera Google digital marketing ecommerce foundations free audit',
          },
          {
            title: 'Social Media Marketing Essentials',
            provider: 'HubSpot Academy',
            description: 'Learn how modern brands craft campaigns and build authentic digital communities.',
            estimatedHours: 4,
            searchQuery: 'HubSpot social media marketing certification free',
          },
        ],
        whereToStudyReady: true,
      },
      {
        id: 'mock-biz-2',
        roleTitle: 'Financial Analyst',
        broadField: 'Business & Economics',
        badge: 'Top Match',
        groundedRationale:
          'Because you enjoy evaluating structured scenarios, financial analytics gives you the tools to guide commercial decisions and assess project growth.',
        overview:
          'Assesses financial performance, monitors economic budgets, and creates forecast models to guide business investments.',
        milestones: {
          education: 'Bachelor of Business Administration in Finance or Economics',
          entryRole: 'Junior Financial Analyst or Investment Research Associate',
          growthRole: 'Senior Financial Analyst, Finance Manager, or Strategy Associate',
        },
        dailyTasks: [
          'Analyze revenue statements and financial spreadsheets to identify trends',
          'Build forecast spreadsheets to project future project costs',
          'Prepare financial summary charts for department meetings',
        ],
        studyPath:
          'Studies cover corporate finance, financial accounting, economic principles, and spreadsheet modeling.',
        reassurance:
          'Financial analysis uses structured spreadsheets and software tools rather than theoretical handwritten formulas.',
        majors: ['Finance and Banking', 'Economics', 'Accounting'],
        minors: ['Applied Statistics', 'Business Law'],
        trialCourses: [
          {
            title: 'Financial Markets and Corporate Finance Foundations',
            provider: 'Coursera / Yale (Free Audit)',
            description: 'Understand how financial institutions and enterprises evaluate investment projects.',
            estimatedHours: 6,
            searchQuery: 'Coursera financial markets corporate finance free audit',
          },
          {
            title: 'Excel for Business and Financial Modeling',
            provider: 'edX',
            description: 'Learn the essential spreadsheet formulas used by analysts worldwide.',
            estimatedHours: 4,
            searchQuery: 'edX Excel business financial modeling free',
          },
        ],
        whereToStudyReady: true,
      },
      {
        id: 'mock-biz-3',
        roleTitle: 'UI/UX & Product Designer',
        broadField: 'Design & Creative Arts',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent creative pathway that bridges commercial product strategy with user empathy, designing digital customer experiences people enjoy.',
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
        minors: ['Marketing', 'Business Administration'],
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
      {
        id: 'mock-biz-4',
        roleTitle: 'Data Analyst',
        broadField: 'Engineering & Technology',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent analytical pathway empowering business teams with clear charts and actionable sales trends without getting bogged down in complex theory.',
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
        studentArchetype: 'The Strategic Innovator',
        narrativeSummary: `${fullName} is energized by organizing resources and turning concepts into real-world business momentum. These pathways connect your initiative with high-demand digital marketing, financial analysis, and product design.`,
      },
      pathways: businessPathways,
      careers: businessPathways,
      meta: {
        engine: 'curated-catalog-mock-engine',
        generationLatencyMs: 38,
        fallbackUsed: true,
      },
    };
  }

  // 4. Arts, Design & Media
  if (subjectId === 'ARTS_MEDIA') {
    const artsPathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard] = [
      {
        id: 'mock-arts-1',
        roleTitle: 'UI/UX & Product Designer',
        broadField: 'Design & Creative Arts',
        badge: 'Top Match',
        groundedRationale:
          'Because you enjoy visual creativity and expressing ideas clearly, product design lets you create digital apps and experiences that millions of people interact with daily.',
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
      {
        id: 'mock-arts-2',
        roleTitle: 'Graphic & Brand Designer',
        broadField: 'Design & Creative Arts',
        badge: 'Top Match',
        groundedRationale:
          'Because visual storytelling feels natural to you, graphic design channels your artistic eye into brand identities, digital publications, and creative packaging.',
        overview:
          'Develops visual identities, marketing artwork, and published layouts that communicate clear brand messages across print and digital media.',
        milestones: {
          education: 'Bachelor of Fine Arts in Visual Communication Design or Applied Arts',
          entryRole: 'Junior Graphic Designer or Visual Production Associate',
          growthRole: 'Art Director, Creative Lead, or Brand Identity Designer',
        },
        dailyTasks: [
          'Design visual assets, logos, and typography guidelines for organizations',
          'Prepare high-resolution print files and web-ready digital illustrations',
          'Collaborate with marketing teams to translate project briefs into visual concepts',
        ],
        studyPath:
          'Studies focus on visual aesthetics, composition, digital illustration software, and brand design theory.',
        reassurance:
          'Graphic design is learned through active portfolio practice and visual critique rather than stressful examinations.',
        majors: ['Visual Communication Design', 'Fine and Applied Arts', 'Communication Arts'],
        minors: ['Advertising', 'Marketing'],
        trialCourses: [
          {
            title: 'Graphic Design Specialization: Fundamentals',
            provider: 'Coursera / CalArts (Free Audit)',
            description: 'Learn the foundational rules of typography, image making, and composition.',
            estimatedHours: 5,
            searchQuery: 'Coursera CalArts graphic design fundamentals free audit',
          },
          {
            title: 'Canva Design School: Graphic Design Basics',
            provider: 'Canva Design School',
            description: 'Free beginner tutorials exploring layout balance, color harmony, and fonts.',
            estimatedHours: 3,
            searchQuery: 'Canva design school graphic design basics free',
          },
        ],
        whereToStudyReady: true,
      },
      {
        id: 'mock-arts-3',
        roleTitle: 'Technical Writer & Content Strategist',
        broadField: 'Communication & Humanities',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent creative communication pathway that pairs your visual clarity with written storytelling, organizing guides and digital product content.',
        overview:
          'Translates complicated technical systems and product workflows into simple, user-friendly language everyone can follow.',
        milestones: {
          education: 'Bachelor of Arts in English for Communication, Linguistics, or Journalism',
          entryRole: 'Junior Technical Writer or Documentation Specialist',
          growthRole: 'Senior Content Strategist or Documentation Team Lead',
        },
        dailyTasks: [
          'Write clear, step-by-step user manuals and technical guide articles',
          'Interview engineers and product specialists to translate complex concepts',
          'Review existing product tutorials to ensure plain language and clarity',
        ],
        studyPath:
          'Studies focus on professional writing, information architecture, user empathy, and digital content strategy.',
        reassurance:
          'Your greatest strength is clarity, active listening, and patient communication.',
        majors: ['English for Communication', 'Language and Linguistics', 'Communication Arts / Mass Communication'],
        minors: ['Computer Science', 'Information Studies'],
        trialCourses: [
          {
            title: 'Technical Writing: How to Write Using Plain Language',
            provider: 'Coursera / edX (Free Audit)',
            description: 'Learn the fundamentals of clear, accessible communication for complex ideas.',
            estimatedHours: 4,
            searchQuery: 'Coursera technical writing plain language free',
          },
          {
            title: 'Google Technical Writing One',
            provider: 'Google Developers',
            description: 'Quick free self-study course on grammar, structure, and technical explanations.',
            estimatedHours: 3,
            searchQuery: 'Google developers technical writing one free course',
          },
        ],
        whereToStudyReady: true,
      },
      {
        id: 'mock-arts-4',
        roleTitle: 'Digital Marketing & Growth Specialist',
        broadField: 'Business & Economics',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent commercial pathway that puts your creative design into high-visibility brand campaigns, social media, and digital storytelling.',
        overview:
          'Creates digital campaigns, manages social brand channels, and measures customer engagement to grow organizations.',
        milestones: {
          education: 'Bachelor of Business Administration in Marketing or Digital Business',
          entryRole: 'Marketing Coordinator or Social Media Associate',
          growthRole: 'Digital Marketing Manager or Brand Growth Strategist',
        },
        dailyTasks: [
          'Design and schedule social media marketing campaigns and visual assets',
          'Analyze web traffic data and audience click-through trends using analytics tools',
          'Collaborate with creative teams to draft engaging newsletters and advertisements',
        ],
        studyPath:
          'Studies cover consumer behavior, digital marketing analytics, market research methods, and brand communication strategy.',
        reassurance:
          'Modern digital marketing rewards creative intuition and empathetic storytelling rather than heavy financial calculus.',
        majors: ['Marketing', 'Business Administration', 'Communication Arts'],
        minors: ['Communication Arts', 'Graphic Design'],
        trialCourses: [
          {
            title: 'Google Digital Marketing & E-commerce Foundations',
            provider: 'Coursera (Free Audit)',
            description: 'Explore the basics of customer journeys, digital advertising, and social marketing.',
            estimatedHours: 6,
            searchQuery: 'Coursera Google digital marketing ecommerce foundations free audit',
          },
          {
            title: 'Social Media Marketing Essentials',
            provider: 'HubSpot Academy',
            description: 'Learn how modern brands craft campaigns and build authentic digital communities.',
            estimatedHours: 4,
            searchQuery: 'HubSpot social media marketing certification free',
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
        studentArchetype: 'The Creative Storyteller',
        narrativeSummary: `${fullName} expresses concepts naturally through visual art, design thinking, and empathetic communication. These pathways turn your creative talent into rewarding product design, brand identity, and digital storytelling.`,
      },
      pathways: artsPathways,
      careers: artsPathways,
      meta: {
        engine: 'curated-catalog-mock-engine',
        generationLatencyMs: 38,
        fallbackUsed: true,
      },
    };
  }

  // 5. Law, Policy & Civics
  if (subjectId === 'CIVICS_SOCIETY') {
    const civicsPathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard] = [
      {
        id: 'mock-civics-1',
        roleTitle: 'Community Development & Policy Officer',
        broadField: 'Social Sciences & Law',
        badge: 'Top Match',
        groundedRationale:
          'Because you care about civic progress and community well-being, community policy lets you analyze public issues and propose thoughtful, evidence-based improvements.',
        overview:
          'Investigates civic, economic, and community issues to prepare evidence-based recommendations for public programs and community development.',
        milestones: {
          education: 'Bachelor of Arts or Science in Political Science, Public Administration, or Sociology',
          entryRole: 'Research Assistant or Junior Policy Associate',
          growthRole: 'Senior Policy Advisor, Public Program Lead, or Think Tank Director',
        },
        dailyTasks: [
          'Review government reports, surveys, and civic community data',
          'Conduct stakeholder interviews with local neighborhood representatives',
          'Draft clear policy briefing summaries and presentation slides for leaders',
        ],
        studyPath:
          'Coursework covers political institutions, public policy analysis, social research methods, and community economics.',
        reassurance:
          'Policy research values balanced listening, clear synthesis, and empathy for citizens rather than high-stakes court confrontation.',
        majors: ['Political Science and International Relations', 'Sociology and Anthropology', 'Social Work'],
        minors: ['Economics', 'Communication Arts'],
        trialCourses: [
          {
            title: 'Public Policy Analysis Foundations',
            provider: 'Coursera (Free Audit)',
            description: 'Understand how public policies are evaluated, debated, and implemented to serve communities.',
            estimatedHours: 5,
            searchQuery: 'Coursera public policy analysis foundations free audit',
          },
          {
            title: 'Introduction to Social Research Methods',
            provider: 'edX',
            description: 'Learn how researchers conduct interviews, surveys, and civic data collection.',
            estimatedHours: 4,
            searchQuery: 'edX social research methods free',
          },
        ],
        whereToStudyReady: true,
      },
      {
        id: 'mock-civics-2',
        roleTitle: 'Legal Compliance Officer',
        broadField: 'Social Sciences & Law',
        badge: 'Top Match',
        groundedRationale:
          'Because you value fairness and structured clarity, legal compliance lets you ensure organizations uphold safety rules, ethical standards, and worker protections.',
        overview:
          'Assists in preparing legal documentation, reviews contracts, and monitors corporate policies to ensure compliance with laws and regulations.',
        milestones: {
          education: 'Bachelor of Laws (LL.B.) or Bachelor of Arts in Legal Studies',
          entryRole: 'Paralegal, Junior Compliance Officer, or Legal Research Assistant',
          growthRole: 'Corporate Compliance Manager or Regulatory Affairs Specialist',
        },
        dailyTasks: [
          'Review contracts and regulatory filings for accuracy and completeness',
          'Conduct legal precedent research in digital case registries',
          'Help draft organizational compliance guidelines and ethics checklists',
        ],
        studyPath:
          'Studies cover constitutional law, administrative law, contract foundations, statutory interpretation, and legal research writing.',
        reassurance:
          'Modern legal careers extend far beyond courtroom arguing; organizational compliance offers stable, calm teamwork in advisory roles.',
        majors: ['Law (LL.B.)', 'Public Administration', 'Business Administration'],
        minors: ['Business Administration', 'Political Science'],
        trialCourses: [
          {
            title: 'Introduction to Law and Legal Reasoning',
            provider: 'Coursera (Free Audit)',
            description: 'Explore the foundations of statutory law, contracts, and legal analysis.',
            estimatedHours: 5,
            searchQuery: 'Coursera introduction to law legal reasoning free audit',
          },
          {
            title: 'Corporate Compliance and Ethics Fundamentals',
            provider: 'edX',
            description: 'Learn how businesses uphold fair labor, environmental, and corporate integrity standards.',
            estimatedHours: 4,
            searchQuery: 'edX corporate compliance ethics free',
          },
        ],
        whereToStudyReady: true,
      },
      {
        id: 'mock-civics-3',
        roleTitle: 'Public Health Coordinator',
        broadField: 'Healthcare & Life Sciences',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent community-centered pathway connecting civic advocacy with public health education and community wellness outreach.',
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
      {
        id: 'mock-civics-4',
        roleTitle: 'Technical Writer & Content Strategist',
        broadField: 'Communication & Humanities',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent communication pathway translating civic regulations and legal requirements into transparent, readable guidance for citizens.',
        overview:
          'Translates complicated technical systems and product workflows into simple, user-friendly language everyone can follow.',
        milestones: {
          education: 'Bachelor of Arts in English for Communication, Linguistics, or Journalism',
          entryRole: 'Junior Technical Writer or Documentation Specialist',
          growthRole: 'Senior Content Strategist or Documentation Team Lead',
        },
        dailyTasks: [
          'Write clear, step-by-step user manuals and technical guide articles',
          'Interview specialists to translate complex legal regulations into plain language',
          'Review existing public guides to ensure plain language and accessibility',
        ],
        studyPath:
          'Studies focus on professional writing, information architecture, user empathy, and digital content strategy.',
        reassurance:
          'Your greatest strength is clarity, active listening, and patient communication.',
        majors: ['English for Communication', 'Language and Linguistics', 'Communication Arts / Mass Communication'],
        minors: ['Political Science and International Relations', 'Sociology and Anthropology'],
        trialCourses: [
          {
            title: 'Technical Writing: How to Write Using Plain Language',
            provider: 'Coursera / edX (Free Audit)',
            description: 'Learn the fundamentals of clear, accessible communication for complex ideas.',
            estimatedHours: 4,
            searchQuery: 'Coursera technical writing plain language free',
          },
          {
            title: 'Google Technical Writing One',
            provider: 'Google Developers',
            description: 'Quick free self-study course on grammar, structure, and technical explanations.',
            estimatedHours: 3,
            searchQuery: 'Google developers technical writing one free course',
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
        studentArchetype: 'The Community Advocate',
        narrativeSummary: `${fullName} is driven by a sense of fairness, social responsibility, and community care. These pathways connect your analytical mindset with public policy research, legal compliance, and community outreach.`,
      },
      pathways: civicsPathways,
      careers: civicsPathways,
      meta: {
        engine: 'curated-catalog-mock-engine',
        generationLatencyMs: 38,
        fallbackUsed: true,
      },
    };
  }

  // 6. Engineering & Physical Sciences
  if (subjectId === 'ENGINEERING_PHYSICAL') {
    const engineeringPhysicalPathways: [PathwayCard, PathwayCard, PathwayCard, PathwayCard] = [
      {
        id: 'mock-eng-1',
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
        majors: ['Computer Engineering', 'Computer Science', 'Software Engineering'],
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
      {
        id: 'mock-eng-2',
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
      {
        id: 'mock-eng-3',
        roleTitle: 'Renewable Energy Project Associate',
        broadField: 'Environmental & Agricultural Sciences',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent applied science pathway directing your technical and engineering mindset into green technology, clean energy systems, and sustainable infrastructure.',
        overview:
          'Coordinates solar, wind, and energy efficiency installation projects, monitoring operational performance and environmental compliance.',
        milestones: {
          education: 'Bachelor of Engineering or Science in Renewable Energy, Environmental Science, or Electrical Engineering',
          entryRole: 'Junior Energy Analyst or Project Field Associate',
          growthRole: 'Clean Energy Program Manager or Sustainability Director',
        },
        dailyTasks: [
          'Track solar and energy equipment performance using monitoring software',
          'Inspect renewable installation sites and review safety compliance',
          'Prepare environmental impact summaries and sustainability reports for clients',
        ],
        studyPath:
          'Studies cover clean power systems, environmental technology, renewable engineering foundations, and project coordination.',
        reassurance:
          'Clean energy focuses on practical modern field installations and sustainability systems rather than dry theoretical physics.',
        majors: ['Renewable Energy and Clean Technology', 'Environmental Science', 'Electrical Engineering'],
        minors: ['Project Management', 'Environmental Science'],
        trialCourses: [
          {
            title: 'Renewable Energy and Green Building Foundations',
            provider: 'Coursera (Free Audit)',
            description: 'Explore how clean energy and sustainable systems power modern cities and infrastructure.',
            estimatedHours: 5,
            searchQuery: 'Coursera renewable energy green building free audit',
          },
          {
            title: 'Introduction to Solar Energy Technology',
            provider: 'edX',
            description: 'Learn how solar cells and renewable installations generate clean power.',
            estimatedHours: 4,
            searchQuery: 'edX introduction to solar energy free',
          },
        ],
        whereToStudyReady: true,
      },
      {
        id: 'mock-eng-4',
        roleTitle: 'UI/UX & Product Designer',
        broadField: 'Design & Creative Arts',
        badge: 'Explore Also',
        groundedRationale:
          'An adjacent creative pathway that bridges your systematic logic with visual empathy, focusing on how everyday people interact with technical systems.',
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
        studentArchetype: 'The Applied Systems Engineer',
        narrativeSummary: `${fullName} enjoys understanding how mechanisms operate and applying scientific logic to tangible systems. These pathways link your problem-solving energy with scalable technology, renewable energy, and intuitive design.`,
      },
      pathways: engineeringPhysicalPathways,
      careers: engineeringPhysicalPathways,
      meta: {
        engine: 'curated-catalog-mock-engine',
        generationLatencyMs: 38,
        fallbackUsed: true,
      },
    };
  }

  // 7. Default / Technology & Computing (TECH_COMPUTING or unprovided payload)
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
