import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addRangeFilter, getRangeScales } from './service';

/**
 * @swagger
 * /api/analytics/range:
 *     post:
 *       summary: Add new range scale
 *       description: Add New range scale
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Range Scales added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your class object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const batch = await addRangeFilter(payload);
    return new NextResponse(JSON.stringify(batch), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * @swagger
 * /api/analytics/range:
 *   get:
 *     summary: Get Range Scales
 *     parameters:
 *       - in: query
 *         name: rangeType
 *         schema:
 *           type: string
 *         description: Optional range type (e.g., SubjectMarks, TotalMarks)
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: Optional class ID
 *       - in: query
 *         name: academicYearId
 *         schema:
 *           type: string
 *         description: Optional academic year ID (defaults to current batch)
 *     responses:
 *       200:
 *         description: Successfully fetched range scales
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const rangeType = request.nextUrl.searchParams.get('rangeType') || 'All';
    const classId = request.nextUrl.searchParams.get('classId') ?? undefined;
    const academicYearId =
      request.nextUrl.searchParams.get('academicYearId') ?? undefined;

    const rangeScales = await getRangeScales(
      rangeType,
      classId,
      academicYearId
    );

    return new NextResponse(JSON.stringify(rangeScales), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
