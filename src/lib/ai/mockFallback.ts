/**
 * PathwayAI: Curated High-Fidelity Mock Triage Fallback
 * Guarantees 100% demo uptime and resilience when API keys are unconfigured or rate-limited.
 */

import { IntakeAnswersState } from '@/types/intake';
import { TriageResultInput } from '@/schemas/triage.schema';
import fallbackCareers from '@/fixtures/fallback-careers.json';

export function getMockTriageRecommendations(
  answers: IntakeAnswersState,
  studentNickname?: string
): any {
  const name = studentNickname?.trim() || 'Alex';
  const rationaleSnippet = answers.q2Rationale?.trim() || 'academic coursework';

  return {
    summary: {
      student_archetype: fallbackCareers.summary.student_archetype,
      triage_narrative: `${name} demonstrates natural analytical problem-solving instincts. Rather than confronting ${rationaleSnippet} in dry isolation, these pathways ground technical challenges in applied tools and direct workforce utility.`,
    },
    careers: [
      {
        id: 'career_1',
        role_title: fallbackCareers.careers[0].role_title,
        match_tier: 'Primary Direct Match',
        fit_score: fallbackCareers.careers[0].fit_score,
        fit_rationale: fallbackCareers.careers[0].fit_rationale,
        majors: fallbackCareers.careers[0].majors,
        minors: ['Applied Data Analysis', 'Technical Writing'],
        daily_tasks: fallbackCareers.careers[0].daily_tasks,
        day_in_the_life: {
          tasks: fallbackCareers.careers[0].daily_tasks,
          misconceptions: [
            'Myth: Requires calculating complex mathematical proofs all day. Reality: Focuses on architectural logic, systems automation, and practical configuration tools.',
          ],
        },
        course_challenges: fallbackCareers.careers[0].course_challenges,
        reassurance: `Unlike high school testing that creates anxiety around ${rationaleSnippet}, systems coursework is grounded in hands-on terminal commands, virtual machines, and visible server behaviors where every action yields immediate visual feedback.`,
        trial_courses: fallbackCareers.careers[0].trial_courses as any,
      },
      {
        id: 'career_2',
        role_title: fallbackCareers.careers[1].role_title,
        match_tier: 'High-Growth Pathway',
        fit_score: fallbackCareers.careers[1].fit_score,
        fit_rationale: fallbackCareers.careers[1].fit_rationale,
        majors: fallbackCareers.careers[1].majors,
        minors: ['Cyberlaw & Compliance', 'Network Security'],
        daily_tasks: fallbackCareers.careers[1].daily_tasks,
        day_in_the_life: {
          tasks: fallbackCareers.careers[1].daily_tasks,
          misconceptions: [
            'Myth: You need to be a math genius or master hacker. Reality: Most analysts focus on pattern detection, policy auditing, and tool configuration.',
          ],
        },
        course_challenges: fallbackCareers.careers[1].course_challenges,
        reassurance: fallbackCareers.careers[1].reassurance,
        trial_courses: fallbackCareers.careers[1].trial_courses as any,
      },
      {
        id: 'career_3',
        role_title: fallbackCareers.careers[2].role_title,
        match_tier: 'Interdisciplinary Pivot',
        fit_score: fallbackCareers.careers[2].fit_score,
        fit_rationale: fallbackCareers.careers[2].fit_rationale,
        majors: fallbackCareers.careers[2].majors,
        minors: ['Health Information Systems', 'Business Intelligence'],
        daily_tasks: fallbackCareers.careers[2].daily_tasks,
        day_in_the_life: {
          tasks: fallbackCareers.careers[2].daily_tasks,
          misconceptions: [
            'Myth: You code in total social isolation. Reality: You collaborate closely with healthcare teams to improve patient workflows.',
          ],
        },
        course_challenges: fallbackCareers.careers[2].course_challenges,
        reassurance: fallbackCareers.careers[2].reassurance,
        trial_courses: fallbackCareers.careers[2].trial_courses as any,
      },
      {
        id: 'career_4',
        role_title: fallbackCareers.careers[3].role_title,
        match_tier: 'Moonshot Trajectory',
        fit_score: fallbackCareers.careers[3].fit_score,
        fit_rationale: fallbackCareers.careers[3].fit_rationale,
        majors: fallbackCareers.careers[3].majors,
        minors: ['3D Modeling & Robotics', 'Applied Physics'],
        daily_tasks: fallbackCareers.careers[3].daily_tasks,
        day_in_the_life: {
          tasks: fallbackCareers.careers[3].daily_tasks,
          misconceptions: [
            'Myth: Requires advanced theoretical calculus derivations. Reality: Visual simulation software lets you adjust real-world physics parameters interactively.',
          ],
        },
        course_challenges: fallbackCareers.careers[3].course_challenges,
        reassurance: fallbackCareers.careers[3].reassurance,
        trial_courses: fallbackCareers.careers[3].trial_courses as any,
      },
    ],
  };
}

/**
 * PathLess Guide v2: Curated 4-card mock recommendations grounded in 10-question intake.
 * Strictly adheres to word limits (<= 30 overview, <= 65 study path, <= 65 reassurance)
 * and prohibits hallucinated university admissions data.
 */
export function getMockGuideRecommendations(payload?: {
  studentProfile?: { fullName?: string; gradeLevel?: string };
  intakeAnswers?: { q2SubjectId?: string; q3AcademicHesitation?: string };
}): {
  success: boolean;
  submissionId: string;
  studentProfile: any;
  summary: {
    studentArchetype: string;
    student_archetype: string;
    narrativeSummary: string;
    narrative_summary: string;
    triage_narrative: string;
  };
  pathways: any[];
  careers: any[];
  meta: {
    engine: string;
    generationLatencyMs: number;
    fallbackUsed: boolean;
  };
} {
  const rawName = payload?.studentProfile?.fullName?.trim();
  const name = rawName ? rawName.split(/\s+/)[0] : 'Alex';
  const hesitation = payload?.intakeAnswers?.q3AcademicHesitation?.trim();

  const reassurance1 = hesitation
    ? `Instead of high-stakes testing that makes you worry about ${hesitation.slice(0, 35)}, coursework focuses on hands-on virtual labs where actions provide immediate visual confirmation.`
    : 'Instead of high-stakes testing or abstract formulas, coursework focuses on practical terminal tools and virtual machines where actions provide immediate visual confirmation.';

  const cards = [
    {
      id: 'pathway_1',
      roleTitle: 'Cloud Infrastructure & Reliability Analyst',
      role_title: 'Cloud Infrastructure & Reliability Analyst',
      broadField: 'Information Technology & Distributed Systems',
      broad_field: 'Information Technology & Distributed Systems',
      matchTier: 'Primary Direct Match',
      match_tier: 'Primary Direct Match',
      fitScore: 95,
      fit_score: 95,
      overview: 'Designs, automates, and maintains reliable digital servers and cloud services that keep everyday apps running seamlessly.',
      fitRationale: 'Designs, automates, and maintains reliable digital servers and cloud services that keep everyday apps running seamlessly.',
      fit_rationale: 'Designs, automates, and maintains reliable digital servers and cloud services that keep everyday apps running seamlessly.',
      dailyTasks: [
        'Automate cloud server infrastructure using modern script templates',
        'Configure automated system monitoring and rapid health checks',
        'Investigate and fix network connectivity bottlenecks across servers',
      ],
      daily_tasks: [
        'Automate cloud server infrastructure using modern script templates',
        'Configure automated system monitoring and rapid health checks',
        'Investigate and fix network connectivity bottlenecks across servers',
      ],
      studyPath: 'Foundational coursework covers operating systems, networking basics, cloud architecture, and automation scripting. You learn through hands-on virtual labs.',
      courseChallenges: 'Foundational coursework covers operating systems, networking basics, cloud architecture, and automation scripting. You learn through hands-on virtual labs.',
      course_challenges: 'Foundational coursework covers operating systems, networking basics, cloud architecture, and automation scripting. You learn through hands-on virtual labs.',
      reassurance: reassurance1,
      majors: ['Cloud Computing Architecture', 'Information Technology', 'Network Systems'],
      minors: ['Applied Data Analytics', 'Technical Writing'],
      trialCourses: [
        {
          title: 'AWS Cloud Practitioner Essentials',
          provider: 'AWS Skill Builder (Free)',
          description: 'Learn foundational cloud concepts, storage, and networking without fees.',
          estimatedHours: 6,
          estimated_hours: 6,
          searchQuery: 'AWS Cloud Practitioner Essentials free course',
        },
        {
          title: 'Linux Command Line Basics',
          provider: 'freeCodeCamp',
          description: 'Hands-on terminal commands and navigation for beginners.',
          estimatedHours: 3,
          estimated_hours: 3,
          searchQuery: 'freeCodeCamp Linux command line basics',
        },
      ],
      trial_courses: [
        {
          title: 'AWS Cloud Practitioner Essentials',
          provider: 'AWS Skill Builder (Free)',
          description: 'Learn foundational cloud concepts, storage, and networking without fees.',
          estimatedHours: 6,
          estimated_hours: 6,
          searchQuery: 'AWS Cloud Practitioner Essentials free course',
        },
        {
          title: 'Linux Command Line Basics',
          provider: 'freeCodeCamp',
          description: 'Hands-on terminal commands and navigation for beginners.',
          estimatedHours: 3,
          estimated_hours: 3,
          searchQuery: 'freeCodeCamp Linux command line basics',
        },
      ],
      whereToStudyReady: true,
    },
    {
      id: 'pathway_2',
      roleTitle: 'Cybersecurity Defense & Incident Analyst',
      role_title: 'Cybersecurity Defense & Incident Analyst',
      broadField: 'Information Assurance & Security',
      broad_field: 'Information Assurance & Security',
      matchTier: 'High-Growth Pathway',
      match_tier: 'High-Growth Pathway',
      fitScore: 91,
      fit_score: 91,
      overview: 'Monitors digital environments to identify security vulnerabilities, investigate abnormal activity, and safeguard sensitive data.',
      fitRationale: 'Monitors digital environments to identify security vulnerabilities, investigate abnormal activity, and safeguard sensitive data.',
      fit_rationale: 'Monitors digital environments to identify security vulnerabilities, investigate abnormal activity, and safeguard sensitive data.',
      dailyTasks: [
        'Review automated security logs to identify suspicious network activity',
        'Execute automated vulnerability scans across web applications',
        'Document remediation steps in clear, structured security advisories',
      ],
      daily_tasks: [
        'Review automated security logs to identify suspicious network activity',
        'Execute automated vulnerability scans across web applications',
        'Document remediation steps in clear, structured security advisories',
      ],
      studyPath: 'Studies focus on defensive security fundamentals, network protection, cyber law, and policy auditing, with strong emphasis on defensive methodologies.',
      courseChallenges: 'Studies focus on defensive security fundamentals, network protection, cyber law, and policy auditing, with strong emphasis on defensive methodologies.',
      course_challenges: 'Studies focus on defensive security fundamentals, network protection, cyber law, and policy auditing, with strong emphasis on defensive methodologies.',
      reassurance: 'You do not need to be a math prodigy or expert hacker. Practical analysts focus on pattern detection, defensive configuration, and clear communication.',
      majors: ['Cybersecurity', 'Information Assurance', 'Computer Systems'],
      minors: ['Digital Forensics', 'Compliance Policy'],
      trialCourses: [
        {
          title: 'Google Cybersecurity Certificate Foundations',
          provider: 'Coursera (Free Audit)',
          description: 'Explore security defense fundamentals and network safety.',
          estimatedHours: 8,
          estimated_hours: 8,
          searchQuery: 'Coursera Google Cybersecurity certificate audit',
        },
        {
          title: 'Introduction to Cybersecurity Fundamentals',
          provider: 'edX',
          description: 'Learn core defense principles and digital hygiene basics.',
          estimatedHours: 4,
          estimated_hours: 4,
          searchQuery: 'edX cybersecurity basics free audit',
        },
      ],
      trial_courses: [
        {
          title: 'Google Cybersecurity Certificate Foundations',
          provider: 'Coursera (Free Audit)',
          description: 'Explore security defense fundamentals and network safety.',
          estimatedHours: 8,
          estimated_hours: 8,
          searchQuery: 'Coursera Google Cybersecurity certificate audit',
        },
        {
          title: 'Introduction to Cybersecurity Fundamentals',
          provider: 'edX',
          description: 'Learn core defense principles and digital hygiene basics.',
          estimatedHours: 4,
          estimated_hours: 4,
          searchQuery: 'edX cybersecurity basics free audit',
        },
      ],
      whereToStudyReady: true,
    },
    {
      id: 'pathway_3',
      roleTitle: 'Health Informatics Systems Coordinator',
      role_title: 'Health Informatics Systems Coordinator',
      broadField: 'Applied Health Sciences & Information Technology',
      broad_field: 'Applied Health Sciences & Information Technology',
      matchTier: 'Interdisciplinary Pivot',
      match_tier: 'Interdisciplinary Pivot',
      fitScore: 87,
      fit_score: 87,
      overview: 'Bridges healthcare workflows and software systems to ensure doctors and care teams can securely access vital patient data.',
      fitRationale: 'Bridges healthcare workflows and software systems to ensure doctors and care teams can securely access vital patient data.',
      fit_rationale: 'Bridges healthcare workflows and software systems to ensure doctors and care teams can securely access vital patient data.',
      dailyTasks: [
        'Configure electronic health record workflows for hospital clinical staff',
        'Analyze patient data intake bottlenecks to streamline reporting',
        'Train clinical staff on updated digital healthcare documentation tools',
      ],
      daily_tasks: [
        'Configure electronic health record workflows for hospital clinical staff',
        'Analyze patient data intake bottlenecks to streamline reporting',
        'Train clinical staff on updated digital healthcare documentation tools',
      ],
      studyPath: 'Coursework integrates health system operations, healthcare privacy regulations, medical terminology, and relational database management.',
      courseChallenges: 'Coursework integrates health system operations, healthcare privacy regulations, medical terminology, and relational database management.',
      course_challenges: 'Coursework integrates health system operations, healthcare privacy regulations, medical terminology, and relational database management.',
      reassurance: 'This pathway lets you make a meaningful difference in healthcare without needing surgical training or high-pressure clinical exams.',
      majors: ['Health Informatics', 'Health Information Management', 'Applied Data Systems'],
      minors: ['Healthcare Administration', 'Applied Statistics'],
      trialCourses: [
        {
          title: 'Healthcare Informatics Foundations',
          provider: 'Coursera (Free Audit)',
          description: 'Understand digital health systems and information flow in medicine.',
          estimatedHours: 6,
          estimated_hours: 6,
          searchQuery: 'Coursera Healthcare Informatics foundations',
        },
        {
          title: 'SQL for Data Analysis',
          provider: 'Khan Academy',
          description: 'Learn how to query, filter, and organize database records.',
          estimatedHours: 4,
          estimated_hours: 4,
          searchQuery: 'Khan Academy SQL data analysis free',
        },
      ],
      trial_courses: [
        {
          title: 'Healthcare Informatics Foundations',
          provider: 'Coursera (Free Audit)',
          description: 'Understand digital health systems and information flow in medicine.',
          estimatedHours: 6,
          estimated_hours: 6,
          searchQuery: 'Coursera Healthcare Informatics foundations',
        },
        {
          title: 'SQL for Data Analysis',
          provider: 'Khan Academy',
          description: 'Learn how to query, filter, and organize database records.',
          estimatedHours: 4,
          estimated_hours: 4,
          searchQuery: 'Khan Academy SQL data analysis free',
        },
      ],
      whereToStudyReady: true,
    },
    {
      id: 'pathway_4',
      roleTitle: 'Autonomous Simulation Systems Specialist',
      role_title: 'Autonomous Simulation Systems Specialist',
      broadField: 'Applied Simulation & Robotics',
      broad_field: 'Applied Simulation & Robotics',
      matchTier: 'Moonshot Trajectory',
      match_tier: 'Moonshot Trajectory',
      fitScore: 83,
      fit_score: 83,
      overview: 'Builds realistic virtual 3D test environments to safely test robotics and autonomous vehicles before real-world deployment.',
      fitRationale: 'Builds realistic virtual 3D test environments to safely test robotics and autonomous vehicles before real-world deployment.',
      fit_rationale: 'Builds realistic virtual 3D test environments to safely test robotics and autonomous vehicles before real-world deployment.',
      dailyTasks: [
        'Build virtual physics environments using 3D simulation software',
        'Simulate sensor edge cases under difficult environmental conditions',
        'Generate automated telemetry reports for hardware engineering teams',
      ],
      daily_tasks: [
        'Build virtual physics environments using 3D simulation software',
        'Simulate sensor edge cases under difficult environmental conditions',
        'Generate automated telemetry reports for hardware engineering teams',
      ],
      studyPath: 'Focuses on 3D computational mechanics, interactive simulation tools, physics engines, and robotics testing frameworks.',
      courseChallenges: 'Focuses on 3D computational mechanics, interactive simulation tools, physics engines, and robotics testing frameworks.',
      course_challenges: 'Focuses on 3D computational mechanics, interactive simulation tools, physics engines, and robotics testing frameworks.',
      reassurance: 'Interactive 3D simulation software allows you to visualize dynamic mechanical principles in real time instead of memorizing dry equations on paper.',
      majors: ['Robotics Systems Engineering', 'Applied Simulation Technology', 'Computational Media'],
      minors: ['Computer Animation', 'Applied Physics'],
      trialCourses: [
        {
          title: 'Robotics Simulation Basics with ROS',
          provider: 'freeCodeCamp',
          description: 'Walkthrough of robot movements in simulated virtual environments.',
          estimatedHours: 5,
          estimated_hours: 5,
          searchQuery: 'freeCodeCamp robotics simulation basics',
        },
        {
          title: 'Physics for Simulation and Game Environments',
          provider: 'Khan Academy',
          description: 'Intuitive visual physics and vector mathematics concepts.',
          estimatedHours: 4,
          estimated_hours: 4,
          searchQuery: 'Khan Academy physics for simulation',
        },
      ],
      trial_courses: [
        {
          title: 'Robotics Simulation Basics with ROS',
          provider: 'freeCodeCamp',
          description: 'Walkthrough of robot movements in simulated virtual environments.',
          estimatedHours: 5,
          estimated_hours: 5,
          searchQuery: 'freeCodeCamp robotics simulation basics',
        },
        {
          title: 'Physics for Simulation and Game Environments',
          provider: 'Khan Academy',
          description: 'Intuitive visual physics and vector mathematics concepts.',
          estimatedHours: 4,
          estimated_hours: 4,
          searchQuery: 'Khan Academy physics for simulation',
        },
      ],
      whereToStudyReady: true,
    },
  ];

  const summary = {
    studentArchetype: 'The Thoughtful Systems Explorer',
    student_archetype: 'The Thoughtful Systems Explorer',
    narrativeSummary: `${name} demonstrates natural curiosity and methodical problem-solving strengths. Rather than wrestling with abstract academic theory in isolation, these 4 supportive pathways connect what energizes you with practical, high-value degrees.`,
    narrative_summary: `${name} demonstrates natural curiosity and methodical problem-solving strengths. Rather than wrestling with abstract academic theory in isolation, these 4 supportive pathways connect what energizes you with practical, high-value degrees.`,
    triage_narrative: `${name} demonstrates natural curiosity and methodical problem-solving strengths. Rather than wrestling with abstract academic theory in isolation, these 4 supportive pathways connect what energizes you with practical, high-value degrees.`,
  };

  return {
    success: true,
    submissionId: `sub_mock_${Date.now()}`,
    studentProfile: payload?.studentProfile || { fullName: name, gradeLevel: 'grade_12' },
    summary,
    pathways: cards,
    careers: cards,
    meta: {
      engine: 'mock-grounded-engine',
      generationLatencyMs: 42,
      fallbackUsed: true,
    },
  };
}

