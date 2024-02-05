import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { Staff } from '../../../lib/domain/staff';
import { addStaffSchema } from './schemas';
import { addStaff, getStaffList } from './service';

/**
 * @swagger
 * /api/staff:
 *     post:
 *       summary: Add Staff
 *       description: Add New Staff
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Staff details added successfully.
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
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();
  const validationResponse = addStaffSchema.safeParse(payload);

  if (validationResponse.success === false) {
    const { error } = validationResponse;
    return new NextResponse(JSON.stringify(error), {
      status: StatusCodes.BAD_REQUEST,
    });
  } else {
    try {
      const addedStaff = await addStaff(payload);

      return new NextResponse<Staff>(JSON.stringify(addedStaff), {
        status: StatusCodes.CREATED,
      });
    } catch (e) {
      captureException(e);
      return new NextResponse(e, {
        status: StatusCodes.BAD_REQUEST,
      });
    }
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const paginatedStaffResult = await getStaffList(page, limit);
    return new NextResponse(JSON.stringify(paginatedStaffResult), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
