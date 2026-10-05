import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { enterMark } from './service';

/**
 * @swagger
 * /api/exam/mark-entry:
 *     post:
 *       summary: Add Marks to the Exam
 *       description: Add Marks to the Exam
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Marks added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your markEntry object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    // Enforce authenticated user's ID to prevent grader impersonation
    payload.userId = session.user.id;
    const createdMarkEntry = await enterMark(payload);
    return new NextResponse(JSON.stringify(createdMarkEntry), {
      status: StatusCodes.CREATED,
    });
  } catch (e: any) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
