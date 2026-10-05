import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

import { getExamsBySectionId } from './service';

/**
 * GET /api/exam/list?classId=...&sectionId=...
 * Fetch configured exams for a specific class and section
 */
export async function GET(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: StatusCodes.UNAUTHORIZED });
  }

  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId') || undefined;
    const sectionId = searchParams.get('sectionId') || undefined;

    const examsByClassSection = await getExamsBySectionId(
      { classId, sectionId },
      session
    );

    return NextResponse.json(examsByClassSection, { status: StatusCodes.OK });
  } catch (e: any) {
    captureException(e);
    return NextResponse.json(
      { error: e.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * PUT /api/exam/list
 * Body: { classId, sectionId }
 */
export async function PUT(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: StatusCodes.UNAUTHORIZED });
  }

  try {
    const payload = await request.json();

    const examsByClassSection = await getExamsBySectionId(payload, session);

    return NextResponse.json(examsByClassSection, { status: StatusCodes.OK });
  } catch (e: any) {
    captureException(e);
    return NextResponse.json(
      { error: e.message },
      {
        status:
          e.message === 'VALIDATION_ERROR'
            ? StatusCodes.BAD_REQUEST
            : StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
