import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { PeriodStatsScope } from 'lib/domain/timetable';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getPeriodStats } from './service';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const { searchParams } = new URL(request.url);
    const scope = (searchParams.get('scope') ?? 'section') as PeriodStatsScope;
    const id = searchParams.get('id') ?? 'me';
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (!from || !to) {
      return new NextResponse(JSON.stringify({ error: 'PARAMS_REQUIRED' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const data = await getPeriodStats(scope, id, from, to);
    return new NextResponse(JSON.stringify(data), { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
