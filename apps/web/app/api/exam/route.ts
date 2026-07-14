import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { createExam, getExamsList } from './service';

/**
 * @swagger
 * /api/exam:
 *     get:
 *       summary: Get All exams list
 *       description: Get All exams list
 *       responses:
 *         '200':
 *           description: exams details are  fetched Successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your exam object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(request: NextRequest) {
  // console.log('🍪 Incoming cookies:', request.cookies.getAll());
  const session = await getServerSession(authOptions);
  // console.log('exam list session', session);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;
    const batchId = request.nextUrl.searchParams.get('batchId') || undefined;

    const classList = await getExamsList(page, limit, batchId);
    return new NextResponse(JSON.stringify(classList), {
      status: StatusCodes.OK,
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
 * /api/exam:
 *     post:
 *       summary: Add new Exam
 *       description: Add New Exam
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Exam's details added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Exam object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const createdExam = await createExam(payload);
    return new NextResponse(JSON.stringify(createdExam), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
