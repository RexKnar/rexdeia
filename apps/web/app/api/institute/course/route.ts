import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addInstituteCourse, getInstituteCourses } from './service';

/**
 * @swagger
 * /api/institute/course:
 *     get:
 *       summary: Get All Institute Courses
 *       description: Get Institute Courses
 *       responses:
 *         '200':
 *           description: Course list is fetched Successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your course object here
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

    const paginatedCourseList = await getInstituteCourses(page, limit);

    return new NextResponse(JSON.stringify(paginatedCourseList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
export async function PUT(request: NextRequest) {
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
    const filter = await request.json();
    const paginatedCourseList = await getInstituteCourses(page, limit, filter);

    return new NextResponse(JSON.stringify(paginatedCourseList), {
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
 * /api/institute/course:
 *     post:
 *       summary: Add new course
 *       description: Add New Course
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Course's details added successfully.
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
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();

  try {
    const response = await addInstituteCourse(payload);
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
