import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

import {
  getStudentAttendance,
  saveStudentAttendance,
} from '../../../timetable/student-attendance/service';

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');
    const date = searchParams.get('date');
    const scope = (searchParams.get('scope') ?? 'daily') as any;
    const slotId = searchParams.get('slotId') ?? undefined;

    if (!sectionId || !date) {
      return new NextResponse(JSON.stringify({ error: 'PARAMS_REQUIRED' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const data = await getStudentAttendance(
      sectionId,
      date,
      scope,
      slotId,
      session
    );
    return NextResponse.json(data);
  } catch (e: any) {
    captureException(e);
    return NextResponse.json(
      { error: e.message || 'BAD_REQUEST' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();
    const result = await saveStudentAttendance(payload, session);
    return NextResponse.json(result);
  } catch (e: any) {
    captureException(e);
    return NextResponse.json(
      { error: e.message || 'BAD_REQUEST' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}
