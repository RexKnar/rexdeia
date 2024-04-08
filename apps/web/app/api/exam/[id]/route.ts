import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getExamById } from './service';

/**
 * @swagger
 * /api/exam/{id}:
 *     get:
 *       summary: Get exam by Id
 *       description: Get exam by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the exam.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: exam's details are fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your exam object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(request: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const examById = await getExamById(id);
    return new NextResponse(JSON.stringify(examById), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
