import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { getUserDetailsById } from '../service';

/**
 * @swagger
 * /api/user/{id}:
 *     get:
 *       summary: Get user details
 *       description: Get the details of an user.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the user.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: user details fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your user object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(_: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    const user = await getUserDetailsById(id);

    if (user) {
      return new Response(JSON.stringify(user), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(JSON.stringify({ error: 'USER_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }
  } catch (e) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
