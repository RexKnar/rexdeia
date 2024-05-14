import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  createExamType,
  getAllExamTypes,
  getAllExamTypeWithFilter,
} from './service';

/**
 * @swagger
 * /api/exam/exam-type:
 *     post:
 *       summary: Add new ExamType
 *       description: Add New ExamType
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: ExamTypes's details added successfully.
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
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const createdExamType = await createExamType(payload);
    return new NextResponse(JSON.stringify(createdExamType), {
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
 * /api/exam/exam-type:
 *     get:
 *       summary: Get All Exam Types
 *       description: Get All Exam Types
 *       responses:
 *         '200':
 *           description: Exam Type details are s fetched Successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Exam Type object here
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
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const ExamTypeList = await getAllExamTypes(page, limit);
    return new NextResponse(JSON.stringify(ExamTypeList), {
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
 * /api/exam/exam-type:
 *     put:
 *       summary: Get All Exam Types with Filter
 *       description: Get All Exam Types with Filter
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Data Found.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Exam Type object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const filter = await request.json();
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const paginatedExamTypeList = await getAllExamTypeWithFilter(
      page,
      limit,
      filter
    );
    return new NextResponse(JSON.stringify(paginatedExamTypeList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
