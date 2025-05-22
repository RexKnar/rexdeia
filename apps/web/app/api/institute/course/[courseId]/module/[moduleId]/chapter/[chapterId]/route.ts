import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getChapterDetailById, updateCourseChapter } from '../service';

/**
 * @swagger
 * /api/institute/course/{courseId}/module/{moduleId}/chapter/{chapterId}:
 *     post:
 *       summary: Update course chapter to  module
 *       description: Update Course Chapter to Module
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Course chapter's details updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Course Chapter object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(request: Request, { params: { chapterId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();

  try {
    const response = await updateCourseChapter(chapterId, payload);
    return new NextResponse(JSON.stringify(response), {
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
 * /api/institute/course/{courseId}/module/{moduleId}/chapter/{chapterId}:
 *     get:
 *       summary: Get Course Chapter By Id
 *       description: Get the details of an Course Chapter By Id.
 *       parameters:
 *         - name: courseId
 *           in: path
 *           required: true
 *           description: Unique identifier of the Course Chapter.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Course Chapter details fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Course Chapter object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */

export async function GET(request: Request, { params: { chapterId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const courseChapterById = await getChapterDetailById(chapterId);

    return new NextResponse(JSON.stringify(courseChapterById), {
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
