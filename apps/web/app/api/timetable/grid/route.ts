import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getTimetableGrid, saveTimetableGrid } from './service';

/**
 * @swagger
 * /api/timetable/grid:
 *   get:
 *     summary: Composed period-table grid data for a section (current academic year).
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const sectionId = new URL(request.url).searchParams.get('sectionId');
    if (!sectionId) {
      return new NextResponse(JSON.stringify({ error: 'SECTION_REQUIRED' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const grid = await getTimetableGrid(sectionId);
    return new NextResponse(JSON.stringify(grid), { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * @swagger
 * /api/timetable/grid:
 *   post:
 *     summary: Bulk-save the period-table entries for a section.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const payload = await request.json();
    const result = await saveTimetableGrid(payload);
    return new NextResponse(JSON.stringify(result), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
