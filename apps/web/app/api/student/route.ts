import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { addStudent, getStudentsList } from './service';
import { validateAddUser } from './validator';

/**
 * @swagger
 * /api/student:
 *     post:
 *       summary: Adds a new student
 *       description: >
 *         This endpoint adds a new student to the system. It requires a valid session
 *         and the request payload must pass validation checks.
 *       security:
 *         - sessionAuth: []
 *       parameters:
 *         - name: formId
 *           in: query
 *           required: true
 *           description: The form ID associated with the student admission.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddUserPayload'
 *       responses:
 *         '201':
 *           description: Student successfully added
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AdmissionResponse'
 *         '400':
 *           description: Bad request due to invalid payload or other reasons
 *         '401':
 *           description: Unauthorized access due to missing or invalid session
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const formId = request.nextUrl.searchParams.get('formId');

  const payload = await request.json();

  try {
    await validateAddUser(payload);

    const admission = await addStudent(payload, formId);
    return new NextResponse(JSON.stringify(admission), {
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
 * /api/student:
 *     get:
 *       summary: Retrieve a list of students
 *       description: >
 *         This endpoint retrieves a paginated list of students. It requires
 *         a valid session for access and allows specifying page and page size.
 *       security:
 *         - sessionAuth: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           description: The page number of the student list.
 *           schema:
 *             type: integer
 *             default: 1
 *         - name: pageSize
 *           in: query
 *           required: false
 *           description: The number of students to return per page.
 *           schema:
 *             type: integer
 *             default: 10
 *       responses:
 *         '200':
 *           description: A paginated list of students
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PaginatedStudentResult'
 *         '400':
 *           description: Bad request due to invalid input or other reasons
 *         '401':
 *           description: Unauthorized access due to missing or invalid session
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get('pageSize')) || 10;

    const paginatedStudentResult = await getStudentsList(page, pageSize);
    return new NextResponse(JSON.stringify(paginatedStudentResult), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
