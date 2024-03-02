import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getSubjectTypeBySubjectId } from '../../service';

/**
 * @swagger
 * /api/subject/{id}/subjectType:
 *     get:
 *       summary: Fetch subjecttype By subjectId
 *       description: Fetch subjecttype By subjectId
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the subject.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Subject details are fetched successfully.
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
    const subjectTypeBySubjectId = await getSubjectTypeBySubjectId(id);

    return new NextResponse(JSON.stringify(subjectTypeBySubjectId), {
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
