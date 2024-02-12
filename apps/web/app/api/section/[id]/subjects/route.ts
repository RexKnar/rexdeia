import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { AddSubjectsToSectionRequestModel } from '../../../../../lib/domain/section';
import {
  addSubjects,
  getAllSubjectBySectionId,
} from '../../../subject/service';
import { mapSubjectsToSection, unMapSubjectsFromSection } from '../../service';
import { hasSubjectIds, hasSubjects } from './utils';

/**
 * @swagger
 * /api/section/{id}/subjects:
 *     get:
 *       summary: Get All Subjects in a section
 *       description: Get All Subjects in a section
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
    const sections = await getAllSubjectBySectionId(id);

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
 *   /api/section/{id}/subjects:
 *     post:
 *       summary: Add subjects to a section
 *       description: Add subjects list to a section
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the section.
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
 *           description: Successfully added subjects to a section
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
  const payload: AddSubjectsToSectionRequestModel = await request.json();
  try {
    if (hasSubjectIds(payload)) {
      const { subjectIds } = payload;
      const createdClass = await mapSubjectsToSection(id, subjectIds);
      return new NextResponse(JSON.stringify(createdClass), {
        status: StatusCodes.CREATED,
      });
    }

    if (hasSubjects(payload)) {
      const { subjects } = payload;
      const createdSubjects = await addSubjects(subjects);

      const response = await mapSubjectsToSection(
        id,
        createdSubjects.map((subject) => subject.id)
      );
      return new NextResponse(JSON.stringify(response), {
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

/**
 * @swagger
 * /api/section/{id}/subjects:
 *     delete:
 *       summary: Remove subjects from section
 *       description: Remove subjects from existing section
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the section.
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
 *           description: subjects details removed successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subject object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function DELETE(request: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const section = await unMapSubjectsFromSection(id, payload);
    return new NextResponse(JSON.stringify(section), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
