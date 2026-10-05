import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getExamConfigWithSubjectPartition } from 'app/api/exam/[id]/mark-entry/service';
import { enterMark } from './service';

/**
 * GET: Fetch mark entry roster, assessment partitions, and date/status permissions
 * Query params: examId, classId, sectionId, staffId (optional)
 */
export async function GET(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const { searchParams } = new URL(request.url);
  const examId = searchParams.get('examId');
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');
  let staffId = searchParams.get('staffId');
  const subjectId = searchParams.get('subjectId') || undefined;

  if (!examId || !classId || !sectionId) {
    return NextResponse.json(
      { error: 'MISSING_REQUIRED_PARAMS', message: 'examId, classId, and sectionId are required' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // If staffId not provided, default to user's staffId if teaching staff
  if (!staffId && (session.user as any)?.staffId) {
    staffId = (session.user as any).staffId;
  }

  try {
    const configResponse = await getExamConfigWithSubjectPartition(
      {
        examId,
        classId,
        sectionId,
        staffId: staffId || undefined,
        subjectId,
      },
      session
    );

    return NextResponse.json({
      success: true,
      ...configResponse,
    });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error.message || 'FAILED_TO_FETCH_MARK_ENTRY' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * PUT: Fetch mark entry roster with body (compatible with web and Flutter client)
 * Body: { examId, classId, sectionId, staffId, subjectId }
 */
export async function PUT(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  try {
    const payload = await request.json();
    let staffId = payload.staffId;
    if (!staffId && (session.user as any)?.staffId) {
      staffId = (session.user as any).staffId;
    }

    const configResponse = await getExamConfigWithSubjectPartition(
      {
        ...payload,
        staffId: staffId || undefined,
        subjectId: payload.subjectId || undefined,
      },
      session
    );

    return NextResponse.json({
      success: true,
      ...configResponse,
    });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error.message || 'FAILED_TO_FETCH_MARK_ENTRY' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * POST: Save or update student marks
 * Body: { studentsMarkDetails: [...] }
 */
export async function POST(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  try {
    const payload = await request.json();
    const createdMarkEntry = await enterMark(payload, session.user.id);
    return NextResponse.json(createdMarkEntry, {
      status: StatusCodes.CREATED,
    });
  } catch (e: any) {
    captureException(e);
    return NextResponse.json(
      { error: e.message },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}
