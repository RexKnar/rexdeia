import { captureException } from '@sentry/nextjs';
import {
  getSubjectListForStaffByClassId,
  unMapStaffsFromClass,
} from 'app/api/class/service';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest, { params: { id, staffId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const academicYearId = session.currentBatch;
    const classDetail = await getSubjectListForStaffByClassId(
      staffId,
      academicYearId,
      id
    );

    return new NextResponse(JSON.stringify(classDetail), {
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
export async function DELETE(request: NextRequest, { params: { staffId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const { sections } = await request.json();
  const academicYearId = session.currentBatch;
  try {
    const section = await unMapStaffsFromClass(
      academicYearId,
      staffId,
      sections
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
