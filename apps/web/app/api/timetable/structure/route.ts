import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  createTimetableStructure,
  getTimetableStructures,
} from './service';

/**
 * @swagger
 * /api/timetable/structure:
 *   get:
 *     summary: List timetable structures (optionally filtered by classLevelId).
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
    const classLevelId = searchParams.get('classLevelId') ?? undefined;
    const structures = await getTimetableStructures(classLevelId);
    return new NextResponse(JSON.stringify(structures), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * @swagger
 * /api/timetable/structure:
 *   post:
 *     summary: Create a timetable structure with its slots.
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
    const created = await createTimetableStructure(payload);
    return new NextResponse(JSON.stringify(created), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
