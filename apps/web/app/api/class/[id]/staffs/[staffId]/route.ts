import { captureException } from '@sentry/nextjs';
import { unMapStaffsFromClass } from 'app/api/class/service';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../../lib/auth';
/**
 * @swagger
 * /api/class/{id}/staffs:
 *     delete:
 *       summary: Remove Staffs from class
 *       description: Remove Staffs from existing class
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the class.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Staffs details removed successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your staff object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const { academicYearId, staffId, sectionIds, subjectId } =
    await request.json();
  try {
    const section = await unMapStaffsFromClass(
      academicYearId,
      staffId,
      sectionIds,
      subjectId
    );
    return new NextResponse(JSON.stringify(section), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
