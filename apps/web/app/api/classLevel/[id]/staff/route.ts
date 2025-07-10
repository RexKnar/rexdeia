import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { assignStaffToClassLevel } from './service';

/**
 * @swagger
 * /api/classLevel/{id}/staff:
 *   post:
 *     summary: Assign a staff member to a ClassLevel
 *     description: Assigns a staff to a class level for a specific academic year.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ClassLevel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               staffId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Staff successfully assigned to ClassLevel
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const body = await request.json();
    const { staffId } = body;
    const classLevelId = params.id;

    if (!staffId || !classLevelId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: StatusCodes.BAD_REQUEST,
        }
      );
    }

    const result = await assignStaffToClassLevel({
      classLevelId,
      staffId,
    });

    return new NextResponse(JSON.stringify(result), {
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    captureException(error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to assign staff' }),
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}
