import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { updateStudentStatus } from '../service';

/**
 * @swagger
 * /api/promotion/students/status:
 *   put:
 *     summary: Update status of multiple students (archive or onHold)
 *     description: >
 *       Updates the current mappings of provided students by setting
 *       their status flags like `isCurrent`, `onHold`, and adding remarks.
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentIds
 *               - data
 *             properties:
 *               studentIds:
 *                 type: array
 *                 description: Array of student IDs to update
 *                 items:
 *                   type: string
 *                 example: ["uuid-1"]
 *               data:
 *                 type: object
 *                 description: Fields to update on student mapping
 *                 properties:
 *                   isCurrent:
 *                     type: boolean
 *                     example: false
 *                   onHold:
 *                     type: boolean
 *                     example: true
 *                   remark:
 *                     type: string
 *                     example: "On hold due to illness"
 *     responses:
 *       200:
 *         description: Students updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Students updated successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "studentIds must be a non-empty array"
 *       401:
 *         description: Unauthorized
 */
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const { studentIds, data } = await request.json();

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'studentIds must be a non-empty array' }),
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (!data || typeof data !== 'object') {
      return new NextResponse(
        JSON.stringify({ error: 'data is required and must be an object' }),
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await updateStudentStatus(studentIds, data);

    return new NextResponse(
      JSON.stringify({ message: 'Students updated successfully' }),
      { status: StatusCodes.OK }
    );
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'Bad Request' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
