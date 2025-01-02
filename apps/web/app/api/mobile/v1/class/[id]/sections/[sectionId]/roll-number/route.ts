import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { updateStudentRollNumber } from './service';

/**
 * @swagger
 * /api/class/{id}/sections/{sectionId}/roll-number:
 *     put:
 *       summary: Set roll number for section students
 *       description: Set roll number for section students
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Data Found.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Section object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(
  request: Request,
  { params: { id: classId, sectionId } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();

    const updateResponse = await updateStudentRollNumber(
      classId,
      sectionId,
      payload?.students || []
    );

    return new NextResponse(JSON.stringify(updateResponse), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
