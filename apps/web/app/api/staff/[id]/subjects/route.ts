import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getSubjectByStaffId } from '../../service';

/**
 * @swagger
 * /api/staff/{id}/subjects:
 *     get:
 *       summary: Get Subjects by staff id
 *       description: Get Subjects by staff id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the Staff.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Subjects are fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your staff's subjects  here
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
    const subjects = await getSubjectByStaffId(id);

    return new NextResponse(JSON.stringify(subjects), {
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
