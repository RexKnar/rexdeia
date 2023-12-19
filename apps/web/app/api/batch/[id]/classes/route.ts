import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { getAllClassesByBatchId } from '../../../class/service';
import { addClassesToBatch } from '../service';

/**
 * @swagger
 * /api/batch/{id}/classes:
 *     post:
 *       summary: Add classes to batch
 *       description: Add classes to given batch
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the batch.
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
 *           description: classes are added to batch successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your class object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function POST(request: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const batch = await addClassesToBatch(id, payload['studentIds']);
    return new NextResponse(JSON.stringify(batch), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * @swagger
 * /api/batch/{id}/classes:
 *     get:
 *       summary: Get All classes by Batch Id
 *       description: Get All Classes by batchId
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the batch.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Fetched all classes for the given batch successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your class object here
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
    const batch = await getAllClassesByBatchId(id);
    return new NextResponse(JSON.stringify(batch), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
