import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  createExamConfigurationForExam,
  getExamConfigurationList,
} from './service';

/**
 * @swagger
 * /api/exam/{id}/configuration:
 *     post:
 *       summary: Add new Exam Configuration
 *       description: Add New Exam Configuration
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the Exam.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Exam Configuration's details added successfully.
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
export async function POST(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const createdExam = await createExamConfigurationForExam(payload, id);
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

/**
 * @swagger
 * /api/exam/{id}/configuration:
 *     get:
 *       summary: Get All exam configurations list
 *       description: Get All exams configurations list
 * parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the Exam.
 *           schema:
 *             type: string
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
export async function GET(request: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const examConfigurationList = await getExamConfigurationList(
      page,
      limit,
      id
    );
    return new NextResponse(JSON.stringify(examConfigurationList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
