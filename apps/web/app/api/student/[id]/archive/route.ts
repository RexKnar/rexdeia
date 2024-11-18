import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { archiveStudentById } from './service';

/**
 * @swagger
 * /api/student/[id]/archive:
 *     put:
 *       summary: Archives a student
 *       description: >
 *         This endpoint archives a student. Reason for archives are Transfer class change. It requires a valid session
 *         and the request payload must pass validation checks.
 *       security:
 *         - sessionAuth: []
 *       parameters:
 *         - name: formId
 *           in: query
 *           required: true
 *           description: .
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentMappingPayload'
 *       responses:
 *         '201':
 *           description: Student successfully archived
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/StudentResponse'
 *         '400':
 *           description: Bad request due to invalid payload or other reasons
 *         '401':
 *           description: Unauthorized access due to missing or invalid session
 */
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();
    const updateResponse = await archiveStudentById(
      payload.studentId,
      payload.remark
    );
    if (updateResponse) {
      return new NextResponse(JSON.stringify({ message: 'success' }), {
        status: StatusCodes.CREATED,
      });
    } else {
      return new NextResponse(JSON.stringify({ message: 'failed' }), {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
