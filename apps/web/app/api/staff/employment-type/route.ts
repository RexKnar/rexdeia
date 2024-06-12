import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addEmploymentType, getAllEmploymentType } from './service';

/**
 * @swagger
 * /api/staff/employment-type:
 *     post:
 *       summary: Add new employmentType
 *       description: Add New employmentType
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: employmentType details added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your employmentType object here
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
    await addEmploymentType(payload);
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
 * /api/staff/employment-type:
 *     get:
 *       summary: Get All employmentType
 *       description: Get All employmentType
 *       responses:
 *         '200':
 *           description: employmentType details are s fetched Successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your employmentType object here
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
    const employmentTypeList = await getAllEmploymentType();

    return new NextResponse(JSON.stringify(employmentTypeList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
