import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  addSubjectType,
  deleteSubjectType,
  getSubjectTypeById,
  updateSubjectTypeById,
} from '../service';

/**
 * @swagger
 * /api/subject/subjectType/{id}:
 *     put:
 *       summary: update SubjectType by Id
 *       description: update SubjectType by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the SubjectType.
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
 *           description: SubjectType updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your SubjectType object here
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

    const subjectTypeById = await updateSubjectTypeById(id, payload);

    return new NextResponse(JSON.stringify(subjectTypeById), {
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
 * /api/subject/subjectType/{id}:
 *     get:
 *       summary: Fetch SubjectType By Id
 *       description: Fetch SubjectType By Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the Subject Type.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: SubjectType are fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your SubjectType object here
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
    const SubjectTypeById = await getSubjectTypeById(id);

    return new NextResponse(JSON.stringify(SubjectTypeById), {
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
 * /api/subject/subjectType/{id}:
 *     delete:
 *       summary: Delete subjectType by Id
 *       description: Delete subjectType by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the SubjectType.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: SubjectType deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subjectType object here
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

    const subjectTypeById = await getSubjectTypeById(id);

    if (subjectTypeById) {
      const deletedSubjectType = await deleteSubjectType(id);

      return new Response(JSON.stringify(deletedSubjectType), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(JSON.stringify({ error: 'SUBJECT_TYPE_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }
  } catch (e) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @swagger
 * /api/subject/subjectType/{id}:
 *     post:
 *       summary: Add new subjectType with Parent
 *       description: Add New subjectType with Parent
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: New subjectType added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subjectType  object here
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
    const newSubjectType = await addSubjectType(id, payload);
    return new NextResponse(JSON.stringify(newSubjectType), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
