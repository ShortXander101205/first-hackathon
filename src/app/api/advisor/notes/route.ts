import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdvisorSessionFromRequest } from '@/lib/auth';
import { findMockAdvisorSubmission } from '@/data/mockAdvisorSubmissions';
import { advisorNotesRateLimiter, getClientIp } from '@/lib/rateLimit';
import { sanitizeString } from '@/lib/sanitize';
import { createProblemResponse, handleServerError, generateRequestId } from '@/lib/apiErrors';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = generateRequestId();
  const clientIp = getClientIp(request);

  // 1. Session verification
  const session = getAdvisorSessionFromRequest(request);
  if (!session) {
    return createProblemResponse(
      401,
      'UNAUTHORIZED',
      'Please enter your advisor passcode to save advisor notes.',
      { instance: '/api/advisor/notes', requestId }
    );
  }

  // 2. Rate limiting check (30 req / 1 min)
  const rateStatus = advisorNotesRateLimiter.consume(clientIp);
  if (!rateStatus.allowed) {
    return createProblemResponse(
      429,
      'RATE_LIMITED',
      'You are saving notes faster than normal. Please pause a moment before submitting your next note.',
      {
        instance: '/api/advisor/notes',
        requestId,
        retryAfter: rateStatus.retryAfterSeconds,
      }
    );
  }

  // 3. Parse JSON body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createProblemResponse(
      400,
      'VALIDATION_FAILED',
      'Invalid request format. Expected JSON.',
      { instance: '/api/advisor/notes', requestId }
    );
  }

  const { submissionId, content, authorName } = (body as {
    submissionId?: string;
    content?: string;
    authorName?: string;
  }) || {};

  // 4. Validate and sanitize inputs
  const sanitizedSubmissionId = sanitizeString(submissionId);
  if (!sanitizedSubmissionId || sanitizedSubmissionId.trim() === '') {
    return createProblemResponse(
      400,
      'VALIDATION_FAILED',
      'A valid student submission identifier is required.',
      { instance: '/api/advisor/notes', requestId }
    );
  }

  const sanitizedContent = sanitizeString(content);
  if (!sanitizedContent || sanitizedContent.trim().length === 0) {
    return createProblemResponse(
      400,
      'VALIDATION_FAILED',
      'Note content cannot be blank.',
      { instance: '/api/advisor/notes', requestId }
    );
  }

  if (sanitizedContent.length > 2000) {
    return createProblemResponse(
      400,
      'VALIDATION_FAILED',
      'Notes are limited to a maximum of 2,000 characters.',
      { instance: '/api/advisor/notes', requestId }
    );
  }

  const sanitizedAuthor = sanitizeString(authorName);
  const noteAuthor =
    sanitizedAuthor && sanitizedAuthor.trim() !== ''
      ? sanitizedAuthor.trim()
      : session.authorName && session.authorName.trim() !== ''
      ? session.authorName.trim()
      : 'Advisor';

  try {
    const note = await prisma.advisorNote.create({
      data: {
        submissionId: sanitizedSubmissionId.trim(),
        content: sanitizedContent.trim(),
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
    const mockSub = findMockAdvisorSubmission(sanitizedSubmissionId);
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '' || mockSub) {
      const mockNote = {
        id: `note_${Date.now()}`,
        submissionId: sanitizedSubmissionId.trim(),
        authorName: noteAuthor,
        content: sanitizedContent.trim(),
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

    return handleServerError(error, '/api/advisor/notes', requestId);
  }
}
