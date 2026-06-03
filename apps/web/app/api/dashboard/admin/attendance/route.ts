import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getAdminAttendanceOverview } from '../service';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const params = new URL(request.url).searchParams;
    const date = params.get('date');
    if (!date) {
      return new NextResponse(JSON.stringify({ error: 'DATE_REQUIRED' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const sessionScope =
      params.get('session') === 'afternoon' ? 'afternoon' : 'morning';
    const data = await getAdminAttendanceOverview(date, sessionScope);
    return new NextResponse(JSON.stringify(data), { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
