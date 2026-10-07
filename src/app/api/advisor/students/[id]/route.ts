import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdvisorSessionFromRequest } from '@/lib/auth';
import { findMockAdvisorSubmission } from '@/data/mockAdvisorSubmissions';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const session = getAdvisorSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/unauthorized',
        title: 'Advisor Authentication Required',
        status: 401,
        detail: 'Please enter your advisor passcode to view student details.',
      },
      { status: 401 }
    );
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/validation-failed',
        title: 'Bad Request',
        status: 400,
        detail: 'Student record identifier is required.',
      },
      { status: 400 }
    );
  }

  // Check mock/in-memory sample submissions first if matching ID
  const mockSub = findMockAdvisorSubmission(id);

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
    if (mockSub) {
      return NextResponse.json(
        {
          success: true,
          submission: mockSub,
        },
        { status: 200 }
      );
    }
  }

  try {
    const submission = await prisma.studentSubmission.findUnique({
      where: { id },
      include: {
        intakeResponse: true,
        synthesisResult: true,
        advisorNotes: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!submission) {
      if (mockSub) {
        return NextResponse.json(
          {
            success: true,
            submission: mockSub,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          type: 'https://pathless.app/errors/not-found',
          title: 'Record Not Found',
          status: 404,
          detail: 'No student record found for the provided identifier.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        submission: {
          id: submission.id,
          fullName: submission.fullName,
          gradeLevel: submission.gradeLevel,
          studentId: submission.studentId,
          academicYear: submission.academicYear,
          createdAt: submission.createdAt.toISOString(),
          intakeAnswers: submission.intakeResponse?.answers || null,
          synthesisResult: submission.synthesisResult || null,
          notes: submission.advisorNotes.map((note: any) => ({
            id: note.id,
            authorName: note.authorName,
            content: note.content,
            createdAt: typeof note.createdAt === 'string' ? note.createdAt : note.createdAt.toISOString(),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (mockSub) {
      return NextResponse.json(
        {
          success: true,
          submission: mockSub,
        },
        { status: 200 }
      );
    }

    console.error('[PathLess Advisor API] Single student lookup error:', error);
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/internal-error',
        title: 'Unable to Retrieve Student Record',
        status: 500,
        detail: 'The requested student record could not be loaded at this moment.',
      },
      { status: 500 }
    );
  }
}
