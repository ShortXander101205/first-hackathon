/**
 * PathLess: College Major and Career Discovery Guide v2
 * Centralized Copy for School Advisor Portal & Authentication
 * Tone: Supportive, clear, non-technical educator language.
 * 
 * Strict Invariant: 100% of user-facing strings across the advisor dashboard,
 * authentication modals, table labels, notes editor, and purge notices must live
 * strictly in this file. Zero database or SQL jargon permitted.
 * Invariant: Zero legacy branding or prohibited technical terminology permitted.
 */

export const ADVISOR_COPY = {
  portal: {
    brandName: 'PathLess for Advisors',
    pageTitle: 'School Advisor & Mentor Directory',
    tagline: 'Review student career reflections, exploratory majors, and notes with zero pressure.',
    frameworkBadge: 'Framework v2',
    logoutButton: 'Sign Out',
    logoutAriaLabel: 'Sign out of the Advisor Portal',
  },

  login: {
    title: 'School Advisor Access',
    subtitle: 'Enter your school passcode to access your students’ pathway reflections and session notes.',
    passcodeLabel: 'School Passcode',
    passcodePlaceholder: 'e.g., TEACHER2026',
    passcodeHelper: 'Ask your school guidance lead or principal if you do not know your school passcode.',
    authorNameLabel: 'Your Name or Advisor Title (Optional)',
    authorNamePlaceholder: 'e.g., Kru Nan / Advisor Davis',
    authorNameHelper: 'This will be attached to any private notes you write during student meetings.',
    submitButton: 'Open Advisor Directory',
    authenticatingButton: 'Verifying Passcode...',
    errorMessage: 'The passcode entered does not match our school records. Please check the code and try again.',
    privacyNote: 'Student submissions are kept private to your school community and auto-archived annually.',
  },

  directory: {
    searchPlaceholder: 'Search by student name or student ID...',
    searchLabel: 'Search students',
    gradeFilterLabel: 'Filter by grade level',
    allGradesOption: 'All Grades & Years',
    gradeOptions: {
      grade_10: '10th Grade',
      grade_11: '11th Grade',
      grade_12: '12th Grade',
      college_freshman: 'Freshman (Yr 1)',
      college_sophomore: 'Sophomore (Yr 2)',
    },
    dateFilterLabel: 'Filter by date',
    dateOptions: {
      all: 'All Time',
      past7Days: 'Past 7 Days',
      past30Days: 'Past 30 Days',
      currentYear: 'Current Academic Year',
    },
    tableCaption: 'Student Discovery Submissions Directory',
    tableHeaders: {
      student: 'Student',
      grade: 'Grade Level',
      topDirection: 'Top Pathway',
      submittedDate: 'Submission Date',
      notesCount: 'Advisor Notes',
      actions: 'Actions',
    },
    viewDetailCta: 'View Full Guide',
    viewDetailAria: (name: string) => `View full pathway discovery details for ${name}`,
    emptyStateTitle: 'No Student Submissions Found',
    emptyStateDescription: 'No student guides match your current search or filter. Submissions will appear here once students complete their intake.',
    loadingText: 'Loading student directory...',
    recordsCount: (count: number) => `${count} student ${count === 1 ? 'submission' : 'submissions'} found`,
  },

  drawer: {
    closeButtonAria: 'Close student details',
    loadingText: 'Retrieving student guide and recommendations...',
    profileSectionTitle: 'Student Profile & Context',
    gradeLevelLabel: 'Grade Level',
    studentIdLabel: 'Student ID',
    academicYearLabel: 'Academic Year',
    submittedDateLabel: 'Submitted',
    notProvided: 'Not provided',
    intakeAnswersTitle: 'What Naturally Energizes Them',
    hesitationSectionTitle: 'Academic Hesitation & Worry',
    subjectLabel: 'Curiosity Subject',
    environmentLabel: 'Work Environment',
    thinkingStyleLabel: 'Thinking Style',
    priorityLabel: 'Core Priority',
    pathwaysSectionTitle: 'Recommended Pathways',
    stage1MilestoneLabel: '1. College Major:',
    stage2MilestoneLabel: '2. First Job:',
    stage3MilestoneLabel: '3. Growth Role:',
    relevantMajorsLabel: 'Related Majors:',
    matchedUnisTitle: 'Verified Regional Higher Education Programs',
    notesSectionTitle: 'Private Advisor Session Notes',
    noNotesNotice: 'No notes have been recorded for this student yet. Use the form below to record notes from your advising conversation.',
    errorFallback: 'Unable to load student record details. Please try again.',
  },

  notes: {
    composerLabel: 'New Advisor Note',
    composerPlaceholder: 'Record discussion points, university preferences, or follow-up milestones for this student...',
    authorLabel: 'Author',
    authorDefault: 'Advisor',
    saveButton: 'Save Note',
    savingButton: 'Saving Note...',
    savedNotice: 'Note saved successfully to student record.',
    charCount: (current: number, max: number) => `${current}/${max} characters`,
    errorMessage: 'Unable to save your note right now. Please try again.',
  },

  purgeNotice: {
    title: 'Annual Academic Archive',
    description: 'PathLess automatically removes student submissions created prior to July 1 of the active school year to safeguard student privacy.',
    statusMessage: (count: number, date: string) =>
      `Archived ${count} submissions from prior academic cycles (cut-off: ${date}).`,
  },

  errors: {
    sessionExpired: 'Your advisor session has expired. Please enter your school passcode again.',
    networkError: 'We could not reach the school server. Please verify your connection.',
    unauthorized: 'Advisor authentication required.',
  },
} as const;

export type AdvisorCopyType = typeof ADVISOR_COPY;
