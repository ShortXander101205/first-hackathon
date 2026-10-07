/**
 * PathLess: Curated Static Career Catalog & Whitelist
 * Confirmed list of recognizable job titles and standard university majors across 8 approved fields in Thailand.
 * Strict Invariant: LLM synthesis and mock fallbacks must select strictly from this catalog. Zero invented terminology.
 */

export type ApprovedField =
  | 'Engineering & Technology'
  | 'Healthcare & Life Sciences'
  | 'Business & Economics'
  | 'Design & Creative Arts'
  | 'Communication & Humanities'
  | 'Social Sciences & Law'
  | 'Hospitality & Tourism'
  | 'Environmental & Agricultural Sciences';

export interface CareerMilestones {
  education: string;  // Stage 1: What to study in college (Bachelor's major & degree)
  entryRole: string;  // Stage 2: Common first job after graduation (0-2 years)
  growthRole: string; // Stage 3: Later career role (3-5+ years specialization/leadership)
}

export interface CatalogCareerEntry {
  id: string;
  roleTitle: string;
  field: ApprovedField;
  standardMajors: string[];
  milestones: CareerMilestones;
  defaultTasks: string[];
  dayInTheLifeSummary: string;
}

export const APPROVED_FIELDS: ApprovedField[] = [
  'Engineering & Technology',
  'Healthcare & Life Sciences',
  'Business & Economics',
  'Design & Creative Arts',
  'Communication & Humanities',
  'Social Sciences & Law',
  'Hospitality & Tourism',
  'Environmental & Agricultural Sciences',
];

export const CAREER_CATALOG: CatalogCareerEntry[] = [
  // 1. Engineering & Technology (วิศวกรรมและเทคโนโลยี)
  {
    id: 'eng-tech-1',
    roleTitle: 'Software Developer',
    field: 'Engineering & Technology',
    standardMajors: ['Computer Engineering', 'Computer Science', 'Software Engineering'],
    milestones: {
      education: 'Bachelor of Science in Computer Science or Software Engineering',
      entryRole: 'Junior Software Engineer or Front-End Developer',
      growthRole: 'Lead Software Architect or Engineering Team Lead',
    },
    defaultTasks: [
      'Write clean, modular code to implement web and mobile features',
      'Test and debug software components in development environments',
      'Review peer code pull requests and participate in sprint standups',
    ],
    dayInTheLifeSummary: 'Designs, codes, and maintains web applications and digital tools that help organizations solve operational challenges.',
  },
  {
    id: 'eng-tech-2',
    roleTitle: 'Network & Cloud Systems Administrator',
    field: 'Engineering & Technology',
    standardMajors: ['Information Technology', 'Computer Engineering', 'Network Systems'],
    milestones: {
      education: 'Bachelor of Science in Information Technology or Network Systems',
      entryRole: 'Systems Support Specialist or Junior Cloud Operations Associate',
      growthRole: 'Cloud Infrastructure Architect or Senior Systems Administrator',
    },
    defaultTasks: [
      'Configure cloud servers and maintain virtual network connectivity',
      'Monitor automated alerts and troubleshoot infrastructure slowdowns',
      'Implement scheduled data backups and routine security patches',
    ],
    dayInTheLifeSummary: 'Keeps digital servers and cloud networks secure, reliable, and continuously operational for teams and end users.',
  },
  {
    id: 'eng-tech-3',
    roleTitle: 'Data Analyst',
    field: 'Engineering & Technology',
    standardMajors: ['Data Science and Analytics', 'Applied Statistics', 'Information Systems'],
    milestones: {
      education: 'Bachelor of Science in Data Science, Applied Statistics, or Information Systems',
      entryRole: 'Junior Data Analyst or Reporting Specialist',
      growthRole: 'Senior Business Intelligence Analyst or Analytics Manager',
    },
    defaultTasks: [
      'Extract and clean datasets from operational databases using SQL',
      'Build automated dashboards and charts to track key team metrics',
      'Present data insights and trend summaries to department leads',
    ],
    dayInTheLifeSummary: 'Transforms messy database records into clear visual charts and actionable recommendations for decision-makers.',
  },
  {
    id: 'eng-tech-4',
    roleTitle: 'Web Developer',
    field: 'Engineering & Technology',
    standardMajors: ['Information Technology', 'Computer Science', 'Software Engineering'],
    milestones: {
      education: 'Bachelor of Science in Information Technology or Computer Science',
      entryRole: 'Junior Web Developer or UI Implementation Specialist',
      growthRole: 'Senior Full-Stack Developer or Web Solutions Lead',
    },
    defaultTasks: [
      'Build responsive website layouts for mobile and desktop screens',
      'Connect frontend forms with backend database endpoints',
      'Optimize page loading speed and mobile navigation performance',
    ],
    dayInTheLifeSummary: 'Develops and styles interactive websites that make digital services easy for everyday users to access.',
  },
  {
    id: 'eng-tech-5',
    roleTitle: 'IT Support Specialist',
    field: 'Engineering & Technology',
    standardMajors: ['Information Technology', 'Computer Science', 'Electrical Engineering'],
    milestones: {
      education: 'Bachelor of Science in Information Technology or Computer Systems',
      entryRole: 'Helpdesk Support Technician or On-Site IT Coordinator',
      growthRole: 'IT Operations Supervisor or Technical Support Manager',
    },
    defaultTasks: [
      'Diagnose hardware, software, and local office network issues',
      'Set up employee laptops, security permissions, and software suites',
      'Document common technical troubleshooting steps in help guides',
    ],
    dayInTheLifeSummary: 'Provides friendly, responsive technical support to keep employees connected and productive.',
  },
  {
    id: 'eng-tech-6',
    roleTitle: 'Cybersecurity Specialist',
    field: 'Engineering & Technology',
    standardMajors: ['Computer Engineering', 'Information Technology', 'Software Engineering'],
    milestones: {
      education: 'Bachelor of Science in Computer Engineering or Information Security',
      entryRole: 'Junior Security Operations Center (SOC) Analyst',
      growthRole: 'Information Security Manager or Cybersecurity Consultant',
    },
    defaultTasks: [
      'Review automated access logs to identify suspicious network activity',
      'Execute routine vulnerability scans across internal web tools',
      'Educate staff on spotting phishing emails and safe password hygiene',
    ],
    dayInTheLifeSummary: 'Protects organizational data and network systems against unauthorized digital intrusions and vulnerabilities.',
  },

  // 2. Healthcare & Life Sciences (การแพทย์และวิทยาศาสตร์สุขภาพ)
  {
    id: 'health-life-1',
    roleTitle: 'Public Health Coordinator',
    field: 'Healthcare & Life Sciences',
    standardMajors: ['Public Health', 'Community Health', 'Health Education'],
    milestones: {
      education: 'Bachelor of Science in Public Health or Community Health Science',
      entryRole: 'Community Health Assistant or Health Outreach Associate',
      growthRole: 'Public Health Program Manager or Health Policy Director',
    },
    defaultTasks: [
      'Organize community health screening events and preventive workshops',
      'Create accessible educational pamphlets on nutrition and hygiene',
      'Track local health trend surveys and coordinate with clinics',
    ],
    dayInTheLifeSummary: 'Designs community programs that educate families, prevent illness, and expand access to healthy living practices.',
  },
  {
    id: 'health-life-2',
    roleTitle: 'Medical Laboratory Technologist',
    field: 'Healthcare & Life Sciences',
    standardMajors: ['Medical Technology', 'Biomedical Science', 'Clinical Chemistry'],
    milestones: {
      education: 'Bachelor of Science in Medical Technology or Biomedical Science',
      entryRole: 'Junior Laboratory Technologist',
      growthRole: 'Senior Clinical Lab Supervisor or Laboratory Quality Specialist',
    },
    defaultTasks: [
      'Process diagnostic blood, tissue, and fluid samples using automated analyzers',
      'Calibrate laboratory equipment and perform strict quality assurance checks',
      'Record diagnostic test results into hospital laboratory information systems',
    ],
    dayInTheLifeSummary: 'Performs precise laboratory testing that helps physicians accurately diagnose medical conditions and monitor patient treatments.',
  },
  {
    id: 'health-life-3',
    roleTitle: 'Health Data & Informatics Specialist',
    field: 'Healthcare & Life Sciences',
    standardMajors: ['Health Informatics', 'Information Technology', 'Public Health'],
    milestones: {
      education: 'Bachelor of Science in Health Informatics or Health Information Management',
      entryRole: 'Health Records Coordinator or Junior EHR Systems Specialist',
      growthRole: 'Director of Clinical Informatics or Healthcare Systems Administrator',
    },
    defaultTasks: [
      'Configure electronic health record workflows for hospital clinical staff',
      'Audit medical records for clinical coding accuracy and privacy compliance',
      'Train nurses and clinic staff on updated patient documentation tools',
    ],
    dayInTheLifeSummary: 'Bridges hospital healthcare practices with digital database systems to safeguard patient records and streamline care.',
  },
  {
    id: 'health-life-4',
    roleTitle: 'Nutritionist & Dietitian Assistant',
    field: 'Healthcare & Life Sciences',
    standardMajors: ['Food Science and Nutrition', 'Public Health', 'Biomedical Science'],
    milestones: {
      education: 'Bachelor of Science in Food Science and Nutrition or Clinical Dietetics',
      entryRole: 'Assistant Nutritionist or Dietary Program Associate',
      growthRole: 'Senior Clinical Dietitian or Wellness Nutrition Consultant',
    },
    defaultTasks: [
      'Assess nutritional needs and design personalized meal guidelines',
      'Educate patients on dietary habits to manage metabolic health',
      'Collaborate with hospital kitchen teams on therapeutic meal plans',
    ],
    dayInTheLifeSummary: 'Helps individuals develop sustainable, nourishing eating habits that support wellness and long-term health.',
  },
  {
    id: 'health-life-5',
    roleTitle: 'Occupational Health & Safety Officer',
    field: 'Healthcare & Life Sciences',
    standardMajors: ['Occupational Health and Safety', 'Public Health', 'Environmental Science'],
    milestones: {
      education: 'Bachelor of Science in Occupational Health and Safety',
      entryRole: 'Workplace Safety Officer (จป. วิชาชีพ ระดับปฏิบัติการ)',
      growthRole: 'Health, Safety, and Environment (HSE) Manager',
    },
    defaultTasks: [
      'Inspect workplace environments to detect physical hazards and ergonomics',
      'Enforce occupational health regulations and conduct fire safety drills',
      'Investigate workplace incidents and document preventative actions',
    ],
    dayInTheLifeSummary: 'Ensures workplaces protect employee safety, reduce physical strain, and comply with national health standards.',
  },
  {
    id: 'health-life-6',
    roleTitle: 'Physical Therapy Associate',
    field: 'Healthcare & Life Sciences',
    standardMajors: ['Physical Therapy', 'Biomedical Science', 'Public Health'],
    milestones: {
      education: 'Bachelor of Science in Physical Therapy or Rehabilitation Science',
      entryRole: 'Staff Physical Therapist or Clinic Rehabilitation Assistant',
      growthRole: 'Senior Rehabilitation Specialist or Clinical PT Director',
    },
    defaultTasks: [
      'Guide patients through guided mobility and rehabilitation exercises',
      'Assess muscle recovery progress following sports injuries or surgery',
      'Teach home stretching routines to relieve chronic postural strain',
    ],
    dayInTheLifeSummary: 'Assists patients in restoring physical movement, relieving pain, and rebuilding confidence after injury or illness.',
  },

  // 3. Business & Economics (บริหารธุรกิจและเศรษฐศาสตร์)
  {
    id: 'biz-econ-1',
    roleTitle: 'Digital Marketing & Growth Specialist',
    field: 'Business & Economics',
    standardMajors: ['Marketing', 'Business Administration', 'Communication Arts'],
    milestones: {
      education: 'Bachelor of Business Administration in Marketing or Digital Media',
      entryRole: 'Marketing Assistant or Social Media Coordinator',
      growthRole: 'Digital Marketing Strategy Lead or Brand Manager',
    },
    defaultTasks: [
      'Manage promotional campaigns across social media and search channels',
      'Analyze customer traffic and click conversion metrics using analytics tools',
      'Partner with designers to produce engaging visual ads and announcements',
    ],
    dayInTheLifeSummary: 'Promotes products, services, and creative initiatives through targeted online campaigns and data-informed storytelling.',
  },
  {
    id: 'biz-econ-2',
    roleTitle: 'Financial Analyst',
    field: 'Business & Economics',
    standardMajors: ['Finance and Banking', 'Economics', 'Accounting'],
    milestones: {
      education: 'Bachelor of Business Administration in Finance or Economics',
      entryRole: 'Junior Financial Analyst or Budget Associate',
      growthRole: 'Senior Investment Analyst or Corporate Finance Manager',
    },
    defaultTasks: [
      'Examine financial statements and historical revenue trends in spreadsheets',
      'Build cost forecasting models to evaluate upcoming company investments',
      'Draft quarterly performance summaries for executive leadership review',
    ],
    dayInTheLifeSummary: 'Evaluates budgets, investments, and revenue patterns to help businesses plan ahead with financial discipline.',
  },
  {
    id: 'biz-econ-3',
    roleTitle: 'Human Resources & Talent Specialist',
    field: 'Business & Economics',
    standardMajors: ['Business Administration', 'Human Resource Management', 'Public Administration'],
    milestones: {
      education: 'Bachelor of Business Administration in Human Resource Management or Psychology',
      entryRole: 'HR Assistant or Recruiting Coordinator',
      growthRole: 'Senior HR Business Partner or People Operations Director',
    },
    defaultTasks: [
      'Coordinate job postings, resume reviews, and candidate interview schedules',
      'Lead onboarding orientations and welcome sessions for new team members',
      'Help organize staff professional development seminars and wellness programs',
    ],
    dayInTheLifeSummary: 'Recruits talent, supports employee growth, and cultivates a healthy, productive workplace environment.',
  },
  {
    id: 'biz-econ-4',
    roleTitle: 'Supply Chain & Logistics Coordinator',
    field: 'Business & Economics',
    standardMajors: ['Logistics and Supply Chain Management', 'Business Administration', 'Industrial Engineering'],
    milestones: {
      education: 'Bachelor of Business Administration in Logistics and Supply Chain Management',
      entryRole: 'Logistics Operations Assistant or Warehouse Coordinator',
      growthRole: 'Supply Chain Manager or Regional Logistics Director',
    },
    defaultTasks: [
      'Track freight shipments and ensure on-time delivery to distribution centers',
      'Coordinate inventory re-orders with domestic and regional suppliers',
      'Identify shipping bottlenecks to reduce transport costs and delivery delays',
    ],
    dayInTheLifeSummary: 'Manages the flow of goods and raw materials from manufacturers to store shelves with logistical efficiency.',
  },
  {
    id: 'biz-econ-5',
    roleTitle: 'Accountant & Financial Auditor',
    field: 'Business & Economics',
    standardMajors: ['Accounting', 'Finance and Banking', 'Economics'],
    milestones: {
      education: 'Bachelor of Accountancy (B.Acc.)',
      entryRole: 'Junior Accountant or Audit Associate',
      growthRole: 'Senior Certified Public Accountant (CPA) or Accounting Controller',
    },
    defaultTasks: [
      'Reconcile general ledger balances, invoices, and bank statements monthly',
      'Prepare quarterly balance sheets and statutory financial filings',
      'Verify organizational compliance with corporate tax and accounting laws',
    ],
    dayInTheLifeSummary: 'Maintains rigorous financial record-keeping to ensure corporate fiscal transparency, tax accuracy, and trust.',
  },
  {
    id: 'biz-econ-6',
    roleTitle: 'Business Development Associate',
    field: 'Business & Economics',
    standardMajors: ['Business Administration', 'Marketing', 'Economics'],
    milestones: {
      education: 'Bachelor of Business Administration in International Business or Management',
      entryRole: 'Business Development Assistant or Client Relations Associate',
      growthRole: 'Business Development Director or Commercial Partnership Lead',
    },
    defaultTasks: [
      'Research industry trends and identify prospective client partnerships',
      'Draft commercial proposals and create presentation pitch decks',
      'Maintain strong communication channels with corporate business clients',
    ],
    dayInTheLifeSummary: 'Identifies strategic business opportunities and establishes long-term relationships that expand market reach.',
  },

  // 4. Design & Creative Arts (การออกแบบและศิลปะสร้างสรรค์)
  {
    id: 'design-arts-1',
    roleTitle: 'UI/UX & Product Designer',
    field: 'Design & Creative Arts',
    standardMajors: ['Visual Communication Design', 'Industrial Design', 'Digital Media and Interactive Arts'],
    milestones: {
      education: 'Bachelor of Fine Arts in Visual Communication Design or Interactive Media',
      entryRole: 'Junior UI/UX Designer or Graphic Design Associate',
      growthRole: 'Lead Product Designer or Design Systems Director',
    },
    defaultTasks: [
      'Sketch user wireframes and interactive prototypes in design software',
      'Conduct usability interviews to see where users get stuck in app flows',
      'Partner with engineers to ensure design mockups are built accurately',
    ],
    dayInTheLifeSummary: 'Designs intuitive digital interfaces and mobile apps that feel effortless, accessible, and delightful to navigate.',
  },
  {
    id: 'design-arts-2',
    roleTitle: 'Graphic & Brand Designer',
    field: 'Design & Creative Arts',
    standardMajors: ['Visual Communication Design', 'Fine and Applied Arts', 'Communication Arts'],
    milestones: {
      education: 'Bachelor of Fine Arts in Graphic Design or Visual Communication',
      entryRole: 'Junior Graphic Designer or Visual Production Artist',
      growthRole: 'Creative Director or Senior Brand Strategist',
    },
    defaultTasks: [
      'Develop company logos, typography standards, and visual identity guidelines',
      'Create eye-catching layouts for packaging, posters, and digital ads',
      'Prepare print-ready files and coordinate specifications with commercial printers',
    ],
    dayInTheLifeSummary: 'Crafts the visual identity and aesthetic voice of brands through compelling typography, color palettes, and imagery.',
  },
  {
    id: 'design-arts-3',
    roleTitle: 'Multimedia Content Producer',
    field: 'Design & Creative Arts',
    standardMajors: ['Digital Media and Interactive Arts', 'Animation and Multimedia', 'Communication Arts'],
    milestones: {
      education: 'Bachelor of Arts in Digital Media, Animation, or Multimedia Arts',
      entryRole: 'Video Editor or Motion Graphics Animator',
      growthRole: 'Senior Multimedia Producer or Studio Production Manager',
    },
    defaultTasks: [
      'Edit raw video footage, sound effects, and color grading for web releases',
      'Animate title sequences, infographics, and 2D explanatory graphics',
      'Organize media asset libraries and manage production timelines',
    ],
    dayInTheLifeSummary: 'Combines video editing, motion graphics, and audio mixing to produce engaging visual stories for audiences.',
  },
  {
    id: 'design-arts-4',
    roleTitle: 'Interior & Exhibition Designer',
    field: 'Design & Creative Arts',
    standardMajors: ['Interior Design', 'Industrial Design', 'Fine and Applied Arts'],
    milestones: {
      education: 'Bachelor of Fine Arts in Interior Design or Architecture',
      entryRole: 'Junior Interior Designer or CAD Draftsperson',
      growthRole: 'Senior Interior Architect or Exhibition Design Director',
    },
    defaultTasks: [
      'Draft 3D floorplans and furniture layouts for commercial or residential spaces',
      'Select interior material samples, color palettes, and sustainable finishes',
      'Coordinate installation schedules with carpentry and lighting contractors',
    ],
    dayInTheLifeSummary: 'Shapes physical interior spaces and exhibitions that balance visual beauty, spatial comfort, and practical function.',
  },
  {
    id: 'design-arts-5',
    roleTitle: 'Motion Graphics Animator',
    field: 'Design & Creative Arts',
    standardMajors: ['Animation and Multimedia', 'Digital Media and Interactive Arts', 'Visual Communication Design'],
    milestones: {
      education: 'Bachelor of Arts in Animation, Multimedia, or Computer Graphic Art',
      entryRole: 'Junior 2D/3D Animator or Motion Artist',
      growthRole: 'Senior Animation Director or Lead Motion Designer',
    },
    defaultTasks: [
      'Animate visual assets, typography, and logo intros for video campaigns',
      'Storyboard scene flows and keyframe movements for commercial explainers',
      'Render visual effects and synchronize motion timings with audio tracks',
    ],
    dayInTheLifeSummary: 'Brings still illustrations and typography to life through rhythm, kinetic animation, and expressive motion.',
  },
  {
    id: 'design-arts-6',
    roleTitle: 'Industrial Product Designer',
    field: 'Design & Creative Arts',
    standardMajors: ['Industrial Design', 'Visual Communication Design', 'Mechanical Engineering'],
    milestones: {
      education: 'Bachelor of Industrial Design (B.I.D.) or Applied Art',
      entryRole: 'Assistant Product Designer or 3D Modeler',
      growthRole: 'Lead Industrial Design Specialist or Product Development Lead',
    },
    defaultTasks: [
      'Sketch ergonomic concepts for consumer electronics and lifestyle products',
      'Create 3D computer models and rapid 3D-printed physical prototypes',
      'Test product durability and user grip comfort with target audiences',
    ],
    dayInTheLifeSummary: 'Envisions and refines tangible consumer goods to make everyday physical tools functional, safe, and beautiful.',
  },

  // 5. Communication & Humanities (นิเทศศาสตร์และมนุษยศาสตร์)
  {
    id: 'comm-human-1',
    roleTitle: 'Public Relations & Communications Specialist',
    field: 'Communication & Humanities',
    standardMajors: ['Communication Arts / Mass Communication', 'Public Relations', 'English for Communication'],
    milestones: {
      education: 'Bachelor of Arts in Mass Communication, Public Relations, or Strategic Communication',
      entryRole: 'Communications Assistant or PR Coordinator',
      growthRole: 'Communications Director or Corporate Spokesperson',
    },
    defaultTasks: [
      'Draft press releases, media kits, and executive talking points',
      'Build positive relationships with media journalists and community partners',
      'Monitor public news mentions and coordinate official social announcements',
    ],
    dayInTheLifeSummary: 'Shares organizational stories with the public and ensures news announcements are clear, honest, and engaging.',
  },
  {
    id: 'comm-human-2',
    roleTitle: 'Technical Writer & Content Strategist',
    field: 'Communication & Humanities',
    standardMajors: ['English for Communication', 'Language and Linguistics', 'Communication Arts / Mass Communication'],
    milestones: {
      education: 'Bachelor of Arts in English for Communication, Linguistics, or Journalism',
      entryRole: 'Junior Technical Writer or Documentation Specialist',
      growthRole: 'Senior Content Strategist or Documentation Team Lead',
    },
    defaultTasks: [
      'Write clear, step-by-step user manuals and technical guide articles',
      'Interview engineers and product specialists to translate complex concepts',
      'Review existing product tutorials to ensure plain language and clarity',
    ],
    dayInTheLifeSummary: 'Translates complicated technical systems and product workflows into simple, user-friendly language everyone can follow.',
  },
  {
    id: 'comm-human-3',
    roleTitle: 'Translator & Localization Specialist',
    field: 'Communication & Humanities',
    standardMajors: ['Translation and Interpretation', 'English for Communication', 'Language and Linguistics'],
    milestones: {
      education: 'Bachelor of Arts in Translation Studies, Applied Linguistics, or Foreign Languages',
      entryRole: 'Assistant Translator or Localization Coordinator',
      growthRole: 'Lead Localization Manager or Senior Conference Interpreter',
    },
    defaultTasks: [
      'Translate written articles, software strings, and subtitles between languages',
      'Adapt cultural nuances, humor, and idiomatic expressions for local audiences',
      'Proofread translated documents for grammatical precision and terminology consistency',
    ],
    dayInTheLifeSummary: 'Bridges linguistic and cultural boundaries by adapting software, literature, and media for international audiences.',
  },
  {
    id: 'comm-human-4',
    roleTitle: 'Digital Journalist & Media Reporter',
    field: 'Communication & Humanities',
    standardMajors: ['Communication Arts / Mass Communication', 'English for Communication', 'Public Relations'],
    milestones: {
      education: 'Bachelor of Arts in Journalism, Mass Media, or Digital Broadcasting',
      entryRole: 'Junior Reporter or Digital Content Writer',
      growthRole: 'Senior Editor or Editorial Department Producer',
    },
    defaultTasks: [
      'Conduct interviews and verify factual claims for news reports',
      'Write balanced news articles and features on community and national events',
      'Produce short explanatory multimedia videos for mobile news feeds',
    ],
    dayInTheLifeSummary: 'Investigates and reports on community events, government policies, and culture to keep the public informed.',
  },
  {
    id: 'comm-human-5',
    roleTitle: 'Corporate Event Producer',
    field: 'Communication & Humanities',
    standardMajors: ['Communication Arts / Mass Communication', 'Public Relations', 'Business Administration'],
    milestones: {
      education: 'Bachelor of Arts in Communication Arts or Strategic Event Management',
      entryRole: 'Event Assistant or Media Production Coordinator',
      growthRole: 'Senior Corporate Event Director or Production Manager',
    },
    defaultTasks: [
      'Coordinate event staging, lighting, and sound equipment with tech crews',
      'Draft run-of-show schedules and conduct speaker rehearsals',
      'Manage guest registration logistics and oversee live broadcast streams',
    ],
    dayInTheLifeSummary: 'Plans and directs corporate seminars, media launches, and conferences that deliver polished attendee experiences.',
  },
  {
    id: 'comm-human-6',
    roleTitle: 'Foreign Language Coordinator',
    field: 'Communication & Humanities',
    standardMajors: ['Japanese / Chinese for Business Communication', 'English for Communication', 'Language and Linguistics'],
    milestones: {
      education: 'Bachelor of Arts in East Asian Languages (Japanese/Chinese) or English',
      entryRole: 'Bilingual Customer Coordinator or International Liaison Assistant',
      growthRole: 'International Relations Lead or Foreign Operations Supervisor',
    },
    defaultTasks: [
      'Facilitate bilingual email correspondence and meetings with overseas partners',
      'Translate contract terms and business correspondence into Thai and English',
      'Assist international clients with on-site visits and cultural etiquette guidance',
    ],
    dayInTheLifeSummary: 'Enables smooth cross-border collaboration between Thai enterprises and international partners through bilingual expertise.',
  },

  // 6. Social Sciences & Law (สังคมศาสตร์และนิติศาสตร์)
  {
    id: 'social-law-1',
    roleTitle: 'Legal Compliance Officer',
    field: 'Social Sciences & Law',
    standardMajors: ['Law (LL.B.)', 'Public Administration', 'Business Administration'],
    milestones: {
      education: 'Bachelor of Laws (LL.B.) or Public Administration',
      entryRole: 'Junior Compliance Assistant or Legal Research Associate',
      growthRole: 'Chief Compliance Officer or Senior Regulatory Affairs Counsel',
    },
    defaultTasks: [
      'Review business contracts and policies against current government regulations',
      'Conduct internal audit checklists to verify workplace safety and data rules',
      'Advise management on regulatory changes that impact day-to-day operations',
    ],
    dayInTheLifeSummary: 'Ensures organizations operate lawfully, ethically, and responsibly within regulatory frameworks and statutory laws.',
  },
  {
    id: 'social-law-2',
    roleTitle: 'Community Development & Policy Officer',
    field: 'Social Sciences & Law',
    standardMajors: ['Political Science and International Relations', 'Sociology and Anthropology', 'Social Work'],
    milestones: {
      education: 'Bachelor of Arts in Political Science, Sociology, or Social Work',
      entryRole: 'Community Project Officer or Field Research Assistant',
      growthRole: 'Regional Development Director or Social Policy Analyst',
    },
    defaultTasks: [
      'Conduct neighborhood surveys to identify community needs and infrastructure gaps',
      'Facilitate community town halls and collaborative planning workshops',
      'Draft grant proposals and progress reports for community funding bodies',
    ],
    dayInTheLifeSummary: 'Partners directly with community members and public agencies to improve local resources, schools, and social welfare.',
  },
  {
    id: 'social-law-3',
    roleTitle: 'Social Worker & Youth Counselor',
    field: 'Social Sciences & Law',
    standardMajors: ['Social Work', 'Sociology and Anthropology', 'Public Administration'],
    milestones: {
      education: 'Bachelor of Social Work (BSW) or Developmental Psychology',
      entryRole: 'Casework Assistant or Youth Program Coordinator',
      growthRole: 'Licensed Senior Social Worker or Family Services Supervisor',
    },
    defaultTasks: [
      'Meet with students and families to assess social, emotional, and learning needs',
      'Connect individuals with community aid programs, scholarships, and healthcare',
      'Maintain confidential case progress notes and coordinate with school advisors',
    ],
    dayInTheLifeSummary: 'Supports young people and families through difficult life transitions, offering guidance, resources, and encouragement.',
  },
  {
    id: 'social-law-4',
    roleTitle: 'Human Rights & Advocacy Assistant',
    field: 'Social Sciences & Law',
    standardMajors: ['Law (LL.B.)', 'Political Science and International Relations', 'Sociology and Anthropology'],
    milestones: {
      education: 'Bachelor of Laws (LL.B.) or Political Science',
      entryRole: 'Advocacy Assistant or Non-Profit Project Coordinator',
      growthRole: 'Human Rights Program Director or Senior Legal Advocate',
    },
    defaultTasks: [
      'Compile field documentation on civil rights and community legal access',
      'Organize educational rights workshops for marginalized populations',
      'Liaise with legal aid societies to assist citizens in accessing legal counsel',
    ],
    dayInTheLifeSummary: 'Advocates for fair treatment, legal access, and civic rights through research, public education, and legal aid support.',
  },
  {
    id: 'social-law-5',
    roleTitle: 'Urban & Regional Planning Assistant',
    field: 'Social Sciences & Law',
    standardMajors: ['Urban Planning and Community Development', 'Political Science and International Relations', 'Sociology and Anthropology'],
    milestones: {
      education: 'Bachelor of Science in Urban Planning or Regional Geography',
      entryRole: 'Assistant Urban Planner or GIS Mapping Associate',
      growthRole: 'Senior Urban Planning Consultant or City Planning Director',
    },
    defaultTasks: [
      'Analyze traffic flows, pedestrian access, and municipal green space maps',
      'Draft zoning proposals that balance commercial growth and neighborhood quality',
      'Coordinate public hearings to gather resident feedback on local transit projects',
    ],
    dayInTheLifeSummary: 'Helps plan sustainable, walkable towns and cities that meet future housing, transport, and community needs.',
  },
  {
    id: 'social-law-6',
    roleTitle: 'Public Affairs Associate',
    field: 'Social Sciences & Law',
    standardMajors: ['Public Administration', 'Political Science and International Relations', 'Law (LL.B.)'],
    milestones: {
      education: 'Bachelor of Arts in Political Science or Public Administration',
      entryRole: 'Public Affairs Assistant or Community Liaison',
      growthRole: 'Public Affairs Director or Government Relations Manager',
    },
    defaultTasks: [
      'Track policy proposals and legislation affecting education and municipal services',
      'Prepare summary briefs and question-and-answer sheets for agency leadership',
      'Organize open information forums to explain public services to citizens',
    ],
    dayInTheLifeSummary: 'Connects governmental bodies and civic organizations with citizens to foster open dialogue and effective public policy.',
  },

  // 7. Hospitality & Tourism (การโรงแรมและการท่องเที่ยว)
  {
    id: 'hosp-tour-1',
    roleTitle: 'Hotel & Resort Operations Supervisor',
    field: 'Hospitality & Tourism',
    standardMajors: ['Hospitality and Hotel Management', 'Tourism Management', 'Business Administration'],
    milestones: {
      education: 'Bachelor of Arts in Hospitality and Hotel Management',
      entryRole: 'Front Desk Associate or Guest Services Supervisor',
      growthRole: 'Hotel General Manager or Regional Operations Director',
    },
    defaultTasks: [
      'Coordinate daily front-desk guest arrivals, VIP requests, and concierge logistics',
      'Supervise housekeeping and facility maintenance teams for quality standards',
      'Resolve guest inquiries and feedback with welcoming, professional hospitality',
    ],
    dayInTheLifeSummary: 'Creates welcoming, seamless experiences for travelers by managing hotel guest services, dining, and accommodations.',
  },
  {
    id: 'hosp-tour-2',
    roleTitle: 'Event & Conference Coordinator',
    field: 'Hospitality & Tourism',
    standardMajors: ['Convention and Event Management', 'Hospitality and Hotel Management', 'Tourism Management'],
    milestones: {
      education: 'Bachelor of Arts in Event Management or Hospitality Administration',
      entryRole: 'Assistant Event Planner or Venue Logistics Coordinator',
      growthRole: 'Senior Event Producer or Convention Services Director',
    },
    defaultTasks: [
      'Map out event run-of-show schedules, catering menus, and audiovisual equipment',
      'Liaise with vendors, keynote speakers, and venue technical managers',
      'Manage on-site registration desks and troubleshoot day-of-event timing',
    ],
    dayInTheLifeSummary: 'Plans and orchestrates conferences, cultural festivals, and celebrations from initial concept to live execution.',
  },
  {
    id: 'hosp-tour-3',
    roleTitle: 'Sustainable Tourism & Ecotourism Specialist',
    field: 'Hospitality & Tourism',
    standardMajors: ['Tourism Management', 'Cultural Heritage Tourism', 'Environmental Science'],
    milestones: {
      education: 'Bachelor of Science in Sustainable Tourism or Environmental Heritage',
      entryRole: 'Ecotour Guide Coordinator or Travel Itinerary Planner',
      growthRole: 'Sustainable Destination Manager or Regional Tourism Board Director',
    },
    defaultTasks: [
      'Develop travel itineraries that support local artisans and preserve nature',
      'Partner with regional conservation parks on responsible tourist guidelines',
      'Conduct environmental footprint assessments of tourist accommodations',
    ],
    dayInTheLifeSummary: 'Curates travel experiences that protect local wildlife, honor cultural heritage, and benefit community economies.',
  },
  {
    id: 'hosp-tour-4',
    roleTitle: 'Airline Ground Operations Associate',
    field: 'Hospitality & Tourism',
    standardMajors: ['Aviation Business and Services', 'Hospitality and Hotel Management', 'Tourism Management'],
    milestones: {
      education: 'Bachelor of Arts in Aviation Business Management or Hospitality',
      entryRole: 'Airport Customer Service Agent or Gate Boarding Associate',
      growthRole: 'Airport Ground Operations Supervisor or Terminal Duty Manager',
    },
    defaultTasks: [
      'Assist passengers with flight check-in, baggage check, and boarding procedures',
      'Coordinate gate announcements and wheelchair assistance for travelers with mobility needs',
      'Communicate with flight dispatch crews on boarding times and luggage loading',
    ],
    dayInTheLifeSummary: 'Supports travelers through airport check-in and boarding to ensure flights depart safely and on schedule.',
  },
  {
    id: 'hosp-tour-5',
    roleTitle: 'Food & Beverage Operations Coordinator',
    field: 'Hospitality & Tourism',
    standardMajors: ['Culinary Arts and Kitchen Administration', 'Hospitality and Hotel Management', 'Business Administration'],
    milestones: {
      education: 'Bachelor of Arts in Hospitality Management or Culinary Arts Administration',
      entryRole: 'Restaurant Supervisor or Banquet Operations Assistant',
      growthRole: 'Food and Beverage Director or Multi-Unit Restaurant Manager',
    },
    defaultTasks: [
      'Oversee dining room service standards and manage banquet event catering',
      'Coordinate kitchen inventory re-ordering with local produce suppliers',
      'Ensure kitchen and dining areas adhere to strict food safety hygiene laws',
    ],
    dayInTheLifeSummary: 'Coordinates dining and culinary operations in hotels and restaurants to provide memorable dining experiences.',
  },
  {
    id: 'hosp-tour-6',
    roleTitle: 'Travel Experience & Itinerary Planner',
    field: 'Hospitality & Tourism',
    standardMajors: ['Tourism Management', 'Cultural Heritage Tourism', 'English for Communication'],
    milestones: {
      education: 'Bachelor of Arts in Tourism Management or Cultural Geography',
      entryRole: 'Travel Consultant or Tour Operations Assistant',
      growthRole: 'Senior Travel Product Manager or Inbound Tourism Agency Director',
    },
    defaultTasks: [
      'Research boutique accommodations, transport routes, and cultural excursions',
      'Draft customized vacation itineraries tailored to traveler budgets and interests',
      'Liaise with local boat, bus, and guide operators to verify booking confirmations',
    ],
    dayInTheLifeSummary: 'Designs thoughtful, personalized travel adventures that help visitors experience regional cultures with confidence.',
  },

  // 8. Environmental & Agricultural Sciences (สิ่งแวดล้อมและเกษตรศาสตร์)
  {
    id: 'env-agri-1',
    roleTitle: 'Environmental Quality & Sustainability Officer',
    field: 'Environmental & Agricultural Sciences',
    standardMajors: ['Environmental Science', 'Renewable Energy and Clean Technology', 'Public Health'],
    milestones: {
      education: 'Bachelor of Science in Environmental Science or Environmental Engineering',
      entryRole: 'Junior Environmental Inspector or Sustainability Associate',
      growthRole: 'Director of Environmental Health and Safety or Chief Sustainability Officer',
    },
    defaultTasks: [
      'Collect water, soil, and air quality samples for analytical testing',
      'Inspect commercial facilities for compliance with waste reduction laws',
      'Compile environmental impact reports and recommend renewable practices',
    ],
    dayInTheLifeSummary: 'Monitors ecosystems and partners with businesses to reduce waste, safeguard clean water, and promote sustainability.',
  },
  {
    id: 'env-agri-2',
    roleTitle: 'Smart Agricultural Technology Specialist',
    field: 'Environmental & Agricultural Sciences',
    standardMajors: ['Smart Agriculture and Precision Farming', 'Agricultural Science and Technology', 'Agribusiness and Agricultural Economics'],
    milestones: {
      education: 'Bachelor of Science in Agricultural Science, Smart Agriculture, or Agronomy',
      entryRole: 'Agricultural Field Technician or Crop Monitoring Associate',
      growthRole: 'Precision Agriculture Consultant or Agribusiness Operations Manager',
    },
    defaultTasks: [
      'Monitor automated soil sensors, drone crop imaging, and irrigation timers',
      'Analyze seasonal crop yields to recommend organic pest management techniques',
      'Advise local farmers on integrating smart sensors and sustainable cultivation',
    ],
    dayInTheLifeSummary: 'Combines modern technology with sustainable farming methods to improve food production while conserving water and soil.',
  },
  {
    id: 'env-agri-3',
    roleTitle: 'Renewable Energy Project Associate',
    field: 'Environmental & Agricultural Sciences',
    standardMajors: ['Renewable Energy and Clean Technology', 'Environmental Science', 'Electrical Engineering'],
    milestones: {
      education: 'Bachelor of Science in Renewable Energy Systems or Clean Technology',
      entryRole: 'Solar/Wind Installation Associate or Clean Energy Field Auditor',
      growthRole: 'Renewable Energy Project Development Director',
    },
    defaultTasks: [
      'Assess rooftop solar exposure and wind efficiency using mapping software',
      'Calculate energy output estimates and payback periods for clean energy installs',
      'Coordinate with electrical contractors and local utilities during commissioning',
    ],
    dayInTheLifeSummary: 'Assists in planning and launching solar, wind, and clean energy installations that reduce dependence on fossil fuels.',
  },
  {
    id: 'env-agri-4',
    roleTitle: 'Forestry & Conservation Park Officer',
    field: 'Environmental & Agricultural Sciences',
    standardMajors: ['Forestry and Natural Resources', 'Environmental Science', 'Agricultural Science and Technology'],
    milestones: {
      education: 'Bachelor of Science in Forestry (วนศาสตร์) or Natural Resource Conservation',
      entryRole: 'Forest Conservation Assistant or National Park Ranger Associate',
      growthRole: 'Chief Park Superintendent or Regional Conservation Director',
    },
    defaultTasks: [
      'Patrol conservation corridors to monitor wildlife health and prevent illegal logging',
      'Direct native reforestation planting projects and watershed protection initiatives',
      'Lead nature education workshops for visiting school groups and hikers',
    ],
    dayInTheLifeSummary: 'Safeguards forest reserves and wildlife sanctuaries while educating communities on preserving natural heritage.',
  },
  {
    id: 'env-agri-5',
    roleTitle: 'Soil & Water Quality Field Specialist',
    field: 'Environmental & Agricultural Sciences',
    standardMajors: ['Agricultural Science and Technology', 'Environmental Science', 'Smart Agriculture and Precision Farming'],
    milestones: {
      education: 'Bachelor of Science in Soil Science, Water Resources, or Agriculture',
      entryRole: 'Field Laboratory Technician or Soil Quality Analyst',
      growthRole: 'Agricultural Resource Specialist or Senior Hydrologist',
    },
    defaultTasks: [
      'Analyze soil samples for nitrogen, phosphorus, and moisture balance',
      'Test irrigation water from local reservoirs and canals for salinity',
      'Advise agricultural cooperatives on sustainable crop rotation to rebuild soil health',
    ],
    dayInTheLifeSummary: 'Helps farms maintain healthy, fertile soil and clean irrigation water for dependable and eco-friendly food production.',
  },
  {
    id: 'env-agri-6',
    roleTitle: 'Agribusiness Operations Associate',
    field: 'Environmental & Agricultural Sciences',
    standardMajors: ['Agribusiness and Agricultural Economics', 'Business Administration', 'Agricultural Science and Technology'],
    milestones: {
      education: 'Bachelor of Science in Agribusiness or Agricultural Economics',
      entryRole: 'Agricultural Supply Coordinator or Farm Product Sales Associate',
      growthRole: 'Agribusiness Supply Chain Manager or Agricultural Trade Director',
    },
    defaultTasks: [
      'Coordinate fresh produce delivery logistics from farm cooperatives to grocery distributors',
      'Analyze crop market commodity prices to assist farmers in timing seasonal harvests',
      'Verify that packaged farm products meet national export food packaging standards',
    ],
    dayInTheLifeSummary: 'Connects agricultural producers with commercial markets to ensure farmers receive fair prices for their harvests.',
  },
];

// Helper functions for catalog queries and validation

export function getCatalogEntryByTitle(title: string): CatalogCareerEntry | undefined {
  if (!title || typeof title !== 'string') return undefined;
  const normalized = title.trim().toLowerCase();
  return CAREER_CATALOG.find((entry) => entry.roleTitle.toLowerCase() === normalized);
}

export function isWhitelistedTitle(title: string): boolean {
  return Boolean(getCatalogEntryByTitle(title));
}

export function isWhitelistedMajor(major: string): boolean {
  if (!major || typeof major !== 'string') return false;
  const normalized = major.trim().toLowerCase();
  return CAREER_CATALOG.some((entry) =>
    entry.standardMajors.some((m) => m.toLowerCase() === normalized)
  );
}

export function getCareersByField(field: ApprovedField): CatalogCareerEntry[] {
  return CAREER_CATALOG.filter((entry) => entry.field === field);
}

export function getAllWhitelistedTitles(): string[] {
  return CAREER_CATALOG.map((entry) => entry.roleTitle);
}

export function getAllWhitelistedMajors(): string[] {
  const majorsSet = new Set<string>();
  CAREER_CATALOG.forEach((entry) => entry.standardMajors.forEach((m) => majorsSet.add(m)));
  return Array.from(majorsSet).sort();
}

export interface RelatedRoleItem {
  id: string;
  roleTitle: string;
  field: ApprovedField;
  summary: string;
  standardMajors: string[];
}

/**
 * Pure deterministic selector for supplementary career recommendations.
 * Selects 2-4 roles from the static catalog that are not in the primary recommendations.
 */
export function getRelatedCatalogRoles(
  primaryRoleTitles: string[] = [],
  preferredFields: ApprovedField[] = [],
  count: number = 3
): RelatedRoleItem[] {
  const primarySet = new Set(primaryRoleTitles.map((t) => t.toLowerCase().trim()));
  const available = CAREER_CATALOG.filter(
    (entry) => !primarySet.has(entry.roleTitle.toLowerCase().trim())
  );

  // Prioritize roles matching preferred or adjacent fields
  const sorted = [...available].sort((a, b) => {
    const aPref = preferredFields.includes(a.field) ? 1 : 0;
    const bPref = preferredFields.includes(b.field) ? 1 : 0;
    return bPref - aPref;
  });

  return sorted.slice(0, Math.min(Math.max(count, 2), 4)).map((entry) => ({
    id: entry.id,
    roleTitle: entry.roleTitle,
    field: entry.field,
    summary: entry.dayInTheLifeSummary,
    standardMajors: entry.standardMajors.slice(0, 2),
  }));
}
