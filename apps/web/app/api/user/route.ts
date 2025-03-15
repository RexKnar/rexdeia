import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getUserDetailsById, updateUserDetails } from './service';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const organizations = await getUserDetailsById(session.user.id);
    return new NextResponse(JSON.stringify(organizations), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @swagger
 * /api/user:
 *     put:
 *       summary: Update user details
 *       description: Update a user's name, email, and phone number based on session data.
 *       security:
 *         - sessionAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *       responses:
 *         '200':
 *           description: User updated successfully.
 *         '400':
 *           description: Bad request due to missing or invalid input.
 *         '401':
 *           description: Unauthorized access.
 *         '404':
 *           description: User not found.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();
    const { name, phoneNumber } = payload;
    if (!name && !phoneNumber) {
      return new NextResponse(JSON.stringify({ error: 'No valid fields' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }
    const updatedUser = await updateUserDetails(session.user, {
      name,
      phoneNumber,
    });
    return new NextResponse(
      JSON.stringify({ message: 'User updated successfully', updatedUser }),
      { status: StatusCodes.OK }
    );
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
