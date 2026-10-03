/**
 * PathLess: College Major and Career Discovery Guide v2
 * Centralized User-Facing Copy for Guide and Intake Wizard
 * Tone: Calm, validating, plain language tailored for 16-20 year old students.
 * 
 * Strict Contract: 100% of user-facing strings, questions, helper copy,
 * button labels, step titles, character count labels, and ARIA announcements
 * must live strictly in this file.
 */

export const GUIDE_COPY = {
  brand: {
    name: 'PathLess',
    tagline: 'College Major and Career Exploration Without the Pressure',
    guideTitle: 'PathLess Guide',
  },

  shell: {
    badge: 'Zero-Pressure Exploration',
    subBadge: '10 Questions • Takes ~3 minutes • No test scores or grades required',
    reassuranceNote:
      'There are no right or wrong answers. Choose what feels natural to you right now—your pathways are built to fit your comfort, not test your knowledge.',
    stepProgressLabel: (current: number, total: number) => `Question ${current} of ${total}`,
    welcomeStepLabel: 'Welcome & Profile',
  },

  welcome: {
    stepNumber: 0,
    heading: 'Find Your Direction Without the Anxiety',
    subheading:
      'The PathLess Guide connects what you naturally enjoy with college majors and career pathways that make sense for you. No resumes, no test scores, and no judgment.',
    privacyPromiseTitle: 'Your Privacy Matters',
    privacyPromiseBody:
      'We only ask for your name and grade level to personalize your pathways. We never ask for your email address, phone number, or a password. Your answers are stored only in your browser session.',
    fields: {
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g., Alex Morgan',
      fullNameHelper: 'Enter your first and last name so we can address your guide personally.',
      gradeLevelLabel: 'Current Grade or College Year',
      gradeLevelPlaceholder: 'Select your current level',
      gradeOptions: [
        { value: 'grade_10', label: '10th Grade (High School Sophomore)' },
        { value: 'grade_11', label: '11th Grade (High School Junior)' },
        { value: 'grade_12', label: '12th Grade (High School Senior)' },
        { value: 'college_freshman', label: 'College Freshman (1st Year)' },
        { value: 'college_sophomore', label: 'College Sophomore (2nd Year)' },
      ],
      studentIdLabel: 'Student ID (Optional)',
      studentIdPlaceholder: 'e.g., STU-88412',
      studentIdHelper: 'If your school or advisor gave you a student code, enter it here. Otherwise, feel free to leave this blank.',
    },
    ctaButton: 'Begin PathLess Guide',
  },

  questions: {
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
          title: 'Building & Designing',
          description: 'Fixing things, coding, assembling physical projects, or figuring out how mechanical and digital systems connect.',
        },
        {
          id: 'ANALYZE_PATTERNS',
          title: 'Investigating & Solving Puzzles',
          description: 'Digging into curious questions, spotting hidden trends, researching facts, and untangling complicated mysteries.',
        },
        {
          id: 'HELP_HUMANS',
          title: 'Guiding & Supporting Others',
          description: 'Listening closely to people, offering thoughtful advice, teaching concepts, and helping friends navigate tricky problems.',
        },
        {
          id: 'CREATE_EXPRESS',
          title: 'Creating & Storytelling',
          description: 'Writing, designing graphics, editing media, visual art, or communicating ideas through creative expression.',
        },
        {
          id: 'LEAD_ORGANIZING',
          title: 'Organizing & Leading Initiatives',
          description: 'Bringing groups together, mapping out schedules, coordinating events, and turning scattered ideas into action.',
        },
      ],
    },

    q2: {
      stepNumber: 2,
      title: 'Which general subject area sparks the most genuine curiosity for you?',
      helperText: 'Choose the subject field you lean toward when you get to pick what you learn.',
      options: [
        { id: 'TECH_COMPUTING', title: 'Technology & Computing', badge: 'Software & Systems' },
        { id: 'HEALTH_MEDICINE', title: 'Health, Medicine & Biology', badge: 'Life Sciences' },
        { id: 'BUSINESS_INNOVATION', title: 'Business & Social Enterprise', badge: 'Strategy & Org' },
        { id: 'ARTS_MEDIA', title: 'Arts, Design & Media', badge: 'Creative Expression' },
        { id: 'CIVICS_SOCIETY', title: 'Law, Policy & Community Impact', badge: 'Society & Justice' },
        { id: 'ENGINEERING_PHYSICAL', title: 'Engineering & Applied Sciences', badge: 'Physical World' },
      ],
    },

    q3: {
      stepNumber: 3,
      title: 'What gives you hesitation or worry when thinking about this subject or college in general?',
      helperText: 'A sentence or two is plenty. We use this to pair you with supportive academic reassurance.',
      placeholder: 'e.g., I love building things, but advanced calculus stresses me out...',
      charLimit: 200,
      charCounter: (current: number, max: number) => `${current}/${max} characters`,
    },

    q4: {
      stepNumber: 4,
      title: 'What day-to-day physical work environment sounds most comfortable for you?',
      helperText: 'Think about where your body feels calm and relaxed, rather than what sounds most impressive.',
      options: [
        {
          id: 'REMOTE_DIGITAL',
          title: 'Quiet Digital Desk',
          badge: 'Flexible & Focused',
          description: 'Working primarily from a laptop with quiet focus, flexible hours, and collaboration through digital tools.',
        },
        {
          id: 'COLLABORATIVE_STUDIO',
          title: 'Active Team Studio or Office',
          badge: 'Interactive & Social',
          description: 'Working around energetic teammates, whiteboard sessions, group discussions, and shared creative energy.',
        },
        {
          id: 'ACTIVE_FIELD_LAB',
          title: 'Hands-On Lab, Workshop, or Field',
          badge: 'Movement & Tangible',
          description: 'On-your-feet movement, scientific equipment, outdoor fieldwork, or working directly with tools and materials.',
        },
        {
          id: 'HEALTHCARE_COMMUNITY',
          title: 'Community or Healthcare Setting',
          badge: 'Human-Centered',
          description: 'Direct in-person interaction supporting patients, clients, students, or community members in dynamic settings.',
        },
      ],
    },

    q5: {
      stepNumber: 5,
      title: 'When faced with a tough, unfamiliar problem, how do you instinctively begin?',
      helperText: 'Choose the problem-solving style that feels like your default mindset.',
      options: [
        {
          id: 'SYSTEMATIC_LOGIC',
          title: 'Step-by-Step Logic',
          description: 'Breaking the problem down into orderly, manageable components and testing solutions methodically.',
        },
        {
          id: 'CREATIVE_EXPLORATION',
          title: 'Open Brainstorming',
          description: 'Sketching out wild ideas, looking for unconventional angles, and trying unexpected combinations.',
        },
        {
          id: 'PEOPLE_RELATIONAL',
          title: 'Talking It Through',
          description: 'Asking people about their experiences, listening to different perspectives, and collaborating on answers.',
        },
        {
          id: 'PRACTICAL_HANDS_ON',
          title: 'Tinkering by Doing',
          description: 'Jumping straight in, building a quick rough draft or prototype, and learning from immediate trial and error.',
        },
      ],
    },

    q6: {
      stepNumber: 6,
      title: 'How does social interaction affect your energy across a typical day?',
      helperText: 'Be honest about your social battery—sustainable careers align with your natural rhythm.',
      options: [
        {
          id: 'INDEPENDENT_DEEP_FOCUS',
          title: 'Mostly Independent Focus',
          description: 'You recharge with solo deep work and prefer having just a few scheduled meetings a week.',
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
      title: 'What level of day-to-day structure helps you feel at your best?',
      helperText: 'Think about whether uncertainty excites you or stresses you out.',
      options: [
        {
          id: 'HIGH_STRUCTURE_CLEAR_RULES',
          title: 'Clear Expectations & Defined Guidelines',
          description: 'You thrive when goals, workflows, and deliverables are clearly outlined with reliable consistency.',
        },
        {
          id: 'BALANCED_MILESTONES',
          title: 'Defined Goals with Freedom in How You Work',
          description: 'You like having clear milestones, but prefer choosing your own path and schedule to reach them.',
        },
        {
          id: 'HIGH_AUTONOMY_AMBIGUITY',
          title: 'Open-Ended Freedom & Fast Changes',
          description: 'You get bored by repetition and love charting your own course through unpredictable challenges.',
        },
      ],
    },

    q8: {
      stepNumber: 8,
      title: 'Which academic demand tends to create the most stress or friction for you?',
      helperText: 'We will ensure your pathway recommendations include strategies and courses that respect this boundary.',
      options: [
        {
          id: 'ADVANCED_MATH',
          title: 'High-Level Theoretical Mathematics',
          badge: 'Heavy Formulas',
          description: 'Calculus proofs, abstract algebra, and heavy numerical theory cause acute frustration.',
        },
        {
          id: 'PUBLIC_SPEAKING',
          title: 'High-Stakes Public Presentations',
          badge: 'Stage Anxiety',
          description: 'Speaking in front of large auditoriums, formal debates, or cold-calling unfamiliar crowds.',
        },
        {
          id: 'HEAVY_MEMORIZATION',
          title: 'Massive Rote Memorization',
          badge: 'Flashcards & Anatomy',
          description: 'Memorizing hundreds of Latin terms, formulas, or historical dates under timed exam conditions.',
        },
        {
          id: 'INTENSIVE_WRITING',
          title: 'Lengthy Abstract Academic Essays',
          badge: '30-Page Research',
          description: 'Drafting extensive theoretical dissertations, dense citations, and endless literary analyses.',
        },
        {
          id: 'ISOLATED_THEORY',
          title: 'Hyper-Isolated Solitary Theory',
          badge: 'No Real-World Context',
          description: 'Spending months studying pure theory without any tangible, real-world practical application.',
        },
      ],
    },

    q9: {
      stepNumber: 9,
      title: 'Looking at your future, what matters most for your peace of mind?',
      helperText: 'Your core priority helps us weight pathways that align with your personal definition of success.',
      options: [
        {
          id: 'FINANCIAL_STABILITY',
          title: 'Financial Stability & High Security',
          description: 'A reliable, predictable paycheck, strong health benefits, and high job security.',
        },
        {
          id: 'PURPOSE_IMPACT',
          title: 'Purpose & Meaningful Contribution',
          description: 'Knowing your daily work directly improves other people’s lives or protects the planet.',
        },
        {
          id: 'CREATIVE_AUTONOMY',
          title: 'Creative Freedom & Expression',
          description: 'Having the autonomy to make original work, experiment, and bring your unique voice to life.',
        },
        {
          id: 'INTELLECTUAL_DEPTH',
          title: 'Mastery & Intellectual Challenge',
          description: 'Diving deep into complex domains, becoming a genuine expert, and continuous lifelong learning.',
        },
        {
          id: 'WORK_LIFE_BALANCE',
          title: 'Sustainable Work-Life Harmony',
          description: 'Strict 40-hour weeks that leave plenty of time and emotional energy for family, hobbies, and rest.',
        },
      ],
    },

    q10: {
      stepNumber: 10,
      title: 'Looking immediately past college, what timeline feels right for your next chapter?',
      helperText: 'Remember: your choice is never permanent. Choose what fits your peace of mind today.',
      options: [
        {
          id: 'WORKFORCE_DIRECT',
          title: 'Direct Career Entry (2 to 4-Year Horizon)',
          badge: 'Independence First',
          description: 'Step directly into professional employment soon after graduation to earn an income and learn on the job.',
        },
        {
          id: 'GRADUATE_STUDY',
          title: 'Graduate or Professional School',
          badge: 'Advanced Specialization',
          description: 'Continue into master’s degrees, medical or law school, or specialized clinical training.',
        },
        {
          id: 'FLEXIBLE_ENTREPRENEURSHIP',
          title: 'Entrepreneurship or Exploratory Projects',
          badge: 'Self-Directed',
          description: 'Launch a project, join an early-stage startup, or take a flexible gap year to build your own path.',
        },
      ],
    },
  },

  navigation: {
    previous: 'Previous',
    next: 'Continue',
    finish: 'Finish & Explore Pathways',
    previousAriaLabel: 'Return to previous step',
    nextAriaLabel: 'Proceed to next question',
    finishAriaLabel: 'Submit responses and generate personalized pathways',
    disabledNotice: 'Please complete the question above to continue.',
  },

  validation: {
    fullNameRequired: 'Please enter your full name (at least 1 character).',
    fullNameMaxLength: 'Name must be 100 characters or fewer.',
    gradeLevelRequired: 'Please select your current grade or college year.',
    studentIdMaxLength: 'Student ID must be 64 characters or fewer.',
    q1Required: 'Please select 1 or 2 tasks that feel natural to you.',
    q2SubjectRequired: 'Please choose a subject area that sparks your curiosity.',
    q3HesitationRequired: 'Please share a quick thought (at least 1 character) about what worries or excites you.',
    q3HesitationMaxLength: 'Please keep your thought within 200 characters.',
    q4EnvironmentRequired: 'Please select the physical work setting where you feel most comfortable.',
    q5ProblemSolvingRequired: 'Please select how you instinctively approach tough problems.',
    q6SocialEnergyRequired: 'Please select how social interaction affects your energy.',
    q7StructureRequired: 'Please choose the level of day-to-day structure you prefer.',
    q8FrictionRequired: 'Please select the academic demand that causes you the most stress.',
    q9PriorityRequired: 'Please choose what matters most for your future peace of mind.',
    q10AmbitionRequired: 'Please select the timeline that feels right for your next chapter.',
    navigationBlocked: 'Please complete the current question before moving forward. Take all the time you need.',
  },

  resetDialog: {
    triggerButton: 'Start Over',
    title: 'Start fresh with a clean slate?',
    description: 'This will clear all your answers and return you to the Welcome screen. You can take as much time as you need.',
    confirm: 'Yes, start over',
    cancel: 'Keep my answers',
    ariaLabel: 'Reset intake questionnaire confirmation dialog',
  },

  a11y: {
    wizardLandmark: 'PathLess College Major and Career Exploration Guide',
    progressNav: 'Questionnaire progress navigation',
    stepAnnouncement: (current: number, total: number, title: string) =>
      `Step ${current} of ${total}: ${title}`,
    characterMilestoneWarning: (remaining: number) => `${remaining} characters remaining`,
    characterLimitReached: 'Maximum 200 character limit reached',
    resetCompleted: 'Answers have been reset. Welcome to PathLess Guide.',
  },
} as const;

export type GuideCopyType = typeof GUIDE_COPY;
