import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addPeriodType, getAllPeriodType } from './service';

/**
 * @swagger
 * /api/periodType:
 *     get:
 *       summary: Retrieve Period Types
 *       description: Gets a list of all Period Types.
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of Period Types.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single  periodType here
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const periodTypeList = await getAllPeriodType();
    return new NextResponse(JSON.stringify(periodTypeList), {
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
 *   /api/periodType:
 *     post:
 *       summary: Add a new peroidType
 *       description: Creates a new peroidType with the provided details.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of peroidType.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single peroidType here
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
    const createdPeriodType = await addPeriodType(payload);
    return new NextResponse(JSON.stringify(createdPeriodType), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
