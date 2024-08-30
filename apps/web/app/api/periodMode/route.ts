import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addPeriodMode, getAllPeriodMode } from './service';

/**
 * @swagger
 * /api/periodMode:
 *     get:
 *       summary: Retrieve Period Mode
 *       description: Gets a list of all Period Mode.
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of Period Mode.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single  periodMode here
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const periodModeList = await getAllPeriodMode();
    return new NextResponse(JSON.stringify(periodModeList), {
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
 *   /api/periodMode:
 *     post:
 *       summary: Add a new peroidMode
 *       description: Creates a new peroidMode with the provided details.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of peroidMode.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single peroidMode here
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
    const createdPeriodMode = await addPeriodMode(payload);
    return new NextResponse(JSON.stringify(createdPeriodMode), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
