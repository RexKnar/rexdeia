import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addChapterItem } from './server';

/**
 * @swagger
 * /api/institute/course/{courseId}/module/{moduleId}/chapter/{chapterId}/chapter-item:
 *     post:
 *       summary: Add new chapter item to  module
 *       description: Add NewChapter item to Module
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: chapter item details added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Chapter item object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function POST(request: Request, { params: { chapterId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();

  try {
    const response = await addChapterItem(chapterId, payload);
    return new NextResponse(JSON.stringify(response), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
