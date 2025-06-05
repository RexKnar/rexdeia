import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { archiveStudents } from '../service';

/**
 * @swagger
 * /api/promotion/students/archive:
 *   put:
 *     summary: Archive multiple students
 *     description: Archives the provided list of students by marking their current mappings as inactive.
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               remark:
 *                 type: string
 *                 example: 'Passed Out'
 *     responses:
 *       201:
 *         description: Students archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
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
    const { studentIds, remark } = await request.json();

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'studentIds must be a non-empty array' }),
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await archiveStudents(studentIds, remark || 'Passed Out');

    return new NextResponse(
      JSON.stringify({ message: 'Students archived successfully' }),
      { status: StatusCodes.CREATED }
    );
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'Bad Request' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
