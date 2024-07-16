import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getStudentSearchList } from './service';

/**
 * @swagger
 * /api/student/search:
 *     get:
 *       summary: Retrieve a list of students
 *       description: >
 *         This endpoint retrieves a paginated list of students. It requires
 *         a valid session for access and allows specifying page and page size.
 *       security:
 *         - sessionAuth: []
 *       parameters:
 *         - name: search_query
 *           in: query
 *           required: false
 *           description: The search keyword.
 *           schema:
 *             type: string
 *             default: ''
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
    const searchTerm = request.nextUrl.searchParams.get('searchTerm') || '';
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get('pageSize')) || 30;

    const paginatedStudentResult = await getStudentSearchList(
      searchTerm,
      page,
      pageSize
    );
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
