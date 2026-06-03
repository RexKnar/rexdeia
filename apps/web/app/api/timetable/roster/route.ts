import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getStaffRoster } from './service';

/**
 * @swagger
 * /api/timetable/roster:
 *   get:
 *     summary: Weekly timetable + today's schedule for a staff member.
 *     description: staffId optional (defaults to the logged-in user's staff record).
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId') ?? undefined;
    const date = searchParams.get('date') ?? undefined;
    const roster = await getStaffRoster(staffId, date);
    return new NextResponse(JSON.stringify(roster), { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
