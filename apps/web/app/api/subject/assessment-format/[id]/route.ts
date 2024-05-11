import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  addAssessmentFormat,
  deleteAssessmentFormat,
  getAssessmentFormatById,
  updateAssessmentFormatById,
} from '../service';

/**
 * @swagger
 * /api/subject/assessmentFormat/{id}:
 *     put:
 *       summary: update AssessmentFormat by Id
 *       description: update AssessmentFormat by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the AssessmentFormat.
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
 *           description: AssessmentFormat updated successfully.
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
export async function PUT(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();

    const assessmentFormatById = await updateAssessmentFormatById(id, payload);

    return new NextResponse(JSON.stringify(assessmentFormatById), {
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
 * /api/subject/assessmentFormat/{id}:
 *     get:
 *       summary: Fetch AssessmentFormat By Id
 *       description: Fetch AssessmentFormat By Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the Subject Type.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: AssessmentFormat are fetched successfully.
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
export async function GET(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const AssessmentFormatById = await getAssessmentFormatById(id);

    return new NextResponse(JSON.stringify(AssessmentFormatById), {
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
 * /api/subject/assessmentFormat/{id}:
 *     delete:
 *       summary: Delete assessmentFormat by Id
 *       description: Delete assessmentFormat by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the AssessmentFormat.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: AssessmentFormat deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your assessmentFormat object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function DELETE(request: NextRequest, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const deletedAssessmentFormat = await deleteAssessmentFormat(id);

    if ('error' in deletedAssessmentFormat) {
      return new Response(JSON.stringify(deletedAssessmentFormat.error), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    return new Response(JSON.stringify(deletedAssessmentFormat), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @swagger
 * /api/subject/assessmentFormat/{id}:
 *     post:
 *       summary: Add new assessmentFormat with Parent
 *       description: Add New assessmentFormat with Parent
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: New assessmentFormat added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your assessmentFormat  object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function POST(request: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const newAssessmentFormat = await addAssessmentFormat(id, payload);
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
