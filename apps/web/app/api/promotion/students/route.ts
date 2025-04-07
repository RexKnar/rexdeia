import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getFilteredStudents } from './service';

/**
 * @swagger
 * /api/promotion/students:
 *   put:
 *     summary: Get assigned students by class, section, and group for promotion
 *     description: Retrieves students who are currently active in a specific class, section, and group for the purpose of promotion.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *               sectionId:
 *                 type: string
 *               groupId:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of filtered students
 *       400:
 *         description: Missing parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const { classId, sectionId, groupId } = await req.json();

    if (!classId) {
      return new NextResponse(
        JSON.stringify({ error: 'classId is required.' }),
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const students = await getFilteredStudents(classId, sectionId, groupId);
    return new NextResponse(JSON.stringify(students), {
      status: StatusCodes.OK,
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
