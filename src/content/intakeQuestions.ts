/**
 * PathLess: College Major and Career Discovery Guide v2
 * Modularized Intake Questions Content Repository
 * Tone: Calm, supportive, plain language calibrated for high school students (8th–12th grade level).
 * 
 * Strict Invariant: Zero clinical, medical, or diagnostic jargon.
 * Invariant: Zero legacy branding or prohibited technical terminology permitted.
 */

export interface IntakeQuestionOption {
  id: string;
  title: string;
  description?: string;
  badge?: string;
}

export interface IntakeQuestionDefinition {
  stepNumber: number;
  title: string;
  helperText: string;
  maxSelections?: number;
  selectionStatus?: (count: number, max: number) => string;
  placeholder?: string;
  charLimit?: number;
  charCounter?: (current: number, max: number) => string;
  reassuranceHint?: string;
  options?: IntakeQuestionOption[];
}

export const INTAKE_QUESTIONS: Record<string, IntakeQuestionDefinition> = {
  q1: {
    stepNumber: 1,
    title: 'When you lose track of time, what kinds of tasks feel most natural?',
    helperText: 'Pick 1 or 2 options that feel most like you. There is no need to overthink it.',
    maxSelections: 2,
    selectionStatus: (count: number, max: number) =>
      count === 0
        ? 'Select 1 or 2 options'
        : count === 1
        ? `1 of ${max} selected (you can pick 1 more)`
        : `${count} of ${max} selected (maximum reached)`,
    options: [
      {
        id: 'BUILD_SYSTEMS',
        title: 'Building & Fixing Things',
        description: 'Fixing physical gadgets, coding software, assembling crafts, or understanding how machines and programs work.',
      },
      {
        id: 'ANALYZE_PATTERNS',
        title: 'Solving Puzzles & Exploring Questions',
        description: 'Digging into curious questions, finding hidden patterns, researching facts, and untangling mysteries.',
      },
      {
        id: 'HELP_HUMANS',
        title: 'Helping & Supporting Others',
        description: 'Listening closely to people, offering thoughtful advice, teaching concepts, and helping friends solve personal problems.',
      },
      {
        id: 'CREATE_EXPRESS',
        title: 'Writing, Art & Creative Expression',
        description: 'Writing stories, designing graphics, filming videos, making art, or sharing ideas through creative projects.',
      },
      {
        id: 'LEAD_ORGANIZING',
        title: 'Organizing & Bringing People Together',
        description: 'Planning group activities, mapping out schedules, coordinating school events, and turning ideas into real action.',
      },
    ],
  },

  q2: {
    stepNumber: 2,
    title: 'Which subject area makes you most curious to learn more?',
    helperText: 'Choose the subject field you lean toward when you get to pick what you study.',
    options: [
      { id: 'TECH_COMPUTING', title: 'Technology & Computing', badge: 'Software & Digital' },
      { id: 'HEALTH_MEDICINE', title: 'Health, Medicine & Biology', badge: 'Life Sciences' },
      { id: 'BUSINESS_INNOVATION', title: 'Business & Social Enterprise', badge: 'Leadership & Strategy' },
      { id: 'ARTS_MEDIA', title: 'Arts, Design & Media', badge: 'Creative Media' },
      { id: 'CIVICS_SOCIETY', title: 'Law, Policy & Community Impact', badge: 'Community & Society' },
      { id: 'ENGINEERING_PHYSICAL', title: 'Engineering & Applied Sciences', badge: 'Physical Sciences' },
      { id: 'EXPLORATORY_OPEN', title: 'Not Sure Yet — Open to Exploring', badge: 'Exploratory' },
    ],
  },

  q3: {
    stepNumber: 3,
    title: 'Which study track or academic stream are you pursuing in high school?',
    helperText: 'Your high school stream helps us suggest realistic university degree routes without closing any doors.',
    charLimit: 200,
    options: [
      {
        id: 'SCIENCE_MATH',
        title: 'Science-Math Track (วิทย์-คณิต)',
        badge: 'STEM Focus',
        description: 'Focused on physics, chemistry, biology, and advanced mathematics.',
      },
      {
        id: 'ARTS_MATH',
        title: 'Arts-Math Track (ศิลป์-คำนวณ)',
        badge: 'Business & Applied',
        description: 'Focused on mathematics, business foundations, economics, and modern languages.',
      },
      {
        id: 'ARTS_LANGUAGE',
        title: 'Arts-Language Track (ศิลป์-ภาษา)',
        badge: 'Languages & Humanities',
        description: 'Focused on world languages, social studies, communication, and cultural arts.',
      },
      {
        id: 'VOCATIONAL_APPLIED',
        title: 'Vocational or Applied Technology Track',
        badge: 'Hands-on Technical',
        description: 'Hands-on training in technical trades, digital media, business operations, or hospitality.',
      },
      {
        id: 'TRACK_EXPLORING',
        title: 'Exploring / Not Yet Decided / International',
        badge: 'Open Curriculum',
        description: 'Flexible general curriculum, international diploma (IB/IGCSE), or still exploring your options.',
      },
    ],
  },

  q4: {
    stepNumber: 4,
    title: 'What feels most challenging or stressful when you think about college classes?',
    helperText: 'A sentence or two is plenty. We use this to make sure your pathways feel manageable and supportive.',
    placeholder: 'e.g., I love science, but high-level math tests make me nervous...',
    charLimit: 200,
    charCounter: (current: number, max: number) => `${current}/${max} characters`,
    reassuranceHint: 'Take all the time you need.',
  },

  q5: {
    stepNumber: 5,
    title: 'Where would you feel most comfortable working every day?',
    helperText: 'Think about where your body feels calm and relaxed, rather than what sounds most impressive.',
    options: [
      {
        id: 'REMOTE_DIGITAL',
        title: 'Quiet Digital Desk',
        badge: 'Flexible & Focused',
        description: 'Working mainly from a laptop with quiet focus, flexible hours, and chatting with team members online.',
      },
      {
        id: 'COLLABORATIVE_STUDIO',
        title: 'Active Team Studio or Office',
        badge: 'Social & Energetic',
        description: 'Working around friendly teammates, whiteboard brainstorming sessions, and shared creative energy.',
      },
      {
        id: 'ACTIVE_FIELD_LAB',
        title: 'Hands-On Lab, Workshop, or Outdoors',
        badge: 'Active & Tangible',
        description: 'Moving around on your feet, working with lab equipment, outdoor fieldwork, or crafting with physical tools.',
      },
      {
        id: 'HEALTHCARE_COMMUNITY',
        title: 'Community or Healthcare Setting',
        badge: 'People-Centered',
        description: 'Direct in-person interaction supporting patients, students, clients, or community members in welcoming spaces.',
      },
    ],
  },

  q6: {
    stepNumber: 6,
    title: 'How do you feel about working with people during a typical day?',
    helperText: 'Be honest about your social battery—sustainable careers match your natural rhythm.',
    options: [
      {
        id: 'INDEPENDENT_DEEP_FOCUS',
        title: 'Mostly Independent Focus',
        description: 'You recharge with solo deep work and prefer having just a few scheduled meetings each week.',
      },
      {
        id: 'BALANCED_TEAM',
        title: 'A Healthy Mix of Both',
        description: 'You like checking in with a close team, collaborating on projects, but still having quiet hours to yourself.',
      },
      {
        id: 'HIGH_CONTACT_PEOPLE',
        title: 'People-First & Energetic',
        description: 'Being around people energizes you; you enjoy meeting new faces, presenting, and constant conversation.',
      },
    ],
  },

  q7: {
    stepNumber: 7,
    title: 'When you face a new, tricky problem, how do you like to start?',
    helperText: 'Choose the problem-solving style that feels most natural to you.',
    options: [
      {
        id: 'SYSTEMATIC_LOGIC',
        title: 'One Step at a Time',
        description: 'Breaking the problem down into orderly, manageable components and testing solutions methodically.',
      },
      {
        id: 'CREATIVE_EXPLORATION',
        title: 'Brainstorming Many Ideas',
        description: 'Sketching out wild ideas, looking for unconventional angles, and trying unexpected combinations.',
      },
      {
        id: 'PEOPLE_RELATIONAL',
        title: 'Talking It Through with Others',
        description: 'Asking people about their experiences, listening to different perspectives, and collaborating on answers.',
      },
      {
        id: 'PRACTICAL_HANDS_ON',
        title: 'Trying It Out by Doing',
        description: 'Jumping straight in, building a quick rough draft or prototype, and learning from immediate trial and error.',
      },
    ],
  },

  q8: {
    stepNumber: 8,
    title: 'What daily routine helps you do your best work?',
    helperText: 'Think about whether unexpected changes excite you or stress you out.',
    options: [
      {
        id: 'HIGH_STRUCTURE_CLEAR_RULES',
        title: 'Clear Expectations & Reliable Routine',
        description: 'You thrive when goals, workflows, and daily schedules are clearly outlined with reliable consistency.',
      },
      {
        id: 'BALANCED_MILESTONES',
        title: 'Clear Goals with Freedom in How You Work',
        description: 'You like having clear milestones, but prefer choosing your own path and schedule to reach them.',
      },
      {
        id: 'HIGH_AUTONOMY_AMBIGUITY',
        title: 'Flexible Freedom & Rapid Changes',
        description: 'You get bored by repetition and love charting your own course through unpredictable challenges.',
      },
    ],
  },

  q9: {
    stepNumber: 9,
    title: 'Which real-world work context sounds most engaging to contribute to?',
    helperText: 'Think about the broad area where you would feel energized applying your talents every week.',
    options: [
      {
        id: 'DIGITAL_TECH_PRODUCTS',
        title: 'Digital Systems, Apps & Technology',
        badge: 'Tech & Systems',
        description: 'Developing software, analyzing data, designing apps, and safeguarding digital tools.',
      },
      {
        id: 'HEALTH_WELLNESS_CARE',
        title: 'Health, Medicine & Human Well-being',
        badge: 'Life & Care',
        description: 'Improving public health, wellness therapy, nutrition, and compassionate community care.',
      },
      {
        id: 'ENTERPRISE_GROWTH',
        title: 'Business Strategy, Finance & Enterprise Growth',
        badge: 'Enterprise & Growth',
        description: 'Managing operations, financial planning, marketing growth, and organizational leadership.',
      },
      {
        id: 'CREATIVE_MEDIA_STORYTELLING',
        title: 'Creative Media, Design & Cultural Storytelling',
        badge: 'Creative & Arts',
        description: 'Visual communication, interactive digital media, storytelling, and creative direction.',
      },
      {
        id: 'PUBLIC_GOOD_COMMUNITY',
        title: 'Public Service, Law & Community Action',
        badge: 'Society & Policy',
        description: 'Community development, policy research, advocacy, and social impact for the common good.',
      },
    ],
  },

  q10: {
    stepNumber: 10,
    title: 'Which type of schoolwork stresses you out the most?',
    helperText: 'We will ensure your pathway recommendations include strategies that respect this comfort boundary.',
    options: [
      {
        id: 'ADVANCED_MATH',
        title: 'Heavy Theoretical Mathematics',
        badge: 'Complex Formulas',
        description: 'Calculus proofs, abstract algebra, and heavy numerical equations cause you acute stress.',
      },
      {
        id: 'PUBLIC_SPEAKING',
        title: 'High-Stakes Public Presentations',
        badge: 'Stage Anxiety',
        description: 'Speaking in front of large auditoriums, formal debates, or cold-calling unfamiliar audiences.',
      },
      {
        id: 'HEAVY_MEMORIZATION',
        title: 'Massive Rote Memorization',
        badge: 'Heavy Recall',
        description: 'Memorizing hundreds of anatomical terms, formulas, or historical dates under timed exam conditions.',
      },
      {
        id: 'INTENSIVE_WRITING',
        title: 'Lengthy Abstract Research Papers',
        badge: 'Long Essays',
        description: 'Writing long research essays, formatting detailed citations, and analyzing dense literature.',
      },
      {
        id: 'ISOLATED_THEORY',
        title: 'Pure Theory Without Real Examples',
        badge: 'No Real Context',
        description: 'Studying abstract theory from textbooks without any real-world projects or practical labs.',
      },
    ],
  },

  q11: {
    stepNumber: 11,
    title: 'Looking ahead, what matters most for your happiness and peace of mind?',
    helperText: 'Your core priority helps us highlight pathways that match your personal definition of success.',
    options: [
      {
        id: 'FINANCIAL_STABILITY',
        title: 'Financial Stability & High Security',
        description: 'A reliable, predictable paycheck, strong health benefits, and long-term peace of mind.',
      },
      {
        id: 'PURPOSE_IMPACT',
        title: 'Purpose & Helping Others',
        description: 'Knowing your daily work directly improves other people’s lives or protects the environment.',
      },
      {
        id: 'CREATIVE_AUTONOMY',
        title: 'Creative Freedom & Expression',
        description: 'Having the autonomy to make original work, experiment, and bring your unique voice to life.',
      },
      {
        id: 'INTELLECTUAL_DEPTH',
        title: 'Mastery & Continuous Learning',
        description: 'Diving deep into complex domains, becoming a genuine expert, and continuous lifelong learning.',
      },
      {
        id: 'WORK_LIFE_BALANCE',
        title: 'Healthy Work-Life Harmony',
        description: 'Predictable work hours that leave plenty of time and emotional energy for family, hobbies, and rest.',
      },
    ],
  },

  q12: {
    stepNumber: 12,
    title: 'When you finish college, what path sounds best for your next chapter?',
    helperText: 'Remember: your choice is never permanent. Choose what fits your peace of mind today.',
    options: [
      {
        id: 'WORKFORCE_DIRECT',
        title: 'Starting a Career Right Away (2 to 4 Years)',
        badge: 'Independence First',
        description: 'Step directly into professional employment soon after graduation to earn an income and learn on the job.',
      },
      {
        id: 'GRADUATE_STUDY',
        title: 'Continuing into Graduate School',
        badge: 'Advanced Study',
        description: 'Continue into master’s degrees, medical or law school, or specialized research training.',
      },
      {
        id: 'FLEXIBLE_ENTREPRENEURSHIP',
        title: 'Launching a Project or Exploring',
        badge: 'Self-Directed',
        description: 'Launch an entrepreneurial project, join an early-stage startup, or take a flexible year to explore.',
      },
    ],
  },
} as const;

export type IntakeQuestionsType = typeof INTAKE_QUESTIONS;
