import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  deleteExamSubjectById,
  editExamSubject,
  getExamSubjectDetailById,
} from '../service';

/**
 * @swagger
 * /api/exam/exam-subject/[examSubjectId]
 *     get:
 *       summary: Fetch Exam Subject Details By Id
 *       description: Fetch Exam Subject Details By Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the config.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Exam Subject Details is fetched successfully.
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
export async function GET(request: NextRequest, { params: { examSubjectId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const examSubjectDetail = await getExamSubjectDetailById(examSubjectId);

    return new NextResponse(JSON.stringify(examSubjectDetail), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'VALIDATION_ERROR'
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @swagger
 * /api/exam/exam-subject/[examSubjectId]:
 *     put:
 *       summary: Edit  Exam Configuration
 *       description: Edit Exam Configuration
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
export async function PUT(request: NextRequest, { params: { examSubjectId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const updateExamSubject = await editExamSubject(payload, examSubjectId);

    return new NextResponse(JSON.stringify(updateExamSubject), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

export async function DELETE(_: NextRequest, { params: { examSubjectId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const deletedExamSubject = await deleteExamSubjectById(
      examSubjectId,
      session.branchId
    );

    return new NextResponse(JSON.stringify(deletedExamSubject), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    if (e?.message === 'MARK_ENTRY_EXISTS' || e?.code === 'P2003') {
      return new NextResponse(
        JSON.stringify({
          error: 'MARK_ENTRY_EXISTS',
          message:
            'Cannot delete subject configuration because mark entries already exist.',
        }),
        { status: StatusCodes.CONFLICT }
      );
    }

    if (e?.message === 'DATA_NOT_FOUND' || e?.code === 'P2025') {
      return new NextResponse(
        JSON.stringify({
          error: 'DATA_NOT_FOUND',
          message: 'Exam subject configuration not found.',
        }),
        { status: StatusCodes.NOT_FOUND }
      );
    }

    captureException(e);
    return new NextResponse(JSON.stringify({ error: e?.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
