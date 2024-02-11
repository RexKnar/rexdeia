import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { AddSubjectsToClassRequestModel } from '../../../../../lib/domain/class';
import { addSubjects } from '../../../subject/service';
import { getAllSubjectByClassId, mapSubjectsToClass } from '../../service';
import { hasSubjectIds, hasSubjects } from './utils';

/**
 * @swagger
 * /api/class/{id}/subjects:
 *     get:
 *       summary: Get All Subjects in a class
 *       description: Get All Subjects in a class
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the class.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Subjects details are fetched successfully.
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
export async function GET(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const sections = await getAllSubjectByClassId(id);

    return new NextResponse(JSON.stringify(sections), {
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
 *   /api/class/{id}/subjects:
 *     post:
 *       summary: Add subjects to a class
 *       description: Add subjects list to a class
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the class.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       responses:
 *         '200':
 *           description: Successfully added subjects to a class
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single class here
 *         '401':
 *           description: Unauthorized access.
 *         '400':
 *           description: Bad request due to an error in processing the request.
 */
export async function POST(request: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload: AddSubjectsToClassRequestModel = await request.json();

  try {
    if (hasSubjectIds(payload)) {
      const { subjectIds } = payload;
      const response = await mapSubjectsToClass(id, subjectIds);

      return new NextResponse(JSON.stringify(response), {
        status: StatusCodes.CREATED,
      });
    }

    if (hasSubjects(payload)) {
      const { subjects } = payload;
      const createdSubjects = await addSubjects(subjects);

      await mapSubjectsToClass(
        id,
        createdSubjects.map((subject) => subject.id)
      );

      return new NextResponse(JSON.stringify({}), {
        status: StatusCodes.CREATED,
      });
    }

    return new NextResponse(JSON.stringify({ error: 'VALIDATION_ERROR' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
