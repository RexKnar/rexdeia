import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addPeriod, getAllPeriod } from './service';

/**
 * @swagger
 * /api/period:
 *     get:
 *       summary: Retrieve Period
 *       description: Gets a list of all Period .
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of Period .
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single  period here
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const periodList = await getAllPeriod();
    return new NextResponse(JSON.stringify(periodList), {
      status: StatusCodes.OK,
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
 *   /api/period:
 *     post:
 *       summary: Add a new peroid
 *       description: Creates a new peroid with the provided details.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of peroid.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single peroid here
 *         '401':
 *           description: Unauthorized access.
 *         '400':
 *           description: Bad request due to an error in processing the request.
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
    const createdPeriod = await addPeriod(payload);
    return new NextResponse(JSON.stringify(createdPeriod), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
