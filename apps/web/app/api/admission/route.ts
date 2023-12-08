import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { addAdmission, getAdmissionsList } from './service';

/**
 * @swagger
 * /api/admission:
 *   get:
 *     summary: Fetches All Admissions
 *     description: Returns All Admissions
 *     responses:
 *       200:
 *         description: Fetches all admissions for current branch and organisation
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get('pageSize')) || 10;

    const paginatedAdmissionResult = await getAdmissionsList(page, pageSize);
    return new NextResponse(JSON.stringify(paginatedAdmissionResult), {
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
 *  /api/admission:
 *    post:
 *       summary: Create a new admission
 *       description: Adds a new admission to the system.
 *       parameters:
 *         - name: formId
 *           in: query
 *           required: true
 *           description: The ID of the form.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 # Define the properties of your payload here
 *       responses:
 *         '201':
 *           description: Admission created successfully.
 *         '400':
 *           description: Bad request.
 *         '401':
 *           description: Unauthorized access.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();
  const formId = request.nextUrl.searchParams.get('formId');

  try {
    const admission = await addAdmission(payload, formId);
    return new NextResponse(JSON.stringify(admission), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
