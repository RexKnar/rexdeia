import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addAssessmentFormat, getAssessmentFormatList } from './service';

/**
 * @swagger
 * /api/subject/assessmentFormat:
 *     post:
 *       summary: Add new AssessmentFormat W/O Parent
 *       description: Add New AssessmentFormat W/O Parent
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: New AssessmentFormat added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your AssessmentFormat  object here
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
    const newAssessmentFormat = await addAssessmentFormat(null, payload);
    return new NextResponse(JSON.stringify(newAssessmentFormat), {
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
 * /api/subject/assessmentFormat:
 *     get:
 *       summary: Get All AssessmentFormat
 *       description: Get All AssessmentFormat
 *       responses:
 *         '200':
 *           description: AssessmentFormat details are s fetched Successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your AssessmentFormat object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const paginatedAssessmentFormatList = await getAssessmentFormatList(
      page,
      limit
    );
    return new NextResponse(JSON.stringify(paginatedAssessmentFormatList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
