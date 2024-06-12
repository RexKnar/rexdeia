import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addNatureOfPosting, getAllNatureOfPosting } from './service';

/**
 * @swagger
 * /api/staff/nature-of-posting:
 *     post:
 *       summary: Add new natureOfPosting
 *       description: Add New natureOfPosting
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: natureOfPosting details added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your natureOfPosting object here
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

  try {
    await addNatureOfPosting(payload);
    return new NextResponse(JSON.stringify({}), {
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
 * /api/staff/nature-of-posting:
 *     get:
 *       summary: Get All natureOfPosting
 *       description: Get All natureOfPosting
 *       responses:
 *         '200':
 *           description: natureOfPosting details are s fetched Successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your natureOfPosting object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const natureOfPostingList = await getAllNatureOfPosting();

    return new NextResponse(JSON.stringify(natureOfPostingList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
