import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import {
  deleteSubjectFormatById,
  getSubjectFormatById,
  updateSubjectFormatById,
} from '../service';

/**
 * @swagger
 * /api/subject/subjectFormat/{id}:
 *     put:
 *       summary: update subjectFormat by Id
 *       description: update subjectFormat by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the subjectFormat.
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
 *           description: SubjectFormat updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subjectFormat object here
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

    const subjectFormat = await updateSubjectFormatById(id, payload);

    return new NextResponse(JSON.stringify(subjectFormat), {
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
 * /api/subject/subjectFormat/{id}:
 *     get:
 *       summary: Fetch subjectFormat By Id
 *       description: Fetch subjectFormat By Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the subjectFormat.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: SubjectType are fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subjectFormat object here
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
    const subjectFormat = await getSubjectFormatById(id);

    return new NextResponse(JSON.stringify(subjectFormat), {
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
 * /api/subject/subjectFormat/{id}:
 *     delete:
 *       summary: Delete subjectFormat by Id
 *       description: Delete subjectFormat by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the subjectFormat.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: SubjectType deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subjectFormat object here
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

    const subjectFormat = await getSubjectFormatById(id);

    if (subjectFormat) {
      const deleteSubjectType = await deleteSubjectFormatById(id);
      return new Response(JSON.stringify(deleteSubjectType), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'SUBJECT_FORMAT_NOT_FOUND' }),
        {
          status: StatusCodes.NOT_FOUND,
        }
      );
    }
  } catch (e) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
