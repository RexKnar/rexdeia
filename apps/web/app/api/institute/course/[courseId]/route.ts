import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getCourseDetailById, updateCourseById } from './service';

/**
 * @swagger
 * /api/institute/course/{courseId}:
 *     put:
 *       summary: Update Course details
 *       description: Updates the details of an existing Course.
 *       parameters:
 *         - name: courseId
 *           in: path
 *           required: true
 *           description: Unique identifier of the Course.
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
 *           description: Course details updated successfully.
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
export async function PUT(request: Request, { params: { courseId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();

  try {
    const updatedCourse = await updateCourseById(courseId, payload);

    return new NextResponse(JSON.stringify(updatedCourse), {
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
 * /api/institute/course/{courseId}:
 *     get:
 *       summary: Get Course By Id
 *       description: Get the details of an Course By Id.
 *       parameters:
 *         - name: courseId
 *           in: path
 *           required: true
 *           description: Unique identifier of the Course.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Course details fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Course object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */

export async function GET(request: Request, { params: { courseId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const courseById = await getCourseDetailById(courseId);

    return new NextResponse(JSON.stringify(courseById), {
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
