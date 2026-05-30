import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getAttendanceReport } from './service';

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
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (!sectionId || !from || !to) {
      return new NextResponse(JSON.stringify({ error: 'PARAMS_REQUIRED' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const data = await getAttendanceReport(sectionId, from, to);
    return new NextResponse(JSON.stringify(data), { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
