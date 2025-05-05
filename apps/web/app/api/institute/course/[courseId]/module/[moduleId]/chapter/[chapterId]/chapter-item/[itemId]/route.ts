import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getChapterItemById, updateChapterItem } from './server';

/**
 * @swagger
 * /api/institute/course/{courseId}/module/{moduleId}/chapter/{chapterId}/chapter-item/{itemId}:
 *     get:
 *       summary: Get chapter item by its id
 *       description: Get chapter item by its id
 *       responses:
 *         '200':
 *           description: Chapter item details fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your chapter item object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */

export async function GET(request: Request, { params: { itemId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const courseById = await getChapterItemById(itemId);

    return new NextResponse(JSON.stringify(courseById), {
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
 * /api/institute/course/{courseId}/module/{moduleId}/chapter/{chapterId}/chapter-item/{itemId}:
 *     put:
 *       summary: get all chapter item  by itemId
 *       description:  get all chapter item  by itemId
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Chapter item fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Chapter item object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *       description:  get Chapter item by itemId
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Chapter item fetched successfully.
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

export async function PUT(request: Request, { params: { itemId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();

    const chapterItemUpdateResponse = await updateChapterItem(itemId, payload);

    return new NextResponse(JSON.stringify(chapterItemUpdateResponse), {
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
