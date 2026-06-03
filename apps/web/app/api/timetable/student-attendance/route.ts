import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { StudentAttendanceScope } from 'lib/domain/timetable';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getStudentAttendance, saveStudentAttendance } from './service';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');
    const date = searchParams.get('date');
    const scope = (searchParams.get('scope') ??
      'daily') as StudentAttendanceScope;
    const slotId = searchParams.get('slotId') ?? undefined;
    if (!sectionId || !date) {
      return new NextResponse(JSON.stringify({ error: 'PARAMS_REQUIRED' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const data = await getStudentAttendance(sectionId, date, scope, slotId);
    return new NextResponse(JSON.stringify(data), { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const payload = await request.json();
    const result = await saveStudentAttendance(payload);
    return new NextResponse(JSON.stringify(result), { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
