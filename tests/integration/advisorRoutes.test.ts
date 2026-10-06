import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST as loginPost } from '@/app/api/advisor/login/route';
import { POST as logoutPost } from '@/app/api/advisor/logout/route';
import { GET as studentsGet } from '@/app/api/advisor/students/route';
import { POST as notesPost } from '@/app/api/advisor/notes/route';
import { POST as purgePost } from '@/app/api/admin/purge/route';
import { createAdvisorSessionToken, ADVISOR_COOKIE_NAME } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

describe('Feature 10: Advisor API Routes Integration Tests', () => {
  const originalPasscode = process.env.ADVISOR_PASSCODE;
  const originalAdminSecret = process.env.ADMIN_SECRET;

  // Saved original prisma methods to restore after tests
  const originalFindMany = prisma.studentSubmission.findMany;
  const originalFindUnique = prisma.studentSubmission.findUnique;
  const originalCount = prisma.studentSubmission.count;
  const originalDeleteMany = prisma.studentSubmission.deleteMany;
  const originalCreateNote = prisma.advisorNote.create;

  beforeEach(() => {
    delete process.env.ADVISOR_PASSCODE;
    process.env.ADMIN_SECRET = 'super_secret_admin_key';
  });

  afterEach(() => {
    if (originalPasscode !== undefined) {
      process.env.ADVISOR_PASSCODE = originalPasscode;
    } else {
      delete process.env.ADVISOR_PASSCODE;
    }

    if (originalAdminSecret !== undefined) {
      process.env.ADMIN_SECRET = originalAdminSecret;
    } else {
      delete process.env.ADMIN_SECRET;
    }

    // Restore prisma methods
    prisma.studentSubmission.findMany = originalFindMany;
    prisma.studentSubmission.findUnique = originalFindUnique;
    prisma.studentSubmission.count = originalCount;
    prisma.studentSubmission.deleteMany = originalDeleteMany;
    prisma.advisorNote.create = originalCreateNote;
  });

  // IT-ADV-01: Login happy path
  it('IT-ADV-01: POST /api/advisor/login with TEACHER2026 sets signed httpOnly cookie and returns 200', async () => {
    const req = new Request('http://localhost:3000/api/advisor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'TEACHER2026', authorName: 'Kru Nan' }),
    });

    const res = await loginPost(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.authorName, 'Kru Nan');

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    assert.ok(setCookie.includes(`${ADVISOR_COOKIE_NAME}=`));
    assert.ok(setCookie.includes('HttpOnly'));
  });

  // IT-ADV-02: Login rejection
  it('IT-ADV-02: POST /api/advisor/login with invalid passcode returns 401 with educator problem details', async () => {
    const req = new Request('http://localhost:3000/api/advisor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'INVALID_PASSCODE' }),
    });

    const res = await loginPost(req);
    assert.equal(res.status, 401);

    const data = await res.json();
    assert.ok(data.detail);
    assert.ok(data.detail.includes('passcode'));
  });

  // IT-ADV-03: Logout
  it('IT-ADV-03: POST /api/advisor/logout clears session cookie', async () => {
    const res = await logoutPost();
    assert.equal(res.status, 200);

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    assert.ok(setCookie.includes('Max-Age=0'));
  });

  // IT-ADV-04: Protected students list rejected without cookie
  it('IT-ADV-04: GET /api/advisor/students rejects unauthenticated requests with 401', async () => {
    const req = new Request('http://localhost:3000/api/advisor/students');
    const res = await studentsGet(req);
    assert.equal(res.status, 401);
  });

  // IT-ADV-05: Protected students list returns submissions with valid cookie
  it('IT-ADV-05: GET /api/advisor/students returns directory items when session cookie is provided', async () => {
    const token = createAdvisorSessionToken('Kru Nan');

    // Stub prisma.studentSubmission.findMany
    (prisma.studentSubmission.findMany as any) = async () => [
      {
        id: 'sub_123',
        fullName: 'Alex Morgan',
        gradeLevel: 'grade_12',
        studentId: 'STU-9921',
        academicYear: 2026,
        createdAt: new Date('2026-09-15T10:00:00Z'),
        synthesisResult: {
          cards: [
            { roleTitle: 'Software Engineer', broadField: 'Engineering & Technology' },
          ],
        },
        _count: { advisorNotes: 2 },
      },
    ];

    const req = new Request('http://localhost:3000/api/advisor/students', {
      headers: { cookie: `${ADVISOR_COOKIE_NAME}=${token}` },
    });

    const res = await studentsGet(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.students.length, 1);
    assert.equal(data.students[0].fullName, 'Alex Morgan');
    assert.equal(data.students[0].topMatchRole, 'Software Engineer');
    assert.equal(data.students[0].notesCount, 2);
  });

  // IT-ADV-06: Create advisor note
  it('IT-ADV-06: POST /api/advisor/notes creates note attached to student submission', async () => {
    const token = createAdvisorSessionToken('Counselor Davis');

    // Stub prisma.advisorNote.create
    (prisma.advisorNote.create as any) = async (args: any) => ({
      id: 'note_999',
      submissionId: args.data.submissionId,
      content: args.data.content,
      authorName: args.data.authorName,
      createdAt: new Date('2026-10-06T08:00:00Z'),
    });

    const req = new Request('http://localhost:3000/api/advisor/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: `${ADVISOR_COOKIE_NAME}=${token}`,
      },
      body: JSON.stringify({
        submissionId: 'sub_123',
        content: 'Discussed university engineering options at Chulalongkorn.',
        authorName: 'Counselor Davis',
      }),
    });

    const res = await notesPost(req);
    assert.equal(res.status, 201);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.note.id, 'note_999');
    assert.equal(data.note.content, 'Discussed university engineering options at Chulalongkorn.');
  });

  // IT-ADV-07: Reject invalid note content
  it('IT-ADV-07: POST /api/advisor/notes rejects blank content with 400', async () => {
    const token = createAdvisorSessionToken('Counselor Davis');

    const req = new Request('http://localhost:3000/api/advisor/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: `${ADVISOR_COOKIE_NAME}=${token}`,
      },
      body: JSON.stringify({
        submissionId: 'sub_123',
        content: '   ',
      }),
    });

    const res = await notesPost(req);
    assert.equal(res.status, 400);
  });

  // IT-ADV-08: Admin purge route
  it('IT-ADV-08: POST /api/admin/purge authorizes via admin key and returns purge summary', async () => {
    // Stub count and deleteMany
    (prisma.studentSubmission.count as any) = async () => 5;
    (prisma.studentSubmission.deleteMany as any) = async () => ({ count: 5 });

    const req = new Request('http://localhost:3000/api/admin/purge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': 'super_secret_admin_key',
      },
      body: JSON.stringify({ dryRun: true }),
    });

    const res = await purgePost(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.dryRun, true);
    assert.equal(data.purgedCount, 5);
  });
});
