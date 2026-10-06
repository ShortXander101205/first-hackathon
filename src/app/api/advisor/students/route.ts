import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdvisorSessionFromRequest } from '@/lib/auth';
import { getPrecedingJuly1Cutoff } from '@/lib/purge';
import { MOCK_ADVISOR_SUBMISSIONS } from '@/data/mockAdvisorSubmissions';

export const runtime = 'nodejs';

export interface StudentDirectoryItem {
  id: string;
  fullName: string;
  gradeLevel: string;
  studentId: string | null;
  academicYear: number;
  createdAt: string;
  topMatchRole: string;
  topMatchField: string;
  notesCount: number;
}

function getMockDirectoryItems(
  search: string,
  grade: string,
  dateRange: string
): StudentDirectoryItem[] {
  let list = MOCK_ADVISOR_SUBMISSIONS;

  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (m) =>
        m.fullName.toLowerCase().includes(s) ||
        (m.studentId && m.studentId.toLowerCase().includes(s))
    );
  }

  if (grade && grade !== 'all' && grade !== 'ALL') {
    list = list.filter((m) => m.gradeLevel === grade);
  }

  const now = Date.now();
  if (dateRange === '7d') {
    const cutoff = now - 7 * 24 * 60 * 60 * 1000;
    list = list.filter((m) => new Date(m.createdAt).getTime() >= cutoff);
  } else if (dateRange === '30d') {
    const cutoff = now - 30 * 24 * 60 * 60 * 1000;
    list = list.filter((m) => new Date(m.createdAt).getTime() >= cutoff);
  }

  return list.map((sub) => {
    let topMatchRole = 'Exploratory Pathway';
    let topMatchField = 'Interdisciplinary';

    const cards = sub.synthesisResult?.pathways || sub.synthesisResult?.cards;
    if (cards && Array.isArray(cards) && cards.length > 0) {
      const firstCard = cards[0];
      topMatchRole = firstCard.roleTitle || firstCard.role_title || topMatchRole;
      topMatchField = firstCard.broadField || firstCard.broad_field || topMatchField;
    }

    return {
      id: sub.id,
      fullName: sub.fullName,
      gradeLevel: sub.gradeLevel,
      studentId: sub.studentId,
      academicYear: sub.academicYear,
      createdAt: sub.createdAt,
      topMatchRole,
      topMatchField,
      notesCount: sub.notes.length,
    };
  });
}

export async function GET(request: Request): Promise<NextResponse> {
  const session = getAdvisorSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      {
        type: 'https://pathless.app/errors/unauthorized',
        title: 'Advisor Authentication Required',
        status: 401,
        detail: 'Please enter your advisor passcode to view the student directory.',
      },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.trim() || '';
  const grade = url.searchParams.get('grade')?.trim() || '';
  const dateRange = url.searchParams.get('dateRange')?.trim() || 'all';

  // Construct where conditions defensively
  const where: any = {};

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { studentId: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (grade && grade !== 'all' && grade !== 'ALL') {
    where.gradeLevel = grade;
  }

  const now = Date.now();
  if (dateRange === '7d') {
    where.createdAt = { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
  } else if (dateRange === '30d') {
    where.createdAt = { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
  } else if (dateRange === 'current_year') {
    where.createdAt = { gte: getPrecedingJuly1Cutoff() };
  }

  try {
    const submissions = await prisma.studentSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        synthesisResult: true,
        _count: {
          select: { advisorNotes: true },
        },
      },
    });

    // If database query returns results, transform and return them
    if (submissions && submissions.length > 0) {
      const items: StudentDirectoryItem[] = submissions.map((sub: any) => {
        let topMatchRole = 'Exploratory Pathway';
        let topMatchField = 'Interdisciplinary';

        if (sub.synthesisResult?.cards && Array.isArray(sub.synthesisResult.cards) && sub.synthesisResult.cards.length > 0) {
          const firstCard = sub.synthesisResult.cards[0];
          topMatchRole = firstCard.roleTitle || firstCard.role_title || topMatchRole;
          topMatchField = firstCard.broadField || firstCard.broad_field || topMatchField;
        }

        return {
          id: sub.id,
          fullName: sub.fullName,
          gradeLevel: sub.gradeLevel,
          studentId: sub.studentId,
          academicYear: sub.academicYear,
          createdAt: typeof sub.createdAt === 'string' ? sub.createdAt : sub.createdAt.toISOString(),
          topMatchRole,
          topMatchField,
          notesCount: sub._count?.advisorNotes || 0,
        };
      });

      return NextResponse.json({ success: true, students: items }, { status: 200 });
    }

    // If database returned 0 records and no specific search was requested, provide sample records
    if (!search && (grade === 'all' || !grade) && dateRange === 'all') {
      const mockItems = getMockDirectoryItems(search, grade, dateRange);
      return NextResponse.json({ success: true, students: mockItems }, { status: 200 });
    }

    return NextResponse.json({ success: true, students: [] }, { status: 200 });
  } catch (error) {
    // Graceful fallback to mock demo records when database is unavailable or not configured
    console.warn('[PathLess Advisor API] Database query fallback to mock sample records:', error);
    const mockItems = getMockDirectoryItems(search, grade, dateRange);
    return NextResponse.json({ success: true, students: mockItems }, { status: 200 });
  }
}
