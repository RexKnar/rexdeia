import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getSubjectToStudentByGroupAndClassId } from './service';

/**
 * @swagger
 * /api/group/{id}/subjects:
 *   get:
 *     summary: Get Student subjects by groupId and classId
 *     description: Get Student subjects by groupId and classId
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the class.
 *         schema:
 *           type: string
 *       - name: classId
 *         in: query
 *         required: true
 *         description: Unique identifier of the class.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Subject details are fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               # Define the schema of your class object here
 *       '400':
 *         description: Bad request due to validation error.
 *       '401':
 *         description: Unauthorized access.
 *       '500':
 *         description: Internal server error.
 */

export async function GET(request: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const classId = request.nextUrl.searchParams.get('classId');
    const Subjects = await getSubjectToStudentByGroupAndClassId(id, classId);

    return new NextResponse(JSON.stringify(Subjects), {
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
