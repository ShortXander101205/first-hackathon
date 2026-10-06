import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdvisorSessionFromRequest } from '@/lib/auth';
import { MOCK_ADVISOR_SUBMISSIONS } from '@/data/mockAdvisorSubmissions';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  const session = getAdvisorSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/unauthorized',
        title: 'Advisor Authentication Required',
        status: 401,
        detail: 'Please enter your advisor passcode to save advisor notes.',
      },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/validation-failed',
        title: 'Bad Request',
        status: 400,
        detail: 'Invalid request format. Expected JSON.',
      },
      { status: 400 }
    );
  }

  const { submissionId, content, authorName } = (body as {
    submissionId?: string;
    content?: string;
    authorName?: string;
  }) || {};

  if (!submissionId || typeof submissionId !== 'string' || submissionId.trim() === '') {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/validation-failed',
        title: 'Bad Request',
        status: 400,
        detail: 'A valid student submission identifier is required.',
      },
      { status: 400 }
    );
  }

  const trimmedContent = typeof content === 'string' ? content.trim() : '';
  if (!trimmedContent || trimmedContent.length === 0) {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/validation-failed',
        title: 'Bad Request',
        status: 400,
        detail: 'Note content cannot be blank.',
      },
      { status: 400 }
    );
  }

  if (trimmedContent.length > 2000) {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/validation-failed',
        title: 'Note Exceeds Length Limit',
        status: 400,
        detail: 'Notes are limited to a maximum of 2,000 characters.',
      },
      { status: 400 }
    );
  }

  const noteAuthor =
    (authorName && authorName.trim() !== '')
      ? authorName.trim()
      : (session.authorName && session.authorName.trim() !== '')
      ? session.authorName.trim()
      : 'Advisor';

  try {
    const note = await prisma.advisorNote.create({
      data: {
        submissionId: submissionId.trim(),
        content: trimmedContent,
        authorName: noteAuthor,
      },
    });

    return NextResponse.json(
      {
        success: true,
        note: {
          id: note.id,
          submissionId: note.submissionId,
          authorName: note.authorName,
          content: note.content,
          createdAt: typeof note.createdAt === 'string' ? note.createdAt : note.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // If DB is offline or mock submission is being edited in local demo
    const mockSub = MOCK_ADVISOR_SUBMISSIONS.find((m) => m.id === submissionId);
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '' || mockSub) {
      const mockNote = {
        id: `note_${Date.now()}`,
        submissionId: submissionId.trim(),
        authorName: noteAuthor,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
      };

      if (mockSub) {
        mockSub.notes.push(mockNote);
      }

      return NextResponse.json(
        {
          success: true,
          note: mockNote,
        },
        { status: 201 }
      );
    }

    console.error('[PathLess Advisor API] Error saving note:', error);
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/internal-error',
        title: 'Unable to Save Advisor Note',
        status: 500,
        detail: 'We encountered an error saving this note. Please try again.',
      },
      { status: 500 }
    );
  }
}
