import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { removeClassIncharge } from '../../../service';

/**
 * @swagger
 * /api/class/{id}/incharge/{staffId}:
 *     delete:
 *       summary: Unassign Class Incharge
 *       description: Remove incharge role from staff in a class.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the class.
 *           schema:
 *             type: string
 *         - name: staffId
 *           in: path
 *           required: true
 *           description: ID of the staff to be unassigned.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Staff unassigned as class incharge successfully.
 *         '401':
 *           description: Unauthorized access.
 *         '400':
 *           description: Bad request or missing data.
 *         '500':
 *           description: Internal server error.
 */

export async function DELETE(
  request: NextRequest,
  { params: { id, staffId } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const academicYearId = session.currentBatch;

  try {
    const result = await removeClassIncharge(academicYearId, staffId, id);

    return new NextResponse(JSON.stringify({ success: true, data: result }), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
