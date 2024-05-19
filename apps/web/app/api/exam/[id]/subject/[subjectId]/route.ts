import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getSubjectConfigDetailById } from './service';

/**
 * @swagger
 * /api/exam/{id}/subject/{id}:
 *     get:
 *       summary: Fetch config details By subjectId
 *       description: Fetch configuration details of subject By subjectId
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the subject.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Subject configuration is fetched successfully.
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
export async function GET(request: NextRequest, { params: { id, subjectId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const subjectConfigDetail = await getSubjectConfigDetailById(id, subjectId);

    return new NextResponse(JSON.stringify(subjectConfigDetail), {
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
