import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { addSubjectFormat, getSubjectFormatList } from './service';

/**
 * @swagger
 * /api/subject/subjectFormat:
 *     post:
 *       summary: Add new subjectFormat
 *       description: Add New subjectFormat
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: New subjectFormat added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Subject format object here
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
    const subjectFormat = await addSubjectFormat(payload);
    return new NextResponse(JSON.stringify(subjectFormat), {
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
 * /api/subject/subjectFormat:
 *     get:
 *       summary: Retrieve a paginated list of subjectFormat
 *       description: >
 *         This endpoint allows for retrieving a list of subjectFormat in a paginated format.
 *         It requires user authentication and allows clients to specify the page number
 *         and page size for the results.
 *       parameters:
 *         - in: query
 *           name: page
 *           required: false
 *           schema:
 *             type: integer
 *             default: 1
 *           description: The page number of the paginated results.
 *         - in: query
 *           name: pageSize
 *           required: false
 *           schema:
 *             type: integer
 *             default: 10
 *           description: The number of items to display per page.
 *       responses:
 *         '200':
 *           description: A successful response with the paginated list of subjectFormat.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PaginatedSubjectFormatResult'
 *         '400':
 *           description: Bad request, usually due to a problem with the request parameters.
 *         '401':
 *           description: Unauthorized access, returned when the user is not authenticated.
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
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const paginatedSubjectFormatList = await getSubjectFormatList(page, limit);
    return new NextResponse(JSON.stringify(paginatedSubjectFormatList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
