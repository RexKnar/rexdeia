import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getStaffsBySection } from '../service';

/**
 * @swagger
 * /api/mark-entry/staffs:
 *     put:
 *       summary: get staffs by section
 *       description:  get staffs by section
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the class&section optional
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
 *           description: staffs fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your staffs object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();

    const staffsBySection = await getStaffsBySection(payload);

    return new NextResponse(JSON.stringify(staffsBySection), {
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
