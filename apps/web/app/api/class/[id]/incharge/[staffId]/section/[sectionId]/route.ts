import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { removeClassIncharge } from '../../../../../service';

/**
 * @swagger
 * /api/class/{classId}/incharge/{staffId}/section/{sectionId}:
 *   delete:
 *     summary: Unassign Class Incharge from a section
 *     description: Remove incharge role from staff in a specific section of a class.
 *     parameters:
 *       - name: classId
 *         in: path
 *         required: true
 *         description: Unique identifier of the class.
 *         schema:
 *           type: string
 *       - name: staffId
 *         in: path
 *         required: true
 *         description: ID of the staff to be unassigned.
 *         schema:
 *           type: string
 *       - name: sectionId
 *         in: path
 *         required: true
 *         description: ID of the section.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff unassigned as class incharge from section successfully.
 *       401:
 *         description: Unauthorized access.
 *       400:
 *         description: Bad request or missing data.
 *       500:
 *         description: Internal server error.
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; staffId: string; sectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const { id, staffId, sectionId } = params;
    const academicYearId = session.currentBatch;

    if (!academicYearId || !id || !staffId || !sectionId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const result = await removeClassIncharge(
      academicYearId,
      staffId,
      sectionId
    );

    return new NextResponse(JSON.stringify({ success: true, data: result }), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    captureException(error);
    return new NextResponse(
      JSON.stringify({
        error: (error as Error).message || 'Internal Server Error',
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
